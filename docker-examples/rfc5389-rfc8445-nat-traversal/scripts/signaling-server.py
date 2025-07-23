#!/usr/bin/env python3
"""
Educational Signaling Server for ICE Candidate Exchange
Facilitates WebSocket-based communication between ICE peers for RFC 8445 demonstration.
"""

import asyncio
import json
import logging
import websockets
from typing import Dict, Set
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SignalingServer:
    """Educational signaling server for ICE candidate exchange"""
    
    def __init__(self, host='0.0.0.0', port=8080):
        self.host = host
        self.port = port
        self.peers: Dict[str, websockets.WebSocketServerProtocol] = {}
        self.stats = {
            'connections': 0,
            'messages_relayed': 0,
            'peers_registered': 0,
            'candidates_exchanged': 0
        }
        
    async def register_peer(self, websocket: websockets.WebSocketServerProtocol, peer_name: str):
        """Register a new peer"""
        if peer_name in self.peers:
            logger.warning(f"⚠️  Peer {peer_name} already registered, replacing connection")
            
        self.peers[peer_name] = websocket
        self.stats['peers_registered'] += 1
        
        logger.info(f"✅ Peer registered: {peer_name}")
        logger.info(f"📊 Active peers: {list(self.peers.keys())}")
        
        # Notify about successful registration
        response = {
            'type': 'registration_success',
            'peer_name': peer_name,
            'active_peers': list(self.peers.keys())
        }
        await websocket.send(json.dumps(response))
        
    async def relay_message(self, from_peer: str, to_peer: str, message: dict):
        """Relay message between peers"""
        if to_peer not in self.peers:
            logger.warning(f"❌ Target peer {to_peer} not found")
            
            error_response = {
                'type': 'error',
                'message': f'Peer {to_peer} not found'
            }
            
            if from_peer in self.peers:
                await self.peers[from_peer].send(json.dumps(error_response))
            return
            
        try:
            target_websocket = self.peers[to_peer]
            await target_websocket.send(json.dumps(message))
            
            self.stats['messages_relayed'] += 1
            
            if message.get('type') == 'ice_candidate':
                self.stats['candidates_exchanged'] += 1
                candidate = message.get('candidate', {})
                logger.info(f"🔀 Relayed ICE candidate: {from_peer} -> {to_peer}")
                logger.info(f"   Type: {candidate.get('type', 'unknown')}")
                logger.info(f"   Address: {candidate.get('address', 'unknown')}:{candidate.get('port', 'unknown')}")
            else:
                logger.info(f"📨 Relayed message: {from_peer} -> {to_peer} (type: {message.get('type', 'unknown')})")
                
        except Exception as e:
            logger.error(f"❌ Failed to relay message to {to_peer}: {e}")
            
    async def handle_peer_connection(self, websocket: websockets.WebSocketServerProtocol, path: str):
        """Handle individual peer WebSocket connection"""
        peer_name = None
        
        try:
            self.stats['connections'] += 1
            logger.info(f"🔗 New WebSocket connection from {websocket.remote_address}")
            
            async for message in websocket:
                try:
                    data = json.loads(message)
                    message_type = data.get('type')
                    
                    if message_type == 'register':
                        peer_name = data.get('peer_name')
                        if peer_name:
                            await self.register_peer(websocket, peer_name)
                        else:
                            logger.warning("❌ Registration without peer name")
                            
                    elif message_type == 'ice_candidate':
                        from_peer = data.get('from')
                        to_peer = data.get('to')
                        
                        if from_peer and to_peer:
                            await self.relay_message(from_peer, to_peer, data)
                        else:
                            logger.warning("❌ ICE candidate missing from/to fields")
                            
                    elif message_type == 'offer' or message_type == 'answer':
                        from_peer = data.get('from')
                        to_peer = data.get('to')
                        
                        if from_peer and to_peer:
                            await self.relay_message(from_peer, to_peer, data)
                        else:
                            logger.warning(f"❌ SDP {message_type} missing from/to fields")
                            
                    elif message_type == 'ping':
                        # Respond to ping with pong
                        pong_response = {
                            'type': 'pong',
                            'timestamp': datetime.utcnow().isoformat()
                        }
                        await websocket.send(json.dumps(pong_response))
                        
                    elif message_type == 'get_stats':
                        # Send current server statistics
                        stats_response = {
                            'type': 'stats',
                            'stats': self.stats.copy(),
                            'active_peers': list(self.peers.keys()),
                            'timestamp': datetime.utcnow().isoformat()
                        }
                        await websocket.send(json.dumps(stats_response))
                        
                    else:
                        logger.warning(f"❓ Unknown message type: {message_type}")
                        
                except json.JSONDecodeError:
                    logger.error("❌ Invalid JSON received")
                except Exception as e:
                    logger.error(f"❌ Error handling message: {e}")
                    
        except websockets.ConnectionClosed:
            logger.info(f"🔌 WebSocket connection closed for {peer_name or 'unknown'}")
        except Exception as e:
            logger.error(f"❌ WebSocket error: {e}")
        finally:
            # Clean up peer registration
            if peer_name and peer_name in self.peers:
                del self.peers[peer_name]
                logger.info(f"🧹 Cleaned up peer: {peer_name}")
                
    async def log_statistics(self):
        """Periodically log server statistics"""
        while True:
            await asyncio.sleep(60)  # Log every minute
            
            logger.info("📊 Signaling Server Statistics:")
            logger.info(f"   Total connections: {self.stats['connections']}")
            logger.info(f"   Messages relayed: {self.stats['messages_relayed']}")
            logger.info(f"   Peers registered: {self.stats['peers_registered']}")
            logger.info(f"   ICE candidates exchanged: {self.stats['candidates_exchanged']}")
            logger.info(f"   Currently active peers: {len(self.peers)}")
            
    async def run_server(self):
        """Run the signaling server"""
        logger.info(f"🚀 Starting signaling server on {self.host}:{self.port}")
        
        # Start statistics logging task
        stats_task = asyncio.create_task(self.log_statistics())
        
        try:
            logger.info("✅ Signaling server started successfully")
            logger.info("📋 Supported message types:")
            logger.info("   • register: Register peer with server")
            logger.info("   • ice_candidate: Exchange ICE candidates")
            logger.info("   • offer/answer: Exchange SDP offers/answers")
            logger.info("   • ping/pong: Connection keepalive")
            logger.info("   • get_stats: Retrieve server statistics")
            
            async with websockets.serve(self.handle_peer_connection, self.host, self.port):
                await asyncio.Future()  # Run forever
                
        except KeyboardInterrupt:
            logger.info("🛑 Shutting down signaling server...")
        finally:
            stats_task.cancel()
            
            logger.info("📊 Final Statistics:")
            logger.info(f"   Total connections served: {self.stats['connections']}")
            logger.info(f"   Total messages relayed: {self.stats['messages_relayed']}")
            logger.info(f"   Total ICE candidates exchanged: {self.stats['candidates_exchanged']}")

def main():
    """Main signaling server entry point"""
    import os
    
    # Get configuration from environment
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 8080))
    
    print("🌐 Educational ICE Signaling Server")
    print("=" * 50)
    print("📖 Facilitates RFC 8445 ICE candidate exchange")
    print("⚠️  For educational purposes only!")
    print()
    
    server = SignalingServer(host, port)
    
    try:
        asyncio.run(server.run_server())
    except KeyboardInterrupt:
        print("\n👋 Signaling server stopped")

if __name__ == "__main__":
    main()