export const rfc8656_turn_client = `"""
RFC 8656: TURN (Traversal Using Relays around NAT) Client Example

This example demonstrates how a TURN client allocates relay addresses,
manages permissions, and transmits data through TURN servers when direct
peer-to-peer connections are not possible.
"""

import socket
import struct
import hashlib
import hmac
import time
import asyncio
from typing import Optional, Dict, Tuple, List
from dataclasses import dataclass
from enum import Enum

class TURNMessageType(Enum):
    # STUN Base Methods
    BINDING_REQUEST = 0x0001
    BINDING_RESPONSE = 0x0101
    
    # TURN-specific Methods
    ALLOCATE_REQUEST = 0x0003
    ALLOCATE_RESPONSE = 0x0103
    REFRESH_REQUEST = 0x0004
    REFRESH_RESPONSE = 0x0104
    SEND_INDICATION = 0x0016
    DATA_INDICATION = 0x0017
    CREATE_PERMISSION_REQUEST = 0x0008
    CREATE_PERMISSION_RESPONSE = 0x0108
    CHANNEL_BIND_REQUEST = 0x0009
    CHANNEL_BIND_RESPONSE = 0x0109

class TURNAttributeType(Enum):
    XOR_RELAYED_ADDRESS = 0x0016
    LIFETIME = 0x000D
    REQUESTED_TRANSPORT = 0x0019
    XOR_PEER_ADDRESS = 0x0012
    DATA = 0x0013
    CHANNEL_NUMBER = 0x000C
    USERNAME = 0x0006
    MESSAGE_INTEGRITY = 0x0008

@dataclass
class TURNAllocation:
    """TURN relay allocation information"""
    relay_address: Tuple[str, int]
    lifetime: int
    allocated_at: float
    permissions: List[str]  # List of permitted peer IP addresses
    channels: Dict[int, str]  # Channel number -> peer IP mapping

@dataclass
class TURNMessage:
    """TURN/STUN message structure"""
    message_type: TURNMessageType
    transaction_id: bytes
    attributes: Dict[TURNAttributeType, bytes]

class TURNClient:
    """
    RFC 8656 TURN Client Implementation
    
    Provides relay allocation, permission management, and data transmission
    capabilities for NAT traversal scenarios where direct P2P fails.
    """
    
    def __init__(self, server_address: Tuple[str, int], username: str, password: str):
        self.server_address = server_address
        self.username = username
        self.password = password
        self.socket = None
        self.allocation: Optional[TURNAllocation] = None
        self.transaction_counter = 0
        
    async def connect(self) -> bool:
        """Connect to TURN server"""
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            self.socket.settimeout(5.0)
            print(f"Connected to TURN server at {self.server_address}")
            return True
        except Exception as e:
            print(f"Failed to connect to TURN server: {e}")
            return False
    
    async def allocate_relay(self, lifetime: int = 600) -> Optional[TURNAllocation]:
        """
        Allocate a relay address on the TURN server
        
        This implements the TURN Allocate Request/Response exchange
        """
        print(f"\\n=== Requesting TURN Allocation ===")
        print(f"Requested lifetime: {lifetime} seconds")
        
        # Generate transaction ID
        transaction_id = self._generate_transaction_id()
        
        # Build Allocate Request
        attributes = {
            TURNAttributeType.REQUESTED_TRANSPORT: struct.pack("!BBH", 17, 0, 0),  # UDP
            TURNAttributeType.LIFETIME: struct.pack("!I", lifetime),
            TURNAttributeType.USERNAME: self.username.encode('utf-8')
        }
        
        request = self._build_message(
            TURNMessageType.ALLOCATE_REQUEST,
            transaction_id,
            attributes
        )
        
        # Add MESSAGE-INTEGRITY
        request = self._add_message_integrity(request)
        
        # Send request and wait for response
        try:
            self.socket.sendto(request, self.server_address)
            response_data, _ = self.socket.recvfrom(1024)
            
            response = self._parse_message(response_data)
            
            if response.message_type == TURNMessageType.ALLOCATE_RESPONSE:
                # Extract relay address
                if TURNAttributeType.XOR_RELAYED_ADDRESS in response.attributes:
                    relay_addr = self._parse_xor_address(
                        response.attributes[TURNAttributeType.XOR_RELAYED_ADDRESS],
                        transaction_id
                    )
                    
                    # Extract actual lifetime
                    actual_lifetime = lifetime
                    if TURNAttributeType.LIFETIME in response.attributes:
                        actual_lifetime = struct.unpack("!I", response.attributes[TURNAttributeType.LIFETIME])[0]
                    
                    self.allocation = TURNAllocation(
                        relay_address=relay_addr,
                        lifetime=actual_lifetime,
                        allocated_at=time.time(),
                        permissions=[],
                        channels={}
                    )
                    
                    print(f"✅ Allocation successful!")
                    print(f"Relay address: {relay_addr[0]}:{relay_addr[1]}")
                    print(f"Lifetime: {actual_lifetime} seconds")
                    
                    return self.allocation
                else:
                    print("❌ No relay address in response")
            else:
                print(f"❌ Allocation failed: {response.message_type}")
                
        except Exception as e:
            print(f"❌ Allocation request failed: {e}")
        
        return None
    
    async def create_permission(self, peer_ip: str) -> bool:
        """
        Create permission for a peer IP to send data to our relay
        
        This implements the TURN CreatePermission Request/Response
        """
        if not self.allocation:
            print("❌ No active allocation")
            return False
        
        print(f"\\n=== Creating Permission for {peer_ip} ===")
        
        transaction_id = self._generate_transaction_id()
        
        # Encode peer address
        peer_addr_bytes = self._encode_xor_address((peer_ip, 0), transaction_id)
        
        attributes = {
            TURNAttributeType.XOR_PEER_ADDRESS: peer_addr_bytes,
            TURNAttributeType.USERNAME: self.username.encode('utf-8')
        }
        
        request = self._build_message(
            TURNMessageType.CREATE_PERMISSION_REQUEST,
            transaction_id,
            attributes
        )
        
        request = self._add_message_integrity(request)
        
        try:
            self.socket.sendto(request, self.server_address)
            response_data, _ = self.socket.recvfrom(1024)
            
            response = self._parse_message(response_data)
            
            if response.message_type == TURNMessageType.CREATE_PERMISSION_RESPONSE:
                self.allocation.permissions.append(peer_ip)
                print(f"✅ Permission created for {peer_ip}")
                return True
            else:
                print(f"❌ Permission creation failed")
                
        except Exception as e:
            print(f"❌ Permission request failed: {e}")
        
        return False
    
    async def bind_channel(self, peer_ip: str, peer_port: int, channel_number: int) -> bool:
        """
        Bind a channel number to a peer address for efficient data transmission
        
        This implements the TURN ChannelBind Request/Response
        """
        if not self.allocation:
            print("❌ No active allocation")
            return False
        
        print(f"\\n=== Binding Channel {channel_number:04x} to {peer_ip}:{peer_port} ===")
        
        transaction_id = self._generate_transaction_id()
        
        # Encode peer address and channel number
        peer_addr_bytes = self._encode_xor_address((peer_ip, peer_port), transaction_id)
        channel_bytes = struct.pack("!HH", channel_number, 0)  # Channel + reserved
        
        attributes = {
            TURNAttributeType.CHANNEL_NUMBER: channel_bytes,
            TURNAttributeType.XOR_PEER_ADDRESS: peer_addr_bytes,
            TURNAttributeType.USERNAME: self.username.encode('utf-8')
        }
        
        request = self._build_message(
            TURNMessageType.CHANNEL_BIND_REQUEST,
            transaction_id,
            attributes
        )
        
        request = self._add_message_integrity(request)
        
        try:
            self.socket.sendto(request, self.server_address)
            response_data, _ = self.socket.recvfrom(1024)
            
            response = self._parse_message(response_data)
            
            if response.message_type == TURNMessageType.CHANNEL_BIND_RESPONSE:
                self.allocation.channels[channel_number] = f"{peer_ip}:{peer_port}"
                print(f"✅ Channel {channel_number:04x} bound to {peer_ip}:{peer_port}")
                return True
            else:
                print(f"❌ Channel binding failed")
                
        except Exception as e:
            print(f"❌ Channel bind request failed: {e}")
        
        return False
    
    async def send_data_indication(self, peer_ip: str, peer_port: int, data: bytes) -> bool:
        """
        Send data to peer using Send Indication method (full STUN encapsulation)
        """
        if not self.allocation:
            print("❌ No active allocation")
            return False
        
        print(f"\\n=== Sending Data via Indication to {peer_ip}:{peer_port} ===")
        print(f"Data size: {len(data)} bytes")
        
        transaction_id = self._generate_transaction_id()
        
        # Encode peer address and data
        peer_addr_bytes = self._encode_xor_address((peer_ip, peer_port), transaction_id)
        
        attributes = {
            TURNAttributeType.XOR_PEER_ADDRESS: peer_addr_bytes,
            TURNAttributeType.DATA: data
        }
        
        indication = self._build_message(
            TURNMessageType.SEND_INDICATION,
            transaction_id,
            attributes
        )
        
        try:
            self.socket.sendto(indication, self.server_address)
            print(f"✅ Data sent via Send Indication")
            print(f"Overhead: {len(indication) - len(data)} bytes")
            return True
            
        except Exception as e:
            print(f"❌ Send indication failed: {e}")
        
        return False
    
    async def send_channel_data(self, channel_number: int, data: bytes) -> bool:
        """
        Send data to peer using Channel Data method (compact 4-byte header)
        """
        if not self.allocation:
            print("❌ No active allocation")
            return False
        
        if channel_number not in self.allocation.channels:
            print(f"❌ Channel {channel_number:04x} not bound")
            return False
        
        peer_address = self.allocation.channels[channel_number]
        print(f"\\n=== Sending Data via Channel {channel_number:04x} to {peer_address} ===")
        print(f"Data size: {len(data)} bytes")
        
        # Build Channel Data message (4-byte header + data)
        channel_data = struct.pack("!HH", channel_number, len(data)) + data
        
        try:
            self.socket.sendto(channel_data, self.server_address)
            print(f"✅ Data sent via Channel Data")
            print(f"Overhead: {len(channel_data) - len(data)} bytes (92% reduction vs indication)")
            return True
            
        except Exception as e:
            print(f"❌ Channel data send failed: {e}")
        
        return False
    
    async def refresh_allocation(self, new_lifetime: int = 600) -> bool:
        """
        Refresh the allocation to extend its lifetime
        """
        if not self.allocation:
            print("❌ No active allocation to refresh")
            return False
        
        print(f"\\n=== Refreshing Allocation ===")
        print(f"New lifetime: {new_lifetime} seconds")
        
        transaction_id = self._generate_transaction_id()
        
        attributes = {
            TURNAttributeType.LIFETIME: struct.pack("!I", new_lifetime),
            TURNAttributeType.USERNAME: self.username.encode('utf-8')
        }
        
        request = self._build_message(
            TURNMessageType.REFRESH_REQUEST,
            transaction_id,
            attributes
        )
        
        request = self._add_message_integrity(request)
        
        try:
            self.socket.sendto(request, self.server_address)
            response_data, _ = self.socket.recvfrom(1024)
            
            response = self._parse_message(response_data)
            
            if response.message_type == TURNMessageType.REFRESH_RESPONSE:
                # Update allocation lifetime
                if TURNAttributeType.LIFETIME in response.attributes:
                    actual_lifetime = struct.unpack("!I", response.attributes[TURNAttributeType.LIFETIME])[0]
                    self.allocation.lifetime = actual_lifetime
                    self.allocation.allocated_at = time.time()
                    
                    print(f"✅ Allocation refreshed!")
                    print(f"New lifetime: {actual_lifetime} seconds")
                    return True
                    
        except Exception as e:
            print(f"❌ Refresh request failed: {e}")
        
        return False
    
    def _generate_transaction_id(self) -> bytes:
        """Generate unique 12-byte transaction ID"""
        self.transaction_counter += 1
        # Magic cookie (4 bytes) + counter (4 bytes) + random (4 bytes)
        return struct.pack("!III", 0x2112A442, self.transaction_counter, int(time.time()) & 0xFFFFFFFF)
    
    def _build_message(self, msg_type: TURNMessageType, transaction_id: bytes, 
                      attributes: Dict[TURNAttributeType, bytes]) -> bytes:
        """Build TURN/STUN message"""
        # Calculate total length
        attr_length = sum(4 + len(value) + (4 - len(value) % 4) % 4 for value in attributes.values())
        
        # STUN header: Type (2) + Length (2) + Transaction ID (12)
        header = struct.pack("!HH", msg_type.value, attr_length) + transaction_id
        
        # Add attributes
        message = header
        for attr_type, attr_value in attributes.items():
            # Attribute header: Type (2) + Length (2)
            attr_header = struct.pack("!HH", attr_type.value, len(attr_value))
            # Pad to 4-byte boundary
            padding_len = (4 - len(attr_value) % 4) % 4
            padded_value = attr_value + b'\\x00' * padding_len
            message += attr_header + padded_value
        
        return message
    
    def _parse_message(self, data: bytes) -> TURNMessage:
        """Parse TURN/STUN message"""
        if len(data) < 16:
            raise ValueError("Message too short")
        
        msg_type_val, length, transaction_id = struct.unpack("!HH12s", data[:16])
        msg_type = TURNMessageType(msg_type_val)
        
        # Parse attributes
        attributes = {}
        offset = 16
        while offset < len(data):
            if offset + 4 > len(data):
                break
            
            attr_type_val, attr_len = struct.unpack("!HH", data[offset:offset+4])
            attr_type = TURNAttributeType(attr_type_val)
            
            attr_value = data[offset+4:offset+4+attr_len]
            attributes[attr_type] = attr_value
            
            # Skip to next 4-byte boundary
            offset += 4 + attr_len + (4 - attr_len % 4) % 4
        
        return TURNMessage(msg_type, transaction_id, attributes)
    
    def _encode_xor_address(self, address: Tuple[str, int], transaction_id: bytes) -> bytes:
        """Encode address with XOR obfuscation"""
        ip, port = address
        magic_cookie = 0x2112A442
        
        # XOR port with magic cookie
        xor_port = port ^ (magic_cookie >> 16)
        
        # XOR IP with magic cookie + transaction ID
        ip_parts = [int(x) for x in ip.split('.')]
        ip_int = (ip_parts[0] << 24) | (ip_parts[1] << 16) | (ip_parts[2] << 8) | ip_parts[3]
        xor_mask = struct.unpack("!I", struct.pack("!I", magic_cookie) + transaction_id[4:8])[0]
        xor_ip = ip_int ^ xor_mask
        
        return struct.pack("!BBHI", 0, 1, xor_port, xor_ip)  # Family=1 (IPv4)
    
    def _parse_xor_address(self, data: bytes, transaction_id: bytes) -> Tuple[str, int]:
        """Parse XOR-encoded address"""
        _, family, xor_port, xor_ip = struct.unpack("!BBHI", data)
        magic_cookie = 0x2112A442
        
        # Un-XOR port
        port = xor_port ^ (magic_cookie >> 16)
        
        # Un-XOR IP
        xor_mask = struct.unpack("!I", struct.pack("!I", magic_cookie) + transaction_id[4:8])[0]
        ip_int = xor_ip ^ xor_mask
        
        ip = f"{(ip_int >> 24) & 0xFF}.{(ip_int >> 16) & 0xFF}.{(ip_int >> 8) & 0xFF}.{ip_int & 0xFF}"
        
        return (ip, port)
    
    def _add_message_integrity(self, message: bytes) -> bytes:
        """Add MESSAGE-INTEGRITY attribute (simplified for demo)"""
        # In real implementation, this would use proper HMAC-SHA1
        # with password-derived key
        key = self.password.encode('utf-8')
        signature = hmac.new(key, message, hashlib.sha1).digest()
        
        # Add MESSAGE-INTEGRITY attribute
        attr_header = struct.pack("!HH", TURNAttributeType.MESSAGE_INTEGRITY.value, 20)
        return message + attr_header + signature
    
    def close(self):
        """Close TURN client connection"""
        if self.socket:
            self.socket.close()
            print("TURN client disconnected")

# Example Usage: TURN Client Demonstration
async def demonstrate_turn_client():
    """
    Demonstrate RFC 8656 TURN client functionality
    """
    print("RFC 8656: TURN (Traversal Using Relays around NAT) Demo")
    print("=" * 55)
    
    # Initialize TURN client
    turn_client = TURNClient(
        server_address=("stun.example.com", 3478),  # Demo server
        username="testuser",
        password="testpass"
    )
    
    try:
        # Connect to TURN server
        if not await turn_client.connect():
            print("❌ Failed to connect to TURN server")
            return
        
        # Allocate relay address
        allocation = await turn_client.allocate_relay(lifetime=600)
        if not allocation:
            print("❌ Failed to allocate relay")
            return
        
        # Create permission for a peer
        peer_ip = "198.51.100.50"
        peer_port = 54321
        
        if await turn_client.create_permission(peer_ip):
            print(f"✅ Permission created for {peer_ip}")
        
        # Test data transmission methods
        test_data = b"Hello from TURN client! This is test data for relay."
        
        # Method 1: Send Indication (full STUN encapsulation)
        await turn_client.send_data_indication(peer_ip, peer_port, test_data)
        
        # Method 2: Channel Data (compact header)
        channel_number = 0x4000  # Valid channel range: 0x4000-0x7FFF
        
        if await turn_client.bind_channel(peer_ip, peer_port, channel_number):
            await turn_client.send_channel_data(channel_number, test_data)
        
        # Refresh allocation to extend lifetime
        await turn_client.refresh_allocation(new_lifetime=900)
        
        # Display allocation status
        print("\\n=== TURN Allocation Status ===")
        print(f"Relay Address: {allocation.relay_address[0]}:{allocation.relay_address[1]}")
        print(f"Lifetime: {allocation.lifetime} seconds")
        print(f"Permissions: {len(allocation.permissions)} peer(s)")
        print(f"Channels: {len(allocation.channels)} bound")
        
        for channel_num, peer_addr in allocation.channels.items():
            print(f"  Channel {channel_num:04x}: {peer_addr}")
        
        print("\\n=== Data Transmission Comparison ===")
        indication_overhead = 36  # Typical STUN indication overhead
        channel_overhead = 4     # Channel data header
        
        print(f"Send Indication overhead: ~{indication_overhead} bytes per packet")
        print(f"Channel Data overhead: ~{channel_overhead} bytes per packet")
        print(f"Efficiency improvement: {((indication_overhead - channel_overhead) / indication_overhead * 100):.1f}%")
        
    except Exception as e:
        print(f"❌ TURN demonstration failed: {e}")
    
    finally:
        turn_client.close()
    
    print("\\n=== TURN Demonstration Complete ===")
    print("Key TURN features demonstrated:")
    print("✅ Relay allocation and management")
    print("✅ Permission-based security")
    print("✅ Dual data transmission methods")
    print("✅ Channel binding for efficiency")
    print("✅ Allocation lifetime management")

if __name__ == "__main__":
    asyncio.run(demonstrate_turn_client())
`;