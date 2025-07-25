export interface RfcTag {
  id: string;
  name: string;
  category: "protocol" | "technology" | "level" | "relevance";
  color: string;
  description: string;
}

export interface RfcMetadata {
  number: number;
  title: string;
  description: string;
  era: "foundation" | "protocol-expansion" | "web-era" | "modern" | "current";
  year: number;
  learningObjectives: string[];
  tags: string[];
  rfcUrl?: string;
}

export const rfcEras = {
  foundation: {
    name: "Foundation Era",
    period: "1969-1982",
    description: "The birth of the internet and core protocols",
    color: "bg-[#0072b2]",
  },
  "protocol-expansion": {
    name: "Protocol Expansion",
    period: "1983-1990",
    description: "Building the internet infrastructure",
    color: "bg-[#009e73]",
  },
  "web-era": {
    name: "Web Era",
    period: "1990s-2000s",
    description: "The World Wide Web revolution",
    color: "bg-[#cc79a7]",
  },
  modern: {
    name: "Modern Networking",
    period: "2000s-2010s",
    description: "Security and performance improvements",
    color: "bg-[#f0e442]",
  },
  current: {
    name: "Current Standards",
    period: "2020s",
    description: "Latest developments and standards",
    color: "bg-[#d55e00]",
  },
};

export const rfcTags: Record<string, RfcTag> = {
  // Protocol Category Tags
  "transport": {
    id: "transport",
    name: "Transport",
    category: "protocol",
    color: "bg-[#0072b2]",
    description: "Transport layer protocols (TCP, UDP)"
  },
  "application": {
    id: "application",
    name: "Application",
    category: "protocol",
    color: "bg-[#009e73]",
    description: "Application layer protocols (HTTP, SMTP, FTP)"
  },
  "network": {
    id: "network",
    name: "Network",
    category: "protocol",
    color: "bg-[#cc79a7]",
    description: "Network layer protocols (IP, IPv6, routing)"
  },
  "security": {
    id: "security",
    name: "Security",
    category: "protocol",
    color: "bg-[#d55e00]",
    description: "Security and cryptographic protocols"
  },
  "naming": {
    id: "naming",
    name: "Naming",
    category: "protocol",
    color: "bg-[#f0e442]",
    description: "Naming and addressing protocols (DNS)"
  },
  
  // Technology Focus Tags
  "cryptography": {
    id: "cryptography",
    name: "Cryptography",
    category: "technology",
    color: "bg-[#0072b2]",
    description: "Encryption, authentication, and key exchange"
  },
  "nat-traversal": {
    id: "nat-traversal",
    name: "NAT Traversal",
    category: "technology",
    color: "bg-[#009e73]",
    description: "NAT and firewall traversal techniques"
  },
  "vpn": {
    id: "vpn",
    name: "VPN",
    category: "technology",
    color: "bg-[#cc79a7]",
    description: "VPN and tunneling technologies"
  },
  "p2p": {
    id: "p2p",
    name: "P2P",
    category: "technology",
    color: "bg-[#d55e00]",
    description: "Peer-to-peer networking concepts"
  },
  "performance": {
    id: "performance",
    name: "Performance",
    category: "technology",
    color: "bg-[#f0e442]",
    description: "Optimization and performance improvements"
  },
  "legacy": {
    id: "legacy",
    name: "Legacy",
    category: "technology",
    color: "bg-gray-600",
    description: "Historical technologies with learning value"
  },
  
  // Learning Level Tags
  "foundational": {
    id: "foundational",
    name: "Foundational",
    category: "level",
    color: "bg-[#009e73]",
    description: "Core concepts, suitable for beginners"
  },
  "intermediate": {
    id: "intermediate",
    name: "Intermediate",
    category: "level",
    color: "bg-[#f0e442]",
    description: "Requires basic networking knowledge"
  },
  "advanced": {
    id: "advanced",
    name: "Advanced",
    category: "level",
    color: "bg-gray-600",
    description: "Complex protocols requiring deep technical understanding"
  },
  
  // Industry Relevance Tags
  "enterprise": {
    id: "enterprise",
    name: "Enterprise",
    category: "relevance",
    color: "bg-gray-600",
    description: "Enterprise networking and service provider technologies"
  },
  "consumer": {
    id: "consumer",
    name: "Consumer",
    category: "relevance",
    color: "bg-[#0072b2]",
    description: "Consumer internet and web technologies"
  },
  "infrastructure": {
    id: "infrastructure",
    name: "Infrastructure",
    category: "relevance",
    color: "bg-[#cc79a7]",
    description: "Core internet infrastructure protocols"
  },
  "emerging": {
    id: "emerging",
    name: "Emerging",
    category: "relevance",
    color: "bg-[#d55e00]",
    description: "Cutting-edge or recently standardized protocols"
  }
};

