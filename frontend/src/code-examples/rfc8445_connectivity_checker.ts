export const code = `# ICE Connectivity Checking Implementation

import asyncio
import random
from dataclasses import dataclass
from enum import Enum
from typing import List, Optional

from rfc8445_ice_gatherer import ICECandidate, CandidateType

class CheckState(Enum):
    WAITING = "waiting"
    IN_PROGRESS = "in_progress"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    FROZEN = "frozen"

@dataclass
class CandidatePair:
    local_candidate: ICECandidate
    remote_candidate: ICECandidate
    priority: int
    state: CheckState = CheckState.FROZEN
    nominated: bool = False

class ICEConnectivityChecker:
    def __init__(self, local_candidates, remote_candidates):
        self.local_candidates = local_candidates
        self.remote_candidates = remote_candidates
        self.candidate_pairs: List[CandidatePair] = []
        self.nominated_pair: Optional[CandidatePair] = None

    def create_candidate_pairs(self) -> List[CandidatePair]:
        pairs = []

        for local in self.local_candidates:
            for remote in self.remote_candidates:
                if local.transport == remote.transport:
                    # Calculate pair priority according to RFC 8445
                    G = min(local.priority, remote.priority)
                    D = max(local.priority, remote.priority)
                    priority = (1 << 32) * G + 2 * D + (1 if local.priority > remote.priority else 0)

                    pair = CandidatePair(local, remote, priority)
                    pairs.append(pair)

        # Sort by priority (higher = better)
        pairs.sort(key=lambda p: p.priority, reverse=True)
        self.candidate_pairs = pairs
        return pairs

    async def perform_connectivity_check(self, pair: CandidatePair) -> bool:
        print(f"🔍 Checking {pair.local_candidate.connection_address}:{pair.local_candidate.port} -> {pair.remote_candidate.connection_address}:{pair.remote_candidate.port}")

        pair.state = CheckState.IN_PROGRESS

        try:
            # In real implementation, this would send STUN Binding Request
            # For demonstration, simulate the check
            success_probability = {
                (CandidateType.HOST, CandidateType.HOST): 0.95,
                (CandidateType.SRFLX, CandidateType.SRFLX): 0.80,
                (CandidateType.RELAY, CandidateType.RELAY): 0.99,
            }.get((pair.local_candidate.candidate_type, pair.remote_candidate.candidate_type), 0.60)

            # Simulate network delay and success/failure
            await asyncio.sleep(0.1)
            success = random.random() < success_probability

            if success:
                pair.state = CheckState.SUCCEEDED
                print(f"   ✅ Connectivity check succeeded")
                return True
            else:
                pair.state = CheckState.FAILED
                print(f"   ❌ Connectivity check failed")
                return False

        except Exception as e:
            pair.state = CheckState.FAILED
            print(f"   ❌ Connectivity check failed: {e}")
            return False`;
