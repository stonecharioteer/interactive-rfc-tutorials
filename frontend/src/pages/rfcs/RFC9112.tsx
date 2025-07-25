import { Link } from "react-router-dom";
import { ExternalLink, CheckCircle } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC9112() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 9112: HTTP/1.1 - June 2022
      </h1>
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
          <span className="font-semibold text-emerald-800">
            HTTP/1.1 Message Syntax Standard
          </span>
        </div>
        <p className="text-emerald-700 mb-0">
          RFC 9112 provides precise specifications for HTTP/1.1 message formatting, 
          connection management, and parsing requirements, ensuring interoperability 
          across diverse implementations. This specification resolves ambiguities 
          that have caused security vulnerabilities and compatibility issues, 
          establishing the definitive rules for HTTP/1.1 wire protocol.
        </p>
        <p className="text-emerald-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9112.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 9112: HTTP/1.1 <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>HTTP/1.1 Message Format: Wire Protocol Precision</h2>
      <p>
        RFC 9112 defines the exact syntax and parsing rules for HTTP/1.1 messages, 
        providing the foundation for reliable text-based HTTP communication that 
        has powered the web for over two decades.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg my-4">
        <h3 className="font-semibold text-blue-900 mb-2">Related HTTP Standards</h3>
        <ul className="text-blue-800 space-y-2">
          <li><strong><Link to="/rfc/9110" className="text-blue-600 hover:text-blue-800">RFC 9110</Link>:</strong> HTTP Semantics - Protocol meaning and behavior</li>
          <li><strong><Link to="/rfc/9111" className="text-blue-600 hover:text-blue-800">RFC 9111</Link>:</strong> HTTP Caching - Performance optimization</li>
          <li><strong><Link to="/rfc/9112" className="text-blue-600 hover:text-blue-800">RFC 9112</Link>:</strong> HTTP/1.1 (This document)</li>
          <li><strong><Link to="/rfc/9113" className="text-blue-600 hover:text-blue-800">RFC 9113</Link>:</strong> HTTP/2 - Binary protocol evolution</li>
          <li><strong><Link to="/rfc/9114" className="text-blue-600 hover:text-blue-800">RFC 9114</Link>:</strong> HTTP/3 - QUIC-based transport</li>
        </ul>
      </div>

      <ExpandableSection title="🎯 Understanding HTTP/1.1 Message Format">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="mb-4">
            <strong>Think of HTTP/1.1 messages like precisely formatted postal letters:</strong>
          </p>
          <p>
            <strong>Without RFC 9112:</strong> Like having a postal system where 
            every post office interprets addresses, postmarks, and letter formats 
            differently. Some letters get lost, some get misdelivered, and some 
            cause the sorting machines to break.
          </p>
          <p className="mt-2">
            <strong>With RFC 9112:</strong> Like having universal postal standards 
            where every post office worldwide knows exactly how to read addresses, 
            process stamps, handle envelope formats, and route mail efficiently 
            and securely.
          </p>
          <p className="mt-2">
            <strong>The Result:</strong> HTTP/1.1 messages are parsed consistently 
            by all servers and clients, preventing security vulnerabilities and 
            ensuring reliable web communication across all implementations.
          </p>
        </div>
      </ExpandableSection>

      <h2>HTTP/1.1 Message Structure</h2>
      <p>
        RFC 9112 defines the precise structure of HTTP/1.1 messages, specifying 
        exactly how requests and responses must be formatted on the wire:
      </p>

      <MermaidDiagram
        chart={`
graph TB
    subgraph "HTTP/1.1 Request Message"
        RL[Request Line<br/>METHOD URI HTTP/1.1]
        RH[Header Fields<br/>Name: Value]
        RB[Empty Line<br/>CRLF]
        RBody[Message Body<br/>Optional content]
        
        RL --> RH
        RH --> RB
        RB --> RBody
    end
    
    subgraph "HTTP/1.1 Response Message"
        SL[Status Line<br/>HTTP/1.1 CODE PHRASE]
        SH[Header Fields<br/>Name: Value]
        SB[Empty Line<br/>CRLF]
        SBody[Message Body<br/>Optional content]
        
        SL --> SH
        SH --> SB
        SB --> SBody
    end
    
    style RL fill:#e3f2fd
    style SL fill:#e8f5e8
    style RB fill:#fff3e0
    style SB fill:#fff3e0
        `}
        className="my-6"
      />

      <h3>Message Component Rules</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">📝 Request Line Format</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Method:</strong> HTTP method (GET, POST, etc.)</li>
            <li>• <strong>Request Target:</strong> URI or path</li>
            <li>• <strong>HTTP Version:</strong> "HTTP/1.1"</li>
            <li>• <strong>Line Ending:</strong> CRLF (\\r\\n)</li>
          </ul>
          <CodeBlock
            language="text"
            code="GET /api/users HTTP/1.1\\r\\n"
          />
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">📊 Status Line Format</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>HTTP Version:</strong> "HTTP/1.1"</li>
            <li>• <strong>Status Code:</strong> 3-digit number</li>
            <li>• <strong>Reason Phrase:</strong> Human-readable text</li>
            <li>• <strong>Line Ending:</strong> CRLF (\\r\\n)</li>
          </ul>
          <CodeBlock
            language="text"
            code="HTTP/1.1 200 OK\\r\\n"
          />
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">🏷️ Header Field Format</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>Field Name:</strong> Case-insensitive token</li>
            <li>• <strong>Colon:</strong> Separator character</li>
            <li>• <strong>Field Value:</strong> Optional whitespace + value</li>
            <li>• <strong>Line Ending:</strong> CRLF (\\r\\n)</li>
          </ul>
          <CodeBlock
            language="text"
            code="Content-Type: application/json\\r\\n"
          />
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">📦 Message Body Rules</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>Separator:</strong> Empty line (CRLF)</li>
            <li>• <strong>Length:</strong> Content-Length or chunked</li>
            <li>• <strong>Encoding:</strong> Transfer-Encoding if applied</li>
            <li>• <strong>Optional:</strong> May be absent</li>
          </ul>
        </div>
      </div>

      <h2>Connection Management</h2>
      <p>
        RFC 9112 provides precise rules for HTTP/1.1 connection handling, 
        including persistent connections, connection close semantics, and 
        upgrade mechanisms:
      </p>

      <h3>Persistent Connection Behavior</h3>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant Client as HTTP Client
    participant Server as HTTP Server
    
    Note over Client,Server: HTTP/1.1 Persistent Connection
    
    Client->>+Server: GET /page1 HTTP/1.1<br/>Host: example.com<br/>Connection: keep-alive
    Server-->>-Client: HTTP/1.1 200 OK<br/>Content-Length: 1024<br/>Connection: keep-alive<br/>[body]
    
    Note over Client,Server: Same connection reused
    
    Client->>+Server: GET /page2 HTTP/1.1<br/>Host: example.com
    Server-->>-Client: HTTP/1.1 200 OK<br/>Content-Length: 512<br/>[body]
    
    Note over Client,Server: Client closes connection
    
    Client->>+Server: GET /page3 HTTP/1.1<br/>Host: example.com<br/>Connection: close
    Server-->>-Client: HTTP/1.1 200 OK<br/>Connection: close<br/>[body]
    
    Note over Client,Server: Connection closed after response
        `}
        className="my-6"
      />

      <h3>Connection Control Headers</h3>
      <ul>
        <li><strong>Connection: keep-alive:</strong> Request persistent connection (implicit in HTTP/1.1)</li>
        <li><strong>Connection: close:</strong> Close connection after this message</li>
        <li><strong>Connection: upgrade:</strong> Protocol upgrade request</li>
        <li><strong>Keep-Alive:</strong> Connection timeout and max parameters</li>
      </ul>

      <h2>Security Improvements</h2>
      <p>
        RFC 9112 addresses critical security issues that have affected HTTP/1.1 
        implementations, providing clear parsing rules to prevent vulnerabilities:
      </p>

      <div className="bg-yellow-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Security Enhancements</h4>
        <ul className="text-yellow-800 space-y-2">
          <li><strong>Request Smuggling Prevention:</strong> Clear rules for Content-Length vs Transfer-Encoding precedence</li>
          <li><strong>Header Field Parsing:</strong> Precise whitespace and character handling to prevent injection</li>
          <li><strong>Connection Management:</strong> Explicit connection persistence rules to prevent hijacking</li>
          <li><strong>Protocol Upgrade Security:</strong> Secure WebSocket and HTTP/2 upgrade procedures</li>
          <li><strong>Invalid Message Handling:</strong> Standardized error responses for malformed requests</li>
        </ul>
      </div>

      <h3>Request Smuggling Mitigation</h3>
      <p>
        RFC 9112 establishes clear precedence rules to prevent HTTP request 
        smuggling attacks that have plagued web applications:
      </p>

      <div className="bg-red-50 p-4 rounded-lg my-4">
        <h4 className="font-semibold text-red-900 mb-2">⚠️ Conflicting Length Headers</h4>
        <p className="text-red-800 mb-2">
          When both Content-Length and Transfer-Encoding: chunked are present:
        </p>
        <ul className="text-red-800 space-y-1">
          <li>• <strong>RFC 9112 Rule:</strong> Transfer-Encoding takes precedence</li>
          <li>• <strong>Content-Length MUST be removed</strong> by intermediaries</li>
          <li>• <strong>Invalid combinations</strong> should result in 400 Bad Request</li>
          <li>• <strong>Security benefit:</strong> Prevents request smuggling attacks</li>
        </ul>
      </div>

      <ExpandableSection title="🐍 ELI-Pythonista: HTTP/1.1 Message Parser">
        <div className="space-y-4">
          <p>
            Building an HTTP/1.1 parser is like creating a precise document scanner 
            that can read any properly formatted letter and extract all the important 
            information reliably. This Python implementation demonstrates RFC 9112 
            compliant message parsing with security considerations.
          </p>
          
          <CodeBlock
            language="python"
            code={getCodeExample("rfc9112_message_parser")}
          />
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">HTTP/1.1 Parsing in Python</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Strict CRLF handling:</strong> Proper line ending validation</li>
              <li>• <strong>Header field parsing:</strong> RFC-compliant name/value extraction</li>
              <li>• <strong>Content-Length validation:</strong> Numeric validation and consistency</li>
              <li>• <strong>Transfer-Encoding handling:</strong> Chunked encoding support</li>
              <li>• <strong>Security checks:</strong> Request smuggling prevention</li>
              <li>• <strong>Connection management:</strong> Persistent connection handling</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>Transfer Encoding and Content Length</h2>
      <p>
        RFC 9112 provides precise rules for message body framing using either 
        Content-Length or Transfer-Encoding mechanisms:
      </p>

      <h3>Content-Length Framing</h3>
      <CodeBlock
        language="text"
        code={`POST /api/data HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 25

