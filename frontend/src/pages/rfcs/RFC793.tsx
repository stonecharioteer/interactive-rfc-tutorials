import GlossaryTerm from "../../components/GlossaryTerm";
import MermaidDiagram from "../../components/MermaidDiagram";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";

export default function RFC793() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 793: Transmission Control Protocol (September 1981)</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800 dark:text-blue-200">
          <GlossaryTerm>TCP</GlossaryTerm> provides reliable, ordered data
          delivery over unreliable networks. This{" "}
          <GlossaryTerm>RFC</GlossaryTerm> established the protocol that powers
          most internet applications today, from web browsing to email.
        </p>
      </div>

      <h2>Reliable Communication Over Unreliable Networks</h2>

      <p>
        <GlossaryTerm>TCP</GlossaryTerm> solves a fundamental problem: how to
        provide reliable, ordered communication over a network that might drop,
        duplicate, or reorder
        <GlossaryTerm>packet</GlossaryTerm>s. It transforms the unreliable{" "}
        <GlossaryTerm>IP</GlossaryTerm> layer into a dependable communication
        service.
      </p>

      <h3>
        Core <GlossaryTerm>TCP</GlossaryTerm> Features
      </h3>

      <ul>
        <li>
          <strong>Connection-oriented:</strong> Establishes a session before
          data transfer
        </li>
        <li>
          <strong>Reliable delivery:</strong> Guarantees all data arrives
          correctly
        </li>
        <li>
          <strong>Ordered delivery:</strong> Data arrives in the same sequence
          it was sent
        </li>
        <li>
          <strong>Flow control:</strong> Prevents overwhelming the receiver
        </li>
        <li>
          <strong>Congestion control:</strong> Adapts to network conditions
        </li>
      </ul>

      <h3>
        The Famous <GlossaryTerm>Three-way Handshake</GlossaryTerm>
      </h3>

      <p>
        Every <GlossaryTerm>TCP</GlossaryTerm> connection begins with a
        three-way handshake to synchronize sequence numbers and establish
        communication parameters.
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant C as Client
    participant S as Server

    Note over C,S: TCP Three-Way Handshake
    C->>S: SYN (seq=1000, window=8192)
    Note right of S: Server allocates resources
    S->>C: SYN-ACK (seq=2000, ack=1001, window=4096)
    Note left of C: Client confirms connection
    C->>S: ACK (ack=2001, window=8192)
    Note over C,S: Connection Established!

    Note over C,S: Data can now flow bidirectionally
        `}
        className="my-6"
      />

      <ExpandableSection title="🐳 Interactive Docker Demo: See TCP in Action">
        <p>
          Experience TCP concepts hands-on with our Docker Compose
          demonstration! This interactive setup shows:
        </p>

        <ul>
          <li>
            <strong>Three-way handshake</strong> - Watch connection
            establishment
          </li>
          <li>
            <strong>Reliable data delivery</strong> - See sequence numbers and
            ACKs
          </li>
          <li>
            <strong>Flow control</strong> - Observe backpressure mechanisms
          </li>
          <li>
            <strong>Network monitoring</strong> - Real-time packet analysis
          </li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 my-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🚀 Quick Start
          </h4>

          <CodeBlock
            language="bash"
            code={`# Clone the repository
git clone https://github.com/stonecharioteer/interactive-rfc-tutorials.git
cd interactive-rfc-tutorials/docker-examples/rfc793-tcp

# Run the TCP demonstration
docker compose up --build

