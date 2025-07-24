import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC2547() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 2547: BGP/MPLS VPNs (March 1999)</h1>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">
          Enterprise Connectivity Revolution
        </h3>
        <p className="text-amber-800">
          <GlossaryTerm>BGP/MPLS VPNs</GlossaryTerm> revolutionized enterprise networking by enabling service providers 
          to offer scalable, secure Virtual Private Networks using <GlossaryTerm>BGP</GlossaryTerm> and <GlossaryTerm>MPLS</GlossaryTerm> technologies. 
          This became the foundation for modern enterprise WAN connectivity.
        </p>
        <p className="text-amber-700 text-sm mt-2">
          <strong>Read the original:</strong> <a href="https://www.rfc-editor.org/rfc/rfc2547.html" 
          className="underline" target="_blank" rel="noopener noreferrer">RFC 2547</a> (Historical - superseded by RFC 4364)
        </p>
      </div>

      <h2>The Enterprise Connectivity Challenge</h2>

      <p>
        By 1999, enterprises needed secure, scalable ways to connect multiple sites across 
        wide geographic areas. Traditional solutions like Frame Relay and ATM were expensive 
        and inflexible. <GlossaryTerm>BGP/MPLS VPNs</GlossaryTerm> offered a revolutionary approach: 
        leverage service provider infrastructure to create private networks with public network efficiency.
      </p>

      <h3>Core BGP/MPLS VPN Components</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900">🏢 Customer Edge (CE)</h4>
          <p className="text-blue-800 text-sm">
            Customer routers that connect to the provider network. 
            Run standard routing protocols without VPN awareness.
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">🌐 Provider Edge (PE)</h4>
          <p className="text-green-800 text-sm">
            Service provider routers that maintain VPN routing tables 
            and handle VPN traffic separation and forwarding.
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded">
          <h4 className="font-semibold text-purple-900">⚡ Provider Core (P)</h4>
          <p className="text-purple-800 text-sm">
            Core MPLS routers that forward traffic based on labels 
            without VPN awareness, providing scalable transport.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h4 className="font-semibold text-yellow-900">🎯 Route Targets</h4>
          <p className="text-yellow-800 text-sm">
            BGP extended communities that control which VPN routes 
            are imported and exported between different sites.
          </p>
        </div>
      </div>

      <h3>BGP/MPLS VPN Architecture</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-3">Network Topology</h4>
        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`
[Site A]           [Service Provider Core]           [Site B]
   |                        |                          |
[CE-A]---[PE-A]======[P-Router]======[PE-B]---[CE-B]
           |                 |                 |
        VRF-A             MPLS Core          VRF-B
     (Route Target:       (Label Switch      (Route Target:
      100:1)               Paths)             100:1)

Key:
CE = Customer Edge Router
PE = Provider Edge Router  
P  = Provider Core Router
VRF = Virtual Routing and Forwarding table
`}
        </pre>
      </div>

      <h3>Virtual Routing and Forwarding (VRF)</h3>

      <p>
        <GlossaryTerm>VRF</GlossaryTerm> instances on PE routers maintain separate routing tables for each VPN, 
        ensuring traffic isolation while sharing the same physical infrastructure:
      </p>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-indigo-900 mb-3">VRF Components</h4>
        <ul className="text-indigo-800 text-sm space-y-2">
          <li><strong>Route Distinguisher (RD):</strong> Makes VPN routes globally unique (ASN:nn or IP:nn format)</li>
          <li><strong>Import Route Targets:</strong> Control which routes enter the VRF</li>
          <li><strong>Export Route Targets:</strong> Control which routes leave the VRF</li>
          <li><strong>VPN Routing Table:</strong> Separate forwarding table per VPN customer</li>
        </ul>
      </div>

      <h3>MPLS Label Operations</h3>

      <p>
        <GlossaryTerm>MPLS</GlossaryTerm> labels provide efficient forwarding and traffic engineering in the provider core:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Dual Label Stack</h4>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-2 rounded border">
            <strong>Outer Label (Transport/LDP):</strong> Routes packet through MPLS core to destination PE
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Inner Label (VPN/BGP):</strong> Identifies the specific VRF on the destination PE <GlossaryTerm>router</GlossaryTerm>
          </div>
          <div className="bg-blue-50 p-2 rounded border">
            <strong>Packet Flow:</strong> CE → PE (push labels) → P-<GlossaryTerm>router</GlossaryTerm>s (swap outer) → PE (pop labels) → CE
          </div>
        </div>
      </div>

      <ExpandableSection title="🐍 Python BGP/MPLS VPN Simulation">
        <p>
          Let's simulate BGP/MPLS VPN concepts to understand the architecture:
        </p>

        <CodeBlock
          language="python"
          code={`import ipaddress
from typing import Dict, List, Set, Optional
from dataclasses import dataclass
from enum import Enum

@dataclass
class RouteTarget:
    """BGP Extended Community Route Target."""
    asn: int
    value: int
    
    def __str__(self):
        return f"{self.asn}:{self.value}"
    
    @classmethod
    def from_string(cls, rt_string: str):
        """Parse route target from string format."""
        asn, value = rt_string.split(':')
        return cls(int(asn), int(value))

@dataclass
class RouteDistinguisher:
    """Makes VPN routes globally unique."""
    asn: int
    value: int
    
    def __str__(self):
        return f"{self.asn}:{self.value}"

@dataclass
class VPNRoute:
    """A route in a BGP/MPLS VPN."""
    prefix: str
    next_hop: str
    rd: RouteDistinguisher
    route_targets: List[RouteTarget]
    local_pref: int = 100
    med: int = 0
    
    def get_vpn_prefix(self):
        """Get VPN prefix with RD prepended."""
        return f"{self.rd}:{self.prefix}"

class VRF:
    """Virtual Routing and Forwarding table."""
    
    def __init__(self, name: str, rd: RouteDistinguisher, 
                 import_targets: List[RouteTarget], 
                 export_targets: List[RouteTarget]):
        self.name = name
        self.rd = rd
        self.import_targets = set(import_targets)
        self.export_targets = set(export_targets)
        self.routes: Dict[str, VPNRoute] = {}
        self.interfaces: List[str] = []
    
    def add_route(self, route: VPNRoute):
        """Add route to VRF if import policy allows."""
        # Check if route targets match import policy
        if any(rt in self.import_targets for rt in route.route_targets):
            self.routes[route.prefix] = route
            print(f"✅ Route {route.prefix} imported to VRF {self.name}")
            return True
        else:
            print(f"❌ Route {route.prefix} rejected by VRF {self.name} import policy")
            return False
    
    def export_route(self, prefix: str) -> Optional[VPNRoute]:
        """Export route with this VRF's export targets."""
        if prefix in self.routes:
            route = self.routes[prefix]
            # Create new route with export targets
            exported_route = VPNRoute(
                prefix=route.prefix,
                next_hop=route.next_hop,
                rd=self.rd,
                route_targets=list(self.export_targets),
                local_pref=route.local_pref,
                med=route.med
            )
            return exported_route
        return None
    
    def show_routes(self):
        """Display VRF routing table."""
        print(f"\\n📋 VRF {self.name} Routing Table:")
        print(f"   RD: {self.rd}")
        print(f"   Import RTs: {[str(rt) for rt in self.import_targets]}")
        print(f"   Export RTs: {[str(rt) for rt in self.export_targets]}")
        print("   Routes:")
        
        for prefix, route in self.routes.items():
            print(f"     {prefix} via {route.next_hop}")
            print(f"       RTs: {[str(rt) for rt in route.route_targets]}")

class PERouter:
    """Provider Edge Router with VRF support."""
    
    def __init__(self, name: str, router_id: str):
        self.name = name
        self.router_id = router_id
        self.vrfs: Dict[str, VRF] = {}
        self.global_routing_table: Dict[str, str] = {}
        self.mpls_labels: Dict[str, int] = {}  # VRF -> Label mapping
        self.next_label = 16  # Start from label 16
    
    def create_vrf(self, vrf_name: str, rd: RouteDistinguisher,
                   import_targets: List[RouteTarget], 
                   export_targets: List[RouteTarget]):
        """Create a new VRF instance."""
        vrf = VRF(vrf_name, rd, import_targets, export_targets)
        self.vrfs[vrf_name] = vrf
        
        # Assign MPLS label for this VRF
        self.mpls_labels[vrf_name] = self.next_label
        self.next_label += 1
        
        print(f"🏗️  Created VRF {vrf_name} on PE {self.name}")
        print(f"   RD: {rd}")
        print(f"   MPLS Label: {self.mpls_labels[vrf_name]}")
        
        return vrf
    
    def advertise_route(self, vrf_name: str, prefix: str, next_hop: str):
        """Advertise a route from customer to BGP."""
        if vrf_name not in self.vrfs:
            print(f"❌ VRF {vrf_name} not found on PE {self.name}")
            return
        
        vrf = self.vrfs[vrf_name]
        
        # Create VPN route with VRF's export targets
        vpn_route = VPNRoute(
            prefix=prefix,
            next_hop=next_hop,
            rd=vrf.rd,
            route_targets=list(vrf.export_targets)
        )
        
        # Add to local VRF
        vrf.routes[prefix] = vpn_route
        
        print(f"📢 PE {self.name} advertising VPN route:")
        print(f"   VPN Prefix: {vpn_route.get_vpn_prefix()}")
        print(f"   Next Hop: {next_hop}")
        print(f"   Route Targets: {[str(rt) for rt in vpn_route.route_targets]}")
        print(f"   MPLS Label: {self.mpls_labels[vrf_name]}")
        
        return vpn_route
    
    def receive_bgp_route(self, vpn_route: VPNRoute, advertising_pe: str):
        """Receive BGP VPN route from another PE."""
        print(f"📨 PE {self.name} received VPN route from {advertising_pe}:")
        print(f"   VPN Prefix: {vpn_route.get_vpn_prefix()}")
        
        # Try to import into matching VRFs
        imported_count = 0
        for vrf_name, vrf in self.vrfs.items():
            if vrf.add_route(vpn_route):
                imported_count += 1
        
        if imported_count == 0:
            print(f"⚠️  Route not imported to any VRF on PE {self.name}")
    
    def forward_packet(self, dest_ip: str, vrf_name: str = None):
        """Simulate packet forwarding with MPLS labels."""
        if vrf_name and vrf_name in self.vrfs:
            vrf = self.vrfs[vrf_name]
            
            # Find matching route in VRF
            for prefix, route in vrf.routes.items():
                try:
                    if ipaddress.ip_address(dest_ip) in ipaddress.ip_network(prefix):
                        print(f"📦 Packet forwarding simulation:")
                        print(f"   Destination: {dest_ip}")
                        print(f"   VRF: {vrf_name}")
                        print(f"   Matched Route: {prefix}")
                        print(f"   Next Hop: {route.next_hop}")
                        print(f"   MPLS Labels: [Transport Label, VPN Label {self.mpls_labels[vrf_name]}]")
                        return True
                except (ipaddress.AddressValueError, ValueError):
                    continue
        
        print(f"❌ No route found for {dest_ip} in VRF {vrf_name}")
        return False
    
    def show_status(self):
        """Display PE router status."""
        print(f"\\n🌐 PE Router {self.name} Status:")
        print(f"   Router ID: {self.router_id}")
        print(f"   VRFs: {len(self.vrfs)}")
        print(f"   MPLS Labels Allocated: {len(self.mpls_labels)}")
        
        for vrf_name, vrf in self.vrfs.items():
            vrf.show_routes()

class BGPMPLSVPNSimulator:
    """Simulate BGP/MPLS VPN network following RFC 2547."""
    
    def __init__(self):
        self.pe_routers: Dict[str, PERouter] = {}
        self.customers: Dict[str, Dict] = {}
    
    def add_pe_router(self, name: str, router_id: str):
        """Add PE router to the network."""
        pe = PERouter(name, router_id)
        self.pe_routers[name] = pe
        print(f"➕ Added PE router {name} ({router_id})")
        return pe
    
    def create_customer_vpn(self, customer_name: str, sites: List[Dict]):
        """Create VPN for customer with multiple sites."""
        print(f"\\n🏢 Creating VPN for customer: {customer_name}")
        print("=" * 50)
        
        # Define common route targets for this customer
        customer_asn = 65001  # Service provider ASN
        customer_id = len(self.customers) + 1
        
        import_rt = RouteTarget(customer_asn, customer_id)
        export_rt = RouteTarget(customer_asn, customer_id)
        
        customer_info = {
            'name': customer_name,
            'sites': [],
            'route_targets': [import_rt, export_rt]
        }
        
        # Create VRF on each PE for customer sites
        for site in sites:
            pe_name = site['pe_router']
            site_name = site['site_name']
            
            if pe_name not in self.pe_routers:
                print(f"❌ PE router {pe_name} not found")
                continue
            
            pe = self.pe_routers[pe_name]
            
            # Create unique RD for this site
            rd = RouteDistinguisher(customer_asn, customer_id * 100 + len(customer_info['sites']))
            
            # Create VRF
            vrf_name = f"{customer_name}_{site_name}"
            vrf = pe.create_vrf(vrf_name, rd, [import_rt], [export_rt])
            
            customer_info['sites'].append({
                'site_name': site_name,
                'pe_router': pe_name,
                'vrf_name': vrf_name,
                'networks': site.get('networks', [])
            })
        
        self.customers[customer_name] = customer_info
        return customer_info
    
    def advertise_customer_routes(self, customer_name: str):
        """Simulate route advertisement for customer sites."""
        if customer_name not in self.customers:
            print(f"❌ Customer {customer_name} not found")
            return
        
        customer = self.customers[customer_name]
        print(f"\\n📢 Advertising routes for {customer_name}")
        
        advertised_routes = []
        
        # Each site advertises its local networks
        for site in customer['sites']:
            pe_name = site['pe_router']
            vrf_name = site['vrf_name']
            pe = self.pe_routers[pe_name]
            
            for network in site['networks']:
                vpn_route = pe.advertise_route(vrf_name, network, f"CE_{site['site_name']}")
                if vpn_route:
                    advertised_routes.append((pe_name, vpn_route))
        
        # Distribute routes to other PEs
        print("\\n🔄 Distributing routes via BGP...")
        for advertising_pe_name, vpn_route in advertised_routes:
            for pe_name, pe in self.pe_routers.items():
                if pe_name != advertising_pe_name:
                    pe.receive_bgp_route(vpn_route, advertising_pe_name)
    
    def test_connectivity(self, customer_name: str, source_site: str, dest_ip: str):
        """Test connectivity between customer sites."""
        print(f"\\n🧪 Testing connectivity for {customer_name}")
        print(f"   From site: {source_site}")
        print(f"   To IP: {dest_ip}")
        
        if customer_name not in self.customers:
            print(f"❌ Customer {customer_name} not found")
            return False
        
        customer = self.customers[customer_name]
        
        # Find source site
        source_site_info = None
        for site in customer['sites']:
            if site['site_name'] == source_site:
                source_site_info = site
                break
        
        if not source_site_info:
            print(f"❌ Site {source_site} not found")
            return False
        
        # Test forwarding from source PE
        pe = self.pe_routers[source_site_info['pe_router']]
        return pe.forward_packet(dest_ip, source_site_info['vrf_name'])
    
    def show_network_status(self):
        """Display complete network status."""
        print("\\n" + "=" * 60)
        print("🌐 BGP/MPLS VPN Network Status")
        print("=" * 60)
        
        for pe_name, pe in self.pe_routers.items():
            pe.show_status()
        
        print("\\n👥 Customer VPNs:")
        for customer_name, customer in self.customers.items():
            print(f"   {customer_name}: {len(customer['sites'])} sites")
            for site in customer['sites']:
                print(f"     - {site['site_name']} on {site['pe_router']}")

# Demonstration function
def demonstrate_bgp_mpls_vpn():
    """Comprehensive BGP/MPLS VPN demonstration."""
    
    print("🚀 BGP/MPLS VPN Demonstration (RFC 2547)")
    print("=" * 70)
    
    # Create network simulator
    network = BGPMPLSVPNSimulator()
    
    # Add PE routers
    pe1 = network.add_pe_router("PE1", "10.0.0.1")
    pe2 = network.add_pe_router("PE2", "10.0.0.2")
    pe3 = network.add_pe_router("PE3", "10.0.0.3")
    
    # Create VPN for Enterprise A
    print("\\n🏢 Setting up Enterprise A VPN...")
    enterprise_a_sites = [
        {
            'pe_router': 'PE1',
            'site_name': 'Headquarters',
            'networks': ['192.168.1.0/24', '192.168.2.0/24']
        },
        {
            'pe_router': 'PE2', 
            'site_name': 'Branch1',
            'networks': ['192.168.10.0/24']
        },
        {
            'pe_router': 'PE3',
            'site_name': 'Branch2', 
            'networks': ['192.168.20.0/24']
        }
    ]
    
    network.create_customer_vpn("Enterprise_A", enterprise_a_sites)
    
    # Create VPN for Enterprise B (different customer, overlapping IPs)
    print("\\n🏢 Setting up Enterprise B VPN...")
    enterprise_b_sites = [
        {
            'pe_router': 'PE1',
            'site_name': 'MainOffice',
            'networks': ['192.168.1.0/24']  # Same as Enterprise A!
        },
        {
            'pe_router': 'PE2',
            'site_name': 'RemoteOffice',
            'networks': ['192.168.5.0/24']
        }
    ]
    
    network.create_customer_vpn("Enterprise_B", enterprise_b_sites)
    
    # Advertise routes
    network.advertise_customer_routes("Enterprise_A")
    network.advertise_customer_routes("Enterprise_B")
    
    # Show network status
    network.show_network_status()
    
    # Test connectivity
    print("\\n🧪 Connectivity Tests:")
    print("-" * 30)
    
    # Test Enterprise A connectivity
    network.test_connectivity("Enterprise_A", "Headquarters", "192.168.10.1")
    network.test_connectivity("Enterprise_A", "Branch1", "192.168.1.1")
    
    # Test Enterprise B connectivity (same IP space, different VPN)
    network.test_connectivity("Enterprise_B", "MainOffice", "192.168.5.1")
    
    print("\\n🎯 Key BGP/MPLS VPN Benefits Demonstrated:")
    print("   • Traffic isolation between different customers")
    print("   • Overlapping IP address support via VRFs")
    print("   • Scalable route distribution with BGP")
    print("   • Efficient forwarding with MPLS labels")
    print("   • Flexible connectivity policies with Route Targets")

if __name__ == "__main__":
    demonstrate_bgp_mpls_vpn()`}
        />

        <p>
          This simulation demonstrates how BGP/MPLS VPNs enable service providers to offer 
          secure, scalable enterprise connectivity while supporting overlapping address spaces 
          and flexible connectivity policies.
        </p>
      </ExpandableSection>

      <h3>Route Target Policies</h3>

      <p>
        Route Targets provide flexible connectivity control in BGP/MPLS VPNs:
      </p>

      <div className="bg-green-50 border border-green-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-green-900 mb-3">Common Route Target Scenarios</h4>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold">🌐 Full Mesh (Any-to-Any)</h5>
            <p>All sites use same import/export RT: <code>65001:100</code></p>
            <p className="text-gray-600">All sites can reach all other sites</p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold">⭐ Hub-and-Spoke</h5>
            <p>Hub: Import/Export <code>65001:100</code> | Spokes: Import/Export <code>65001:200</code></p>
            <p className="text-gray-600">Spokes can only communicate through hub</p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold">🔒 Extranet (Shared Services)</h5>
            <p>Customer A: <code>65001:100</code> | Shared: <code>65001:999</code></p>
            <p className="text-gray-600">Access to shared resources (DNS, email, etc.)</p>
          </div>
        </div>
      </div>

      <h3>Historical Context</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>Late 1990s:</strong> Enterprise WAN costs become prohibitive with traditional technologies
        </p>
        <p>
          <strong>1998-1999:</strong> MPLS and BGP extensions development in IETF
        </p>
        <p>
          <strong>March 1999:</strong> RFC 2547 published, defining BGP/MPLS VPN architecture
        </p>
        <p>
          <strong>2000-2005:</strong> Rapid service provider adoption and enterprise migration
        </p>
        <p>
          <strong>2006:</strong> RFC 4364 supersedes RFC 2547 with improvements
        </p>
      </div>

      <ExpandableSection title="🌐 BGP/MPLS VPN's Enterprise Revolution">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">💼 Enterprise WAN Transformation</h4>
            <p className="text-blue-800 text-sm">
              BGP/MPLS VPNs revolutionized enterprise networking economics:
            </p>
            <ul className="text-blue-700 text-xs mt-2 space-y-1">
              <li>• <strong>Cost Reduction:</strong> 50-80% savings vs Frame Relay/ATM</li>
              <li>• <strong>Scalability:</strong> Easy addition of new sites</li>
              <li>• <strong>Flexibility:</strong> Any-to-any, hub-spoke, or hybrid topologies</li>
              <li>• <strong>QoS:</strong> Traffic prioritization for voice/video</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">📈 Market Impact Statistics</h4>
            <p className="text-green-800 text-sm">
              BGP/MPLS VPNs became the dominant enterprise WAN technology:
            </p>
            <ul className="text-green-700 text-xs mt-2 space-y-1">
              <li>• <strong>Market Share:</strong> 70%+ of enterprise WAN traffic by 2010</li>
              <li>• <strong>Service Providers:</strong> Primary revenue source for carriers</li>
              <li>• <strong>Global Deployment:</strong> Available in 100+ countries</li>
              <li>• <strong>Enterprise Adoption:</strong> 90%+ of Fortune 500 companies</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">🔧 Technical Innovation Impact</h4>
            <p className="text-purple-800 text-sm">
              RFC 2547 introduced concepts that transformed networking:
            </p>
            <ul className="text-purple-700 text-xs mt-2 space-y-1">
              <li>• <strong>VRF Technology:</strong> Now used in data centers and cloud</li>
              <li>• <strong>Route Targets:</strong> Policy framework for SDN controllers</li>
              <li>• <strong>MPLS Labels:</strong> Influenced segment routing and EVPN</li>
              <li>• <strong>BGP Extensions:</strong> Foundation for modern BGP features</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h4 className="font-semibold text-yellow-900 mb-2">🚀 Evolution to Modern Technologies</h4>
            <p className="text-yellow-800 text-sm">
              BGP/MPLS VPN concepts influenced modern networking:
            </p>
            <ul className="text-yellow-700 text-xs mt-2 space-y-1">
              <li>• <strong>SD-WAN:</strong> Overlay networks inspired by MPLS VPN architecture</li>
              <li>• <strong>Cloud VPNs:</strong> AWS/Azure VPNs use similar concepts</li>
              <li>• <strong>Kubernetes:</strong> Network policies inspired by Route Targets</li>
              <li>• <strong>EVPN:</strong> Extends BGP/MPLS concepts to Layer 2</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">📚 External References</h5>
          <ul className="text-gray-700 text-sm space-y-1">
            <li><a href="https://tools.ietf.org/html/rfc4364" className="underline" target="_blank" rel="noopener noreferrer">RFC 4364: BGP/MPLS IP VPNs (Updated Standard)</a></li>
            <li><a href="https://www.cisco.com/c/en/us/tech/mpls/index.html" className="underline" target="_blank" rel="noopener noreferrer">Cisco MPLS Technology Center</a></li>
            <li><a href="https://tools.ietf.org/html/rfc4659" className="underline" target="_blank" rel="noopener noreferrer">RFC 4659: BGP-MPLS IP VPN Extension for IPv6</a></li>
            <li><a href="https://www.juniper.net/documentation/en_US/junos/information-products/pathway-pages/config-guide-vpns/config-guide-vpns-bgp-l3-vpns.html" className="underline" target="_blank" rel="noopener noreferrer">Juniper BGP Layer 3 VPNs Guide</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <h3>Comparison with Other VPN Technologies</h3>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-red-800">Traditional VPNs</h5>
            <p className="text-red-700 mt-1">
              <strong>Limitations:</strong> Point-to-point tunnels, complex mesh, limited scalability
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-green-800">BGP/MPLS VPNs</h5>
            <p className="text-green-700 mt-1">
              <strong>Advantages:</strong> Any-to-any connectivity, provider-managed, scalable routing
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-blue-800">Modern SD-WAN</h5>
            <p className="text-blue-700 mt-1">
              <strong>Evolution:</strong> Overlay approach inspired by MPLS, Internet-based transport
            </p>
          </div>
        </div>
      </div>

      <h3>Legacy and Modern Relevance</h3>

      <p>
        While RFC 2547 was superseded by <a href="https://tools.ietf.org/html/rfc4364" className="underline text-blue-600">RFC 4364</a> in 2006, 
        its core concepts remain foundational to enterprise networking. Modern technologies like 
        SD-WAN, cloud VPNs, and container networking all build upon the architectural principles 
        established in this pioneering specification.
      </p>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 2547 revolutionized enterprise networking by making scalable, secure 
          wide-area connectivity affordable and manageable. Its introduction of VRFs, 
          Route Targets, and BGP-based VPN signaling created the foundation for modern 
          service provider networks and influenced virtually every subsequent enterprise 
          networking technology. Understanding BGP/MPLS VPNs is essential for anyone 
          working with enterprise networks, as these concepts continue to shape how 
          organizations connect their distributed infrastructure.
        </p>
      </div>
    </article>
  );
}