import { Link } from "react-router-dom";
import { ExternalLink, CheckCircle } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC9113() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 9113: HTTP/2 - June 2022
      </h1>
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
          <span className="font-semibold text-emerald-800">
            HTTP/2 Protocol Update
          </span>
        </div>
        <p className="text-emerald-700 mb-0">
          RFC 9113 updates the HTTP/2 specification originally defined in RFC 7540, 
          incorporating years of implementation experience, security improvements, 
          and clarifications. This specification defines the binary framing protocol 
          that enables stream multiplexing, header compression, and server push for 
          modern high-performance web applications.
        </p>
        <p className="text-emerald-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9113.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 9113: HTTP/2 <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>HTTP/2: Binary Protocol Evolution</h2>
      <p>
        RFC 9113 refines the HTTP/2 binary framing protocol that revolutionized 
        web performance through stream multiplexing, header compression, and 
        efficient connection utilization. This update incorporates security 
        enhancements and implementation lessons learned since the original RFC 7540.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg my-4">
        <h3 className="font-semibold text-blue-900 mb-2">Related HTTP Standards</h3>
        <ul className="text-blue-800 space-y-2">
          <li><strong><Link to="/rfc/9110" className="text-blue-600 hover:text-blue-800">RFC 9110</Link>:</strong> HTTP Semantics - Protocol meaning and behavior</li>
          <li><strong><Link to="/rfc/9111" className="text-blue-600 hover:text-blue-800">RFC 9111</Link>:</strong> HTTP Caching - Performance optimization</li>
          <li><strong><Link to="/rfc/9112" className="text-blue-600 hover:text-blue-800">RFC 9112</Link>:</strong> HTTP/1.1 - Text-based predecessor</li>
          <li><strong><Link to="/rfc/9113" className="text-blue-600 hover:text-blue-800">RFC 9113</Link>:</strong> HTTP/2 (This document)</li>
          <li><strong><Link to="/rfc/9114" className="text-blue-600 hover:text-blue-800">RFC 9114</Link>:</strong> HTTP/3 - QUIC-based evolution</li>
          <li><strong><Link to="/rfc/7540" className="text-blue-600 hover:text-blue-800">RFC 7540</Link>:</strong> HTTP/2 (Original specification)</li>
        </ul>
      </div>

      <ExpandableSection title="🎯 Understanding HTTP/2 Binary Protocol">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of HTTP/2 like upgrading from individual postal deliveries to a modern logistics network:</strong>
          </p>
          <p>
            <strong>HTTP/1.1 Approach:</strong> Like having individual mail trucks 
            where each truck can only carry one letter at a time, has to write the 
            full address on every envelope, and must complete one delivery before 
            starting the next.
          </p>
          <p className="mt-2">
            <strong>HTTP/2 Approach:</strong> Like having a smart logistics system 
            with containerized shipping where multiple packages travel together, 
            addresses are compressed into efficient codes, and deliveries can be 
            prioritized and multiplexed efficiently.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> Websites load dramatically faster with 
            efficient connection usage, reduced overhead, and intelligent resource 
            prioritization that makes the best use of available bandwidth.
          </p>
        </div>
      </ExpandableSection>

      <h2>Key HTTP/2 Improvements over HTTP/1.1</h2>
      <p>
        RFC 9113 defines the enhanced capabilities that make HTTP/2 significantly 
        more efficient than its predecessor:
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🚀 Stream Multiplexing</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>Multiple Requests:</strong> Many requests over single connection</li>
            <li>• <strong>No Head-of-Line Blocking:</strong> Independent stream processing</li>
            <li>• <strong>Concurrent Streams:</strong> Parallel request/response handling</li>
            <li>• <strong>Stream Prioritization:</strong> Important resources first</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🗜️ Header Compression</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>HPACK Algorithm:</strong> Efficient header field compression</li>
            <li>• <strong>Static Table:</strong> Common headers pre-indexed</li>
            <li>• <strong>Dynamic Table:</strong> Context-specific header caching</li>
            <li>• <strong>Bandwidth Savings:</strong> 80-90% header size reduction</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">📡 Server Push</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>Proactive Delivery:</strong> Server sends resources before requests</li>
            <li>• <strong>Cache Optimization:</strong> Pre-populate client cache</li>
            <li>• <strong>Reduced Round Trips:</strong> Fewer network roundtrips needed</li>
            <li>• <strong>Client Control:</strong> Push can be refused or prioritized</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">🔧 Binary Framing</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>Efficient Parsing:</strong> Binary format is faster to parse</li>
            <li>• <strong>Frame Types:</strong> Specialized frames for different purposes</li>
            <li>• <strong>Flow Control:</strong> Per-stream and connection-level control</li>
            <li>• <strong>Error Handling:</strong> Precise error reporting and recovery</li>
          </ul>
        </div>
      </div>

      <h2>HTTP/2 Frame Structure</h2>
      <p>
        RFC 9113 defines the binary frame format that enables efficient HTTP/2 
        communication. All HTTP/2 communication consists of frames with a 
        standardized 9-byte header:
      </p>

      <MermaidDiagram
        chart={`
graph TB
    subgraph "HTTP/2 Frame Format (9-byte header + payload)"
        Length[Length: 24 bits<br/>Frame payload size]
        Type[Type: 8 bits<br/>Frame type identifier]
        Flags[Flags: 8 bits<br/>Frame-specific flags]
        StreamID[Stream ID: 31 bits<br/>Stream identifier]
        Payload[Payload: Variable length<br/>Frame-specific data]
        
        Length --> Type
        Type --> Flags
        Flags --> StreamID
        StreamID --> Payload
    end
    
    subgraph "Common Frame Types"
        DATA[DATA: Stream data<br/>HTTP message body]
        HEADERS[HEADERS: Header fields<br/>Compressed HTTP headers]
        PRIORITY[PRIORITY: Stream priority<br/>Dependency and weight]
        RST_STREAM[RST_STREAM: Stream reset<br/>Terminate stream]
        SETTINGS[SETTINGS: Connection parameters<br/>Configuration settings]
        PUSH_PROMISE[PUSH_PROMISE: Server push<br/>Promise to send resource]
        PING[PING: Connection liveness<br/>Heartbeat mechanism]
        GOAWAY[GOAWAY: Connection shutdown<br/>Graceful connection close]
        WINDOW_UPDATE[WINDOW_UPDATE: Flow control<br/>Update flow control window]
    end
    
    style Length fill:#e3f2fd
    style Type fill:#e8f5e8
    style Flags fill:#fff3e0
    style StreamID fill:#f3e5f5
    style Payload fill:#fce4ec
        `}
        className="my-6"
      />

      <h3>Frame Type Descriptions</h3>
      <ul>
        <li><strong>DATA:</strong> Carries HTTP message body content for a stream</li>
        <li><strong>HEADERS:</strong> Contains compressed HTTP header fields</li>
        <li><strong>PRIORITY:</strong> Specifies stream dependency and weight for prioritization</li>
        <li><strong>RST_STREAM:</strong> Immediately terminates a stream with error code</li>
        <li><strong>SETTINGS:</strong> Communicates connection-level configuration parameters</li>
        <li><strong>PUSH_PROMISE:</strong> Server notifies client of intended server push</li>
        <li><strong>PING:</strong> Tests connection liveness and measures round-trip time</li>
        <li><strong>GOAWAY:</strong> Initiates graceful connection shutdown</li>
        <li><strong>WINDOW_UPDATE:</strong> Updates flow control window size</li>
      </ul>

      <h2>Stream Lifecycle and Multiplexing</h2>
      <p>
        HTTP/2 streams enable multiple concurrent request/response exchanges over 
        a single connection, dramatically improving performance:
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant Client as HTTP/2 Client
    participant Server as HTTP/2 Server
    
    Note over Client,Server: Connection Established
    
    par Stream 1: HTML Request
        Client->>+Server: HEADERS frame (Stream 1)<br/>GET / HTTP/2<br/>:authority: example.com
        Server-->>-Client: HEADERS frame (Stream 1)<br/>:status: 200<br/>content-type: text/html
        Server-->>Client: DATA frame (Stream 1)<br/>HTML content
    and Stream 3: CSS Request  
        Client->>+Server: HEADERS frame (Stream 3)<br/>GET /style.css HTTP/2
        Server-->>-Client: HEADERS frame (Stream 3)<br/>:status: 200<br/>content-type: text/css
        Server-->>Client: DATA frame (Stream 3)<br/>CSS content
    and Stream 5: JS Request
        Client->>+Server: HEADERS frame (Stream 5)<br/>GET /app.js HTTP/2
        Server-->>-Client: HEADERS frame (Stream 5)<br/>:status: 200<br/>content-type: application/javascript
        Server-->>Client: DATA frame (Stream 5)<br/>JavaScript content
    end
    
    Note over Client,Server: All streams processed concurrently
        `}
        className="my-6"
      />

      <h3>Stream States and Management</h3>
      <ul>
        <li><strong>Stream Identification:</strong> Odd numbers for client-initiated, even for server push</li>
        <li><strong>Stream States:</strong> idle → open → half-closed → closed</li>
        <li><strong>Concurrent Limits:</strong> SETTINGS_MAX_CONCURRENT_STREAMS parameter</li>
        <li><strong>Stream Dependencies:</strong> Priority-based resource ordering</li>
      </ul>

      <ExpandableSection title="🐍 ELI-Pythonista: HTTP/2 Client Implementation">
        <div className="space-y-4">
          <p>
            Building an HTTP/2 client is like orchestrating a complex symphony where 
            multiple musicians (streams) play different parts simultaneously, but 
            everything must be coordinated perfectly. This Python implementation shows 
            how to handle HTTP/2's binary framing, stream multiplexing, and header compression.
          </p>
          
          <CodeBlock
            language="python"
            code={getCodeExample("rfc9113_http2_client")}
          />
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">HTTP/2 Implementation in Python</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Binary framing:</strong> Efficient frame parsing and generation</li>
              <li>• <strong>Stream multiplexing:</strong> Concurrent request handling</li>
              <li>• <strong>HPACK compression:</strong> Header field compression/decompression</li>
              <li>• <strong>Flow control:</strong> Connection and stream-level window management</li>
              <li>• <strong>Priority handling:</strong> Stream dependency and weight management</li>
              <li>• <strong>Connection management:</strong> Settings negotiation and lifecycle</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>HPACK Header Compression</h2>
      <p>
        RFC 9113 incorporates HPACK (RFC 7541) header compression that dramatically 
        reduces the overhead of HTTP headers, which can be significant for many 
        small requests:
      </p>

      <h3>HPACK Compression Tables</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">📋 Static Table</h4>
          <p className="text-gray-800 text-sm mb-2">Pre-defined common headers (RFC 7541)</p>
          <ul className="text-gray-800 text-sm space-y-1">
            <li>• Index 1: :authority</li>
            <li>• Index 2: :method GET</li>
            <li>• Index 3: :method POST</li>
            <li>• Index 4: :path /</li>
            <li>• Index 8: :status 200</li>
            <li>• Index 15: accept-encoding gzip, deflate</li>
            <li>• 61 total static entries</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🔄 Dynamic Table</h4>
          <p className="text-blue-800 text-sm mb-2">Context-specific header cache</p>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Connection-specific entries</li>
            <li>• FIFO eviction when table full</li>
            <li>• Size controlled by SETTINGS_HEADER_TABLE_SIZE</li>
            <li>• Efficient for repeated custom headers</li>
            <li>• Example: user-agent, authorization headers</li>
          </ul>
        </div>
      </div>

      <h3>Header Compression Benefits</h3>
      <ul>
        <li><strong>Size Reduction:</strong> 80-90% reduction in header overhead</li>
        <li><strong>Mobile Optimization:</strong> Critical for bandwidth-constrained networks</li>
        <li><strong>Latency Improvement:</strong> Fewer bytes to transmit and parse</li>
        <li><strong>Battery Savings:</strong> Less radio activity on mobile devices</li>
      </ul>

      <h2>Flow Control Mechanism</h2>
      <p>
        RFC 9113 defines sophisticated flow control that prevents fast senders 
        from overwhelming slow receivers at both connection and stream levels:
      </p>

      <MermaidDiagram
        chart={`