# Watch the logs to see TCP in action!`}
          />

          <p className="text-blue-800 dark:text-blue-200 text-sm mt-3">
            <strong>What you'll see:</strong> Three services working together -
            a TCP server, client, and network monitor demonstrating real TCP
            communication with detailed logging of handshakes, data transfer,
            and connection management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-3">
            <h5 className="font-semibold text-green-800 dark:text-green-200">
              TCP Server
            </h5>
            <p className="text-sm text-green-700 dark:text-green-300">
              Accepts connections, handles multiple clients, demonstrates flow
              control
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded p-3">
            <h5 className="font-semibold text-orange-800 dark:text-orange-200">
              TCP Client
            </h5>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Connects to server, sends messages, tracks responses and
              statistics
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded p-3">
            <h5 className="font-semibold text-purple-800 dark:text-purple-200">
              Network Monitor
            </h5>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Captures packets with tcpdump, shows connection states, analyzes
              traffic
            </p>
          </div>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-200">
            🔧 Customize the Demo
          </summary>
          <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
            <CodeBlock
              language="bash"
              code={`# Send more messages with custom timing
MESSAGE_COUNT=10 DELAY_SECONDS=1 docker compose up --build

# Different scenarios
MESSAGE_COUNT=50 DELAY_SECONDS=0.1 docker compose up  # High frequency
MESSAGE_COUNT=3 DELAY_SECONDS=5 docker compose up    # Slow and steady`}
            />
          </div>
        </details>
      </ExpandableSection>

      <ExpandableSection title="🐍 ELI-Pythonista: TCP Socket Programming">
        <p>
          Here's how the three-way handshake looks in Python using the socket
          library:
        </p>

        <h4>TCP Server</h4>
        <CodeBlock
          language="python"
          code={`import socket

# Create a TCP socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Allow socket reuse
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# Bind to address and port
server_socket.bind(('localhost', 8080))

# Listen for connections (three-way handshake happens here)
server_socket.listen(5)
print("Server listening on port 8080...")

while True:
    # Accept connection (completes handshake)
    client_socket, client_address = server_socket.accept()
    print(f"Connection from {client_address}")

    # Send data
    client_socket.send(b"Hello from TCP server!")

    # Close connection (four-way handshake)
    client_socket.close()`}
        />

        <h4>TCP Client</h4>
        <CodeBlock
          language="python"
          code={`import socket

# Create a TCP socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    # Connect to server (initiates three-way handshake)
    print("Initiating TCP handshake...")
    client_socket.connect(('localhost', 8080))
    print("✅ Connection established!")

    # Receive data
    response = client_socket.recv(1024)
    print(f"Received: {response.decode()}")

finally:
    # Close connection
    client_socket.close()
    print("Connection closed")`}
        />

        <p>
          <strong>What happens behind the scenes:</strong>
        </p>
        <ol>
          <li>
            <code>listen()</code> puts server in SYN_LISTEN state
          </li>
          <li>
            <code>connect()</code> sends SYN packet
          </li>
          <li>Server responds with SYN-ACK</li>
          <li>
            Client sends ACK, <code>connect()</code> returns
          </li>
          <li>
            <code>accept()</code> returns the established connection
          </li>
        </ol>
      </ExpandableSection>

      <h3>TCP Connection States</h3>

      <p>
        TCP connections progress through a well-defined state machine. Understanding
        these states helps debug network issues and optimize application performance:
      </p>

      <MermaidDiagram
        chart={`
stateDiagram-v2
    [*] --> CLOSED
    CLOSED --> LISTEN : passive open
    CLOSED --> SYN_SENT : active open
    
    LISTEN --> SYN_RCVD : receive SYN
    SYN_SENT --> SYN_RCVD : receive SYN
    SYN_SENT --> ESTABLISHED : receive SYN-ACK
    SYN_RCVD --> ESTABLISHED : receive ACK
    
    ESTABLISHED --> FIN_WAIT_1 : close (send FIN)
    ESTABLISHED --> CLOSE_WAIT : receive FIN
    
    FIN_WAIT_1 --> FIN_WAIT_2 : receive ACK
    FIN_WAIT_1 --> CLOSING : receive FIN
    FIN_WAIT_2 --> TIME_WAIT : receive FIN
    
    CLOSE_WAIT --> LAST_ACK : close (send FIN)
    CLOSING --> TIME_WAIT : receive ACK
    LAST_ACK --> CLOSED : receive ACK
    
    TIME_WAIT --> CLOSED : timeout (2MSL)
    
    note right of ESTABLISHED : Data transfer state
    note right of TIME_WAIT : Ensures all packets are processed
        `}
        className="my-6"
      />

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-800 mb-3">Key TCP States Explained</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="space-y-2">
              <div><strong className="text-green-600">ESTABLISHED:</strong> Connection ready for data transfer</div>
              <div><strong className="text-blue-600">SYN_SENT:</strong> Waiting for SYN-ACK response</div>
              <div><strong className="text-purple-600">LISTEN:</strong> Server waiting for connection requests</div>
              <div><strong className="text-orange-600">CLOSE_WAIT:</strong> Remote side initiated close</div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <div><strong className="text-red-600">TIME_WAIT:</strong> Ensures all packets are processed</div>
              <div><strong className="text-yellow-600">FIN_WAIT_1:</strong> Local side initiated close</div>
              <div><strong className="text-pink-600">LAST_ACK:</strong> Waiting for final ACK</div>
              <div><strong className="text-gray-600">CLOSED:</strong> No connection exists</div>
            </div>
          </div>
        </div>
      </div>

      <h3>TCP Segment Flow Visualization</h3>

      <p>
        Here's how TCP segments flow during a typical connection lifecycle,
        including data transfer and connection termination:
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant C as Client
    participant S as Server
    
    Note over C,S: Connection Establishment
    C->>+S: SYN (seq=100)
    S->>+C: SYN-ACK (seq=200, ack=101)
    C->>S: ACK (ack=201)
    
    Note over C,S: Data Transfer Phase
    C->>S: PSH-ACK (seq=101, data="Hello", ack=201)
    S->>C: ACK (ack=106)
    S->>C: PSH-ACK (seq=201, data="World", ack=106) 
    C->>S: ACK (ack=206)
    
    Note over C,S: Connection Termination (4-way handshake)
    C->>S: FIN-ACK (seq=106, ack=206)
    S->>C: ACK (ack=107)
    S->>C: FIN-ACK (seq=206, ack=107)
    C->>-S: ACK (ack=207)
    
    Note over C: TIME_WAIT (2MSL)
    Note over C,S: Connection Closed
        `}
        className="my-6"
      />

      <h3>TCP Header Structure</h3>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-6 overflow-x-auto">
        <h4 className="font-semibold mb-3">TCP Header (20+ bytes)</h4>
        <div className="grid grid-cols-8 gap-1 text-xs">
          <div className="bg-blue-200 p-2 text-center col-span-4">
            Source Port
          </div>
          <div className="bg-blue-200 p-2 text-center col-span-4">
            Destination Port
          </div>

          <div className="bg-green-200 p-2 text-center col-span-8">
            Sequence Number
          </div>
          <div className="bg-yellow-200 p-2 text-center col-span-8">
            Acknowledgment Number
          </div>

          <div className="bg-purple-200 p-2 text-center">Data Offset</div>
          <div className="bg-red-200 p-2 text-center">Reserved</div>
          <div className="bg-orange-200 p-2 text-center col-span-2">Flags</div>
          <div className="bg-pink-200 p-2 text-center col-span-4">
            Window Size
          </div>

          <div className="bg-indigo-200 p-2 text-center col-span-4">
            Checksum
          </div>
          <div className="bg-cyan-200 p-2 text-center col-span-4">
            Urgent Pointer
          </div>

          <div className="bg-lime-200 p-2 text-center col-span-8">
            Options (0-40 bytes)
          </div>
        </div>
      </div>

      <h3>TCP Flags Explained</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-red-600">SYN</h5>
          <p className="text-xs">Synchronize sequence numbers</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-green-600">ACK</h5>
          <p className="text-xs">Acknowledge received data</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-blue-600">FIN</h5>
          <p className="text-xs">Finish - close connection</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-orange-600">RST</h5>
          <p className="text-xs">Reset - abort connection</p>
        </div>
      </div>

      <h3>Sequence Numbers & Acknowledgments</h3>

      <p>TCP uses sequence numbers to ensure reliable, ordered delivery:</p>

      <ul>
        <li>
          <strong>Sequence Number:</strong> Position of first byte in this
          segment
        </li>
        <li>
          <strong>Acknowledgment Number:</strong> Next expected sequence number
        </li>
        <li>
          <strong>Retransmission:</strong> Unacknowledged data is sent again
        </li>
        <li>
          <strong>Duplicate Detection:</strong> Sequence numbers identify
          duplicates
        </li>
      </ul>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Example Data Transfer:</h4>
        <div className="text-sm space-y-1">
          <p>Client sends: seq=1000, len=100 (bytes 1000-1099)</p>
          <p>Server acks: ack=1100 ("I received up to 1099, send 1100 next")</p>
          <p>Client sends: seq=1100, len=200 (bytes 1100-1299)</p>
          <p>Server acks: ack=1300 ("I received up to 1299, send 1300 next")</p>
        </div>
      </div>

      <h3>Flow Control with Window Size</h3>

      <p>TCP prevents buffer overflow using the window size field:</p>

      <ul>
        <li>Receiver advertises available buffer space</li>
        <li>Sender doesn't exceed the advertised window</li>
        <li>Window size adjusts dynamically</li>
        <li>Zero window stops transmission temporarily</li>
      </ul>

      <ExpandableSection title="🐍 ELI-Pythonista: Socket Buffer Management">
        <p>
          Python sockets automatically handle TCP flow control, but you can
          configure buffer sizes:
        </p>

        <CodeBlock
          language="python"
          code={`import socket

