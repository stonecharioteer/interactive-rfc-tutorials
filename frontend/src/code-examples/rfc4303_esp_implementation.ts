export const rfc4303_esp_implementation = `"""
RFC 4303: ESP (Encapsulating Security Payload) Implementation Example

This example demonstrates the core ESP packet processing including
encryption, authentication, and anti-replay protection mechanisms.
"""

import struct
import hmac
import hashlib
import os
from typing import Optional, Tuple, Dict
from dataclasses import dataclass
from enum import Enum
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes, hmac as crypto_hmac
from cryptography.hazmat.backends import default_backend

class ESPMode(Enum):
    TRANSPORT = "transport"
    TUNNEL = "tunnel"

@dataclass
class ESPSecurityAssociation:
    """
    ESP Security Association parameters (simplified for education)
    """
    spi: int                      # Security Parameter Index
    encryption_key: bytes         # Encryption key
    auth_key: bytes              # Authentication key  
    encryption_algorithm: str     # e.g., "AES-256-CBC"
    auth_algorithm: str          # e.g., "HMAC-SHA256"
    mode: ESPMode                # Transport or Tunnel mode
    sequence_number: int         # Current sequence number
    replay_window: int           # Anti-replay window size

class AntiReplayWindow:
    """
    RFC 4303 Anti-Replay Window Implementation
    
    Maintains a sliding window to detect and prevent replay attacks
    using sequence numbers in ESP packets.
    """
    
    def __init__(self, window_size: int = 64):
        self.window_size = window_size
        self.highest_seq = 0
        self.received_packets = set()  # Set of received sequence numbers
        
    def check_and_update(self, sequence_number: int) -> bool:
        """
        Check if sequence number is valid and update window
        
        Returns True if packet should be accepted, False if replay
        """
        # Packet is way too old - definitely a replay
        if sequence_number <= (self.highest_seq - self.window_size):
            print(f"Packet rejected: sequence {sequence_number} too old (window: {self.highest_seq - self.window_size}-{self.highest_seq})")
            return False
        
        # Packet has already been received
        if sequence_number in self.received_packets:
            print(f"Packet rejected: sequence {sequence_number} already received (replay attack)")
            return False
        
        # Valid packet - update window
        if sequence_number > self.highest_seq:
            # Remove old entries outside the window
            old_entries = {seq for seq in self.received_packets if seq <= sequence_number - self.window_size}
            self.received_packets -= old_entries
            self.highest_seq = sequence_number
        
        self.received_packets.add(sequence_number)
        print(f"Packet accepted: sequence {sequence_number} (window: {max(0, self.highest_seq - self.window_size)}-{self.highest_seq})")
        return True

class ESPProcessor:
    """
    RFC 4303 ESP Packet Processor
    
    Handles ESP encapsulation and decapsulation with proper
    encryption, authentication, and anti-replay protection.
    """
    
    def __init__(self):
        self.replay_windows: Dict[int, AntiReplayWindow] = {}  # SPI -> Window
    
    def create_esp_packet(
        self, 
        payload: bytes, 
        sa: ESPSecurityAssociation,
        next_header: int = 6  # TCP
    ) -> bytes:
        """
        Create ESP packet with encryption and authentication
        
        This implements the ESP encapsulation process from RFC 4303
        """
        print(f"\\n=== Creating ESP Packet ===")
        print(f"Payload size: {len(payload)} bytes")
        print(f"SPI: {sa.spi:08x}")
        print(f"Sequence: {sa.sequence_number}")
        
        # Step 1: Build ESP header (SPI + Sequence Number)
        esp_header = struct.pack("!II", sa.spi, sa.sequence_number)
        
        # Step 2: Generate Initialization Vector (IV)
        if "CBC" in sa.encryption_algorithm:
            iv_size = 16  # AES block size
            iv = os.urandom(iv_size)
        elif "GCM" in sa.encryption_algorithm:
            iv_size = 12  # GCM nonce size
            iv = os.urandom(iv_size)
        else:
            iv_size = 0
            iv = b""
        
        # Step 3: Prepare payload for encryption
        # Add padding to align to cipher block boundary
        if "CBC" in sa.encryption_algorithm:
            block_size = 16  # AES block size
            pad_len = (block_size - ((len(payload) + 2) % block_size)) % block_size
        else:
            pad_len = 0  # Stream ciphers don't need padding
        
        padding = bytes(range(1, pad_len + 1)) if pad_len > 0 else b""
        esp_trailer = struct.pack("!BB", pad_len, next_header)
        
        plaintext = payload + padding + esp_trailer
        print(f"Plaintext size (with padding): {len(plaintext)} bytes")
        
        # Step 4: Encrypt the payload
        if "AES-256-CBC" in sa.encryption_algorithm:
            encrypted_payload = self._encrypt_aes_cbc(plaintext, sa.encryption_key, iv)
        elif "AES-256-GCM" in sa.encryption_algorithm:
            encrypted_payload, auth_tag = self._encrypt_aes_gcm(plaintext, sa.encryption_key, iv, esp_header)
        else:
            # Simplified encryption for educational purposes
            encrypted_payload = self._simple_encrypt(plaintext, sa.encryption_key)
            auth_tag = b""
        
        # Step 5: Calculate authentication (if separate from encryption)
        if "GCM" in sa.encryption_algorithm:
            # AEAD provides built-in authentication
            esp_packet = esp_header + iv + encrypted_payload + auth_tag
        else:
            # Separate authentication
            esp_packet_without_auth = esp_header + iv + encrypted_payload
            auth_data = self._calculate_authentication(esp_packet_without_auth, sa.auth_key, sa.auth_algorithm)
            esp_packet = esp_packet_without_auth + auth_data
        
        print(f"Final ESP packet size: {len(esp_packet)} bytes")
        print(f"Encryption overhead: {len(esp_packet) - len(payload)} bytes")
        
        # Increment sequence number for next packet
        sa.sequence_number += 1
        
        return esp_packet
    
    def process_esp_packet(
        self, 
        esp_packet: bytes, 
        sa: ESPSecurityAssociation
    ) -> Optional[bytes]:
        """
        Process received ESP packet (decrypt and authenticate)
        
        This implements the ESP decapsulation process from RFC 4303
        """
        print(f"\\n=== Processing ESP Packet ===")
        print(f"ESP packet size: {len(esp_packet)} bytes")
        
        if len(esp_packet) < 8:  # Minimum ESP header size
            print("Error: Packet too small for ESP header")
            return None
        
        # Step 1: Extract ESP header
        spi, sequence_number = struct.unpack("!II", esp_packet[:8])
        
        if spi != sa.spi:
            print(f"Error: SPI mismatch (expected {sa.spi:08x}, got {spi:08x})")
            return None
        
        print(f"SPI: {spi:08x}")
        print(f"Sequence: {sequence_number}")
        
        # Step 2: Anti-replay check
        if spi not in self.replay_windows:
            self.replay_windows[spi] = AntiReplayWindow()
        
        if not self.replay_windows[spi].check_and_update(sequence_number):
            return None  # Replay attack detected
        
        # Step 3: Extract IV and encrypted payload
        if "CBC" in sa.encryption_algorithm:
            iv_size = 16
        elif "GCM" in sa.encryption_algorithm:
            iv_size = 12
        else:
            iv_size = 0
        
        iv = esp_packet[8:8+iv_size] if iv_size > 0 else b""
        
        # Step 4: Verify authentication
        if "GCM" in sa.encryption_algorithm:
            # AEAD authentication is verified during decryption
            auth_tag_size = 16
            encrypted_payload = esp_packet[8+iv_size:-auth_tag_size]
            auth_tag = esp_packet[-auth_tag_size:]
            
            plaintext = self._decrypt_aes_gcm(
                encrypted_payload, sa.encryption_key, iv, esp_packet[:8], auth_tag
            )
        else:
            # Separate authentication verification
            auth_size = 12 if "SHA256" in sa.auth_algorithm else 16
            encrypted_payload = esp_packet[8+iv_size:-auth_size]
            received_auth = esp_packet[-auth_size:]
            
            # Verify authentication
            calculated_auth = self._calculate_authentication(
                esp_packet[:-auth_size], sa.auth_key, sa.auth_algorithm
            )
            
            if not hmac.compare_digest(received_auth, calculated_auth):
                print("Error: Authentication verification failed")
                return None
            
            # Step 5: Decrypt payload
            if "AES-256-CBC" in sa.encryption_algorithm:
                plaintext = self._decrypt_aes_cbc(encrypted_payload, sa.encryption_key, iv)
            else:
                plaintext = self._simple_decrypt(encrypted_payload, sa.encryption_key)
        
        if not plaintext:
            print("Error: Decryption failed")
            return None
        
        # Step 6: Remove padding and extract original payload
        if len(plaintext) < 2:
            print("Error: Decrypted data too small")
            return None
        
        pad_length = plaintext[-2]
        next_header = plaintext[-1]
        
        if pad_length >= len(plaintext) - 1:
            print(f"Error: Invalid pad length {pad_length}")
            return None
        
        original_payload = plaintext[:-(pad_length + 2)]
        
        print(f"Decryption successful!")
        print(f"Original payload size: {len(original_payload)} bytes")
        print(f"Next header: {next_header}")
        
        return original_payload
    
    def _encrypt_aes_cbc(self, plaintext: bytes, key: bytes, iv: bytes) -> bytes:
        """AES-256-CBC encryption"""
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        return encryptor.update(plaintext) + encryptor.finalize()
    
    def _decrypt_aes_cbc(self, ciphertext: bytes, key: bytes, iv: bytes) -> bytes:
        """AES-256-CBC decryption"""
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        return decryptor.update(ciphertext) + decryptor.finalize()
    
    def _encrypt_aes_gcm(self, plaintext: bytes, key: bytes, nonce: bytes, associated_data: bytes) -> Tuple[bytes, bytes]:
        """AES-256-GCM AEAD encryption"""
        cipher = Cipher(algorithms.AES(key), modes.GCM(nonce), backend=default_backend())
        encryptor = cipher.encryptor()
        encryptor.authenticate_additional_data(associated_data)
        ciphertext = encryptor.update(plaintext) + encryptor.finalize()
        return ciphertext, encryptor.tag
    
    def _decrypt_aes_gcm(self, ciphertext: bytes, key: bytes, nonce: bytes, associated_data: bytes, tag: bytes) -> Optional[bytes]:
        """AES-256-GCM AEAD decryption"""
        try:
            cipher = Cipher(algorithms.AES(key), modes.GCM(nonce, tag), backend=default_backend())
            decryptor = cipher.decryptor()
            decryptor.authenticate_additional_data(associated_data)
            return decryptor.update(ciphertext) + decryptor.finalize()
        except Exception as e:
            print(f"GCM decryption failed: {e}")
            return None
    
    def _calculate_authentication(self, data: bytes, key: bytes, algorithm: str) -> bytes:
        """Calculate HMAC authentication"""
        if "SHA256" in algorithm:
            h = crypto_hmac.HMAC(key, hashes.SHA256(), backend=default_backend())
            h.update(data)
            return h.finalize()[:12]  # Truncated to 96 bits
        else:
            return hmac.new(key, data, hashlib.sha1).digest()[:12]
    
    def _simple_encrypt(self, data: bytes, key: bytes) -> bytes:
        """Simplified encryption for educational purposes (NOT secure)"""
        return bytes(a ^ b for a, b in zip(data, (key * (len(data) // len(key) + 1))[:len(data)]))
    
    def _simple_decrypt(self, encrypted_data: bytes, key: bytes) -> bytes:
        """Simplified decryption (XOR is its own inverse)"""
        return self._simple_encrypt(encrypted_data, key)

# Example Usage: ESP Packet Processing Demonstration
def demonstrate_esp_processing():
    """
    Demonstrate RFC 4303 ESP packet creation and processing
    """
    print("RFC 4303: ESP (Encapsulating Security Payload) Demo")
    print("=" * 55)
    
    # Initialize ESP processor
    esp_processor = ESPProcessor()
    
    # Create Security Association for ESP
    sa = ESPSecurityAssociation(
        spi=0x12345678,
        encryption_key=os.urandom(32),  # 256-bit AES key
        auth_key=os.urandom(32),        # 256-bit HMAC key
        encryption_algorithm="AES-256-CBC",
        auth_algorithm="HMAC-SHA256",
        mode=ESPMode.TUNNEL,
        sequence_number=1,
        replay_window=64
    )
    
    # Original payload (e.g., IP packet or TCP segment)
    original_payload = b"GET /secure-data HTTP/1.1\\r\\nHost: internal.example.com\\r\\n\\r\\n"
    print(f"\\nOriginal payload ({len(original_payload)} bytes):")
    print(f"'{original_payload.decode()}'")
    
    # Create ESP packet (encryption + authentication)
    esp_packet = esp_processor.create_esp_packet(original_payload, sa, next_header=6)  # TCP
    
    print(f"\\nESP packet created successfully!")
    print(f"Packet hex: {esp_packet[:32].hex()}...{esp_packet[-16:].hex()}")
    
    # Process ESP packet (decryption + verification)
    decrypted_payload = esp_processor.process_esp_packet(esp_packet, sa)
    
    if decrypted_payload:
        print(f"\\nDecrypted payload ({len(decrypted_payload)} bytes):")
        print(f"'{decrypted_payload.decode()}'")
        
        if decrypted_payload == original_payload:
            print("✅ ESP processing successful - payloads match!")
        else:
            print("❌ ESP processing failed - payload mismatch")
    else:
        print("❌ ESP decryption failed")
    
    # Test anti-replay protection
    print("\\n=== Testing Anti-Replay Protection ===")
    
    # Try to replay the same packet
    print("\\nAttempting replay attack...")
    replayed_result = esp_processor.process_esp_packet(esp_packet, sa)
    
    if replayed_result is None:
        print("✅ Replay attack successfully blocked!")
    else:
        print("❌ Replay attack not detected - security vulnerability!")
    
    # Test with different algorithms
    print("\\n=== Testing AES-GCM (AEAD) ===")
    
    sa_gcm = ESPSecurityAssociation(
        spi=0x87654321,
        encryption_key=os.urandom(32),
        auth_key=b"",  # Not needed for AEAD
        encryption_algorithm="AES-256-GCM",
        auth_algorithm="AEAD",
        mode=ESPMode.TRANSPORT,
        sequence_number=1,
        replay_window=64
    )
    
    esp_packet_gcm = esp_processor.create_esp_packet(original_payload, sa_gcm)
    decrypted_gcm = esp_processor.process_esp_packet(esp_packet_gcm, sa_gcm)
    
    if decrypted_gcm == original_payload:
        print("✅ AES-GCM ESP processing successful!")
    else:
        print("❌ AES-GCM ESP processing failed")
    
    print("\\n=== ESP Demonstration Complete ===")
    print("Key ESP features demonstrated:")
    print("✅ Packet encryption and decryption") 
    print("✅ Authentication and integrity verification")
    print("✅ Anti-replay protection with sequence numbers")
    print("✅ Support for multiple cryptographic algorithms")
    print("✅ Proper padding and header management")

if __name__ == "__main__":
    demonstrate_esp_processing()
`;