graph TB
    subgraph "HTTP/2 Flow Control"
        CW[Connection Window<br/>65535 bytes initial]
        SW1[Stream 1 Window<br/>65535 bytes initial]
        SW3[Stream 3 Window<br/>65535 bytes initial]
        SW5[Stream 5 Window<br/>65535 bytes initial]
        
        CW --> SW1
        CW --> SW3
        CW --> SW5
    end
    
    subgraph "Window Updates"
        Data1[DATA frame sent<br/>Decrements both windows]
        Update1[WINDOW_UPDATE<br/>Increases window size]
        
        Data1 --> Update1
    end
    
    subgraph "Flow Control Rules"
        Rule1[Cannot send DATA if window = 0]
        Rule2[Both connection and stream windows checked]
        Rule3[WINDOW_UPDATE restores capacity]
        Rule4[Initial window size negotiable]
        
        Rule1 --> Rule2
        Rule2 --> Rule3
        Rule3 --> Rule4
    end
    
    style CW fill:#e3f2fd
    style SW1 fill:#e8f5e8
    style SW3 fill:#fff3e0
    style SW5 fill:#f3e5f5
        `}
        className="my-6"
      />

      <h3>Flow Control Benefits</h3>
      <ul>
        <li><strong>Memory Protection:</strong> Prevents receiver buffer overflow</li>
        <li><strong>Fair Sharing:</strong> Prevents one stream from consuming all bandwidth</li>
        <li><strong>Backpressure:</strong> Allows slow consumers to control data rate</li>
        <li><strong>Resource Management:</strong> Efficient use of connection capacity</li>
      </ul>

      <h2>Security Improvements in RFC 9113</h2>
      <p>
        The updated specification addresses security concerns discovered since 
        the original HTTP/2 deployment:
      </p>

      <div className="bg-red-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold text-red-900 mb-2">🛡️ Security Enhancements</h4>
        <ul className="text-red-800 space-y-2">
          <li><strong>Stream Limit Enforcement:</strong> Stricter limits on concurrent streams to prevent DoS</li>
          <li><strong>Header Bomb Mitigation:</strong> HPACK decompression limits to prevent memory exhaustion</li>
          <li><strong>Priority Tree Validation:</strong> Prevent priority loops and resource exhaustion</li>
          <li><strong>Settings Frame Validation:</strong> Stricter validation of connection settings</li>
          <li><strong>Connection Error Handling:</strong> Improved error propagation and connection termination</li>
        </ul>
      </div>

      <h2>Server Push Mechanism</h2>
      <p>
        HTTP/2 server push allows servers to proactively send resources to clients, 
        reducing round-trip latency for critical resources:
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant Client as HTTP/2 Client
    participant Server as HTTP/2 Server
    
    Note over Client,Server: Initial HTML Request
    
    Client->>+Server: HEADERS frame (Stream 1)<br/>GET / HTTP/2<br/>:authority: example.com
    
    Note over Server: Server decides to push CSS and JS
    
    Server->>Client: PUSH_PROMISE frame (Stream 1)<br/>Promised Stream 2: GET /style.css
    Server->>Client: PUSH_PROMISE frame (Stream 1)<br/>Promised Stream 4: GET /app.js
    
    par HTML Response
        Server-->>-Client: HEADERS frame (Stream 1)<br/>:status: 200<br/>content-type: text/html
        Server-->>Client: DATA frame (Stream 1)<br/>HTML content with CSS/JS references
    and CSS Push
        Server-->>Client: HEADERS frame (Stream 2)<br/>:status: 200<br/>content-type: text/css
        Server-->>Client: DATA frame (Stream 2)<br/>CSS content
    and JS Push
        Server-->>Client: HEADERS frame (Stream 4)<br/>:status: 200<br/>content-type: application/javascript
        Server-->>Client: DATA frame (Stream 4)<br/>JavaScript content
    end
    
    Note over Client,Server: Client has resources before parsing HTML
        `}
        className="my-6"
      />

      <h3>Server Push Benefits and Considerations</h3>
      <ul>
        <li><strong>Reduced Latency:</strong> Resources available before client requests them</li>
        <li><strong>Cache Warming:</strong> Pre-populate client cache with critical resources</li>
        <li><strong>Bandwidth Efficiency:</strong> Avoid redundant requests for predictable resources</li>
        <li><strong>Client Control:</strong> Clients can reject or prioritize pushed resources</li>
        <li><strong>Cache Awareness:</strong> Servers should consider client cache state</li>
      </ul>

      <h2>Modern Internet Impact: High-Performance Web</h2>
      <p>
        RFC 9113 enables the performance characteristics that modern web applications 
        depend on, particularly for mobile users and high-latency connections.
      </p>

      <h3>HTTP/2 Adoption and Benefits</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">📈 Performance Improvements</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>Page Load Time:</strong> 20-50% faster loading</li>
            <li>• <strong>Mobile Performance:</strong> Significant improvement on cellular</li>
            <li>• <strong>Connection Efficiency:</strong> 90% reduction in connections needed</li>
            <li>• <strong>Header Overhead:</strong> 80-90% reduction in header bytes</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🌐 Industry Adoption</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Browser Support:</strong> Universal browser adoption</li>
            <li>• <strong>CDN Support:</strong> All major CDNs support HTTP/2</li>
            <li>• <strong>Server Support:</strong> Apache, Nginx, IIS, cloud platforms</li>
            <li>• <strong>Usage Statistics:</strong> 95%+ of modern web traffic</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">📱 Mobile Optimization</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>Battery Life:</strong> Reduced radio usage extends battery</li>
            <li>• <strong>Data Usage:</strong> Header compression saves cellular data</li>
            <li>• <strong>Latency Tolerance:</strong> Multiplexing reduces round-trip impact</li>
            <li>• <strong>Connection Stability:</strong> Fewer connections, better reliability</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">🔧 Development Impact</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>Simplified Optimization:</strong> Less need for resource bundling</li>
            <li>• <strong>Better Caching:</strong> Granular resource caching strategies</li>
            <li>• <strong>Real-time Features:</strong> Foundation for server-sent events</li>
            <li>• <strong>API Performance:</strong> Efficient for API-heavy applications</li>
          </ul>
        </div>
      </div>

      <h2>HTTP/2 vs HTTP/3 Evolution</h2>
      <p>
        While RFC 9113 represents the mature HTTP/2 specification, HTTP/3 
        (RFC 9114) builds upon these concepts with QUIC transport:
      </p>

      <ExpandableSection title="📊 Protocol Evolution Comparison">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Evolution from HTTP/1.1 through HTTP/2 to HTTP/3:</strong>
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h5 className="font-semibold text-blue-900">HTTP/1.1 (RFC 9112)</h5>
              <ul className="text-sm text-blue-800">
                <li>• Text-based protocol</li>
                <li>• One request per connection</li>
                <li>• No header compression</li>
                <li>• Head-of-line blocking</li>
                <li>• TCP-based transport</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-green-900">HTTP/2 (RFC 9113)</h5>
              <ul className="text-sm text-green-800">
                <li>• Binary framing protocol</li>
                <li>• Stream multiplexing</li>
                <li>• HPACK header compression</li>
                <li>• Application-layer multiplexing</li>
                <li>• TCP-based transport</li>
                <li>• Server push capability</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-purple-900">HTTP/3 (RFC 9114)</h5>
              <ul className="text-sm text-purple-800">
                <li>• QUIC-based transport</li>
                <li>• No head-of-line blocking</li>
                <li>• Built-in encryption</li>
                <li>• 0-RTT connection setup</li>
                <li>• Connection migration</li>
                <li>• Mobile-optimized</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-600">
            <strong>Deployment Strategy:</strong> HTTP/2 remains widely deployed and 
            provides significant benefits over HTTP/1.1, while HTTP/3 offers further 
            improvements for mobile and high-latency scenarios.
          </p>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🔗 Docker Demonstration: HTTP/2 Protocol Features">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Interactive HTTP/2 protocol demonstration!</strong>
          </p>
          <p>
            The Docker example in <code>docker-examples/rfc9113-http2-protocol/</code> 
            demonstrates stream multiplexing, header compression, server push, and flow control.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc9113-http2-protocol/
