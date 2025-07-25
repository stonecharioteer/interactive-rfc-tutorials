import { Link } from "react-router-dom";
import { ExternalLink, Building2 } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import GlossaryTerm from "../../components/GlossaryTerm";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC4364() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 4364: BGP/MPLS IP VPNs - February 2006
      </h1>
      <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <Building2 className="h-5 w-5 text-purple-600 mr-2" />
          <span className="font-semibold text-purple-800">
            Enterprise VPN Architecture Evolution
          </span>
        </div>
        <p className="text-purple-700 mb-0">
          RFC 4364 defines the current standard for BGP/MPLS IP VPNs, replacing 
          RFC 2547 with enhanced security, scalability, and operational features. 
          This specification powers the backbone infrastructure of modern enterprise 
          networking, cloud providers, and service provider VPN services that 
          connect millions of business locations worldwide.
        </p>
        <p className="text-purple-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc4364.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 4364 PDF <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>Evolution from RFC 2547</h2>
      <p>
        RFC 4364 represents the maturation of <GlossaryTerm>BGP/MPLS IP VPN</GlossaryTerm> 
        technology, building upon the foundation established by{" "}
        <Link to="/rfc/2547" className="text-blue-600 hover:text-blue-800">
          RFC 2547 (1999)
        </Link>. After seven years of real-world deployment, RFC 4364 addressed 
        operational challenges, security concerns, and scalability limitations 
        discovered in production networks.
      </p>

      <p>
        The specification became the definitive standard for service provider 
        VPN offerings and enterprise WAN architectures, enabling the massive 
        scale of modern business connectivity we rely on today.
      </p>

      <h2>BGP/MPLS IP VPN Architecture</h2>
      <p>
        RFC 4364 defines a sophisticated architecture that separates customer 
        routing from provider routing, enabling secure, scalable, and efficient 
        multi-tenant networking across shared infrastructure.
      </p>

      <MermaidDiagram
        chart={`
graph TB
    subgraph "Customer Site A"
        CE1[CE Router A<br/>Customer Equipment]
        LAN1[Customer LAN<br/>10.1.0.0/16]
    end
    
    subgraph "Service Provider Core"
        PE1[PE Router 1<br/>Provider Edge]
        P1[P Router<br/>Provider Core]
        P2[P Router<br/>Provider Core]
        PE2[PE Router 2<br/>Provider Edge]
        
        subgraph "VRF Instance"
            VRF1[Customer A VRF<br/>RD: 100:1<br/>RT: 100:1]
            VRF2[Customer A VRF<br/>RD: 100:1<br/>RT: 100:1]
        end
    end
    
    subgraph "Customer Site B"
        CE2[CE Router B<br/>Customer Equipment]
        LAN2[Customer LAN<br/>10.2.0.0/16]
    end
    
    CE1 ---|BGP/Static| PE1
    PE1 ---|MP-BGP VPNv4| PE2
    PE2 ---|BGP/Static| CE2
    
    PE1 --- P1
    P1 --- P2
    P2 --- PE2
    
    PE1 -.-> VRF1
    PE2 -.-> VRF2
    
    LAN1 --- CE1
    LAN2 --- CE2
    
    style PE1 fill:#e1f5fe
    style PE2 fill:#e1f5fe
    style P1 fill:#f3e5f5
    style P2 fill:#f3e5f5
    style VRF1 fill:#e8f5e8
    style VRF2 fill:#e8f5e8
        `}
        className="my-6"
      />

      <h3>Key Components</h3>

      <h4>1. Customer Edge (CE) Routers</h4>
      <p>
        Customer-owned equipment that connects to the service provider network. 
        CE routers are unaware of the MPLS VPN infrastructure and simply exchange 
        routes with PE routers using standard routing protocols.
      </p>

      <h4>2. Provider Edge (PE) Routers</h4>
      <p>
        Service provider routers that maintain separate <GlossaryTerm>Virtual Routing and Forwarding (VRF)</GlossaryTerm> 
        instances for each customer. PE routers are responsible for:
      </p>

      <ul>
        <li>Importing customer routes into appropriate VRFs</li>
        <li>Adding MPLS labels and route targets</li>
        <li>Exchanging VPN routes via MP-BGP</li>
        <li>Forwarding customer traffic through MPLS tunnels</li>
      </ul>

      <h4>3. Provider (P) Routers</h4>
      <p>
        Core MPLS routers that forward labeled packets between PE routers. P routers 
        have no knowledge of customer VPNs and simply perform label switching 
        based on the outer MPLS labels.
      </p>

      <ExpandableSection title="🎯 Understanding VRFs: Virtual Networks in One Router">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of VRFs like Docker containers for network routing:</strong>
          </p>
          <p>
            Just as Docker containers isolate applications on the same server, 
            VRFs isolate customer networks on the same router. Each VRF has its 
            own routing table, so Customer A's "192.168.1.0/24" network is 
            completely separate from Customer B's "192.168.1.0/24" network.
          </p>
          <p className="mt-2">
            <strong>The Magic:</strong> One physical PE router can handle hundreds 
            of customers simultaneously, each thinking they have their own private 
            router. This is like running hundreds of isolated network "containers" 
            on the same hardware.
          </p>
          <p className="mt-2">
            <strong>Why This Matters:</strong> Service providers can offer 
            enterprise-grade VPN services at scale without needing dedicated 
            hardware for each customer. It's the foundation of modern "Network as a Service."
          </p>
        </div>
      </ExpandableSection>

      <h2>Route Distinguishers and Route Targets</h2>
      <p>
        RFC 4364 defines two critical identifiers that enable scalable multi-tenant routing:
      </p>

      <h3>Route Distinguisher (RD)</h3>
      <p>
        An 8-byte identifier prepended to IPv4 routes to create unique <GlossaryTerm>VPN-IPv4</GlossaryTerm> 
        routes. This allows the same IPv4 prefix to exist in multiple customer VPNs 
        without conflict.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold mb-2">Route Distinguisher Format:</h4>
        <ul>
          <li><strong>Type 0:</strong> ASN:nn (e.g., 65001:100)</li>
          <li><strong>Type 1:</strong> IP:nn (e.g., 192.0.2.1:100)</li>
          <li><strong>Type 2:</strong> ASN:nn (4-byte ASN support)</li>
        </ul>
      </div>

      <h3>Route Target (RT)</h3>
      <p>
        Extended BGP communities that control VPN route import/export policies. 
        Route targets determine which customer sites can reach each other, 
        enabling flexible VPN topologies.
      </p>

      <ExpandableSection title="🚀 Real-World Example: Multi-Site Enterprise">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Acme Corp has 3 sites and wants hub-and-spoke connectivity:</strong>
          </p>
          <ul>
            <li><strong>Headquarters (Hub):</strong> Import RT 100:1, 100:2, 100:3 | Export RT 100:100</li>
            <li><strong>Branch A (Spoke):</strong> Import RT 100:100 | Export RT 100:1</li>
            <li><strong>Branch B (Spoke):</strong> Import RT 100:100 | Export RT 100:2</li>
          </ul>
          <p className="mt-3">
            <strong>Result:</strong> Branches can reach headquarters (import 100:100), 
            but cannot directly reach each other. All inter-branch traffic flows 
            through the hub, providing centralized security and control.
          </p>
          <p className="mt-2">
            <strong>Flexibility:</strong> Need branch-to-branch connectivity? 
            Simply add each other's export RTs to their import policies. No 
            physical network changes required!
          </p>
        </div>
      </ExpandableSection>

      <h2>MP-BGP VPNv4 Route Exchange</h2>
      <p>
        RFC 4364 extends BGP with new address families to carry VPN routing 
        information. <GlossaryTerm>Multiprotocol BGP (MP-BGP)</GlossaryTerm> enables 
        PE routers to exchange customer routes along with their associated MPLS 
        labels and route targets.
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant CE1 as CE Router<br/>Customer Site A
    participant PE1 as PE Router 1<br/>Provider Edge
    participant RR as Route Reflector<br/>MP-BGP Core
    participant PE2 as PE Router 2<br/>Provider Edge
    participant CE2 as CE Router<br/>Customer Site B

    Note over CE1,CE2: Customer Route Advertisement Flow

    CE1->>+PE1: BGP Update: 10.1.0.0/16
    Note over PE1: Import into VRF<br/>Add RD: 100:1<br/>Add RT: 100:1<br/>Assign MPLS Label: 1001

    PE1->>+RR: MP-BGP VPNv4 Update<br/>100:1:10.1.0.0/16<br/>RT: 100:1, Label: 1001
    
    RR->>+PE2: MP-BGP VPNv4 Update<br/>100:1:10.1.0.0/16<br/>RT: 100:1, Label: 1001
    
    Note over PE2: Check RT import policy<br/>RT 100:1 matches<br/>Install in Customer VRF
    
    PE2->>+CE2: BGP Update: 10.1.0.0/16<br/>Next-hop: PE2
    
    Note over CE1,CE2: Data Plane: Customer Traffic Flow
    
    CE2->>PE2: IP Packet to 10.1.1.1
    Note over PE2: Lookup in VRF<br/>Push MPLS Labels<br/>Outer: LSP to PE1<br/>Inner: VPN Label 1001
    
    PE2->>PE1: MPLS Packet<br/>Labels: [LSP][1001][IP]
    
    Note over PE1: Pop outer LSP label<br/>Lookup VPN label 1001<br/>Forward in Customer VRF
    
    PE1->>CE1: IP Packet to 10.1.1.1
        `}
        className="my-6"
      />

      <h2>MPLS Label Stack and Forwarding</h2>
      <p>
        RFC 4364 defines a two-level MPLS label stack that enables both traffic 
        engineering and VPN separation:
      </p>

      <ul>
        <li>
          <strong>Outer Label (Transport/LDP):</strong> Used for forwarding through 
          the MPLS core between PE routers
        </li>
        <li>
          <strong>Inner Label (VPN):</strong> Identifies the customer VRF and 
          forwarding context at the egress PE router
        </li>
      </ul>

      <ExpandableSection title="🐍 ELI-Pythonista: VPN Route Processing">
        <CodeBlock
          language="python"
          code={getCodeExample("rfc4364_vpn_processor")}
          title="rfc4364_vpn_processor.py"
        />
      </ExpandableSection>

      <h2>Enhanced Security Features</h2>
      <p>
        RFC 4364 addressed several security concerns identified in early BGP/MPLS 
        VPN deployments:
      </p>

      <h3>1. Route Target Validation</h3>
      <p>
        Strict validation of route target communities prevents accidental or 
        malicious route leakage between customer VPNs.
      </p>

      <h3>2. PE-CE Authentication</h3>
      <p>
        Mandatory authentication between PE and CE routers prevents unauthorized 
        route injection and ensures customer identity verification.
      </p>

      <h3>3. MPLS Label Security</h3>
      <p>
        Proper label allocation and validation mechanisms prevent label spoofing 
        attacks and unauthorized access to customer traffic.
      </p>

      <h3>4. Route Filtering and Validation</h3>
      <p>
        Enhanced route filtering capabilities allow service providers to implement 
        granular security policies and prevent route hijacking.
      </p>

      <ExpandableSection title="🔒 Understanding VPN Security Model">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of BGP/MPLS VPNs like a secure apartment building:</strong>
          </p>
          <p>
            <strong>Route Targets = Key Cards:</strong> Each customer gets specific 
            key cards (route targets) that only open doors to their designated 
            areas. A customer can't accidentally walk into another customer's space.
          </p>
          <p className="mt-2">
            <strong>VRFs = Separate Apartments:</strong> Even though everyone 
            shares the same building (PE router), each customer has completely 
            isolated living space with their own routing table.
          </p>
          <p className="mt-2">
            <strong>MPLS Labels = Postal System:</strong> Like apartment numbers 
            on mail, MPLS labels ensure traffic gets delivered to the right 
            customer VRF without mixing up with other tenants.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> Customers get enterprise-grade security 
            and isolation while sharing cost-effective infrastructure.
          </p>
        </div>
      </ExpandableSection>

      <h2>Scalability Improvements</h2>
      <p>
        RFC 4364 introduced several enhancements to support massive scale deployments:
      </p>

      <h3>1. Route Reflector Support</h3>
      <p>
        Dedicated route reflectors eliminate the need for full-mesh MP-BGP between 
        all PE routers, reducing complexity from O(n²) to O(n).
      </p>

      <h3>2. Hierarchical VPNs</h3>
      <p>
        Support for multi-level VPN architectures enables service providers to 
        build scalable wholesale and enterprise services.
      </p>

      <h3>3. Optimized Label Distribution</h3>
      <p>
        Improved label allocation and distribution mechanisms reduce memory usage 
        and convergence times in large networks.
      </p>

      <h3>4. Multi-AS VPN Support</h3>
      <p>
        Enhanced procedures for VPNs spanning multiple autonomous systems enable 
        global enterprise connectivity and inter-provider services.
      </p>

      <h2>Modern Internet Impact: The Enterprise Connectivity Revolution</h2>
      <p>
        RFC 4364 fundamentally transformed how enterprises connect their distributed 
        locations, enabling the global business operations we see today.
      </p>

      <h3>Market Transformation Statistics</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">📈 Market Growth</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>$45B+ global MPLS VPN market</strong> (2023)</li>
            <li>• <strong>95% of Fortune 500</strong> use MPLS VPNs</li>
            <li>• <strong>50M+ enterprise sites</strong> connected globally</li>
            <li>• <strong>99.9% uptime SLAs</strong> standard offering</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🏢 Enterprise Benefits</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>80% cost reduction</strong> vs private lines</li>
            <li>• <strong>10x faster deployment</strong> of new sites</li>
            <li>• <strong>Centralized security</strong> and policy control</li>
            <li>• <strong>Any-to-any connectivity</strong> with QoS guarantees</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">☁️ Cloud Integration</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>Direct cloud connectivity</strong> (AWS, Azure, GCP)</li>
            <li>• <strong>Hybrid cloud architectures</strong> seamlessly integrated</li>
            <li>• <strong>SD-WAN overlay</strong> services built on MPLS</li>
            <li>• <strong>Multi-cloud networking</strong> with consistent policies</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">🚀 Technical Innovation</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>Service chaining</strong> and network function virtualization</li>
            <li>• <strong>Intent-based networking</strong> automation</li>
            <li>• <strong>Segment routing</strong> evolution (SRv6)</li>
            <li>• <strong>5G enterprise slicing</strong> foundations</li>
          </ul>
        </div>
      </div>

      <h3>Current Applications Powered by RFC 4364</h3>

      <h4>1. Enterprise WAN Services</h4>
      <ul>
        <li><strong>Global Corporations:</strong> Connecting thousands of locations with guaranteed SLAs</li>
        <li><strong>Financial Services:</strong> High-security, low-latency trading networks</li>
        <li><strong>Healthcare:</strong> HIPAA-compliant connectivity for hospital systems</li>
        <li><strong>Retail Chains:</strong> Point-of-sale and inventory management networks</li>
      </ul>

      <h4>2. Cloud Provider Services</h4>
      <ul>
        <li><strong>AWS Direct Connect:</strong> Dedicated enterprise connectivity to AWS</li>
        <li><strong>Azure ExpressRoute:</strong> Private connections to Azure services</li>
        <li><strong>Google Cloud Interconnect:</strong> Enterprise hybrid cloud connectivity</li>
        <li><strong>Oracle FastConnect:</strong> Dedicated database and application access</li>
      </ul>

      <h4>3. Service Provider Offerings</h4>
      <ul>
        <li><strong>Verizon Business:</strong> Global MPLS VPN services</li>
        <li><strong>AT&T:</strong> Enterprise networking and SD-WAN services</li>
        <li><strong>British Telecom:</strong> Global connectivity solutions</li>
        <li><strong>NTT Communications:</strong> International MPLS VPN services</li>
      </ul>

      <ExpandableSection title="🐍 ELI-Pythonista: VPN Service Provisioning">
        <CodeBlock
          language="python"
          code={getCodeExample("rfc4364_service_provisioner")}
          title="rfc4364_service_provisioner.py"
        />
      </ExpandableSection>

      <h2>Evolution to Modern Networking Technologies</h2>
      <p>
        While RFC 4364 remains the foundation of enterprise connectivity, it has 
        evolved to integrate with modern networking paradigms:
      </p>

      <h3>1. SD-WAN Integration</h3>
      <p>
        Software-Defined WAN solutions often use MPLS VPNs as underlying transport, 
        adding intelligent path selection and application optimization on top.
      </p>

      <h3>2. Segment Routing Evolution</h3>
      <p>
        <GlossaryTerm>Segment Routing v6 (SRv6)</GlossaryTerm> provides a modern 
        alternative to MPLS with simplified operations and enhanced programmability.
      </p>

      <h3>3. Network Function Virtualization</h3>
      <p>
        VPN services are increasingly delivered as virtualized network functions, 
        enabling rapid service deployment and customization.
      </p>

      <h3>4. Intent-Based Networking</h3>
      <p>
        Modern orchestration systems use RFC 4364 principles to automatically 
        provision and manage VPN services based on business intent.
      </p>

      <h2>Challenges and Future Evolution</h2>
      <p>
        Despite its success, RFC 4364 faces challenges from emerging technologies 
        and changing enterprise requirements:
      </p>

      <h3>Current Challenges</h3>
      <ul>
        <li><strong>Complexity:</strong> Requires deep networking expertise to design and operate</li>
        <li><strong>Agility:</strong> Traditional provisioning can take weeks or months</li>
        <li><strong>Cloud Integration:</strong> Not designed for cloud-native architectures</li>
        <li><strong>Cost:</strong> High-end MPLS services can be expensive for smaller enterprises</li>
      </ul>

      <h3>Future Directions</h3>
      <ul>
        <li><strong>SASE (Secure Access Service Edge):</strong> Cloud-delivered networking and security</li>
        <li><strong>5G Network Slicing:</strong> Next-generation enterprise connectivity</li>
        <li><strong>Quantum-Safe Security:</strong> Preparing for post-quantum cryptography</li>
        <li><strong>Edge Computing:</strong> Distributed processing with consistent connectivity</li>
      </ul>

      <ExpandableSection title="🔗 Docker Demonstration: BGP/MPLS VPN Simulation">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Interactive BGP/MPLS VPN demonstration available!</strong>
          </p>
          <p>
            The Docker example in <code>docker-examples/rfc4364-bgp-mpls-vpn/</code> 
            provides a complete simulation of a service provider MPLS network with 
            multiple customer VPNs.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc4364-bgp-mpls-vpn/
docker compose up -d

# Access the network topology viewer at:
# http://localhost:8080

# Monitor BGP/MPLS operations:
# docker compose logs -f pe-router-1`}
          />
          <p className="mt-3 text-sm">
            The demonstration includes PE routers with VRF configurations, MP-BGP 
            route exchange, MPLS label forwarding, and customer isolation verification.
          </p>
        </div>
      </ExpandableSection>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Key Takeaways for Modern Internet Understanding
        </h3>
        <ul className="text-blue-800">
          <li>
            RFC 4364 enabled the enterprise connectivity revolution, powering the 
            global business operations we rely on today
          </li>
          <li>
            BGP/MPLS VPNs provide the scalable, secure foundation for enterprise 
            WAN services and cloud connectivity
          </li>
          <li>
            The specification's multi-tenancy model influenced modern cloud 
            networking and container orchestration architectures
          </li>
          <li>
            Understanding VRFs, route targets, and MP-BGP is essential for 
            comprehending enterprise networking and service provider operations
          </li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Learn More</h3>
        <ul className="space-y-1">
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc4364.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 4364: BGP/MPLS IP VPNs
            </a>
          </li>
          <li>
            <Link to="/rfc/2547" className="text-blue-600 hover:text-blue-800 underline">
              RFC 2547: BGP/MPLS VPNs (Historical)
            </Link>
          </li>
          <li>
            <a href="https://tools.ietf.org/html/rfc4271" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 4271: Border Gateway Protocol 4 (BGP-4)
            </a>
          </li>
          <li>
            <a href="https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/mp_l3_vpns/configuration/xe-16/mp-l3-vpns-xe-16-book.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              Cisco MPLS VPN Configuration Guide
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Timeline
        </Link>
      </div>
    </article>
  );
}