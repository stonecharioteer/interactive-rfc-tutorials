export const getCodeExample = () => `"""
RFC 4787: UDP Hole Punching Implementation

This example demonstrates the UDP hole punching technique that enables
peer-to-peer connections across NATs with compliant behavior as defined
in RFC 4787. This is the foundation of how Tailscale establishes direct
connections between devices.
"""

import asyncio
import socket
import json
import time
import random
from typing import Dict, Optional, Protocol
from dataclasses import dataclass


@dataclass
class PeerAddress:
    ip: str
    port: int


@dataclass
class PeerInfo:
    id: str
    internal_address: PeerAddress
    external_address: PeerAddress
    nat_type: str


class CoordinationServer(Protocol):
    async def register(self, peer: PeerInfo) -> None: ...
    async def find_peer(self, peer_id: str) -> Optional[PeerInfo]: ...
    async def exchange_addresses(self, from_id: str, to_id: str) -> None: ...


class UDPHolePuncher:
    """
    UDP Hole Punching implementation using Python asyncio and sockets
    """
    
    def __init__(self, local_id: str, coordination_server: CoordinationServer):
        self.local_peer = PeerInfo(
            id=local_id,
            internal_address=PeerAddress(ip="192.168.1.100", port=0),  # Will be set when socket created
            external_address=PeerAddress(ip="", port=0),  # Discovered via STUN
            nat_type="unknown"
        )
        
        self.coordination_server = coordination_server
        self.socket: Optional[socket.socket] = None
        self.active_connections: Dict[str, PeerInfo] = {}
        self.keepalive_tasks: Dict[str, asyncio.Task] = {}
        
        print(f"🚀 UDP Hole Puncher initialized for {local_id}")
    
    async def initialize(self) -> None:
        """
        Phase 1: Initialize and discover our external address via STUN
        This creates the initial NAT mapping that peers will target
        """
        print("🚀 Phase 1: Initializing UDP Hole Puncher...")
        
        # Create UDP socket and bind to available port
        self.socket = await self._create_udp_socket()
        self.local_peer.internal_address.port = self.socket.getsockname()[1]
        
        print(f"📡 Local socket bound to {self.local_peer.internal_address.ip}:{self.local_peer.internal_address.port}")
        
        # Discover external address using STUN
        await self._discover_external_address()
        
        # Register with coordination server
        await self.coordination_server.register(self.local_peer)
        
        print(f"✅ Registered with coordination server as '{self.local_peer.id}'")
        print(f"📍 External address: {self.local_peer.external_address.ip}:{self.local_peer.external_address.port}")
        
        # Start packet handler
        asyncio.create_task(self._setup_packet_handler())
    
    async def connect_to_peer(self, peer_id: str) -> bool:
        """
        Phase 2: Establish peer-to-peer connection using hole punching
        This is the core RFC 4787 behavior that enables direct connectivity
        """
        print(f"\\n🔗 Phase 2: Attempting to connect to peer '{peer_id}'...")
        
        # Get peer information from coordination server
        remote_peer = await self.coordination_server.find_peer(peer_id)
        if not remote_peer:
            raise ValueError(f"Peer '{peer_id}' not found")
        
        print(f"📍 Remote peer external address: {remote_peer.external_address.ip}:{remote_peer.external_address.port}")
        
        # Coordinate simultaneous hole punching
        await self.coordination_server.exchange_addresses(self.local_peer.id, peer_id)
        
        # Perform simultaneous UDP hole punching
        connection_established = await self._perform_hole_punching(remote_peer)
        
        if connection_established:
            print(f"✅ Direct P2P connection established with '{peer_id}'!")
            print("🎯 This demonstrates RFC 4787 compliant NAT behavior")
            self.active_connections[peer_id] = remote_peer
            
            # Start keepalive to maintain NAT mapping
            await self._start_keepalive(peer_id)
            
            return True
        else:
            print(f"❌ Failed to establish direct connection with '{peer_id}'")
            print("🚫 This indicates non-compliant NAT behavior or firewall restrictions")
            return False
    
    async def _perform_hole_punching(self, remote_peer: PeerInfo) -> bool:
        """
        Core hole punching algorithm implementing RFC 4787 techniques
        """
        print("🕳️  Performing simultaneous UDP hole punching...")
        
        max_attempts = 10
        attempt_interval = 0.5  # seconds
        
        # Create event for connection success
        connection_event = asyncio.Event()
        
        async def response_handler():
            """Handle incoming responses during hole punching"""
            buffer = bytearray(1024)
            while not connection_event.is_set():
                try:
                    # Use non-blocking receive with timeout
                    self.socket.settimeout(0.1)
                    data, addr = self.socket.recvfrom(1024)
                    
                    if (addr[0] == remote_peer.external_address.ip and 
                        addr[1] == remote_peer.external_address.port):
                        print(f"📨 Received response from {addr[0]}:{addr[1]}")
                        print("🎉 Hole punching successful!")
                        connection_event.set()
                        return True
                        
                except socket.timeout:
                    continue
                except Exception as e:
                    print(f"⚠️  Error in response handler: {e}")
                    await asyncio.sleep(0.1)
            
            return False
        
        # Start response handler task
        handler_task = asyncio.create_task(response_handler())
        
        # Send packets to remote peer's external address
        # This creates the "hole" in our NAT that allows return traffic
        for attempt in range(1, max_attempts + 1):
            try:
                message = self._create_hole_punch_packet(attempt)
                
                print(f"📤 Attempt {attempt}: Sending to {remote_peer.external_address.ip}:{remote_peer.external_address.port}")
                
                await self._send_udp_packet(
                    message,
                    remote_peer.external_address.ip,
                    remote_peer.external_address.port
                )
                
                # RFC 4787 compliant NATs should now allow return traffic
                # from the remote peer's external address
                
                # Check if connection was established
                try:
                    await asyncio.wait_for(connection_event.wait(), timeout=attempt_interval)
                    handler_task.cancel()
                    return True
                except asyncio.TimeoutError:
                    continue
                
            except Exception as error:
                print(f"⚠️  Attempt {attempt} failed: {error}")
        
        # Cleanup
        handler_task.cancel()
        return False
    
    async def _discover_external_address(self) -> None:
        """
        Discover external address using STUN (RFC 5389)
        This creates the initial NAT mapping that RFC 4787 defines
        """
        print("🔍 Discovering external address via STUN...")
        
        stun_servers = [
            ("stun.l.google.com", 19302),
            ("stun.cloudflare.com", 3478)
        ]
        
        for server_host, server_port in stun_servers:
            try:
                print(f"📡 Querying {server_host}:{server_port}...")
                
                # Simulate STUN response with external address
                # Real implementation would parse STUN response packet
                external_address = await self._simulate_stun_query(server_host, server_port)
                
                self.local_peer.external_address = external_address
                print(f"📍 Discovered external address: {external_address.ip}:{external_address.port}")
                
                # Success - we have our external mapping
                break
                
            except Exception as error:
                print(f"⚠️  STUN server {server_host}:{server_port} failed: {error}")
        
        if not self.local_peer.external_address.ip:
            raise RuntimeError("Failed to discover external address via STUN")
    
    def _create_hole_punch_packet(self, attempt: int) -> bytes:
        """
        Create hole punch packet with connection attempt information
        """
        packet = {
            "type": "HOLE_PUNCH",
            "from_id": self.local_peer.id,
            "attempt": attempt,
            "timestamp": time.time(),
            "message": "RFC4787 UDP Hole Punching"
        }
        
        return json.dumps(packet).encode('utf-8')
    
    async def _send_udp_packet(self, data: bytes, ip: str, port: int) -> None:
        """
        Send UDP packet to specific destination
        """
        if not self.socket:
            raise RuntimeError("Socket not initialized")
        
        try:
            self.socket.sendto(data, (ip, port))
        except Exception as e:
            raise RuntimeError(f"Failed to send UDP packet: {e}")
    
    async def _start_keepalive(self, peer_id: str) -> None:
        """
        Start keepalive mechanism to maintain NAT mapping
        RFC 4787 recommends minimum 2-minute timeout, but we use shorter intervals
        """
        keepalive_interval = 30  # seconds
        
        async def keepalive_loop():
            while peer_id in self.active_connections:
                try:
                    peer = self.active_connections[peer_id]
                    
                    keepalive_packet = json.dumps({
                        "type": "KEEPALIVE",
                        "from_id": self.local_peer.id,
                        "timestamp": time.time()
                    }).encode('utf-8')
                    
                    await self._send_udp_packet(
                        keepalive_packet,
                        peer.external_address.ip,
                        peer.external_address.port
                    )
                    
                    print(f"💓 Sent keepalive to '{peer_id}'")
                    
                except Exception as error:
                    print(f"⚠️  Keepalive failed for '{peer_id}': {error}")
                
                await asyncio.sleep(keepalive_interval)
        
        # Start keepalive task
        task = asyncio.create_task(keepalive_loop())
        self.keepalive_tasks[peer_id] = task
        
        print(f"⏰ Started keepalive for '{peer_id}' (every {keepalive_interval}s)")
    
    async def send_to_peer(self, peer_id: str, data: str) -> bool:
        """
        Send application data over established P2P connection
        """
        if peer_id not in self.active_connections:
            print(f"❌ No active connection to '{peer_id}'")
            return False
        
        try:
            peer = self.active_connections[peer_id]
            
            data_packet = json.dumps({
                "type": "DATA",
                "from_id": self.local_peer.id,
                "payload": data,
                "timestamp": time.time()
            }).encode('utf-8')
            
            await self._send_udp_packet(
                data_packet,
                peer.external_address.ip,
                peer.external_address.port
            )
            
            print(f"📤 Sent data to '{peer_id}': {data[:50]}...")
            return True
            
        except Exception as error:
            print(f"❌ Failed to send data to '{peer_id}': {error}")
            return False
    
    async def _setup_packet_handler(self) -> None:
        """
        Handle incoming packets from established connections
        """
        if not self.socket:
            return
        
        self.socket.settimeout(1.0)  # 1 second timeout for non-blocking operation
        
        while True:
            try:
                data, addr = self.socket.recvfrom(1024)
                
                try:
                    packet = json.loads(data.decode('utf-8'))
                    
                    if packet["type"] == "HOLE_PUNCH":
                        print(f"📨 Received hole punch from {packet['from_id']}")
                        await self._respond_to_hole_punch(packet, addr)
                        
                    elif packet["type"] == "KEEPALIVE":
                        print(f"💓 Received keepalive from {packet['from_id']}")
                        
                    elif packet["type"] == "DATA":
                        print(f"📥 Received data from {packet['from_id']}: {packet['payload'][:50]}...")
                        
                    else:
                        print(f"❓ Unknown packet type: {packet['type']}")
                        
                except json.JSONDecodeError:
                    print("⚠️  Failed to parse incoming packet")
                    
            except socket.timeout:
                # Normal timeout, continue listening
                continue
            except Exception as e:
                print(f"⚠️  Error in packet handler: {e}")
                await asyncio.sleep(0.1)
    
    async def _respond_to_hole_punch(self, packet: dict, remote_addr: tuple) -> None:
        """
        Respond to hole punch attempt to complete connection
        """
        response = {
            "type": "HOLE_PUNCH_RESPONSE",
            "from_id": self.local_peer.id,
            "to_id": packet["from_id"],
            "original_attempt": packet["attempt"],
            "timestamp": time.time()
        }
        
        response_data = json.dumps(response).encode('utf-8')
        
        try:
            await self._send_udp_packet(response_data, remote_addr[0], remote_addr[1])
            print(f"📤 Sent hole punch response to {packet['from_id']}")
        except Exception as error:
            print(f"❌ Failed to send hole punch response: {error}")
    
    # Utility methods
    
    async def _create_udp_socket(self) -> socket.socket:
        """
        Create UDP socket for Python networking
        """
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        # Bind to random available port
        sock.bind(('0.0.0.0', 0))
        actual_port = sock.getsockname()[1]
        
        print(f"📡 Created UDP socket on port {actual_port}")
        return sock
    
    async def _simulate_stun_query(self, server_host: str, server_port: int) -> PeerAddress:
        """
        Simulate STUN query - in reality would use actual STUN protocol
        """
        # Simulate network delay
        await asyncio.sleep(0.1 + random.random() * 0.2)
        
        # Return simulated external address
        return PeerAddress(
            ip=f"203.0.113.{100 + random.randint(0, 50)}",
            port=12345 + random.randint(0, 1000)
        )
    
    def get_status(self) -> str:
        """
        Get comprehensive status report
        """
        connected_peers = '\\n'.join([f"   • {peer_id}" for peer_id in self.active_connections.keys()]) or "   None"
        
        return f'''
🔗 UDP Hole Puncher Status
============================

👤 Local Peer: {self.local_peer.id}
📍 Internal Address: {self.local_peer.internal_address.ip}:{self.local_peer.internal_address.port}
🌐 External Address: {self.local_peer.external_address.ip}:{self.local_peer.external_address.port}
🔗 Active Connections: {len(self.active_connections)}

📋 Connected Peers:
{connected_peers}

💡 This demonstrates RFC 4787 compliant NAT traversal:
   • Endpoint-independent mapping allows predictable external ports
   • Endpoint-independent filtering enables direct peer communication
   • UDP hole punching creates bidirectional communication paths
        '''.strip()


class MockCoordinationServer:
    """
    Mock coordination server for demonstration purposes
    """
    
    def __init__(self):
        self.peers: Dict[str, PeerInfo] = {}
    
    async def register(self, peer: PeerInfo) -> None:
        self.peers[peer.id] = peer
        print(f"📝 Server: Registered peer '{peer.id}'")
    
    async def find_peer(self, peer_id: str) -> Optional[PeerInfo]:
        return self.peers.get(peer_id)
    
    async def exchange_addresses(self, from_id: str, to_id: str) -> None:
        print(f"🤝 Server: Coordinating connection between '{from_id}' and '{to_id}'")
        # In reality, this would notify both peers to start hole punching


# Usage Example: Connect two peers directly
async def demonstrate_hole_punching():
    """
    RFC 4787 UDP Hole Punching Demonstration
    This shows how Tailscale establishes direct connections!
    """
    print("🚀 RFC 4787 UDP Hole Punching Demonstration")
    print("This shows how Tailscale establishes direct connections!")
    
    # Create coordination server
    coordination_server = MockCoordinationServer()
    
    # Create two peers
    peer1 = UDPHolePuncher("device-laptop", coordination_server)
    peer2 = UDPHolePuncher("device-phone", coordination_server)
    
    try:
        # Initialize both peers
        await peer1.initialize()
        await peer2.initialize()
        
        print("\\n" + peer1.get_status())
        print("\\n" + peer2.get_status())
        
        # Attempt peer-to-peer connection
        connected = await peer1.connect_to_peer("device-phone")
        
        if connected:
            print("\\n🎉 Success! Direct P2P connection established!")
            print("🚀 This is how Tailscale creates its 'magic' direct connections")
            
            # Demonstrate data exchange
            await peer1.send_to_peer("device-phone", "Hello from laptop! 🖥️")
            
            print("\\n💡 Key RFC 4787 behaviors demonstrated:")
            print("   ✅ Endpoint-independent mapping (same external port)")
            print("   ✅ Endpoint-independent filtering (any host can reach)")
            print("   ✅ UDP hole punching creates bidirectional communication")
            print("   ✅ Keepalive maintains NAT mapping")
            
        else:
            print("\\n❌ Connection failed - likely due to:")
            print("   • Address/port-dependent NAT mapping")
            print("   • Address/port-dependent NAT filtering")
            print("   • Symmetric NAT configuration")
            print("   • Firewall blocking UDP traffic")
            print("\\n🔄 In this case, Tailscale would use DERP relay servers")
            
    except Exception as error:
        print(f"❌ Demonstration failed: {error}")


# Python P2P Networking Libraries
def show_python_p2p_libraries():
    """
    Real Python libraries for P2P networking and NAT traversal
    """
    print("\\n📚 Python P2P Networking Libraries:")
    
    print("\\n🔧 socket - Built-in UDP implementation:")
    print('''import socket
import asyncio

# Basic UDP hole punching
async def punch_hole(peer_ip, peer_port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('0.0.0.0', 0))
    
    # Send punch packet
    sock.sendto(b"PUNCH", (peer_ip, peer_port))
    
    # Listen for response
    data, addr = sock.recvfrom(1024)
    print(f"Connection established with {addr}")
    return sock''')
    
    print("\\n🔧 aiortc - WebRTC with ICE (includes STUN/TURN):")
    print('''# Install: pip install aiortc
from aiortc import RTCPeerConnection, RTCSessionDescription

async def create_p2p_connection():
    pc = RTCPeerConnection()
    
    # Configure ICE servers for NAT traversal
    pc.configuration = {
        "iceServers": [
            {"urls": "stun:stun.l.google.com:19302"},
            {"urls": "turn:turn.example.com", "username": "user", "credential": "pass"}
        ]
    }
    
    # WebRTC handles all NAT traversal automatically
    return pc''')
    
    print("\\n🔧 pystun - STUN protocol implementation:")
    print('''# Install: pip install pystun
import stun

# Discover external IP and NAT type
nat_type, external_ip, external_port = stun.get_ip_info()

print(f"NAT Type: {nat_type}")
print(f"External: {external_ip}:{external_port}")

# Use this info for hole punching coordination''')


if __name__ == "__main__":
    asyncio.run(demonstrate_hole_punching())
    show_python_p2p_libraries()
`;

export default { getCodeExample };