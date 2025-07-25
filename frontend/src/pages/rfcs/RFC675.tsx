import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';
import MermaidDiagram from '../../components/MermaidDiagram';

export default function RFC675() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 675: Internet Transmission Control Program (December 1974)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          This <GlossaryTerm>RFC</GlossaryTerm> introduced the concept of internetworking and laid the
          foundation for what would become <GlossaryTerm>TCP</GlossaryTerm>/<GlossaryTerm>IP</GlossaryTerm>. Authored by Vint Cerf, Bob
          Kahn, and others, it described how different networks could be
          connected together.
        </p>
      </div>

      <h2>The Birth of Internetworking</h2>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 675 represents a revolutionary shift from thinking about individual
        networks to connecting multiple networks together. This was the first
        detailed specification for what would eventually become the <GlossaryTerm>TCP</GlossaryTerm>
        (Transmission Control Protocol).
      </p>

      <h3>Key Concepts Introduced</h3>

      <ul>
        <li>
          <strong>Internetworking:</strong> Connecting different types of
          networks
        </li>
        <li>
          <strong><GlossaryTerm>Gateway</GlossaryTerm> Concept:</strong> Devices that route between networks
          (now called <GlossaryTerm>router</GlossaryTerm>s)
        </li>
        <li>
          <strong><GlossaryTerm>Packet</GlossaryTerm> Switching:</strong> Breaking data into <GlossaryTerm>packet</GlossaryTerm>s for
          transmission
        </li>
        <li>
          <strong>End-to-End Principle:</strong> Intelligence at the endpoints,
          not in the network
        </li>
      </ul>

      <h3>Technical Innovations</h3>

      <MermaidDiagram
        chart={`
graph TB
    A[Application Layer<br/>HTTP, FTP, SMTP] --> B[Transport Layer<br/>TCP - Reliable Delivery]
    B --> C[Internet Layer<br/>IP - Routing & Addressing]
    C --> D[Network Interface<br/>Ethernet, WiFi, etc.]
    
    E[Network A<br/>ARPANET] --> F[Gateway<br/>Router]
    F --> G[Network B<br/>Ethernet LAN]
    F --> H[Network C<br/>Radio Network]
    
    style F fill:#f9f,stroke:#333,stroke-width:3px
    style B fill:#bbf
    style C fill:#bfb
        `}
        className="my-6"
      />

      <ExpandableSection title="🐍 ELI-Pythonista: Understanding Network Layers">
        <p>
          RFC 675's layered architecture is the foundation of modern networking. 
          Here's how you can explore these layers with Python:
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import struct

def demonstrate_network_layers():
    """Show how Python abstracts the network layer stack."""
    
    # Application Layer - Your Python code
    message = "Hello from the application layer!"
    
    # Transport Layer - TCP socket (Python handles this)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        
        # Internet Layer - IP addressing (Python abstracts this)
        host = 'httpbin.org'  # DNS resolves to IP address
        port = 80
        
        print(f"Application Layer: Sending '{message}'")
        
        # Network Interface Layer is handled by the OS
        print(f"Transport Layer: TCP socket created")
        print(f"Internet Layer: Connecting to {host}:{port}")
        
        sock.connect((host, port))
        
        # Send HTTP request (Application Layer protocol)
        http_request = f"""GET /get HTTP/1.1\\r
Host: {host}\\r
Connection: close\\r
\\r
"""
        
        sock.send(http_request.encode())
        print("Network Interface: Packet transmitted over physical network")
        
        # Receive response
        response = sock.recv(1024)
        print(f"\\nResponse received: {len(response)} bytes")
        print("All network layers worked together successfully!")

