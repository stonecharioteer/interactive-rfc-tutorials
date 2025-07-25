import { Link } from "react-router-dom";
import { ExternalLink, Shield, Lock } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import GlossaryTerm from "../../components/GlossaryTerm";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC4301() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 4301: Security Architecture for the Internet Protocol - December 2005
      </h1>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-semibold text-blue-800">
            Updated IPsec Security Framework
          </span>
        </div>
        <p className="text-blue-700 mb-0">
          RFC 4301 represents the modernized IPsec security architecture that
          powers today's VPN technologies, enterprise networks, and secure
          communications. It introduced refined security policies, enhanced
          selector mechanisms, and improved integration with modern networking.
        </p>
        <p className="text-blue-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc4301.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 4301 PDF <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>Evolution from RFC 2401</h2>
      <p>
        <strong>RFC 4301</strong> replaced{" "}
        <Link to="/rfc/2401" className="text-blue-600 hover:text-blue-800">
          RFC 2401 (1998)
        </Link>{" "}
        with significant architectural improvements based on 7 years of real-world
        IPsec deployment experience. The update addressed implementation challenges,
        clarified ambiguous specifications, and enhanced security policy management.
      </p>

      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg my-6">
        <h3 className="text-lg font-semibold mb-3">Key Improvements in RFC 4301</h3>
        <ul className="text-sm space-y-2">
          <li>✅ <strong>Enhanced Selector Model</strong>: More flexible traffic classification</li>
          <li>✅ <strong>Refined Security Policy Database (SPD)</strong>: Clearer policy processing</li>
          <li>✅ <strong>Improved Fragment Handling</strong>: Better support for fragmented packets</li>
          <li>✅ <strong>Multicast Support</strong>: Explicit multicast security associations</li>
          <li>✅ <strong>Implementation Guidance</strong>: Clearer requirements for implementers</li>
        </ul>
      </div>

      <h2>IPsec Architecture Overview</h2>
      <p>
        IPsec provides security services at the <GlossaryTerm>IP</GlossaryTerm> layer,
        creating a security boundary between protected and unprotected networks.
        It operates by examining each packet and making one of three decisions:
      </p>

      <MermaidDiagram
        chart={`
graph TD
    A[Incoming/Outgoing Packet] --> B{Security Policy Check}
    B --> C[DISCARD - Block packet]
    B --> D[BYPASS - Allow plaintext]
    B --> E[PROTECT - Apply IPsec]
    E --> F[Security Association Lookup]
    F --> G[Apply Encryption/Authentication]
    G --> H[Forward Protected Packet]
    
    style C fill:#ffcccc,stroke:#ff6666
    style D fill:#ffffcc,stroke:#ffcc66
    style E fill:#ccffcc,stroke:#66cc66
        `}
      />
      <p className="text-sm text-gray-600 text-center mt-2">IPsec Packet Processing Decision Flow</p>

      <h3>Core IPsec Components</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900 flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Security Policy Database (SPD)
          </h4>
          <p className="text-blue-800 text-sm mt-2">
            Defines security policies for traffic processing. Determines which
            packets receive IPsec protection and which security services to apply.
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security Association Database (SAD)
          </h4>
          <p className="text-green-800 text-sm mt-2">
            Contains parameters for active security associations including
            cryptographic algorithms, keys, and lifetime information.
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded">
          <h4 className="font-semibold text-purple-900">🔐 Authentication Header (AH)</h4>
          <p className="text-purple-800 text-sm mt-2">
            Provides data origin authentication, data integrity, and anti-replay
            protection without confidentiality.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h4 className="font-semibold text-yellow-900">🛡️ Encapsulating Security Payload (ESP)</h4>
          <p className="text-yellow-800 text-sm mt-2">
            Provides confidentiality through encryption, plus optional
            authentication and anti-replay protection.
          </p>
        </div>
      </div>

      <h2>Security Policy Management</h2>
      <p>
        The <GlossaryTerm>SPD</GlossaryTerm> is central to IPsec operation,
        containing ordered policies that determine how traffic is processed.
        Each policy entry includes selectors and corresponding actions.
      </p>

      <ExpandableSection title="Selector Fields in RFC 4301">
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-3">Traffic Classification Selectors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold text-blue-800">Network Layer</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Source/Destination IP addresses</li>
                <li>IP protocol number</li>
                <li>DSCP values</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-green-800">Transport Layer</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Source/Destination ports</li>
                <li>ICMP message types</li>
                <li>Mobility header types</li>
              </ul>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <h3>Security Association (SA) Management</h3>
      <p>
        Security Associations define the security parameters for communication
        between two entities. Each SA is unidirectional and identified by a
        Security Parameter Index (SPI), destination IP address, and security protocol.
      </p>

      <ExpandableSection title="🐍 ELI-Pythonista: Security Association Management">
        <div className="space-y-4">
          <p>
            Think of Security Associations as "contracts" between network endpoints that specify
            exactly how to secure their communication. Each SA is like a detailed security 
            agreement that includes encryption methods, keys, and operational parameters.
          </p>
          
          <CodeBlock 
            code={getCodeExample("rfc4301_security_association")}
            language="python"
          />
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">Key IPsec Concepts</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Security Parameter Index (SPI):</strong> Unique identifier for each SA</li>
              <li>• <strong>Unidirectional:</strong> Separate SAs needed for each direction</li>
              <li>• <strong>Lifetime Management:</strong> SAs expire and must be renewed</li>
              <li>• <strong>Algorithm Negotiation:</strong> Endpoints agree on encryption methods</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>Operating Modes</h2>
      <p>
        IPsec operates in two modes, each providing different levels of protection
        and suitable for different network architectures:
      </p>

      <MermaidDiagram
        chart={`
graph LR
    subgraph "Transport Mode"
        A1[Original IP Header] --> B1[IPsec Header]
        B1 --> C1[Payload Data]
    end
    
    subgraph "Tunnel Mode"
        A2[New IP Header] --> B2[IPsec Header]
        B2 --> C2[Original IP Header]
        C2 --> D2[Payload Data]
    end
    
    style A1 fill:#e1f5fe
    style A2 fill:#f3e5f5
    style B1 fill:#ffecb3
    style B2 fill:#ffecb3
        `}
      />
      <p className="text-sm text-gray-600 text-center mt-2">Transport Mode vs Tunnel Mode Packet Structure</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-3">🚌 Transport Mode</h4>
          <p className="text-blue-800 text-sm mb-3">
            Protects the payload while preserving the original IP routing information.
            Used for end-to-end communication between hosts.
          </p>
          <div className="bg-blue-100 p-2 rounded text-xs">
            <strong>Use Cases:</strong>
            <ul className="list-disc list-inside mt-1">
              <li>Host-to-host secure communication</li>
              <li>Application-layer VPN clients</li>
              <li>Minimal packet overhead requirements</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-3">🌐 Tunnel Mode</h4>
          <p className="text-green-800 text-sm mb-3">
            Encapsulates the entire original packet within a new IP packet.
            Commonly used for site-to-site VPNs and security gateways.
          </p>
          <div className="bg-green-100 p-2 rounded text-xs">
            <strong>Use Cases:</strong>
            <ul className="list-disc list-inside mt-1">
              <li>Site-to-site VPN connections</li>
              <li>Remote access VPN servers</li>
              <li>Traffic flow confidentiality</li>
            </ul>
          </div>
        </div>
      </div>

      <ExpandableSection title="🐍 ELI-Pythonista: IPsec Security Architecture">
        <div className="space-y-4">
          <p>
            IPsec can seem complex, but understanding it through code makes the concepts clear.
            Think of IPsec as a security framework that sits between your application and the network,
            making decisions about every packet that flows through.
          </p>

          <h4 className="font-semibold text-gray-800">Security Association Management</h4>
          <p>
            Security Associations (SAs) are like "contracts" between two network endpoints that define
            exactly how to protect their communication. Each SA specifies the encryption algorithm,
            keys, and other security parameters.
          </p>

          <CodeBlock 
            code={getCodeExample("rfc4301_security_association")}
            language="python"
          />

          <h4 className="font-semibold text-gray-800 mt-6">Policy Configuration</h4>
          <p>
            The Security Policy Database (SPD) acts like a firewall rule set, but for IPsec.
            For each packet, it decides: "Should I drop this, let it pass, or encrypt it?"
            This is where network administrators define their security requirements.
          </p>

          <CodeBlock 
            code={getCodeExample("rfc4301_policy_configuration")}
            language="python"
          />

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">Key Python Concepts Demonstrated</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Dataclasses:</strong> Clean representation of IPsec structures</li>
              <li>• <strong>Enums:</strong> Type-safe policy actions and modes</li>
              <li>• <strong>Network programming:</strong> IP address validation and CIDR handling</li>
              <li>• <strong>Security patterns:</strong> Key management and policy enforcement</li>
              <li>• <strong>Enterprise architecture:</strong> Scalable security policy design</li>
            </ul>
          </div>
        </div>
      </ExpandableSection>

      <h2>Docker Demonstration</h2>
      <p>
        Experience IPsec in action with our comprehensive Docker environment that
        demonstrates both transport and tunnel modes with real traffic protection.
      </p>

      <ExpandableSection title="🐳 Interactive IPsec Demo">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-700 text-sm mb-3">
            The Docker demonstration shows IPsec policy configuration, SA establishment,
            and encrypted communication between hosts and gateways.
          </p>
          <CodeBlock
            language="bash"
            code={`cd docker-examples/rfc4301-ipsec-architecture
docker compose up -d

# Watch IPsec tunnel establishment
docker logs -f ipsec-gateway-a

# Monitor policy database changes
docker exec ipsec-gateway-a ip xfrm policy

# View security associations
docker exec ipsec-gateway-a ip xfrm state`}
          />
          <p className="mt-3 text-sm text-green-600">
            The demonstration includes gateway configuration, tunnel establishment,
            and real-time monitoring of IPsec security associations and policies.
          </p>
        </div>
      </ExpandableSection>

      <h2>Modern Internet Context</h2>

      <ExpandableSection title="IPsec in Today's Network Infrastructure">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Current Usage Statistics (2025)</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>90%+ of enterprise VPN deployments</strong> use IPsec for site-to-site connectivity</li>
              <li>• <strong>Cloud providers</strong> like AWS, Azure, GCP all provide IPsec VPN gateways</li>
              <li>• <strong>Mobile networks</strong> use IPsec for secure backhaul communications</li>
              <li>• <strong>IoT security</strong> increasingly adopts lightweight IPsec implementations</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">Modern Alternatives & Competition</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>WireGuard:</strong> Simpler, faster VPN protocol gaining enterprise adoption</li>
              <li>• <strong>OpenVPN:</strong> SSL/TLS-based VPN popular for remote access</li>
              <li>• <strong>QUIC:</strong> Application-layer security reducing need for network-layer protection</li>
              <li>• <strong>mTLS:</strong> Mutual TLS providing application-specific security</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Future Outlook</h4>
            <p className="text-sm text-green-700">
              While newer protocols challenge IPsec in specific use cases, its standardization,
              hardware acceleration support, and deep integration into networking equipment
              ensure continued relevance. The rise of quantum-resistant cryptography will
              likely extend IPsec's lifecycle through algorithm updates rather than replacement.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-semibold text-purple-800 mb-2">Industry Impact</h4>
            <p className="text-sm text-purple-700">
              IPsec enabled the modern internet's security infrastructure by providing
              transparent network-layer protection. Its influence extends beyond VPNs to
              secure tunneling protocols, cloud interconnectivity, and the foundation
              for zero-trust network architectures.
            </p>
          </div>
        </div>
      </ExpandableSection>

      <h2>Key Learning Objectives</h2>
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">After studying RFC 4301, you should understand:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Core Concepts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>IPsec security policy framework</li>
              <li>Security Association management</li>
              <li>Transport vs tunnel mode differences</li>
              <li>Selector-based traffic classification</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Practical Skills</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Configuring IPsec policies</li>
              <li>Understanding VPN architectures</li>
              <li>Troubleshooting IPsec connections</li>
              <li>Choosing appropriate security modes</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-8">
        <h3 className="font-semibold text-blue-800 mb-2">Continue Your IPsec Journey</h3>
        <p className="text-blue-700 text-sm mb-3">
          Ready to dive deeper into IPsec implementation details? Explore the
          Encapsulating Security Payload (ESP) protocol for hands-on encryption experience.
        </p>
        <Link
          to="/rfc/4303"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          RFC 4303: ESP Implementation →
        </Link>
      </div>
    </article>
  );
}