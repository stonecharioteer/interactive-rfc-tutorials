#!/usr/bin/env python3
"""
Educational STUN Server Implementation
Demonstrates RFC 5389 STUN protocol for NAT traversal education.
"""

import asyncio
import socket
import struct
import secrets
import time
import logging
from typing import Dict, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class STUNMessage:
    """STUN message structure"""
    message_type: int
    message_length: int
    magic_cookie: int
    transaction_id: bytes
    attributes: Dict[int, bytes]

class STUNServer:
    """Educational STUN server implementation"""
    
    # STUN Constants
    MAGIC_COOKIE = 0x2112A442
    
    # Message Types
    BINDING_REQUEST = 0x0001
    BINDING_RESPONSE = 0x0101
    BINDING_ERROR = 0x0111
    
    # Attributes
    MAPPED_ADDRESS = 0x0001
    XOR_MAPPED_ADDRESS = 0x0020
    SOFTWARE = 0x8022
    FINGERPRINT = 0x8028
    
    def __init__(self, host='0.0.0.0', port=3478):
        self.host = host
        self.port = port
        self.socket = None
        self.running = False
        self.stats = {
            'requests_received': 0,
            'responses_sent': 0,
            'errors': 0,
            'unique_clients': set()
        }
        
    def parse_stun_message(self, data: bytes) -> Optional[STUNMessage]:
        """Parse incoming STUN message"""
        try:
            if len(data) < 20:
                return None
                
            # Parse header
            header = struct.unpack('>HHI12s', data[:20])
            message_type = header[0]
            message_length = header[1]
            magic_cookie = header[2]
            transaction_id = header[3]
            
            # Verify magic cookie
            if magic_cookie != self.MAGIC_COOKIE:
                logger.warning(f"Invalid magic cookie: {magic_cookie:#x}")
                return None
                
            # Parse attributes
            attributes = {}
            offset = 20
            
            while offset < len(data) and offset < 20 + message_length:
                if offset + 4 > len(data):
                    break
                    
                attr_type, attr_length = struct.unpack('>HH', data[offset:offset+4])
                attr_value = data[offset+4:offset+4+attr_length]
                
                attributes[attr_type] = attr_value
                
                # Move to next attribute (pad to 4-byte boundary)
                offset += 4 + attr_length
                if attr_length % 4:
                    offset += 4 - (attr_length % 4)
                    
            return STUNMessage(
                message_type=message_type,
                message_length=message_length,
                magic_cookie=magic_cookie,
                transaction_id=transaction_id,
                attributes=attributes
            )
            
        except Exception as e:
            logger.error(f"Error parsing STUN message: {e}")
            return None
            
    def create_xor_mapped_address(self, ip: str, port: int, transaction_id: bytes) -> bytes:
        """Create XOR-MAPPED-ADDRESS attribute"""
        # Convert IP to integer
        ip_parts = [int(x) for x in ip.split('.')]
        ip_int = (ip_parts[0] << 24) + (ip_parts[1] << 16) + (ip_parts[2] << 8) + ip_parts[3]
        
        # XOR with magic cookie
        xor_port = port ^ (self.MAGIC_COOKIE >> 16)
        xor_ip = ip_int ^ self.MAGIC_COOKIE
        
        # Pack as address attribute
        # Family (IPv4=1), XOR-Port, XOR-Address
        return struct.pack('>HHI', 1, xor_port, xor_ip)
        
    def create_software_attribute(self) -> bytes:
        """Create SOFTWARE attribute"""
        software = "Educational STUN Server (RFC 5389 Demo)"
        return software.encode('utf-8')
        
    def create_binding_response(self, transaction_id: bytes, client_addr: Tuple[str, int]) -> bytes:
        """Create STUN Binding Response"""
        attributes = []
        
        # XOR-MAPPED-ADDRESS attribute
        xor_mapped = self.create_xor_mapped_address(client_addr[0], client_addr[1], transaction_id)
        attr_header = struct.pack('>HH', self.XOR_MAPPED_ADDRESS, len(xor_mapped))
        attributes.append(attr_header + xor_mapped)
        
        # SOFTWARE attribute
        software = self.create_software_attribute()
        # Pad to 4-byte boundary
        software_padded = software + b'\x00' * ((4 - len(software) % 4) % 4)
        attr_header = struct.pack('>HH', self.SOFTWARE, len(software))
        attributes.append(attr_header + software_padded)
        
        # Calculate total attribute length
        attr_data = b''.join(attributes)
        message_length = len(attr_data)
        
        # Create header
        header = struct.pack('>HHI12s', 
                           self.BINDING_RESPONSE,
                           message_length,
                           self.MAGIC_COOKIE,
                           transaction_id)
        
        return header + attr_data
        
    def create_error_response(self, transaction_id: bytes, error_code: int, reason: str) -> bytes:
        """Create STUN Error Response"""
        # Error code attribute
        error_class = error_code // 100
        error_number = error_code % 100
        reason_bytes = reason.encode('utf-8')
        
        # Error attribute: Class(1), Number(1), Reason(variable)
        error_attr = struct.pack('>HHI', 0, (error_class << 8) | error_number, 0) + reason_bytes
        # Pad to 4-byte boundary
        error_attr += b'\x00' * ((4 - len(error_attr) % 4) % 4)
        
        attr_header = struct.pack('>HH', 0x0009, len(error_attr) - 4)  # ERROR-CODE attribute
        attr_data = attr_header + error_attr
        
        # Create header
        header = struct.pack('>HHI12s',
                           self.BINDING_ERROR,
                           len(attr_data),
                           self.MAGIC_COOKIE,
                           transaction_id)
        
        return header + attr_data
        
    async def handle_stun_request(self, data: bytes, client_addr: Tuple[str, int]):
        """Handle incoming STUN request"""
        try:
            self.stats['requests_received'] += 1
            self.stats['unique_clients'].add(client_addr[0])
            
            logger.info(f"📥 STUN request from {client_addr[0]}:{client_addr[1]}")
            
            # Parse message
            message = self.parse_stun_message(data)
            if not message:
                logger.warning(f"Invalid STUN message from {client_addr}")
                return
                
            # Handle different message types
            if message.message_type == self.BINDING_REQUEST:
                logger.info(f"🔍 Processing Binding Request (TxID: {message.transaction_id.hex()[:8]}...)")
                
                # Create and send response
                response = self.create_binding_response(message.transaction_id, client_addr)
                self.socket.sendto(response, client_addr)
                
                self.stats['responses_sent'] += 1
                logger.info(f"📤 Sent Binding Response to {client_addr[0]}:{client_addr[1]}")
                logger.info(f"   Revealed public address: {client_addr[0]}:{client_addr[1]}")
                
            else:
                logger.warning(f"Unsupported message type: {message.message_type:#x}")
                error_response = self.create_error_response(
                    message.transaction_id, 
                    400, 
                    "Bad Request"
                )
                self.socket.sendto(error_response, client_addr)
                
        except Exception as e:
            logger.error(f"Error handling STUN request: {e}")
            self.stats['errors'] += 1
            
    async def log_statistics(self):
        """Periodically log server statistics"""
        while self.running:
            await asyncio.sleep(30)  # Log every 30 seconds
            
            logger.info("📊 STUN Server Statistics:")
            logger.info(f"   Requests received: {self.stats['requests_received']}")
            logger.info(f"   Responses sent: {self.stats['responses_sent']}")
            logger.info(f"   Errors: {self.stats['errors']}")
            logger.info(f"   Unique clients: {len(self.stats['unique_clients'])}")
            
    async def run_server(self):
        """Run the STUN server"""
        logger.info(f"🚀 Starting STUN server on {self.host}:{self.port}")
        
        # Create UDP socket
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind((self.host, self.port))
        self.socket.setblocking(False)
        
        self.running = True
        
        logger.info("✅ STUN server started successfully")
        logger.info("📋 Capabilities:")
        logger.info("   • Basic Binding Request/Response")
        logger.info("   • XOR-MAPPED-ADDRESS discovery")
        logger.info("   • Client public IP/port revelation")
        logger.info("   • Educational logging and statistics")
        
        # Start statistics logging task
        stats_task = asyncio.create_task(self.log_statistics())
        
        try:
            while self.running:
                try:
                    # Receive data
                    data, client_addr = await asyncio.get_event_loop().sock_recvfrom(self.socket, 1024)
                    
                    # Handle request asynchronously
                    asyncio.create_task(self.handle_stun_request(data, client_addr))
                    
                except asyncio.CancelledError:
                    break
                except Exception as e:
                    logger.error(f"Server error: {e}")
                    
        except KeyboardInterrupt:
            logger.info("🛑 Shutting down STUN server...")
        finally:
            self.running = False
            stats_task.cancel()
            self.socket.close()
            
            logger.info("📊 Final Statistics:")
            logger.info(f"   Total requests: {self.stats['requests_received']}")
            logger.info(f"   Total responses: {self.stats['responses_sent']}")
            logger.info(f"   Unique clients served: {len(self.stats['unique_clients'])}")

def main():
    """Main STUN server entry point"""
    import os
    
    # Get configuration from environment
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 3478))
    
    print("🔒 Educational STUN Server")
    print("=" * 50)
    print("📖 RFC 5389: Session Traversal Utilities for NAT")
    print("⚠️  For educational purposes only!")
    print()
    
    server = STUNServer(host, port)
    
    try:
        asyncio.run(server.run_server())
    except KeyboardInterrupt:
        print("\n👋 STUN server stopped")

if __name__ == "__main__":
    main()