{"name": "John Doe"}`}
      />

      <h3>Chunked Transfer Encoding</h3>
      <CodeBlock
        language="text"
        code={`POST /api/stream HTTP/1.1
Host: example.com
Content-Type: application/json
Transfer-Encoding: chunked

1a
{"chunk": "first part"}
17
{"chunk": "second"}
0

`}
      />

      <h2>Protocol Upgrade Mechanism</h2>
      <p>
        RFC 9112 defines the upgrade mechanism that enables HTTP/1.1 connections 
        to transition to other protocols like WebSocket or HTTP/2:
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant Client as WebSocket Client
    participant Server as HTTP/WebSocket Server
    
    Note over Client,Server: WebSocket Upgrade Request
    
    Client->>+Server: GET /websocket HTTP/1.1<br/>Host: example.com<br/>Upgrade: websocket<br/>Connection: Upgrade<br/>Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==<br/>Sec-WebSocket-Version: 13
    
    Server-->>-Client: HTTP/1.1 101 Switching Protocols<br/>Upgrade: websocket<br/>Connection: Upgrade<br/>Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
    
    Note over Client,Server: Connection upgraded to WebSocket protocol
    
    Client->>Server: WebSocket Frame: "Hello WebSocket!"
    Server->>Client: WebSocket Frame: "Hello Client!"
        `}
        className="my-6"
      />

      <h3>Upgrade Requirements</h3>
      <ul>
        <li><strong>Upgrade Header:</strong> Specify target protocol</li>
        <li><strong>Connection: Upgrade:</strong> Indicate upgrade intent</li>
        <li><strong>101 Switching Protocols:</strong> Successful upgrade response</li>
        <li><strong>Protocol-Specific Headers:</strong> Authentication/negotiation headers</li>
      </ul>

      <h2>Modern Internet Impact: Foundation Protocol</h2>
      <p>
        RFC 9112 ensures the continued reliability and security of HTTP/1.1, 
        which remains widely used alongside HTTP/2 and HTTP/3 for web communication.
      </p>

      <h3>Current HTTP/1.1 Usage</h3>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🌐 Web Infrastructure</h4>
          <ul className="text-blue-800 space-y-1">
            <li>• <strong>Legacy Systems:</strong> Older servers and applications</li>
            <li>• <strong>Simple APIs:</strong> RESTful services without complex requirements</li>
            <li>• <strong>Development Tools:</strong> Testing and debugging utilities</li>
            <li>• <strong>IoT Devices:</strong> Constrained devices with simple HTTP needs</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3">🔧 Development Tooling</h4>
          <ul className="text-green-800 space-y-1">
            <li>• <strong>curl:</strong> Command-line HTTP client</li>
            <li>• <strong>Postman:</strong> API testing and development</li>
            <li>• <strong>Browser DevTools:</strong> Network debugging</li>
            <li>• <strong>Load Testing:</strong> Performance testing tools</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3">🛡️ Security Scanners</h4>
          <ul className="text-purple-800 space-y-1">
            <li>• <strong>Vulnerability Scanners:</strong> Web application security testing</li>
            <li>• <strong>Penetration Testing:</strong> Manual security assessment</li>
            <li>• <strong>Traffic Analysis:</strong> Network monitoring and analysis</li>
            <li>• <strong>Compliance Tools:</strong> Regulatory compliance checking</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-3">📡 Protocol Bridges</h4>
          <ul className="text-orange-800 space-y-1">
            <li>• <strong>HTTP/2 Downgrade:</strong> Fallback for older clients</li>
            <li>• <strong>Proxy Servers:</strong> Gateway and reverse proxy functionality</li>
            <li>• <strong>Load Balancers:</strong> Traffic distribution and health checks</li>
            <li>• <strong>API Gateways:</strong> Protocol translation and routing</li>
          </ul>
        </div>
      </div>

      <h2>Performance Characteristics</h2>
      <p>
        While HTTP/1.1 has performance limitations compared to HTTP/2 and HTTP/3, 
        RFC 9112's precise specifications enable optimizations:
      </p>

      <h3>HTTP/1.1 Optimization Techniques</h3>
      <ul>
        <li><strong>Connection Pooling:</strong> Reuse persistent connections efficiently</li>
        <li><strong>Pipelining:</strong> Send multiple requests without waiting (limited support)</li>
        <li><strong>Compression:</strong> gzip/deflate content encoding</li>
        <li><strong>Chunked Transfer:</strong> Stream large responses without buffering</li>
        <li><strong>Keep-Alive Tuning:</strong> Optimize connection timeout parameters</li>
      </ul>

      <ExpandableSection title="📊 HTTP/1.1 vs Modern Protocols">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Comparison of HTTP protocol versions:</strong>
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h5 className="font-semibold text-blue-900">HTTP/1.1 (RFC 9112)</h5>
              <ul className="text-sm text-blue-800">
                <li>• Text-based protocol</li>
                <li>• One request per connection</li>
                <li>• Header compression: none</li>
                <li>• Server push: not supported</li>
                <li>• Multiplexing: limited</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-green-900">HTTP/2 (RFC 9113)</h5>
              <ul className="text-sm text-green-800">
                <li>• Binary framing protocol</li>
                <li>• Stream multiplexing</li>
                <li>• HPACK header compression</li>
                <li>• Server push supported</li>
                <li>• Better performance</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-purple-900">HTTP/3 (RFC 9114)</h5>
              <ul className="text-sm text-purple-800">
                <li>• QUIC-based transport</li>
                <li>• No head-of-line blocking</li>
                <li>• Built-in encryption</li>
                <li>• 0-RTT connection setup</li>
                <li>• Mobile-optimized</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-600">
            <strong>Use Cases:</strong> HTTP/1.1 remains valuable for simple applications, 
            debugging, legacy compatibility, and constrained environments.
          </p>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🔗 Docker Demonstration: HTTP/1.1 Message Parsing">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="mb-3">
            <strong>Interactive HTTP/1.1 message format demonstration!</strong>
          </p>
          <p>
            The Docker example in <code>docker-examples/rfc9112-http11-messages/</code> 
            demonstrates HTTP/1.1 message parsing, connection management, and security features.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc9112-http11-messages/
docker compose up -d

# Access the message parser demo at:
# http://localhost:8080

# Monitor message parsing:
# docker compose logs -f http11-parser`}
          />
          <p className="mt-3 text-sm">
            Test request/response parsing, connection persistence, transfer encodings, 
            and security validation with various HTTP/1.1 message formats.
          </p>
        </div>
      </ExpandableSection>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Key Takeaways for HTTP/1.1 Message Format
        </h3>
        <ul className="text-blue-800">
          <li>
            RFC 9112 provides the precise wire format specification that ensures 
            consistent HTTP/1.1 message parsing across all implementations
          </li>
          <li>
            Understanding message structure, connection management, and security 
            considerations is essential for building reliable HTTP clients and servers
          </li>
          <li>
            The specification prevents security vulnerabilities like request smuggling 
            through clear parsing rules and precedence definitions
          </li>
          <li>
            HTTP/1.1 remains an important protocol for simple applications, debugging, 
            and compatibility with legacy systems and constrained environments
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
            <a href="https://www.rfc-editor.org/rfc/rfc9112.html" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              RFC 9112: HTTP/1.1 (This document)
            </a>
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