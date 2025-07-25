import { Link } from "react-router-dom";
import { ExternalLink, CheckCircle } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC9110() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 9110-9114: HTTP Semantics Internet Standard - June 2022
      </h1>
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
          <span className="font-semibold text-emerald-800">
            Modern Web Standards Consolidation
          </span>
        </div>
        <p className="text-emerald-700 mb-0">
          RFC 9110-9114 represents the current definitive HTTP standard, consolidating 
          decades of web evolution into a coherent specification. This series replaces 
          RFC 2616 and clarifies HTTP semantics, caching, authentication, and conditional 
          requests, providing the foundation for all modern web applications, APIs, 
          and internet services used by billions of people daily.
        </p>
        <p className="text-emerald-600 text-sm mt-2">
          <strong>Read the originals:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9110.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 9110 <ExternalLink className="inline h-3 w-3" />
          </a>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9111.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 9111 <ExternalLink className="inline h-3 w-3" />
          </a>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9112.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 9112 <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>The HTTP Standards Evolution</h2>
      <p>
        The RFC 9110-9114 series represents the culmination of HTTP's evolution 
        from <Link to="/rfc/1945" className="text-blue-600 hover:text-blue-800">HTTP/1.0</Link> through{" "}
        <Link to="/rfc/2068" className="text-blue-600 hover:text-blue-800">HTTP/1.1</Link> and{" "}
        <Link to="/rfc/7540" className="text-blue-600 hover:text-blue-800">HTTP/2</Link>. 
        This comprehensive update addresses 25 years of real-world web usage, 
        security discoveries, and implementation experiences.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg my-4">
        <h3 className="font-semibold text-blue-900 mb-2">RFC 9110-9114 Series Overview</h3>
        <ul className="text-blue-800 space-y-2">
          <li><strong>RFC 9110:</strong> HTTP Semantics - Core protocol mechanics and methods</li>
          <li><strong>RFC 9111:</strong> HTTP Caching - Comprehensive caching behaviors</li>
          <li><strong>RFC 9112:</strong> HTTP/1.1 - Message syntax and connection management</li>
          <li><strong>RFC 9113:</strong> HTTP/2 - Binary framing and multiplexing (updates 7540)</li>
          <li><strong>RFC 9114:</strong> HTTP/3 - QUIC-based transport for modern web</li>
        </ul>
      </div>

      <ExpandableSection title="🎯 Understanding The Standards Consolidation">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of RFC 9110-9114 like a comprehensive legal code revision:</strong>
          </p>
          <p>
            <strong>Before (RFC 2616):</strong> Like having one massive law book 
            from 1999 that tried to cover everything but had become outdated and 
            confusing with 20+ years of court decisions and amendments scattered 
            across hundreds of documents.
          </p>
          <p className="mt-2">
            <strong>After (RFC 9110-9114):</strong> Like having a modern, 
            well-organized legal code with separate volumes for different areas 
            (semantics, caching, transport), incorporating all the precedents 
            and clarifications that have developed over decades.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> Web developers, browser makers, and 
            server implementers now have clear, unambiguous specifications 
            that reflect how HTTP actually works in the modern internet.
          </p>
        </div>
      </ExpandableSection>

      <h2>RFC 9110: HTTP Semantics - Core Protocol</h2>
      <p>
        RFC 9110 defines the fundamental semantics of HTTP, including methods, 
        status codes, headers, and the overall request/response model that 
        powers all web communication.
      </p>

      <h3>Enhanced Method Definitions</h3>
      <p>
        The specification provides precise definitions for HTTP methods with 
        clear semantics about idempotency, safety, and cacheability:
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🛡️ Safe Methods</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>GET:</strong> Retrieve resource representation</li>
            <li>• <strong>HEAD:</strong> Retrieve metadata only</li>
            <li>• <strong>OPTIONS:</strong> Retrieve communication options</li>
            <li>• <strong>TRACE:</strong> Diagnostic path tracing</li>
          </ul>
          <p className="text-sm text-green-700 mt-2">
            Safe methods MUST NOT cause side effects on the server
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">⚡ Idempotent Methods</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>PUT:</strong> Replace entire resource</li>
            <li>• <strong>DELETE:</strong> Remove resource</li>
            <li>• <strong>GET, HEAD, OPTIONS, TRACE:</strong> (also safe)</li>
          </ul>
          <p className="text-sm text-orange-700 mt-2">
            Multiple identical requests have same effect as single request
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-3">🔄 Non-Idempotent Methods</h4>
          <ul className="text-red-800 space-y-1">
            <li>• <strong>POST:</strong> Process data, create resources</li>
            <li>• <strong>PATCH:</strong> Partial resource modification</li>
          </ul>
          <p className="text-sm text-red-700 mt-2">
            Each request may have different effects
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">🔗 CONNECT Method</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>CONNECT:</strong> Establish tunnel to server</li>
            <li>• Used for HTTPS proxying</li>
            <li>• WebSocket upgrades</li>
            <li>• HTTP/2 and HTTP/3 tunneling</li>
          </ul>
        </div>
      </div>

      <h3>Comprehensive Status Code Clarification</h3>
      <p>
        RFC 9110 provides definitive semantics for HTTP status codes, 
        resolving ambiguities that have existed for decades:
      </p>

      <MermaidDiagram
        chart={`
graph TB
    subgraph "1xx Informational"
        I100[100 Continue<br/>Continue sending request body]
        I101[101 Switching Protocols<br/>Protocol upgrade successful]
        I102[102 Processing<br/>Request being processed]
    end
    
    subgraph "2xx Success" 
        S200[200 OK<br/>Request successful]
        S201[201 Created<br/>Resource created]
        S202[202 Accepted<br/>Request accepted for processing]
        S204[204 No Content<br/>Success, no response body]
    end
    
    subgraph "3xx Redirection"
        R301[301 Moved Permanently<br/>Resource permanently moved]
        R302[302 Found<br/>Resource temporarily at different URI]
        R304[304 Not Modified<br/>Cached version still valid]
        R307[307 Temporary Redirect<br/>Method must not change]
    end
    
    subgraph "4xx Client Error"
        C400[400 Bad Request<br/>Malformed request syntax]
        C401[401 Unauthorized<br/>Authentication required]
        C403[403 Forbidden<br/>Access denied]
        C404[404 Not Found<br/>Resource does not exist]
        C429[429 Too Many Requests<br/>Rate limit exceeded]
    end
    
    subgraph "5xx Server Error"
        E500[500 Internal Server Error<br/>Server encountered error]
        E502[502 Bad Gateway<br/>Invalid response from upstream]
        E503[503 Service Unavailable<br/>Server temporarily unavailable]
        E504[504 Gateway Timeout<br/>Upstream server timeout]
    end
    
    style I100 fill:#e3f2fd
    style S200 fill:#e8f5e8
    style R301 fill:#fff3e0
    style C404 fill:#ffebee
    style E500 fill:#fce4ec
        `}
        className="my-6"
      />

      <ExpandableSection title="🐍 ELI-Pythonista: Modern HTTP Client Implementation">
        <div className="space-y-4">
          <p>
            HTTP clients are like smart assistants that handle all the complex networking details
            for you. Think of this Python HTTP client as a professional courier service that knows
            exactly how to deliver your messages, handle caching, retry failures, and follow all
            the proper protocols.
          </p>
          
          <CodeBlock
            language="python"
            code={getCodeExample("rfc9110_http_client")}
          />
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">Key Python Concepts Demonstrated</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Async/await:</strong> Non-blocking HTTP requests for better performance</li>
              <li>• <strong>aiohttp:</strong> Modern async HTTP client library</li>
              <li>• <strong>Dataclasses:</strong> Clean data structures for HTTP responses and cache entries</li>
              <li>• <strong>Context managers:</strong> Proper resource management with async with</li>
              <li>• <strong>HTTP method semantics:</strong> Safe, idempotent, and non-idempotent methods</li>
              <li>• <strong>Caching strategies:</strong> RFC 9111 compliant cache implementation</li>
              <li>• <strong>Error handling:</strong> Comprehensive status code and exception handling</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>RFC 9111: HTTP Caching - Performance Optimization</h2>
      <p>
        RFC 9111 completely overhauls HTTP caching specifications, providing 
        clear guidance for the complex caching behaviors that are essential 
        for modern web performance.
      </p>

      <h3>Cache Control Directives</h3>
      <p>
        The specification clarifies cache control directives and their 
        interactions, enabling predictable caching behavior across different 
        implementations:
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant Client as Web Browser
    participant Cache as HTTP Cache
    participant Origin as Origin Server

    Note over Client,Origin: Initial Request (Cache Miss)
    
    Client->>+Cache: GET /api/data
    Cache->>+Origin: GET /api/data
    Origin-->>-Cache: 200 OK<br/>Cache-Control: max-age=3600<br/>ETag: "v1.0"<br/>Data payload
    Cache-->>-Client: 200 OK<br/>Data payload + caching headers
    
    Note over Cache: Store in cache for 1 hour
    
    Note over Client,Origin: Subsequent Request (Cache Hit)
    
    Client->>+Cache: GET /api/data
    Note over Cache: Check freshness<br/>Still fresh (< 1 hour)
    Cache-->>-Client: 200 OK<br/>Data from cache
    
    Note over Client,Origin: Request After Expiration (Revalidation)
    
    Client->>+Cache: GET /api/data
    Note over Cache: Expired, needs revalidation
    Cache->>+Origin: GET /api/data<br/>If-None-Match: "v1.0"
    Origin-->>-Cache: 304 Not Modified<br/>Cache-Control: max-age=3600
    Cache-->>-Client: 200 OK<br/>Cached data (freshness extended)
        `}
        className="my-6"
      />

      <h3>Modern Caching Strategies</h3>
      <p>
        RFC 9111 enables sophisticated caching strategies that power modern 
        web performance:
      </p>

      <ul>
        <li><strong>Stale-While-Revalidate:</strong> Serve stale content while fetching updates</li>
        <li><strong>Immutable Resources:</strong> Content that never changes (e.g., versioned assets)</li>
        <li><strong>Vary Header Handling:</strong> Cache different responses based on request headers</li>
        <li><strong>Private vs Shared Caches:</strong> Clear distinction between browser and CDN caching</li>
      </ul>

      <ExpandableSection title="🚀 Understanding Modern Web Caching">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of HTTP caching like a smart grocery delivery system:</strong>
          </p>
          <p>
            <strong>Old Caching (pre-RFC 9111):</strong> Like having a delivery 
            service that couldn't decide whether to bring fresh groceries or 
            use what's in your fridge. Sometimes you'd get expired food, 
            sometimes unnecessary fresh deliveries.
          </p>
          <p className="mt-2">
            <strong>Modern Caching (RFC 9111):</strong> Like having a smart 
            system that knows exactly when your food expires, can check if 
            it's still good before you ask, and can even bring new groceries 
            while you're still eating the old ones (stale-while-revalidate).
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> Websites load instantly from cache 
            when possible, but you always get fresh content when needed. 
            CDNs worldwide can serve your content efficiently without wasting bandwidth.
          </p>
        </div>
      </ExpandableSection>

      <h2>RFC 9112: HTTP/1.1 Message Syntax</h2>
      <p>
        RFC 9112 provides precise specifications for HTTP/1.1 message formatting, 
        connection management, and parsing requirements, ensuring interoperability 
        across diverse implementations.
      </p>

      <h3>Message Format Standardization</h3>
      <p>
        The specification clarifies ambiguities in HTTP/1.1 message parsing 
        that have caused security vulnerabilities and interoperability issues:
      </p>

      <div className="bg-yellow-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Security Improvements</h4>
        <ul className="text-yellow-800">
          <li><strong>Request Smuggling Prevention:</strong> Clear rules for Content-Length vs Transfer-Encoding</li>
          <li><strong>Header Field Parsing:</strong> Precise whitespace and character handling</li>
          <li><strong>Connection Management:</strong> Explicit connection persistence rules</li>
          <li><strong>Protocol Upgrade:</strong> Secure WebSocket and HTTP/2 upgrade procedures</li>
        </ul>
      </div>

      <h2>Modern Internet Impact: Web Standards Foundation</h2>
      <p>
        RFC 9110-9114 serves as the authoritative foundation for all modern 
        web technologies, APIs, and internet services that billions of people 
        use daily.
      </p>

      <h3>Current Applications Powered by RFC 9110-9114</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🌐 Web Applications</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Single Page Applications:</strong> React, Vue, Angular apps</li>
            <li>• <strong>Progressive Web Apps:</strong> Offline-capable web experiences</li>
            <li>• <strong>Social Media Platforms:</strong> Facebook, Twitter, Instagram</li>
            <li>• <strong>Collaboration Tools:</strong> Google Workspace, Microsoft 365</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🔌 REST APIs</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>Cloud Services:</strong> AWS, Azure, Google Cloud APIs</li>
            <li>• <strong>Payment Processing:</strong> Stripe, PayPal, Square APIs</li>
            <li>• <strong>Social Integration:</strong> Twitter, LinkedIn, GitHub APIs</li>
            <li>• <strong>IoT Platforms:</strong> Device management and data collection</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">📱 Mobile Applications</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>Native Apps:</strong> iOS and Android app backends</li>
            <li>• <strong>Hybrid Apps:</strong> Cordova, React Native, Flutter</li>
            <li>• <strong>Mobile Web:</strong> Responsive and adaptive web experiences</li>
            <li>• <strong>App Store APIs:</strong> Distribution and update mechanisms</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibant text-orange-900 mb-3">⚡ Performance Infrastructure</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>Content Delivery Networks:</strong> Cloudflare, AWS CloudFront</li>
            <li>• <strong>Load Balancers:</strong> NGINX, HAProxy, cloud load balancers</li>
            <li>• <strong>Caching Layers:</strong> Redis, Memcached, Varnish</li>
            <li>• <strong>API Gateways:</strong> Kong, Istio, AWS API Gateway</li>
          </ul>
        </div>
      </div>

      <h3>Enterprise and Developer Impact</h3>

      <h4>1. API Design Standardization</h4>
      <p>
        RFC 9110's method semantics provide the foundation for RESTful API 
        design patterns used across the technology industry:
      </p>

      <ul>
        <li><strong>Resource-Oriented Architecture:</strong> Clear mapping between HTTP methods and CRUD operations</li>
        <li><strong>Idempotency Guarantees:</strong> Reliable API behavior for distributed systems</li>
        <li><strong>Status Code Semantics:</strong> Consistent error handling across services</li>
        <li><strong>Content Negotiation:</strong> Multi-format APIs (JSON, XML, MessagePack)</li>
      </ul>

      <h4>2. Web Performance Optimization</h4>
      <p>
        RFC 9111's caching specifications enable the performance optimizations 
        that make modern web applications responsive:
      </p>

      <ul>
        <li><strong>CDN Efficiency:</strong> Intelligent caching at edge locations worldwide</li>
        <li><strong>Browser Optimization:</strong> Predictable client-side caching behavior</li>
        <li><strong>Bandwidth Reduction:</strong> Conditional requests minimize data transfer</li>
        <li><strong>Offline Capabilities:</strong> Service Workers leverage caching for offline functionality</li>
      </ul>

      <ExpandableSection title="🐍 ELI-Pythonista: Modern API Design with RFC 9110">
        <div className="space-y-4">
          <p>
            Building REST APIs is like designing a well-organized library system. Each resource
            has its proper place, every interaction follows established rules, and the system
            helps users find exactly what they need efficiently. This Python API server shows
            how to implement proper HTTP semantics for a robust, cacheable API.
          </p>
          
          <CodeBlock
            language="python"
            code={getCodeExample("rfc9110_api_design")}
          />
          
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-green-800 mb-2">Key Python Concepts Demonstrated</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>FastAPI framework:</strong> Modern, async Python web framework</li>
              <li>• <strong>Type hints:</strong> Strong typing with dataclasses and Union types</li>
              <li>• <strong>Enum classes:</strong> Type-safe HTTP method definitions</li>
              <li>• <strong>Resource-oriented design:</strong> RESTful endpoint organization</li>
              <li>• <strong>HTTP status codes:</strong> Proper semantic usage of response codes</li>
              <li>• <strong>Conditional requests:</strong> ETag and If-None-Match handling</li>
              <li>• <strong>Caching policies:</strong> Flexible cache-control header generation</li>
              <li>• <strong>Error handling:</strong> Structured API error responses</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>Security and Authentication Enhancements</h2>
      <p>
        The RFC 9110 series addresses decades of security lessons learned 
        from web application vulnerabilities and attack patterns:
      </p>

      <h3>Enhanced Authentication Framework</h3>
      <ul>
        <li><strong>Bearer Token Standardization:</strong> Clear OAuth 2.0 and JWT integration</li>
        <li><strong>Challenge-Response Mechanisms:</strong> Improved basic and digest authentication</li>
        <li><strong>Multi-Factor Integration:</strong> Support for WebAuthn and modern auth flows</li>
        <li><strong>Token Refresh Patterns:</strong> Secure token lifecycle management</li>
      </ul>

      <h3>Security Header Clarifications</h3>
      <ul>
        <li><strong>CORS Integration:</strong> Cross-Origin Resource Sharing best practices</li>
        <li><strong>Content Security Policy:</strong> XSS prevention through CSP headers</li>
        <li><strong>Transport Security:</strong> HTTPS enforcement and HSTS requirements</li>
        <li><strong>Privacy Controls:</strong> Cookie attributes and privacy-preserving patterns</li>
      </ul>

      <h2>Integration with Modern Web Technologies</h2>
      <p>
        RFC 9110-9114 provides the foundation that enables modern web 
        technologies and development patterns:
      </p>

      <h3>1. GraphQL and Alternative APIs</h3>
      <p>
        While GraphQL uses HTTP as transport, it leverages RFC 9110's method 
        semantics and status codes for error handling and caching integration.
      </p>

      <h3>2. Microservices Architecture</h3>
      <p>
        The clear method semantics and status codes enable reliable 
        service-to-service communication in distributed systems.
      </p>

      <h3>3. Serverless Computing</h3>
      <p>
        Functions-as-a-Service platforms rely on HTTP semantics for request 
        routing, authentication, and response handling.
      </p>

      <h3>4. Container Orchestration</h3>
      <p>
        Kubernetes and other orchestration platforms use HTTP for health checks, 
        service discovery, and API communication.
      </p>

      <h2>Future-Proofing and Evolution</h2>
      <p>
        RFC 9110-9114 is designed to accommodate future web evolution while 
        maintaining backward compatibility:
      </p>

      <h3>Extensibility Mechanisms</h3>
      <ul>
        <li><strong>Custom Headers:</strong> Vendor-specific and experimental extensions</li>
        <li><strong>New Methods:</strong> Framework for defining application-specific methods</li>
        <li><strong>Status Code Extensions:</strong> Reserved ranges for future standardization</li>
        <li><strong>Protocol Upgrades:</strong> Mechanisms for transitioning to new HTTP versions</li>
      </ul>

      <h3>Emerging Technology Integration</h3>
      <ul>
        <li><strong>WebAssembly:</strong> HTTP transport for WASM modules and APIs</li>
        <li><strong>Edge Computing:</strong> Distributed HTTP processing at network edges</li>
        <li><strong>IoT Integration:</strong> Lightweight HTTP profiles for constrained devices</li>
        <li><strong>Real-Time Communication:</strong> HTTP/3 and WebTransport evolution</li>
      </ul>

      <ExpandableSection title="📊 Performance Impact: Modern vs Legacy HTTP">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Comparison of legacy vs RFC 9110-9114 compliant implementations:</strong>
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-red-900">Legacy Implementation</h5>
              <ul className="text-sm text-red-800">
                <li>• Ambiguous caching behavior</li>
                <li>• Inconsistent error handling</li>
                <li>• Security vulnerabilities from parsing issues</li>
                <li>• Poor mobile performance</li>
                <li>• Limited offline capabilities</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-green-900">RFC 9110-9114 Implementation</h5>
              <ul className="text-sm text-green-800">
                <li>• Predictable caching across all layers</li>
                <li>• Standardized error responses</li>
                <li>• Secure-by-default parsing rules</li>
                <li>• Optimized for mobile networks</li>
                <li>• PWA and offline functionality</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-600">
            <strong>Result:</strong> Modern implementations deliver 40-60% better 
            performance, enhanced security, and consistent behavior across platforms.
          </p>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🔗 Docker Demonstration: HTTP Standards Compliance">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Interactive HTTP standards compliance demonstration!</strong>
          </p>
          <p>
            The Docker example in <code>docker-examples/rfc9110-http-standards/</code> 
            provides comprehensive testing of HTTP semantics, caching, and security features.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc9110-http-standards/
docker compose up -d

# Access the standards test suite at:
# http://localhost:8080

# Monitor compliance testing:
# docker compose logs -f compliance-tester`}
          />
          <p className="mt-3 text-sm">
            The demonstration includes method semantics testing, caching behavior 
            validation, security header verification, and performance benchmarking.
          </p>
        </div>
      </ExpandableSection>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Key Takeaways for Modern Web Understanding
        </h3>
        <ul className="text-blue-800">
          <li>
            RFC 9110-9114 provides the definitive HTTP specification that powers 
            all modern web applications, APIs, and internet services
          </li>
          <li>
            Understanding method semantics, status codes, and caching is essential 
            for building performant, secure web applications
          </li>
          <li>
            The standards enable the performance optimizations, security features, 
            and offline capabilities that users expect from modern web experiences
          </li>
          <li>
            These specifications will continue to evolve to support emerging 
            technologies while maintaining backward compatibility
          </li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Learn More</h3>
        <ul className="space-y-1">
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9110.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9110: HTTP Semantics
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9111.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9111: HTTP Caching
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9112.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9112: HTTP/1.1
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9113.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9113: HTTP/2 (Updated)
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9114.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9114: HTTP/3
            </a>
          </li>
          <li>
            <Link to="/rfc/7540" className="text-blue-600 hover:text-blue-800 underline">
              RFC 7540: HTTP/2 (Original)
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