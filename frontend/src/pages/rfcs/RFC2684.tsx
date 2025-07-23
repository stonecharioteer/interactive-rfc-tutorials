import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC2684() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 2684: Multiprotocol Encapsulation over ATM (September 1999)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          ATM Convergence Bridge
        </h3>
        <p className="text-blue-800">
          <GlossaryTerm>RFC 2684</GlossaryTerm> enabled the integration of <GlossaryTerm>ATM</GlossaryTerm> networks 
          with IP and other protocols, creating a crucial bridge between telecom infrastructure and 
          data networking. This specification made high-speed ATM networks practical for internet services.
        </p>
        <p className="text-blue-700 text-sm mt-2">
          <strong>Read the original:</strong> <a href="https://www.rfc-editor.org/rfc/rfc2684.html" 
          className="underline" target="_blank" rel="noopener noreferrer">RFC 2684</a>
        </p>
      </div>

      <h2>The ATM Integration Challenge</h2>

      <p>
        By 1999, <GlossaryTerm>ATM</GlossaryTerm> (Asynchronous Transfer Mode) was widely deployed in 
        telecommunications networks, offering guaranteed <GlossaryTerm>QoS</GlossaryTerm> and high-speed switching. 
        However, ATM's cell-based architecture (53-byte cells) needed a way to efficiently carry 
        variable-length <GlossaryTerm>IP</GlossaryTerm> packets and other protocols. RFC 2684 solved this 
        by defining encapsulation methods for running multiple protocols over ATM.
      </p>

      <h3>ATM Fundamentals</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded">
          <h4 className="font-semibold text-gray-900">🔬 ATM Cell Structure</h4>
          <p className="text-gray-800 text-sm">
            Fixed 53-byte cells: 5-byte header + 48-byte payload. 
            Enables predictable switching and guaranteed QoS.
          </p>
          <code className="text-xs bg-gray-100 p-1 rounded block mt-2">
            [Header 5B][Payload 48B] = 53 bytes total
          </code>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">🎯 Virtual Circuits</h4>
          <p className="text-green-800 text-sm">
            Connection-oriented using VPI/VCI identifiers. 
            Each virtual circuit provides dedicated bandwidth and QoS.
          </p>
          <code className="text-xs bg-green-100 p-1 rounded block mt-2">
            VPI/VCI → Virtual Path/Channel Identifier
          </code>
        </div>
      </div>

      <h3>RFC 2684 Encapsulation Methods</h3>

      <p>
        RFC 2684 defines two primary encapsulation approaches for carrying protocols over ATM:
      </p>

      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-purple-900 mb-3">Encapsulation Options</h4>
        
        <div className="space-y-4">
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-blue-800">🔗 LLC/SNAP Encapsulation</h5>
            <p className="text-sm text-blue-700 mt-1">
              Uses IEEE 802.2 LLC header with SNAP extension to identify protocols. 
              Supports multiple protocols on single <GlossaryTerm>VCC</GlossaryTerm> (Virtual Channel Connection).
            </p>
            <code className="text-xs bg-blue-50 p-1 rounded block mt-2">
              [ATM Header][LLC][SNAP][Protocol Data]
            </code>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-green-800">⚡ VC-based Multiplexing</h5>
            <p className="text-sm text-green-700 mt-1">
              Dedicates entire VCC to single protocol type. More efficient but requires 
              separate virtual circuits for each protocol.
            </p>
            <code className="text-xs bg-green-50 p-1 rounded block mt-2">
              [ATM Header][Protocol Data] (no LLC/SNAP)
            </code>
          </div>
        </div>
      </div>

      <h3>Protocol Support</h3>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-900 mb-3">Supported Protocols</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <h5 className="font-semibold text-yellow-800">Network Layer</h5>
            <ul className="text-yellow-700 mt-1 space-y-1">
              <li>• <GlossaryTerm>IP</GlossaryTerm> (IPv4 and IPv6)</li>
              <li>• IPX (Novell NetWare)</li>
              <li>• AppleTalk</li>
              <li>• CLNP (OSI)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-yellow-800">Data Link Layer</h5>
            <ul className="text-yellow-700 mt-1 space-y-1">
              <li>• <GlossaryTerm>Ethernet</GlossaryTerm> 802.3</li>
              <li>• 802.5 Token Ring</li>
              <li>• FDDI</li>
              <li>• PPP frames</li>
            </ul>
          </div>
        </div>
      </div>

      <h3>ATM Adaptation Layer (AAL5)</h3>

      <p>
        RFC 2684 primarily uses <GlossaryTerm>AAL5</GlossaryTerm> (ATM Adaptation Layer 5) for data services:
      </p>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-indigo-900 mb-3">AAL5 Features</h4>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-2 rounded border">
            <strong>Variable Length SDUs:</strong> Supports data up to 65,535 bytes
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Error Detection:</strong> CRC-32 checksum for data integrity
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Padding and Alignment:</strong> Aligns data to 48-byte ATM cell boundaries
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Length Indication:</strong> Trailer indicates actual data length
          </div>
        </div>
      </div>

      <ExpandableSection title="🐍 Python ATM Encapsulation Simulation">
        <p>
          Let's simulate RFC 2684 encapsulation methods to understand ATM protocol handling:
        </p>

        <CodeBlock
          language="python"
          code={`import struct
from typing import List, Tuple, Optional
from enum import Enum
import zlib

class ProtocolType(Enum):
    """Common protocol types for ATM encapsulation."""
    IP = 0x0800
    IPV6 = 0x86DD
    ARP = 0x0806
    IPX = 0x8137
    APPLETALK = 0x809B

class EncapsulationType(Enum):
    """RFC 2684 encapsulation methods."""
    LLC_SNAP = "llc_snap"
    VC_MULTIPLEXED = "vc_mux"

class ATMCell:
    """Represents a 53-byte ATM cell."""
    
    def __init__(self, vpi: int, vci: int, payload: bytes, pti: int = 0, clp: int = 0):
        self.vpi = vpi  # Virtual Path Identifier
        self.vci = vci  # Virtual Channel Identifier
        self.pti = pti  # Payload Type Indicator
        self.clp = clp  # Cell Loss Priority
        self.payload = payload[:48]  # Max 48 bytes payload
        
        # Pad payload to 48 bytes if needed
        if len(self.payload) < 48:
            self.payload += b'\\x00' * (48 - len(self.payload))
    
    def to_bytes(self) -> bytes:
        """Convert ATM cell to 53-byte format."""
        # Simplified ATM header (actual header is more complex)
        header = struct.pack('!I', 
                           (self.vpi << 20) | (self.vci << 4) | (self.pti << 1) | self.clp)
        header += b'\\x00'  # HEC (Header Error Control) - simplified
        
        return header + self.payload
    
    def __repr__(self):
        return f"ATMCell(VPI={self.vpi}, VCI={self.vci}, payload_len={len(self.payload)})"

class AAL5Frame:
    """ATM Adaptation Layer 5 frame for data services."""
    
    def __init__(self, data: bytes):
        self.original_data = data
        self.padded_data = self._pad_data(data)
        self.trailer = self._create_trailer(data)
        self.complete_frame = self.padded_data + self.trailer
    
    def _pad_data(self, data: bytes) -> bytes:
        """Pad data to align with 48-byte ATM cell boundaries."""
        # Calculate padding needed
        total_length = len(data) + 8  # +8 for AAL5 trailer
        cells_needed = (total_length + 47) // 48  # Round up
        padded_length = cells_needed * 48 - 8  # -8 for trailer
        
        padding_needed = padded_length - len(data)
        return data + b'\\x00' * padding_needed
    
    def _create_trailer(self, original_data: bytes) -> bytes:
        """Create AAL5 trailer with length and CRC."""
        # AAL5 trailer: UU (1) + CPI (1) + Length (2) + CRC-32 (4)
        uu = 0x00  # User-to-User indication
        cpi = 0x00  # Common Part Indicator
        length = len(original_data)
        
        # Calculate CRC-32 over padded data + UU + CPI + Length
        crc_data = self.padded_data + struct.pack('!BBH', uu, cpi, length)
        crc32 = zlib.crc32(crc_data) & 0xFFFFFFFF
        
        return struct.pack('!BBHI', uu, cpi, length, crc32)
    
    def to_cells(self, vpi: int, vci: int) -> List[ATMCell]:
        """Convert AAL5 frame to ATM cells."""
        cells = []
        offset = 0
        
        while offset < len(self.complete_frame):
            # Get 48 bytes of data
            chunk = self.complete_frame[offset:offset + 48]
            
            # Set PTI for last cell (indicates end of AAL5 frame)
            pti = 1 if offset + 48 >= len(self.complete_frame) else 0
            
            cell = ATMCell(vpi, vci, chunk, pti=pti)
            cells.append(cell)
            offset += 48
        
        return cells

class RFC2684Encapsulator:
    """Implements RFC 2684 multiprotocol encapsulation over ATM."""
    
    def __init__(self):
        # LLC/SNAP headers for common protocols
        self.llc_snap_headers = {
            ProtocolType.IP: b'\\xAA\\xAA\\x03\\x00\\x00\\x00\\x08\\x00',
            ProtocolType.IPV6: b'\\xAA\\xAA\\x03\\x00\\x00\\x00\\x86\\xDD',
            ProtocolType.ARP: b'\\xAA\\xAA\\x03\\x00\\x00\\x00\\x08\\x06',
        }
    
    def encapsulate_llc_snap(self, protocol: ProtocolType, data: bytes) -> bytes:
        """Encapsulate protocol data using LLC/SNAP method."""
        
        if protocol not in self.llc_snap_headers:
            raise ValueError(f"Unsupported protocol: {protocol}")
        
        # Add LLC/SNAP header
        header = self.llc_snap_headers[protocol]
        encapsulated = header + data
        
        print(f"📦 LLC/SNAP Encapsulation:")
        print(f"   Protocol: {protocol.name}")
        print(f"   LLC/SNAP Header: {header.hex()}")
        print(f"   Original Data: {len(data)} bytes")
        print(f"   Encapsulated: {len(encapsulated)} bytes")
        
        return encapsulated
    
    def encapsulate_vc_mux(self, protocol: ProtocolType, data: bytes) -> bytes:
        """Encapsulate protocol data using VC-based multiplexing."""
        
        # No protocol header needed - VCC is dedicated to this protocol
        print(f"⚡ VC-Multiplexed Encapsulation:")
        print(f"   Protocol: {protocol.name} (implied by VCC)")
        print(f"   Data: {len(data)} bytes (no additional headers)")
        
        return data
    
    def create_ip_over_atm(self, ip_packet: bytes, vpi: int, vci: int, 
                          encap_type: EncapsulationType) -> List[ATMCell]:
        """Create ATM cells carrying IP packet using RFC 2684."""
        
        print(f"\\n🌐 Creating IP over ATM (RFC 2684):")
        print(f"   Encapsulation: {encap_type.value}")
        print(f"   VPI/VCI: {vpi}/{vci}")
        print(f"   IP Packet: {len(ip_packet)} bytes")
        
        # Step 1: Encapsulate IP packet
        if encap_type == EncapsulationType.LLC_SNAP:
            encapsulated = self.encapsulate_llc_snap(ProtocolType.IP, ip_packet)
        else:
            encapsulated = self.encapsulate_vc_mux(ProtocolType.IP, ip_packet)
        
        # Step 2: Create AAL5 frame
        aal5_frame = AAL5Frame(encapsulated)
        print(f"   AAL5 Frame: {len(aal5_frame.complete_frame)} bytes")
        
        # Step 3: Segment into ATM cells
        cells = aal5_frame.to_cells(vpi, vci)
        print(f"   ATM Cells: {len(cells)} cells × 53 bytes = {len(cells) * 53} bytes")
        
        return cells
    
    def create_ethernet_over_atm(self, ethernet_frame: bytes, vpi: int, vci: int) -> List[ATMCell]:
        """Encapsulate Ethernet frame over ATM using LLC/SNAP."""
        
        print(f"\\n🔗 Creating Ethernet over ATM:")
        print(f"   Ethernet Frame: {len(ethernet_frame)} bytes")
        
        # Ethernet uses specific LLC/SNAP header
        llc_snap_ethernet = b'\\xAA\\xAA\\x03\\x00\\x00\\x00\\x00\\x00'
        encapsulated = llc_snap_ethernet + ethernet_frame
        
        print(f"   LLC/SNAP Header: {llc_snap_ethernet.hex()}")
        print(f"   Encapsulated: {len(encapsulated)} bytes")
        
        # Create AAL5 frame and cells
        aal5_frame = AAL5Frame(encapsulated)
        cells = aal5_frame.to_cells(vpi, vci)
        
        print(f"   ATM Cells: {len(cells)} cells")
        
        return cells
    
    def demonstrate_bridging(self, ethernet_frames: List[bytes]) -> dict:
        """Demonstrate Ethernet bridging over ATM."""
        
        print(f"\\n🌉 ATM Bridging Demonstration:")
        print(f"   Bridging {len(ethernet_frames)} Ethernet frames")
        
        bridged_data = {
            'total_ethernet_bytes': 0,
            'total_atm_cells': 0,
            'efficiency': 0
        }
        
        for i, frame in enumerate(ethernet_frames):
            print(f"\\n   Frame {i+1}:")
            cells = self.create_ethernet_over_atm(frame, vpi=1, vci=100+i)
            
            bridged_data['total_ethernet_bytes'] += len(frame)
            bridged_data['total_atm_cells'] += len(cells)
        
        # Calculate efficiency
        total_atm_bytes = bridged_data['total_atm_cells'] * 53
        efficiency = (bridged_data['total_ethernet_bytes'] / total_atm_bytes) * 100
        bridged_data['efficiency'] = efficiency
        
        print(f"\\n📊 Bridging Statistics:")
        print(f"   Total Ethernet Data: {bridged_data['total_ethernet_bytes']} bytes")
        print(f"   Total ATM Overhead: {total_atm_bytes - bridged_data['total_ethernet_bytes']} bytes")
        print(f"   Efficiency: {efficiency:.1f}%")
        
        return bridged_data
    
    def parse_atm_cells(self, cells: List[ATMCell]) -> Tuple[bytes, dict]:
        """Parse ATM cells back to original protocol data."""
        
        print(f"\\n🔍 Parsing {len(cells)} ATM cells:")
        
        # Reassemble AAL5 frame
        reassembled_data = b''
        for cell in cells:
            reassembled_data += cell.payload
        
        # Parse AAL5 trailer
        trailer = reassembled_data[-8:]
        uu, cpi, length, crc32 = struct.unpack('!BBHI', trailer)
        
        # Extract original data
        actual_data = reassembled_data[:length]
        
        print(f"   AAL5 Length Field: {length} bytes")
        print(f"   Extracted Data: {len(actual_data)} bytes")
        
        # Try to identify protocol
        protocol_info = {'type': 'unknown', 'header_bytes': 0}
        
        if len(actual_data) >= 8 and actual_data[:8] in self.llc_snap_headers.values():
            protocol_info['type'] = 'LLC/SNAP'
            protocol_info['header_bytes'] = 8
            
            # Remove LLC/SNAP header
            payload = actual_data[8:]
            
            # Identify specific protocol
            for proto, header in self.llc_snap_headers.items():
                if actual_data[:8] == header:
                    protocol_info['protocol'] = proto.name
                    break
        else:
            protocol_info['type'] = 'VC-Multiplexed'
            payload = actual_data
        
        print(f"   Protocol: {protocol_info}")
        
        return payload, protocol_info

# Demonstration functions
def create_sample_ip_packet() -> bytes:
    """Create a sample IP packet for demonstration."""
    # Simplified IPv4 header + data
    version_ihl = 0x45  # Version 4, Header Length 5
    tos = 0x00
    total_length = 60  # Total packet length
    identification = 0x1234
    flags_fragment = 0x4000  # Don't fragment
    ttl = 64
    protocol = 1  # ICMP
    checksum = 0x0000  # Would be calculated
    src_ip = struct.pack('!I', 0xC0A80101)  # 192.168.1.1
    dst_ip = struct.pack('!I', 0xC0A80102)  # 192.168.1.2
    
    ip_header = struct.pack('!BBHHHBBH', version_ihl, tos, total_length,
                           identification, flags_fragment, ttl, protocol, checksum)
    ip_header += src_ip + dst_ip
    
    # Add some ICMP data
    icmp_data = b'\\x08\\x00\\x00\\x00' + b'Hello ATM!' + b'\\x00' * 30
    
    return ip_header + icmp_data

def create_sample_ethernet_frame() -> bytes:
    """Create a sample Ethernet frame."""
    dst_mac = b'\\xFF\\xFF\\xFF\\xFF\\xFF\\xFF'  # Broadcast
    src_mac = b'\\x00\\x1B\\x44\\x11\\x3A\\xB7'
    ethertype = b'\\x08\\x00'  # IP
    
    # Simple payload
    payload = b'This is an Ethernet frame over ATM!' + b'\\x00' * 20
    
    return dst_mac + src_mac + ethertype + payload

def demonstrate_rfc2684():
    """Comprehensive RFC 2684 demonstration."""
    
    print("🚀 RFC 2684: Multiprotocol Encapsulation over ATM")
    print("=" * 70)
    
    encapsulator = RFC2684Encapsulator()
    
    print("\\n1️⃣  IP over ATM Demonstration:")
    print("-" * 40)
    
    # Create sample IP packet
    ip_packet = create_sample_ip_packet()
    
    # Test both encapsulation methods
    for encap_type in [EncapsulationType.LLC_SNAP, EncapsulationType.VC_MULTIPLEXED]:
        cells = encapsulator.create_ip_over_atm(
            ip_packet, vpi=0, vci=32, encap_type=encap_type
        )
        
        # Parse cells back to original data
        reconstructed, proto_info = encapsulator.parse_atm_cells(cells)
        
        print(f"   Reconstruction successful: {len(reconstructed)} bytes")
        print(f"   Data match: {reconstructed == ip_packet}")
    
    print("\\n2️⃣  Ethernet Bridging over ATM:")
    print("-" * 40)
    
    # Create multiple Ethernet frames
    ethernet_frames = [
        create_sample_ethernet_frame(),
        b'\\x00' * 64 + b'Frame 2 data',  # Minimum Ethernet frame
        b'\\xFF' * 200 + b'Large frame data'  # Larger frame
    ]
    
    stats = encapsulator.demonstrate_bridging(ethernet_frames)
    
    print("\\n3️⃣  ATM Cell Structure Analysis:")
    print("-" * 40)
    
    # Create and analyze a single cell
    sample_cell = ATMCell(vpi=1, vci=100, payload=b'Sample ATM payload data')
    cell_bytes = sample_cell.to_bytes()
    
    print(f"   ATM Cell: {sample_cell}")
    print(f"   Cell bytes: {len(cell_bytes)} (should be 53)")
    print(f"   Header: {cell_bytes[:5].hex()}")
    print(f"   Payload preview: {cell_bytes[5:25].hex()}...")
    
    print("\\n4️⃣  Protocol Efficiency Comparison:")
    print("-" * 40)
    
    test_data_sizes = [64, 256, 1024, 1500]  # Common packet sizes
    
    for size in test_data_sizes:
        test_data = b'X' * size
        
        # Test LLC/SNAP
        llc_cells = encapsulator.create_ip_over_atm(
            test_data, 0, 32, EncapsulationType.LLC_SNAP
        )
        llc_efficiency = (size / (len(llc_cells) * 53)) * 100
        
        # Test VC-Mux
        vc_cells = encapsulator.create_ip_over_atm(
            test_data, 0, 33, EncapsulationType.VC_MULTIPLEXED
        )
        vc_efficiency = (size / (len(vc_cells) * 53)) * 100
        
        print(f"   {size:4d} bytes: LLC/SNAP {llc_efficiency:.1f}% | VC-Mux {vc_efficiency:.1f}%")
    
    print("\\n🎯 Key RFC 2684 Benefits Demonstrated:")
    print("   • Protocol Independence: Multiple protocols over single ATM infrastructure")
    print("   • Flexible Encapsulation: LLC/SNAP for multiple protocols, VC-Mux for efficiency")
    print("   • Quality of Service: ATM's connection-oriented nature enables guaranteed QoS")
    print("   • Scalable Integration: Bridge between telecom ATM and data networking")

if __name__ == "__main__":
    demonstrate_rfc2684()`}
        />

        <p>
          This simulation demonstrates RFC 2684's encapsulation methods, showing how 
          IP packets and Ethernet frames are efficiently carried over ATM networks 
          using both LLC/SNAP and VC-based multiplexing approaches.
        </p>
      </ExpandableSection>

      <h3>Quality of Service Integration</h3>

      <p>
        RFC 2684's integration with ATM enables sophisticated <GlossaryTerm>QoS</GlossaryTerm> capabilities:
      </p>

      <div className="bg-green-50 border border-green-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-green-900 mb-3">ATM QoS Service Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div><strong>CBR (Constant Bit Rate):</strong> Real-time applications</div>
            <div><strong>VBR-RT (Variable Bit Rate - Real Time):</strong> Video/voice</div>
            <div><strong>VBR-NRT (Non-Real Time):</strong> Multimedia data</div>
          </div>
          <div className="space-y-2">
            <div><strong>ABR (Available Bit Rate):</strong> Adaptive applications</div>
            <div><strong>UBR (Unspecified Bit Rate):</strong> Best-effort traffic</div>
            <div><strong>GFR (Guaranteed Frame Rate):</strong> Frame-based QoS</div>
          </div>
        </div>
      </div>

      <h3>Historical Context</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>1980s-1990s:</strong> ATM developed as high-speed networking solution
        </p>
        <p>
          <strong>1995-1998:</strong> ATM widely deployed in telecom networks
        </p>
        <p>
          <strong>September 1999:</strong> RFC 2684 published, enabling IP over ATM
        </p>
        <p>
          <strong>2000-2005:</strong> ATM becomes backbone for DSL and enterprise networks
        </p>
        <p>
          <strong>2005-2010:</strong> Ethernet overtakes ATM in most applications
        </p>
      </div>

      <ExpandableSection title="🏗️ ATM's Service Provider Legacy">
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 p-4 rounded">
            <h4 className="font-semibold text-orange-900 mb-2">📡 Telecom Infrastructure Foundation</h4>
            <p className="text-orange-800 text-sm">
              ATM provided the high-speed infrastructure that enabled internet growth:
            </p>
            <ul className="text-orange-700 text-xs mt-2 space-y-1">
              <li>• <strong>Backbone Networks:</strong> Telcos built ATM cores for voice and data</li>
              <li>• <strong>DSL Deployment:</strong> ATM enabled ADSL and other broadband services</li>
              <li>• <strong>Frame Relay Migration:</strong> Smooth transition from legacy networks</li>
              <li>• <strong>QoS Innovation:</strong> Pioneered connection-oriented QoS concepts</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">🌐 Internet Service Provider Impact</h4>
            <p className="text-blue-800 text-sm">
              RFC 2684 made ATM practical for IP services:
            </p>
            <ul className="text-blue-700 text-xs mt-2 space-y-1">
              <li>• <strong>IP over ATM:</strong> Enabled high-speed internet backbone</li>
              <li>• <strong>Virtual ISPs:</strong> Multiple ISPs sharing ATM infrastructure</li>
              <li>• <strong>Guaranteed Bandwidth:</strong> SLA-based internet services</li>
              <li>• <strong>Enterprise VPNs:</strong> ATM-based private networks</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">🔄 Technology Evolution Path</h4>
            <p className="text-purple-800 text-sm">
              ATM concepts influenced modern networking:
            </p>
            <ul className="text-purple-700 text-xs mt-2 space-y-1">
              <li>• <strong>MPLS Development:</strong> Label switching inspired by ATM VPI/VCI</li>
              <li>• <strong>QoS Standards:</strong> DiffServ and IntServ built on ATM QoS concepts</li>
              <li>• <strong>Traffic Engineering:</strong> ATM's explicit paths influenced MPLS-TE</li>
              <li>• <strong>SDN Controllers:</strong> Centralized control similar to ATM switches</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">💼 Business Model Innovation</h4>
            <p className="text-green-800 text-sm">
              ATM enabled new service provider business models:
            </p>
            <ul className="text-green-700 text-xs mt-2 space-y-1">
              <li>• <strong>Tiered Services:</strong> Different QoS levels at different prices</li>
              <li>• <strong>Managed Networks:</strong> End-to-end service level agreements</li>
              <li>• <strong>Wholesale Services:</strong> Infrastructure sharing between providers</li>
              <li>• <strong>Converged Networks:</strong> Voice, data, and video on single infrastructure</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">📚 External References</h5>
          <ul className="text-gray-700 text-sm space-y-1">
            <li><a href="https://tools.ietf.org/html/rfc2225" className="underline" target="_blank" rel="noopener noreferrer">RFC 2225: Classical IP over ATM</a></li>
            <li><a href="https://tools.ietf.org/html/rfc2332" className="underline" target="_blank" rel="noopener noreferrer">RFC 2332: NBMA Next Hop Resolution Protocol</a></li>
            <li><a href="https://www.cisco.com/c/en/us/tech/atm/index.html" className="underline" target="_blank" rel="noopener noreferrer">Cisco ATM Technology Center</a></li>
            <li><a href="https://tools.ietf.org/html/rfc2105" className="underline" target="_blank" rel="noopener noreferrer">RFC 2105: Cisco Systems' Tag Switching Architecture Overview</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <h3>Bridging vs Routing</h3>

      <p>
        RFC 2684 supports both bridged and routed configurations:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-blue-800">🌉 Bridged Mode</h5>
            <p className="text-blue-700 mt-1">
              <strong>Transparent:</strong> ATM appears as Ethernet bridge. 
              Preserves Ethernet addressing and broadcast domains.
            </p>
            <p className="text-blue-600 text-xs mt-2">
              Best for: LAN extension, simple connectivity
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-green-800">🔀 Routed Mode</h5>
            <p className="text-green-700 mt-1">
              <strong>Layer 3:</strong> ATM provides IP forwarding. 
              Each VC represents different IP subnet.
            </p>
            <p className="text-green-600 text-xs mt-2">
              Best for: WAN connectivity, scalable networks
            </p>
          </div>
        </div>
      </div>

      <h3>Performance Characteristics</h3>

      <p>
        ATM's fixed cell size provides predictable performance but introduces overhead:
      </p>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-amber-900 mb-3">Efficiency Analysis</h4>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-2 rounded border">
            <strong>Cell Tax:</strong> 5-byte header per 48-byte payload = 10.4% overhead
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Padding Penalty:</strong> Small packets waste significant cell space
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Segmentation Benefit:</strong> Predictable cell size enables hardware optimization
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>QoS Advantage:</strong> Per-VC traffic shaping and guaranteed bandwidth
          </div>
        </div>
      </div>

      <h3>Modern Relevance</h3>

      <p>
        While Ethernet has largely replaced ATM, RFC 2684's concepts remain relevant:
      </p>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-indigo-900 mb-2">Lasting Contributions</h4>
        <ul className="text-indigo-800 text-sm space-y-1">
          <li>• <strong>Encapsulation Principles:</strong> Multi-protocol support over single infrastructure</li>
          <li>• <strong>QoS Architecture:</strong> Connection-oriented quality guarantees</li>
          <li>• <strong>Virtual Circuits:</strong> Inspired MPLS label-switched paths</li>
          <li>• <strong>Service Differentiation:</strong> Multiple service classes on shared infrastructure</li>
        </ul>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 2684 solved a critical integration challenge by enabling IP and other protocols 
          to run efficiently over ATM networks. While ATM itself has been largely superseded, 
          the encapsulation principles, QoS concepts, and service provider architectures 
          introduced by this specification laid the groundwork for modern technologies like 
          MPLS, SD-WAN, and cloud networking. Understanding RFC 2684 provides insight into 
          how protocol encapsulation and quality-of-service guarantees work in multi-service 
          networks—concepts that remain essential in today's converged infrastructure.
        </p>
      </div>
    </article>
  );
}