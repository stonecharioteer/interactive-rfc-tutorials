import { Link } from "react-router-dom";
import { ExternalLink, Lock, Shield, Key } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import GlossaryTerm from "../../components/GlossaryTerm";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC4303() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 4303: IP Encapsulating Security Payload (ESP) - December 2005
      </h1>
      <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <Lock className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-semibold text-green-800">
            IPsec Encryption & Authentication Protocol
          </span>
        </div>
        <p className="text-green-700 mb-0">
          ESP is the core IPsec protocol that provides confidentiality through
          encryption, data origin authentication, and anti-replay protection.
          It's the foundation of virtually every VPN connection and secure
          network tunnel in use today.
        </p>
        <p className="text-green-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc4303.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 4303 PDF <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>The Role of ESP in IPsec</h2>
      <p>
        <strong>Encapsulating Security Payload (ESP)</strong> is one of two main
        IPsec protocols, alongside{" "}
        <GlossaryTerm>AH</GlossaryTerm> (Authentication Header). While AH
        provides only authentication and integrity, ESP delivers the complete
        security package that modern applications require.
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h3 className="text-lg font-semibold mb-3">ESP vs AH Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-100 p-3 rounded">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              ESP (RFC 4303)
            </h4>
            <ul className="text-green-700 space-y-1">
              <li>✅ <strong>Confidentiality</strong>: Encrypts payload data</li>
              <li>✅ <strong>Authentication</strong>: Verifies data origin</li>
              <li>✅ <strong>Integrity</strong>: Detects tampering</li>
              <li>✅ <strong>Anti-replay</strong>: Prevents replay attacks</li>
            </ul>
          </div>
          <div className="bg-blue-100 p-3 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">AH (Authentication Header)</h4>
            <ul className="text-blue-700 space-y-1">
              <li>❌ <strong>Confidentiality</strong>: No encryption</li>
              <li>✅ <strong>Authentication</strong>: Verifies data origin</li>
              <li>✅ <strong>Integrity</strong>: Detects tampering</li>
              <li>✅ <strong>Anti-replay</strong>: Prevents replay attacks</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>ESP Packet Structure</h2>
      <p>
        Understanding ESP packet format is crucial for implementing and
        troubleshooting IPsec communications. ESP wraps the original payload
        with security headers and trailers.
      </p>

      <MermaidDiagram
        chart={`
graph TD
    subgraph "ESP Packet Structure"
        A[ESP Header] --> B[Initialization Vector]
        B --> C[Encrypted Payload Data]
        C --> D[Padding]
        D --> E[Pad Length]
        E --> F[Next Header]
        F --> G[Authentication Data]
    end
    
    subgraph "ESP Header (8 bytes)"
        H[Security Parameter Index - SPI] --> I[Sequence Number]
    end
    
    A -.-> H
    
    style A fill:#ffcccc,stroke:#ff6666
    style G fill:#ccffcc,stroke:#66cc66
    style C fill:#ffffcc,stroke:#ffcc66
        `}
      />
      <p className="text-sm text-gray-600 text-center mt-2">ESP Packet Format (RFC 4303)</p>

      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-3">ESP Field Descriptions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">Header Fields</h5>
            <ul className="space-y-2">
              <li><strong>SPI (4 bytes):</strong> Security Parameter Index identifies the SA</li>
              <li><strong>Sequence Number (4 bytes):</strong> Anti-replay protection counter</li>
              <li><strong>IV (variable):</strong> Initialization Vector for encryption</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-green-800 mb-2">Trailer Fields</h5>
            <ul className="space-y-2">
              <li><strong>Padding:</strong> Aligns data to cipher block boundaries</li>
              <li><strong>Pad Length (1 byte):</strong> Number of padding bytes</li>
              <li><strong>Next Header (1 byte):</strong> Protocol of protected data</li>
              <li><strong>ICV (variable):</strong> Integrity Check Value (authentication)</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Security Services Provided</h2>
      <p>
        ESP can provide different combinations of security services depending
        on configuration. <Link to="/rfcs/4301" className="text-blue-600 hover:text-blue-800">RFC 4301</Link> defines
        which combinations are mandatory and optional.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 flex items-center mb-3">
            <Lock className="h-4 w-4 mr-2" />
            Confidentiality Only
          </h4>
          <p className="text-yellow-800 text-sm mb-2">
            Encryption without authentication. <strong>Not recommended</strong>
            due to vulnerability to tampering attacks.
          </p>
          <div className="bg-yellow-100 p-2 rounded text-xs">
            <strong>Use Case:</strong> Legacy systems with separate authentication
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900 flex items-center mb-3">
            <Shield className="h-4 w-4 mr-2" />
            Authentication Only
          </h4>
          <p className="text-blue-800 text-sm mb-2">
            Data integrity and origin authentication without encryption.
            <strong>Must be supported</strong> by all implementations.
          </p>
          <div className="bg-blue-100 p-2 rounded text-xs">
            <strong>Use Case:</strong> Internal networks requiring integrity only
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900 flex items-center mb-3">
            <Key className="h-4 w-4 mr-2" />
            Combined Security
          </h4>
          <p className="text-green-800 text-sm mb-2">
            Both confidentiality and authentication. <strong>Must be supported</strong>
            and is the recommended configuration.
          </p>
          <div className="bg-green-100 p-2 rounded text-xs">
            <strong>Use Case:</strong> Internet-facing VPNs and secure tunnels
          </div>
        </div>
      </div>

      <h2>Cryptographic Algorithms</h2>
      <p>
        ESP supports various encryption and authentication algorithms. Modern
        implementations favor <GlossaryTerm>AEAD</GlossaryTerm> (Authenticated
        Encryption with Associated Data) ciphers that provide both services in
        a single operation.
      </p>

      <ExpandableSection title="Common ESP Algorithm Combinations">
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Modern AEAD Ciphers (Recommended)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-1">AES-GCM</h5>
                <p className="text-gray-700">Advanced Encryption Standard with Galois/Counter Mode</p>
                <ul className="list-disc list-inside text-xs text-gray-600 mt-1">
                  <li>High performance with hardware acceleration</li>
                  <li>Built-in authentication</li>
                  <li>Widely supported</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-1">ChaCha20-Poly1305</h5>
                <p className="text-gray-700">Stream cipher optimized for software</p>
                <ul className="list-disc list-inside text-xs text-gray-600 mt-1">
                  <li>Excellent software performance</li>
                  <li>Resistant to timing attacks</li>
                  <li>Mobile-friendly</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Traditional Combinations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-1">AES-CBC + HMAC-SHA256</h5>
                <p className="text-gray-700">Separate encryption and authentication</p>
                <ul className="list-disc list-inside text-xs text-gray-600 mt-1">
                  <li>Mature and well-tested</li>
                  <li>Universal compatibility</li>
                  <li>Higher computational overhead</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-1">3DES + HMAC-SHA1</h5>
                <p className="text-gray-700">Legacy combination (deprecated)</p>
                <ul className="list-disc list-inside text-xs text-gray-600 mt-1">
                  <li>Slow and insecure</li>
                  <li>Only for legacy interoperability</li>
                  <li>Should be avoided</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <h2>Transport vs Tunnel Mode in ESP</h2>
      <p>
        ESP operates in the same two modes as defined in RFC 4301, but the
        packet encapsulation differs based on what data is being protected.
      </p>

      <MermaidDiagram
        chart={`
graph LR
    subgraph "Transport Mode ESP"
        A1[Original IP Header] --> B1[ESP Header]
        B1 --> C1[TCP/UDP Header + Data]
        C1 --> D1[ESP Trailer + ICV]
    end
    
    subgraph "Tunnel Mode ESP"
        A2[New IP Header] --> B2[ESP Header]
        B2 --> C2[Original IP Header + TCP/UDP + Data]
        C2 --> D2[ESP Trailer + ICV]
    end
    
    style B1 fill:#ffecb3
    style B2 fill:#ffecb3
    style C1 fill:#e1f5fe
    style C2 fill:#f3e5f5
    style D1 fill:#ccffcc
    style D2 fill:#ccffcc
        `}
      />
      <p className="text-sm text-gray-600 text-center mt-2">ESP Modes: Transport vs Tunnel Encapsulation</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-3">🚌 Transport Mode ESP</h4>
          <p className="text-blue-800 text-sm mb-3">
            ESP header inserted between IP header and transport layer.
            Only the payload is encrypted and authenticated.
          </p>
          <div className="bg-blue-100 p-2 rounded text-xs">
            <strong>Protected:</strong> TCP/UDP payload<br/>
            <strong>Visible:</strong> Original IP header, routing info<br/>
            <strong>Overhead:</strong> ~25-50 bytes per packet
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-3">🌐 Tunnel Mode ESP</h4>
          <p className="text-green-800 text-sm mb-3">
            Entire original packet encrypted within new IP packet.
            Provides traffic flow confidentiality.
          </p>
          <div className="bg-green-100 p-2 rounded text-xs">
            <strong>Protected:</strong> Entire original packet<br/>
            <strong>Visible:</strong> Only tunnel endpoint addresses<br/>
            <strong>Overhead:</strong> ~45-70 bytes per packet
          </div>
        </div>
      </div>

      <h2>Anti-Replay Protection</h2>
      <p>
        ESP implements sophisticated anti-replay protection using sequence
        numbers and sliding window verification to prevent attackers from
        capturing and retransmitting packets.
      </p>

      <CodeBlock 
        code={getCodeExample("rfc4303_esp_implementation")}
        language="python"
      />

      <h3>Sequence Number Management</h3>
      <p>
        The sequence number field in ESP provides critical security against
        replay attacks. Understanding its operation is essential for proper
        ESP implementation.
      </p>

      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-3">Anti-Replay Window Operation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">Sender Behavior</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>Initialize sequence number to 1</li>
              <li>Increment for each ESP packet</li>
              <li>Never reuse sequence numbers</li>
              <li>Establish new SA when approaching 2³²</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-green-800 mb-2">Receiver Behavior</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>Maintain sliding window (default 64 packets)</li>
              <li>Track highest sequence number received</li>
              <li>Reject packets outside window</li>
              <li>Reject previously seen sequence numbers</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Practical ESP Implementation</h2>
      <p>
        Implementing ESP requires careful attention to cryptographic operations,
        padding calculations, and authentication verification. The following
        example demonstrates core ESP processing.
      </p>

      <CodeBlock 
        code={getCodeExample("rfc4303_esp_processing")}
        language="python"
      />

      <h2>Docker Demonstration</h2>
      <p>
        Experience ESP encryption and decryption in real-time with our
        comprehensive Docker environment that shows ESP packet processing,
        algorithm comparison, and performance analysis.
      </p>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
        <h4 className="font-semibold text-green-800 mb-2">
          🐳 Interactive ESP Demo
        </h4>
        <p className="text-green-700 text-sm mb-3">
          The Docker demonstration shows ESP packet encryption/decryption,
          algorithm comparisons, and performance benchmarking with different
          cipher suites.
        </p>
        <div className="bg-green-100 p-3 rounded">
          <code className="text-sm">
            cd docker-examples/rfc4303-esp<br/>
            docker-compose up -d<br/>
            # Watch ESP packet processing<br/>
            docker logs -f esp-gateway
          </code>
        </div>
      </div>

      <h2>Performance Considerations</h2>
      <p>
        ESP performance depends heavily on the chosen cryptographic algorithms
        and available hardware acceleration. Modern systems provide significant
        optimizations for common algorithms.
      </p>

      <ExpandableSection title="ESP Performance Optimization">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Hardware Acceleration</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>AES-NI:</strong> Intel/AMD hardware AES acceleration (10-20x speedup)</li>
              <li>• <strong>ARM Crypto Extensions:</strong> Mobile/embedded acceleration</li>
              <li>• <strong>Dedicated IPsec ASICs:</strong> High-end network equipment</li>
              <li>• <strong>GPU Acceleration:</strong> Parallel encryption for high throughput</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">Algorithm Performance (Typical)</h4>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Algorithm</th>
                    <th className="text-left p-2">Software (MB/s)</th>
                    <th className="text-left p-2">Hardware (MB/s)</th>
                    <th className="text-left p-2">Overhead</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b">
                    <td className="p-2">AES-128-GCM</td>
                    <td className="p-2">400-800</td>
                    <td className="p-2">2000-5000</td>
                    <td className="p-2">28 bytes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">ChaCha20-Poly1305</td>
                    <td className="p-2">600-1200</td>
                    <td className="p-2">800-1500</td>
                    <td className="p-2">32 bytes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">AES-256-CBC+SHA256</td>
                    <td className="p-2">200-400</td>
                    <td className="p-2">1000-2000</td>
                    <td className="p-2">48 bytes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <h2>Modern Internet Context</h2>

      <ExpandableSection title="ESP in Today's Network Infrastructure">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Current Usage Statistics (2025)</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>99% of IPsec VPNs</strong> use ESP rather than AH for encryption</li>
              <li>• <strong>AES-GCM dominates</strong> modern ESP implementations (80%+ market share)</li>
              <li>• <strong>Cloud VPN gateways</strong> process billions of ESP packets daily</li>
              <li>• <strong>Mobile networks</strong> use ESP for backhaul and roaming security</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">Evolution & Improvements</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>AEAD ciphers</strong> replaced separate encryption + authentication</li>
              <li>• <strong>Extended Sequence Numbers</strong> (64-bit) for high-speed links</li>
              <li>• <strong>ESP-in-UDP</strong> encapsulation for NAT traversal</li>
              <li>• <strong>Post-quantum cryptography</strong> preparations for quantum resistance</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Industry Applications</h4>
            <p className="text-sm text-green-700">
              ESP powers critical infrastructure including financial networks,
              healthcare systems, government communications, and industrial
              control systems. Its combination of strong encryption and
              authentication makes it the gold standard for network-layer security.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-semibold text-purple-800 mb-2">Future Outlook</h4>
            <p className="text-sm text-purple-700">
              ESP will continue evolving with new cryptographic algorithms,
              particularly post-quantum resistant ciphers. Integration with
              emerging technologies like QUIC and improvements in hardware
              acceleration ensure ESP remains relevant for decades to come.
            </p>
          </div>
        </div>
      </ExpandableSection>

      <h2>Key Learning Objectives</h2>
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">After studying RFC 4303, you should understand:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Technical Concepts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>ESP packet structure and field purposes</li>
              <li>Encryption and authentication operations</li>
              <li>Anti-replay protection mechanisms</li>
              <li>Transport vs tunnel mode differences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Practical Skills</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Choosing appropriate ESP algorithms</li>
              <li>Configuring ESP security associations</li>
              <li>Troubleshooting ESP connectivity issues</li>
              <li>Performance optimization techniques</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-8">
        <h3 className="font-semibold text-blue-800 mb-2">Continue Your Security Journey</h3>
        <p className="text-blue-700 text-sm mb-3">
          Ready to explore more advanced networking protocols? Learn about TURN
          relay mechanisms for NAT traversal in challenging network scenarios.
        </p>
        <Link
          to="/rfcs/8656"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          RFC 8656: TURN Relay Protocol →
        </Link>
      </div>
    </article>
  );
}