import { Link } from "react-router-dom";
import { ExternalLink, Zap } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import GlossaryTerm from "../../components/GlossaryTerm";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC7540() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 7540: HTTP/2 - May 2015</h1>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <Zap className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-semibold text-blue-800">
            Modern Web Performance Revolution
          </span>
        </div>
        <p className="text-blue-700 mb-0">
          RFC 7540 defines HTTP/2, the first major revision of HTTP in over 15
          years. This binary protocol revolutionized web performance through
          stream multiplexing, header compression, and server push, powering the
          modern web experiences we rely on daily across billions of devices and
          connections.
        </p>
        <p className="text-blue-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc7540.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 7540 PDF <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>The HTTP Performance Problem</h2>
      <p>
        By 2012, the web had evolved far beyond the simple document retrieval
        system that{" "}
        <Link to="/rfc/1945" className="text-blue-600 hover:text-blue-800">
          HTTP/1.0
        </Link>{" "}
        and{" "}
        <Link to="/rfc/2068" className="text-blue-600 hover:text-blue-800">
          HTTP/1.1
        </Link>{" "}
        were designed for. Modern web applications required hundreds of
        resources per page, leading to severe performance bottlenecks due to
        HTTP/1.1's fundamental limitations.
      </p>

      <div className="bg-red-50 p-4 rounded-lg my-4">
        <h3 className="font-semibold text-red-900 mb-2">
          HTTP/1.1 Performance Limitations
        </h3>
        <ul className="text-red-800">
          <li>
            <strong>Head-of-Line Blocking:</strong> Only one request per
            connection at a time
          </li>
          <li>
            <strong>Connection Limits:</strong> Browsers limited to 6-8
            connections per domain
          </li>
          <li>
            <strong>Header Overhead:</strong> Repetitive headers sent with every
            request
          </li>
          <li>
            <strong>Resource Prioritization:</strong> No mechanism to prioritize
            critical resources
          </li>
          <li>
            <strong>Server Limitations:</strong> No way for servers to
            proactively push resources
          </li>
        </ul>
      </div>

      <ExpandableSection title="🎯 The Restaurant Analogy">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>
              Imagine HTTP/1.1 as a restaurant with serious efficiency problems:
            </strong>
          </p>
          <p>
            <strong>HTTP/1.1 Restaurant:</strong> You can only order one dish at
            a time. Want an appetizer, main course, and dessert? You have to
            wait for each one to be completely prepared and served before
            ordering the next. Even if the kitchen could handle multiple orders,
            you're stuck waiting in line.
          </p>
          <p className="mt-2">
            <strong>HTTP/2 Restaurant:</strong> You can order everything at
            once! The kitchen works on all your dishes simultaneously and brings
            them out as they're ready. Plus, the waiter can recommend and bring
            complementary items (server push) without you asking.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> Instead of waiting 30 minutes for three
            courses served sequentially, you get everything in 10 minutes with
            items arriving in optimal order. That's the HTTP/2 performance
            difference.
          </p>
        </div>
      </ExpandableSection>

      <h2>HTTP/2 Core Innovations</h2>
      <p>
        RFC 7540 introduced revolutionary changes while maintaining complete
        compatibility with HTTP/1.1 semantics. The key insight was to solve
        transport-layer problems without changing the application layer.
      </p>

      <h3>1. Binary Framing Protocol</h3>
      <p>
        HTTP/2 replaced HTTP/1.1's text-based protocol with an efficient binary
        framing layer. This eliminated parsing ambiguities, reduced overhead,
        and enabled advanced features impossible with text protocols.
      </p>

      <MermaidDiagram
        chart={`
graph TB
    subgraph "HTTP/1.1 Text Protocol"
        HTTP1[GET /api/data HTTP/1.1<br/>Host: example.com<br/>User-Agent: Browser<br/>Accept: application/json<br/><br/>]
        HTTP1_RESP[HTTP/1.1 200 OK<br/>Content-Type: application/json<br/>Content-Length: 1024<br/><br/>{"data": "..."}]
    end

    subgraph "HTTP/2 Binary Framing"
        FRAME1[HEADERS Frame<br/>Stream ID: 1<br/>:method: GET<br/>:path: /api/data<br/>:authority: example.com]
        FRAME2[DATA Frame<br/>Stream ID: 1<br/>Payload: {"data": "..."}]
        FRAME3[HEADERS Frame<br/>Stream ID: 3<br/>:method: GET<br/>:path: /api/users]
        FRAME4[DATA Frame<br/>Stream ID: 3<br/>Payload: [{"user": "..."}]]
    end

    HTTP1 -.->|"Parsing Required<br/>Sequential"| HTTP1_RESP
    FRAME1 -->|"Binary Parsing<br/>Concurrent"| FRAME2
    FRAME3 -->|"Different Stream<br/>Parallel"| FRAME4

    style HTTP1 fill:#ffebee
    style HTTP1_RESP fill:#ffebee
    style FRAME1 fill:#e3f2fd
    style FRAME2 fill:#e3f2fd
    style FRAME3 fill:#e8f5e8
    style FRAME4 fill:#e8f5e8
        `}
        className="my-6"
      />

      <h3>2. Stream Multiplexing</h3>
      <p>
        The most transformative feature of HTTP/2 is{" "}
        <GlossaryTerm>stream multiplexing</GlossaryTerm> - the ability to send
        multiple requests and responses concurrently over a single connection.
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant Client as Browser
    participant Server as HTTP/2 Server

    Note over Client,Server: Single TCP Connection - Multiple Concurrent Streams

    par Stream 1: HTML Page
        Client->>+Server: HEADERS (Stream 1)<br/>GET /index.html
        Server-->>-Client: HEADERS + DATA (Stream 1)<br/>HTML Content
    and Stream 3: CSS File
        Client->>+Server: HEADERS (Stream 3)<br/>GET /styles.css
        Server-->>-Client: HEADERS + DATA (Stream 3)<br/>CSS Content
    and Stream 5: JavaScript
        Client->>+Server: HEADERS (Stream 5)<br/>GET /app.js
        Server-->>-Client: HEADERS + DATA (Stream 5)<br/>JS Content
    and Stream 7: API Data
        Client->>+Server: HEADERS (Stream 7)<br/>GET /api/data
        Server-->>-Client: HEADERS + DATA (Stream 7)<br/>JSON Data
    end

    Note over Client,Server: All resources load simultaneously!<br/>No head-of-line blocking
        `}
        className="my-6"
      />

      <h3>3. Header Compression (HPACK)</h3>
      <p>
        RFC 7540 mandates <GlossaryTerm>HPACK</GlossaryTerm> compression for
        HTTP headers, dramatically reducing overhead. Modern web pages send
        thousands of headers, making compression essential for performance.
      </p>

      <ExpandableSection title="📊 Header Compression Impact">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Typical web page header analysis (100 resources):</strong>
          </p>
          <ul>
            <li>
              <strong>HTTP/1.1 Headers:</strong> ~8KB per request × 100 = 800KB
            </li>
            <li>
              <strong>HTTP/2 HPACK:</strong> ~1KB average after compression =
              100KB
            </li>
            <li>
              <strong>Savings:</strong> 87% reduction in header overhead
            </li>
          </ul>
          <p className="mt-3">
            <strong>Real Impact:</strong> On mobile networks (slow upload), this
            header compression alone can reduce page load times by 1-2 seconds.
          </p>
        </div>
      </ExpandableSection>

      <h3>4. Stream Prioritization</h3>
      <p>
        HTTP/2 includes a sophisticated stream priority system that allows
        clients to specify the relative importance of resources, enabling
        optimal loading sequences.
      </p>

      <h3>5. Server Push</h3>
      <p>
        <GlossaryTerm>Server Push</GlossaryTerm> allows servers to proactively
        send resources to clients before they're requested, eliminating
        round-trip delays for critical resources.
      </p>

      <ExpandableSection title="📚 Code Example: HTTP/2 Client Implementation">
        <CodeBlock
          language="python"
          code={getCodeExample("rfc7540_http2_client")}
          title="rfc7540_http2_client.py"
        />
      </ExpandableSection>

      <h2>Frame Types and Protocol Mechanics</h2>
      <p>
        RFC 7540 defines several frame types that enable HTTP/2's advanced
        features:
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">
            🔧 Control Frames
          </h4>
          <ul className="text-blue-800 space-y-1">
            <li>
              • <strong>HEADERS:</strong> Request/response headers and metadata
            </li>
            <li>
              • <strong>SETTINGS:</strong> Connection configuration parameters
            </li>
            <li>
              • <strong>WINDOW_UPDATE:</strong> Flow control management
            </li>
            <li>
              • <strong>PING:</strong> Connection liveness and RTT measurement
            </li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">📦 Data Frames</h4>
          <ul className="text-green-800 space-y-1">
            <li>
              • <strong>DATA:</strong> Request/response payload content
            </li>
            <li>
              • <strong>PUSH_PROMISE:</strong> Server push resource
              announcements
            </li>
            <li>
              • <strong>PRIORITY:</strong> Stream dependency and weight updates
            </li>
            <li>
              • <strong>RST_STREAM:</strong> Stream termination and error
              handling
            </li>
          </ul>
        </div>
      </div>

      <h2>Flow Control and Connection Management</h2>
      <p>
        HTTP/2 implements sophisticated flow control mechanisms to prevent fast
        senders from overwhelming slow receivers, ensuring optimal performance
        across diverse network conditions.
      </p>

      <h3>Connection-Level Flow Control</h3>
      <p>
        Controls the overall rate of data transmission across the entire
        connection, preventing any single stream from monopolizing bandwidth.
      </p>

      <h3>Stream-Level Flow Control</h3>
      <p>
        Provides fine-grained control over individual streams, allowing
        receivers to pause specific streams without affecting others.
      </p>

      <ExpandableSection title="🔧 Flow Control Like Traffic Management">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>
              Think of HTTP/2 flow control like smart traffic management:
            </strong>
          </p>
          <p>
            <strong>Connection-Level:</strong> Like controlling the total number
            of cars allowed on a highway. If the highway is congested, you
            reduce the overall traffic flow to prevent gridlock.
          </p>
          <p className="mt-2">
            <strong>Stream-Level:</strong> Like having individual lane controls.
            If one lane (stream) has an accident, you can slow or stop just that
            lane while keeping others moving normally.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> No single slow download can block other
            resources, and the overall connection stays efficient even when some
            streams are having problems.
          </p>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🐍 ELI-Pythonista: HTTP/2 in Python's Async Ecosystem">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>
              HTTP/2 transformed Python web development by enabling true
              concurrent requests with asyncio:
            </strong>
          </p>

          <h4 className="font-semibold text-green-900 mb-2">
            Why Python Developers Love HTTP/2
          </h4>
          <p className="mb-3">
            Before HTTP/2, Python's <code>requests</code> library was stuck with
            HTTP/1.1's "one request at a time" limitation. Even with threading,
            you hit connection pool bottlenecks. HTTP/2 + asyncio changed
            everything:
          </p>

          <div className="bg-white p-3 rounded border-l-4 border-green-500 mb-4">
            <h5 className="font-semibold mb-2">
              HTTP/1.1 with requests (blocking):
            </h5>
            <pre className="text-sm text-gray-700">
              {`import requests
