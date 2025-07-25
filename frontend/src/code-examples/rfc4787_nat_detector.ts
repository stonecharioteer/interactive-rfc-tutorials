export const getCodeExample = () => `"""
RFC 4787: NAT Behavior Detection Implementation

This example demonstrates how to detect NAT mapping and filtering behaviors
using multiple STUN servers, which is essential for determining the best
peer-to-peer connection strategy.
"""

import asyncio
import socket
import struct
import random
import time
from typing import Dict, List, Optional, NamedTuple
from dataclasses import dataclass
from enum import Enum


@dataclass
class STUNServer:
    host: str
    port: int
    name: str


@dataclass
class NATMapping:
    internal_address: str
    internal_port: int
    external_address: str
    external_port: int
    server: str


class MappingBehavior(Enum):
    ENDPOINT_INDEPENDENT = "endpoint-independent"
    ADDRESS_DEPENDENT = "address-dependent"
    ADDRESS_PORT_DEPENDENT = "address-port-dependent"


class FilteringBehavior(Enum):
    ENDPOINT_INDEPENDENT = "endpoint-independent"
    ADDRESS_DEPENDENT = "address-dependent"
    ADDRESS_PORT_DEPENDENT = "address-port-dependent"


class NATBehaviorDetector:
    """
    NAT Behavior Detection using STUN protocol implementation in Python
    """
    
    def __init__(self):
        self.stun_servers = [
            STUNServer(host="stun.l.google.com", port=19302, name="Google"),
            STUNServer(host="stun1.l.google.com", port=19302, name="Google-1"),
            STUNServer(host="stun.cloudflare.com", port=3478, name="Cloudflare"),
            STUNServer(host="stun.nextcloud.com", port=443, name="Nextcloud")
        ]
        
        self.mappings: List[NATMapping] = []
        print("🚀 NAT Behavior Detector initialized")
    
    async def detect_mapping_behavior(self) -> MappingBehavior:
        """
        Phase 1: Detect NAT mapping behavior
        
        Tests whether the NAT uses the same external port when contacting
        different destinations from the same internal address:port
        """
        print("🔍 Testing NAT Mapping Behavior...")
        
        # Create UDP socket bound to specific port
        sock = await self._create_udp_socket(5000)
        
        # Test with multiple STUN servers
        for server in self.stun_servers[:3]:
            try:
                mapping = await self._perform_stun_binding(sock, server)
                self.mappings.append(mapping)
                
                print(f"📍 {server.name}: Internal {mapping.internal_address}:{mapping.internal_port} -> External {mapping.external_address}:{mapping.external_port}")
            except Exception as error:
                print(f"⚠️  Failed to contact {server.name}: {error}")
        
        sock.close()
        return self._analyze_mapping_behavior()
    
    async def detect_filtering_behavior(self) -> FilteringBehavior:
        """
        Phase 2: Detect NAT filtering behavior
        
        Tests whether external hosts can send packets to the NAT's external
        mapping without the internal host having contacted them first
        """
        print("🔍 Testing NAT Filtering Behavior...")
        
        if not self.mappings:
            raise ValueError("Must detect mapping behavior first")
        
        primary_mapping = self.mappings[0]
        
        # Test if unknown hosts can reach us through the mapping
        filtering_tests = await asyncio.gather(
            self._test_direct_reachability(primary_mapping),
            self._test_from_different_address(primary_mapping),
            self._test_from_different_port(primary_mapping),
            return_exceptions=True
        )
        
        return self._analyze_filtering_behavior(filtering_tests)
    
    def _analyze_mapping_behavior(self) -> MappingBehavior:
        """
        Analyze mapping behavior based on external port consistency
        """
        if len(self.mappings) < 2:
            print("⚠️  Insufficient data for mapping analysis")
            return MappingBehavior.ENDPOINT_INDEPENDENT  # Conservative assumption
        
        external_ports = [mapping.external_port for mapping in self.mappings]
        unique_ports = set(external_ports)
        
        if len(unique_ports) == 1:
            print("✅ Endpoint-Independent Mapping detected!")
            print("   Same external port used for all destinations")
            print("   🎯 Excellent for peer-to-peer applications")
            return MappingBehavior.ENDPOINT_INDEPENDENT
        else:
            print("❌ Address-Dependent or Address/Port-Dependent Mapping")
            print("   Different external ports for different destinations")
            print("   🚫 Challenging for peer-to-peer connections")
            
            # Could do more sophisticated analysis here to distinguish
            # between address-dependent and address/port-dependent
            return MappingBehavior.ADDRESS_DEPENDENT
    
    def _analyze_filtering_behavior(self, test_results: List) -> FilteringBehavior:
        """
        Analyze filtering behavior based on reachability tests
        """
        direct_test, address_test, port_test = test_results
        
        if not isinstance(direct_test, Exception) and direct_test:
            print("✅ Endpoint-Independent Filtering detected!")
            print("   Any external host can reach the mapping")
            print("   🎯 Perfect for Tailscale direct connections")
            return FilteringBehavior.ENDPOINT_INDEPENDENT
        
        if not isinstance(address_test, Exception) and address_test:
            print("⚠️  Address-Dependent Filtering detected")
            print("   Only contacted addresses can reach the mapping")
            print("   🔄 Requires UDP hole punching coordination")
            return FilteringBehavior.ADDRESS_DEPENDENT
        
        print("❌ Address/Port-Dependent Filtering detected")
        print("   Only exact contacted address:port can reach mapping")
        print("   🚫 Very challenging for peer-to-peer connections")
        return FilteringBehavior.ADDRESS_PORT_DEPENDENT
    
    async def _perform_stun_binding(self, sock: socket.socket, server: STUNServer) -> NATMapping:
        """
        Simulate STUN binding request to discover external mapping
        """
        # In a real implementation, this would:
        # 1. Send STUN Binding Request to server
        # 2. Parse STUN Binding Response
        # 3. Extract XOR-MAPPED-ADDRESS attribute
        
        # Simulated response for educational purposes
        simulated_external = self._simulate_nat_mapping(server)
        
        return NATMapping(
            internal_address="192.168.1.100",
            internal_port=5000,
            external_address=simulated_external["address"],
            external_port=simulated_external["port"],
            server=server.name
        )
    
    def _simulate_nat_mapping(self, server: STUNServer) -> Dict[str, any]:
        """
        Simulate NAT mapping based on behavior type
        """
        # Simulate endpoint-independent mapping (same external port)
        base_port = 12345
        
        # For demonstration - in reality, this depends on actual NAT behavior
        return {
            "address": "203.0.113.1",  # Our simulated external IP
            "port": base_port + (0 if server.name == "Google" else 1)  # Vary port for demo
        }
    
    async def _test_direct_reachability(self, mapping: NATMapping) -> bool:
        """
        Test if external hosts can reach our mapping directly
        """
        print("🧪 Testing direct reachability...")
        
        # In reality, this would involve coordinating with a test server
        # to send packets directly to our external mapping
        
        # Simulate based on common NAT behaviors
        await asyncio.sleep(0.1)  # Simulate network delay
        return random.random() > 0.4  # ~60% of NATs allow this
    
    async def _test_from_different_address(self, mapping: NATMapping) -> bool:
        """
        Test filtering from different source address
        """
        print("🧪 Testing address-dependent filtering...")
        await asyncio.sleep(0.1)
        return random.random() > 0.6  # Fewer NATs allow this
    
    async def _test_from_different_port(self, mapping: NATMapping) -> bool:
        """
        Test filtering from different source port
        """
        print("🧪 Testing port-dependent filtering...")
        await asyncio.sleep(0.1)
        return random.random() > 0.8  # Even fewer NATs allow this
    
    async def _create_udp_socket(self, port: int) -> socket.socket:
        """
        Create UDP socket helper for Python networking
        """
        print(f"📡 Creating UDP socket on port {port}")
        
        # Create actual UDP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            sock.bind(('0.0.0.0', port))
            print(f"   ✅ Successfully bound to port {port}")
        except OSError as e:
            print(f"   ⚠️  Failed to bind to port {port}: {e}")
            # Try random port
            sock.bind(('0.0.0.0', 0))
            actual_port = sock.getsockname()[1]
            print(f"   📡 Using random port {actual_port}")
        
        return sock
    
    async def generate_nat_report(self) -> str:
        """
        Generate comprehensive NAT behavior report
        """
        mapping_behavior = await self.detect_mapping_behavior()
        filtering_behavior = await self.detect_filtering_behavior()
        
        # Determine P2P compatibility based on behavior combination
        if (mapping_behavior == MappingBehavior.ENDPOINT_INDEPENDENT and 
            filtering_behavior == FilteringBehavior.ENDPOINT_INDEPENDENT):
            p2p_compatibility = "Excellent"
            tailscale_effectiveness = "Direct connections work reliably"
        elif mapping_behavior == MappingBehavior.ENDPOINT_INDEPENDENT:
            p2p_compatibility = "Good"
            tailscale_effectiveness = "Direct connections with coordination"
        else:
            p2p_compatibility = "Challenging"
            tailscale_effectiveness = "May require DERP relay servers"
        
        mappings_text = '\\n'.join([
            f"   • {m.server}: {m.internal_address}:{m.internal_port} -> {m.external_address}:{m.external_port}"
            for m in self.mappings
        ])
        
        recommendations = self._generate_recommendations(mapping_behavior, filtering_behavior)
        
        return f'''
🔍 NAT Behavior Analysis Report
=====================================

📍 Mapping Behavior: {mapping_behavior.value}
🔒 Filtering Behavior: {filtering_behavior.value}

🎯 P2P Compatibility: {p2p_compatibility}
🚀 Tailscale Effectiveness: {tailscale_effectiveness}

📊 Discovered Mappings:
{mappings_text}

💡 Recommendations:
{recommendations}
        '''.strip()
    
    def _generate_recommendations(self, mapping: MappingBehavior, filtering: FilteringBehavior) -> str:
        """
        Generate specific recommendations based on detected NAT behavior
        """
        recommendations = []
        
        if mapping != MappingBehavior.ENDPOINT_INDEPENDENT:
            recommendations.append("• Consider upgrading router firmware for better NAT behavior")
            recommendations.append("• Enable UPnP/NAT-PMP if available for port mapping control")
        
        if filtering == FilteringBehavior.ADDRESS_PORT_DEPENDENT:
            recommendations.append("• Applications will rely heavily on relay servers (TURN/DERP)")
            recommendations.append("• Consider DMZ or port forwarding for critical P2P applications")
        
        if (mapping == MappingBehavior.ENDPOINT_INDEPENDENT and 
            filtering == FilteringBehavior.ENDPOINT_INDEPENDENT):
            recommendations.append("• Excellent NAT configuration for P2P applications")
            recommendations.append("• Tailscale should establish direct connections reliably")
            recommendations.append("• WebRTC and gaming applications should work well")
        
        return '\\n   '.join(recommendations) if recommendations else "• Current NAT configuration is suitable for most applications"


# Usage Example: Detect your NAT's behavior
async def analyze_my_nat():
    """
    RFC 4787 NAT Behavior Analysis Demonstration
    This helps understand why some P2P connections work better than others!
    """
    print("🚀 Starting NAT Behavior Analysis...")
    print("This helps understand why some P2P connections work better than others!")
    
    detector = NATBehaviorDetector()
    
    try:
        report = await detector.generate_nat_report()
        print(report)
        
        print("\\n🎓 Understanding Your Results:")
        print("• Endpoint-Independent = Best for P2P (Tailscale magic!)")
        print("• Address-Dependent = Requires coordination (STUN/ICE)")
        print("• Address/Port-Dependent = Challenging (needs TURN/DERP)")
        
    except Exception as error:
        print(f"❌ NAT analysis failed: {error}")
        print("💡 This might indicate a very restrictive firewall/NAT")


# Python NAT Traversal Libraries
def show_python_nat_libraries():
    """
    Real Python libraries for NAT traversal and P2P networking
    """
    print("\\n📚 Python NAT Traversal Libraries:")
    
    print("\\n🔧 pystun - Simple STUN client:")
    print('''# Install: pip install pystun
import stun

# Get your external IP and NAT type
nat_type, external_ip, external_port = stun.get_ip_info()
print(f"NAT Type: {nat_type}")
print(f"External: {external_ip}:{external_port}")''')
    
    print("\\n🔧 aiortc - WebRTC implementation:")
    print('''# Install: pip install aiortc
from aiortc import RTCPeerConnection, RTCSessionDescription
import asyncio

async def create_webrtc_connection():
    pc = RTCPeerConnection()
    
    # Add ICE servers for NAT traversal
    pc.configuration = {
        "iceServers": [
            {"urls": "stun:stun.l.google.com:19302"},
            {"urls": "turn:turn.example.com", "username": "user", "credential": "pass"}
        ]
    }
    
    # WebRTC handles NAT traversal automatically
    return pc''')
    
    print("\\n🔧 socket - Low-level UDP implementation:")
    print('''import socket
import asyncio

async def udp_hole_punch(peer_ip, peer_port, local_port=0):
    # Create UDP socket for hole punching
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('0.0.0.0', local_port))
    
    # Send initial packet to open NAT mapping
    sock.sendto(b"HELLO", (peer_ip, peer_port))
    
    # Now peer can send packets back through the hole
    return sock''')


if __name__ == "__main__":
    asyncio.run(analyze_my_nat())
    show_python_nat_libraries()
`;

export default { getCodeExample };