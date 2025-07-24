import { Link } from "react-router-dom";
import { ExternalLink, Router, Wifi } from "lucide-react";
import { getCodeExample } from "../../utils/codeReader";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";
import MermaidDiagram from "../../components/MermaidDiagram";

export default function RFC8656() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 8656: Traversal Using Relays around NAT (TURN) - February 2020
      </h1>
      <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-8">
        <div className="flex items-center mb-2">
          <Router className="h-5 w-5 text-purple-600 mr-2" />
          <span className="font-semibold text-purple-800">
            NAT Traversal Relay Protocol
          </span>
        </div>
        <p className="text-purple-700 mb-0">
          TURN provides relay functionality when direct peer-to-peer connections
          fail, ensuring reliable communication even through the most restrictive
          NATs and firewalls. It's the fallback mechanism that makes WebRTC,
          VoIP, and real-time applications work universally.
        </p>
        <p className="text-purple-600 text-sm mt-2">
          <strong>Read the original:</strong>{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc8656.html"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 8656 PDF <ExternalLink className="inline h-3 w-3" />
          </a>
        </p>
      </div>

      <h2>The Problem TURN Solves</h2>
      <p>
        While{" "}
        <Link to="/rfcs/5389" className="text-blue-600 hover:text-blue-800">
          STUN (RFC 5389)
        </Link>{" "}
        and{" "}
        <Link to="/rfcs/8445" className="text-blue-600 hover:text-blue-800">
          ICE (RFC 8445)
        </Link>{" "}
        enable direct peer-to-peer connections in many scenarios, some network
        configurations make direct communication impossible. <strong>TURN</strong>{" "}
        provides the critical fallback mechanism by relaying traffic through an
        intermediate server.
      </p>

      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg my-6">
        <h3 className="text-lg font-semibold mb-3">When Direct Connection Fails</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-red-800 mb-2">Challenging Scenarios</h4>
            <ul className="list-disc list-inside space-y-1 text-red-700">
              <li>Symmetric NATs on both endpoints</li>
              <li>Corporate firewalls blocking UDP</li>
              <li>Multiple layers of NAT (carrier-grade NAT)</li>
              <li>Networks with strict port filtering</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">TURN Solution</h4>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>Provides relay address for communication</li>
              <li>Works through any firewall/NAT</li>
              <li>Maintains connection state</li>
              <li>Supports authentication and permissions</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>TURN Architecture Overview</h2>
      <p>
        TURN creates a relay allocation on a server, providing a public address
        that peers can use to communicate. The TURN server forwards data between
        the client and its peers.
      </p>

      <MermaidDiagram
        chart={`
graph TD
    subgraph "Client Network (Behind NAT)"
        A[TURN Client<br/>192.168.1.100]
    end
    
    subgraph "Internet"
        B[TURN Server<br/>203.0.113.1:3478]
        C[Relay Address<br/>203.0.113.1:49152]
    end
    
    subgraph "Peer Network" 
        D[Peer<br/>198.51.100.50]
    end
    
    A -->|1. Allocate Request| B
    B -->|2. Allocate Success<br/>Relay Address| A
    A -->|3. Create Permission<br/>for Peer IP| B
    D -->|4. Send to Relay Address| C
    C -->|5. Relay to Client| A
    A -->|6. Send via TURN| B
    B -->|7. Forward to Peer| D
    
    style B fill:#e1f5fe
    style C fill:#f3e5f5
    style A fill:#fff3e0
    style D fill:#e8f5e8
        `}
      />
      <p className="text-sm text-gray-600 text-center mt-2">TURN Relay Communication Flow</p>

      <h3>Key TURN Components</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900 flex items-center">
            <Router className="h-4 w-4 mr-2" />
            TURN Server
          </h4>
          <p className="text-blue-800 text-sm mt-2">
            Provides relay functionality, manages allocations, and enforces
            permissions. Typically deployed in public cloud infrastructure.
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900 flex items-center">
            <Wifi className="h-4 w-4 mr-2" />
            Relay Transport Address
          </h4>
          <p className="text-green-800 text-sm mt-2">
            Public IP address and port allocated by TURN server for the client.
            Peers send data to this address to reach the client.
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded">
          <h4 className="font-semibold text-purple-900">🔐 Permissions</h4>
          <p className="text-purple-800 text-sm mt-2">
            Security mechanism preventing unauthorized relay usage. Only
            permitted peer IP addresses can send data through the relay.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h4 className="font-semibold text-yellow-900">📡 Channels</h4>
          <p className="text-yellow-800 text-sm mt-2">
            Optimized data transmission mechanism using channel numbers instead
            of full TURN headers for reduced overhead.
          </p>
        </div>
      </div>

      <h2>TURN Message Types</h2>
      <p>
        TURN extends the STUN protocol with additional message types for relay
        management. Understanding these messages is essential for implementing
        TURN clients and servers.
      </p>

      <ExpandableSection title="TURN Protocol Messages">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Allocation Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-1">Allocate Request/Response</h5>
                <p className="text-gray-700">Creates new relay allocation on TURN server</p>
              </div>
              <div>
                <h5 className="font-semibold mb-1">Refresh Request/Response</h5>
                <p className="text-gray-700">Extends lifetime of existing allocation</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Permission Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-1">CreatePermission Request/Response</h5>
                <p className="text-gray-700">Authorizes peer IP to send data to relay</p>
              </div>
              <div>
                <h5 className="font-semibold mb-1">ChannelBind Request/Response</h5>
                <p className="text-gray-700">Binds channel number to peer address for efficiency</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-semibold text-purple-800 mb-2">Data Transmission</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-1">Send Indication</h5>
                <p className="text-gray-700">Client sends data to peer via TURN server</p>
              </div>
              <div>
                <h5 className="font-semibold mb-1">Data Indication</h5>
                <p className="text-gray-700">Server forwards peer data to client</p>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      <h2>Data Transmission Methods</h2>
      <p>
        TURN provides two methods for data transmission, each optimized for
        different use cases and performance requirements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-3">📤 Send/Data Indications</h4>
          <p className="text-blue-800 text-sm mb-3">
            Uses STUN indication messages to encapsulate data. Each packet
            includes full TURN headers with peer address information.
          </p>
          <div className="bg-blue-100 p-2 rounded text-xs">
            <strong>Overhead:</strong> ~36 bytes per packet<br/>
            <strong>Flexibility:</strong> Can send to any permitted peer<br/>
            <strong>Setup:</strong> No additional setup required
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-3">📡 Channel Data</h4>
          <p className="text-green-800 text-sm mb-3">
            Uses 4-byte channel headers instead of full STUN headers. Requires
            channel binding but provides lower overhead for high-volume data.
          </p>
          <div className="bg-green-100 p-2 rounded text-xs">
            <strong>Overhead:</strong> ~4 bytes per packet<br/>
            <strong>Efficiency:</strong> 90% reduction in header overhead<br/>
            <strong>Setup:</strong> Requires ChannelBind request
          </div>
        </div>
      </div>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant C as Client
    participant T as TURN Server  
    participant P as Peer
    
    Note over C,P: Method 1: Send/Data Indications
    C->>T: Send Indication (to Peer IP)
    T->>P: Forward data with source=Relay
    P->>T: Send to Relay Address
    T->>C: Data Indication (from Peer IP)
    
    Note over C,P: Method 2: Channel Data (after ChannelBind)
    C->>T: ChannelData (Channel #0x4000)
    T->>P: Forward data with source=Relay
    P->>T: Send to Relay Address  
    T->>C: ChannelData (Channel #0x4000)
        `}
      />
      <p className="text-sm text-gray-600 text-center mt-2">TURN Data Transmission Methods</p>

      <h2>Authentication and Security</h2>
      <p>
        TURN implements comprehensive security mechanisms to prevent unauthorized
        relay usage and protect against various attack vectors.
      </p>

      <div className="bg-red-50 border border-red-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-red-800 mb-2">⚠️ Security Considerations</h4>
        <p className="text-red-700 text-sm mb-3">
          TURN servers can be abused for traffic amplification attacks or
          unauthorized network access. Proper authentication and rate limiting
          are essential.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <h5 className="font-semibold">Protection Mechanisms</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>Username/password authentication</li>
              <li>Time-limited credentials</li>
              <li>Permission-based peer filtering</li>
              <li>Allocation quotas per user</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Attack Mitigation</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>Rate limiting on allocations</li>
              <li>Bandwidth throttling</li>
              <li>Source IP validation</li>
              <li>Allocation lifetime limits</li>
            </ul>
          </div>
        </div>
      </div>

      <ExpandableSection title="🐍 ELI-Pythonista: TURN Relay Implementation">
        <div className="space-y-4">
          <p>
            TURN is like having a helpful friend in the middle of the internet who's willing to
            forward your messages when you can't talk directly to someone. The TURN server acts
            as this relay, but with strict security rules about who can use it and for what.
          </p>

          <h4 className="font-semibold text-gray-800">Understanding TURN Allocations</h4>
          <p>
            Think of a TURN allocation like renting a P.O. Box at the post office. You get a
            public address (the relay address) that others can send mail to, and the post office
            (TURN server) forwards it to your real address. But unlike a P.O. Box, you can
            control exactly who is allowed to send you mail.
          </p>

          <h4 className="font-semibold text-gray-800 mt-4">TURN Protocol Implementation</h4>
          <p>
            This implementation shows how TURN clients allocate relay addresses, manage permissions,
            and transmit data efficiently. It demonstrates both Send/Data Indications (full headers)
            and Channel Data (compact 4-byte headers) for different use cases.
          </p>

          <CodeBlock 
            code={getCodeExample("rfc8656_turn_client")}
            language="python"
          />

          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-purple-800 mb-2">Key Python Concepts Demonstrated</h5>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• <strong>Async networking:</strong> Non-blocking socket operations with asyncio</li>
              <li>• <strong>Protocol implementation:</strong> STUN/TURN message parsing and creation</li>
              <li>• <strong>Binary protocols:</strong> Struct packing for network byte order</li>
              <li>• <strong>State management:</strong> Tracking allocations, permissions, and channels</li>
              <li>• <strong>Error handling:</strong> Network timeouts and protocol error responses</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-blue-800 mb-2">Integration with ICE</h5>
            <p className="text-sm text-blue-700">
              In real applications, TURN relay addresses become ICE "relay candidates" that are
              tested alongside direct and server-reflexive candidates. The ICE framework
              automatically chooses the best working path, using TURN only when necessary.
            </p>
          </div>
        </div>
      </ExpandableSection>

      <h2>Docker Demonstration</h2>
      <p>
        Experience TURN relay functionality with our comprehensive Docker
        environment that demonstrates relay allocation, permission management,
        and data forwarding in challenging network scenarios.
      </p>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
        <h4 className="font-semibold text-green-800 mb-2">
          🐳 Interactive TURN Demo
        </h4>
        <p className="text-green-700 text-sm mb-3">
          The Docker demonstration shows TURN relay setup, client communication
          through restrictive NATs, and performance comparison with direct connections.
        </p>
        <div className="bg-green-100 p-3 rounded">
          <code className="text-sm">
            cd docker-examples/rfc8656-turn<br/>
            docker-compose up -d<br/>
            # Watch TURN relay allocation<br/>
            docker logs -f turn-server
          </code>
        </div>
      </div>

      <h2>Performance Impact</h2>
      <p>
        While TURN provides universal connectivity, the relay mechanism introduces
        latency and bandwidth costs. Understanding these trade-offs is crucial
        for application design.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-800 mb-3">TURN Performance Characteristics</h4>
        <div className="overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Metric</th>
                <th className="text-left p-2">Direct P2P</th>
                <th className="text-left p-2">TURN Relay</th>
                <th className="text-left p-2">Impact</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b">
                <td className="p-2">Latency</td>
                <td className="p-2">10-50ms</td>
                <td className="p-2">50-200ms</td>
                <td className="p-2">+2x server roundtrip</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Bandwidth Cost</td>
                <td className="p-2">None</td>
                <td className="p-2">2x data volume</td>
                <td className="p-2">Server processes all data</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Reliability</td>
                <td className="p-2">NAT dependent</td>
                <td className="p-2">99%+ success</td>
                <td className="p-2">Works through any firewall</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Modern Internet Context</h2>

      <ExpandableSection title="TURN in Today's Applications">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Current Usage Statistics (2025)</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>15-30% of WebRTC connections</strong> require TURN relay fallback</li>
              <li>• <strong>Major cloud providers</strong> offer managed TURN services (AWS, Azure, GCP)</li>
              <li>• <strong>Video conferencing platforms</strong> deploy global TURN server networks</li>
              <li>• <strong>Gaming applications</strong> use TURN for guaranteed connectivity</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Industry Applications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-1">WebRTC Platforms</h5>
                <p className="text-gray-700">Google Meet, Zoom, Microsoft Teams, Discord</p>
              </div>
              <div>
                <h5 className="font-semibold mb-1">IoT Communications</h5>
                <p className="text-gray-700">Remote device access, industrial monitoring</p>
              </div>
              <div>
                <h5 className="font-semibold mb-1">Gaming Networks</h5>
                <p className="text-gray-700">Steam P2P, console gaming, mobile multiplayer</p>
              </div>
              <div>
                <h5 className="font-semibold mb-1">File Sharing</h5>
                <p className="text-gray-700">BitTorrent, IPFS, peer-to-peer sync</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-semibold text-purple-800 mb-2">Economic Impact</h4>
            <p className="text-sm text-purple-700">
              TURN servers process petabytes of relay traffic monthly, generating
              significant cloud infrastructure costs. However, they enable billions
              of real-time communications that would otherwise be impossible,
              supporting the modern remote work and digital communication economy.
            </p>
          </div>
        </div>
      </ExpandableSection>

      <h2>Key Learning Objectives</h2>
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">After studying RFC 8656, you should understand:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Core Concepts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>When and why TURN relay is needed</li>
              <li>TURN allocation and permission model</li>
              <li>Send/Data vs Channel data methods</li>
              <li>Integration with STUN and ICE</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Practical Skills</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Deploying and configuring TURN servers</li>
              <li>Implementing TURN client applications</li>
              <li>Understanding performance trade-offs</li>
              <li>Troubleshooting relay connectivity</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-8">
        <h3 className="font-semibold text-blue-800 mb-2">Complete Your NAT Traversal Journey</h3>
        <p className="text-blue-700 text-sm mb-3">
          You've now explored the complete NAT traversal toolkit: STUN for discovery,
          ICE for connectivity establishment, and TURN for relay fallback. Ready to
          dive deeper into network behavior standards?
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Link
            to="/rfcs/5389"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            ← RFC 5389: STUN
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            to="/rfcs/8445"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            RFC 8445: ICE
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            to="/rfcs/4787"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            RFC 4787: NAT Behavior →
          </Link>
        </div>
      </div>
    </article>
  );
}