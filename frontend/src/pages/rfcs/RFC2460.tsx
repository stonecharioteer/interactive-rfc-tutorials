import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC2460() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 2460: Internet Protocol, Version 6 (IPv6) Specification (December 1998)</h1>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          The Internet's Next Generation
        </h3>
        <p className="text-green-800">
          <GlossaryTerm>IPv6</GlossaryTerm> addresses the fundamental limitation of <GlossaryTerm>IPv4</GlossaryTerm> address exhaustion 
          while providing enhanced functionality, security, and performance. With 128-bit addresses, 
          IPv6 provides virtually unlimited address space for the growing internet.
        </p>
        <p className="text-green-700 text-sm mt-2">
          <strong>Read the original:</strong> <a href="https://www.rfc-editor.org/rfc/rfc2460.html" 
          className="underline" target="_blank" rel="noopener noreferrer">RFC 2460</a>
        </p>
      </div>

      <h2>Addressing the IPv4 Crisis</h2>

      <p>
        By 1998, it was clear that <GlossaryTerm>IPv4</GlossaryTerm>'s 32-bit address space (4.3 billion addresses) 
        would be insufficient for the internet's growth. <GlossaryTerm>NAT</GlossaryTerm> provided temporary relief, 
        but IPv6 offered a permanent solution with 128-bit addresses—that's 
        340,282,366,920,938,463,463,374,607,431,768,211,456 unique addresses!
      </p>

      <h3>IPv6 vs IPv4 Comparison</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-red-800 mb-2">IPv4 Limitations</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• 32-bit addresses (4.3 billion)</li>
              <li>• Complex header with options</li>
              <li>• No built-in security</li>
              <li>• Limited multicast support</li>
              <li>• Manual configuration required</li>
              <li>• Fragmentation by routers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">IPv6 Improvements</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 128-bit addresses (340 undecillion)</li>
              <li>• Simplified, fixed-size header</li>
              <li>• <GlossaryTerm>IPsec</GlossaryTerm> integration</li>
              <li>• Enhanced multicast and anycast</li>
              <li>• Stateless autoconfiguration</li>
              <li>• No router fragmentation</li>
            </ul>
          </div>
        </div>
      </div>

      <h3>IPv6 Address Structure</h3>

      <p>IPv6 addresses are 128 bits long, written as eight groups of four hexadecimal digits:</p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-900 mb-3">Address Format Examples</h4>
        
        <div className="space-y-3 text-sm">
          <div className="bg-white p-2 rounded border">
            <strong>Full Format:</strong>
            <code className="block mt-1 text-xs bg-blue-50 p-1">
              2001:0db8:85a3:0000:0000:8a2e:0370:7334
            </code>
          </div>
          
          <div className="bg-white p-2 rounded border">
            <strong>Compressed (remove leading zeros):</strong>
            <code className="block mt-1 text-xs bg-blue-50 p-1">
              2001:db8:85a3:0:0:8a2e:370:7334
            </code>
          </div>
          
          <div className="bg-white p-2 rounded border">
            <strong>Double Colon (collapse consecutive zeros):</strong>
            <code className="block mt-1 text-xs bg-blue-50 p-1">
              2001:db8:85a3::8a2e:370:7334
            </code>
          </div>
          
          <div className="bg-white p-2 rounded border">
            <strong>Loopback:</strong>
            <code className="block mt-1 text-xs bg-blue-50 p-1">
              ::1 (equivalent to 127.0.0.1 in IPv4)
            </code>
          </div>
        </div>
      </div>

      <h3>IPv6 Header Structure</h3>

      <p>
        IPv6 simplifies the header compared to IPv4, making routing more efficient:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Fixed 40-byte Header Fields:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div><strong>Version (4 bits):</strong> Always 6</div>
            <div><strong>Traffic Class (8 bits):</strong> QoS priority</div>
            <div><strong>Flow Label (20 bits):</strong> Flow identification</div>
            <div><strong>Payload Length (16 bits):</strong> Data size</div>
          </div>
          <div className="space-y-2">
            <div><strong>Next Header (8 bits):</strong> Protocol/extension header</div>
            <div><strong>Hop Limit (8 bits):</strong> Replaces IPv4 TTL</div>
            <div><strong>Source Address (128 bits):</strong> Sender</div>
            <div><strong>Destination Address (128 bits):</strong> Receiver</div>
          </div>
        </div>
      </div>

      <h3>Address Types</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900">🔹 Unicast</h4>
          <p className="text-blue-800 text-sm">
            One-to-one communication. Includes global unicast, link-local, and unique local addresses.
          </p>
          <code className="text-xs bg-blue-100 p-1 rounded block mt-2">
            2001:db8::/32
          </code>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">📡 Multicast</h4>
          <p className="text-green-800 text-sm">
            One-to-many communication. Replaces IPv4 broadcast with more efficient addressing.
          </p>
          <code className="text-xs bg-green-100 p-1 rounded block mt-2">
            ff02::1 (all nodes)
          </code>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 p-4 rounded">
          <h4 className="font-semibold text-purple-900">🎯 Anycast</h4>
          <p className="text-purple-800 text-sm">
            One-to-nearest communication. Same address assigned to multiple interfaces.
          </p>
          <code className="text-xs bg-purple-100 p-1 rounded block mt-2">
            Same format as unicast
          </code>
        </div>
      </div>

      <ExpandableSection title="🐍 Python IPv6 Implementation">
        <p>
          Let's explore IPv6 concepts with Python networking examples:
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import struct
import ipaddress
import random
from typing import List, Tuple
import binascii