# Create socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Check current buffer sizes
recv_buffer = sock.getsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF)
send_buffer = sock.getsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF)

print(f"Default receive buffer: {recv_buffer} bytes")
print(f"Default send buffer: {send_buffer} bytes")

# Set larger buffers for high-throughput applications
sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65536)  # 64KB
sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 65536)  # 64KB

print("Buffer sizes increased for better performance")`}
        />

        <p>
          <strong>Real-world example:</strong> Handling large file transfers
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import os

def send_file(filename, host, port):
    """Send a file using TCP with proper buffer management."""
    file_size = os.path.getsize(filename)

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        # Optimize for large transfers
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 65536)
        sock.connect((host, port))

        # Send file size first
        sock.send(file_size.to_bytes(8, 'big'))

        # Send file in chunks (TCP handles flow control)
        with open(filename, 'rb') as f:
            sent = 0
            while sent < file_size:
                chunk = f.read(8192)  # 8KB chunks
                if not chunk:
                    break

                # send() may not send all data at once due to flow control
                bytes_sent = sock.send(chunk)
                sent += bytes_sent

                print(f"Sent {sent}/{file_size} bytes ({sent/file_size*100:.1f}%)")

        print("✅ File sent successfully!")`}
        />

        <p>
          Notice how <code>send()</code> might not send all data at once -
          that's TCP flow control working! The receiver's window size determines
          how much data can be sent.
        </p>
      </ExpandableSection>

      <h3>Congestion Control</h3>

      <p>TCP adapts to network conditions to prevent congestion:</p>

      <div className="border-2 border-dashed border-gray-300 p-4 my-6">
        <h4 className="font-semibold mb-2">Slow Start Algorithm:</h4>
        <div className="space-y-2 text-sm">
          <div>Start: Send 1 packet</div>
          <div>ACK received: Send 2 packets (exponential growth)</div>
          <div>ACK received: Send 4 packets</div>
          <div>Packet lost: Reduce sending rate (congestion detected)</div>
        </div>
      </div>

      <h3>Connection Termination</h3>

      <p>TCP uses a four-way handshake to close connections gracefully:</p>

      <ol>
        <li>Client sends FIN (finished sending)</li>
        <li>Server sends ACK (acknowledges FIN)</li>
        <li>Server sends FIN (finished sending)</li>
        <li>Client sends ACK (acknowledges FIN)</li>
      </ol>

      <h3>Modern TCP Improvements</h3>

      <p>Since RFC 793, TCP has evolved with many improvements:</p>

      <ul>
        <li>
          <strong>Fast Retransmit:</strong> Quicker loss detection
        </li>
        <li>
          <strong>Selective Acknowledgments (SACK):</strong> More efficient
          retransmission
        </li>
        <li>
          <strong>Window Scaling:</strong> Larger windows for high-speed
          networks
        </li>
        <li>
          <strong>Timestamps:</strong> Better round-trip time measurement
        </li>
      </ul>

      <ExpandableSection title="🐍 ELI-Pythonista: TCP Socket Options and Diagnostics">
        <p>
          Python allows you to access many TCP features and get diagnostic
          information:
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import struct

