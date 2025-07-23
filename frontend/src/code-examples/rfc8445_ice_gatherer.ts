export const code = `# ICE Candidate Gathering Implementation

import asyncio
import socket
from typing import List
from enum import Enum
from dataclasses import dataclass

class CandidateType(Enum):
    HOST = "host"
    SRFLX = "srflx"  # Server Reflexive
    PRFLX = "prflx"  # Peer Reflexive
    RELAY = "relay"

@dataclass
class ICECandidate:
    foundation: str
    component_id: int
    transport: str
    priority: int
    connection_address: str
    port: int
    candidate_type: CandidateType
    related_address: str = None
    related_port: int = None

class ICEGatherer:
    def __init__(self, stun_servers=None, turn_servers=None):
        self.stun_servers = stun_servers or ["stun.l.google.com:19302"]
        self.turn_servers = turn_servers or []
        self.candidates: List[ICECandidate] = []

    def discover_local_interfaces(self) -> List[str]:
        interfaces = []
        try:
            # Get all local IP addresses
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            interfaces.append(local_ip)
        except Exception:
            interfaces = ["127.0.0.1"]  # Fallback
        return interfaces

    def generate_host_candidates(self) -> List[ICECandidate]:
        candidates = []
        interfaces = self.discover_local_interfaces()

        for i, interface in enumerate(interfaces):
            candidate = ICECandidate(
                foundation=str(i + 1),
                component_id=1,
                transport="udp",
                priority=self.calculate_priority(CandidateType.HOST, 65535 - i * 1000),
                connection_address=interface,
                port=0,  # Will be assigned when socket is created
                candidate_type=CandidateType.HOST
            )
            candidates.append(candidate)
        return candidates

    async def gather_server_reflexive_candidates(self) -> List[ICECandidate]:
        candidates = []
        for stun_server in self.stun_servers:
            try:
                # Use STUN to discover public address
                public_ip, public_port = await self.stun_discovery(stun_server)

                candidate = ICECandidate(
                    foundation="100",
                    component_id=1,
                    transport="udp",
                    priority=self.calculate_priority(CandidateType.SRFLX),
                    connection_address=public_ip,
                    port=public_port,
                    candidate_type=CandidateType.SRFLX,
                    related_address="192.168.1.100",  # Local interface
                    related_port=54321
                )
                candidates.append(candidate)
            except Exception as e:
                print(f"STUN server {stun_server} failed: {e}")
        return candidates`;
