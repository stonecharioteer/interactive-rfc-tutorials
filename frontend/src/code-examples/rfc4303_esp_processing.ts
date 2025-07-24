export const rfc4303_esp_processing = `"""
RFC 4303: ESP Processing Example

This example demonstrates detailed ESP packet processing including
encryption, authentication, and the complete ESP workflow.
"""

import struct
import os
import time
from typing import Optional, Tuple
from dataclasses import dataclass
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes, hmac
from cryptography.hazmat.backends import default_backend

@dataclass
class ESPPacket:
    """Parsed ESP packet structure"""
    spi: int
    sequence_number: int
    iv: bytes
    encrypted_payload: bytes
    auth_tag: bytes
    
    @property
    def total_size(self) -> int:
        return 8 + len(self.iv) + len(self.encrypted_payload) + len(self.auth_tag)

class ESPPacketProcessor:
    """
    Comprehensive ESP packet processing implementation
    
    Demonstrates the complete ESP workflow as defined in RFC 4303
    """
    
    def __init__(self):
        self.replay_windows = {}  # SPI -> set of received sequence numbers
        
    def create_esp_packet(
        self,
        spi: int,
        sequence_num: int,
        payload: bytes,
        encryption_key: bytes,
        auth_key: bytes,
        next_header: int = 6  # TCP
    ) -> bytes:
        """
        Create complete ESP packet with all RFC 4303 fields
        """
        print(f"\\n=== Creating ESP Packet ===")
        print(f"SPI: {spi:08x}")
        print(f"Sequence: {sequence_num}")
        print(f"Payload size: {len(payload)} bytes")
        
        # Step 1: Build ESP header (8 bytes)
        esp_header = struct.pack("!II", spi, sequence_num)
        
        # Step 2: Generate random IV (16 bytes for AES-CBC)
        iv = os.urandom(16)
        
        # Step 3: Add padding for block cipher alignment
        block_size = 16  # AES block size
        pad_len = (block_size - ((len(payload) + 2) % block_size)) % block_size
        
        # Padding bytes should be consecutive integers starting from 1
        padding = bytes(range(1, pad_len + 1)) if pad_len > 0 else b""
        
        # ESP trailer: pad length (1 byte) + next header (1 byte)
        esp_trailer = struct.pack("!BB", pad_len, next_header)
        
        # Complete plaintext = payload + padding + trailer
        plaintext = payload + padding + esp_trailer
        
        print(f"Padding length: {pad_len} bytes")
        print(f"Plaintext size: {len(plaintext)} bytes")
        
        # Step 4: Encrypt the plaintext
        cipher = Cipher(algorithms.AES(encryption_key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        encrypted_payload = encryptor.update(plaintext) + encryptor.finalize()
        
        # Step 5: Calculate authentication over ESP header + IV + encrypted payload
        auth_data = esp_header + iv + encrypted_payload
        h = hmac.HMAC(auth_key, hashes.SHA256(), backend=default_backend())
        h.update(auth_data)
        auth_tag = h.finalize()[:12]  # Truncate to 96 bits
        
        # Step 6: Assemble complete ESP packet
        esp_packet = esp_header + iv + encrypted_payload + auth_tag
        
        print(f"Final ESP packet size: {len(esp_packet)} bytes")
        print(f"Encryption overhead: {len(esp_packet) - len(payload)} bytes")
        
        return esp_packet
    
    def parse_esp_packet(self, esp_packet: bytes) -> Optional[ESPPacket]:
        """
        Parse ESP packet into its components
        """
        if len(esp_packet) < 28:  # Minimum: 8 (header) + 16 (IV) + 12 (auth) = 36
            print("❌ Packet too small for ESP")
            return None
        
        # Parse ESP header
        spi, seq_num = struct.unpack("!II", esp_packet[:8])
        
        # Extract IV (assuming AES-CBC with 16-byte IV)
        iv = esp_packet[8:24]
        
        # Extract encrypted payload and auth tag
        # Auth tag is last 12 bytes
        encrypted_payload = esp_packet[24:-12]
        auth_tag = esp_packet[-12:]
        
        return ESPPacket(
            spi=spi,
            sequence_number=seq_num,
            iv=iv,
            encrypted_payload=encrypted_payload,
            auth_tag=auth_tag
        )
    
    def verify_esp_packet(
        self,
        esp_packet: bytes,
        auth_key: bytes,
        spi: int
    ) -> bool:
        """
        Verify ESP packet authentication and anti-replay
        """
        parsed = self.parse_esp_packet(esp_packet)
        if not parsed:
            return False
        
        print(f"\\n=== Verifying ESP Packet ===")
        print(f"SPI: {parsed.spi:08x}")
        print(f"Sequence: {parsed.sequence_number}")
        
        # Step 1: Verify SPI matches
        if parsed.spi != spi:
            print(f"❌ SPI mismatch: expected {spi:08x}, got {parsed.spi:08x}")
            return False
        
        # Step 2: Anti-replay check
        if not self._check_replay_protection(parsed.spi, parsed.sequence_number):
            print("❌ Replay attack detected")
            return False
        
        # Step 3: Verify authentication
        auth_data = esp_packet[:-12]  # Everything except auth tag
        h = hmac.HMAC(auth_key, hashes.SHA256(), backend=default_backend())
        h.update(auth_data)
        expected_tag = h.finalize()[:12]
        
        if expected_tag != parsed.auth_tag:
            print("❌ Authentication verification failed")
            return False
        
        print("✅ ESP packet verification successful")
        return True
    
    def decrypt_esp_payload(
        self,
        esp_packet: bytes,
        encryption_key: bytes,
        auth_key: bytes,
        spi: int
    ) -> Optional[bytes]:
        """
        Decrypt ESP packet and extract original payload
        """
        # First verify the packet
        if not self.verify_esp_packet(esp_packet, auth_key, spi):
            return None
        
        parsed = self.parse_esp_packet(esp_packet)
        if not parsed:
            return None
        
        print(f"\\n=== Decrypting ESP Payload ===")
        
        # Decrypt the payload
        cipher = Cipher(algorithms.AES(encryption_key), modes.CBC(parsed.iv), backend=default_backend())
        decryptor = cipher.decryptor()
        
        try:
            plaintext = decryptor.update(parsed.encrypted_payload) + decryptor.finalize()
        except Exception as e:
            print(f"❌ Decryption failed: {e}")
            return None
        
        # Extract padding and next header info
        if len(plaintext) < 2:
            print("❌ Plaintext too short")
            return None
        
        pad_length = plaintext[-2]
        next_header = plaintext[-1]
        
        if pad_length >= len(plaintext) - 1:
            print(f"❌ Invalid pad length: {pad_length}")
            return None
        
        # Remove padding and trailer to get original payload
        original_payload = plaintext[:-(pad_length + 2)]
        
        print(f"Original payload size: {len(original_payload)} bytes")
        print(f"Next header: {next_header} ({'TCP' if next_header == 6 else 'UDP' if next_header == 17 else 'Other'})")
        
        # Verify padding pattern (consecutive integers starting from 1)
        if pad_length > 0:
            padding = plaintext[len(original_payload):-2]
            expected_padding = bytes(range(1, pad_length + 1))
            if padding != expected_padding:
                print("⚠️  Warning: Non-standard padding pattern detected")
        
        return original_payload
    
    def _check_replay_protection(self, spi: int, sequence_number: int) -> bool:
        """
        Implement anti-replay protection using sliding window
        """
        window_size = 64  # RFC 4303 recommends minimum 32, we use 64
        
        if spi not in self.replay_windows:
            self.replay_windows[spi] = set()
        
        received_sequences = self.replay_windows[spi]
        
        # Get highest sequence number seen so far
        highest_seq = max(received_sequences) if received_sequences else 0
        
        # Check if packet is too old (outside window)
        if sequence_number <= (highest_seq - window_size):
            print(f"Sequence {sequence_number} too old (window: {highest_seq - window_size + 1}-{highest_seq})")
            return False
        
        # Check if we've already seen this sequence number
        if sequence_number in received_sequences:
            print(f"Sequence {sequence_number} already received (replay)")
            return False
        
        # Update window
        received_sequences.add(sequence_number)
        
        # Clean up old entries outside window
        if sequence_number > highest_seq:
            cutoff = sequence_number - window_size
            received_sequences = {seq for seq in received_sequences if seq > cutoff}
            self.replay_windows[spi] = received_sequences
        
        print(f"Sequence {sequence_number} accepted (window size: {len(received_sequences)})")
        return True
    
    def demonstrate_esp_lifecycle(self):
        """
        Demonstrate complete ESP packet lifecycle
        """
        print("RFC 4303: ESP Packet Processing Demonstration")
        print("=" * 50)
        
        # Setup keys (in real implementation, these come from key exchange)
        encryption_key = os.urandom(32)  # 256-bit AES key
        auth_key = os.urandom(32)        # 256-bit HMAC key
        spi = 0x12345678
        
        # Original data to protect
        original_data = b"This is confidential data that needs ESP protection!"
        print(f"\\nOriginal data: {original_data.decode()}")
        
        # Test sequence: create and process multiple packets
        for seq_num in [1, 2, 3, 5, 4]:  # Note: 4 comes after 5 to test ordering
            print(f"\\n{'='*60}")
            print(f"Processing sequence number: {seq_num}")
            print(f"{'='*60}")
            
            # Create ESP packet
            esp_packet = self.create_esp_packet(
                spi=spi,
                sequence_num=seq_num,
                payload=original_data,
                encryption_key=encryption_key,
                auth_key=auth_key
            )
            
            # Decrypt and verify
            decrypted = self.decrypt_esp_payload(
                esp_packet=esp_packet,
                encryption_key=encryption_key,
                auth_key=auth_key,
                spi=spi
            )
            
            if decrypted:
                if decrypted == original_data:
                    print("✅ ESP processing successful - data integrity verified")
                else:
                    print("❌ ESP processing failed - data corruption detected")
            else:
                print("❌ ESP decryption failed")
        
        # Test replay attack
        print(f"\\n{'='*60}")
        print("Testing replay attack protection")
        print(f"{'='*60}")
        
        # Try to replay sequence number 2
        replay_packet = self.create_esp_packet(
            spi=spi,
            sequence_num=2,  # Already used
            payload=b"Replay attack attempt",
            encryption_key=encryption_key,
            auth_key=auth_key
        )
        
        replay_result = self.decrypt_esp_payload(
            esp_packet=replay_packet,
            encryption_key=encryption_key,
            auth_key=auth_key,
            spi=spi
        )
        
        if replay_result is None:
            print("✅ Replay attack successfully blocked")
        else:
            print("❌ Replay attack not detected - security vulnerability!")

# Example usage
if __name__ == "__main__":
    processor = ESPPacketProcessor()
    processor.demonstrate_esp_lifecycle()
`;