def analyze_tcp_connection(host, port):
    """Demonstrate TCP socket options and connection analysis."""

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        # Enable keep-alive to detect broken connections
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)

        # Disable Nagle's algorithm for low-latency applications
        sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

        print(f"Connecting to {host}:{port}...")
        sock.connect((host, port))

        # Get connection information
        local_addr = sock.getsockname()
        remote_addr = sock.getpeername()

        print(f"Local address: {local_addr}")
        print(f"Remote address: {remote_addr}")

        # Check if Nagle's algorithm is disabled
        nodelay = sock.getsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY)
        print(f"TCP_NODELAY: {'Enabled' if nodelay else 'Disabled'}")

        # Check keep-alive settings
        keepalive = sock.getsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE)
        print(f"Keep-alive: {'Enabled' if keepalive else 'Disabled'}")

        # On Linux, you can get more detailed TCP info
        try:
            tcp_info = sock.getsockopt(socket.IPPROTO_TCP, socket.TCP_INFO, 192)
            # Parse first few fields (this is Linux-specific)
            state, retransmits, probes = struct.unpack('BBB', tcp_info[:3])
            print(f"TCP State: {state}")
            print(f"Retransmits: {retransmits}")
        except:
            print("TCP_INFO not available on this platform")

# Example usage
analyze_tcp_connection('httpbin.org', 80)`}
        />

        <p>
          <strong>Practical TCP tuning for different applications:</strong>
        </p>

        <CodeBlock
          language="python"
          code={`import socket