import time

# Sequential requests - slow!
start = time.time()
responses = []
for url in urls:
    responses.append(requests.get(url))
print(f"Time: {time.time() - start:.2f}s")  # ~6 seconds`}
            </pre>
          </div>

          <div className="bg-white p-3 rounded border-l-4 border-green-500 mb-4">
            <h5 className="font-semibold mb-2">
              HTTP/2 with httpx + asyncio (concurrent):
            </h5>
            <pre className="text-sm text-gray-700">
              {`import httpx
import asyncio

async def fetch_all():
    async with httpx.AsyncClient(http2=True) as client:
        # All requests sent simultaneously!
        tasks = [client.get(url) for url in urls]
        return await asyncio.gather(*tasks)

responses = asyncio.run(fetch_all())  # ~1.5 seconds`}
            </pre>
          </div>

          <h4 className="font-semibold text-green-900 mb-2">
            Python HTTP/2 Libraries Comparison
          </h4>
          <ul className="text-green-800 space-y-2 mb-4">
            <li>
              • <strong>httpx:</strong> Modern requests replacement with HTTP/2
              + async support
            </li>
            <li>
              • <strong>aiohttp:</strong> Full async web framework with HTTP/2
              client/server
            </li>
            <li>
              • <strong>h2:</strong> Pure Python HTTP/2 protocol implementation
              for custom solutions
            </li>
            <li>
              • <strong>hypercorn:</strong> ASGI server with native HTTP/2
              support
            </li>
          </ul>

          <h4 className="font-semibold text-green-900 mb-2">
            The asyncio Connection
          </h4>
          <p className="mb-3">
            HTTP/2's stream multiplexing is a perfect match for Python's asyncio
            model. Each HTTP/2 stream maps to an asyncio task, allowing
            thousands of concurrent requests over a single connection without
            threading overhead.
          </p>

          <div className="bg-white p-3 rounded border-l-4 border-green-500">
            <h5 className="font-semibold mb-2">
              Real-world Python HTTP/2 pattern:
            </h5>
            <pre className="text-sm text-gray-700">
              {`async def scrape_api_endpoints():
    endpoints = [f"/api/user/{i}" for i in range(1000)]

    async with httpx.AsyncClient(
        http2=True,
        limits=httpx.Limits(max_connections=1)  # Single HTTP/2 connection!
    ) as client:
        # 1000 requests over 1 connection via stream multiplexing
        tasks = [client.get(f"https://api.example.com{endpoint}")
                for endpoint in endpoints]

        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [r.json() for r in results if not isinstance(r, Exception)]`}
            </pre>
          </div>

          <p className="mt-3 text-sm text-green-700">
            <strong>🚀 Python Takeaway:</strong> HTTP/2 makes Python web
            scraping, API consumption, and microservice communication
            dramatically faster by eliminating connection overhead and
            leveraging asyncio's concurrency model.
          </p>
        </div>
      </ExpandableSection>

      <h2>Modern Internet Impact: The Web Performance Revolution</h2>
      <p>
        RFC 7540 fundamentally transformed web performance, enabling the rich,
        responsive web applications we use today across billions of devices.
      </p>

      <h3>Adoption and Performance Statistics</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">
            📈 Global Adoption
          </h4>
          <ul className="text-blue-800 space-y-1">
            <li>
              • <strong>95%+ of web traffic</strong> uses HTTP/2 (2023)
            </li>
            <li>
              • <strong>All major browsers</strong> support HTTP/2
            </li>
            <li>
              • <strong>85% of top websites</strong> serve over HTTP/2
            </li>
            <li>
              • <strong>CDN networks</strong> universally support HTTP/2
            </li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibant text-green-900 mb-3">
            ⚡ Performance Gains
          </h4>
          <ul className="text-green-800 space-y-1">
            <li>
              • <strong>20-50% faster</strong> page load times
            </li>
            <li>
              • <strong>87% reduction</strong> in header overhead
            </li>
            <li>
              • <strong>Single connection</strong> eliminates connection
              overhead
            </li>
            <li>
              • <strong>Mobile performance</strong> dramatically improved
            </li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">
            🏢 Enterprise Benefits
          </h4>
          <ul className="text-purple-800 space-y-1">
            <li>
              • <strong>Reduced server costs</strong> through connection
              efficiency
            </li>
            <li>
              • <strong>Better user experience</strong> drives higher engagement
            </li>
            <li>
              • <strong>SEO advantages</strong> from faster page speeds
            </li>
            <li>
              • <strong>Mobile optimization</strong> critical for global reach
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">
            🌐 Technology Integration
          </h4>
          <ul className="text-orange-800 space-y-1">
            <li>
              • <strong>CDN optimization:</strong> Akamai, Cloudflare, AWS
              CloudFront
            </li>
            <li>
              • <strong>Server implementations:</strong> nginx, Apache, IIS
            </li>
            <li>
              • <strong>Framework support:</strong> Node.js, Django, Rails
            </li>
            <li>
              • <strong>Monitoring tools:</strong> Built into browser dev tools
            </li>
          </ul>
        </div>
      </div>

      <h3>Current Applications Powered by HTTP/2</h3>

      <h4>1. Content Delivery Networks</h4>
      <ul>
        <li>
          <strong>Cloudflare:</strong> Automatic HTTP/2 optimization for
          millions of websites
        </li>
        <li>
          <strong>AWS CloudFront:</strong> Global HTTP/2 distribution with
          server push
        </li>
        <li>
          <strong>Google Cloud CDN:</strong> HTTP/2 with intelligent caching
        </li>
        <li>
          <strong>Azure CDN:</strong> Enterprise HTTP/2 acceleration
        </li>
      </ul>

      <h4>2. Major Web Platforms</h4>
      <ul>
        <li>
          <strong>Google Search:</strong> Sub-second search results via HTTP/2
          optimization
        </li>
        <li>
          <strong>Facebook/Meta:</strong> Social media feeds and real-time
          updates
        </li>
        <li>
          <strong>Netflix:</strong> Video streaming metadata and interface
          optimization
        </li>
        <li>
          <strong>Amazon:</strong> E-commerce performance and conversion
          optimization
        </li>
      </ul>

      <h4>3. Enterprise Applications</h4>
      <ul>
        <li>
          <strong>Office 365:</strong> Collaborative document editing
          performance
        </li>
        <li>
          <strong>Salesforce:</strong> CRM application responsiveness
        </li>
        <li>
          <strong>Slack:</strong> Real-time messaging and file sharing
        </li>
        <li>
          <strong>Zoom:</strong> Web interface optimization for video
          conferencing
        </li>
      </ul>

      <ExpandableSection title="📚 Code Example: HTTP/2 Server Push Implementation">
        <CodeBlock
          language="python"
          code={getCodeExample("rfc7540_server_push")}
          title="rfc7540_server_push.py"
        />
      </ExpandableSection>

      <h2>Implementation Challenges and Solutions</h2>
      <p>
        While HTTP/2 delivered significant performance improvements, real-world
        deployment revealed several challenges that required careful solutions:
      </p>

      <h3>1. Server Push Complexity</h3>
      <p>
        Server push proved difficult to implement effectively. Pushing
        unnecessary resources could waste bandwidth, while the complexity of
        determining what to push led to many implementations disabling it
        entirely.
      </p>

      <h3>2. Head-of-Line Blocking at TCP Level</h3>
      <p>
        While HTTP/2 eliminated application-layer head-of-line blocking,
        TCP-level packet loss still affected all streams on a connection. This
        limitation led to the development of HTTP/3 with QUIC.
      </p>

      <h3>3. Connection Coalescing Issues</h3>
      <p>
        HTTP/2's single connection model required careful implementation to
        handle connection sharing across different domains and security
        contexts.
      </p>

      <h3>4. Prioritization Implementation Variations</h3>
      <p>
        Different server implementations of stream prioritization led to
        inconsistent performance characteristics across different hosting
        platforms.
      </p>

      <h2>Evolution to HTTP/3 and Modern Standards</h2>
      <p>
        RFC 7540 paved the way for further web performance innovations, directly
        influencing the development of HTTP/3 and modern web standards:
      </p>

      <h3>1. HTTP/3 and QUIC Integration</h3>
      <p>
        Lessons from HTTP/2 deployment informed HTTP/3's design, addressing
        TCP-level head-of-line blocking with UDP-based QUIC transport.
      </p>

      <h3>2. Modern Web API Integration</h3>
      <p>
        HTTP/2 capabilities enabled new web APIs like Server-Sent Events,
        WebSockets over HTTP/2, and enhanced Progressive Web App functionality.
      </p>

      <h3>3. Performance Monitoring Evolution</h3>
      <p>
        Browser developer tools evolved to provide detailed HTTP/2 stream
        analysis, connection waterfall views, and server push visualization.
      </p>

      <h3>4. Security Enhancements</h3>
      <p>
        HTTP/2's binary protocol enabled enhanced security features and better
        integration with TLS, contributing to the HTTPS-everywhere movement.
      </p>

      <ExpandableSection title="📊 Performance Comparison: HTTP/1.1 vs HTTP/2">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>
              Typical e-commerce website (100 resources, mobile 3G network):
            </strong>
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-red-900">
                HTTP/1.1 Performance
              </h5>
              <ul className="text-sm text-red-800">
                <li>• 6 parallel connections</li>
                <li>• ~16 request rounds (100/6)</li>
                <li>• 800KB header overhead</li>
                <li>• Load time: 8.5 seconds</li>
                <li>• Time to interactive: 12 seconds</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-green-900">
                HTTP/2 Performance
              </h5>
              <ul className="text-sm text-green-800">
                <li>• 1 multiplexed connection</li>
                <li>• All requests concurrent</li>
                <li>• 100KB header overhead (HPACK)</li>
                <li>• Load time: 4.2 seconds</li>
                <li>• Time to interactive: 6 seconds</li>
              </ul>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            <strong>Result:</strong> 50% faster load time, 50% less network
            overhead, significantly better user experience especially on mobile
            networks.
          </p>
        </div>
      </ExpandableSection>

      <h2>Best Practices and Optimization Strategies</h2>
      <p>
        Effective HTTP/2 deployment requires understanding its unique
        characteristics and optimizing accordingly:
      </p>

      <h3>1. Resource Bundling Strategies</h3>
      <ul>
        <li>
          <strong>Reduced Bundling:</strong> HTTP/2's multiplexing reduces the
          need for aggressive bundling
        </li>
        <li>
          <strong>Granular Caching:</strong> Smaller resources enable better
          cache efficiency
        </li>
        <li>
          <strong>Critical Resource Priority:</strong> Prioritize above-the-fold
          content
        </li>
      </ul>

      <h3>2. Server Configuration</h3>
      <ul>
        <li>
          <strong>Connection Limits:</strong> Optimize max concurrent streams
        </li>
        <li>
          <strong>Flow Control:</strong> Tune window size for target network
          conditions
        </li>
        <li>
          <strong>HPACK Table Size:</strong> Balance compression efficiency with
          memory usage
        </li>
      </ul>

      <h3>3. Application Design</h3>
      <ul>
        <li>
          <strong>API Granularity:</strong> Design APIs to leverage concurrent
          requests
        </li>
        <li>
          <strong>Resource Inlining:</strong> Reduce critical resource
          dependencies
        </li>
        <li>
          <strong>Progressive Enhancement:</strong> Optimize for HTTP/2 while
          maintaining HTTP/1.1 compatibility
        </li>
      </ul>

      <ExpandableSection title="🔗 Docker Demonstration: HTTP/2 Performance Comparison">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>
              Interactive HTTP/2 vs HTTP/1.1 performance demonstration!
            </strong>
          </p>
          <p>
            The Docker example in{" "}
            <code>docker-examples/rfc7540-http2-performance/</code>
            provides side-by-side comparison of HTTP/1.1 and HTTP/2 serving
            identical content.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc7540-http2-performance/