docker compose up -d

# Access the HTTP/2 demo at:
# https://localhost:8443

# Monitor HTTP/2 protocol features:
# docker compose logs -f http2-server`}
          />
          <p className="mt-3 text-sm">
            Test stream multiplexing, observe HPACK compression, experiment with 
            server push, and measure performance improvements over HTTP/1.1.
          </p>
        </div>
      </ExpandableSection>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Key Takeaways for HTTP/2 Protocol
        </h3>
        <ul className="text-blue-800">
          <li>
            RFC 9113 refines the HTTP/2 binary protocol that enables dramatic 
            performance improvements through stream multiplexing and header compression
          </li>
          <li>
            Understanding binary framing, HPACK compression, and flow control is 
            essential for optimal HTTP/2 server and client implementations
          </li>
          <li>
            HTTP/2's features like server push and stream prioritization enable 
            modern web performance patterns and mobile optimization strategies
          </li>
          <li>
            The protocol serves as the foundation for 95%+ of modern web traffic 
            and provides the performance characteristics users expect from web applications
          </li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Related HTTP Standards</h3>
        <ul className="space-y-1">
          <li>
            <Link to="/rfc/9110" className="text-blue-600 hover:text-blue-800 underline">
              RFC 9110: HTTP Semantics
            </Link>
          </li>
          <li>
            <Link to="/rfc/9111" className="text-blue-600 hover:text-blue-800 underline">
              RFC 9111: HTTP Caching
            </Link>
          </li>
          <li>
            <Link to="/rfc/9112" className="text-blue-600 hover:text-blue-800 underline">
              RFC 9112: HTTP/1.1 Message Syntax
            </Link>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9113.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9113: HTTP/2 (This document)
            </a>
          </li>
          <li>
            <Link to="/rfc/9114" className="text-blue-600 hover:text-blue-800 underline">
              RFC 9114: HTTP/3
            </Link>
          </li>
          <li>
            <Link to="/rfc/7540" className="text-blue-600 hover:text-blue-800 underline">
              RFC 7540: HTTP/2 (Original specification)
            </Link>
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