class IPv6Toolkit:
    """Educational IPv6 implementation demonstrating RFC 2460 concepts."""
    
    def __init__(self):
        self.address_types = {
            'loopback': '::1',
            'unspecified': '::',
            'link_local_prefix': 'fe80::/10',
            'unique_local_prefix': 'fc00::/7',
            'multicast_prefix': 'ff00::/8',
            'global_unicast_prefix': '2000::/3'
        }
    
    def parse_ipv6_address(self, address_str: str) -> dict:
        """Parse and analyze an IPv6 address."""
        
        try:
            addr = ipaddress.IPv6Address(address_str)
            
            # Determine address type
            addr_type = self._classify_address(addr)
            
            # Get different representations
            representations = {
                'full': str(addr.exploded),
                'compressed': str(addr.compressed),
                'binary': format(int(addr), '0128b'),
                'hex': format(int(addr), '032x'),
                'integer': int(addr)
            }
            
            # Network information
            network_info = {}
            if addr.is_global:
                # Typical global unicast structure
                network_info['prefix'] = f"{address_str.split('::')[0]}::/64"
                network_info['interface_id'] = self._extract_interface_id(addr)
            
            return {
                'address': address_str,
                'type': addr_type,
                'representations': representations,
                'properties': {
                    'is_global': addr.is_global,
                    'is_link_local': addr.is_link_local,
                    'is_loopback': addr.is_loopback,
                    'is_multicast': addr.is_multicast,
                    'is_private': addr.is_private,
                    'is_reserved': addr.is_reserved,
                    'is_unspecified': addr.is_unspecified
                },
                'network_info': network_info
            }
            
        except ipaddress.AddressValueError as e:
            return {'error': f"Invalid IPv6 address: {e}"}
    
    def _classify_address(self, addr: ipaddress.IPv6Address) -> str:
        """Classify IPv6 address type."""
        
        if addr.is_loopback:
            return "Loopback"
        elif addr.is_unspecified:
            return "Unspecified"
        elif addr.is_link_local:
            return "Link-Local Unicast"
        elif addr.is_multicast:
            return "Multicast"
        elif addr.is_private:
            return "Unique Local Unicast"
        elif addr.is_global:
            return "Global Unicast"
        else:
            return "Reserved/Special"
    
    def _extract_interface_id(self, addr: ipaddress.IPv6Address) -> str:
        """Extract the interface identifier (last 64 bits)."""
        addr_int = int(addr)
        interface_id = addr_int & 0xFFFFFFFFFFFFFFFF  # Last 64 bits
        
        # Format as IPv6 interface ID
        hex_str = format(interface_id, '016x')
        formatted = ':'.join([hex_str[i:i+4] for i in range(0, 16, 4)])
        
        return formatted
    
    def generate_link_local_address(self, mac_address: str) -> str:
        """Generate IPv6 link-local address from MAC address (EUI-64)."""
        
        # Remove separators and convert to uppercase
        mac = mac_address.replace(':', '').replace('-', '').upper()
        
        if len(mac) != 12:
            raise ValueError("Invalid MAC address format")
        
        # Split MAC into two parts
        mac_part1 = mac[:6]
        mac_part2 = mac[6:]
        
        # Insert FFFE in the middle for EUI-64
        eui64 = mac_part1 + 'FFFE' + mac_part2
        
        # Flip the universal/local bit (7th bit of first byte)
        first_byte = int(eui64[:2], 16)
        first_byte ^= 0x02  # Flip bit 1 (0-indexed from right)
        eui64 = format(first_byte, '02X') + eui64[2:]
        
        # Format as IPv6 interface identifier
        interface_id = ':'.join([eui64[i:i+4] for i in range(0, 16, 4)])
        
        # Combine with link-local prefix
        link_local = f"fe80::{interface_id}"
        
        return link_local
    
    def create_ipv6_header(self, src_addr: str, dst_addr: str, 
                          payload_length: int, next_header: int = 59,
                          traffic_class: int = 0, flow_label: int = 0,
                          hop_limit: int = 64) -> bytes:
        """Create IPv6 header following RFC 2460 format."""
        
        # Version (4 bits) + Traffic Class (8 bits) + Flow Label (20 bits)
        version_tc_fl = (6 << 28) | (traffic_class << 20) | flow_label
        
        # Convert addresses to 16-byte binary
        src_bytes = ipaddress.IPv6Address(src_addr).packed
        dst_bytes = ipaddress.IPv6Address(dst_addr).packed
        
        # Pack header (big-endian format)
        header = struct.pack('!IHBB', 
                           version_tc_fl,      # Version + TC + Flow Label (4 bytes)
                           payload_length,     # Payload Length (2 bytes)
                           next_header,        # Next Header (1 byte)
                           hop_limit           # Hop Limit (1 byte)
                           )
        
        # Add source and destination addresses
        header += src_bytes + dst_bytes
        
        return header
    
    def parse_ipv6_header(self, header_bytes: bytes) -> dict:
        """Parse IPv6 header from binary data."""
        
        if len(header_bytes) < 40:
            return {'error': 'Header too short (minimum 40 bytes required)'}
        
        # Unpack first 8 bytes
        version_tc_fl, payload_length, next_header, hop_limit = struct.unpack('!IHBB', header_bytes[:8])
        
        # Extract version, traffic class, and flow label
        version = (version_tc_fl >> 28) & 0xF
        traffic_class = (version_tc_fl >> 20) & 0xFF
        flow_label = version_tc_fl & 0xFFFFF
        
        # Extract addresses
        src_addr = ipaddress.IPv6Address(header_bytes[8:24])
        dst_addr = ipaddress.IPv6Address(header_bytes[24:40])
        
        return {
            'version': version,
            'traffic_class': traffic_class,
            'flow_label': flow_label,
            'payload_length': payload_length,
            'next_header': next_header,
            'hop_limit': hop_limit,
            'source_address': str(src_addr),
            'destination_address': str(dst_addr),
            'header_size': 40
        }
    
    def calculate_address_space(self):
        """Demonstrate IPv6's vast address space."""
        
        ipv4_total = 2**32
        ipv6_total = 2**128
        
        # Calculate how many IPv4 internets fit in IPv6
        ratio = ipv6_total // ipv4_total
        
        print("🌐 IPv6 Address Space Analysis:")
        print("=" * 50)
        print(f"IPv4 total addresses: {ipv4_total:,}")
        print(f"IPv6 total addresses: {ipv6_total:,}")
        print(f"Ratio: {ratio:,} IPv4 internets fit in IPv6")
        
        # Earth surface analogy
        earth_surface_m2 = 510_100_000_000_000  # 510.1 million km²
        addresses_per_m2 = ipv6_total // earth_surface_m2
        
        print(f"\\n🌍 Earth Surface Analogy:")
        print(f"IPv6 addresses per square meter: {addresses_per_m2:,}")
        
        # Allocation examples
        print(f"\\n📊 Allocation Examples:")
        print(f"/32 prefix (ISP): {2**(128-32):,} addresses")
        print(f"/48 prefix (site): {2**(128-48):,} addresses") 
        print(f"/64 prefix (subnet): {2**(128-64):,} addresses")
    
    def demonstrate_address_types(self):
        """Show different IPv6 address types with examples."""
        
        examples = {
            'Global Unicast': [
                '2001:db8:85a3::8a2e:370:7334',
                '2001:4860:4860::8888',  # Google DNS
                '2606:4700:4700::1111'   # Cloudflare DNS
            ],
            'Link-Local': [
                'fe80::1',
                'fe80::200:5eff:fe00:5301'
            ],
            'Unique Local': [
                'fc00::1',
                'fd12:3456:789a::1'
            ],
            'Multicast': [
                'ff02::1',    # All nodes
                'ff02::2',    # All routers
                'ff05::101'   # All NTP servers
            ],
            'Special': [
                '::1',        # Loopback
                '::',         # Unspecified
                '::ffff:192.0.2.1'  # IPv4-mapped
            ]
        }
        
        print("🎯 IPv6 Address Type Examples:")
        print("=" * 60)
        
        for addr_type, addresses in examples.items():
            print(f"\\n{addr_type}:")
            for addr in addresses:
                analysis = self.parse_ipv6_address(addr)
                if 'error' not in analysis:
                    print(f"  {addr}")
                    print(f"    Compressed: {analysis['representations']['compressed']}")
                    print(f"    Properties: {', '.join([k for k, v in analysis['properties'].items() if v])}")

