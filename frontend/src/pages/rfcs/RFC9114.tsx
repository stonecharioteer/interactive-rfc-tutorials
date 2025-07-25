import { Link } from "react-router-dom";
import { ExternalLink, CheckCircle } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC9114() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 9114: HTTP/3 - June 2022
      </h1>
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
          <span className="font-semibold text-emerald-800">
            HTTP/3 over QUIC Protocol
          </span>
        </div>
        <p className="text-emerald-700 mb-0">
          RFC 9114 defines HTTP/3, the latest evolution of HTTP that runs over 
          QUIC transport protocol instead of TCP. This specification enables 
          dramatically improved performance through built-in encryption, 
          0-RTT connection establishment, connection migration, and elimination 
          of head-of-line blocking at the transport layer.
        </p>
        <p className="text-emerald-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9114.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 9114: HTTP/3 <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>HTTP/3: The QUIC Revolution</h2>
      <p>
        RFC 9114 defines HTTP/3, which represents a fundamental shift from TCP 
        to QUIC (Quick UDP Internet Connections) transport. This change eliminates 
        many performance bottlenecks inherent in TCP-based protocols while 
        maintaining HTTP semantic compatibility.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg my-4">
        <h3 className="font-semibold text-blue-900 mb-2">Related HTTP Standards</h3>
        <ul className="text-blue-800 space-y-2">
          <li><strong><Link to="/rfc/9110" className="text-blue-600 hover:text-blue-800">RFC 9110</Link>:</strong> HTTP Semantics - Protocol meaning and behavior</li>
          <li><strong><Link to="/rfc/9111" className="text-blue-600 hover:text-blue-800">RFC 9111</Link>:</strong> HTTP Caching - Performance optimization</li>
          <li><strong><Link to="/rfc/9112" className="text-blue-600 hover:text-blue-800">RFC 9112</Link>:</strong> HTTP/1.1 - Text-based legacy protocol</li>
          <li><strong><Link to="/rfc/9113" className="text-blue-600 hover:text-blue-800">RFC 9113</Link>:</strong> HTTP/2 - Binary TCP-based protocol</li>
          <li><strong><Link to="/rfc/9114" className="text-blue-600 hover:text-blue-800">RFC 9114</Link>:</strong> HTTP/3 (This document)</li>
          <li><strong>RFC 9000:</strong> QUIC Transport Protocol Foundation</li>
        </ul>
      </div>

      <ExpandableSection title="🎯 Understanding HTTP/3 and QUIC">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of HTTP/3 like upgrading from traditional mail to a modern express delivery service:</strong>
          </p>
          <p>
            <strong>HTTP/1.1 & HTTP/2 (TCP):</strong> Like using a traditional postal 
            service where mail must be sorted in order, any lost package blocks 
            the entire delivery route, and you need separate security services 
            for valuable items. Setting up delivery takes multiple verification steps.
          </p>
          <p className="mt-2">
            <strong>HTTP/3 (QUIC):</strong> Like using a modern express service 
            with multiple independent couriers, built-in security for all packages, 
            instant delivery setup, and the ability to continue deliveries even 
            if you move to a different address mid-delivery.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> Websites load faster, especially on mobile 
            networks, with better resilience to network changes and significantly 
            reduced connection establishment time.
          </p>
        </div>
      </ExpandableSection>

      <h2>Key HTTP/3 Advantages over HTTP/2</h2>
      <p>
        RFC 9114 enables revolutionary improvements by leveraging QUIC's 
        advanced transport capabilities:
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🚀 No Head-of-Line Blocking</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>Independent Streams:</strong> Packet loss affects only one stream</li>
            <li>• <strong>Parallel Processing:</strong> Multiple requests truly independent</li>
            <li>• <strong>Better Performance:</strong> No single slow request blocks others</li>
            <li>• <strong>Mobile Optimized:</strong> Excellent on lossy networks</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">⚡ 0-RTT Connection Setup</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Instant Connections:</strong> Resume connections with 0 round trips</li>
            <li>• <strong>Connection IDs:</strong> Survive NAT rebinding and IP changes</li>
            <li>• <strong>Reduced Latency:</strong> Especially beneficial for mobile users</li>
            <li>• <strong>Battery Savings:</strong> Fewer radio activations needed</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">🔒 Built-in Security</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>Always Encrypted:</strong> TLS 1.3 integrated into QUIC</li>
            <li>• <strong>No Downgrade:</strong> Cannot fallback to unencrypted</li>
            <li>• <strong>Fast Handshake:</strong> Combined transport and TLS setup</li>
            <li>• <strong>Perfect Forward Secrecy:</strong> Built-in key rotation</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibant text-orange-900 mb-3">📱 Connection Migration</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>IP Address Changes:</strong> Connections survive network switches</li>
            <li>• <strong>Mobile Seamless:</strong> WiFi to cellular transitions</li>
            <li>• <strong>Load Balancing:</strong> Server-side connection migration</li>
            <li>• <strong>NAT Rebinding:</strong> Robust to network topology changes</li>
          </ul>
        </div>
      </div>

      <h2>QUIC Transport Layer</h2>
      <p>
        HTTP/3 runs over QUIC, which provides many transport-layer improvements 
        over TCP. Understanding QUIC is essential to appreciating HTTP/3's benefits:
      </p>

      <MermaidDiagram
        chart={`
graph TB
    subgraph "HTTP/3 Protocol Stack"
        App[HTTP/3 Application Layer<br/>RFC 9114]
        QUIC[QUIC Transport Layer<br/>RFC 9000]
        UDP[UDP<br/>User Datagram Protocol]
        IP[IP Layer<br/>Internet Protocol]
        
        App --> QUIC
        QUIC --> UDP
        UDP --> IP
    end
    
    subgraph "HTTP/2 Protocol Stack (Comparison)"
        App2[HTTP/2 Application Layer<br/>RFC 9113]
        TLS[TLS 1.2/1.3<br/>Transport Layer Security]
        TCP[TCP<br/>Transmission Control Protocol]
        IP2[IP Layer<br/>Internet Protocol]
        
        App2 --> TLS
        TLS --> TCP
        TCP --> IP2
    end
    
    subgraph "QUIC Features"
        F1[Stream Multiplexing]
        F2[Built-in Encryption]
        F3[Connection Migration]
        F4[0-RTT Resumption]
        F5[Congestion Control]
        F6[Flow Control]
        
        QUIC -.-> F1
        QUIC -.-> F2
        QUIC -.-> F3
        QUIC -.-> F4
        QUIC -.-> F5
        QUIC -.-> F6
    end
    
    style App fill:#e3f2fd
    style QUIC fill:#e8f5e8
    style UDP fill:#fff3e0
    style IP fill:#f3e5f5
        `}
        className="my-6"
      />

      <h3>QUIC Connection Establishment</h3>
      <p>
        One of HTTP/3's biggest advantages is the dramatically reduced connection 
        setup time compared to HTTP/2:
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant Client as HTTP/3 Client
    participant Server as HTTP/3 Server
    
    Note over Client,Server: First Connection (1-RTT)
    
    Client->>+Server: Initial QUIC Packet<br/>TLS ClientHello + Connection Setup
    Server-->>-Client: QUIC Response<br/>TLS ServerHello + Certificates + HTTP/3 Settings
    
    Note over Client,Server: HTTP/3 requests can start immediately
    
    Client->>Server: HTTP/3 HEADERS frame<br/>GET / HTTP/3
    Server-->>Client: HTTP/3 HEADERS + DATA frames<br/>200 OK + Response body
    
    Note over Client,Server: Connection Resumption (0-RTT)
    
    Client->>Server: 0-RTT QUIC Packet<br/>Resumed connection + HTTP/3 request
    Server-->>Client: HTTP/3 Response<br/>Immediate response (no handshake)
    
    Note over Client,Server: Total time: 0 round trips for resumed connections
        `}
        className="my-6"
      />

      <h2>HTTP/3 Frame Format</h2>
      <p>
        HTTP/3 uses a simplified frame format compared to HTTP/2, optimized 
        for QUIC's stream-based transport:
      </p>

      <h3>HTTP/3 Frame Types</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">📝 Core Frame Types</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>DATA:</strong> HTTP message body (similar to HTTP/2)</li>
            <li>• <strong>HEADERS:</strong> HTTP header fields (QPACK compressed)</li>
            <li>• <strong>SETTINGS:</strong> Connection configuration parameters</li>
            <li>• <strong>PUSH_PROMISE:</strong> Server push notification</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🔧 Control Frame Types</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>CANCEL_PUSH:</strong> Cancel server push stream</li>
            <li>• <strong>GOAWAY:</strong> Graceful connection shutdown</li>
            <li>• <strong>MAX_PUSH_ID:</strong> Limit server push streams</li>
            <li>• <strong>Reserved frames:</strong> For future extensions</li>
          </ul>
        </div>
      </div>

      <h3>Stream Types in HTTP/3</h3>
      <ul>
        <li><strong>Request Streams:</strong> Bidirectional streams for HTTP request/response</li>
        <li><strong>Control Stream:</strong> Unidirectional stream for connection settings</li>
        <li><strong>Push Streams:</strong> Unidirectional streams for server push</li>
        <li><strong>QPACK Streams:</strong> Encoder/decoder streams for header compression</li>
      </ul>

      <h2>QPACK Header Compression</h2>
      <p>
        HTTP/3 uses QPACK (RFC 9204) instead of HPACK, designed to work better 
        with QUIC's out-of-order delivery characteristics:
      </p>

      <h3>QPACK vs HPACK Differences</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">📋 HPACK (HTTP/2)</h4>
          <ul className="text-gray-800 space-y-1">
            <li>• <strong>Ordered Processing:</strong> Headers must be processed in order</li>
            <li>• <strong>Single Dynamic Table:</strong> Shared compression context</li>
            <li>• <strong>Head-of-Line Blocking:</strong> Blocked by lost packets</li>
            <li>• <strong>Simple Implementation:</strong> Easier to implement</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🔄 QPACK (HTTP/3)</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Unordered Processing:</strong> Headers can arrive out of order</li>
            <li>• <strong>Reference Tracking:</strong> Dynamic table with dependencies</li>
            <li>• <strong>Stream Independence:</strong> No blocking between streams</li>
            <li>• <strong>Complexity Trade-off:</strong> More complex but better performance</li>
          </ul>
        </div>
      </div>

      <ExpandableSection title="🐍 ELI-Pythonista: HTTP/3 Client Implementation">
        <div className="space-y-4">
          <p>
            Building an HTTP/3 client is like orchestrating a modern shipping operation 
            where packages can take different routes, arrive independently, and the 
            entire system is secure by default. This Python implementation demonstrates 
            HTTP/3's QUIC-based transport and frame handling.
          </p>
          
          <CodeBlock
            language="python"
            code={getCodeExample("rfc9114_http3_client")}
          />
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">HTTP/3 Implementation in Python</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>QUIC transport:</strong> UDP-based reliable transport</li>
              <li>• <strong>Stream multiplexing:</strong> Independent stream processing</li>
              <li>• <strong>QPACK compression:</strong> Out-of-order header compression</li>
              <li>• <strong>0-RTT resumption:</strong> Instant connection reestablishment</li>
              <li>• <strong>Connection migration:</strong> IP address change handling</li>
              <li>• <strong>Built-in encryption:</strong> TLS 1.3 integration</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>Performance Benefits</h2>
      <p>
        HTTP/3 delivers measurable performance improvements, especially in 
        challenging network conditions common on mobile devices:
      </p>

      <h3>Real-World Performance Gains</h3>

      <div className="bg-green-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold text-green-900 mb-2">📊 Performance Improvements</h4>
        <ul className="text-green-800 space-y-2">
          <li><strong>Connection Setup:</strong> 0-RTT vs 2-3 RTT for HTTP/2 (50-70% faster)</li>
          <li><strong>Packet Loss Recovery:</strong> 2-5x faster recovery in lossy networks</li>
          <li><strong>Mobile Networks:</strong> 10-30% improvement in cellular conditions</li>
          <li><strong>Connection Migration:</strong> Seamless handoffs save 100-200ms</li>
          <li><strong>Head-of-Line Blocking:</strong> Eliminated at transport layer</li>
        </ul>
      </div>

      <h2>Deployment and Adoption</h2>
      <p>
        HTTP/3 deployment has accelerated rapidly, with major services and 
        CDNs providing widespread support:
      </p>

      <h3>Industry Adoption Status</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🌐 Major Services</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Google:</strong> Search, YouTube, Gmail, Drive</li>
            <li>• <strong>Facebook/Meta:</strong> Facebook, Instagram, WhatsApp Web</li>
            <li>• <strong>Cloudflare:</strong> CDN and security services</li>
            <li>• <strong>Fastly:</strong> Edge computing and CDN</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🔧 Browser Support</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>Chrome:</strong> Full support since version 87</li>
            <li>• <strong>Firefox:</strong> Enabled by default since version 88</li>
            <li>• <strong>Safari:</strong> Support since Safari 14</li>
            <li>• <strong>Edge:</strong> Support in Chromium-based versions</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">🚀 Server Support</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>Nginx:</strong> HTTP/3 support with ngx_http_v3_module</li>
            <li>• <strong>Apache:</strong> mod_http2 with HTTP/3 capabilities</li>
            <li>• <strong>LiteSpeed:</strong> Native HTTP/3 support</li>
            <li>• <strong>Caddy:</strong> Built-in HTTP/3 support</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibant text-orange-900 mb-3">📊 Usage Statistics</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>Global Adoption:</strong> 25%+ of web traffic (2024)</li>
            <li>• <strong>Mobile Usage:</strong> Higher adoption on mobile devices</li>
            <li>• <strong>CDN Support:</strong> 90%+ of major CDNs support HTTP/3</li>
            <li>• <strong>Growth Rate:</strong> Rapid adoption continuing</li>
          </ul>
        </div>
      </div>

      <h2>Security Considerations</h2>
      <p>
        HTTP/3's built-in security represents a significant improvement over 
        previous HTTP versions, with encryption mandatory and no plaintext fallback:
      </p>

      <h3>Security Advantages</h3>
      <ul>
        <li><strong>Always Encrypted:</strong> No HTTP/3 without TLS 1.3</li>
        <li><strong>0-RTT Security:</strong> Replay protection for early data</li>
        <li><strong>Connection ID Security:</strong> Prevents connection hijacking</li>
        <li><strong>Perfect Forward Secrecy:</strong> Built into QUIC key rotation</li>
        <li><strong>Ossification Prevention:</strong> Encrypted transport headers</li>
      </ul>

      <h2>Challenges and Considerations</h2>
      <p>
        While HTTP/3 offers significant benefits, deployment comes with 
        considerations for network infrastructure and application design:
      </p>

      <div className="bg-yellow-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Deployment Considerations</h4>
        <ul className="text-yellow-800 space-y-2">
          <li><strong>UDP Filtering:</strong> Some networks block or rate-limit UDP traffic</li>
          <li><strong>NAT/Firewall Issues:</strong> UDP handling varies across middleboxes</li>
          <li><strong>CPU Usage:</strong> QUIC processing can be more CPU-intensive than TCP</li>
          <li><strong>Library Maturity:</strong> HTTP/3 libraries still evolving</li>
          <li><strong>Debugging Complexity:</strong> New protocol requires new tooling</li>
        </ul>
      </div>

      <h2>Future of HTTP/3</h2>
      <p>
        HTTP/3 represents the current state-of-the-art for web protocols, with 
        ongoing development focused on performance optimization and new features:
      </p>

      <h3>Ongoing Developments</h3>
      <ul>
        <li><strong>QUIC Extensions:</strong> Multipath, unreliable datagrams, load balancing</li>
        <li><strong>HTTP/3 Extensions:</strong> WebTransport, extended CONNECT methods</li>
        <li><strong>Performance Optimization:</strong> Better congestion control, loss recovery</li>
        <li><strong>Deployment Tools:</strong> Better debugging, monitoring, and analysis tools</li>
      </ul>

      <ExpandableSection title="📊 HTTP Protocol Evolution Summary">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Complete evolution of HTTP protocols:</strong>
          </p>
          
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-blue-900">HTTP/1.1 (RFC 9112) - Legacy Foundation</h5>
              <ul className="text-sm text-blue-800">
                <li>• Text-based, one request per connection, simple but inefficient</li>
                <li>• Still widely used for simple applications and legacy systems</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-green-900">HTTP/2 (RFC 9113) - Binary Efficiency</h5>
              <ul className="text-sm text-green-800">
                <li>• Binary framing, stream multiplexing, header compression</li>
                <li>• Dominant protocol for modern web applications (95%+ usage)</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-purple-900">HTTP/3 (RFC 9114) - QUIC Revolution</h5>
              <ul className="text-sm text-purple-800">
                <li>• QUIC transport, 0-RTT connections, no head-of-line blocking</li>
                <li>• Fastest growing adoption, especially for mobile and high-performance applications</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-600">
            <strong>Deployment Strategy:</strong> Most applications benefit from supporting 
            HTTP/3 with HTTP/2 fallback, while maintaining HTTP/1.1 for legacy compatibility.
          </p>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🔗 Docker Demonstration: HTTP/3 Protocol">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Interactive HTTP/3 demonstration!</strong>
          </p>
          <p>
            The Docker example in <code>docker-examples/rfc9114-http3-quic/</code> 
            demonstrates QUIC transport, 0-RTT connections, and performance benefits.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc9114-http3-quic/
docker compose up -d

# Access the HTTP/3 demo at:
# https://localhost:8443

# Monitor HTTP/3 protocol features:
# docker compose logs -f http3-server`}
          />
          <p className="mt-3 text-sm">
            Test QUIC connection establishment, observe 0-RTT resumption, 
            experiment with connection migration, and compare performance with HTTP/2.
          </p>
        </div>
      </ExpandableSection>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Key Takeaways for HTTP/3
        </h3>
        <ul className="text-blue-800">
          <li>
            RFC 9114 defines HTTP/3 over QUIC, eliminating head-of-line blocking 
            and enabling 0-RTT connections for dramatically improved performance
          </li>
          <li>
            Understanding QUIC transport, connection migration, and built-in encryption 
            is essential for leveraging HTTP/3's full potential
          </li>
          <li>
            HTTP/3 provides the best performance for mobile users and high-latency 
            networks, making it ideal for global web applications
          </li>
          <li>
            The protocol represents the future of web communication, with rapidly 
            growing adoption across major services and CDN providers worldwide
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
            <Link to="/rfc/9113" className="text-blue-600 hover:text-blue-800 underline">
              RFC 9113: HTTP/2 (Updated)
            </Link>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9114.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9114: HTTP/3 (This document)
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9000.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9000: QUIC Transport Protocol
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