import GlossaryTerm from '../../components/GlossaryTerm';
import MermaidDiagram from '../../components/MermaidDiagram';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC1390() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 1390: Transmission of IP and ARP over FDDI Networks (January 1993)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          This <GlossaryTerm>RFC</GlossaryTerm> solved a critical interoperability challenge by defining how
          <GlossaryTerm>IP</GlossaryTerm> and <GlossaryTerm>ARP</GlossaryTerm> protocols would work over FDDI (Fiber Distributed Data Interface)
          networks. Though FDDI is now obsolete, this specification demonstrated the
          internet's adaptability to new networking technologies.
        </p>
      </div>

      <h2>The FDDI Era: High-Speed Networking in the Early 1990s</h2>

      <p>
        In 1993, FDDI represented cutting-edge network technology. While Ethernet
        operated at 10 Mbps, FDDI delivered 100 Mbps over fiber optic cables,
        making it attractive for campus backbones and mission-critical applications.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-800 mb-2">What was FDDI?</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>🔌 <strong>Fiber Distributed Data Interface:</strong> 100 Mbps token ring network</li>
          <li>💍 <strong>Dual Ring Architecture:</strong> Primary and secondary rings for redundancy</li>
          <li>🏢 <strong>Campus Networks:</strong> Popular for building and site backbones</li>
          <li>⚡ <strong>High Speed:</strong> 10x faster than standard Ethernet of the time</li>
          <li>📏 <strong>Long Distance:</strong> Up to 200 km total network circumference</li>
        </ul>
      </div>

      <h3>The Interoperability Challenge</h3>

      <p>
        By 1993, <GlossaryTerm>IP</GlossaryTerm> networks were expanding rapidly, but they primarily ran over
        Ethernet. Organizations wanting to use FDDI's higher performance needed a
        standardized way to run <GlossaryTerm>IP</GlossaryTerm> traffic over these new networks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">The Problem</h4>
          <ul className="text-red-700 text-sm space-y-1">
            <li>• Different physical layer (fiber vs copper)</li>
            <li>• Different frame formats and addressing</li>
            <li>• Different <GlossaryTerm>MTU</GlossaryTerm> sizes (maximum frame size)</li>
            <li>• No standard for <GlossaryTerm>IP</GlossaryTerm> encapsulation over FDDI</li>
            <li>• <GlossaryTerm>ARP</GlossaryTerm> address resolution needed adaptation</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">RFC 1390's Solution</h4>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Standard <GlossaryTerm>IP</GlossaryTerm> encapsulation format</li>
            <li>• <GlossaryTerm>ARP</GlossaryTerm> protocol adaptation for FDDI addresses</li>
            <li>• Maximum <GlossaryTerm>MTU</GlossaryTerm> specification (4,352 bytes)</li>
            <li>• Bridge compatibility guidelines</li>
            <li>• Consistent addressing scheme</li>
          </ul>
        </div>
      </div>

      <h3>FDDI Network Architecture</h3>

      <p>
        FDDI used a dual-ring token-passing architecture that provided both
        high performance and fault tolerance:
      </p>

      <MermaidDiagram
        chart={`
graph TD
    subgraph "FDDI Dual Ring Network"
        A[Station A] --> B[Station B]
        B --> C[Station C] 
        C --> D[Station D]
        D --> A
        
        A -.-> D
        D -.-> C
        C -.-> B
        B -.-> A
    end
    
    subgraph "Legend"
        Primary[Primary Ring →]
        Secondary[Secondary Ring ⇠]
    end
    
    E[Token] --> A
    
    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#e1f5fe
    style D fill:#e1f5fe
    style E fill:#fff3cd
        `}
        className="my-6"
      />

      <h3>IP Encapsulation over FDDI</h3>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 1390 specified exactly how <GlossaryTerm>IP</GlossaryTerm> <GlossaryTerm>packet</GlossaryTerm>s should be wrapped in FDDI frames
        using IEEE 802.2 LLC and SNAP headers:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg my-6 overflow-x-auto">
        <h4 className="font-semibold mb-3">FDDI Frame with IP Packet</h4>
        <div className="grid grid-cols-12 gap-1 text-xs">
          <div className="col-span-2 bg-blue-200 p-2 text-center">FDDI Header</div>
          <div className="col-span-2 bg-green-200 p-2 text-center">LLC Header</div>
          <div className="col-span-2 bg-yellow-200 p-2 text-center">SNAP Header</div>
          <div className="col-span-4 bg-purple-200 p-2 text-center">IP Packet</div>
          <div className="col-span-2 bg-red-200 p-2 text-center">FDDI Trailer</div>
        </div>
        <div className="mt-4 text-sm space-y-1">
          <div><strong>LLC:</strong> Logical Link Control (IEEE 802.2)</div>
          <div><strong>SNAP:</strong> Sub-Network Access Protocol</div>
          <div><strong>MTU:</strong> Maximum 4,352 bytes for IP payload</div>
        </div>
      </div>

      <h3>Address Resolution Protocol (ARP) Adaptation</h3>

      <p>
        One of the key challenges was adapting <GlossaryTerm>ARP</GlossaryTerm> to work with FDDI's 48-bit
        hardware addresses while maintaining compatibility with Ethernet:
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-800 mb-3">ARP over FDDI Specifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">Hardware Parameters</h5>
            <ul className="space-y-1 text-blue-600">
              <li>• Hardware Type: 6 (IEEE 802 networks)</li>
              <li>• Hardware Address Length: 6 bytes</li>
              <li>• Protocol Type: 0x0800 (IP)</li>
              <li>• Protocol Address Length: 4 bytes</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">Address Format</h5>
            <ul className="space-y-1 text-blue-600">
              <li>• FDDI addresses: 48-bit (6 bytes)</li>
              <li>• Same as Ethernet MAC addresses</li>
              <li>• Bridge-compatible addressing</li>
              <li>• Canonical bit order</li>
            </ul>
          </div>
        </div>
      </div>

      <h3>Maximum Transmission Unit (MTU)</h3>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 1390 established that FDDI networks should support a maximum <GlossaryTerm>IP</GlossaryTerm> <GlossaryTerm>MTU</GlossaryTerm>
        of 4,352 bytes - much larger than Ethernet's 1,500 bytes:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="border border-gray-300 p-4 rounded-lg bg-orange-50">
          <h5 className="font-semibold text-orange-700">Ethernet MTU</h5>
          <div className="text-2xl font-bold text-orange-600">1,500</div>
          <div className="text-sm text-orange-600">bytes</div>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg bg-blue-50">
          <h5 className="font-semibold text-blue-700">FDDI MTU</h5>
          <div className="text-2xl font-bold text-blue-600">4,352</div>
          <div className="text-sm text-blue-600">bytes</div>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg bg-green-50">
          <h5 className="font-semibold text-green-700">Improvement</h5>
          <div className="text-2xl font-bold text-green-600">2.9x</div>
          <div className="text-sm text-green-600">larger frames</div>
        </div>
      </div>

      <h3>Bridging and Interoperability</h3>

      <p>
        A crucial aspect of <GlossaryTerm>RFC</GlossaryTerm> 1390 was ensuring FDDI networks could seamlessly
        connect to existing Ethernet infrastructure through bridges:
      </p>

      <MermaidDiagram
        chart={`
graph TD
    subgraph "Ethernet Segment"
        E1[Ethernet Host 1<br/>MTU: 1500]
        E2[Ethernet Host 2<br/>MTU: 1500]
        E3[Ethernet Host 3<br/>MTU: 1500]
    end
    
    Bridge[Translational Bridge<br/>MTU Handling]
    
    subgraph "FDDI Ring"
        F1[FDDI Station 1<br/>MTU: 4352]
        F2[FDDI Station 2<br/>MTU: 4352]
        F3[FDDI Station 3<br/>MTU: 4352]
    end
    
    E1 --> Bridge
    E2 --> Bridge
    E3 --> Bridge
    
    Bridge --> F1
    Bridge --> F2
    Bridge --> F3
    
    Bridge -.-> MTU_Issue[MTU Fragmentation<br/>4352 → 1500]
    
    style Bridge fill:#fff3cd
    style MTU_Issue fill:#ffebee
        `}
        className="my-6"
      />

      <ExpandableSection title="🐍 ELI-Pythonista: Understanding Network Encapsulation">
        <p>
          Let's explore how RFC 1390's encapsulation concepts apply to modern
          networking by simulating frame construction and address resolution:
        </p>

        <CodeBlock
          language="python"
          code={`import struct
import socket
from typing import Optional, Tuple

class NetworkFrame:
    """Base class for understanding network frame encapsulation"""
    
    def __init__(self, payload: bytes):
        self.payload = payload
    
    def total_size(self) -> int:
        """Calculate total frame size including headers"""
        raise NotImplementedError

class EthernetFrame(NetworkFrame):
    """Ethernet frame as defined in RFC 894"""
    
    def __init__(self, src_mac: str, dst_mac: str, ethertype: int, payload: bytes):
        super().__init__(payload)
        self.src_mac = self._parse_mac(src_mac)
        self.dst_mac = self._parse_mac(dst_mac)
        self.ethertype = ethertype
        self.max_payload = 1500  # Ethernet MTU
    
    def _parse_mac(self, mac_str: str) -> bytes:
        """Convert MAC address string to bytes"""
        return bytes.fromhex(mac_str.replace(':', ''))
    
    def total_size(self) -> int:
        return 14 + len(self.payload) + 4  # Header + payload + FCS
    
    def pack(self) -> bytes:
        """Pack frame into binary format"""
        header = self.dst_mac + self.src_mac + struct.pack('!H', self.ethertype)
        return header + self.payload

class FDDIFrame(NetworkFrame):
    """FDDI frame as defined in RFC 1390"""
    
    def __init__(self, src_addr: str, dst_addr: str, payload: bytes):
        super().__init__(payload)
        self.src_addr = self._parse_mac(src_addr)
        self.dst_addr = self._parse_mac(dst_addr)
        self.max_payload = 4352  # FDDI MTU from RFC 1390
    
    def _parse_mac(self, mac_str: str) -> bytes:
        """Convert FDDI address string to bytes"""
        return bytes.fromhex(mac_str.replace(':', ''))
    
    def total_size(self) -> int:
        # FDDI header + LLC + SNAP + payload + trailer
        return 13 + 8 + len(self.payload) + 4
    
    def pack_with_llc_snap(self) -> bytes:
        """Pack FDDI frame with LLC/SNAP headers per RFC 1390"""
        # FDDI header (simplified)
        fddi_header = b'\\x57'  # Frame control
        fddi_header += self.dst_addr + self.src_addr
        
        # LLC header (IEEE 802.2)
        llc_header = b'\\xAA\\xAA\\x03'  # DSAP, SSAP, Control
        
        # SNAP header  
        snap_header = b'\\x00\\x00\\x00\\x08\\x00'  # OUI + EtherType (IP)
        
        return fddi_header + llc_header + snap_header + self.payload

def demonstrate_mtu_differences():
    """Show how MTU differences affect frame efficiency"""
    
    print("=== RFC 1390 MTU Impact Analysis ===\\n")
    
    # Simulate a large data transfer
    data_size = 10000  # 10KB of data to transfer
    
    # Ethernet fragmentation
    ethernet_mtu = 1500
    ethernet_frames = (data_size + ethernet_mtu - 1) // ethernet_mtu
    ethernet_overhead = ethernet_frames * (14 + 4)  # Header + FCS per frame
    
    # FDDI efficiency 
    fddi_mtu = 4352
    fddi_frames = (data_size + fddi_mtu - 1) // fddi_mtu
    fddi_overhead = fddi_frames * (13 + 8 + 4)  # FDDI + LLC/SNAP + FCS
    
    print(f"Transferring {data_size} bytes of data:")
    print(f"\\nEthernet (RFC 894):")
    print(f"  MTU: {ethernet_mtu} bytes")
    print(f"  Frames needed: {ethernet_frames}")
    print(f"  Total overhead: {ethernet_overhead} bytes")
    print(f"  Efficiency: {(data_size / (data_size + ethernet_overhead)) * 100:.1f}%")
    
    print(f"\\nFDDI (RFC 1390):")
    print(f"  MTU: {fddi_mtu} bytes") 
    print(f"  Frames needed: {fddi_frames}")
    print(f"  Total overhead: {fddi_overhead} bytes")
    print(f"  Efficiency: {(data_size / (data_size + fddi_overhead)) * 100:.1f}%")
    
    efficiency_gain = ((data_size + ethernet_overhead) / (data_size + fddi_overhead) - 1) * 100
    print(f"\\nFDDI Advantage: {efficiency_gain:.1f}% less total traffic")

class ARPPacket:
    """ARP packet implementation supporting both Ethernet and FDDI"""
    
    def __init__(self, hw_type: int, hw_len: int, proto_type: int, proto_len: int):
        self.hw_type = hw_type      # Hardware type
        self.hw_len = hw_len        # Hardware address length
        self.proto_type = proto_type # Protocol type  
        self.proto_len = proto_len  # Protocol address length
        self.operation = 1          # 1 = Request, 2 = Reply
    
    @classmethod
    def for_ethernet(cls) -> 'ARPPacket':
        """Create ARP packet for Ethernet (RFC 826)"""
        return cls(hw_type=1, hw_len=6, proto_type=0x0800, proto_len=4)
    
    @classmethod 
    def for_fddi(cls) -> 'ARPPacket':
        """Create ARP packet for FDDI (RFC 1390)"""
        return cls(hw_type=6, hw_len=6, proto_type=0x0800, proto_len=4)
    
    def pack_request(self, sender_hw: bytes, sender_ip: bytes, target_ip: bytes) -> bytes:
        """Pack ARP request packet"""
        packet = struct.pack('!HHBBH', 
                           self.hw_type, self.proto_type,
                           self.hw_len, self.proto_len, self.operation)
        packet += sender_hw + sender_ip
        packet += b'\\x00' * self.hw_len + target_ip  # Unknown target HW
        return packet

def demonstrate_arp_adaptation():
    """Show how ARP was adapted for FDDI networks"""
    
    print("\\n=== ARP Protocol Adaptation ===\\n")
    
    # Ethernet ARP
    eth_arp = ARPPacket.for_ethernet()
    sender_mac = bytes.fromhex('001122334455')
    sender_ip = socket.inet_aton('192.168.1.10')
    target_ip = socket.inet_aton('192.168.1.1')
    
    eth_request = eth_arp.pack_request(sender_mac, sender_ip, target_ip)
    
    print("Ethernet ARP Request:")
    print(f"  Hardware Type: {eth_arp.hw_type} (Ethernet)")
    print(f"  Hardware Length: {eth_arp.hw_len} bytes")
    print(f"  Packet Size: {len(eth_request)} bytes")
    
    # FDDI ARP (RFC 1390)
    fddi_arp = ARPPacket.for_fddi()
    fddi_request = fddi_arp.pack_request(sender_mac, sender_ip, target_ip)
    
    print("\\nFDDI ARP Request (RFC 1390):")
    print(f"  Hardware Type: {fddi_arp.hw_type} (IEEE 802)")
    print(f"  Hardware Length: {fddi_arp.hw_len} bytes")
    print(f"  Packet Size: {len(fddi_request)} bytes")
    print("  Note: Same 48-bit addressing as Ethernet!")

def simulate_network_bridge():
    """Simulate RFC 1390 bridge functionality"""
    
    print("\\n=== Network Bridge Simulation ===\\n")
    
    # Large packet from FDDI network
    large_payload = b'X' * 3000  # 3KB packet
    fddi_frame = FDDIFrame('00:11:22:33:44:55', '00:AA:BB:CC:DD:EE', large_payload)
    
    print(f"FDDI packet: {len(large_payload)} bytes payload")
    print(f"Total FDDI frame: {fddi_frame.total_size()} bytes")
    
    # Bridge must fragment for Ethernet
    ethernet_mtu = 1500
    fragments_needed = (len(large_payload) + ethernet_mtu - 1) // ethernet_mtu
    
    print(f"\\nBridging to Ethernet:")
    print(f"  Must fragment into {fragments_needed} pieces")
    print(f"  Each Ethernet frame ≤ {ethernet_mtu} bytes payload")
    
    # Show fragmentation
    for i in range(fragments_needed):
        start = i * ethernet_mtu
        end = min((i + 1) * ethernet_mtu, len(large_payload))
        fragment_size = end - start
        
        eth_frame = EthernetFrame('00:11:22:33:44:55', '00:AA:BB:CC:DD:EE', 
                                 0x0800, large_payload[start:end])
        
        print(f"  Fragment {i+1}: {fragment_size} bytes payload, {eth_frame.total_size()} total")

# Run all demonstrations
demonstrate_mtu_differences()
demonstrate_arp_adaptation()
simulate_network_bridge()`}
        />

        <p>
          <strong>Modern Relevance:</strong> Understanding network encapsulation
        </p>

        <CodeBlock
          language="python"
          code={`def analyze_modern_protocols():
    """Show how RFC 1390 concepts apply to modern networking"""
    
    print("\\n=== Modern Protocol Evolution ===\\n")
    
    # Protocol evolution timeline
    protocols = [
        ("Ethernet", 1980, 10, 1500),
        ("FDDI", 1990, 100, 4352),
        ("Fast Ethernet", 1995, 100, 1500),
        ("Gigabit Ethernet", 1998, 1000, 1500),
        ("10G Ethernet", 2002, 10000, 1500),
        ("Jumbo Frames", 2000, 1000, 9000),
    ]
    
    print("Network Technology Evolution:")
    print("Technology        Year  Speed(Mbps)  MTU(bytes)")
    print("-" * 45)
    
    for name, year, speed, mtu in protocols:
        print(f"{name:<15} {year:>6} {speed:>10} {mtu:>10}")
    
    print("\\nKey Lessons from RFC 1390:")
    print("1. Interoperability requires careful protocol adaptation")
    print("2. MTU size significantly impacts network efficiency")
    print("3. Address format compatibility enables bridging")
    print("4. Standard encapsulation prevents vendor lock-in")
    
    print("\\nModern Applications:")
    print("• VLANs use similar encapsulation concepts")
    print("• VPNs layer protocols like RFC 1390 layered IP over FDDI")
    print("• Modern bridging/switching evolved from these principles")
    print("• Cloud networking uses multiple encapsulation layers")

# Run modern analysis
analyze_modern_protocols()`}
        />

        <p>
          This demonstrates how RFC 1390's approach to protocol layering and
          interoperability became fundamental to modern networking!
        </p>
      </ExpandableSection>

      <h3>Why FDDI Disappeared</h3>

      <p>
        Despite FDDI's technical advantages, it was eventually displaced by
        simpler, less expensive technologies:
      </p>

      <div className="bg-red-50 border border-red-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-red-800 mb-3">FDDI's Decline</h4>
        <ul className="text-red-700 text-sm space-y-1">
          <li>💰 <strong>Cost:</strong> Expensive fiber optic infrastructure</li>
          <li>⚙️ <strong>Complexity:</strong> Complex token-passing protocol</li>
          <li>🔧 <strong>Management:</strong> Difficult to configure and troubleshoot</li>
          <li>📈 <strong>Competition:</strong> Fast Ethernet (100 Mbps) on cheaper copper</li>
          <li>🏢 <strong>Switching:</strong> Ethernet switching eliminated collision domains</li>
        </ul>
      </div>

      <h3>Lasting Legacy of RFC 1390</h3>

      <p>
        While FDDI is obsolete, <GlossaryTerm>RFC</GlossaryTerm> 1390's approach to network interoperability
        established principles still used today:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">Technical Principles</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Standard encapsulation formats</li>
            <li>• Protocol layering and abstraction</li>
            <li>• Address format compatibility</li>
            <li>• <GlossaryTerm>MTU</GlossaryTerm> handling and fragmentation</li>
            <li>• Bridge/gateway interoperability</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Modern Applications</h4>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• VLAN tagging (IEEE 802.1Q)</li>
            <li>• MPLS label switching</li>
            <li>• VPN tunneling protocols</li>
            <li>• Software-defined networking</li>
            <li>• Container networking overlays</li>
          </ul>
        </div>
      </div>

      <h3>Educational Value</h3>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 1390 teaches important lessons about network protocol design
        and technology evolution:
      </p>

      <ul>
        <li><strong>Adaptability:</strong> Internet protocols must adapt to new technologies</li>
        <li><strong>Interoperability:</strong> Standards enable diverse networks to communicate</li>
        <li><strong>Layering:</strong> Protocol layers provide abstraction and flexibility</li>
        <li><strong>Pragmatism:</strong> Technical superiority doesn't guarantee market success</li>
      </ul>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
        <h4 className="text-yellow-900 font-semibold">Historical Context</h4>
        <p className="text-yellow-800 text-sm">
          <GlossaryTerm>RFC</GlossaryTerm> 1390 represents the internet community's commitment to openness
          and interoperability. Rather than letting proprietary solutions fragment
          the network, the IETF created standards that allowed innovation while
          maintaining connectivity.
        </p>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          <GlossaryTerm>RFC</GlossaryTerm> 1390 demonstrates how the internet's open standards approach
          enables rapid adoption of new technologies while maintaining global
          connectivity. This principle continues to drive internet innovation today.
        </p>
      </div>
    </article>
  );
}