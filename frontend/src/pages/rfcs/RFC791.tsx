import GlossaryTerm from '../../components/GlossaryTerm';
import MermaidDiagram from '../../components/MermaidDiagram';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC791() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 791: Internet Protocol Version 4 (September 1981)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          This <GlossaryTerm>RFC</GlossaryTerm> defined <GlossaryTerm>IPv4</GlossaryTerm>, the network layer protocol that still carries
          most internet traffic today. Despite being over 40 years old, <GlossaryTerm>IPv4</GlossaryTerm>
          remains the foundation of internet communication.
        </p>
      </div>

      <h2>The Internet Protocol Foundation</h2>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 791 established <GlossaryTerm>IPv4</GlossaryTerm> as the universal addressing and <GlossaryTerm>routing</GlossaryTerm>
        protocol for the internet. It solved the fundamental problem of how to
        deliver data <GlossaryTerm>packet</GlossaryTerm>s across a network of networks.
      </p>

      <h3>Core <GlossaryTerm>IPv4</GlossaryTerm> Concepts</h3>

      <ul>
        <li>
          <strong>32-bit Addressing:</strong> Provides ~4.3 billion unique
          addresses
        </li>
        <li>
          <strong><GlossaryTerm>Packet</GlossaryTerm> <GlossaryTerm>Header</GlossaryTerm>:</strong> Contains <GlossaryTerm>routing</GlossaryTerm> and control
          information
        </li>
        <li>
          <strong>Fragmentation:</strong> Breaking large <GlossaryTerm>packet</GlossaryTerm>s into smaller
          pieces
        </li>
        <li>
          <strong>Time to Live (TTL):</strong> Prevents <GlossaryTerm>packet</GlossaryTerm>s from looping
          forever
        </li>
      </ul>

      <h3>IPv4 Packet Structure</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6 overflow-x-auto">
        <h4 className="font-semibold mb-3">IPv4 Header (20 bytes minimum)</h4>
        <div className="grid grid-cols-8 gap-1 text-xs">
          <div className="bg-blue-200 p-2 text-center">Version</div>
          <div className="bg-blue-200 p-2 text-center">IHL</div>
          <div className="bg-green-200 p-2 text-center col-span-2">
            Type of Service
          </div>
          <div className="bg-yellow-200 p-2 text-center col-span-4">
            Total Length
          </div>

          <div className="bg-purple-200 p-2 text-center col-span-4">
            Identification
          </div>
          <div className="bg-red-200 p-2 text-center">Flags</div>
          <div className="bg-red-200 p-2 text-center col-span-3">
            Fragment Offset
          </div>

          <div className="bg-orange-200 p-2 text-center col-span-2">
            Time to Live
          </div>
          <div className="bg-pink-200 p-2 text-center col-span-2">Protocol</div>
          <div className="bg-gray-200 p-2 text-center col-span-4">
            Header Checksum
          </div>

          <div className="bg-indigo-200 p-2 text-center col-span-8">
            Source Address (32 bits)
          </div>
          <div className="bg-cyan-200 p-2 text-center col-span-8">
            Destination Address (32 bits)
          </div>
          <div className="bg-lime-200 p-2 text-center col-span-8">
            Options (0-40 bytes)
          </div>
        </div>
      </div>

      <h3>IPv4 Addressing</h3>

      <p>
        IPv4 uses 32-bit addresses, typically written in dotted decimal
        notation:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-4">
        <code className="text-lg">
          192.168.1.1 = 11000000.10101000.00000001.00000001
        </code>
      </div>

      <h4>Address Classes (Historical)</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="border border-gray-300 p-3 rounded">
          <h5 className="font-semibold text-red-600">Class A</h5>
          <p className="text-sm">1.0.0.0 - 126.255.255.255</p>
          <p className="text-xs text-gray-600">Large networks</p>
        </div>
        <div className="border border-gray-300 p-3 rounded">
          <h5 className="font-semibold text-blue-600">Class B</h5>
          <p className="text-sm">128.0.0.0 - 191.255.255.255</p>
          <p className="text-xs text-gray-600">Medium networks</p>
        </div>
        <div className="border border-gray-300 p-3 rounded">
          <h5 className="font-semibold text-green-600">Class C</h5>
          <p className="text-sm">192.0.0.0 - 223.255.255.255</p>
          <p className="text-xs text-gray-600">Small networks</p>
        </div>
      </div>

      <ExpandableSection title="🐍 ELI-Pythonista: Working with IP Addresses">
        <p>
          Python's <code>ipaddress</code> module makes working with IPv4 addresses easy:
        </p>

        <CodeBlock
          language="python"
          code={`import ipaddress
import socket
import struct

# Create IPv4 address objects
ip1 = ipaddress.IPv4Address('192.168.1.1')
ip2 = ipaddress.IPv4Address('10.0.0.1')

print(f"IP Address: {ip1}")
print(f"Binary representation: {bin(int(ip1))}")
print(f"32-bit integer: {int(ip1)}")

# Convert between formats
ip_int = int(ip1)  # 3232235777
ip_bytes = ip1.packed  # b'\\xc0\\xa8\\x01\\x01'

# Check address properties
print(f"Is private: {ip1.is_private}")
print(f"Is multicast: {ip1.is_multicast}")
print(f"Is loopback: {ip1.is_loopback}")

# Network calculations
network = ipaddress.IPv4Network('192.168.1.0/24', strict=False)
print(f"Network: {network}")
print(f"Network address: {network.network_address}")
print(f"Broadcast address: {network.broadcast_address}")
print(f"Netmask: {network.netmask}")
print(f"Number of hosts: {network.num_addresses}")`}
        />

        <p>
          <strong>Practical example:</strong> Building a simple IP scanner
        </p>

        <CodeBlock
          language="python"
          code={`import ipaddress
import socket
import threading
from concurrent.futures import ThreadPoolExecutor

def ping_ip(ip_str):
    """Check if an IP address responds to a basic connection attempt."""
    try:
        ip = ipaddress.IPv4Address(ip_str)
        
        # Try to connect to a common port (like HTTP)
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1)  # 1 second timeout
            result = sock.connect_ex((str(ip), 80))
            if result == 0:
                return f"{ip}: Port 80 OPEN"
            else:
                return f"{ip}: Port 80 closed/filtered"
    except Exception as e:
        return f"{ip}: Error - {e}"

def scan_network(network_str):
    """Scan a network range for active hosts."""
    try:
        network = ipaddress.IPv4Network(network_str, strict=False)
        print(f"Scanning network: {network}")
        print(f"Total addresses to scan: {network.num_addresses}")
        
        # Use threading for faster scanning
        with ThreadPoolExecutor(max_workers=50) as executor:
            # Scan first 20 addresses to avoid overwhelming
            hosts_to_scan = list(network.hosts())[:20]
            results = executor.map(ping_ip, [str(ip) for ip in hosts_to_scan])
            
            for result in results:
                print(result)
    
    except ValueError as e:
        print(f"Invalid network: {e}")

# Example usage
scan_network("192.168.1.0/24")`}
        />

        <p>
          This demonstrates how IPv4 addressing works at the application level - 
          the 32-bit addresses are abstracted into human-readable dotted decimal notation!
        </p>
      </ExpandableSection>

      <h3>Packet Fragmentation</h3>

      <p>
        IPv4 can fragment packets when they're too large for a network link.
        This process enables large packets to traverse networks with smaller MTUs:
      </p>

      <MermaidDiagram
        chart={`
graph TD
    subgraph "Source Network (MTU 1500)"
        A[Large Packet<br/>2000 bytes<br/>ID=12345]
    end
    
    subgraph "Router with Small MTU (576)"
        B[Fragment 1<br/>576 bytes<br/>ID=12345, Offset=0<br/>MF=1]
        C[Fragment 2<br/>576 bytes<br/>ID=12345, Offset=576<br/>MF=1]
        D[Fragment 3<br/>576 bytes<br/>ID=12345, Offset=1152<br/>MF=1]
        E[Fragment 4<br/>272 bytes<br/>ID=12345, Offset=1728<br/>MF=0]
    end
    
    subgraph "Destination Network"
        F[Reassembled Packet<br/>2000 bytes<br/>ID=12345]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    
    B --> F
    C --> F
    D --> F
    E --> F
    
    style A fill:#e1f5fe
    style F fill:#e8f5e8
    style B fill:#fff3cd
    style C fill:#fff3cd
    style D fill:#fff3cd
    style E fill:#fff3cd
        `}
        className="my-6"
      />

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-800 mb-3">Fragmentation Fields</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="space-y-2">
              <div><strong className="text-blue-600">Identification:</strong> Same for all fragments of a packet</div>
              <div><strong className="text-green-600">Fragment Offset:</strong> Position of fragment in original packet</div>
              <div><strong className="text-purple-600">More Fragments (MF):</strong> 1 = more fragments, 0 = last fragment</div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <div><strong className="text-orange-600">Don't Fragment (DF):</strong> 1 = don't fragment, drop if needed</div>
              <div><strong className="text-red-600">Total Length:</strong> Length of this fragment (not original)</div>
              <div><strong className="text-pink-600">Header Checksum:</strong> Recalculated for each fragment</div>
            </div>
          </div>
        </div>
      </div>

      <ul>
        <li>Splits large packets into smaller fragments</li>
        <li>Each fragment has the same identification number</li>
        <li>Fragments are reassembled at the destination</li>
        <li>Uses flags and fragment offset fields</li>
      </ul>

      <h3>Time to Live (TTL)</h3>

      <p>
        TTL prevents packets from circulating forever by limiting the number of <GlossaryTerm>router</GlossaryTerm> hops.
        Each router decrements the TTL value, and when it reaches zero, the packet is discarded.
      </p>

      <MermaidDiagram
        chart={`
graph LR
    A[Source<br/>TTL=64] --> B[Router 1<br/>TTL=63]
    B --> C[Router 2<br/>TTL=62]
    C --> D[Router 3<br/>TTL=61]
    D --> E[Destination<br/>TTL=60]
    
    F[Loop Prevention<br/>TTL=1] --> G[Router X<br/>TTL=0]
    G --> H[Packet Discarded<br/>ICMP Error Sent]
    
    style A fill:#e1f5fe
    style E fill:#e8f5e8
    style H fill:#ffebee
        `}
        className="my-6"
      />

      <ExpandableSection title="🐍 ELI-Pythonista: Tracing Network Routes">
        <p>
          You can observe TTL in action by implementing a simple traceroute in Python:
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import struct
import time
import sys

