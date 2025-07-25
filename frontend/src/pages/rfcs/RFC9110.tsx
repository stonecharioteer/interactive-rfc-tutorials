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
        RFC 9110: HTTP Semantics - June 2022
      </h1>
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
          <span className="font-semibold text-emerald-800">
            Modern Web Standards Consolidation
          </span>
        </div>
        <p className="text-emerald-700 mb-0">
          RFC 9110 defines the core HTTP semantics that power all modern web communication. 
          This specification consolidates decades of web evolution, providing precise definitions 
          for HTTP methods, status codes, headers, and the fundamental request/response model 
          that serves as the foundation for billions of daily web interactions.
        </p>
        <p className="text-emerald-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9110.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 9110: HTTP Semantics <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>HTTP Semantics: The Foundation of Web Communication</h2>
      <p>
        RFC 9110 represents the definitive specification for HTTP semantics, evolving from the original 
        <Link to="/rfc/1945" className="text-blue-600 hover:text-blue-800">HTTP/1.0</Link> through{" "}
        <Link to="/rfc/2068" className="text-blue-600 hover:text-blue-800">HTTP/1.1</Link> and{" "}
        <Link to="/rfc/7540" className="text-blue-600 hover:text-blue-800">HTTP/2</Link>. 
        This specification provides the semantic foundation that is protocol-version independent, 
        clarifying 25 years of real-world implementation experience.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg my-4">
        <h3 className="font-semibold text-blue-900 mb-2">Related HTTP Standards</h3>
        <ul className="text-blue-800 space-y-2">
          <li><strong><Link to="/rfc/9110" className="text-blue-600 hover:text-blue-800">RFC 9110</Link>:</strong> HTTP Semantics (This document)</li>
          <li><strong><Link to="/rfc/9111" className="text-blue-600 hover:text-blue-800">RFC 9111</Link>:</strong> HTTP Caching - Cache behavior specifications</li>
          <li><strong><Link to="/rfc/9112" className="text-blue-600 hover:text-blue-800">RFC 9112</Link>:</strong> HTTP/1.1 - Message syntax and connection management</li>
          <li><strong><Link to="/rfc/9113" className="text-blue-600 hover:text-blue-800">RFC 9113</Link>:</strong> HTTP/2 - Binary framing and multiplexing updates</li>
          <li><strong><Link to="/rfc/9114" className="text-blue-600 hover:text-blue-800">RFC 9114</Link>:</strong> HTTP/3 - QUIC-based transport protocol</li>
        </ul>
      </div>

      <ExpandableSection title="🎯 Understanding HTTP Semantics">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of HTTP semantics like the rules of communication in a global marketplace:</strong>
          </p>
          <p>
            <strong>Without RFC 9110:</strong> Like having a massive international market 
            where every vendor and customer speaks differently, uses different currencies, 
            and follows different transaction rules. Chaos and miscommunication everywhere.
          </p>
          <p className="mt-2">
            <strong>With RFC 9110:</strong> Like having a universal set of business rules 
            that everyone understands - clear protocols for making requests, standard 
            response codes, consistent ways to handle errors, and reliable methods 
            for conducting transactions.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> Every web browser, server, API, and application 
            speaks the same language, enabling seamless communication across the entire internet.
          </p>
        </div>
      </ExpandableSection>

      <h2>HTTP Methods: Safe, Idempotent, and Non-Idempotent</h2>
      <h3>Method Classifications</h3>
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

      <h2>Request/Response Model</h2>
      <p>
        RFC 9110 defines the fundamental request/response interaction model 
        that underlies all HTTP communication, regardless of the specific 
        protocol version (HTTP/1.1, HTTP/2, or HTTP/3).
      </p>

      <h3>HTTP Message Components</h3>
      <p>
        Every HTTP interaction consists of well-defined components that 
        enable reliable communication:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold text-gray-900 mb-2">Request Components</h4>
        <ul className="text-gray-800 space-y-1">
          <li><strong>Method:</strong> The action to be performed (GET, POST, PUT, DELETE, etc.)</li>
          <li><strong>Target URI:</strong> The resource being accessed</li>
          <li><strong>Headers:</strong> Metadata about the request</li>
          <li><strong>Body (optional):</strong> Data payload for certain methods</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold text-gray-900 mb-2">Response Components</h4>
        <ul className="text-gray-800 space-y-1">
          <li><strong>Status Code:</strong> Result of the request processing</li>
          <li><strong>Headers:</strong> Metadata about the response</li>
          <li><strong>Body (optional):</strong> Response data payload</li>
        </ul>
      </div>

      <h2>Modern Internet Impact: Universal Web Communication</h2>
      <p>
        RFC 9110 serves as the semantic foundation for all modern web 
        communication, defining the rules that enable reliable interaction 
        between billions of web clients and servers worldwide.
      </p>

      <h3>Applications Powered by RFC 9110 Semantics</h3>

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

      <ExpandableSection title="🐍 ELI-Pythonista: Building Semantic HTTP APIs">
        <div className="space-y-4">
          <p>
            Building REST APIs with proper HTTP semantics is like being a skilled librarian 
            who knows exactly how to organize, catalog, and retrieve information. This Python 
            API server demonstrates how to implement RFC 9110 semantics for reliable, 
            predictable web services.
          </p>
          
          <CodeBlock
            language="python"
            code={getCodeExample("rfc9110_api_design")}
          />
          
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-green-800 mb-2">HTTP Semantics in Python</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>Method Safety:</strong> GET/HEAD methods never modify server state</li>
              <li>• <strong>Idempotency:</strong> PUT/DELETE produce same result when repeated</li>
              <li>• <strong>Status Code Precision:</strong> Each code has specific semantic meaning</li>
              <li>• <strong>Resource Representation:</strong> Content-Type and Accept headers</li>
              <li>• <strong>Error Semantics:</strong> Consistent 4xx client vs 5xx server errors</li>
              <li>• <strong>Conditional Requests:</strong> ETags for optimistic concurrency</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>Headers and Content Negotiation</h2>
      <p>
        RFC 9110 provides comprehensive guidance on HTTP headers, enabling 
        flexible content negotiation and metadata exchange between clients and servers.
      </p>

      <h3>Essential Header Fields</h3>
      <ul>
        <li><strong>Content-Type:</strong> Media type of request/response body</li>
        <li><strong>Accept:</strong> Client's preferred response media types</li>
        <li><strong>Authorization:</strong> Client credentials for authentication</li>
        <li><strong>User-Agent:</strong> Client software identification</li>
        <li><strong>Server:</strong> Server software identification</li>
      </ul>

      <h3>Content Negotiation Mechanisms</h3>
      <ul>
        <li><strong>Media Type Selection:</strong> Choose appropriate content format</li>
        <li><strong>Language Selection:</strong> Accept-Language for internationalization</li>
        <li><strong>Encoding Selection:</strong> Accept-Encoding for compression</li>
        <li><strong>Quality Values:</strong> Client preference weighting (q-values)</li>
      </ul>

      <h2>Integration with Modern Web Technologies</h2>
      <p>
        RFC 9110's semantic foundation enables all modern web technologies 
        and development patterns to interoperate reliably.
      </p>

      <h3>RESTful API Design</h3>
      <p>
        The method semantics and status codes provide the foundation for 
        RESTful API design patterns used across the technology industry.
      </p>

      <h3>Web Application Frameworks</h3>
      <p>
        Modern frameworks rely on HTTP semantics for routing, middleware, 
        authentication, and response handling.
      </p>

      <h3>Distributed Systems</h3>
      <p>
        Microservices and distributed applications depend on consistent 
        HTTP semantics for reliable inter-service communication.
      </p>

      <h2>Extensibility and Evolution</h2>
      <p>
        RFC 9110 is designed to accommodate future web evolution while 
        maintaining backward compatibility and semantic consistency.
      </p>

      <h3>Extension Mechanisms</h3>
      <ul>
        <li><strong>Custom Headers:</strong> Vendor-specific extensions (X-* headers)</li>
        <li><strong>New Methods:</strong> Application-specific method definitions</li>
        <li><strong>Status Code Ranges:</strong> Reserved spaces for future standardization</li>
        <li><strong>Media Type Registration:</strong> New content type definitions</li>
      </ul>

      <h3>Protocol Version Independence</h3>
      <ul>
        <li><strong>Transport Agnostic:</strong> Works over HTTP/1.1, HTTP/2, HTTP/3</li>
        <li><strong>Semantic Consistency:</strong> Same meaning across all HTTP versions</li>
        <li><strong>Forward Compatibility:</strong> Graceful handling of unknown elements</li>
      </ul>

      <ExpandableSection title="📊 HTTP Semantics: Consistency vs Ambiguity">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Impact of precise HTTP semantics on web reliability:</strong>
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-red-900">Pre-RFC 9110 Ambiguity</h5>
              <ul className="text-sm text-red-800">
                <li>• Inconsistent method interpretations</li>
                <li>• Conflicting status code usage</li>
                <li>• Ambiguous header field meanings</li>
                <li>• Unpredictable client/server behavior</li>
                <li>• Interoperability issues</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-green-900">RFC 9110 Clarity</h5>
              <ul className="text-sm text-green-800">
                <li>• Precise method semantic definitions</li>
                <li>• Unambiguous status code meanings</li>
                <li>• Clear header field specifications</li>
                <li>• Predictable interaction patterns</li>
                <li>• Universal interoperability</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-600">
            <strong>Result:</strong> Reliable web communication that works consistently 
            across all browsers, servers, proxies, and development frameworks.
          </p>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🔗 Docker Demonstration: HTTP Semantics Testing">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Interactive HTTP semantics demonstration!</strong>
          </p>
          <p>
            The Docker example in <code>docker-examples/rfc9110-http-semantics/</code> 
            demonstrates proper HTTP method semantics, status codes, and header handling.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc9110-http-semantics/
docker compose up -d

# Access the semantics test suite at:
# http://localhost:8080

# Monitor semantic compliance:
# docker compose logs -f semantics-server`}
          />
          <p className="mt-3 text-sm">
            Test HTTP method safety and idempotency, status code accuracy, 
            content negotiation, and proper header field usage.
          </p>
        </div>
      </ExpandableSection>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Key Takeaways for HTTP Semantics
        </h3>
        <ul className="text-blue-800">
          <li>
            RFC 9110 defines the foundational semantics that enable consistent 
            HTTP communication across all protocol versions and implementations
          </li>
          <li>
            Understanding method safety, idempotency, and status code meanings 
            is essential for building reliable web applications and APIs
          </li>
          <li>
            Proper HTTP semantics enable interoperability between different 
            browsers, servers, proxies, and development frameworks
          </li>
          <li>
            These semantic rules provide the foundation for all higher-level 
            web technologies and communication patterns
          </li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Related HTTP Standards</h3>
        <ul className="space-y-1">
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9110.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9110: HTTP Semantics (This document)
            </a>
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
            <Link to="/rfc/9114" className="text-blue-600 hover:text-blue-800 underline">
              RFC 9114: HTTP/3
            </Link>
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