export const rfcs: RfcMetadata[] = [
  {
    number: 1,
    title: "Host Software",
    description:
      "The very first RFC that established the RFC series and collaborative spirit of internet development.",
    era: "foundation",
    year: 1969,
    learningObjectives: [
      "Understand the historical significance of the first RFC",
      "Learn about the informal collaborative nature of early internet development",
      "Explore the origins of the RFC system",
    ],
    tags: ["foundational", "legacy"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc1.html",
  },
  {
    number: 675,
    title: "Internet Transmission Control Program",
    description:
      "The foundational document for what would become TCP/IP, establishing internetworking concepts.",
    era: "foundation",
    year: 1974,
    learningObjectives: [
      "Understand the evolution from NCP to TCP/IP",
      "Learn about Vint Cerf's early internetworking concepts",
      "Explore the foundation of modern internet protocols",
    ],
    tags: ["transport", "foundational", "legacy"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc675.html",
  },
  {
    number: 791,
    title: "Internet Protocol Version 4 (IPv4)",
    description:
      "The foundational IPv4 specification that powers most of today's internet.",
    era: "foundation",
    year: 1981,
    learningObjectives: [
      "Understand IPv4 packet structure and addressing",
      "Learn about routing and fragmentation",
      "Explore the protocol that powers most of today's internet",
    ],
    tags: ["network", "foundational"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc791.html",
  },
  {
    number: 793,
    title: "Transmission Control Protocol (TCP)",
    description:
      "The TCP specification that enables reliable internet communication.",
    era: "foundation",
    year: 1981,
    learningObjectives: [
      "Understand TCP's reliable delivery mechanisms",
      "Learn about connection establishment and teardown",
      "Explore flow control and congestion management",
      "Master the three-way handshake",
    ],
    tags: ["transport", "foundational"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc793.html",
  },
  {
    number: 821,
    title: "Simple Mail Transfer Protocol (SMTP)",
    description:
      "The foundational email protocol that still powers internet email today.",
    era: "foundation",
    year: 1982,
    learningObjectives: [
      "Understand SMTP's role in email delivery",
      "Learn about mail routing and relay concepts",
      "Explore the protocol commands and responses",
      "Connect to modern email infrastructure",
    ],
    tags: ["application", "foundational"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc821.html",
  },
  {
    number: 959,
    title: "File Transfer Protocol (FTP)",
    description:
      "The classic file transfer protocol that established client-server file sharing models.",
    era: "protocol-expansion",
    year: 1985,
    learningObjectives: [
      "Understand FTP's client-server architecture",
      "Learn about active and passive connection modes",
      "Explore file transfer and directory operations",
      "Connect to modern file sharing concepts",
    ],
    tags: ["application", "foundational", "legacy"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc959.html",
  },
  {
    number: 1034,
    title: "Domain Names - Concepts and Facilities",
    description:
      "The foundational DNS specification that created the hierarchical naming system powering the modern internet.",
    era: "protocol-expansion",
    year: 1987,
    learningObjectives: [
      "Understand the hierarchical domain name space",
      "Learn about distributed DNS authority and delegation",
      "Explore DNS caching and performance optimization",
      "Master the concepts behind internet naming",
    ],
    tags: ["naming", "foundational", "performance"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc1034.html",
  },
  {
    number: 1035,
    title: "Domain Names - Implementation and Specification",
    description:
      "The technical implementation blueprint for DNS, defining message formats, resource records, and practical server guidelines.",
    era: "protocol-expansion",
    year: 1987,
    learningObjectives: [
      "Master DNS message format and binary protocols",
      "Understand resource record types and encoding",
      "Learn message compression techniques",
      "Explore practical DNS server implementation",
    ],
    tags: ["naming", "intermediate", "performance"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc1035.html",
  },
  {
    number: 1390,
    title: "Transmission of IP and ARP over FDDI Networks",
    description:
      "Specification for running IP and ARP over FDDI networks, demonstrating internet protocol adaptability to new technologies.",
    era: "protocol-expansion",
    year: 1993,
    learningObjectives: [
      "Understand network protocol encapsulation principles",
      "Learn about technology evolution and interoperability",
      "Explore MTU handling and fragmentation concepts",
      "Master address resolution across different network types",
    ],
    tags: ["network", "intermediate", "legacy"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc1390.html",
  },
  {
    number: 1945,
    title: "Hypertext Transfer Protocol -- HTTP/1.0",
    description:
      "The foundational web protocol that established the request/response paradigm powering the World Wide Web.",
    era: "web-era",
    year: 1996,
    learningObjectives: [
      "Understand HTTP's simple request/response model",
      "Learn about web server and client communication",
      "Explore HTTP methods, headers, and status codes",
      "Master the protocol that launched the web revolution",
    ],
    tags: ["application", "foundational", "legacy"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc1945.html",
  },
  {
    number: 2068,
    title: "Hypertext Transfer Protocol -- HTTP/1.1",
    description:
      "The first version of HTTP/1.1 that introduced persistent connections and significant performance improvements over HTTP/1.0.",
    era: "web-era",
    year: 1997,
    learningObjectives: [
      "Understand persistent connections and their benefits",
      "Learn about chunked transfer encoding",
      "Explore the Host header requirement",
      "Master HTTP/1.1's performance improvements over HTTP/1.0",
    ],
    tags: ["application", "intermediate", "performance"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc2068.html",
  },
  {
    number: 2401,
    title: "Security Architecture for the Internet Protocol",
    description:
      "The foundational IPsec specification that established network-layer security architecture for VPNs and secure communications.",
    era: "web-era",
    year: 1998,
    learningObjectives: [
      "Understand IPsec's network-layer security approach",
      "Learn about Authentication Header (AH) and Encapsulating Security Payload (ESP)",
      "Explore Security Associations (SA) and key management",
      "Master the foundation of modern VPN technologies",
    ],
    tags: ["security", "vpn", "cryptography", "intermediate"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc2401.html",
  },
  {
    number: 2460,
    title: "Internet Protocol, Version 6 (IPv6) Specification",
    description:
      "The next-generation internet protocol that addresses IPv4's limitations with vastly expanded address space and improved functionality.",
    era: "web-era",
    year: 1998,
    learningObjectives: [
      "Understand IPv6's 128-bit addressing and address space expansion",
      "Learn about IPv6 header simplification and extension headers",
      "Explore address autoconfiguration and neighbor discovery",
      "Master the protocol designed for the internet's future",
    ],
    tags: ["network", "intermediate", "emerging"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc2460.html",
  },
  {
    number: 2547,
    title: "BGP/MPLS VPNs",
    description:
      "The historical specification for BGP/MPLS Virtual Private Networks that established the foundation for modern service provider VPN technologies.",
    era: "web-era",
    year: 1999,
    learningObjectives: [
      "Understand BGP/MPLS VPN architecture and components",
      "Learn about Route Distinguishers and Route Targets",
      "Explore Provider Edge (PE) and Customer Edge (CE) roles",
      "Master the foundation of modern enterprise connectivity",
    ],
    tags: ["vpn", "advanced", "enterprise", "legacy"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc2547.html",
  },
  {
    number: 2684,
    title: "Multiprotocol Encapsulation over ATM",
    description:
      "The specification that enabled IP and other protocols to run over ATM networks, bridging telecommunications infrastructure with data networking.",
    era: "web-era",
    year: 1999,
    learningObjectives: [
      "Understand ATM cell structure and virtual circuits",
      "Learn LLC/SNAP vs VC-based multiplexing methods",
      "Explore AAL5 adaptation layer for data services",
      "Master protocol encapsulation over ATM infrastructure",
    ],
    tags: ["network", "advanced", "legacy", "enterprise"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc2684.html",
  },
  {
    number: 7748,
    title: "Elliptic Curves for Security",
    description:
      "The specification defining Curve25519 and Curve448, with Curve25519 being the high-performance elliptic curve that powers WireGuard's key exchange.",
    era: "modern",
    year: 2016,
    learningObjectives: [
      "Understand modern elliptic curve cryptography design principles",
      "Learn about Curve25519's mathematical properties and security",
      "Explore the X25519 key agreement function implementation",
      "Master the cryptographic foundation of WireGuard's performance",
    ],
    tags: ["cryptography", "advanced", "security", "emerging"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc7748.html",
  },
  {
    number: 8439,
    title: "ChaCha20 and Poly1305 for IETF Protocols",
    description:
      "The specification defining ChaCha20-Poly1305 AEAD, the authenticated encryption algorithm that provides WireGuard's exceptional performance and security.",
    era: "modern",
    year: 2018,
    learningObjectives: [
      "Understand authenticated encryption with associated data (AEAD)",
      "Learn ChaCha20 stream cipher and Poly1305 authenticator design",
      "Explore software-optimized cryptography performance benefits",
      "Master the encryption technology powering modern VPN protocols",
    ],
    tags: ["cryptography", "advanced", "security", "performance"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc8439.html",
  },
  {
    number: 5389,
    title: "Session Traversal Utilities for NAT (STUN)",
    description:
      "The foundational NAT traversal protocol that enables applications to discover their public IP address and NAT type, essential for peer-to-peer connectivity.",
    era: "modern",
    year: 2008,
    learningObjectives: [
      "Understand STUN's role in NAT discovery and traversal",
      "Learn about different NAT types and their impact on connectivity",
      "Explore UDP hole punching techniques for P2P connections",
      "Master the protocol that enables modern peer-to-peer applications",
    ],
    tags: ["nat-traversal", "p2p", "intermediate"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc5389.html",
  },
  {
    number: 8445,
    title: "Interactive Connectivity Establishment (ICE)",
    description:
      "The comprehensive NAT traversal framework that combines STUN, TURN, and host discovery to establish optimal peer-to-peer connections in modern applications.",
    era: "modern",
    year: 2018,
    learningObjectives: [
      "Understand ICE's comprehensive connectivity establishment framework",
      "Learn about candidate gathering, prioritization, and selection",
      "Explore connectivity checking and optimal path selection",
      "Master the protocol powering WebRTC, Tailscale, and modern P2P applications",
    ],
    tags: ["nat-traversal", "p2p", "advanced", "emerging"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc8445.html",
  },
  {
    number: 4301,
    title: "Security Architecture for the Internet Protocol",
    description:
      "The updated IPsec security architecture that modernized network-layer security with refined policies, enhanced selectors, and improved integration for contemporary VPN technologies.",
    era: "modern",
    year: 2005,
    learningObjectives: [
      "Understand the modernized IPsec security architecture and policy framework",
      "Learn about Security Policy Database (SPD) and Security Association (SA) management",
      "Explore transport vs tunnel mode differences and use cases",
      "Master the architecture powering today's enterprise VPN deployments",
    ],
    tags: ["security", "vpn", "advanced", "enterprise"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc4301.html",
  },
  {
    number: 4303,
    title: "IP Encapsulating Security Payload (ESP)",
    description:
      "The core IPsec protocol providing confidentiality, authentication, and anti-replay protection through encryption and authentication mechanisms for secure network communications.",
    era: "modern",
    year: 2005,
    learningObjectives: [
      "Understand ESP packet structure and security services",
      "Learn about encryption algorithms, authentication methods, and AEAD ciphers",
      "Explore anti-replay protection and sequence number management",
      "Master the protocol that encrypts virtually every VPN connection",
    ],
    tags: ["security", "vpn", "cryptography", "advanced"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc4303.html",
  },
  {
    number: 8656,
    title: "Traversal Using Relays around NAT (TURN)",
    description:
      "The relay protocol that provides fallback connectivity when direct peer-to-peer connections fail, ensuring universal reachability through restrictive NATs and firewalls.",
    era: "current",
    year: 2020,
    learningObjectives: [
      "Understand TURN's relay mechanism for challenging NAT scenarios",
      "Learn about allocation management, permissions, and data transmission methods",
      "Explore integration with STUN and ICE for complete NAT traversal",
      "Master the fallback protocol ensuring universal peer-to-peer connectivity",
    ],
    tags: ["nat-traversal", "p2p", "advanced", "emerging"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc8656.html",
  },
  {
    number: 4787,
    title: "Network Address Translation (NAT) Behavioral Requirements for Unicast UDP",
    description:
      "The definitive specification for NAT behavioral requirements that ensures consistent NAT behavior across implementations, enabling reliable peer-to-peer connectivity and NAT traversal.",
    era: "modern",
    year: 2007,
    learningObjectives: [
      "Understand NAT mapping behaviors (endpoint-independent, address-dependent, address-port-dependent)",
      "Learn NAT filtering requirements and security implications",
      "Explore UDP hole punching techniques and their reliability",
      "Master the requirements that enable modern P2P applications and WebRTC",
    ],
    tags: ["nat-traversal", "intermediate", "p2p"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc4787.html",
  },
  {
    number: 4364,
    title: "BGP/MPLS IP VPNs",
    description:
      "The current standard for BGP/MPLS IP VPN services that replaced RFC 2547, defining how service providers deliver secure, scalable VPN connectivity to enterprise customers worldwide.",
    era: "modern",
    year: 2006,
    learningObjectives: [
      "Understand modern BGP/MPLS IP VPN architecture and service delivery",
      "Learn VRF isolation, route distinguishers, and route target policies",
      "Explore MP-BGP VPNv4 route distribution and MPLS label operations",
      "Master the technology powering 95% of Fortune 500 enterprise connectivity",
    ],
    tags: ["vpn", "advanced", "enterprise"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc4364.html",
  },
  {
    number: 7540,
    title: "Hypertext Transfer Protocol Version 2 (HTTP/2)",
    description:
      "The revolutionary HTTP protocol that introduced binary framing, stream multiplexing, header compression, and server push, transforming web performance for billions of users worldwide.",
    era: "modern",
    year: 2015,
    learningObjectives: [
      "Understand HTTP/2's binary framing protocol and stream multiplexing",
      "Learn HPACK header compression and server push optimization",
      "Explore flow control, stream prioritization, and connection management",
      "Master the protocol that powers 95% of modern web traffic and applications",
    ],
    tags: ["application", "performance", "advanced"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc7540.html",
  },
  {
    number: 9110,
    title: "HTTP Semantics",
    description:
      "The core HTTP semantics specification that defines fundamental protocol behavior including methods, status codes, headers, and the request/response model that powers all modern web communication.",
    era: "current",
    year: 2022,
    learningObjectives: [
      "Understand comprehensive HTTP method semantics (safe, idempotent, non-idempotent)",
      "Learn definitive status code usage and error handling patterns",
      "Explore request/response model and header field semantics",
      "Master the semantic foundation that underlies all HTTP protocol versions",
    ],
    tags: ["application", "foundational", "emerging"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc9110.html",
  },
  {
    number: 9111,
    title: "HTTP Caching",
    description:
      "The comprehensive HTTP caching specification that defines cache control directives, freshness calculations, and validation mechanisms enabling modern web performance optimization.",
    era: "current",
    year: 2022,
    learningObjectives: [
      "Understand cache control directives and their interactions",
      "Learn freshness calculation and revalidation mechanisms",
      "Explore conditional requests and validation with ETags",
      "Master caching strategies that power CDNs and browser performance",
    ],
    tags: ["application", "performance", "intermediate"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc9111.html",
  },
  {
    number: 9112,
    title: "HTTP/1.1",
    description:
      "The precise HTTP/1.1 message format specification that defines parsing rules, connection management, and security considerations for the text-based HTTP protocol.",
    era: "current",
    year: 2022,
    learningObjectives: [
      "Understand HTTP/1.1 message structure and parsing requirements",
      "Learn connection management and persistent connection behavior",
      "Explore security improvements including request smuggling prevention",
      "Master the wire protocol that remains widely deployed alongside HTTP/2 and HTTP/3",
    ],
    tags: ["application", "intermediate", "security"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc9112.html",
  },
  {
    number: 9113,
    title: "HTTP/2",
    description:
      "The updated HTTP/2 specification that defines binary framing, stream multiplexing, header compression, and the performance improvements over HTTP/1.1.",
    era: "current",
    year: 2022,
    learningObjectives: [
      "Understand HTTP/2 binary framing and stream multiplexing",
      "Learn HPACK header compression and flow control mechanisms",
      "Explore server push and stream prioritization features",  
      "Master the binary protocol that powers 95% of modern web traffic",
    ],
    tags: ["application", "performance", "advanced"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc9113.html",
  },
  {
    number: 9114,
    title: "HTTP/3",
    description:
      "The HTTP/3 specification that runs over QUIC transport, enabling 0-RTT connections, connection migration, built-in encryption, and elimination of head-of-line blocking.",
    era: "current",
    year: 2022,
    learningObjectives: [
      "Understand HTTP/3 over QUIC transport advantages",
      "Learn 0-RTT connection establishment and connection migration",
      "Explore QPACK header compression and stream independence",
      "Master the latest HTTP protocol optimized for mobile and high-latency networks",
    ],
    tags: ["application", "performance", "emerging"],
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc9114.html",
  },
];