def traceroute(target_host, max_hops=30):
    """Simple traceroute implementation using raw sockets."""
    
    try:
        # Resolve target hostname to IP
        target_ip = socket.gethostbyname(target_host)
        print(f"Tracing route to {target_host} ({target_ip})")
        print(f"Maximum hops: {max_hops}")
        print()
        
        for ttl in range(1, max_hops + 1):
            # Create raw socket for ICMP
            sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)
            
            # Set TTL for this packet
            sock.setsockopt(socket.IPPROTO_IP, socket.IP_TTL, ttl)
            sock.settimeout(3)  # 3 second timeout
            
            start_time = time.time()
            
            try:
                # Send ICMP Echo Request
                sock.sendto(b'\\x08\\x00\\x00\\x00\\x00\\x00\\x00\\x00', (target_ip, 0))
                
                # Receive response
                response, addr = sock.recvfrom(512)
                end_time = time.time()
                
                rtt = (end_time - start_time) * 1000  # Round-trip time in ms
                
                # Try to get hostname
                try:
                    hostname = socket.gethostbyaddr(addr[0])[0]
                except:
                    hostname = addr[0]
                
                print(f"{ttl:2d}  {rtt:6.1f} ms  {hostname} ({addr[0]})")
                
                # Check if we reached the destination
                if addr[0] == target_ip:
                    print(f"\\nTrace complete! Reached {target_host}")
                    break
                    
            except socket.timeout:
                print(f"{ttl:2d}  *  *  *  Request timed out")
            except PermissionError:
                print("Error: Need root privileges for raw sockets")
                return
            finally:
                sock.close()
    
    except socket.gaierror:
        print(f"Error: Could not resolve hostname '{target_host}'")

