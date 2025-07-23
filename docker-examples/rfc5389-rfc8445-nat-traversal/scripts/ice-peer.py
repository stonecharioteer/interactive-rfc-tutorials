#!/usr/bin/env python3
"""
Educational ICE Peer Implementation
Demonstrates RFC 8445 ICE (Interactive Connectivity Establishment) for peer-to-peer connectivity.
"""

import asyncio
import socket
import json
import struct
import secrets
import time
import logging
import websockets
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CandidateType(Enum):
    HOST = "host"
    SRFLX = "srflx"  # Server reflexive (STUN)
    PRFLX = "prflx"  # Peer reflexive
    RELAY = "relay"  # TURN relay

class CheckState(Enum):
    WAITING = "waiting"
    IN_PROGRESS = "in_progress"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    FROZEN = "frozen"

@dataclass
class ICECandidate:
    """ICE candidate representation"""
    foundation: str
    component: int
    transport: str
    priority: int
    address: str
    port: int
    type: CandidateType
    related_address: Optional[str] = None
    related_port: Optional[int] = None
    
    def to_dict(self):
        return {
            'foundation': self.foundation,
            'component': self.component,
            'transport': self.transport,
            'priority': self.priority,
            'address': self.address,
            'port': self.port,
            'type': self.type.value,
            'related_address': self.related_address,
            'related_port': self.related_port
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            foundation=data['foundation'],
            component=data['component'],
            transport=data['transport'],
            priority=data['priority'],
            address=data['address'],
            port=data['port'],
            type=CandidateType(data['type']),
            related_address=data.get('related_address'),
            related_port=data.get('related_port')
        )

@dataclass
class CandidatePair:
    """ICE candidate pair for connectivity checking"""
    local: ICECandidate
    remote: ICECandidate
    priority: int
    state: CheckState = CheckState.FROZEN
    nominated: bool = False

class STUNClient:
    """Simple STUN client for candidate gathering"""
    
    MAGIC_COOKIE = 0x2112A442
    BINDING_REQUEST = 0x0001
    XOR_MAPPED_ADDRESS = 0x0020
    
    @staticmethod
    async def discover_public_address(stun_server: str) -> Optional[Tuple[str, int]]:
        """Discover public address using STUN"""
        try:
            host, port = stun_server.split(':')
            port = int(port)
            
            # Create STUN Binding Request
            transaction_id = secrets.token_bytes(12)
            message = struct.pack('>HHI12s', 
                                STUNClient.BINDING_REQUEST, 
                                0, 
                                STUNClient.MAGIC_COOKIE, 
                                transaction_id)
            
            # Send request
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(5.0)
            sock.sendto(message, (host, port))
            
            # Receive response
            response, _ = sock.recvfrom(1024)
            sock.close()
            
            # Parse response
            if len(response) < 20:
                return None
                
            # Parse header
            msg_type, msg_len, magic, tx_id = struct.unpack('>HHI12s', response[:20])
            
            if tx_id != transaction_id:
                return None
                
            # Parse attributes
            offset = 20
            while offset < len(response):
                if offset + 4 > len(response):
                    break
                    
                attr_type, attr_len = struct.unpack('>HH', response[offset:offset+4])
                attr_value = response[offset+4:offset+4+attr_len]
                
                if attr_type == STUNClient.XOR_MAPPED_ADDRESS and len(attr_value) >= 8:
                    # Decode XOR-MAPPED-ADDRESS
                    family, xor_port, xor_addr = struct.unpack('>HHI', attr_value[:8])
                    
                    # Undo XOR
                    port = xor_port ^ (STUNClient.MAGIC_COOKIE >> 16)
                    addr_int = xor_addr ^ STUNClient.MAGIC_COOKIE
                    address = socket.inet_ntoa(struct.pack('>I', addr_int))
                    
                    return address, port
                    
                # Move to next attribute
                offset += 4 + attr_len
                if attr_len % 4:
                    offset += 4 - (attr_len % 4)
                    
            return None
            
        except Exception as e:
            logger.error(f"STUN discovery failed: {e}")
            return None