docker compose up -d

# Access performance comparison at:
# http://localhost:8080 (HTTP/1.1)
# https://localhost:8443 (HTTP/2)

# Monitor performance metrics:
# docker compose logs -f performance-monitor`}
          />
          <p className="mt-3 text-sm">
            The demonstration includes real-time performance monitoring, network
            waterfall analysis, and configurable resource loading scenarios.
          </p>
        </div>
      </ExpandableSection>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Key Takeaways for Modern Web Understanding
        </h3>
        <ul className="text-blue-800">
          <li>
            RFC 7540 revolutionized web performance through binary framing,
            multiplexing, and header compression
          </li>
          <li>
            HTTP/2 enabled the responsive, resource-rich web applications we use
            daily across billions of devices
          </li>
          <li>
            Understanding multiplexing and flow control is essential for
            optimizing modern web applications
          </li>
          <li>
            HTTP/2's design principles directly influenced HTTP/3, QUIC, and the
            evolution toward real-time web experiences
          </li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Learn More</h3>
        <ul className="space-y-1">
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc7540.html"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 7540: Hypertext Transfer Protocol Version 2 (HTTP/2)
            </a>
          </li>
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc7541.html"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 7541: HPACK - Header Compression for HTTP/2
            </a>
          </li>
          <li>
            <Link
              to="/rfc/1945"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              RFC 1945: HTTP/1.0 (Historical Foundation)
            </Link>
          </li>
          <li>
            <Link
              to="/rfc/2068"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              RFC 2068: HTTP/1.1 First Version
            </Link>
          </li>
          <li>
            <a
              href="https://tools.ietf.org/html/rfc9114"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 9114: HTTP/3 (Next Evolution)
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