# Example usage and demonstrations
def demonstrate_ipv6():
    """Comprehensive IPv6 demonstration following RFC 2460."""
    
    print("🚀 IPv6 Protocol Demonstration (RFC 2460)")
    print("=" * 70)
    
    toolkit = IPv6Toolkit()
    
    print("\\n1️⃣  Address Space Comparison:")
    toolkit.calculate_address_space()
    
    print("\\n2️⃣  Address Type Analysis:")
    toolkit.demonstrate_address_types()
    
    print("\\n3️⃣  Link-Local Address Generation:")
    mac_addresses = [
        '00:1B:44:11:3A:B7',
        '02:00:5E:10:00:00',
        'AA:BB:CC:DD:EE:FF'
    ]
    
    for mac in mac_addresses:
        try:
            link_local = toolkit.generate_link_local_address(mac)
            print(f"MAC: {mac} → Link-Local: {link_local}")
        except ValueError as e:
            print(f"Error with {mac}: {e}")
    
    print("\\n4️⃣  IPv6 Header Creation and Parsing:")
    
    # Create sample header
    src = '2001:db8::1'
    dst = '2001:db8::2'
    payload_len = 1024
    
    header = toolkit.create_ipv6_header(src, dst, payload_len)
    print(f"Created header: {len(header)} bytes")
    print(f"Header hex: {binascii.hexlify(header).decode()[:32]}...")
    
    # Parse the header back
    parsed = toolkit.parse_ipv6_header(header)
    print(f"\\nParsed header:")
    for key, value in parsed.items():
        print(f"  {key}: {value}")
    
    print("\\n5️⃣  Address Compression Examples:")
    test_addresses = [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        '2001:0db8:0000:0000:0000:0000:0000:0001',
        'fe80:0000:0000:0000:0200:5eff:fe00:5301'
    ]
    
    for addr in test_addresses:
        analysis = toolkit.parse_ipv6_address(addr)
        if 'error' not in analysis:
            print(f"\\nOriginal:   {addr}")
            print(f"Compressed: {analysis['representations']['compressed']}")
            print(f"Full:       {analysis['representations']['full']}")
    
    print("\\n🎯 Key IPv6 Advantages Demonstrated:")
    print("   • Vast address space eliminates NAT complexity")
    print("   • Simplified header improves routing performance")
    print("   • Built-in security and mobility support")
    print("   • Efficient multicast and anycast addressing")

