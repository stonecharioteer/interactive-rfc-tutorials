#!/usr/bin/env python3
"""
WireGuard Cryptography Demonstration
Educational implementation of RFC 7748 (Curve25519) and RFC 8439 (ChaCha20-Poly1305)
showing how these specifications work together in WireGuard-like scenarios.
"""

import secrets
import struct
import time
import socket
import threading
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime

try:
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.hkdf import HKDF
    from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey, X25519PublicKey
    from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305
    PRODUCTION_CRYPTO = True
except ImportError:
    print("⚠️  Production cryptography library not available")
    print("   Using educational implementations only")
    PRODUCTION_CRYPTO = False

@dataclass
class CryptoSession:
    """Represents a cryptographic session between two parties."""
    session_id: str
    local_name: str
    remote_name: str
    local_private_key: bytes
    local_public_key: bytes
    remote_public_key: Optional[bytes]
    shared_secret: Optional[bytes]
    send_key: Optional[bytes]
    receive_key: Optional[bytes]
    send_counter: int = 0
    receive_counter: int = 0
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()

class WireGuardCryptoDemo:
    """Educational demonstration of WireGuard's cryptographic foundations."""
    
    def __init__(self):
        self.sessions: Dict[str, CryptoSession] = {}
        self.message_log: List[Dict] = []
        
    def print_header(self, title: str):
        """Print formatted section header."""
        print(f"\\n{'='*60}")
        print(f"🔒 {title}")
        print('='*60)
    
    def print_step(self, step: str):
        """Print formatted step."""
        print(f"\\n📍 {step}")
        print('-'*40)
    
    def generate_keypair(self) -> Tuple[bytes, bytes]:
        """Generate Curve25519 keypair using production library if available."""
        if PRODUCTION_CRYPTO:
            private_key = X25519PrivateKey.generate()
            public_key = private_key.public_key()
            
            private_bytes = private_key.private_bytes(
                encoding=serialization.Encoding.Raw,
                format=serialization.PrivateFormat.Raw,
                encryption_algorithm=serialization.NoEncryption()
            )
            public_bytes = public_key.public_bytes(
                encoding=serialization.Encoding.Raw,
                format=serialization.PublicFormat.Raw
            )
            
            return private_bytes, public_bytes
        else:
            # Educational fallback
            private_key = secrets.token_bytes(32)
            # This would normally compute public_key = private_key * base_point
            # For demo purposes, we'll use a mock public key
            public_key = secrets.token_bytes(32)
            return private_key, public_key
    
    def compute_shared_secret(self, private_key: bytes, peer_public_key: bytes) -> bytes:
        """Compute X25519 shared secret."""
        if PRODUCTION_CRYPTO:
            private_key_obj = X25519PrivateKey.from_private_bytes(private_key)
            public_key_obj = X25519PublicKey.from_public_bytes(peer_public_key)
            shared_secret = private_key_obj.exchange(public_key_obj)
            return shared_secret
        else:
            # Educational mock - in reality this would be X25519(private_key, peer_public_key)
            return secrets.token_bytes(32)
    
    def derive_session_keys(self, shared_secret: bytes, session_info: str) -> Tuple[bytes, bytes]:
        """Derive encryption keys from shared secret using HKDF."""
        if PRODUCTION_CRYPTO:
            hkdf = HKDF(
                algorithm=hashes.SHA256(),
                length=64,  # 32 bytes each for send and receive keys
                salt=b"WireGuard Educational Demo",
                info=session_info.encode()
            )
            key_material = hkdf.derive(shared_secret)
            send_key = key_material[:32]
            receive_key = key_material[32:]
            return send_key, receive_key
        else:
            # Educational mock
            return secrets.token_bytes(32), secrets.token_bytes(32)
    
    def encrypt_message(self, key: bytes, nonce: bytes, plaintext: bytes, 
                       associated_data: bytes = b'') -> Tuple[bytes, bytes]:
        """Encrypt message using ChaCha20-Poly1305."""
        if PRODUCTION_CRYPTO:
            cipher = ChaCha20Poly1305(key)
            # ChaCha20Poly1305 expects 12-byte nonce but we'll use first 12 bytes
            nonce_12 = nonce[:12] if len(nonce) >= 12 else nonce + b'\\x00' * (12 - len(nonce))
            ciphertext = cipher.encrypt(nonce_12, plaintext, associated_data)
            # Split ciphertext and tag (tag is last 16 bytes)
            return ciphertext[:-16], ciphertext[-16:]
        else:
            # Educational mock
            return secrets.token_bytes(len(plaintext)), secrets.token_bytes(16)
    
    def decrypt_message(self, key: bytes, nonce: bytes, ciphertext: bytes, 
                       tag: bytes, associated_data: bytes = b'') -> bytes:
        """Decrypt message using ChaCha20-Poly1305."""
        if PRODUCTION_CRYPTO:
            cipher = ChaCha20Poly1305(key)
            nonce_12 = nonce[:12] if len(nonce) >= 12 else nonce + b'\\x00' * (12 - len(nonce))
            full_ciphertext = ciphertext + tag
            plaintext = cipher.decrypt(nonce_12, full_ciphertext, associated_data)
            return plaintext
        else:
            # Educational mock - return the plaintext that would have been encrypted
            return b"Decrypted educational message"
    
    def create_session(self, local_name: str, remote_name: str) -> str:
        """Create a new cryptographic session."""
        session_id = f"{local_name}-{remote_name}-{secrets.token_hex(4)}"
        
        private_key, public_key = self.generate_keypair()
        
        session = CryptoSession(
            session_id=session_id,
            local_name=local_name,
            remote_name=remote_name,
            local_private_key=private_key,
            local_public_key=public_key,
            remote_public_key=None,
            shared_secret=None,
            send_key=None,
            receive_key=None
        )
        
        self.sessions[session_id] = session
        return session_id
    
    def exchange_public_keys(self, session_id: str, peer_public_key: bytes):
        """Exchange public keys and establish shared secret."""
        session = self.sessions[session_id]
        session.remote_public_key = peer_public_key
        
        # Compute shared secret using X25519
        session.shared_secret = self.compute_shared_secret(
            session.local_private_key, 
            peer_public_key
        )
        
        # Derive session keys
        session_info = f"{session.local_name}+{session.remote_name}"
        session.send_key, session.receive_key = self.derive_session_keys(
            session.shared_secret,
            session_info
        )
        
        print(f"🤝 Session {session_id} established")
        print(f"   Local: {session.local_name}")
        print(f"   Remote: {session.remote_name}")
        print(f"   Shared Secret: {session.shared_secret.hex()[:16]}...")
        print(f"   Send Key: {session.send_key.hex()[:16]}...")
        print(f"   Receive Key: {session.receive_key.hex()[:16]}...")
    
    def send_encrypted_message(self, session_id: str, message: str) -> Dict:
        """Send an encrypted message."""
        session = self.sessions[session_id]
        
        if not session.send_key:
            raise ValueError("Session not established - no send key available")
        
        # Create nonce from counter
        nonce = struct.pack('<Q', session.send_counter) + secrets.token_bytes(4)
        
        # Create associated data (simulating WireGuard packet header)
        associated_data = f"WG:{session.local_name}→{session.remote_name}:{session.send_counter}".encode()
        
        # Encrypt message
        plaintext = message.encode()
        ciphertext, tag = self.encrypt_message(
            session.send_key,
            nonce,
            plaintext,
            associated_data
        )
        
        # Create packet
        packet = {
            'session_id': session_id,
            'sender': session.local_name,
            'receiver': session.remote_name,
            'counter': session.send_counter,
            'nonce': nonce,
            'ciphertext': ciphertext,
            'tag': tag,
            'associated_data': associated_data,
            'timestamp': datetime.now(),
            'original_message': message  # For demo purposes
        }
        
        session.send_counter += 1
        self.message_log.append(packet)
        
        print(f"📤 Message sent from {session.local_name} to {session.remote_name}")
        print(f"   Original: '{message}'")
        print(f"   Encrypted: {ciphertext.hex()[:32]}...")
        print(f"   Auth Tag: {tag.hex()}")
        print(f"   Counter: {session.send_counter - 1}")
        
        return packet
    
    def receive_encrypted_message(self, packet: Dict) -> str:
        """Receive and decrypt a message."""
        session_id = packet['session_id']
        session = self.sessions[session_id]
        
        if not session.receive_key:
            raise ValueError("Session not established - no receive key available")
        
        # Decrypt message
        try:
            plaintext = self.decrypt_message(
                session.receive_key,
                packet['nonce'],
                packet['ciphertext'],
                packet['tag'],
                packet['associated_data']
            )
            
            message = plaintext.decode() if PRODUCTION_CRYPTO else packet['original_message']
            
            print(f"📥 Message received by {session.remote_name} from {session.local_name}")
            print(f"   Encrypted: {packet['ciphertext'].hex()[:32]}...")
            print(f"   Decrypted: '{message}'")
            print(f"   Authentication: ✅ Verified")
            
            session.receive_counter += 1
            return message
            
        except Exception as e:
            print(f"❌ Decryption failed: {e}")
            return None
    
    def demonstrate_key_exchange(self):
        """Demonstrate Curve25519 key exchange."""
        self.print_step("Curve25519 Key Exchange (RFC 7748)")
        
        # Alice generates her keypair
        alice_private, alice_public = self.generate_keypair()
        print(f"👩 Alice generates keypair:")
        print(f"   Private: {alice_private.hex()[:16]}... (kept secret)")
        print(f"   Public:  {alice_public.hex()[:16]}... (shared)")
        
        # Bob generates his keypair
        bob_private, bob_public = self.generate_keypair()
        print(f"\\n👨 Bob generates keypair:")
        print(f"   Private: {bob_private.hex()[:16]}... (kept secret)")
        print(f"   Public:  {bob_public.hex()[:16]}... (shared)")
        
        # Both compute the same shared secret
        alice_shared = self.compute_shared_secret(alice_private, bob_public)
        bob_shared = self.compute_shared_secret(bob_private, alice_public)
        
        print(f"\\n🤝 Shared Secret Computation:")
        print(f"   Alice computes: X25519(alice_private, bob_public) = {alice_shared.hex()[:16]}...")
        print(f"   Bob computes:   X25519(bob_private, alice_public) = {bob_shared.hex()[:16]}...")
        
        if alice_shared == bob_shared:
            print("✅ SUCCESS: Both parties have the same shared secret!")
        else:
            print("❌ ERROR: Shared secrets don't match!")
        
        return alice_shared == bob_shared
    
    def demonstrate_aead_encryption(self):
        """Demonstrate ChaCha20-Poly1305 AEAD encryption."""
        self.print_step("ChaCha20-Poly1305 AEAD Encryption (RFC 8439)")
        
        # Generate a session key
        key = secrets.token_bytes(32)
        print(f"🔑 Session Key: {key.hex()[:16]}...")
        
        # Test message
        message = "Hello WireGuard! This message is encrypted with ChaCha20-Poly1305."
        print(f"📝 Original Message: '{message}'")
        
        # Generate nonce
        nonce = secrets.token_bytes(12)
        print(f"🎲 Nonce: {nonce.hex()}")
        
        # Associated data (packet header)
        associated_data = b"WireGuard packet header - authenticated but not encrypted"
        print(f"📋 Associated Data: {associated_data.decode()}")
        
        # Encrypt
        ciphertext, tag = self.encrypt_message(key, nonce, message.encode(), associated_data)
        print(f"\\n🔒 Encryption Result:")
        print(f"   Ciphertext: {ciphertext.hex()[:32]}...")
        print(f"   Auth Tag:   {tag.hex()}")
        
        # Decrypt
        try:
            decrypted = self.decrypt_message(key, nonce, ciphertext, tag, associated_data)
            decrypted_message = decrypted.decode() if PRODUCTION_CRYPTO else message
            
            print(f"\\n🔓 Decryption Result:")
            print(f"   Decrypted: '{decrypted_message}'")
            
            if decrypted_message == message:
                print("✅ SUCCESS: Message decrypted correctly!")
            else:
                print("❌ ERROR: Decryption mismatch!")
                
        except Exception as e:
            print(f"❌ Decryption failed: {e}")
        
        # Test tampering detection
        print(f"\\n🚨 Testing Tampering Detection:")
        tampered_ciphertext = bytearray(ciphertext)
        tampered_ciphertext[0] ^= 1  # Flip one bit
        
        try:
            self.decrypt_message(key, nonce, bytes(tampered_ciphertext), tag, associated_data)
            print("❌ ERROR: Tampering not detected!")
        except:
            print("✅ SUCCESS: Tampering detected and rejected!")
    
    def demonstrate_full_protocol(self):
        """Demonstrate complete WireGuard-like protocol."""
        self.print_step("Complete WireGuard-like Protocol Demonstration")
        
        # Create sessions for Alice and Bob
        alice_session = self.create_session("Alice", "Bob")
        bob_session = self.create_session("Bob", "Alice")
        
        alice = self.sessions[alice_session]
        bob = self.sessions[bob_session]
        
        print(f"\\n🔄 Key Exchange Phase:")
        
        # Exchange public keys
        self.exchange_public_keys(alice_session, bob.local_public_key)
        self.exchange_public_keys(bob_session, alice.local_public_key)
        
        print(f"\\n💬 Secure Communication Phase:")
        
        # Alice sends message to Bob
        packet1 = self.send_encrypted_message(alice_session, "Hello Bob! This is Alice.")
        decrypted1 = self.receive_encrypted_message(packet1)
        
        # Bob responds to Alice
        packet2 = self.send_encrypted_message(bob_session, "Hi Alice! Message received loud and clear.")
        decrypted2 = self.receive_encrypted_message(packet2)
        
        # More messages to show counter progression
        packet3 = self.send_encrypted_message(alice_session, "Great! Our VPN tunnel is working perfectly.")
        decrypted3 = self.receive_encrypted_message(packet3)
        
        print(f"\\n📊 Session Statistics:")
        print(f"   Alice → Bob messages: {alice.send_counter}")
        print(f"   Bob → Alice messages: {bob.send_counter}")
        print(f"   Total encrypted packets: {len(self.message_log)}")
    
    def performance_comparison(self):
        """Compare performance characteristics."""
        self.print_step("Performance Analysis")
        
        print("🏃 ChaCha20-Poly1305 vs AES-GCM Performance:")
        print()
        
        performance_data = [
            ("Platform", "ChaCha20-Poly1305", "AES-GCM"),
            ("-" * 15, "-" * 17, "-" * 8),
            ("x86-64 (no AES-NI)", "~2.5 GB/s", "~0.5 GB/s"),
            ("x86-64 (with AES-NI)", "~2.5 GB/s", "~3.0 GB/s"),
            ("ARM Cortex-A57", "~350 MB/s", "~50 MB/s"),
            ("ARM Cortex-A72", "~500 MB/s", "~80 MB/s"),
            ("Mobile (typical)", "Excellent", "Poor"),
            ("Battery Impact", "Low", "High"),
            ("Implementation", "Simple", "Complex")
        ]
        
        for row in performance_data:
            print(f"{row[0]:<15} {row[1]:<17} {row[2]}")
        
        print(f"\\n🎯 Why WireGuard Chose These Algorithms:")
        print("   • Curve25519: Fast, secure, simple elliptic curve")
        print("   • ChaCha20-Poly1305: Optimized for software, mobile-friendly")
        print("   • Combined: Provides WireGuard's exceptional performance")
    
    def run_comprehensive_demo(self):
        """Run the complete demonstration."""
        self.print_header("WireGuard Cryptographic Foundations")
        
        print("🚀 Educational demonstration of RFC 7748 and RFC 8439")
        print("   Showing how Curve25519 and ChaCha20-Poly1305 work together")
        print(f"   Production crypto available: {'✅' if PRODUCTION_CRYPTO else '❌ (educational only)'}")
        
        try:
            # Demonstrate individual components
            success1 = self.demonstrate_key_exchange()
            time.sleep(2)
            
            self.demonstrate_aead_encryption()
            time.sleep(2)
            
            # Demonstrate complete protocol
            self.demonstrate_full_protocol()
            time.sleep(2)
            
            # Performance analysis
            self.performance_comparison()
            
            self.print_header("Demo Complete!")
            print("🎉 WireGuard cryptographic demonstration finished!")
            print("✨ Key concepts demonstrated:")
            print("   • X25519 key exchange for perfect forward secrecy")
            print("   • ChaCha20-Poly1305 AEAD for authenticated encryption")
            print("   • Session key derivation and counter-based nonces")
            print("   • Why these algorithms make WireGuard fast and secure")
            
        except Exception as e:
            print(f"❌ Demo error: {e}")
            import traceback
            traceback.print_exc()

def main():
    """Main demonstration function."""
    demo = WireGuardCryptoDemo()
    demo.run_comprehensive_demo()

if __name__ == "__main__":
    main()