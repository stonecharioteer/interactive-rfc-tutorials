export const rfc4301_security_association = `"""
RFC 4301: Security Association (SA) Management Example

This example demonstrates how IPsec Security Associations are created,
managed, and utilized for secure communication between network endpoints.
"""

import hashlib
import struct
import time
from typing import Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

class IPsecMode(Enum):
    TRANSPORT = "transport"
    TUNNEL = "tunnel"

class SecurityProtocol(Enum):
    ESP = 50  # Encapsulating Security Payload
    AH = 51   # Authentication Header

@dataclass
class SecurityAssociation:
    """
    RFC 4301 Security Association (SA) definition
    
    Each SA is uniquely identified by:
    - Security Parameter Index (SPI)
    - Destination IP address  
    - Security protocol (ESP or AH)
    """
    spi: int                    # Security Parameter Index
    destination_ip: str         # Destination IP address
    protocol: SecurityProtocol  # ESP or AH
    mode: IPsecMode            # Transport or Tunnel
    encryption_algorithm: str   # e.g., "AES-256-CBC"
    auth_algorithm: str        # e.g., "HMAC-SHA256"  
    encryption_key: bytes      # Encryption key
    auth_key: bytes           # Authentication key
    sequence_number: int      # For anti-replay protection
    lifetime_seconds: int     # SA lifetime
    created_time: float       # Creation timestamp

class SecurityAssociationDatabase:
    """
    RFC 4301 Security Association Database (SAD)
    
    The SAD contains parameters associated with each active SA.
    It's consulted during IPsec processing to determine how to
    process inbound and outbound packets.
    """
    
    def __init__(self):
        self.inbound_sas: Dict[Tuple[int, str, SecurityProtocol], SecurityAssociation] = {}
        self.outbound_sas: Dict[Tuple[str, int], SecurityAssociation] = {}
    
    def add_inbound_sa(self, sa: SecurityAssociation) -> None:
        """Add an inbound Security Association"""
        key = (sa.spi, sa.destination_ip, sa.protocol)
        self.inbound_sas[key] = sa
        print(f"Added inbound SA: SPI={sa.spi:08x}, dst={sa.destination_ip}, proto={sa.protocol.name}")
    
    def add_outbound_sa(self, sa: SecurityAssociation, selector: str) -> None:
        """Add an outbound Security Association with traffic selector"""
        key = (selector, sa.spi)
        self.outbound_sas[key] = sa
        print(f"Added outbound SA: selector={selector}, SPI={sa.spi:08x}")
    
    def lookup_inbound_sa(self, spi: int, dst_ip: str, protocol: SecurityProtocol) -> Optional[SecurityAssociation]:
        """Lookup inbound SA for packet processing"""
        key = (spi, dst_ip, protocol)
        sa = self.inbound_sas.get(key)
        
        if sa and self._is_sa_valid(sa):
            return sa
        elif sa:
            print(f"SA expired: SPI={spi:08x}")
            del self.inbound_sas[key]
        
        return None
    
    def lookup_outbound_sa(self, selector: str) -> Optional[SecurityAssociation]:
        """Lookup outbound SA based on traffic selector"""
        for (sel, spi), sa in self.outbound_sas.items():
            if sel == selector and self._is_sa_valid(sa):
                return sa
        return None
    
    def _is_sa_valid(self, sa: SecurityAssociation) -> bool:
        """Check if SA is still valid (not expired)"""
        current_time = time.time()
        return (current_time - sa.created_time) < sa.lifetime_seconds

class IPsecProcessor:
    """
    RFC 4301 IPsec Processing Engine
    
    Implements the core IPsec processing logic for applying
    security policies and managing security associations.
    """
    
    def __init__(self):
        self.sad = SecurityAssociationDatabase()
    
    def create_security_association(
        self, 
        peer_ip: str,
        mode: IPsecMode = IPsecMode.TUNNEL,
        protocol: SecurityProtocol = SecurityProtocol.ESP
    ) -> SecurityAssociation:
        """
        Create a new Security Association with RFC 4301 parameters
        """
        spi = self._generate_spi()
        
        # Generate cryptographic keys (simplified for educational purposes)
        encryption_key = self._generate_key(32)  # 256-bit key
        auth_key = self._generate_key(32)        # 256-bit auth key
        
        sa = SecurityAssociation(
            spi=spi,
            destination_ip=peer_ip,
            protocol=protocol,
            mode=mode,
            encryption_algorithm="AES-256-CBC",
            auth_algorithm="HMAC-SHA256",
            encryption_key=encryption_key,
            auth_key=auth_key,
            sequence_number=1,
            lifetime_seconds=3600,  # 1 hour
            created_time=time.time()
        )
        
        print(f"Created SA: {peer_ip} -> SPI={spi:08x}, Mode={mode.value}, Protocol={protocol.name}")
        return sa
    
    def establish_ipsec_tunnel(self, local_ip: str, peer_ip: str) -> Tuple[SecurityAssociation, SecurityAssociation]:
        """
        Establish bidirectional IPsec tunnel (inbound and outbound SAs)
        """
        print(f"\\n=== Establishing IPsec Tunnel: {local_ip} <-> {peer_ip} ===")
        
        # Create outbound SA (local -> peer)
        outbound_sa = self.create_security_association(peer_ip, IPsecMode.TUNNEL)
        self.sad.add_outbound_sa(outbound_sa, f"{local_ip}->{peer_ip}")
        
        # Create inbound SA (peer -> local)  
        inbound_sa = self.create_security_association(local_ip, IPsecMode.TUNNEL)
        self.sad.add_inbound_sa(inbound_sa)
        
        print(f"IPsec tunnel established successfully!")
        print(f"Outbound SPI: {outbound_sa.spi:08x}")
        print(f"Inbound SPI:  {inbound_sa.spi:08x}")
        
        return outbound_sa, inbound_sa
    
    def process_outbound_packet(self, src_ip: str, dst_ip: str, payload: bytes) -> Optional[bytes]:
        """
        Process outbound packet according to IPsec policy
        """
        selector = f"{src_ip}->{dst_ip}"
        sa = self.sad.lookup_outbound_sa(selector)
        
        if not sa:
            print(f"No outbound SA found for {selector}")
            return None
        
        print(f"Processing outbound packet with SA SPI={sa.spi:08x}")
        
        # Apply IPsec protection (simplified)
        if sa.protocol == SecurityProtocol.ESP:
            return self._apply_esp_protection(payload, sa)
        else:
            return self._apply_ah_protection(payload, sa)
    
    def process_inbound_packet(self, spi: int, dst_ip: str, encrypted_payload: bytes) -> Optional[bytes]:
        """
        Process inbound IPsec packet
        """
        sa = self.sad.lookup_inbound_sa(spi, dst_ip, SecurityProtocol.ESP)
        
        if not sa:
            print(f"No inbound SA found for SPI={spi:08x}, dst={dst_ip}")
            return None
        
        print(f"Processing inbound packet with SA SPI={spi:08x}")
        
        # Remove IPsec protection (simplified)
        if sa.protocol == SecurityProtocol.ESP:
            return self._remove_esp_protection(encrypted_payload, sa)
        else:
            return self._remove_ah_protection(encrypted_payload, sa)
    
    def _generate_spi(self) -> int:
        """Generate a unique Security Parameter Index"""
        import random
        return random.randint(0x100, 0xFFFFFFFF)
    
    def _generate_key(self, length: int) -> bytes:
        """Generate cryptographic key (educational - use proper CSPRNG in production)"""
        import os
        return os.urandom(length)
    
    def _apply_esp_protection(self, payload: bytes, sa: SecurityAssociation) -> bytes:
        """Apply ESP encryption and authentication (simplified)"""
        # This is a simplified educational implementation
        # Real ESP involves proper padding, IV generation, and AEAD
        
        esp_header = struct.pack("!II", sa.spi, sa.sequence_number)
        sa.sequence_number += 1
        
        # Simplified encryption (educational purposes only)
        encrypted_payload = self._simple_encrypt(payload, sa.encryption_key)
        
        # Add authentication (simplified HMAC)
        auth_data = esp_header + encrypted_payload
        auth_tag = self._compute_hmac(auth_data, sa.auth_key)[:12]  # Truncated
        
        return esp_header + encrypted_payload + auth_tag
    
    def _remove_esp_protection(self, esp_packet: bytes, sa: SecurityAssociation) -> bytes:
        """Remove ESP protection (simplified)"""
        # Extract ESP header
        spi, seq_num = struct.unpack("!II", esp_packet[:8])
        
        # Extract encrypted payload and authentication tag
        encrypted_payload = esp_packet[8:-12]
        received_auth_tag = esp_packet[-12:]
        
        # Verify authentication
        auth_data = esp_packet[:-12]
        expected_auth_tag = self._compute_hmac(auth_data, sa.auth_key)[:12]
        
        if received_auth_tag != expected_auth_tag:
            print("Authentication verification failed!")
            return None
        
        # Decrypt payload
        return self._simple_decrypt(encrypted_payload, sa.encryption_key)
    
    def _apply_ah_protection(self, payload: bytes, sa: SecurityAssociation) -> bytes:
        """Apply AH authentication (simplified)"""
        ah_header = struct.pack("!BBI", 51, 4, sa.spi)  # Next header, length, SPI
        auth_data = ah_header + payload
        auth_tag = self._compute_hmac(auth_data, sa.auth_key)[:12]
        return ah_header + auth_tag + payload
    
    def _remove_ah_protection(self, ah_packet: bytes, sa: SecurityAssociation) -> bytes:
        """Remove AH protection (simplified)"""
        # This is a simplified implementation for educational purposes
        return ah_packet[16:]  # Skip AH header
    
    def _simple_encrypt(self, data: bytes, key: bytes) -> bytes:
        """Simplified encryption for educational purposes"""
        # WARNING: This is NOT secure - for educational demonstration only
        return bytes(a ^ b for a, b in zip(data, (key * (len(data) // len(key) + 1))[:len(data)]))
    
    def _simple_decrypt(self, encrypted_data: bytes, key: bytes) -> bytes:
        """Simplified decryption (XOR is its own inverse)"""
        return self._simple_encrypt(encrypted_data, key)
    
    def _compute_hmac(self, data: bytes, key: bytes) -> bytes:
        """Compute HMAC-SHA256"""
        import hmac
        return hmac.new(key, data, hashlib.sha256).digest()

# Example Usage: Setting up IPsec communication
def demonstrate_ipsec_sa_management():
    """
    Demonstrate RFC 4301 Security Association management
    """
    print("RFC 4301: IPsec Security Association Management Demo")
    print("=" * 55)
    
    # Initialize IPsec processor
    ipsec = IPsecProcessor()
    
    # Network topology
    local_gateway = "192.168.1.1"
    remote_gateway = "10.0.0.1"
    
    # Establish IPsec tunnel between gateways
    outbound_sa, inbound_sa = ipsec.establish_ipsec_tunnel(local_gateway, remote_gateway)
    
    # Simulate packet processing
    print("\\n=== Packet Processing Demonstration ===")
    
    # Outbound packet (local -> remote)
    original_payload = b"Hello from local network! This is sensitive data."
    print(f"Original payload: {original_payload.decode()}")
    
    protected_packet = ipsec.process_outbound_packet(
        local_gateway, remote_gateway, original_payload
    )
    
    if protected_packet:
        print(f"Protected packet size: {len(protected_packet)} bytes")
        print(f"ESP header + encrypted data + auth tag")
    
    # Inbound packet processing (remote -> local)
    if protected_packet:
        decrypted_payload = ipsec.process_inbound_packet(
            inbound_sa.spi, local_gateway, protected_packet
        )
        
        if decrypted_payload:
            print(f"Decrypted payload: {decrypted_payload.decode()}")
            print("✅ IPsec tunnel communication successful!")
        else:
            print("❌ Packet decryption failed")
    
    # Display SA database status
    print("\\n=== Security Association Database Status ===")
    print(f"Active inbound SAs: {len(ipsec.sad.inbound_sas)}")
    print(f"Active outbound SAs: {len(ipsec.sad.outbound_sas)}")

if __name__ == "__main__":
    demonstrate_ipsec_sa_management()
`;