class ICEPeer:
    """Educational ICE peer implementation"""
    
    def __init__(self, name: str, stun_server: str, signaling_server: str):
        self.name = name
        self.stun_server = stun_server
        self.signaling_server = signaling_server
        
        self.local_candidates: List[ICECandidate] = []
        self.remote_candidates: List[ICECandidate] = []
        self.candidate_pairs: List[CandidatePair] = []
        self.nominated_pair: Optional[CandidatePair] = None
        
        self.websocket = None
        self.running = False
        
    def calculate_priority(self, candidate_type: CandidateType, local_pref: int = 65535, component: int = 1) -> int:
        """Calculate ICE candidate priority (RFC 8445)"""
        type_preferences = {
            CandidateType.HOST: 126,
            CandidateType.PRFLX: 110,
            CandidateType.SRFLX: 100,
            CandidateType.RELAY: 0
        }
        
        type_pref = type_preferences[candidate_type]
        return (type_pref << 24) + (local_pref << 8) + (256 - component)
        
    def get_local_interfaces(self) -> List[str]:
        """Get local network interfaces"""
        interfaces = []
        try:
            # Get local IP by connecting to a remote address
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            interfaces.append(local_ip)
        except:
            interfaces.append("127.0.0.1")
            
        return interfaces
        
    async def gather_host_candidates(self) -> List[ICECandidate]:
        """Gather host candidates from local interfaces"""
        candidates = []
        interfaces = self.get_local_interfaces()
        
        logger.info(f"🏠 Gathering host candidates from {len(interfaces)} interfaces")
        
        for i, interface in enumerate(interfaces):
            # Create UDP socket to get available port
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.bind((interface, 0))
            port = sock.getsockname()[1]
            sock.close()
            
            candidate = ICECandidate(
                foundation=str(i + 1),
                component=1,
                transport="udp",
                priority=self.calculate_priority(CandidateType.HOST, 65535 - i * 1000),
                address=interface,
                port=port,
                type=CandidateType.HOST
            )
            
            candidates.append(candidate)
            logger.info(f"   📍 Host candidate: {interface}:{port}")
            
        return candidates
        
    async def gather_server_reflexive_candidates(self) -> List[ICECandidate]:
        """Gather server reflexive candidates using STUN"""
        candidates = []
        
        logger.info(f"🌐 Gathering server reflexive candidates via STUN: {self.stun_server}")
        
        public_addr = await STUNClient.discover_public_address(self.stun_server)
        if public_addr:
            public_ip, public_port = public_addr
            
            candidate = ICECandidate(
                foundation="100",
                component=1,
                transport="udp",
                priority=self.calculate_priority(CandidateType.SRFLX),
                address=public_ip,
                port=public_port,
                type=CandidateType.SRFLX,
                related_address=self.local_candidates[0].address if self.local_candidates else "0.0.0.0",
                related_port=self.local_candidates[0].port if self.local_candidates else 0
            )
            
            candidates.append(candidate)
            logger.info(f"   🌍 Server reflexive candidate: {public_ip}:{public_port}")
        else:
            logger.warning("   ❌ STUN discovery failed")
            
        return candidates
        
    async def gather_candidates(self):
        """Gather all ICE candidates"""
        logger.info(f"🧊 Starting ICE candidate gathering for {self.name}")
        
        # Gather host candidates
        host_candidates = await self.gather_host_candidates()
        self.local_candidates.extend(host_candidates)
        
        # Gather server reflexive candidates  
        srflx_candidates = await self.gather_server_reflexive_candidates()
        self.local_candidates.extend(srflx_candidates)
        
        # Sort by priority (higher = better)
        self.local_candidates.sort(key=lambda c: c.priority, reverse=True)
        
        logger.info(f"✅ Candidate gathering complete: {len(self.local_candidates)} candidates")
        for i, candidate in enumerate(self.local_candidates):
            logger.info(f"   {i+1}. {candidate.type.value}: {candidate.address}:{candidate.port} (priority: {candidate.priority})")
            
    async def connect_signaling(self):
        """Connect to signaling server"""
        try:
            uri = f"ws://{self.signaling_server}"
            logger.info(f"🔗 Connecting to signaling server: {uri}")
            
            self.websocket = await websockets.connect(uri)
            
            # Register with signaling server
            register_msg = {
                'type': 'register',
                'peer_name': self.name
            }
            await self.websocket.send(json.dumps(register_msg))
            
            logger.info(f"✅ Connected to signaling server as '{self.name}'")
            
        except Exception as e:
            logger.error(f"Failed to connect to signaling server: {e}")
            raise
            
    async def exchange_candidates(self, remote_peer: str):
        """Exchange ICE candidates with remote peer"""
        if not self.websocket:
            raise RuntimeError("Not connected to signaling server")
            
        logger.info(f"🤝 Exchanging candidates with {remote_peer}")
        
        # Send our candidates
        for candidate in self.local_candidates:
            message = {
                'type': 'ice_candidate',
                'to': remote_peer,
                'from': self.name,
                'candidate': candidate.to_dict()
            }
            await self.websocket.send(json.dumps(message))
            
        logger.info(f"📤 Sent {len(self.local_candidates)} candidates to {remote_peer}")
        
        # Wait for remote candidates
        while len(self.remote_candidates) == 0:
            try:
                message = await asyncio.wait_for(self.websocket.recv(), timeout=10.0)
                data = json.loads(message)
                
                if data['type'] == 'ice_candidate' and data['from'] == remote_peer:
                    candidate = ICECandidate.from_dict(data['candidate'])
                    self.remote_candidates.append(candidate)
                    logger.info(f"📥 Received candidate from {remote_peer}: {candidate.type.value} {candidate.address}:{candidate.port}")
                    
            except asyncio.TimeoutError:
                logger.warning("⏰ No candidates received, continuing with available ones")
                break
                
        logger.info(f"✅ Candidate exchange complete: {len(self.remote_candidates)} remote candidates")
        
    def create_candidate_pairs(self):
        """Create candidate pairs for connectivity checking"""
        logger.info("🔗 Creating candidate pairs")
        
        pairs = []
        for local in self.local_candidates:
            for remote in self.remote_candidates:
                if local.transport == remote.transport:
                    # Calculate pair priority
                    G = min(local.priority, remote.priority)
                    D = max(local.priority, remote.priority)
                    priority = (1 << 32) * G + 2 * D + (1 if local.priority > remote.priority else 0)
                    
                    pair = CandidatePair(local, remote, priority)
                    pairs.append(pair)
                    
        # Sort by priority
        pairs.sort(key=lambda p: p.priority, reverse=True)
        self.candidate_pairs = pairs
        
        logger.info(f"📊 Created {len(pairs)} candidate pairs")
        for i, pair in enumerate(pairs[:3]):  # Show top 3
            logger.info(f"   {i+1}. {pair.local.type.value} -> {pair.remote.type.value} (priority: {pair.priority})")
            
    async def perform_connectivity_check(self, pair: CandidatePair) -> bool:
        """Perform connectivity check on candidate pair"""
        logger.info(f"🔍 Checking {pair.local.address}:{pair.local.port} -> {pair.remote.address}:{pair.remote.port}")
        
        pair.state = CheckState.IN_PROGRESS
        
        try:
            # Create test socket
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(2.0)
            
            # Bind to local candidate address
            sock.bind((pair.local.address, pair.local.port))
            
            # Send test message
            test_message = f"ICE-CHECK-{self.name}-{int(time.time())}".encode()
            sock.sendto(test_message, (pair.remote.address, pair.remote.port))
            
            # Wait for response (in real implementation, this would be a STUN Binding Request/Response)
            try:
                response, addr = sock.recvfrom(1024) 
                if addr == (pair.remote.address, pair.remote.port):
                    pair.state = CheckState.SUCCEEDED
                    logger.info(f"   ✅ Connectivity check succeeded")
                    return True
            except socket.timeout:
                pass
                
            pair.state = CheckState.FAILED
            logger.info(f"   ❌ Connectivity check failed")
            return False
            
        except Exception as e:
            pair.state = CheckState.FAILED
            logger.error(f"   ❌ Connectivity check error: {e}")
            return False
        finally:
            try:
                sock.close()
            except:
                pass
                
    async def run_connectivity_checks(self):
        """Run ICE connectivity checks"""
        logger.info("🏃 Running ICE connectivity checks")
        
        # Unfreeze top priority pairs
        for pair in self.candidate_pairs[:3]:
            pair.state = CheckState.WAITING
            
        # Run checks
        check_tasks = []
        for pair in self.candidate_pairs:
            if pair.state == CheckState.WAITING:
                check_tasks.append(self.perform_connectivity_check(pair))
                
        if check_tasks:
            results = await asyncio.gather(*check_tasks, return_exceptions=True)
            
        # Find nominated pair (first successful pair)
        for pair in self.candidate_pairs:
            if pair.state == CheckState.SUCCEEDED:
                self.nominated_pair = pair
                pair.nominated = True
                
                logger.info(f"🎯 Nominated pair selected:")
                logger.info(f"   Local: {pair.local.address}:{pair.local.port} ({pair.local.type.value})")
                logger.info(f"   Remote: {pair.remote.address}:{pair.remote.port} ({pair.remote.type.value})")
                break
                
        if not self.nominated_pair:
            logger.error("❌ No successful candidate pairs found")
            return False
            
        return True
        
    async def establish_connection(self, remote_peer: str):
        """Establish ICE connection with remote peer"""
        logger.info(f"🚀 Establishing ICE connection with {remote_peer}")
        
        try:
            # Connect to signaling server
            await self.connect_signaling()
            
            # Gather local candidates
            await self.gather_candidates()
            
            # Exchange candidates with remote peer
            await self.exchange_candidates(remote_peer)
            
            # Create candidate pairs
            self.create_candidate_pairs()
            
            # Run connectivity checks
            success = await self.run_connectivity_checks()
            
            if success:
                logger.info("🎉 ICE connection establishment successful!")
                logger.info(f"   Connection established via {self.nominated_pair.local.type.value} -> {self.nominated_pair.remote.type.value}")
                return True
            else:
                logger.error("💔 ICE connection establishment failed")
                return False
                
        except Exception as e:
            logger.error(f"Error establishing ICE connection: {e}")
            return False
            
    async def run(self):
        """Run the ICE peer"""
        import os
        remote_peer = "bob" if self.name == "alice" else "alice"
        
        logger.info(f"👋 Starting ICE peer: {self.name}")
        logger.info(f"🎯 Target peer: {remote_peer}")
        
        # Wait a bit for other services to start
        await asyncio.sleep(5)
        
        success = await self.establish_connection(remote_peer)
        
        if success:
            # Keep connection alive for demonstration
            logger.info("🔄 Keeping connection alive for demonstration...")
            while True:
                await asyncio.sleep(30)
                logger.info("💓 Connection still active")
        else:
            logger.error("Failed to establish connection")

def main():
    """Main ICE peer entry point"""
    import os
    
    peer_name = os.getenv('PEER_NAME', 'alice')
    stun_server = os.getenv('STUN_SERVER', '172.20.0.10:3478')
    signaling_server = os.getenv('SIGNALING_SERVER', '172.20.0.30:8080')
    
    print(f"🧊 Educational ICE Peer: {peer_name}")
    print("=" * 50)
    print("📖 RFC 8445: Interactive Connectivity Establishment")
    print("⚠️  For educational purposes only!")
    print()
    
    peer = ICEPeer(peer_name, stun_server, signaling_server)
    
    try:
        asyncio.run(peer.run())
    except KeyboardInterrupt:
        print(f"\n👋 ICE peer {peer_name} stopped")

if __name__ == "__main__":
    main()