demonstrate_network_layers()`}
        />

        <p>
          <strong>Exploring the <GlossaryTerm>gateway</GlossaryTerm> concept</strong> (modern <GlossaryTerm>router</GlossaryTerm>s):
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import struct
import subprocess
import platform

def find_default_gateway():
    """Find the default gateway (router) on different platforms."""
    
    system = platform.system().lower()
    
    if system == "linux":
        try:
            # Parse /proc/net/route to find default gateway
            with open('/proc/net/route', 'r') as f:
                lines = f.readlines()[1:]  # Skip header
                
            for line in lines:
                fields = line.strip().split()
                if fields[1] == '00000000':  # Default route (0.0.0.0)
                    gateway_hex = fields[2]
                    # Convert hex to IP (little endian)
                    gateway_ip = socket.inet_ntoa(
                        struct.pack('<L', int(gateway_hex, 16))
                    )
                    return gateway_ip
        except:
            pass
    
    elif system == "darwin" or system == "windows":
        try:
            # Use netstat to find default gateway
            if system == "windows":
                cmd = ["netstat", "-rn"]
            else:
                cmd = ["netstat", "-rn", "-f", "inet"]
                
            result = subprocess.run(cmd, capture_output=True, text=True)
            lines = result.stdout.split('\\n')
            
            for line in lines:
                if '0.0.0.0' in line or 'default' in line:
                    parts = line.split()
                    for part in parts:
                        if '.' in part and part != '0.0.0.0':
                            try:
                                socket.inet_aton(part)  # Validate IP
                                return part
                            except:
                                continue
        except:
            pass
    
    return "Unable to determine"

def trace_to_gateway():
    """Show how packets travel through the gateway."""
    
    gateway = find_default_gateway()
    print(f"Default Gateway (Router): {gateway}")
    
    if gateway != "Unable to determine":
        print(f"\\nYour computer sends packets to {gateway} first")
        print("The gateway/router then forwards them to the internet")
        print("This is exactly what RFC 675 described in 1974!")
        
        # Test connectivity to gateway
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex((gateway, 80))  # Try HTTP port
            
            if result == 0:
                print(f"✅ Gateway {gateway} is reachable")
            else:
                print(f"Gateway {gateway} found but HTTP port not open")
            sock.close()
        except Exception as e:
            print(f"Gateway check failed: {e}")

trace_to_gateway()`}
        />

        <p>
          This shows how RFC 675's vision of internetworking through gateways 
          became the foundation of today's internet architecture!
        </p>
      </ExpandableSection>

      <h3>From NCP to TCP</h3>

      <p>
        Before RFC 675, networks used the Network Control Protocol (NCP), which
        only worked within ARPANET. The new design needed to:
      </p>

      <ul>
        <li>Work across different network technologies</li>
        <li>Handle varying transmission speeds and reliability</li>
        <li>Provide error recovery and flow control</li>
        <li>Scale to connect many networks</li>
      </ul>

      <h3>The <GlossaryTerm>Gateway</GlossaryTerm> Innovation</h3>

      <div className="border-2 border-dashed border-gray-300 p-4 my-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Conceptual Network Diagram</p>
        <div className="flex items-center justify-center space-x-4">
          <div className="bg-blue-100 p-2 rounded">Network A</div>
          <div className="bg-green-100 p-2 rounded border-2 border-green-500">
            <GlossaryTerm>Gateway</GlossaryTerm>
          </div>
          <div className="bg-blue-100 p-2 rounded">Network B</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <GlossaryTerm>Gateway</GlossaryTerm>s route <GlossaryTerm>packet</GlossaryTerm>s between different networks
        </p>
      </div>

      <h3>Impact on Modern Internet</h3>

      <p>The principles established in RFC 675 directly enabled:</p>

      <ul>
        <li>The global Internet as we know it today</li>
        <li>Network of networks architecture</li>
        <li><GlossaryTerm>Router</GlossaryTerm>-based internetworking</li>
        <li>Protocol layering concepts</li>
      </ul>

      <h3>Evolution Timeline</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6 space-y-2">
        <p>
          <strong>1974:</strong> RFC 675 - Internet Transmission Control Program
        </p>
        <p>
          <strong>1978:</strong> TCP/IP split into separate protocols
        </p>
        <p>
          <strong>1981:</strong> RFC 791 (IPv4) and RFC 793 (TCP) finalized
        </p>
        <p>
          <strong>1983:</strong> ARPANET switches from NCP to TCP/IP
        </p>
      </div>

      <h3>Why This Matters</h3>

      <p>
        RFC 675 shows how fundamental architectural decisions shape technology
        for decades. The internetworking principles described here still govern
        how data flows across the global Internet today.
      </p>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          The internet's power comes from connecting different networks, not
          replacing them. This "network of networks" approach enabled
          unprecedented global connectivity.
        </p>
      </div>
    </article>
  );
}
