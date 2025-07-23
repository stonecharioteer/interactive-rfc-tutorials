export const code = `# ICE Fundamental Concepts

from dataclasses import dataclass
from typing import List, Optional
from enum import Enum

class CandidateType(Enum):
    HOST = "host"           # Local interface address
    SRFLX = "srflx"         # Server reflexive (STUN discovered)
    PRFLX = "prflx"         # Peer reflexive (learned from peer)
    RELAY = "relay"         # Relayed through TURN server

@dataclass
class ICECandidate:
    foundation: str                    # Grouping identifier
    component_id: int                  # RTP=1, RTCP=2, etc.
    transport: str                     # UDP/TCP/TLS
    priority: int                      # Candidate preference (higher = better)
    connection_address: str            # IP address
    port: int                         # Port number
    candidate_type: CandidateType     # host/srflx/prflx/relay
    related_address: Optional[str] = None    # Base address for derived candidates
    related_port: Optional[int] = None       # Base port for derived candidates`;
