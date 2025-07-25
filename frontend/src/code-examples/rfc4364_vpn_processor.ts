export const getCodeExample = () => `"""
RFC 4364: BGP/MPLS IP VPN Route Processing Implementation

This example demonstrates how PE routers process customer routes,
apply VRF policies, and exchange VPN routes via MP-BGP according
to RFC 4364 specifications.
"""

import asyncio
import ipaddress
import random
import time
from typing import Dict, List, Optional, Set, Union, NamedTuple
from dataclasses import dataclass
from enum import Enum


@dataclass
class RouteDistinguisher:
    type: int  # 0, 1, or 2
    value: str  # Format: "ASN:nn" or "IP:nn"


@dataclass
class RouteTarget:
    type: str  # 'import' | 'export' | 'both'
    value: str  # Format: "ASN:nn"


@dataclass
class VPNv4Route:
    rd: RouteDistinguisher
    prefix: str
    next_hop: str
    route_targets: List[RouteTarget]
    mpls_label: int
    local_pref: Optional[int] = None
    med: Optional[int] = None


@dataclass
class VRFConfig:
    name: str
    rd: RouteDistinguisher
    import_targets: List[str]
    export_targets: List[str]
    routing_table: Dict[str, VPNv4Route]


@dataclass
class CustomerRoute:
    prefix: str
    next_hop: str
    protocol: str  # 'bgp' | 'static' | 'ospf' | 'eigrp'
    admin_distance: int


class BGPMPLSVPNProcessor:
    """
    BGP/MPLS VPN PE Router implementation using Python networking libraries
    """
    
    def __init__(self, router_id: str, asn: int):
        self.router_id = router_id
        self.asn = asn
        self.vrfs: Dict[str, VRFConfig] = {}
        self.label_pool: Set[int] = set()
        self.mp_bgp_peers: Dict[str, dict] = {}
        self.global_route_table: Dict[str, VPNv4Route] = {}
        
        self._initialize_label_pool()
        print(f"🚀 BGP/MPLS VPN PE Router initialized: {router_id} (AS {asn})")
    
    def create_customer_vrf(
        self, 
        customer_name: str, 
        rd_value: str, 
        import_targets: List[str], 
        export_targets: List[str]
    ) -> None:
        """
        Phase 1: VRF Configuration and Customer Onboarding
        
        Creates isolated routing instances for each customer with
        appropriate route distinguishers and route targets
        """
        print(f"\n📝 Creating VRF for customer: {customer_name}")
        
        rd = RouteDistinguisher(
            type=0,  # ASN:nn format
            value=rd_value
        )
        
        vrf = VRFConfig(
            name=customer_name,
            rd=rd,
            import_targets=import_targets,
            export_targets=export_targets,
            routing_table={}
        )
        
        self.vrfs[customer_name] = vrf
        
        print(f"✅ VRF '{customer_name}' created:")
        print(f"   📍 Route Distinguisher: {rd.value}")
        print(f"   📥 Import Targets: [{', '.join(import_targets)}]")
        print(f"   📤 Export Targets: [{', '.join(export_targets)}]")
        
        # Simulate route target validation
        self._validate_route_targets(import_targets + export_targets)
    
    def import_customer_route(
        self, 
        vrf_name: str, 
        customer_route: CustomerRoute,
        ce_router_id: str
    ) -> bool:
        """
        Phase 2: Customer Route Import from CE Router
        
        Receives routes from customer equipment and imports them
        into appropriate VRF with security validation
        """
        print(f"\n📥 Importing customer route into VRF '{vrf_name}':")
        print(f"   🛣️  Prefix: {customer_route.prefix}")
        print(f"   📍 Next-hop: {customer_route.next_hop}")
        print(f"   🔧 Protocol: {customer_route.protocol}")
        
        vrf = self.vrfs.get(vrf_name)
        if not vrf:
            print(f"❌ VRF '{vrf_name}' not found")
            return False
        
        # Security: Validate CE router authentication (simplified)
        if not self._validate_ce_authentication(ce_router_id, vrf_name):
            print(f"🔒 CE router authentication failed for {ce_router_id}")
            return False
        
        # Allocate MPLS label for this route
        mpls_label = self._allocate_mpls_label()
        if not mpls_label:
            print("❌ Failed to allocate MPLS label")
            return False
        
        # Create VPNv4 route with RD prepended
        vpnv4_route = VPNv4Route(
            rd=vrf.rd,
            prefix=customer_route.prefix,
            next_hop=self.router_id,  # PE router becomes next-hop
            route_targets=[RouteTarget(type='export', value=rt) for rt in vrf.export_targets],
            mpls_label=mpls_label,
            local_pref=self._calculate_local_preference(customer_route),
            med=0
        )
        
        # Install in VRF routing table
        vrf.routing_table[customer_route.prefix] = vpnv4_route
        
        print("✅ Route imported successfully:")
        print(f"   🏷️  VPNv4 Route: {vrf.rd.value}:{customer_route.prefix}")
        print(f"   🔖 MPLS Label: {mpls_label}")
        print(f"   🎯 Export Targets: [{', '.join(vrf.export_targets)}]")
        
        # Advertise to MP-BGP peers
        self._advertise_mp_bgp_route(vpnv4_route)
        
        return True
    
    def _advertise_mp_bgp_route(self, route: VPNv4Route) -> None:
        """
        Phase 3: MP-BGP VPNv4 Route Advertisement
        
        Distributes customer routes to other PE routers with
        appropriate route targets and MPLS labels
        """
        print(f"\n📡 Advertising VPNv4 route via MP-BGP:")
        print(f"   🛣️  Route: {route.rd.value}:{route.prefix}")
        print(f"   📍 Next-hop: {route.next_hop}")
        print(f"   🏷️  MPLS Label: {route.mpls_label}")
        
        # Add to global RIB for MP-BGP distribution
        global_key = f"{route.rd.value}:{route.prefix}"
        self.global_route_table[global_key] = route
        
        # Send to all MP-BGP peers
        for peer_address, peer in self.mp_bgp_peers.items():
            try:
                self._send_mp_bgp_update(peer, route)
                print(f"   ✅ Sent to MP-BGP peer: {peer_address}")
            except Exception as error:
                print(f"   ⚠️  Failed to send to peer {peer_address}: {error}")
    
    def receive_mp_bgp_route(self, route: VPNv4Route, from_peer: str) -> None:
        """
        Phase 4: MP-BGP VPNv4 Route Reception
        
        Receives VPN routes from other PE routers and imports
        them into appropriate VRFs based on route target policies
        """
        print(f"\n📨 Received VPNv4 route from MP-BGP peer {from_peer}:")
        print(f"   🛣️  Route: {route.rd.value}:{route.prefix}")
        print(f"   📍 Next-hop: {route.next_hop}")
        print(f"   🏷️  MPLS Label: {route.mpls_label}")
        print(f"   🎯 Route Targets: [{', '.join(rt.value for rt in route.route_targets)}]")
        
        # Check which VRFs should import this route
        importing_vrfs = self._find_importing_vrfs(route.route_targets)
        
        if not importing_vrfs:
            print("   ℹ️  No VRFs configured to import this route")
            return
        
        # Import into matching VRFs
        for vrf_name in importing_vrfs:
            vrf = self.vrfs.get(vrf_name)
            if vrf:
                print(f"   📥 Importing into VRF '{vrf_name}'")
                
                # Install in VRF routing table
                vrf.routing_table[route.prefix] = route
                
                # If CE router exists, advertise the route
                self._advertise_to_ce(vrf_name, route)
    
    def forward_customer_traffic(
        self, 
        vrf_name: str, 
        dest_ip: str, 
        source_packet: dict
    ) -> bool:
        """
        Phase 5: Customer Traffic Forwarding (Data Plane)
        
        Processes customer IP packets and forwards them through
        MPLS tunnels with appropriate label stacks
        """
        print(f"\n📦 Forwarding customer traffic in VRF '{vrf_name}':")
        print(f"   🎯 Destination: {dest_ip}")
        
        vrf = self.vrfs.get(vrf_name)
        if not vrf:
            print(f"❌ VRF '{vrf_name}' not found")
            return False
        
        # Longest prefix match in VRF routing table
        route = self._longest_prefix_match(vrf.routing_table, dest_ip)
        if not route:
            print(f"   ❌ No route found for {dest_ip} in VRF '{vrf_name}'")
            return False
        
        print(f"   ✅ Route found: {route.prefix} via {route.next_hop}")
        print(f"   🏷️  VPN Label: {route.mpls_label}")
        
        # Build MPLS label stack
        label_stack = self._build_label_stack(route)
        
        print("   📚 MPLS Label Stack:")
        for index, label in enumerate(label_stack):
            label_type = 'Transport (LDP)' if index == 0 else 'VPN'
            print(f"      [{index}] {label} ({label_type})")
        
        # Forward with MPLS encapsulation
        mpls_packet = self._encapsulate_mpls(source_packet, label_stack)
        success = self._forward_mpls_packet(mpls_packet, route.next_hop)
        
        if success:
            print(f"   ✅ Packet forwarded successfully to {route.next_hop}")
        else:
            print("   ❌ Failed to forward packet")
        
        return success
    
    def _find_importing_vrfs(self, route_targets: List[RouteTarget]) -> List[str]:
        """
        Utility: Find VRFs that should import routes with given route targets
        """
        importing_vrfs = []
        
        for vrf_name, vrf in self.vrfs.items():
            # Check if any route target matches VRF import policy
            should_import = any(
                rt.value in vrf.import_targets 
                for rt in route_targets
            )
            
            if should_import:
                importing_vrfs.append(vrf_name)
        
        return importing_vrfs
    
    def _longest_prefix_match(self, routing_table: Dict[str, VPNv4Route], dest_ip: str) -> Optional[VPNv4Route]:
        """
        Utility: Perform longest prefix match in VRF routing table using Python ipaddress
        """
        best_match = None
        longest_prefix_length = -1
        
        try:
            dest_addr = ipaddress.ip_address(dest_ip)
            
            for prefix, route in routing_table.items():
                try:
                    network = ipaddress.ip_network(route.prefix, strict=False)
                    if dest_addr in network:
                        prefix_length = network.prefixlen
                        if prefix_length > longest_prefix_length:
                            longest_prefix_length = prefix_length
                            best_match = route
                except ValueError:
                    continue
        except ValueError:
            pass
        
        return best_match
    
    def _build_label_stack(self, route: VPNv4Route) -> List[int]:
        """
        Utility: Build MPLS label stack for VPN forwarding
        """
        # In real implementation, would lookup LSP to next-hop PE
        transport_label = self._get_lsp_label(route.next_hop)
        vpn_label = route.mpls_label
        
        return [transport_label, vpn_label]
    
    def _validate_route_targets(self, route_targets: List[str]) -> bool:
        """
        Utility: Validate route targets against configured policies
        """
        print("   🔍 Validating route targets...")
        
        import re
        
        for rt in route_targets:
            # Validate format (ASN:nn)
            if not re.match(r'^\\d+:\\d+$', rt):
                print(f"   ❌ Invalid route target format: {rt}")
                return False
            
            # Check authorization (simplified - would check against policy)
            asn, value = rt.split(':')
            if int(asn) != self.asn and not self._is_authorized_external_rt(rt):
                print(f"   ⚠️  External route target requires authorization: {rt}")
        
        print("   ✅ Route targets validated")
        return True
    
    def generate_vpn_status_report(self) -> str:
        """
        Generate comprehensive VPN status report
        """
        vrf_count = len(self.vrfs)
        total_routes = sum(len(vrf.routing_table) for vrf in self.vrfs.values())
        labels_allocated = 10000 - len(self.label_pool)  # Assuming pool starts at 10000
        
        report = f"""
🔍 BGP/MPLS VPN PE Router Status Report
=====================================

📍 Router ID: {self.router_id}
🏢 AS Number: {self.asn}

📊 VPN Statistics:
   • Customer VRFs: {vrf_count}
   • Total VPN Routes: {total_routes}
   • MPLS Labels Allocated: {labels_allocated}
   • MP-BGP Peers: {len(self.mp_bgp_peers)}

📋 Customer VRFs:"""
        
        for name, vrf in self.vrfs.items():
            report += f"""
   • {name}:
     - RD: {vrf.rd.value}
     - Import RTs: [{', '.join(vrf.import_targets)}]
     - Export RTs: [{', '.join(vrf.export_targets)}]
     - Routes: {len(vrf.routing_table)}"""
        
        report += """

💡 RFC 4364 Implementation Features:
   ✅ Route Distinguisher isolation
   ✅ Route Target policy enforcement
   ✅ MP-BGP VPNv4 route exchange
   ✅ Two-level MPLS label stack
   ✅ PE-CE authentication
   ✅ VRF route leaking prevention"""
        
        return report.strip()
    
    # Helper methods (simplified implementations)
    
    def _initialize_label_pool(self) -> None:
        """Initialize with label range 1000-10000"""
        self.label_pool = set(range(1000, 10001))
    
    def _allocate_mpls_label(self) -> Optional[int]:
        """Allocate next available MPLS label"""
        if not self.label_pool:
            return None
        
        label = self.label_pool.pop()
        return label
    
    def _validate_ce_authentication(self, ce_router_id: str, vrf_name: str) -> bool:
        """Simplified CE router authentication check"""
        print(f"   🔐 Validating CE router {ce_router_id} for VRF {vrf_name}")
        return True  # In reality, would check MD5/KeyChain authentication
    
    def _calculate_local_preference(self, route: CustomerRoute) -> int:
        """Route preference based on protocol and policy"""
        preferences = {
            'bgp': 100,
            'static': 200,
            'ospf': 110,
            'eigrp': 90
        }
        return preferences.get(route.protocol, 100)
    
    def _send_mp_bgp_update(self, peer: dict, route: VPNv4Route) -> None:
        """Simulate MP-BGP UPDATE message"""
        print(f"   📤 MP-BGP UPDATE: VPNv4 AFI/SAFI with route {route.rd.value}:{route.prefix}")
    
    def _advertise_to_ce(self, vrf_name: str, route: VPNv4Route) -> None:
        """Advertise route to CE router"""
        print(f"   📤 Advertising {route.prefix} to CE router in VRF {vrf_name}")
    
    def _get_lsp_label(self, next_hop: str) -> int:
        """Simulate LDP label lookup for LSP to next-hop PE"""
        return 3000 + random.randint(0, 999)
    
    def _encapsulate_mpls(self, packet: dict, label_stack: List[int]) -> dict:
        """Encapsulate packet with MPLS labels"""
        return {"original_packet": packet, "labels": label_stack}
    
    def _forward_mpls_packet(self, packet: dict, next_hop: str) -> bool:
        """Forward MPLS packet to next hop"""
        print(f"   🚀 Forwarding MPLS packet to {next_hop}")
        return True
    
    def _is_authorized_external_rt(self, rt: str) -> bool:
        """Check if external route target is authorized"""
        return False  # Simplified - would check policy database


# Usage Example: Service Provider MPLS Network
async def demonstrate_bgp_mpls_vpn():
    """
    RFC 4364 BGP/MPLS IP VPN Demonstration
    This shows how service providers deliver enterprise VPN services!
    """
    print("🚀 RFC 4364 BGP/MPLS IP VPN Demonstration")
    print("This shows how service providers deliver enterprise VPN services!")
    
    # Create PE routers
    pe1 = BGPMPLSVPNProcessor("10.0.0.1", 65001)
    pe2 = BGPMPLSVPNProcessor("10.0.0.2", 65001)
    
    # Configure customer VRFs on both PE routers
    print("\n=== Customer Onboarding ===")
    
    # Enterprise customer with hub-and-spoke topology
    pe1.create_customer_vrf("acme-corp", "65001:100", ["65001:100"], ["65001:1"])
    pe2.create_customer_vrf("acme-corp", "65001:100", ["65001:1"], ["65001:100"])
    
    # Multi-tenant customer with any-to-any connectivity
    pe1.create_customer_vrf("globex-ltd", "65001:200", ["65001:200"], ["65001:200"])
    pe2.create_customer_vrf("globex-ltd", "65001:200", ["65001:200"], ["65001:200"])
    
    print("\n=== Route Import and Processing ===")
    
    # Import customer routes from CE routers
    acme_hq_route = CustomerRoute(
        prefix="192.168.1.0/24",
        next_hop="192.168.100.1",  # CE router
        protocol="bgp",
        admin_distance=20
    )
    
    acme_branch_route = CustomerRoute(
        prefix="192.168.2.0/24",
        next_hop="192.168.200.1",  # CE router
        protocol="static",
        admin_distance=1
    )
    
    pe1.import_customer_route("acme-corp", acme_hq_route, "ce-hq-01")
    pe2.import_customer_route("acme-corp", acme_branch_route, "ce-branch-01")
    
    print("\n=== Traffic Forwarding Simulation ===")
    
    # Simulate customer traffic forwarding
    pe2.forward_customer_traffic("acme-corp", "192.168.1.100", {
        "src": "192.168.2.10",
        "dst": "192.168.1.100",
        "payload": "Enterprise application data"
    })
    
    print("\n=== Status Reports ===")
    print(pe1.generate_vpn_status_report())
    print("\n" + pe2.generate_vpn_status_report())
    
    print("\n🎓 Key RFC 4364 Concepts Demonstrated:")
    print("• Route Distinguishers create unique VPNv4 routes")
    print("• Route Targets control VPN topology and reachability")
    print("• MP-BGP distributes VPN routes between PE routers")
    print("• Two-level MPLS labels enable scalable VPN forwarding")
    print("• VRF isolation provides secure multi-tenancy")
    
    print("\n💼 This is how enterprises connect globally:")
    print("• 95% of Fortune 500 companies use MPLS VPN services")
    print("• Service providers operate thousands of PE routers")
    print("• Millions of enterprise sites connected via BGP/MPLS VPNs")
    print("• Foundation for cloud connectivity (AWS Direct Connect, etc.)")


# Python BGP/MPLS Libraries
def show_python_mpls_libraries():
    """
    Real Python libraries for BGP/MPLS VPN implementation
    """
    print("\n📚 Python BGP/MPLS Networking Libraries:")
    
    print("\n🔧 ExaBGP - BGP route injection and monitoring:")
    print("""# Install: pip install exabgp
from exabgp.bgp.message import Update
from exabgp.bgp.nlri.vpnv4 import VPNv4
from exabgp.bgp.community import Community

# Create MP-BGP VPNv4 route announcement
route = VPNv4(
    rd="65001:100",
    prefix="192.168.1.0/24",
    path_info=1001,  # MPLS label
    next_hop="10.0.0.1"
)

# Add route targets
route.communities = [Community(0x0001006400)]  # RT 100:100

# Advertise via ExaBGP
update = Update([route], [])""")
    
    print("\n🔧 PyBGP - Pure Python BGP implementation:")
    print("""# Install: pip install pybgp
import pybgp

# Create BGP peer connection
peer = pybgp.BGPPeer(
    peer_ip="10.0.0.2",
    peer_as=65001,
    local_as=65001,
    capabilities=["mp-bgp", "4-byte-asn"]
)

# Configure MP-BGP for VPNv4 address family
peer.add_address_family("vpnv4-unicast")

# Connect and exchange routes
await peer.connect()
await peer.send_route_update(vpnv4_routes)""")
    
    print("\n🔧 scapy - Packet manipulation for MPLS:")
    print("""# Install: pip install scapy
from scapy.all import *
from scapy.contrib.mpls import MPLS

# Create MPLS packet with two-level label stack
mpls_packet = (
    Ether(dst="00:11:22:33:44:55") /
    IP(dst="10.0.0.2") /
    MPLS(label=3000, s=0) /  # Transport label
    MPLS(label=1001, s=1) /  # VPN label  
    IP(src="192.168.1.1", dst="192.168.2.1") /
    TCP(sport=80, dport=8080) /
    "VPN customer data"
)

# Send over network interface
sendp(mpls_packet, iface="eth0")""")


if __name__ == "__main__":
    asyncio.run(demonstrate_bgp_mpls_vpn())
    show_python_mpls_libraries()
`;

export default { getCodeExample };