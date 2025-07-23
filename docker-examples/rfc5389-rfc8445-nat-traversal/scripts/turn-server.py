#!/usr/bin/env python3
"""
Educational TURN Server Implementation
Provides relay functionality for cases where direct NAT traversal fails.
"""

import asyncio
import socket
import logging
from typing import Dict, Tuple
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TURNServer:
    """Educational TURN server for relay functionality"""
    
    def __init__(self, host='0.0.0.0', port=3479):
        self.host = host
        self.port = port
        self.allocations: Dict[str, Dict] = {}
        self.stats = {
            'allocations': 0,
            'bytes_relayed': 0,
            'active_sessions': 0
        }
        
    async def run_server(self):
        """Run the TURN server"""
        logger.info(f"🔄 Starting TURN server on {self.host}:{self.port}")
        logger.info("📋 TURN server ready for relay allocations")
        logger.info("⚠️  Educational implementation - not for production use!")
        
        # Simple UDP echo server for demonstration
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind((self.host, self.port))
        sock.setblocking(False)
        
        try:
            while True:
                try:
                    data, addr = await asyncio.get_event_loop().sock_recvfrom(sock, 1024)
                    
                    # Echo back with TURN prefix for identification
                    response = b"TURN-RELAY: " + data
                    await asyncio.get_event_loop().sock_sendto(sock, response, addr)
                    
                    self.stats['bytes_relayed'] += len(data)
                    logger.info(f"🔄 Relayed {len(data)} bytes for {addr[0]}:{addr[1]}")
                    
                except Exception as e:
                    logger.error(f"TURN relay error: {e}")
                    
        except KeyboardInterrupt:
            logger.info("🛑 TURN server shutting down")
        finally:
            sock.close()

def main():
    import os
    
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 3479))
    
    server = TURNServer(host, port)
    asyncio.run(server.run_server())

if __name__ == "__main__":
    main()