def create_web_client_socket():
    """Optimized for HTTP requests - low latency."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Disable Nagle's algorithm for immediate sending
    sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

    # Shorter keep-alive for web connections
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)

    return sock

def create_file_transfer_socket():
    """Optimized for bulk data transfer - high throughput."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Large buffers for bulk transfer
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65536)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 65536)

    # Keep Nagle's algorithm for better batching
    sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 0)

    return sock

def create_realtime_socket():
    """Optimized for gaming/streaming - minimal latency."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Immediate transmission
    sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

    # Smaller buffers to reduce buffering delays
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 8192)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 8192)

    return sock`}
        />

        <p>
          These optimizations demonstrate how TCP's flexibility allows tuning
          for different application needs - from web browsing to file transfers
          to real-time gaming!
        </p>
      </ExpandableSection>

      <h3>TCP vs UDP</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-green-300 p-4 rounded">
          <h4 className="font-semibold text-green-600 mb-2">TCP Advantages</h4>
          <ul className="text-sm space-y-1">
            <li>✓ Reliable delivery</li>
            <li>✓ Ordered data</li>
            <li>✓ Flow control</li>
            <li>✓ Error correction</li>
          </ul>
        </div>
        <div className="border border-red-300 p-4 rounded">
          <h4 className="font-semibold text-red-600 mb-2">TCP Disadvantages</h4>
          <ul className="text-sm space-y-1">
            <li>✗ Higher latency</li>
            <li>✗ More overhead</li>
            <li>✗ Connection state</li>
            <li>✗ Complex implementation</li>
          </ul>
        </div>
      </div>

      <h3>Applications Using TCP</h3>

      <ul>
        <li>
          <strong>Web (HTTP/HTTPS):</strong> Reliable page delivery
        </li>
        <li>
          <strong>Email (SMTP):</strong> Guaranteed message delivery
        </li>
        <li>
          <strong>File Transfer (FTP):</strong> Ensures complete file transfer
        </li>
        <li>
          <strong>SSH:</strong> Reliable remote shell sessions
        </li>
      </ul>

      <h3>TCP's Dominance in the Modern Internet</h3>

      <p>
        TCP has become the backbone of digital communication, powering virtually every 
        reliable internet application and enabling the global digital economy:
      </p>

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-emerald-900 mb-4">🌐 TCP Powers the Digital World</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-emerald-800">Web & Communication</h5>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• HTTP/HTTPS (web browsing)</li>
              <li>• Email protocols (SMTP, IMAP, POP3)</li>
              <li>• Instant messaging (WhatsApp, Slack)</li>
              <li>• Video conferencing (Zoom, Teams)</li>
              <li>• Social media APIs</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-semibold text-emerald-800">Enterprise & Finance</h5>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Database connections (MySQL, PostgreSQL)</li>
              <li>• Financial trading systems</li>
              <li>• Cloud APIs (REST, GraphQL)</li>
              <li>• Enterprise resource planning</li>
              <li>• Remote work protocols (SSH, RDP)</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-semibold text-emerald-800">Infrastructure & IoT</h5>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Container orchestration (Kubernetes)</li>
              <li>• Smart city systems</li>
              <li>• Industrial automation</li>
              <li>• Healthcare devices</li>
              <li>• Automotive networks</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-blue-900 mb-3">📊 TCP Usage Statistics (2025)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-800">~85%</div>
            <div className="text-sm text-blue-700">Internet traffic uses TCP</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-800">65,535</div>
            <div className="text-sm text-blue-700">Maximum port number</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-800">40+</div>
            <div className="text-sm text-blue-700">Years of continuous service</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-800">Billions</div>
            <div className="text-sm text-blue-700">Connections per second globally</div>
          </div>
        </div>
      </div>

      <ExpandableSection title="⚔️ TCP vs Modern Alternatives: The Great Transport Protocol Debate">
        <p>
          While TCP dominates, several alternatives have emerged to address its limitations in specific use cases:
        </p>

        <div className="space-y-6 mt-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h5 className="font-semibold text-red-800 mb-2">🚀 QUIC (HTTP/3's Foundation)</h5>
            <div className="text-red-700 text-sm space-y-2">
              <p><strong>Innovation:</strong> UDP-based with built-in encryption, faster connection setup</p>
              <p><strong>Advantages:</strong> Reduces head-of-line blocking, better mobile performance, 0-RTT resumption</p>
              <p><strong>Adoption:</strong> Google, Facebook, Cloudflare use it extensively</p>
              <p><strong>Challenge to TCP:</strong> Optimized for web traffic, not general-purpose connections</p>
              <p><strong>References:</strong> 
                <a href="https://www.rfc-editor.org/rfc/rfc9000.html" className="underline ml-1" target="_blank" rel="noopener noreferrer">RFC 9000</a>,
                <a href="https://quicwg.org/" className="underline ml-1" target="_blank" rel="noopener noreferrer">QUIC Working Group</a>
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h5 className="font-semibold text-purple-800 mb-2">📡 SCTP (Stream Control Transmission Protocol)</h5>
            <div className="text-purple-700 text-sm space-y-2">
              <p><strong>Design:</strong> Multiple streams in one connection, built-in multihoming</p>
              <p><strong>Use Cases:</strong> Telecom (SS7 over IP), WebRTC data channels</p>
              <p><strong>Why Not Widespread:</strong> Complex implementation, NAT traversal issues</p>
              <p><strong>Niche Success:</strong> Critical for telecom infrastructure modernization</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded">
            <h5 className="font-semibold text-orange-800 mb-2">⚡ UDP + Application-Layer Reliability</h5>
            <div className="text-orange-700 text-sm space-y-2">
              <p><strong>Examples:</strong> WebRTC, gaming protocols, DNS over HTTPS</p>
              <p><strong>Advantage:</strong> Custom reliability mechanisms for specific needs</p>
              <p><strong>Trade-off:</strong> Application complexity vs network efficiency</p>
              <p><strong>Success Stories:</strong> Real-time gaming, live streaming, VoIP</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h5 className="font-semibold text-yellow-800 mb-2">🔄 TCP Enhancements (Extensions to RFC 793)</h5>
            <div className="text-yellow-700 text-sm space-y-2">
              <p><strong>BBR Congestion Control:</strong> Google's bandwidth-delay product optimization</p>
              <p><strong>TCP Fast Open (TFO):</strong> Data in SYN packets for faster connection setup</p>
              <p><strong>Multipath TCP (MPTCP):</strong> Multiple paths for single connection</p>
              <p><strong>TCP over HTTP/2:</strong> Multiplexed streams reduce connection overhead</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h5 className="font-semibold text-green-800 mb-2">🏆 Why TCP Still Wins</h5>
            <div className="text-green-700 text-sm space-y-2">
              <p><strong>Universal Support:</strong> Works everywhere, from routers to smartphones</p>
              <p><strong>Proven Reliability:</strong> Four decades of real-world testing</p>
              <p><strong>NAT/Firewall Friendly:</strong> Well-understood by network equipment</p>
              <p><strong>Developer Familiarity:</strong> Simple socket API in every programming language</p>
              <p><strong>Infrastructure Investment:</strong> Trillions of dollars of TCP-optimized equipment</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded">
          <h5 className="font-semibold text-cyan-800 mb-2">📖 Further Reading</h5>
          <ul className="text-cyan-700 text-sm space-y-1">
            <li><a href="https://www.rfc-editor.org/rfc/rfc9000.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc4960.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 4960: Stream Control Transmission Protocol (SCTP)</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc7413.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 7413: TCP Fast Open</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc8684.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 8684: Multipath TCP</a></li>
            <li><a href="https://blog.cloudflare.com/http-3-the-past-present-and-future/" className="underline" target="_blank" rel="noopener noreferrer">HTTP/3 and QUIC - Cloudflare</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <div className="bg-violet-50 border border-violet-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-violet-900 mb-3">🎯 TCP in Specific Industries</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-violet-800 mb-2">Financial Services</h5>
            <ul className="text-violet-700 text-sm space-y-1">
              <li>• High-frequency trading systems</li>
              <li>• Banking transaction processing</li>
              <li>• Cryptocurrency exchanges</li>
              <li>• Credit card payment networks</li>
              <li>• Regulatory reporting systems</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-violet-800 mb-2">Healthcare</h5>
            <ul className="text-violet-700 text-sm space-y-1">
              <li>• Electronic health records (EHR)</li>
              <li>• Medical device connectivity</li>
              <li>• Telemedicine platforms</li>
              <li>• Hospital information systems</li>
              <li>• Medical imaging (DICOM over TCP)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-rose-50 border border-rose-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-rose-900 mb-3">🔮 TCP's Future: Evolution, Not Revolution</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-rose-800">Performance Optimizations</h5>
            <p className="text-rose-700 text-sm">
              BBR v2 congestion control, TCP over IPv6 optimization, 
              hardware acceleration, and machine learning-based tuning
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-rose-800">Security Enhancements</h5>
            <p className="text-rose-700 text-sm">
              Always-on TLS integration, quantum-resistant cryptography,
              and intrinsic protection against sophisticated attacks
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-rose-800">Coexistence Strategy</h5>
            <p className="text-rose-700 text-sm">
              TCP for reliable bulk transfer, QUIC for web traffic,
              UDP for real-time applications—each protocol optimized for its domain
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4 mt-6">
        <h4 className="text-green-900 dark:text-green-100 font-semibold">
          Key Takeaway
        </h4>
        <p className="text-green-800 dark:text-green-200">
          TCP's 40+ year reign demonstrates the power of solving fundamental problems 
          with elegant simplicity. While newer protocols optimize for specific use cases, 
          TCP's reliable, universal design ensures it will remain the backbone of internet 
          communication for decades to come. Its greatest achievement isn't just technical—it's 
          creating a trust layer that enables strangers across the globe to exchange data reliably.
        </p>
      </div>
    </article>
  );
}
