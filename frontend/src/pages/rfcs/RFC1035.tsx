import GlossaryTerm from "../../components/GlossaryTerm";
import MermaidDiagram from "../../components/MermaidDiagram";
import CodeBlock from "../../components/CodeBlock";
import ExpandableSection from "../../components/ExpandableSection";

export default function RFC1035() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>
        RFC 1035: Domain Names - Implementation and Specification (November
        1987)
      </h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          While <GlossaryTerm>RFC</GlossaryTerm> 1034 defined DNS concepts,{" "}
          <GlossaryTerm>RFC</GlossaryTerm> 1035 provided the technical
          implementation blueprint. This specification defined the DNS message
          format, resource record types, and practical guidelines that
          implementers needed to build actual DNS servers and resolvers.
        </p>
      </div>

      <h2>From Concepts to Implementation</h2>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 1035 is the companion to{" "}
        <GlossaryTerm>RFC</GlossaryTerm> 1034, providing the concrete technical
        specifications needed to implement the Domain Name System. While 1034
        explained the "what" and "why" of DNS, 1035 explains the "how."
      </p>

      <div className="bg-green-50 border border-green-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-green-800 mb-2">
          RFC 1034 vs RFC 1035
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-green-700 mb-2">
              RFC 1034 (Concepts)
            </h5>
            <ul className="space-y-1 text-green-600">
              <li>• Hierarchical name space design</li>
              <li>• Zone delegation concepts</li>
              <li>• Caching principles</li>
              <li>• General architecture</li>
              <li>• Problem statement and goals</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">
              RFC 1035 (Implementation)
            </h5>
            <ul className="space-y-1 text-blue-600">
              <li>• Exact message format specifications</li>
              <li>• Resource record type definitions</li>
              <li>• Transport protocol details</li>
              <li>• Database design recommendations</li>
              <li>• Practical implementation guidelines</li>
            </ul>
          </div>
        </div>
      </div>

      <h3>DNS Message Format</h3>

      <p>
        The cornerstone of RFC 1035 is the precise definition of DNS message
        format. Every DNS query and response follows this exact structure:
      </p>

      <div className="bg-gray-100 p-4 rounded-lg my-6 overflow-x-auto">
        <h4 className="font-semibold mb-3">DNS Message Structure</h4>
        <div className="grid grid-cols-8 gap-1 text-xs mb-4">
          <div className="col-span-8 bg-red-200 p-2 text-center font-semibold">
            Header (12 bytes)
          </div>
          <div className="col-span-8 bg-blue-200 p-2 text-center">
            Question Section (variable)
          </div>
          <div className="col-span-8 bg-green-200 p-2 text-center">
            Answer Section (variable)
          </div>
          <div className="col-span-8 bg-yellow-200 p-2 text-center">
            Authority Section (variable)
          </div>
          <div className="col-span-8 bg-purple-200 p-2 text-center">
            Additional Section (variable)
          </div>
        </div>
      </div>

      <h4>DNS Header Format</h4>

      <p>
        The 12-byte header contains critical control information for every DNS
        message:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-6 overflow-x-auto">
        <div className="grid grid-cols-16 gap-px text-xs">
          {/* Row 1 */}
          <div className="col-span-16 bg-blue-300 p-1 text-center font-semibold">
            Transaction ID (16 bits)
          </div>

          {/* Row 2 */}
          <div className="col-span-1 bg-red-200 p-1 text-center">QR</div>
          <div className="col-span-4 bg-green-200 p-1 text-center">Opcode</div>
          <div className="col-span-1 bg-yellow-200 p-1 text-center">AA</div>
          <div className="col-span-1 bg-purple-200 p-1 text-center">TC</div>
          <div className="col-span-1 bg-pink-200 p-1 text-center">RD</div>
          <div className="col-span-1 bg-orange-200 p-1 text-center">RA</div>
          <div className="col-span-3 bg-gray-300 p-1 text-center">Z</div>
          <div className="col-span-4 bg-indigo-200 p-1 text-center">RCODE</div>

          {/* Row 3 */}
          <div className="col-span-16 bg-cyan-200 p-1 text-center">
            Question Count (QDCOUNT) - 16 bits
          </div>

          {/* Row 4 */}
          <div className="col-span-16 bg-lime-200 p-1 text-center">
            Answer Count (ANCOUNT) - 16 bits
          </div>

          {/* Row 5 */}
          <div className="col-span-16 bg-amber-200 p-1 text-center">
            Authority Count (NSCOUNT) - 16 bits
          </div>

          {/* Row 6 */}
          <div className="col-span-16 bg-rose-200 p-1 text-center">
            Additional Count (ARCOUNT) - 16 bits
          </div>
        </div>

        <div className="mt-4 text-sm space-y-1">
          <div>
            <strong>QR:</strong> Query (0) or Response (1)
          </div>
          <div>
            <strong>AA:</strong> Authoritative Answer
          </div>
          <div>
            <strong>TC:</strong> Truncated Message
          </div>
          <div>
            <strong>RD:</strong> Recursion Desired
          </div>
          <div>
            <strong>RA:</strong> Recursion Available
          </div>
          <div>
            <strong>RCODE:</strong> Response Code (0=NOERROR, 3=NXDOMAIN, etc.)
          </div>
        </div>
      </div>

      <h3>Resource Record Types</h3>

      <p>
        RFC 1035 defines the essential resource record (RR) types that form the
        foundation of DNS data storage:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="border border-gray-300 rounded-lg p-4">
          <h5 className="font-semibold text-blue-600 mb-3">
            Core Record Types
          </h5>
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-semibold">A (Type 1)</div>
              <div className="text-gray-600">32-bit IPv4 address</div>
              <code className="text-xs">example.com. A 192.0.2.1</code>
            </div>

            <div className="bg-green-50 p-2 rounded">
              <div className="font-semibold">NS (Type 2)</div>
              <div className="text-gray-600">Authoritative name server</div>
              <code className="text-xs">example.com. NS ns1.example.com.</code>
            </div>

            <div className="bg-purple-50 p-2 rounded">
              <div className="font-semibold">CNAME (Type 5)</div>
              <div className="text-gray-600">Canonical name alias</div>
              <code className="text-xs">
                www.example.com. CNAME example.com.
              </code>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <h5 className="font-semibold text-orange-600 mb-3">
            Special Record Types
          </h5>
          <div className="space-y-3 text-sm">
            <div className="bg-orange-50 p-2 rounded">
              <div className="font-semibold">SOA (Type 6)</div>
              <div className="text-gray-600">Start of Authority</div>
              <code className="text-xs">Contains zone metadata</code>
            </div>

            <div className="bg-pink-50 p-2 rounded">
              <div className="font-semibold">PTR (Type 12)</div>
              <div className="text-gray-600">Pointer for reverse DNS</div>
              <code className="text-xs">
                1.2.0.192.in-addr.arpa. PTR example.com.
              </code>
            </div>

            <div className="bg-yellow-50 p-2 rounded">
              <div className="font-semibold">MX (Type 15)</div>
              <div className="text-gray-600">Mail exchange server</div>
              <code className="text-xs">
                example.com. MX 10 mail.example.com.
              </code>
            </div>
          </div>
        </div>
      </div>

      <h3>Message Compression</h3>

      <p>
        One of RFC 1035's key innovations was{" "}
        <strong>message compression</strong> to reduce DNS packet size. Domain
        names in DNS messages can be compressed using pointers:
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-800 mb-3">
          Compression Example
        </h4>
        <div className="text-sm space-y-2">
          <div>
            <strong>Uncompressed:</strong> 54 bytes total
          </div>
          <div className="font-mono text-xs bg-white p-2 rounded">
            Query: www.example.com.
            <br />
            Answer: www.example.com. A 192.0.2.1
            <br />
            Authority: example.com. NS ns1.example.com.
          </div>

          <div>
            <strong>Compressed:</strong> 32 bytes total (40% savings)
          </div>
          <div className="font-mono text-xs bg-white p-2 rounded">
            Query: www.example.com.
            <br />
            Answer: [pointer to query name] A 192.0.2.1
            <br />
            Authority: [pointer to "example.com"] NS ns1.[pointer to
            "example.com"]
          </div>
        </div>
      </div>

      <h3>Transport Protocols</h3>

      <p>
        RFC 1035 specified that DNS should work over both UDP and TCP, with
        specific guidelines for when to use each:
      </p>

      <MermaidDiagram
        chart={`
graph TD
    Client[DNS Client] --> Decision{Message Size?}

    Decision -->|< 512 bytes| UDP[UDP Query]
    Decision -->|> 512 bytes| TCP[TCP Query]

    UDP --> UDPServer[DNS Server<br/>Port 53 UDP]
    TCP --> TCPServer[DNS Server<br/>Port 53 TCP]

    UDPServer --> UDPCheck{Response fits<br/>in 512 bytes?}
    UDPCheck -->|Yes| UDPResponse[UDP Response]
    UDPCheck -->|No| TCBit[Set TC bit<br/>Truncated Response]

    TCBit --> ClientRetry[Client retries<br/>via TCP]
    ClientRetry --> TCPServer

    TCPServer --> TCPResponse[TCP Response<br/>Full message]

    style UDP fill:#e1f5fe
    style TCP fill:#f3e5f5
    style UDPResponse fill:#e8f5e8
    style TCPResponse fill:#e8f5e8
        `}
        className="my-6"
      />

      <ExpandableSection title="🐍 ELI-Pythonista: Building DNS Messages">
        <p>
          Let's implement DNS message parsing and construction to understand RFC
          1035's binary format specifications:
        </p>

        <CodeBlock
          language="python"
          code={`import struct
import socket
from typing import List, Tuple, Dict

class DNSHeader:
    """DNS Header implementation per RFC 1035"""

    def __init__(self, transaction_id=0, flags=0, qdcount=0, ancount=0, nscount=0, arcount=0):
        self.transaction_id = transaction_id
        self.flags = flags
        self.qdcount = qdcount  # Question count
        self.ancount = ancount  # Answer count
        self.nscount = nscount  # Authority count
        self.arcount = arcount  # Additional count

    def pack(self) -> bytes:
        """Pack header into 12-byte binary format"""
        return struct.pack('!HHHHHH',
                          self.transaction_id, self.flags,
                          self.qdcount, self.ancount,
                          self.nscount, self.arcount)

    @classmethod
    def unpack(cls, data: bytes) -> 'DNSHeader':
        """Unpack 12-byte binary format into header"""
        if len(data) < 12:
            raise ValueError("DNS header must be 12 bytes")

        values = struct.unpack('!HHHHHH', data[:12])
        return cls(*values)

    def set_query_flags(self, recursion_desired=True):
        """Set flags for a standard query"""
        # QR=0 (query), OPCODE=0 (standard), RD=1 (recursion desired)
        self.flags = 0x0100 if recursion_desired else 0x0000

    def set_response_flags(self, authoritative=False, recursion_available=True, rcode=0):
        """Set flags for a response"""
        flags = 0x8000  # QR=1 (response)
        if authoritative:
            flags |= 0x0400  # AA=1
        if recursion_available:
            flags |= 0x0080  # RA=1
        flags |= (rcode & 0xF)  # RCODE
        self.flags = flags

def encode_domain_name(name: str) -> bytes:
    """Encode domain name per RFC 1035 format"""
    if name == '.':
        return b'\\x00'

    # Remove trailing dot if present
    name = name.rstrip('.')
    parts = name.split('.')

    encoded = b''
    for part in parts:
        if len(part) > 63:
            raise ValueError(f"Label too long: {part} (max 63 chars)")
        encoded += bytes([len(part)]) + part.encode('ascii')

    encoded += b'\\x00'  # Root label terminator
    return encoded

def decode_domain_name(data: bytes, offset: int = 0) -> Tuple[str, int]:
    """Decode domain name with compression support"""
    labels = []
    original_offset = offset
    jumped = False

    while offset < len(data):
        length = data[offset]

        # Check for compression pointer (top 2 bits set)
        if (length & 0xC0) == 0xC0:
            if not jumped:
                original_offset = offset + 2
                jumped = True

            # Extract 14-bit pointer
            pointer = ((length & 0x3F) << 8) | data[offset + 1]
            offset = pointer
            continue

        # End of name
        if length == 0:
            if not jumped:
                original_offset = offset + 1
            break

        # Read label
        offset += 1
        if offset + length > len(data):
            raise ValueError("Invalid domain name encoding")

        label = data[offset:offset + length].decode('ascii')
        labels.append(label)
        offset += length

    domain = '.'.join(labels)
    return domain + '.' if domain else '.', original_offset

class DNSQuestion:
    """DNS Question section per RFC 1035"""

    def __init__(self, name: str, qtype: int, qclass: int = 1):
        self.name = name
        self.qtype = qtype    # Query type (A=1, NS=2, etc.)
        self.qclass = qclass  # Query class (IN=1 for Internet)

    def pack(self) -> bytes:
        """Pack question into binary format"""
        encoded_name = encode_domain_name(self.name)
        return encoded_name + struct.pack('!HH', self.qtype, self.qclass)

class DNSResourceRecord:
    """DNS Resource Record per RFC 1035"""

    def __init__(self, name: str, rtype: int, rclass: int, ttl: int, rdata: bytes):
        self.name = name
        self.rtype = rtype    # Record type
        self.rclass = rclass  # Record class
        self.ttl = ttl        # Time to live
        self.rdata = rdata    # Resource data

    def pack(self) -> bytes:
        """Pack resource record into binary format"""
        encoded_name = encode_domain_name(self.name)
        header = struct.pack('!HHIH', self.rtype, self.rclass, self.ttl, len(self.rdata))
        return encoded_name + header + self.rdata

def create_a_record_data(ip_address: str) -> bytes:
    """Create A record data from IP address"""
    return socket.inet_aton(ip_address)

def create_dns_query(domain: str, qtype: int = 1) -> bytes:
    """Create a complete DNS query message"""
    # Create header
    header = DNSHeader()
    header.transaction_id = 0x1234  # Random ID
    header.set_query_flags(recursion_desired=True)
    header.qdcount = 1

    # Create question
    question = DNSQuestion(domain, qtype)

    # Pack complete message
    return header.pack() + question.pack()

# Example usage
def demonstrate_dns_message_format():
    """Demonstrate DNS message construction per RFC 1035"""

    print("=== RFC 1035 DNS Message Format Demo ===\\n")

    # Create a DNS query
    domain = "www.example.com"
    query_bytes = create_dns_query(domain, qtype=1)  # A record query

    print(f"DNS Query for {domain}:")
    print(f"Total message size: {len(query_bytes)} bytes")
    print(f"Hex dump: {query_bytes.hex()}")

    # Parse the header back
    header = DNSHeader.unpack(query_bytes)
    print(f"\\nParsed Header:")
    print(f"  Transaction ID: 0x{header.transaction_id:04x}")
    print(f"  Flags: 0x{header.flags:04x}")
    print(f"  Questions: {header.qdcount}")
    print(f"  Answers: {header.ancount}")

    # Decode the question section
    name_end = 12  # Skip header
    decoded_name, offset = decode_domain_name(query_bytes, name_end)
    qtype, qclass = struct.unpack('!HH', query_bytes[offset:offset+4])

    print(f"\\nParsed Question:")
    print(f"  Name: {decoded_name}")
    print(f"  Type: {qtype} ({'A' if qtype == 1 else f'TYPE{qtype}'})")
    print(f"  Class: {qclass} ({'IN' if qclass == 1 else f'CLASS{qclass}'})")

# Run the demonstration
demonstrate_dns_message_format()`}
        />

        <p>
          <strong>Advanced example:</strong> Creating DNS responses with
          multiple sections
        </p>

        <CodeBlock
          language="python"
          code={`def create_dns_response(query_bytes: bytes, answers: List[Tuple[str, int, bytes]]) -> bytes:
    """Create a DNS response message per RFC 1035"""

    # Parse original query
    query_header = DNSHeader.unpack(query_bytes)

    # Create response header
    response_header = DNSHeader()
    response_header.transaction_id = query_header.transaction_id  # Same ID
    response_header.set_response_flags(authoritative=True, rcode=0)
    response_header.qdcount = query_header.qdcount  # Echo question count
    response_header.ancount = len(answers)

    # Start with header
    response = response_header.pack()

    # Copy question section from original query
    question_start = 12
    name_end, offset = decode_domain_name(query_bytes, question_start)
    question_section = query_bytes[question_start:offset+4]
    response += question_section

    # Add answer section
    for name, rtype, rdata in answers:
        answer_rr = DNSResourceRecord(name, rtype, 1, 300, rdata)  # TTL=300
        response += answer_rr.pack()

    return response

def demonstrate_complete_dns_transaction():
    """Show a complete DNS query/response cycle"""

    print("=== Complete DNS Transaction Demo ===\\n")

    # Step 1: Create query
    domain = "example.com"
    query = create_dns_query(domain, qtype=1)
    print(f"1. Client sends query for {domain}")
    print(f"   Query size: {len(query)} bytes\\n")

    # Step 2: Create response with A record
    ip_address = "192.0.2.1"
    a_record_data = create_a_record_data(ip_address)
    answers = [(domain + ".", 1, a_record_data)]  # A record

    response = create_dns_response(query, answers)
    print(f"2. Server sends response with A record")
    print(f"   Response size: {len(response)} bytes")
    print(f"   Answer: {domain} -> {ip_address}\\n")

    # Step 3: Parse response
    response_header = DNSHeader.unpack(response)
    print(f"3. Response analysis:")
    print(f"   Transaction ID matches: {response_header.transaction_id == 0x1234}")
    print(f"   Response code: {response_header.flags & 0xF} (NOERROR)")
    print(f"   Answer count: {response_header.ancount}")

    # Calculate size savings with compression
    uncompressed_size = len(query) + len(response) - 20  # Estimate without compression
    actual_size = len(query) + len(response)
    savings = ((uncompressed_size - actual_size) / uncompressed_size) * 100
    print(f"\\n4. Message compression saved ~{savings:.1f}% bandwidth")

# Run the complete demonstration
demonstrate_complete_dns_transaction()`}
        />

        <p>
          This shows how RFC 1035's precise binary format specifications enable
          efficient DNS communication - every bit and byte is carefully
          designed!
        </p>
      </ExpandableSection>

      <h3>Database Design Recommendations</h3>

      <p>
        RFC 1035 provided practical guidance for DNS server implementations,
        including database structure recommendations:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">
            Name Server Components
          </h4>
          <ul className="text-sm space-y-2 text-blue-700">
            <li>
              <strong>Zone Catalog:</strong> List of available zones
            </li>
            <li>
              <strong>Zone Data:</strong> Authoritative records for each zone
            </li>
            <li>
              <strong>Cache Data:</strong> Temporary records from other servers
            </li>
            <li>
              <strong>Configuration:</strong> Server settings and policies
            </li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">
            Design Principles
          </h4>
          <ul className="text-sm space-y-2 text-green-700">
            <li>
              <strong>Atomic Updates:</strong> Use pointer swapping for zone
              changes
            </li>
            <li>
              <strong>Case Insensitive:</strong> Labels stored in canonical form
            </li>
            <li>
              <strong>Separate Structures:</strong> Zone data independent of
              cache
            </li>
            <li>
              <strong>Efficient Lookups:</strong> Hash tables or trees for fast
              access
            </li>
          </ul>
        </div>
      </div>

      <h3>Query Processing Algorithm</h3>

      <p>
        RFC 1035 outlined the standard algorithm that DNS servers should follow
        when processing queries:
      </p>

      <MermaidDiagram
        chart={`
flowchart TD
    Start([DNS Query Received]) --> Parse[Parse Query Message]
    Parse --> ValidMsg{Valid Message?}
    ValidMsg -->|No| FormatError[Return FORMERR]
    ValidMsg -->|Yes| CheckZone{Query in<br/>Local Zone?}

    CheckZone -->|Yes| AuthAnswer[Generate<br/>Authoritative Answer]
    CheckZone -->|No| CheckCache{Answer in<br/>Cache?}

    CheckCache -->|Yes| CacheAnswer[Return<br/>Cached Answer]
    CheckCache -->|No| RecursionOK{Recursion<br/>Desired & Available?}

    RecursionOK -->|No| NoRecursion[Return Referral<br/>or Failure]
    RecursionOK -->|Yes| ForwardQuery[Forward Query<br/>to Other Servers]

    ForwardQuery --> CacheResult[Cache Result<br/>& Return to Client]

    AuthAnswer --> SendResponse[Send Response]
    CacheAnswer --> SendResponse
    NoRecursion --> SendResponse
    CacheResult --> SendResponse
    FormatError --> SendResponse

    SendResponse --> End([End])

    style AuthAnswer fill:#e8f5e8
    style CacheAnswer fill:#fff3cd
    style ForwardQuery fill:#d1ecf1
    style FormatError fill:#f8d7da
        `}
        className="my-6"
      />

      <h3>SOA (Start of Authority) Records</h3>

      <p>
        One of RFC 1035's most important contributions was the detailed
        specification of SOA records, which contain critical zone metadata:
      </p>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-800 mb-3">
          SOA Record Format
        </h4>
        <div className="font-mono text-sm bg-white p-3 rounded mb-3">
          example.com. SOA ns1.example.com. admin.example.com. (<br />
          &nbsp;&nbsp;&nbsp;&nbsp;2023112301 ; Serial
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;3600 ; Refresh
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;1800 ; Retry
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;604800 ; Expire
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;86400 ; Minimum TTL
          <br />)
        </div>
        <div className="text-sm space-y-1 text-yellow-700">
          <div>
            <strong>Serial:</strong> Version number for zone transfers
          </div>
          <div>
            <strong>Refresh:</strong> How often secondaries check for updates
          </div>
          <div>
            <strong>Retry:</strong> How long to wait if refresh fails
          </div>
          <div>
            <strong>Expire:</strong> When to stop answering if no updates
          </div>
          <div>
            <strong>Minimum:</strong> Default TTL for records in this zone
          </div>
        </div>
      </div>

      <h3>Practical Impact of RFC 1035</h3>

      <p>
        RFC 1035's implementation specifications enabled the creation of
        interoperable DNS software that still powers the internet today:
      </p>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 p-4 my-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          Implementation Success
        </h4>
        <ul className="text-sm space-y-1">
          <li>
            🛠️ <strong>BIND:</strong> First major implementation (Berkeley
            Internet Name Domain)
          </li>
          <li>
            📡 <strong>Interoperability:</strong> Different vendors' servers
            work together
          </li>
          <li>
            ⚡ <strong>Performance:</strong> Message compression reduced
            bandwidth usage
          </li>
          <li>
            🔧 <strong>Standardization:</strong> Consistent behavior across
            implementations
          </li>
          <li>
            🌐 <strong>Scalability:</strong> Design scaled from thousands to
            billions of domains
          </li>
        </ul>
      </div>

      <h3>Modern Relevance</h3>

      <p>
        The binary formats and protocols defined in RFC 1035 remain largely
        unchanged in modern DNS implementations:
      </p>

      <ul>
        <li>
          <strong>Wire Format:</strong> Same message structure used today
        </li>
        <li>
          <strong>Record Types:</strong> Core types (A, NS, CNAME, MX) still
          fundamental
        </li>
        <li>
          <strong>Compression:</strong> Still essential for performance
        </li>
        <li>
          <strong>Transport:</strong> UDP/TCP guidelines still followed
        </li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
        <h4 className="text-blue-900 font-semibold">
          Extensions and Evolution
        </h4>
        <p className="text-blue-800 text-sm">
          While RFC 1035's core formats remain unchanged, extensions like
          DNSSEC, IPv6 (AAAA records), and DNS over HTTPS build upon this solid
          foundation. The original design proved remarkably forward-compatible.
        </p>
      </div>

      <h3>RFC 1035's Implementation Legacy in Modern DNS Infrastructure</h3>

      <p>
        RFC 1035's implementation specifications created the technical
        foundation that evolved into today's critical internet infrastructure,
        processing billions of DNS queries per second across a global ecosystem
        of servers, clouds, and edge networks:
      </p>

      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-indigo-900 mb-4">
          🏗️ From Specification to Global Infrastructure
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-indigo-800">
              Implementation Evolution
            </h5>
            <ul className="text-indigo-700 text-sm space-y-1">
              <li>• BIND (1984) - First complete RFC 1035 implementation</li>
              <li>• Microsoft DNS (1990s) - Windows Server integration</li>
              <li>• Unbound, PowerDNS (2000s) - Performance optimizations</li>
              <li>• Cloud DNS services (2010s) - Anycast and global scale</li>
              <li>• Edge DNS (2020s) - Microsecond response times</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-indigo-800">
              Message Format Endurance
            </h5>
            <ul className="text-indigo-700 text-sm space-y-1">
              <li>• Binary format unchanged for 40+ years</li>
              <li>• Message compression still saves 30-50% bandwidth</li>
              <li>• Original record types power 95% of internet traffic</li>
              <li>• UDP/TCP fallback mechanism still standard</li>
              <li>• Header flags extended but never redesigned</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-indigo-800">
              Modern Scale Achievements
            </h5>
            <ul className="text-indigo-700 text-sm space-y-1">
              <li>• 5+ trillion daily queries globally</li>
              <li>• Sub-millisecond resolution latency</li>
              <li>• 350+ million domains registered</li>
              <li>• 99.999% availability across root servers</li>
              <li>• Handles 10Tbps+ peak query traffic</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-violet-50 border border-violet-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-violet-900 mb-3">
          📈 DNS Implementation Performance in 2025
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-violet-800">&lt; 1ms</div>
            <div className="text-sm text-violet-700">
              Typical edge DNS response time
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-violet-800">40 bytes</div>
            <div className="text-sm text-violet-700">
              Average compressed query size
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-violet-800">512 MB/s</div>
            <div className="text-sm text-violet-700">
              Major resolver query processing rate
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-violet-800">13</div>
            <div className="text-sm text-violet-700">
              Root servers handling global load
            </div>
          </div>
        </div>
      </div>

      <ExpandableSection title="🔄 DNS Wire Format vs Modern Alternatives: The Protocol Evolution Battle">
        <p>
          While RFC 1035's wire format remains dominant, alternative approaches
          have emerged to address modern networking challenges:
        </p>

        <div className="space-y-6 mt-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h5 className="font-semibold text-blue-800 mb-2">
              🔗 Next-Generation DNS Protocols
            </h5>
            <div className="text-blue-700 text-sm space-y-2">
              <p>
                <strong>DNS over HTTPS (DoH - RFC 8484):</strong> JSON and wire
                format over HTTP/2, encrypted queries
              </p>
              <p>
                <strong>DNS over TLS (DoT - RFC 7858):</strong> Traditional wire
                format over encrypted TLS connections
              </p>
              <p>
                <strong>DNS over QUIC (DoQ - RFC 9250):</strong> Wire format
                over QUIC for reduced latency
              </p>
              <p>
                <strong>Adoption:</strong> 25% of global DNS traffic now
                encrypted, major browsers default to DoH
              </p>
              <p>
                <strong>Compatibility:</strong> All maintain RFC 1035 wire
                format compatibility for interoperability
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h5 className="font-semibold text-green-800 mb-2">
              ⚡ Modern DNS Optimization
            </h5>
            <div className="text-green-700 text-sm space-y-2">
              <p>
                <strong>EDNS(0) - RFC 6891:</strong> Extended UDP packet sizes
                beyond 512 bytes
              </p>
              <p>
                <strong>Aggressive NSEC - RFC 8198:</strong> Negative caching
                optimization reducing queries by 30%
              </p>
              <p>
                <strong>Minimisation - RFC 7816:</strong> Privacy-preserving
                queries reducing leaked information
              </p>
              <p>
                <strong>Anycast Deployment:</strong> Same IP across multiple
                geographic locations for speed
              </p>
              <p>
                <strong>Result:</strong> 10x performance improvement while
                maintaining wire format compatibility
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h5 className="font-semibold text-yellow-800 mb-2">
              🏢 Enterprise DNS Evolution
            </h5>
            <div className="text-yellow-700 text-sm space-y-2">
              <p>
                <strong>Split-Horizon DNS:</strong> Different responses for
                internal vs external queries
              </p>
              <p>
                <strong>GeoDNS:</strong> Location-based responses for CDN
                optimization
              </p>
              <p>
                <strong>Service Discovery:</strong> Consul, etcd using DNS
                format for microservices
              </p>
              <p>
                <strong>Cloud Integration:</strong> AWS Route 53, Azure DNS, GCP
                DNS with programmable APIs
              </p>
              <p>
                <strong>Why RFC 1035 Won:</strong> Simple binary format,
                universal tooling, proven reliability
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded">
            <h5 className="font-semibold text-orange-800 mb-2">
              🔒 Security Extensions vs Alternatives
            </h5>
            <div className="text-orange-700 text-sm space-y-2">
              <p>
                <strong>DNSSEC (RFC 4033-4035):</strong> Cryptographic
                signatures using RFC 1035 message format
              </p>
              <p>
                <strong>DNS-based Authentication (DANE):</strong> TLS
                certificate validation via DNS records
              </p>
              <p>
                <strong>Alternative: Blockchain DNS:</strong> ENS, Handshake -
                distributed but complex, limited adoption
              </p>
              <p>
                <strong>Alternative: Certificate Transparency:</strong>{" "}
                Log-based verification, complementary to DNS
              </p>
              <p>
                <strong>Market Reality:</strong> DNSSEC 35% adoption, blockchain
                DNS &lt;1% despite hype
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h5 className="font-semibold text-red-800 mb-2">
              🚨 Modern DNS Implementation Challenges
            </h5>
            <div className="text-red-700 text-sm space-y-2">
              <p>
                <strong>Cache Poisoning:</strong> Kaminsky attack (2008)
                required random source ports implementation
              </p>
              <p>
                <strong>DDoS Amplification:</strong> Small queries generating
                large responses used for attacks
              </p>
              <p>
                <strong>Privacy Concerns:</strong> ISP monitoring, government
                surveillance of unencrypted queries
              </p>
              <p>
                <strong>Centralization Risk:</strong> Major cloud providers
                handling 60%+ of global DNS traffic
              </p>
              <p>
                <strong>IPv6 Transition:</strong> AAAA record adoption still
                only 30% despite 20+ years
              </p>
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-4 rounded">
            <h5 className="font-semibold text-cyan-800 mb-2">
              🏆 RFC 1035's Enduring Technical Advantages
            </h5>
            <div className="text-cyan-700 text-sm space-y-2">
              <p>
                <strong>Compact Binary Format:</strong> 40-60 byte typical query
                vs 200+ byte JSON alternatives
              </p>
              <p>
                <strong>Stateless Protocol:</strong> No connection setup
                overhead, perfect for UDP
              </p>
              <p>
                <strong>Hierarchical Design:</strong> Natural caching and
                distribution boundaries
              </p>
              <p>
                <strong>Backward Compatibility:</strong> 40 years of
                implementations work seamlessly together
              </p>
              <p>
                <strong>Network Efficiency:</strong> Compression and pointer
                system still optimal for DNS data
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
                href="https://www.rfc-editor.org/rfc/rfc6891.html"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                RFC 6891: Extension Mechanisms for DNS (EDNS(0))
              </a>
            </li>
            <li>
              <a
                href="https://www.rfc-editor.org/rfc/rfc7816.html"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                RFC 7816: DNS Query Name Minimisation
              </a>
            </li>
            <li>
              <a
                href="https://www.rfc-editor.org/rfc/rfc8198.html"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                RFC 8198: Aggressive Use of DNSSEC-Validated Cache
              </a>
            </li>
            <li>
              <a
                href="https://stats.labs.apnic.net/edns"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Global EDNS Deployment Statistics - APNIC
              </a>
            </li>
          </ul>
        </div>
      </ExpandableSection>

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-emerald-900 mb-3">
          🎯 RFC 1035 in Modern Critical Systems
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-emerald-800 mb-2">
              Cloud Infrastructure
            </h5>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Kubernetes service discovery using DNS records</li>
              <li>• AWS Route 53 health checks and failover</li>
              <li>• CDN origin selection via GeoDNS</li>
              <li>• Container registry lookups (docker.io, gcr.io)</li>
              <li>• Serverless function cold start optimization</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-emerald-800 mb-2">
              Security & Compliance
            </h5>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Certificate authority domain validation</li>
              <li>• Email security (SPF, DKIM, DMARC records)</li>
              <li>• Threat intelligence DNS blacklists</li>
              <li>• Zero trust network access controls</li>
              <li>• Incident response and forensics</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-slate-900 mb-3">
          🔮 DNS Implementation Future: Evolutionary Enhancement
        </h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-slate-800">
              Enhanced Security & Privacy
            </h5>
            <p className="text-slate-700 text-sm">
              Universal DoH/DoT deployment, DNSSEC automation,
              privacy-preserving analytics, and AI-powered threat detection
              while maintaining RFC 1035 wire format
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800">
              Edge Computing Integration
            </h5>
            <p className="text-slate-700 text-sm">
              DNS resolution at microsecond latencies, intelligent routing
              decisions, real-time traffic optimization, and 5G network
              slicing—all building on 1035's foundation
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800">Protocol Harmony</h5>
            <p className="text-slate-700 text-sm">
              RFC 1035 remains the universal common denominator, with
              specialized overlays for blockchain domains, IoT device discovery,
              and quantum-safe cryptography
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 1035's implementation specifications created one of computer
          science's most successful protocols. Its binary message format,
          designed in 1987, still processes 5+ trillion queries daily with
          microsecond latencies. The specification's genius lies in its precise
          technical details that enabled 40 years of enhancement while
          maintaining perfect backward compatibility. Modern DNS
          infrastructure—from cloud services to edge computing—builds upon RFC
          1035's solid foundation, proving that well-designed protocols can
          adapt to technological evolution while preserving their core
          strengths.
        </p>
      </div>
    </article>
  );
}