if __name__ == "__main__":
    demonstrate_ipv6()`}
        />

        <p>
          This implementation demonstrates IPv6's key concepts: vast address space, 
          header structure, address types, and the EUI-64 process for generating 
          link-local addresses from MAC addresses.
        </p>
      </ExpandableSection>

      <h3>Stateless Address Autoconfiguration (SLAAC)</h3>

      <p>
        One of IPv6's most powerful features is <GlossaryTerm>SLAAC</GlossaryTerm>, allowing devices to 
        automatically configure addresses without <GlossaryTerm>DHCP</GlossaryTerm>:
      </p>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-900 mb-3">SLAAC Process</h4>
        <ol className="text-yellow-800 text-sm space-y-2">
          <li><strong>1. Link-Local Address:</strong> Device generates fe80::/10 address using MAC address</li>
          <li><strong>2. Duplicate Address Detection:</strong> Verifies address uniqueness on network</li>
          <li><strong>3. Router Discovery:</strong> Sends Router Solicitation to find routers</li>
          <li><strong>4. Prefix Assignment:</strong> Router Advertisement provides network prefix</li>
          <li><strong>5. Global Address:</strong> Combines prefix with interface identifier</li>
        </ol>
      </div>

      <h3>Extension Headers</h3>

      <p>
        IPv6 uses extension headers for optional functionality, keeping the main header simple:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900">Common Extension Headers</h4>
          <ul className="text-blue-800 text-sm mt-2 space-y-1">
            <li>• <strong>Hop-by-Hop Options (0):</strong> Processed by every router</li>
            <li>• <strong>Routing Header (43):</strong> Source routing information</li>
            <li>• <strong>Fragment Header (44):</strong> Fragmentation info</li>
            <li>• <strong>Destination Options (60):</strong> End-to-end options</li>
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">Header Chaining</h4>
          <p className="text-green-800 text-sm mt-2">
            Extension headers form a chain using the Next Header field, 
            allowing flexible protocol composition without header bloat.
          </p>
          <code className="text-xs bg-green-100 p-1 rounded block mt-2">
            IPv6 → Routing → Fragment → TCP
          </code>
        </div>
      </div>

      <h3>Historical Context and Adoption</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>1990s:</strong> IPv4 address exhaustion becomes apparent
        </p>
        <p>
          <strong>1995-1998:</strong> IPv6 development in IETF IPng Working Group
        </p>
        <p>
          <strong>December 1998:</strong> RFC 2460 published, finalizing IPv6 specification
        </p>
        <p>
          <strong>2000s-2010s:</strong> Slow adoption due to NAT success and complexity
        </p>
        <p>
          <strong>2011:</strong> IPv4 address exhaustion accelerates adoption
        </p>
        <p>
          <strong>2020s:</strong> IPv6 adoption reaches critical mass globally
        </p>
      </div>

      <ExpandableSection title="🌐 IPv6's Global Impact and Adoption Journey">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h4 className="font-semibold text-red-900 mb-2">📉 The Great IPv4 Exhaustion Crisis</h4>
            <p className="text-red-800 text-sm">
              IPv6 was created to solve an existential internet problem:
            </p>
            <ul className="text-red-700 text-xs mt-2 space-y-1">
              <li>• <strong>IANA Exhaustion (2011):</strong> Central pool of IPv4 addresses depleted</li>
              <li>• <strong>Regional Scarcity:</strong> Asia-Pacific ran out first, driving early IPv6 adoption</li>
              <li>• <strong>Rising Costs:</strong> IPv4 addresses became expensive commodities</li>
              <li>• <strong>NAT Limitations:</strong> Network Address Translation became increasingly complex</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">📈 Current IPv6 Adoption Statistics (2025)</h4>
            <p className="text-green-800 text-sm">
              IPv6 has achieved critical mass globally:
            </p>
            <ul className="text-green-700 text-xs mt-2 space-y-1">
              <li>• <strong>Global Usage:</strong> 40%+ of Google traffic now over IPv6</li>
              <li>• <strong>Leading Countries:</strong> India (70%+), Belgium (60%+), Germany (50%+)</li>
              <li>• <strong>Mobile Networks:</strong> Most major carriers deploy IPv6-only cores</li>
              <li>• <strong>Cloud Providers:</strong> AWS, Azure, GCP fully support dual-stack</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">🚀 IPv6's Technical Advantages in Practice</h4>
            <p className="text-blue-800 text-sm">
              Real-world benefits beyond address space:
            </p>
            <ul className="text-blue-700 text-xs mt-2 space-y-1">
              <li>• <strong>IoT Enablement:</strong> Each device gets globally routable address</li>
              <li>• <strong>Peer-to-Peer:</strong> Direct communication without NAT traversal</li>
              <li>• <strong>Security:</strong> IPsec integration simplifies VPN deployment</li>
              <li>• <strong>Performance:</strong> Simplified headers reduce router processing</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">🔮 IPv6's Role in Future Internet</h4>
            <p className="text-purple-800 text-sm">
              IPv6 enables next-generation internet technologies:
            </p>
            <ul className="text-purple-700 text-xs mt-2 space-y-1">
              <li>• <strong>5G Networks:</strong> Core architecture built on IPv6</li>
              <li>• <strong>Edge Computing:</strong> Direct device-to-edge communication</li>
              <li>• <strong>Blockchain:</strong> Peer-to-peer networks without NAT complexity</li>
              <li>• <strong>Quantum Internet:</strong> Future quantum networks designed for IPv6</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">📚 External References</h5>
          <ul className="text-gray-700 text-sm space-y-1">
            <li><a href="https://www.google.com/intl/en/ipv6/statistics.html" className="underline" target="_blank" rel="noopener noreferrer">Google IPv6 Statistics</a></li>
            <li><a href="https://tools.ietf.org/html/rfc8200" className="underline" target="_blank" rel="noopener noreferrer">RFC 8200: IPv6 Specification (Updated)</a></li>
            <li><a href="https://www.worldipv6launch.org/" className="underline" target="_blank" rel="noopener noreferrer">World IPv6 Launch Statistics</a></li>
            <li><a href="https://bgp.he.net/ipv6-progress-report.cgi" className="underline" target="_blank" rel="noopener noreferrer">Hurricane Electric IPv6 Progress Report</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <h3>IPv6 Transition Mechanisms</h3>

      <p>
        Several mechanisms help transition from IPv4 to IPv6:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-blue-800">🔗 Dual Stack</h5>
            <p className="text-blue-700 mt-1">
              Run IPv4 and IPv6 simultaneously. Most common approach during transition.
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-green-800">🌉 Tunneling</h5>
            <p className="text-green-700 mt-1">
              Encapsulate IPv6 in IPv4 packets (6to4, 6in4, Teredo) for transport across IPv4 networks.
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-purple-800">🔄 Translation</h5>
            <p className="text-purple-700 mt-1">
              Convert between IPv4 and IPv6 (NAT64, DNS64) for IPv6-only networks to reach IPv4 services.
            </p>
          </div>
        </div>
      </div>

      <h3>Security Considerations</h3>

      <p>
        IPv6 brings both security improvements and new challenges:
      </p>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-amber-900 mb-3">Security Implications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-green-800">✅ Security Improvements</h5>
            <ul className="text-green-700 mt-1 space-y-1">
              <li>• Built-in <GlossaryTerm>IPsec</GlossaryTerm> support</li>
              <li>• No NAT security through obscurity</li>
              <li>• Cryptographically Generated Addresses</li>
              <li>• Enhanced mobility security</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-red-800">⚠️ New Challenges</h5>
            <ul className="text-red-700 mt-1 space-y-1">
              <li>• Vast address space complicates scanning</li>
              <li>• Extension header security issues</li>
              <li>• Privacy concerns with stable addresses</li>
              <li>• Dual-stack attack surface</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          IPv6 represents the internet's successful evolution to meet 21st-century demands. 
          While adoption was initially slow, the protocol's vast address space, built-in 
          security, and simplified architecture now enable technologies from IoT to 5G. 
          Understanding IPv6 is essential for modern networking, as it forms the foundation 
          for the internet's continued growth and innovation. The transition from IPv4 to 
          IPv6 isn't just about more addresses—it's about building a more secure, 
          efficient, and capable internet for the future.
        </p>
      </div>
    </article>
  );
}