# Note: This requires root privileges on most systems
# traceroute('google.com')`}
        />

        <p>
          <strong>Alternative approach</strong> using regular sockets (no root required):
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import time

def simple_hop_check(host, port=80, max_ttl=10):
    """Check connectivity with different TTL values."""
    
    target_ip = socket.gethostbyname(host)
    print(f"Testing connectivity to {host} ({target_ip})")
    
    for ttl in range(1, max_ttl + 1):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Set IP_TTL socket option
            sock.setsockopt(socket.IPPROTO_IP, socket.IP_TTL, ttl)
            sock.settimeout(2)
            
            start_time = time.time()
            result = sock.connect_ex((target_ip, port))
            end_time = time.time()
            
            if result == 0:
                rtt = (end_time - start_time) * 1000
                print(f"TTL {ttl:2d}: SUCCESS - Connected in {rtt:.1f}ms")
                sock.close()
                break
            else:
                print(f"TTL {ttl:2d}: Connection failed (may have been dropped by router)")
            
            sock.close()
            
        except Exception as e:
            print(f"TTL {ttl:2d}: Error - {e}")

# This works without root privileges
simple_hop_check('httpbin.org', 80)`}
        />

        <p>
          This demonstrates how TTL works in practice - packets with low TTL values 
          get dropped by intermediate routers, preventing infinite loops!
        </p>
      </ExpandableSection>

      <h3>Modern Challenges</h3>

      <p>IPv4's design assumptions from 1981 created modern challenges:</p>

      <ul>
        <li>
          <strong>Address Exhaustion:</strong> Only 4.3 billion addresses for
          billions of devices
        </li>
        <li>
          <strong>NAT Necessity:</strong> Network Address Translation as a
          workaround
        </li>
        <li>
          <strong>Routing Table Growth:</strong> Millions of routes in internet
          backbone
        </li>
        <li>
          <strong>Security:</strong> No built-in encryption or authentication
        </li>
      </ul>

      <h3>IPv4 vs IPv6 Transition</h3>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
        <h4 className="text-yellow-900 font-semibold">Current Status</h4>
        <p className="text-yellow-800">
          Despite IPv6 being available since 1998, IPv4 still carries about 70%
          of internet traffic as of 2025. The transition is gradual due to
          IPv4's stability and widespread deployment.
        </p>
      </div>

      <h3>Why IPv4 Endured</h3>

      <ul>
        <li>Simple and well-understood design</li>
        <li>Massive existing infrastructure</li>
        <li>NAT solved address scarcity (temporarily)</li>
        <li>High cost of complete replacement</li>
      </ul>

      <h3>IPv4's Extraordinary Impact on the Modern Internet</h3>

      <p>
        RFC 791's IPv4 protocol has become the foundation of global digital communication, 
        powering everything from your smartphone to global financial systems:
      </p>

      <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-cyan-900 mb-4">🌍 IPv4 in Today's Digital World</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-cyan-800">Consumer Internet</h5>
            <ul className="text-cyan-700 text-sm space-y-1">
              <li>• 5+ billion smartphones</li>
              <li>• Smart home devices (IoT)</li>
              <li>• Streaming services (Netflix, YouTube)</li>
              <li>• Social media platforms</li>
              <li>• Online gaming networks</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-semibold text-cyan-800">Enterprise Systems</h5>
            <ul className="text-cyan-700 text-sm space-y-1">
              <li>• Cloud computing (AWS, Azure, GCP)</li>
              <li>• Financial trading systems</li>
              <li>• E-commerce platforms</li>
              <li>• Corporate VPNs</li>
              <li>• Data center networks</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-semibold text-cyan-800">Critical Infrastructure</h5>
            <ul className="text-cyan-700 text-sm space-y-1">
              <li>• Power grid communications</li>
              <li>• Hospital networks</li>
              <li>• Air traffic control</li>
              <li>• Banking systems</li>
              <li>• Government networks</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-amber-900 mb-3">📊 By the Numbers (2025)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-amber-800">~70%</div>
            <div className="text-sm text-amber-700">Internet traffic still IPv4</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-800">4.3B</div>
            <div className="text-sm text-amber-700">Total IPv4 addresses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-800">$50+</div>
            <div className="text-sm text-amber-700">Price per IPv4 address</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-800">40+</div>
            <div className="text-sm text-amber-700">Years in production</div>
          </div>
        </div>
      </div>

      <ExpandableSection title="🔄 Alternative Approaches and IPv4's Competition">
        <p>
          Several alternative networking protocols competed with IPv4, and modern solutions address its limitations:
        </p>

        <div className="space-y-6 mt-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h5 className="font-semibold text-red-800 mb-2">🥇 IPv6 (The Designated Successor)</h5>
            <div className="text-red-700 text-sm space-y-2">
              <p><strong>Advantages:</strong> 128-bit addresses (340 undecillion), built-in security, no NAT needed</p>
              <p><strong>Challenge:</strong> Slow adoption due to IPv4's entrenchment and dual-stack complexity</p>
              <p><strong>Status:</strong> ~30% of internet traffic as of 2025, growing steadily</p>
              <p><strong>References:</strong> 
                <a href="https://www.rfc-editor.org/rfc/rfc2460.html" className="underline ml-1" target="_blank" rel="noopener noreferrer">RFC 2460</a>,
                <a href="https://www.google.com/intl/en/ipv6/statistics.html" className="underline ml-1" target="_blank" rel="noopener noreferrer">Google IPv6 Statistics</a>
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h5 className="font-semibold text-yellow-800 mb-2">⚡ OSI Network Layer (Historical Competitor)</h5>
            <div className="text-yellow-700 text-sm space-y-2">
              <p><strong>Approach:</strong> ISO's Connectionless Network Protocol (CLNP) with variable-length addresses</p>
              <p><strong>Government Support:</strong> Mandated by US GOSIP and European governments in 1980s-90s</p>
              <p><strong>Why it Failed:</strong> Complex, expensive to implement, IPv4 already had momentum</p>
              <p><strong>Legacy:</strong> Many networking concepts survived in modern protocols</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h5 className="font-semibold text-blue-800 mb-2">🔧 IPv4 Workarounds and Extensions</h5>
            <div className="text-blue-700 text-sm space-y-2">
              <p><strong>NAT (Network Address Translation):</strong> Enables private networks, reduces address consumption</p>
              <p><strong>CIDR (Classless Inter-Domain Routing):</strong> More efficient address allocation</p>
              <p><strong>Private Address Spaces:</strong> RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)</p>
              <p><strong>IPv4 Address Trading:</strong> Market-based address reallocation</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h5 className="font-semibold text-green-800 mb-2">🌐 Modern Internet Protocols</h5>
            <div className="text-green-700 text-sm space-y-2">
              <p><strong>QUIC over UDP:</strong> Faster connection establishment, better mobile performance</p>
              <p><strong>HTTP/3:</strong> Reduces head-of-line blocking compared to TCP</p>
              <p><strong>SD-WAN:</strong> Software-defined networking over IP</p>
              <p><strong>Zero Trust Networks:</strong> Security models that don't rely on network location</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
          <h5 className="font-semibold text-indigo-800 mb-2">📖 Further Reading</h5>
          <ul className="text-indigo-700 text-sm space-y-1">
            <li><a href="https://www.rfc-editor.org/rfc/rfc2460.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 2460: Internet Protocol, Version 6 (IPv6)</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc1918.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 1918: Address Allocation for Private Internets</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc4291.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 4291: IP Version 6 Addressing Architecture</a></li>
            <li><a href="https://stats.labs.apnic.net/ipv6" className="underline" target="_blank" rel="noopener noreferrer">IPv6 Deployment Statistics - APNIC</a></li>
            <li><a href="https://www.potaroo.net/tools/ipv4/index.html" className="underline" target="_blank" rel="noopener noreferrer">IPv4 Address Exhaustion - Geoff Huston</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-orange-900 mb-3">🔮 IPv4's Future: Adaptation Rather Than Replacement</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-orange-800">Short Term (2025-2030)</h5>
            <p className="text-orange-700 text-sm">
              Continued dual-stack deployment, IPv4 address trading market, 
              carrier-grade NAT expansion, and IPv4-as-a-Service offerings
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-orange-800">Medium Term (2030-2040)</h5>
            <p className="text-orange-700 text-sm">
              IPv6 becomes majority protocol, IPv4 relegated to legacy systems,
              IPv4/IPv6 translation services become critical infrastructure
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-orange-800">Long Term (2040+)</h5>
            <p className="text-orange-700 text-sm">
              IPv4 likely to persist in embedded systems, industrial networks,
              and specialized applications where upgrade costs exceed benefits
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          IPv4's 40+ year dominance demonstrates that simple, well-designed protocols 
          can far exceed their original scope. While IPv6 offers technical improvements, 
          IPv4's entrenchment in global infrastructure ensures its continued relevance 
          for decades to come. The protocol's greatest achievement isn't just technical—it's 
          creating the common language that enabled global digital communication.
        </p>
      </div>
    </article>
  );
}
