import GlossaryTerm from '../../components/GlossaryTerm';
import MermaidDiagram from '../../components/MermaidDiagram';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC1034() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 1034: Domain Names - Concepts and Facilities (November 1987)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          This <GlossaryTerm>RFC</GlossaryTerm> introduced the <GlossaryTerm>Domain Name System</GlossaryTerm> (DNS), replacing the centralized HOSTS.TXT file
          with a distributed, hierarchical naming system. DNS became the foundation for
          human-readable internet addresses, making the web possible.
        </p>
      </div>

      <h2>From HOSTS.TXT to DNS Revolution</h2>

      <p>
        Before DNS, the entire internet used a single HOSTS.TXT file maintained by
        Stanford Research Institute (SRI). Every computer downloaded this file to
        resolve hostnames to IP addresses. By 1987, this approach was clearly
        unsustainable.
      </p>

      <div className="bg-red-50 border border-red-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-red-800 mb-2">The HOSTS.TXT Problem</h4>
        <ul className="text-red-700 text-sm space-y-1">
          <li>📈 <strong>Scale Crisis:</strong> Single file for entire internet</li>
          <li>🔄 <strong>Update Nightmare:</strong> Manual distribution and synchronization</li>
          <li>⚡ <strong>Name Conflicts:</strong> No hierarchy meant collision risks</li>
          <li>🏢 <strong>Control Issues:</strong> Centralized management bottleneck</li>
        </ul>
      </div>

      <h3>DNS Design Goals</h3>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 1034 established DNS with these revolutionary principles:
      </p>

      <ul>
        <li><strong>Distributed Authority:</strong> No single point of control</li>
        <li><strong>Hierarchical Structure:</strong> Tree-like organization</li>
        <li><strong>Caching:</strong> Improved performance through local storage</li>
        <li><strong>Flexibility:</strong> Support for various record types</li>
        <li><strong>Scalability:</strong> Handle millions of domains</li>
      </ul>

      <h3>The Domain Name Space</h3>

      <p>
        DNS organizes names in a tree structure, starting from the root and
        branching into top-level domains (TLDs), second-level domains, and beyond.
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
          <h4 className="font-semibold text-purple-900 mb-2">Resource Records</h4>
          <p className="text-sm text-purple-800">
            Data entries in DNS that map names to various types of information
            (IP addresses, mail servers, aliases, etc.).
          </p>
        </div>
      </div>

      <h3>Domain Name Hierarchy</h3>

      <p>
        Each domain name is read from right to left, with each label separated by dots:
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
          <strong>Understanding DNS caching</strong> and its impact on performance:
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
        <h4 className="font-semibold text-green-800 mb-2">Zone Example: example.com</h4>
        <div className="text-sm text-green-700 space-y-1">
          <div><strong>Zone:</strong> example.com (includes all subdomains)</div>
          <div><strong>Authoritative NS:</strong> ns1.example.com, ns2.example.com</div>
          <div><strong>Records managed:</strong> www, mail, ftp, blog, etc.</div>
          <div><strong>Delegation:</strong> Can delegate subdomains to other name servers</div>
        </div>
      </div>

      <h3>Resource Record Types</h3>

      <p>
        DNS stores different types of information using various resource record types:
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
        One of DNS's key innovations was <strong>caching</strong>. Resolvers cache
        responses for a specified Time To Live (TTL), dramatically reducing query
        load and improving performance.
      </p>

      <div className="bg-blue-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Caching Benefits</h4>
        <ul className="text-sm space-y-1">
          <li>🚀 <strong>Performance:</strong> Faster response times</li>
          <li>📉 <strong>Reduced Load:</strong> Fewer queries to authoritative servers</li>
          <li>🌐 <strong>Resilience:</strong> Works even if some servers are down</li>
          <li>💰 <strong>Cost Efficient:</strong> Reduces bandwidth usage</li>
        </ul>
      </div>

      <h3>Revolutionary Impact</h3>

      <p>
        RFC 1034's introduction of DNS solved the internet's naming crisis and
        enabled massive growth:
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-400 p-4 my-6">
        <h4 className="font-semibold text-gray-900 mb-2">Before DNS vs After DNS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-red-600 mb-2">Before (HOSTS.TXT)</h5>
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
        <li><strong>Security:</strong> DNS was designed before security was a priority</li>
        <li><strong>Privacy:</strong> Queries are traditionally unencrypted</li>
        <li><strong>Censorship:</strong> DNS can be manipulated for content blocking</li>
        <li><strong>Performance:</strong> Some legacy aspects create latency</li>
      </ul>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
        <h4 className="text-yellow-900 font-semibold">Modern Solutions</h4>
        <p className="text-yellow-800 text-sm">
          Today's enhancements include DNS over HTTPS (DoH), DNS over TLS (DoT),
          DNSSEC for security, and Anycast for performance - all building on
          RFC 1034's solid foundation.
        </p>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 1034 created one of the internet's most critical infrastructures.
          DNS's hierarchical, distributed design enabled the modern web by making
          human-readable addresses possible at internet scale.
        </p>
      </div>
    </article>
  );
}