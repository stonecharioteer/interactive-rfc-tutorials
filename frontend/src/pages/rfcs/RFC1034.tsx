import GlossaryTerm from "../../components/GlossaryTerm";
import MermaidDiagram from "../../components/MermaidDiagram";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";

export default function RFC1034() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 1034: Domain Names - Concepts and Facilities (November 1987)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          This <GlossaryTerm>RFC</GlossaryTerm> introduced the{" "}
          <GlossaryTerm>Domain Name System</GlossaryTerm> (DNS), replacing the
          centralized HOSTS.TXT file with a distributed, hierarchical naming
          system. DNS became the foundation for human-readable internet
          addresses, making the web possible.
        </p>
      </div>

      <h2>From HOSTS.TXT to DNS Revolution</h2>

      <p>
        Before DNS, the entire internet used a single HOSTS.TXT file maintained
        by Stanford Research Institute (SRI). Every computer downloaded this
        file to resolve hostnames to IP addresses. By 1987, this approach was
        clearly unsustainable.
      </p>

      <div className="bg-red-50 border border-red-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-red-800 mb-2">
          The HOSTS.TXT Problem
        </h4>
        <ul className="text-red-700 text-sm space-y-1">
          <li>
            📈 <strong>Scale Crisis:</strong> Single file for entire internet
          </li>
          <li>
            🔄 <strong>Update Nightmare:</strong> Manual distribution and
            synchronization
          </li>
          <li>
            ⚡ <strong>Name Conflicts:</strong> No hierarchy meant collision
            risks
          </li>
          <li>
            🏢 <strong>Control Issues:</strong> Centralized management
            bottleneck
          </li>
        </ul>
      </div>

      <h3>DNS Design Goals</h3>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 1034 established DNS with these
        revolutionary principles:
      </p>

      <ul>
        <li>
          <strong>Distributed Authority:</strong> No single point of control
        </li>
        <li>
          <strong>Hierarchical Structure:</strong> Tree-like organization
        </li>
        <li>
          <strong>Caching:</strong> Improved performance through local storage
        </li>
        <li>
          <strong>Flexibility:</strong> Support for various record types
        </li>
        <li>
          <strong>Scalability:</strong> Handle millions of domains
        </li>
      </ul>

      <h3>The Domain Name Space</h3>

      <p>
        DNS organizes names in a tree structure, starting from the root and
        branching into top-level domains (TLDs), second-level domains, and
        beyond.
      </p>

      <MermaidDiagram
        chart={`
graph TD
    Root[". (root)"] --> COM[".com"]
    Root --> ORG[".org"]
    Root --> EDU[".edu"]
    Root --> GOV[".gov"]
    Root --> NET[".net"]
    Root --> COUNTRY["Country codes<br/>.uk, .de, .jp"]

    COM --> GOOGLE["google.com"]
    COM --> AMAZON["amazon.com"]
    COM --> MICROSOFT["microsoft.com"]

    GOOGLE --> WWW_G["www.google.com"]
    GOOGLE --> MAIL_G["mail.google.com"]
    GOOGLE --> DRIVE_G["drive.google.com"]

    ORG --> WIKIPEDIA["wikipedia.org"]
    ORG --> MOZILLA["mozilla.org"]

    EDU --> MIT["mit.edu"]
    EDU --> STANFORD["stanford.edu"]

    style Root fill:#ff9999
    style COM fill:#99ccff
    style ORG fill:#99ffcc
    style EDU fill:#ffcc99
    style GOOGLE fill:#e1f5fe
    style WWW_G fill:#f3e5f5
        `}
        className="my-6"
      />

      <h3>Core DNS Components</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="border border-blue-300 p-4 rounded-lg bg-blue-50">
          <h4 className="font-semibold text-blue-900 mb-2">Name Servers</h4>
          <p className="text-sm text-blue-800">
            Store and serve DNS records for specific zones. Can be authoritative
            (official source) or recursive (query on behalf of clients).
          </p>
        </div>
        <div className="border border-green-300 p-4 rounded-lg bg-green-50">
          <h4 className="font-semibold text-green-900 mb-2">Resolvers</h4>
          <p className="text-sm text-green-800">
            Client-side components that query name servers to resolve domain
            names. Handle caching and recursive queries.
          </p>
        </div>
        <div className="border border-purple-300 p-4 rounded-lg bg-purple-50">
          <h4 className="font-semibold text-purple-900 mb-2">
            Resource Records
          </h4>
          <p className="text-sm text-purple-800">
            Data entries in DNS that map names to various types of information
            (IP addresses, mail servers, aliases, etc.).
          </p>
        </div>
      </div>

      <h3>Domain Name Hierarchy</h3>

      <p>
        Each domain name is read from right to left, with each label separated
        by dots:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <div className="text-center">
          <code className="text-xl font-mono">www.example.com.</code>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-red-600">. (root)</div>
            <div className="text-gray-600">Level 0</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">com</div>
            <div className="text-gray-600">Level 1 (TLD)</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">example</div>
            <div className="text-gray-600">Level 2</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">www</div>
            <div className="text-gray-600">Level 3</div>
          </div>
        </div>
      </div>

      <h3>DNS Query Resolution Process</h3>

      <p>
        When you type a domain name, your computer follows a systematic process
        to resolve it to an IP address:
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant User as User Application
    participant Resolver as Local Resolver
    participant Root as Root Name Server
    participant TLD as .com Name Server
    participant Auth as Authoritative Server

    User->>Resolver: Query: www.example.com
    Note over Resolver: Check local cache

    Resolver->>Root: Query: www.example.com?
    Root-->>Resolver: Refer to .com servers

    Resolver->>TLD: Query: www.example.com?
    TLD-->>Resolver: Refer to example.com servers

    Resolver->>Auth: Query: www.example.com?
    Auth-->>Resolver: Answer: 93.184.216.34

    Note over Resolver: Cache the response
    Resolver-->>User: Answer: 93.184.216.34
        `}
        className="my-6"
      />

      <ExpandableSection title="🐍 ELI-Pythonista: DNS Resolution in Action">
        <p>
          Python makes it easy to explore DNS resolution and understand how the
          hierarchical system works:
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import dns.resolver
import dns.query
import dns.name
from typing import List, Dict

def basic_dns_lookup(domain: str) -> Dict[str, List[str]]:
    """Perform basic DNS lookups using Python's socket module."""
    results = {}

    try:
        # A record (IPv4 address)
        ipv4_addresses = socket.gethostbyname_ex(domain)[2]
        results['A'] = ipv4_addresses

        # Try IPv6 as well
        try:
            ipv6_info = socket.getaddrinfo(domain, None, socket.AF_INET6)
            ipv6_addresses = [info[4][0] for info in ipv6_info]
            results['AAAA'] = list(set(ipv6_addresses))  # Remove duplicates
        except socket.gaierror:
            results['AAAA'] = []

    except socket.gaierror as e:
        results['error'] = str(e)

    return results

# Example usage
domain = "www.google.com"
basic_results = basic_dns_lookup(domain)
print(f"Basic DNS lookup for {domain}:")
for record_type, values in basic_results.items():
    print(f"  {record_type}: {values}")
`}
        />

        <p>
          <strong>Advanced DNS exploration</strong> with the dnspython library:
        </p>

        <CodeBlock
          language="python"
          code={`# First install: pip install dnspython

def detailed_dns_lookup(domain: str):
    """Perform detailed DNS lookups showing the hierarchical resolution."""

    print(f"\\n=== DNS Resolution for {domain} ===\\n")

    # Common record types to query
    record_types = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA']

    resolver = dns.resolver.Resolver()

    for record_type in record_types:
        try:
            answers = resolver.resolve(domain, record_type)
            print(f"{record_type} Records:")

            for answer in answers:
                if record_type == 'MX':
                    print(f"  Priority {answer.preference}: {answer.exchange}")
                elif record_type == 'SOA':
                    print(f"  Primary: {answer.mname}")
                    print(f"  Admin: {answer.rname}")
                    print(f"  Serial: {answer.serial}")
                elif record_type == 'TXT':
                    # TXT records can contain multiple strings
                    txt_data = ' '.join([s.decode() for s in answer.strings])
                    print(f"  {txt_data}")
                else:
                    print(f"  {answer}")
            print()

        except dns.resolver.NoAnswer:
            print(f"{record_type} Records: None\\n")
        except dns.resolver.NXDOMAIN:
            print(f"Domain {domain} does not exist\\n")
            break
        except Exception as e:
            print(f"{record_type} Records: Error - {e}\\n")

def trace_dns_hierarchy(domain: str):
    """Trace the DNS resolution process step by step."""

    print(f"\\n=== Tracing DNS Hierarchy for {domain} ===\\n")

    # Start with root servers (simplified - showing concept)
    domain_parts = domain.split('.')

    print("DNS Hierarchy (right to left):")
    print(f"  Root (.) -> {' -> '.join(reversed(domain_parts))}")

    # Show the delegation chain
    print("\\nDelegation Chain:")
    current_domain = ""
    for i, part in enumerate(reversed(domain_parts)):
        if i == 0:
            current_domain = part
            print(f"  1. Root servers delegate '.{part}' to TLD servers")
        else:
            current_domain = part + "." + current_domain
            if i == len(domain_parts) - 1:
                print(f"  {i+1}. '.{domain_parts[-i]}' servers provide final answer for '{current_domain}'")
            else:
                print(f"  {i+1}. '.{domain_parts[-i]}' servers delegate '{current_domain}' to authoritative servers")

def simulate_recursive_resolution(domain: str):
    """Simulate the recursive DNS resolution process."""

    print(f"\\n=== Simulating Recursive Resolution for {domain} ===\\n")

    try:
        # This shows what your resolver does behind the scenes
        resolver = dns.resolver.Resolver()

        print("Step 1: Checking local cache...")
        print("  (Cache miss - need to query)")

        print("\\nStep 2: Querying root servers...")
        print("  Root servers respond: 'Ask the .com servers'")

        print("\\nStep 3: Querying .com servers...")
        print("  .com servers respond: 'Ask example.com servers'")

        print("\\nStep 4: Querying authoritative servers...")
        answers = resolver.resolve(domain, 'A')
        for answer in answers:
            print(f"  Authoritative answer: {domain} -> {answer}")

        print("\\nStep 5: Caching result and returning to application")

    except Exception as e:
        print(f"Resolution failed: {e}")

# Example usage
test_domain = "www.example.com"

detailed_dns_lookup(test_domain)
trace_dns_hierarchy(test_domain)
simulate_recursive_resolution(test_domain)`}
        />

        <p>
          <strong>Understanding DNS caching</strong> and its impact on
          performance:
        </p>

        <CodeBlock
          language="python"
          code={`import time
import dns.resolver
from datetime import datetime

def demonstrate_dns_caching(domain: str, queries: int = 5):
    """Show how DNS caching improves performance."""

    print(f"\\n=== DNS Caching Demo for {domain} ===\\n")

    resolver = dns.resolver.Resolver()

    # Clear any existing cache
    resolver.cache = dns.resolver.LRUCache()

    print("Performing multiple queries to show caching effect...")

    for i in range(queries):
        print(f"\\nQuery {i+1}:")
        start_time = time.time()

        try:
            answers = resolver.resolve(domain, 'A')
            end_time = time.time()

            query_time = (end_time - start_time) * 1000  # Convert to milliseconds

            print(f"  Result: {answers[0]}")
            print(f"  Query time: {query_time:.2f} ms")
            print(f"  TTL: {answers.rrset.ttl} seconds")

            if i == 0:
                print("  Status: Fresh lookup (no cache)")
            else:
                print("  Status: Cached response (much faster!)")

        except Exception as e:
            print(f"  Error: {e}")

        # Wait a bit between queries
        time.sleep(0.5)

    print("\\nNotice how subsequent queries are much faster due to caching!")

# Run the caching demonstration
demonstrate_dns_caching("www.github.com")`}
        />

        <p>
          This demonstrates the power of DNS's hierarchical design - the caching
          system makes the internet much faster by avoiding repeated lookups!
        </p>
      </ExpandableSection>

      <h3>Zones and Delegation</h3>

      <p>
        DNS divides the namespace into <strong>zones</strong> - administrative
        units that can be managed independently. Each zone has authoritative
        name servers responsible for that portion of the namespace.
      </p>

      <div className="bg-green-50 border border-green-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-green-800 mb-2">
          Zone Example: example.com
        </h4>
        <div className="text-sm text-green-700 space-y-1">
          <div>
            <strong>Zone:</strong> example.com (includes all subdomains)
          </div>
          <div>
            <strong>Authoritative NS:</strong> ns1.example.com, ns2.example.com
          </div>
          <div>
            <strong>Records managed:</strong> www, mail, ftp, blog, etc.
          </div>
          <div>
            <strong>Delegation:</strong> Can delegate subdomains to other name
            servers
          </div>
        </div>
      </div>

      <h3>Resource Record Types</h3>

      <p>
        DNS stores different types of information using various resource record
        types:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-gray-300 p-3 rounded-lg">
          <h5 className="font-semibold text-blue-600">A Record</h5>
          <p className="text-sm">Maps domain to IPv4 address</p>
          <code className="text-xs">example.com → 93.184.216.34</code>
        </div>
        <div className="border border-gray-300 p-3 rounded-lg">
          <h5 className="font-semibold text-green-600">CNAME Record</h5>
          <p className="text-sm">Creates an alias to another domain</p>
          <code className="text-xs">www.example.com → example.com</code>
        </div>
        <div className="border border-gray-300 p-3 rounded-lg">
          <h5 className="font-semibold text-purple-600">MX Record</h5>
          <p className="text-sm">Specifies mail server for domain</p>
          <code className="text-xs">example.com → mail.example.com</code>
        </div>
        <div className="border border-gray-300 p-3 rounded-lg">
          <h5 className="font-semibold text-orange-600">NS Record</h5>
          <p className="text-sm">Delegates zone to name servers</p>
          <code className="text-xs">example.com → ns1.example.com</code>
        </div>
      </div>

      <h3>Caching and TTL</h3>

      <p>
        One of DNS's key innovations was <strong>caching</strong>. Resolvers
        cache responses for a specified Time To Live (TTL), dramatically
        reducing query load and improving performance.
      </p>

      <div className="bg-blue-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Caching Benefits</h4>
        <ul className="text-sm space-y-1">
          <li>
            🚀 <strong>Performance:</strong> Faster response times
          </li>
          <li>
            📉 <strong>Reduced Load:</strong> Fewer queries to authoritative
            servers
          </li>
          <li>
            🌐 <strong>Resilience:</strong> Works even if some servers are down
          </li>
          <li>
            💰 <strong>Cost Efficient:</strong> Reduces bandwidth usage
          </li>
        </ul>
      </div>

      <h3>Revolutionary Impact</h3>

      <p>
        RFC 1034's introduction of DNS solved the internet's naming crisis and
        enabled massive growth:
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-400 p-4 my-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          Before DNS vs After DNS
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-red-600 mb-2">
              Before (HOSTS.TXT)
            </h5>
            <ul className="space-y-1 text-red-700">
              <li>• Single file for entire internet</li>
              <li>• Manual updates and distribution</li>
              <li>• Name conflicts common</li>
              <li>• Centralized control bottleneck</li>
              <li>• No scalability path</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-green-600 mb-2">After (DNS)</h5>
            <ul className="space-y-1 text-green-700">
              <li>• Distributed, hierarchical system</li>
              <li>• Automatic updates and caching</li>
              <li>• Namespace hierarchy prevents conflicts</li>
              <li>• Distributed authority model</li>
              <li>• Scales to billions of domains</li>
            </ul>
          </div>
        </div>
      </div>

      <h3>Modern DNS Challenges</h3>

      <p>
        While DNS design was brilliant for 1987, modern challenges have emerged:
      </p>

      <ul>
        <li>
          <strong>Security:</strong> DNS was designed before security was a
          priority
        </li>
        <li>
          <strong>Privacy:</strong> Queries are traditionally unencrypted
        </li>
        <li>
          <strong>Censorship:</strong> DNS can be manipulated for content
          blocking
        </li>
        <li>
          <strong>Performance:</strong> Some legacy aspects create latency
        </li>
      </ul>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
        <h4 className="text-yellow-900 font-semibold">Modern Solutions</h4>
        <p className="text-yellow-800 text-sm">
          Today's enhancements include DNS over HTTPS (DoH), DNS over TLS (DoT),
          DNSSEC for security, and Anycast for performance - all building on RFC
          1034's solid foundation.
        </p>
      </div>

      <h3>DNS's Critical Role in Today's Internet Infrastructure</h3>

      <p>
        DNS has evolved from a simple name resolution service into the
        foundational infrastructure that enables virtually every internet
        interaction, processing trillions of queries daily across the global
        digital economy:
      </p>

      <div className="bg-sky-50 border border-sky-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-sky-900 mb-4">
          🌐 DNS Powers the Modern Internet
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-sky-800">Web & Applications</h5>
            <ul className="text-sky-700 text-sm space-y-1">
              <li>• Website access (every URL lookup)</li>
              <li>• Mobile app API connections</li>
              <li>• CDN load balancing and routing</li>
              <li>• Email server discovery (MX records)</li>
              <li>• SSL/TLS certificate validation</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-sky-800">Cloud & Enterprise</h5>
            <ul className="text-sky-700 text-sm space-y-1">
              <li>• AWS Route 53, Azure DNS, Google DNS</li>
              <li>• Kubernetes service discovery</li>
              <li>• Microservices communication</li>
              <li>• Global server load balancing</li>
              <li>• Disaster recovery failover</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-sky-800">
              Security & Compliance
            </h5>
            <ul className="text-sky-700 text-sm space-y-1">
              <li>• Malware domain blocking</li>
              <li>• Phishing protection services</li>
              <li>• Content filtering and compliance</li>
              <li>• DDoS mitigation and traffic steering</li>
              <li>• Threat intelligence feeds</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-purple-900 mb-3">
          📊 DNS by the Numbers (2025)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-800">5T+</div>
            <div className="text-sm text-purple-700">
              DNS queries processed daily
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-800">40+</div>
            <div className="text-sm text-purple-700">
              Years of continuous operation
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-800">99.99%</div>
            <div className="text-sm text-purple-700">
              Global DNS infrastructure uptime
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-800">350M+</div>
            <div className="text-sm text-purple-700">
              Domain names registered globally
            </div>
          </div>
        </div>
      </div>

      <ExpandableSection title="🔄 DNS vs Alternative Naming Systems: The Great Resolution Protocol Battle">
        <p>
          While DNS dominates, several alternative naming and resolution systems
          have emerged to address its limitations:
        </p>

        <div className="space-y-6 mt-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h5 className="font-semibold text-blue-800 mb-2">
              🔗 Blockchain-Based Naming
            </h5>
            <div className="text-blue-700 text-sm space-y-2">
              <p>
                <strong>Ethereum Name Service (ENS):</strong> Decentralized
                domains on Ethereum blockchain
              </p>
              <p>
                <strong>Handshake (HNS):</strong> Peer-to-peer root DNS
                alternative with cryptocurrency integration
              </p>
              <p>
                <strong>Unstoppable Domains:</strong> Censorship-resistant
                domains stored on blockchain
              </p>
              <p>
                <strong>Challenge to DNS:</strong> Decentralization vs
                performance, crypto complexity vs simplicity
              </p>
              <p>
                <strong>Adoption:</strong> Niche cryptocurrency and Web3
                applications, limited mainstream adoption
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h5 className="font-semibold text-green-800 mb-2">
              📱 Modern DNS Security Evolution
            </h5>
            <div className="text-green-700 text-sm space-y-2">
              <p>
                <strong>DNS over HTTPS (DoH):</strong> Firefox, Chrome default,
                encrypts DNS queries
              </p>
              <p>
                <strong>DNS over TLS (DoT):</strong> Android default, dedicated
                encrypted DNS connections
              </p>
              <p>
                <strong>DNS over QUIC (DoQ):</strong> Next-generation encrypted
                DNS with improved performance
              </p>
              <p>
                <strong>DNSSEC:</strong> Cryptographic signatures preventing DNS
                spoofing attacks
              </p>
              <p>
                <strong>Success Factor:</strong> Backwards compatible security
                enhancements to existing DNS
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h5 className="font-semibold text-yellow-800 mb-2">
              🏢 Enterprise Alternatives (Historical)
            </h5>
            <div className="text-yellow-700 text-sm space-y-2">
              <p>
                <strong>Microsoft WINS:</strong> NetBIOS name resolution for
                Windows networks
              </p>
              <p>
                <strong>Novell NDS:</strong> Directory services with integrated
                naming
              </p>
              <p>
                <strong>Apple Bonjour:</strong> Zero-configuration networking
                for local discovery
              </p>
              <p>
                <strong>Why DNS Won:</strong> Internet-scale design, vendor
                neutrality, simple text-based format
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded">
            <h5 className="font-semibold text-orange-800 mb-2">
              🌍 Content Delivery Evolution
            </h5>
            <div className="text-orange-700 text-sm space-y-2">
              <p>
                <strong>GeoDNS:</strong> Location-based DNS responses for
                performance optimization
              </p>
              <p>
                <strong>Anycast DNS:</strong> Multiple servers sharing same IP
                for global distribution
              </p>
              <p>
                <strong>Edge DNS:</strong> Cloudflare, AWS Route 53, Azure DNS
                with millisecond response times
              </p>
              <p>
                <strong>Service Discovery:</strong> Consul, etcd, Kubernetes DNS
                for microservices
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h5 className="font-semibold text-red-800 mb-2">
              🚫 DNS Challenges in Modern Internet
            </h5>
            <div className="text-red-700 text-sm space-y-2">
              <p>
                <strong>Privacy Concerns:</strong> ISP monitoring, government
                surveillance, query logging
              </p>
              <p>
                <strong>Centralization Risk:</strong> Major cloud providers
                controlling significant DNS traffic
              </p>
              <p>
                <strong>Cache Poisoning:</strong> Security vulnerabilities in
                recursive resolvers
              </p>
              <p>
                <strong>Latency Issues:</strong> Multiple round-trips for
                complex resolutions
              </p>
              <p>
                <strong>Censorship Tool:</strong> Easy manipulation for content
                blocking and surveillance
              </p>
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-4 rounded">
            <h5 className="font-semibold text-cyan-800 mb-2">
              🏆 DNS's Enduring Advantages
            </h5>
            <div className="text-cyan-700 text-sm space-y-2">
              <p>
                <strong>Universal Compatibility:</strong> Works with every
                internet protocol and application
              </p>
              <p>
                <strong>Proven Scalability:</strong> Handles global internet
                growth for 40+ years
              </p>
              <p>
                <strong>Hierarchical Design:</strong> Naturally distributes load
                and administrative responsibility
              </p>
              <p>
                <strong>Simple Protocol:</strong> Text-based, cacheable, easy to
                implement and debug
              </p>
              <p>
                <strong>Vendor Neutrality:</strong> No single company controls
                the namespace
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
          <h5 className="font-semibold text-indigo-800 mb-2">
            📖 Further Reading
          </h5>
          <ul className="text-indigo-700 text-sm space-y-1">
            <li>
              <a
                href="https://www.rfc-editor.org/rfc/rfc8484.html"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                RFC 8484: DNS over HTTPS (DoH)
              </a>
            </li>
            <li>
              <a
                href="https://www.rfc-editor.org/rfc/rfc7858.html"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                RFC 7858: DNS over TLS (DoT)
              </a>
            </li>
            <li>
              <a
                href="https://www.rfc-editor.org/rfc/rfc4033.html"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                RFC 4033: DNS Security Introduction (DNSSEC)
              </a>
            </li>
            <li>
              <a
                href="https://www.rfc-editor.org/rfc/rfc9250.html"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                RFC 9250: DNS over Dedicated QUIC Connections
              </a>
            </li>
            <li>
              <a
                href="https://stats.labs.apnic.net/dnssec"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                DNSSEC Deployment Statistics - APNIC
              </a>
            </li>
          </ul>
        </div>
      </ExpandableSection>

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-emerald-900 mb-3">
          🎯 DNS in Critical Infrastructure
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-emerald-800 mb-2">
              Financial Services
            </h5>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Banking API endpoint resolution</li>
              <li>• Payment processor routing</li>
              <li>• Fraud detection system lookups</li>
              <li>• Cryptocurrency exchange connectivity</li>
              <li>• Regulatory compliance reporting</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-emerald-800 mb-2">
              Critical Infrastructure
            </h5>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Power grid control systems</li>
              <li>• Transportation management</li>
              <li>• Healthcare device connectivity</li>
              <li>• Emergency services coordination</li>
              <li>• Government communications</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-slate-900 mb-3">
          🔮 DNS Future: Evolution, Not Revolution
        </h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-slate-800">
              Enhanced Privacy & Security
            </h5>
            <p className="text-slate-700 text-sm">
              Mandatory encryption (DoH/DoT/DoQ), DNSSEC universal deployment,
              privacy-preserving query methods, and AI-powered threat detection
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800">
              Edge Computing Integration
            </h5>
            <p className="text-slate-700 text-sm">
              DNS at the edge for microsecond response times, intelligent
              traffic routing, real-time content optimization, and 5G network
              slice selection
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800">
              Multi-Protocol Coexistence
            </h5>
            <p className="text-slate-700 text-sm">
              DNS for traditional internet, blockchain domains for Web3, local
              service discovery for IoT—each system optimized for its domain
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 1034's DNS created one of the internet's most critical and
          successful infrastructures. Processing 5+ trillion queries daily,
          DNS's hierarchical, distributed design enabled the modern web by
          making human-readable addresses possible at internet scale. While
          blockchain and decentralized alternatives emerge, DNS's simplicity,
          performance, and universal compatibility ensure its continued
          dominance. Its greatest achievement is creating an invisible
          infrastructure so reliable that billions of users never think about
          name resolution—it just works.
        </p>
      </div>
    </article>
  );
}
