#!/usr/bin/env python3
"""
Educational NAT Traversal Monitor
Provides web-based visualization of NAT traversal process.
"""

import asyncio
import json
import logging
from aiohttp import web, WSMsgType
import aiohttp_cors
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class NATMonitor:
    """Web-based NAT traversal monitoring"""
    
    def __init__(self, host='0.0.0.0', port=3000):
        self.host = host
        self.port = port
        self.websockets = set()
        self.events = []
        
    async def websocket_handler(self, request):
        """Handle WebSocket connections for real-time updates"""
        ws = web.WebSocketResponse()
        await ws.prepare(request)
        
        self.websockets.add(ws)
        logger.info(f"📡 New monitor client connected")
        
        # Send existing events to new client
        for event in self.events[-50:]:  # Last 50 events
            await ws.send_str(json.dumps(event))
            
        try:
            async for msg in ws:
                if msg.type == WSMsgType.TEXT:
                    # Handle client messages if needed
                    pass
                elif msg.type == WSMsgType.ERROR:
                    logger.error(f"WebSocket error: {ws.exception()}")
        except Exception as e:
            logger.error(f"WebSocket handler error: {e}")
        finally:
            self.websockets.discard(ws)
            logger.info("📡 Monitor client disconnected")
            
        return ws
        
    async def index_handler(self, request):
        """Serve the monitoring web interface"""
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>NAT Traversal Monitor</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                .container { max-width: 1200px; margin: 0 auto; }
                .header { background: #2196F3; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .section { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .event { padding: 8px; margin: 5px 0; border-left: 4px solid #4CAF50; background: #f8f9fa; }
                .event.error { border-left-color: #f44336; }
                .event.warning { border-left-color: #ff9800; }
                .timestamp { color: #666; font-size: 0.9em; }
                .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
                .status.online { background: #4CAF50; color: white; }
                .status.offline { background: #f44336; color: white; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧊 NAT Traversal Monitor</h1>
                    <p>Real-time visualization of RFC 5389 (STUN) and RFC 8445 (ICE) protocols</p>
                </div>
                
                <div class="grid">
                    <div class="section">
                        <h3>📊 System Status</h3>
                        <div id="status">
                            <p>🔵 STUN Server: <span class="status online">Online</span></p>
                            <p>🔄 TURN Server: <span class="status online">Online</span></p>
                            <p>🌐 Signaling: <span class="status online">Online</span></p>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3>👥 Active Peers</h3>
                        <div id="peers">
                            <p>📍 Alice: Gathering candidates...</p>
                            <p>📍 Bob: Gathering candidates...</p>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h3>📡 Real-time Events</h3>
                    <div id="events" style="height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;">
                        <p class="event">🚀 NAT Traversal Monitor started</p>
                        <p class="event">🔍 Monitoring STUN, ICE, and signaling traffic...</p>
                    </div>
                </div>
                
                <div class="section">
                    <h3>🎓 Educational Information</h3>
                    <div class="grid">
                        <div>
                            <h4>RFC 5389 - STUN</h4>
                            <ul>
                                <li>Discovers public IP addresses</li>
                                <li>Identifies NAT types</li>
                                <li>Enables UDP hole punching</li>
                            </ul>
                        </div>
                        <div>
                            <h4>RFC 8445 - ICE</h4>
                            <ul>
                                <li>Comprehensive connectivity framework</li>
                                <li>Multiple candidate types</li>
                                <li>Systematic connectivity checking</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                const eventsDiv = document.getElementById('events');
                const ws = new WebSocket('ws://localhost:3000/ws');
                
                ws.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'event ' + (data.level || 'info');
                    eventDiv.innerHTML = '<span class="timestamp">' + data.timestamp + '</span> ' + data.message;
                    eventsDiv.appendChild(eventDiv);
                    eventsDiv.scrollTop = eventsDiv.scrollHeight;
                };
                
                ws.onopen = function() {
                    console.log('Monitor WebSocket connected');
                };
                
                ws.onerror = function(error) {
                    console.error('Monitor WebSocket error:', error);
                };
            </script>
        </body>
        </html>
        """
        return web.Response(text=html_content, content_type='text/html')
        
    async def broadcast_event(self, message, level='info'):
        """Broadcast event to all connected clients"""
        event = {
            'timestamp': datetime.utcnow().isoformat(),
            'message': message,
            'level': level
        }
        
        self.events.append(event)
        
        # Keep only last 1000 events
        if len(self.events) > 1000:
            self.events = self.events[-1000:]
            
        # Broadcast to all connected clients
        if self.websockets:
            event_json = json.dumps(event)
            disconnected = set()
            
            for ws in self.websockets:
                try:
                    await ws.send_str(event_json)
                except Exception:
                    disconnected.add(ws)
                    
            # Remove disconnected clients
            self.websockets -= disconnected
            
    async def simulate_events(self):
        """Simulate NAT traversal events for demonstration"""
        events = [
            "🏠 Alice: Generated host candidate 192.168.1.100:54321",
            "🌐 Alice: STUN discovery found public IP 203.0.113.50:12345",
            "🏠 Bob: Generated host candidate 10.0.0.200:43210", 
            "🌐 Bob: STUN discovery found public IP 198.51.100.75:54321",
            "🤝 Signaling: Exchanging ICE candidates between Alice and Bob",
            "🔗 ICE: Created 4 candidate pairs for connectivity testing",
            "🔍 ICE: Testing host -> host connection... SUCCESS",
            "🎯 ICE: Nominated direct host connection as optimal path",
            "✅ P2P connection established! Alice ↔ Bob direct connectivity"
        ]
        
        await asyncio.sleep(10)  # Wait for services to start
        
        for event in events:
            await self.broadcast_event(event)
            await asyncio.sleep(3)  # Space out events
            
        # Continue with periodic status updates
        while True:
            await asyncio.sleep(30)
            await self.broadcast_event("💓 NAT traversal demonstration active")
            
    async def run_monitor(self):
        """Run the NAT traversal monitor"""
        logger.info(f"📡 Starting NAT Monitor on {self.host}:{self.port}")
        
        app = web.Application()
        
        # Configure CORS
        cors = aiohttp_cors.setup(app)
        
        # Add routes
        app.router.add_get('/', self.index_handler)
        app.router.add_get('/ws', self.websocket_handler)
        
        # Configure CORS for all routes
        for route in list(app.router.routes()):
            cors.add(route, {
                "*": aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    expose_headers="*",
                    allow_headers="*",
                    allow_methods="*"
                )
            })
            
        # Start event simulation
        asyncio.create_task(self.simulate_events())
        
        logger.info("✅ NAT Monitor started successfully")
        logger.info(f"🌐 Web interface: http://localhost:{self.port}")
        
        # Run the web server
        runner = web.AppRunner(app)
        await runner.setup()
        
        site = web.TCPSite(runner, self.host, self.port)
        await site.start()
        
        try:
            await asyncio.Future()  # Run forever
        except KeyboardInterrupt:
            logger.info("🛑 NAT Monitor shutting down")
        finally:
            await runner.cleanup()

def main():
    import os
    
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 3000))
    
    print("📡 Educational NAT Traversal Monitor")
    print("=" * 50)
    print("🌐 Real-time visualization of STUN and ICE protocols")
    print("⚠️  For educational purposes only!")
    print()
    
    monitor = NATMonitor(host, port)
    
    try:
        asyncio.run(monitor.run_monitor())
    except KeyboardInterrupt:
        print("\n👋 NAT Monitor stopped")

if __name__ == "__main__":
    main()