import { Link } from "react-router-dom";
import { ExternalLink, CheckCircle } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC9111() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 9111: HTTP Caching - June 2022
      </h1>
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
          <span className="font-semibold text-emerald-800">
            Modern HTTP Caching Standard
          </span>
        </div>
        <p className="text-emerald-700 mb-0">
          RFC 9111 completely overhauls HTTP caching specifications, providing 
          clear guidance for the complex caching behaviors that are essential 
          for modern web performance. This specification enables the sophisticated 
          caching strategies that power Content Delivery Networks, browser caches, 
          and the performance optimizations that make modern web applications responsive.
        </p>
        <p className="text-emerald-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9111.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 9111: HTTP Caching <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>HTTP Caching: Performance Through Smart Storage</h2>
      <p>
        RFC 9111 defines comprehensive caching behaviors that enable web performance 
        optimization through intelligent content storage and reuse. This specification 
        provides the foundation for Content Delivery Networks (CDNs), browser caches, 
        and proxy servers that deliver content efficiently worldwide.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg my-4">
        <h3 className="font-semibold text-blue-900 mb-2">Related HTTP Standards</h3>
        <ul className="text-blue-800 space-y-2">
          <li><strong><Link to="/rfc/9110" className="text-blue-600 hover:text-blue-800">RFC 9110</Link>:</strong> HTTP Semantics - Core protocol foundation</li>
          <li><strong><Link to="/rfc/9111" className="text-blue-600 hover:text-blue-800">RFC 9111</Link>:</strong> HTTP Caching (This document)</li>
          <li><strong><Link to="/rfc/9112" className="text-blue-600 hover:text-blue-800">RFC 9112</Link>:</strong> HTTP/1.1 Message Syntax</li>
          <li><strong><Link to="/rfc/9113" className="text-blue-600 hover:text-blue-800">RFC 9113</Link>:</strong> HTTP/2 Protocol Updates</li>
          <li><strong><Link to="/rfc/9114" className="text-blue-600 hover:text-blue-800">RFC 9114</Link>:</strong> HTTP/3 over QUIC</li>
        </ul>
      </div>

      <ExpandableSection title="🎯 Understanding HTTP Caching">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of HTTP caching like a smart grocery delivery system:</strong>
          </p>
          <p>
            <strong>Without Caching:</strong> Every time you want something from 
            a store, you have to travel there personally, wait in line, make your 
            purchase, and travel all the way back. Even for items you bought yesterday.
          </p>
          <p className="mt-2">
            <strong>With HTTP Caching:</strong> Like having smart local warehouses 
            that keep frequently requested items nearby, check if items are still 
            fresh before serving them, and can even deliver newer versions while 
            you're using the current ones.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> Websites load instantly from local caches 
            when possible, but you always get fresh content when needed. Global 
            CDNs serve content efficiently without wasting bandwidth.
          </p>
        </div>
      </ExpandableSection>

      <h2>Cache Control Directives</h2>
      <p>
        RFC 9111 clarifies cache control directives and their interactions, 
        enabling predictable caching behavior across different implementations:
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

      <h3>Cache Control Directive Categories</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🕐 Freshness Directives</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>max-age:</strong> Maximum cache lifetime in seconds</li>
            <li>• <strong>s-maxage:</strong> Shared cache maximum age</li>
            <li>• <strong>max-stale:</strong> Accept stale responses up to age</li>
            <li>• <strong>min-fresh:</strong> Require freshness for specified time</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🔄 Revalidation Directives</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>must-revalidate:</strong> Revalidate when stale</li>
            <li>• <strong>proxy-revalidate:</strong> Shared caches must revalidate</li>
            <li>• <strong>no-cache:</strong> Must revalidate before use</li>
            <li>• <strong>only-if-cached:</strong> Return cached or 504</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">🚫 Cacheability Directives</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>no-store:</strong> Do not store in any cache</li>
            <li>• <strong>private:</strong> Store only in private caches</li>
            <li>• <strong>public:</strong> May be cached by any cache</li>
            <li>• <strong>immutable:</strong> Will not change during freshness</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">🏎️ Performance Directives</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>stale-while-revalidate:</strong> Serve stale while updating</li>
            <li>• <strong>stale-if-error:</strong> Serve stale if origin errors</li>
            <li>• <strong>no-transform:</strong> Do not modify the response</li>
          </ul>
        </div>
      </div>

      <h2>Modern Caching Strategies</h2>
      <p>
        RFC 9111 enables sophisticated caching strategies that power modern 
        web performance:
      </p>

      <h3>Advanced Caching Patterns</h3>
      <ul>
        <li><strong>Stale-While-Revalidate:</strong> Serve stale content while fetching updates in background</li>
        <li><strong>Immutable Resources:</strong> Content that never changes (e.g., versioned assets with hashes)</li>
        <li><strong>Vary Header Handling:</strong> Cache different responses based on request headers</li>
        <li><strong>Private vs Shared Caches:</strong> Clear distinction between browser and CDN caching</li>
        <li><strong>Conditional Requests:</strong> Efficient revalidation with ETags and Last-Modified</li>
      </ul>

      <ExpandableSection title="🐍 ELI-Pythonista: HTTP Cache Implementation">
        <div className="space-y-4">
          <p>
            Building an HTTP cache is like creating a smart storage system that knows 
            exactly when items expire, can check if they're still fresh, and optimizes 
            storage space efficiently. This Python implementation shows how to build 
            an RFC 9111 compliant cache with proper directive handling.
          </p>
          
          <CodeBlock
            language="python"
            code={getCodeExample("rfc9111_cache_implementation")}
          />
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">HTTP Caching in Python</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Cache-Control parsing:</strong> Extract and interpret caching directives</li>
              <li>• <strong>Freshness calculation:</strong> Determine if cached responses are still valid</li>
              <li>• <strong>Revalidation logic:</strong> Conditional requests with ETags</li>
              <li>• <strong>Storage policies:</strong> Private vs shared cache behavior</li>
              <li>• <strong>Vary header handling:</strong> Multiple cache entries per URL</li>
              <li>• <strong>Background updates:</strong> Stale-while-revalidate implementation</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>Conditional Requests and Validation</h2>
      <p>
        RFC 9111 defines sophisticated validation mechanisms that enable efficient 
        cache revalidation and bandwidth optimization:
      </p>

      <h3>Validation Methods</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">🏷️ Entity Tags (ETags)</h4>
          <ul className="text-gray-800 space-y-2">
            <li><strong>Strong ETags:</strong> Byte-for-byte identical content</li>
            <li><strong>Weak ETags:</strong> Semantically equivalent content</li>
            <li><strong>If-None-Match:</strong> Return 304 if ETag matches</li>
            <li><strong>If-Match:</strong> Process only if ETag matches</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">⏰ Last-Modified</h4>
          <ul className="text-gray-800 space-y-2">
            <li><strong>Last-Modified:</strong> Resource modification timestamp</li>
            <li><strong>If-Modified-Since:</strong> Return 304 if not modified</li>
            <li><strong>If-Unmodified-Since:</strong> Process only if not modified</li>
            <li><strong>One-second resolution:</strong> HTTP-date precision limits</li>
          </ul>
        </div>
      </div>

      <h2>Cache Hierarchies and Shared Caches</h2>
      <p>
        Modern web infrastructure relies on hierarchical caching systems where 
        different cache layers serve different purposes:
      </p>

      <MermaidDiagram
        chart={`
graph TB
    Client[Web Browser<br/>Private Cache]
    ISP[ISP Proxy<br/>Shared Cache]
    CDN[CDN Edge<br/>Shared Cache]
    Origin[Origin Server]
    
    Client -->|miss| ISP
    ISP -->|miss| CDN
    CDN -->|miss| Origin
    
    CDN -->|hit| ISP
    ISP -->|hit| Client
    
    subgraph "Cache Hierarchy"
        Client
        ISP
        CDN
        Origin
    end
    
    style Client fill:#e3f2fd
    style ISP fill:#f3e5f5
    style CDN fill:#e8f5e8
    style Origin fill:#fff3e0
        `}
        className="my-6"
      />

      <h3>Cache Types and Behaviors</h3>
      <ul>
        <li><strong>Private Caches:</strong> Browser caches that serve individual users</li>
        <li><strong>Shared Caches:</strong> Proxy and CDN caches serving multiple users</li>
        <li><strong>Gateway Caches:</strong> Reverse proxies at origin server boundaries</li>
        <li><strong>Edge Caches:</strong> Geographically distributed content caches</li>
      </ul>

      <h2>Modern Internet Impact: Web Performance Foundation</h2>
      <p>
        RFC 9111 enables the caching infrastructure that makes the modern web 
        performant and accessible worldwide, reducing bandwidth usage and 
        improving user experience.
      </p>

      <h3>Global Performance Impact</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🌍 Content Delivery Networks</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>Global Distribution:</strong> Cloudflare, AWS CloudFront, Fastly</li>
            <li>• <strong>Edge Caching:</strong> Content served from nearby locations</li>
            <li>• <strong>Bandwidth Optimization:</strong> Reduced origin server load</li>
            <li>• <strong>Cache Purging:</strong> Instant global content updates</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🏃 Browser Performance</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Instant Loading:</strong> Cached resources load immediately</li>
            <li>• <strong>Offline Capability:</strong> Service Workers leverage cache APIs</li>
            <li>• <strong>Mobile Optimization:</strong> Reduced data usage on mobile networks</li>
            <li>• <strong>Background Updates:</strong> Stale-while-revalidate patterns</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">⚡ Application Performance</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>API Response Caching:</strong> Database query reduction</li>
            <li>• <strong>Static Asset Optimization:</strong> Long-term caching of versioned files</li>
            <li>• <strong>Dynamic Content Caching:</strong> Personalized content optimization</li>
            <li>• <strong>Microservice Efficiency:</strong> Inter-service response caching</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">🔧 Development Tools</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>Build Tool Integration:</strong> Webpack, Vite asset hashing</li>
            <li>• <strong>Framework Support:</strong> Next.js, Nuxt.js caching strategies</li>
            <li>• <strong>Testing Tools:</strong> Cache behavior validation</li>
            <li>• <strong>Monitoring:</strong> Cache hit rates and performance metrics</li>
          </ul>
        </div>
      </div>

      <h2>Security Considerations in HTTP Caching</h2>
      <p>
        RFC 9111 addresses important security implications of caching, ensuring 
        that performance optimizations don't compromise application security:
      </p>

      <h3>Cache Security Principles</h3>
      <ul>
        <li><strong>Private Data Protection:</strong> no-store for sensitive information</li>
        <li><strong>Authentication Context:</strong> Vary on Authorization headers</li>
        <li><strong>HTTPS Considerations:</strong> Secure context caching behaviors</li>
        <li><strong>Cache Poisoning Prevention:</strong> Validation of cache keys</li>
      </ul>

      <ExpandableSection title="📊 Caching Performance: Before vs After RFC 9111">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Impact of standardized caching on web performance:</strong>
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-red-900">Pre-RFC 9111 Caching</h5>
              <ul className="text-sm text-red-800">
                <li>• Inconsistent cache directive interpretation</li>
                <li>• Ambiguous freshness calculations</li>
                <li>• Unpredictable revalidation behavior</li>
                <li>• Cache invalidation complexities</li>
                <li>• Security vulnerabilities in shared caches</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-green-900">RFC 9111 Standardized Caching</h5>
              <ul className="text-sm text-green-800">
                <li>• Precise directive semantics across all implementations</li>
                <li>• Clear freshness lifetime calculations</li>
                <li>• Predictable conditional request patterns</li>
                <li>• Efficient cache invalidation strategies</li>
                <li>• Secure handling of private vs shared content</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-600">
            <strong>Result:</strong> 50-80% reduction in bandwidth usage, 60-90% faster 
            load times for repeat visits, and predictable caching behavior across all platforms.
          </p>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🔗 Docker Demonstration: HTTP Caching Behavior">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Interactive HTTP caching demonstration!</strong>
          </p>
          <p>
            The Docker example in <code>docker-examples/rfc9111-http-caching/</code> 
            demonstrates cache control directives, revalidation, and performance optimization.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc9111-http-caching/
docker compose up -d

# Access the caching test suite at:
# http://localhost:8080

# Monitor cache behavior:
# docker compose logs -f cache-server`}
          />
          <p className="mt-3 text-sm">
            Test different cache control directives, observe revalidation behavior, 
            and measure performance improvements with various caching strategies.
          </p>
        </div>
      </ExpandableSection>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Key Takeaways for HTTP Caching
        </h3>
        <ul className="text-blue-800">
          <li>
            RFC 9111 provides the standardized caching behaviors that enable 
            modern web performance through intelligent content storage and reuse
          </li>
          <li>
            Understanding cache control directives, freshness calculations, and 
            revalidation is essential for building performant web applications
          </li>
          <li>
            Proper caching strategies reduce bandwidth usage, improve user experience, 
            and enable offline capabilities in modern web applications
          </li>
          <li>
            HTTP caching forms the foundation for CDNs, browser optimization, 
            and the performance infrastructure of the modern internet
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
            <a href="https://www.rfc-editor.org/rfc/rfc9111.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9111: HTTP Caching (This document)
            </a>
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