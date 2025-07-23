export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: "protocol" | "network" | "security" | "web" | "email" | "general";
  relatedTerms?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  // Protocol Terms
  {
    id: "tcp",
    term: "TCP",
    definition:
      "Transmission Control Protocol - A reliable, connection-oriented protocol that ensures data is delivered accurately and in order between applications over a network.",
    category: "protocol",
    relatedTerms: ["ip", "udp", "three-way-handshake"],
  },
  {
    id: "ip",
    term: "IP",
    definition:
      "Internet Protocol - The fundamental protocol that routes data packets across networks using IP addresses to identify source and destination.",
    category: "protocol",
    relatedTerms: ["tcp", "udp", "ipv4", "ipv6"],
  },
  {
    id: "ipv4",
    term: "IPv4",
    definition:
      "Internet Protocol Version 4 - Uses 32-bit addresses (like 192.168.1.1) allowing for about 4.3 billion unique addresses.",
    category: "protocol",
    relatedTerms: ["ip", "ipv6", "subnet"],
  },
  {
    id: "ipv6",
    term: "IPv6",
    definition:
      "Internet Protocol Version 6 - Uses 128-bit addresses providing virtually unlimited address space for future internet growth.",
    category: "protocol",
    relatedTerms: ["ip", "ipv4"],
  },
  {
    id: "smtp",
    term: "SMTP",
    definition:
      "Simple Mail Transfer Protocol - The standard protocol for sending email messages between servers across the internet.",
    category: "email",
    relatedTerms: ["email", "mx-record", "pop3", "imap"],
  },
  {
    id: "http",
    term: "HTTP",
    definition:
      "HyperText Transfer Protocol - The foundation protocol of the World Wide Web, used for transferring web pages and resources.",
    category: "web",
    relatedTerms: ["https", "html", "url", "web-server"],
  },
  {
    id: "https",
    term: "HTTPS",
    definition:
      "HTTP Secure - HTTP over TLS/SSL, providing encrypted communication between web browsers and servers.",
    category: "web",
    relatedTerms: ["http", "tls", "ssl", "encryption"],
  },
  {
    id: "dns",
    term: "DNS",
    definition:
      "Domain Name System - Translates human-readable domain names (like example.com) into IP addresses that computers use to connect.",
    category: "network",
    relatedTerms: ["domain", "ip", "mx-record", "cname"],
  },
  {
    id: "ftp",
    term: "FTP",
    definition:
      "File Transfer Protocol - A standard protocol for transferring files between computers over a network, commonly used for website uploads.",
    category: "protocol",
    relatedTerms: ["sftp", "file-transfer"],
  },

  // Network Terms
  {
    id: "packet",
    term: "Packet",
    definition:
      "A formatted unit of data carried across a network. Contains both the data being sent and control information like source/destination addresses.",
    category: "network",
    relatedTerms: ["header", "payload", "routing"],
  },
  {
    id: "header",
    term: "Header",
    definition:
      "Control information at the beginning of a data packet that contains metadata like source/destination addresses and protocol information.",
    category: "network",
    relatedTerms: ["packet", "payload"],
  },
  {
    id: "payload",
    term: "Payload",
    definition:
      "The actual data being transmitted in a packet, excluding headers and control information.",
    category: "network",
    relatedTerms: ["packet", "header"],
  },
  {
    id: "routing",
    term: "Routing",
    definition:
      "The process of determining the best path for data packets to travel from source to destination across networks.",
    category: "network",
    relatedTerms: ["router", "packet", "bgp"],
  },
  {
    id: "subnet",
    term: "Subnet",
    definition:
      "A logical subdivision of a larger network, allowing for better organization and security of network resources.",
    category: "network",
    relatedTerms: ["ipv4", "network", "cidr"],
  },
  {
    id: "port",
    term: "Port",
    definition:
      "A numerical identifier (0-65535) that allows multiple services to run on the same IP address by differentiating network connections.",
    category: "network",
    relatedTerms: ["tcp", "udp", "socket"],
  },

  // Web Terms
  {
    id: "url",
    term: "URL",
    definition:
      "Uniform Resource Locator - A web address that specifies the location and method for retrieving a resource on the internet.",
    category: "web",
    relatedTerms: ["http", "domain", "uri"],
  },
  {
    id: "html",
    term: "HTML",
    definition:
      "HyperText Markup Language - The standard markup language for creating web pages and applications.",
    category: "web",
    relatedTerms: ["http", "web-page", "css"],
  },
  {
    id: "web-server",
    term: "Web Server",
    definition:
      "A computer system that serves web pages to users over the internet using HTTP protocol.",
    category: "web",
    relatedTerms: ["http", "html", "client-server"],
  },

  // Email Terms
  {
    id: "mx-record",
    term: "MX Record",
    definition:
      "Mail Exchange record - A DNS record that specifies which mail servers are responsible for receiving email for a domain.",
    category: "email",
    relatedTerms: ["dns", "smtp", "email"],
  },
  {
    id: "pop3",
    term: "POP3",
    definition:
      "Post Office Protocol 3 - An email retrieval protocol that downloads messages from a server to a local client.",
    category: "email",
    relatedTerms: ["smtp", "imap", "email"],
  },
  {
    id: "imap",
    term: "IMAP",
    definition:
      "Internet Message Access Protocol - Allows email clients to access and manage messages stored on a mail server.",
    category: "email",
    relatedTerms: ["smtp", "pop3", "email"],
  },

  // Security Terms
  {
    id: "encryption",
    term: "Encryption",
    definition:
      "The process of encoding data so that only authorized parties can access it, protecting information during transmission.",
    category: "security",
    relatedTerms: ["https", "tls", "ssl"],
  },
  {
    id: "tls",
    term: "TLS",
    definition:
      "Transport Layer Security - A cryptographic protocol that provides secure communication over networks, successor to SSL.",
    category: "security",
    relatedTerms: ["ssl", "https", "encryption"],
  },
  {
    id: "ssl",
    term: "SSL",
    definition:
      "Secure Sockets Layer - An older cryptographic protocol for secure communication, now largely replaced by TLS.",
    category: "security",
    relatedTerms: ["tls", "https", "encryption"],
  },

  // General Terms
  {
    id: "client-server",
    term: "Client-Server",
    definition:
      "A network architecture where client devices request services or resources from centralized server computers.",
    category: "general",
    relatedTerms: ["web-server", "http", "tcp"],
  },
  {
    id: "three-way-handshake",
    term: "Three-way Handshake",
    definition:
      "TCP connection establishment process: SYN (client initiates), SYN-ACK (server responds), ACK (client confirms).",
    category: "protocol",
    relatedTerms: ["tcp", "connection"],
  },
  {
    id: "arpanet",
    term: "ARPANET",
    definition:
      "The Advanced Research Projects Agency Network - The precursor to the modern internet, developed by DARPA in the late 1960s.",
    category: "general",
    relatedTerms: ["internet", "tcp", "ip"],
  },
  {
    id: "rfc",
    term: "RFC",
    definition:
      "Request for Comments - Documents that describe internet standards, protocols, and procedures. The collaborative process that built the internet.",
    category: "general",
    relatedTerms: ["ietf", "internet-standard"],
  },
  {
    id: "ietf",
    term: "IETF",
    definition:
      "Internet Engineering Task Force - The organization that develops and promotes voluntary internet standards through the RFC process.",
    category: "general",
    relatedTerms: ["rfc", "internet-standard"],
  },

  // Additional networking terms for Docker examples
  {
    id: "socket",
    term: "Socket",
    definition:
      "A software endpoint that enables communication between two devices over a network, combining an IP address and port number.",
    category: "network",
    relatedTerms: ["tcp", "udp", "port", "ip"],
  },
  {
    id: "handshake",
    term: "Handshake",
    definition:
      "A negotiation process between two communicating entities to establish connection parameters before data transmission.",
    category: "protocol",
    relatedTerms: ["tcp", "three-way-handshake", "connection"],
  },
  {
    id: "connection",
    term: "Connection",
    definition:
      "An established communication link between two network endpoints, maintaining state and ensuring reliable data delivery.",
    category: "network",
    relatedTerms: ["tcp", "socket", "handshake"],
  },
  {
    id: "flow-control",
    term: "Flow Control",
    definition:
      "A mechanism to regulate the rate of data transmission to prevent overwhelming the receiving end and ensure reliable delivery.",
    category: "protocol",
    relatedTerms: ["tcp", "window-size", "backpressure"],
  },
  {
    id: "window-size",
    term: "Window Size",
    definition:
      "The amount of data that can be sent before requiring an acknowledgment, used in TCP flow control.",
    category: "protocol",
    relatedTerms: ["tcp", "flow-control", "buffer"],
  },
  {
    id: "buffer",
    term: "Buffer",
    definition:
      "Temporary storage area in memory used to hold data while it is being transferred between locations or processed.",
    category: "network",
    relatedTerms: ["tcp", "socket", "flow-control"],
  },
  {
    id: "sequence-number",
    term: "Sequence Number",
    definition:
      "A number assigned to each byte of data in TCP to ensure proper ordering and detect missing or duplicate packets.",
    category: "protocol",
    relatedTerms: ["tcp", "acknowledgment", "reliability"],
  },
  {
    id: "acknowledgment",
    term: "Acknowledgment",
    definition:
      "A response message confirming successful receipt of data, used in reliable protocols like TCP.",
    category: "protocol",
    relatedTerms: ["tcp", "sequence-number", "reliability"],
  },
  {
    id: "reliability",
    term: "Reliability",
    definition:
      "The guarantee that data will be delivered accurately and completely, even over an unreliable network.",
    category: "protocol",
    relatedTerms: ["tcp", "acknowledgment", "retransmission"],
  },
  {
    id: "retransmission",
    term: "Retransmission",
    definition:
      "The process of sending data again when the original transmission is lost, corrupted, or not acknowledged.",
    category: "protocol",
    relatedTerms: ["tcp", "reliability", "acknowledgment"],
  },
  {
    id: "backpressure",
    term: "Backpressure",
    definition:
      "A flow control mechanism where the receiver signals the sender to slow down transmission to prevent buffer overflow.",
    category: "protocol",
    relatedTerms: ["flow-control", "tcp", "buffer"],
  },
  {
    id: "congestion-control",
    term: "Congestion Control",
    definition:
      "Mechanisms to prevent network congestion by controlling the rate at which data is sent into the network.",
    category: "protocol",
    relatedTerms: ["tcp", "flow-control", "slow-start"],
  },
  {
    id: "slow-start",
    term: "Slow Start",
    definition:
      "A TCP congestion control algorithm that gradually increases the sending rate to find the optimal transmission speed.",
    category: "protocol",
    relatedTerms: ["tcp", "congestion-control"],
  },

  // IPv6 and Security Terms for RFC 2401 and 2460
  {
    id: "ipsec",
    term: "IPsec",
    definition:
      "Internet Protocol Security - A framework for securing IP communications through authentication and encryption at the network layer.",
    category: "security",
    relatedTerms: ["vpn", "ah", "esp", "ike", "sa"],
  },
  {
    id: "vpn",
    term: "VPN",
    definition:
      "Virtual Private Network - A secure connection that allows private network access over a public network, commonly using IPsec.",
    category: "security",
    relatedTerms: ["ipsec", "tunnel", "encryption"],
  },
  {
    id: "ah",
    term: "AH",
    definition:
      "Authentication Header - An IPsec protocol that provides data integrity and authentication without encryption.",
    category: "security",
    relatedTerms: ["ipsec", "esp", "authentication"],
  },
  {
    id: "esp",
    term: "ESP",
    definition:
      "Encapsulating Security Payload - An IPsec protocol that provides confidentiality through encryption plus optional authentication.",
    category: "security", 
    relatedTerms: ["ipsec", "ah", "encryption"],
  },
  {
    id: "sa",
    term: "SA",
    definition:
      "Security Association - A set of security parameters (algorithms, keys, lifetimes) that define how to protect communication between two parties.",
    category: "security",
    relatedTerms: ["ipsec", "spi", "ike"],
  },
  {
    id: "spi",
    term: "SPI",
    definition:
      "Security Parameter Index - A unique identifier used to distinguish different Security Associations in IPsec.",
    category: "security",
    relatedTerms: ["sa", "ipsec"],
  },
  {
    id: "ike",
    term: "IKE",
    definition:
      "Internet Key Exchange - A protocol for establishing and managing cryptographic keys for IPsec Security Associations.",
    category: "security",
    relatedTerms: ["ipsec", "sa", "key-management"],
  },
  {
    id: "sad",
    term: "SAD",
    definition:
      "Security Association Database - A data structure that stores active Security Associations and their parameters.",
    category: "security",
    relatedTerms: ["sa", "ipsec", "spi"],
  },
  {
    id: "nat",
    term: "NAT",
    definition:
      "Network Address Translation - A method for remapping IP addresses by modifying address information in packet headers while in transit.",
    category: "network",
    relatedTerms: ["ipv4", "ipv6", "private-ip"],
  },
  {
    id: "slaac",
    term: "SLAAC",
    definition:
      "Stateless Address Autoconfiguration - An IPv6 feature that allows devices to automatically configure their own IP addresses without DHCP.",
    category: "network",
    relatedTerms: ["ipv6", "dhcp", "autoconfiguration"],
  },
  {
    id: "dhcp",
    term: "DHCP",
    definition:
      "Dynamic Host Configuration Protocol - Automatically assigns IP addresses and network configuration to devices on a network.",
    category: "network",
    relatedTerms: ["ip", "ipv4", "ipv6", "slaac"],
  },
  {
    id: "eui-64",
    term: "EUI-64",
    definition:
      "Extended Unique Identifier - A method for generating IPv6 interface identifiers from MAC addresses using a 64-bit format.",
    category: "network",
    relatedTerms: ["ipv6", "mac-address", "interface-id"],
  },
  {
    id: "link-local",
    term: "Link-Local",
    definition:
      "IPv6 addresses (fe80::/10) that are only valid within a single network segment and not routable beyond the local link.",
    category: "network",
    relatedTerms: ["ipv6", "fe80", "local-network"],
  },
  {
    id: "multicast",
    term: "Multicast",
    definition:
      "A communication method where data is sent from one sender to multiple receivers simultaneously, using special addresses (IPv6: ff00::/8).",
    category: "network",
    relatedTerms: ["ipv6", "anycast", "unicast", "broadcast"],
  },
  {
    id: "anycast",
    term: "Anycast",
    definition:
      "A network addressing method where the same IP address is assigned to multiple nodes, and traffic is routed to the nearest one.",
    category: "network",
    relatedTerms: ["ipv6", "multicast", "unicast", "routing"],
  },
  {
    id: "unicast",
    term: "Unicast",
    definition:
      "Traditional one-to-one communication where data is sent from a single sender to a single specific receiver.",
    category: "network",
    relatedTerms: ["multicast", "anycast", "ip"],
  },
  {
    id: "tunnel",
    term: "Tunnel",
    definition:
      "A method of encapsulating one protocol within another, commonly used in VPNs to securely transmit data across public networks.",
    category: "network",
    relatedTerms: ["vpn", "ipsec", "encapsulation"],
  },
  {
    id: "extension-header",
    term: "Extension Header",
    definition:
      "Optional IPv6 headers that provide additional functionality like routing, fragmentation, or security options without bloating the main header.",
    category: "protocol",
    relatedTerms: ["ipv6", "header", "optional"],
  },
  {
    id: "hop-limit",
    term: "Hop Limit",
    definition:
      "IPv6 equivalent of TTL (Time To Live) - limits the number of hops a packet can make to prevent infinite loops.",
    category: "protocol",
    relatedTerms: ["ipv6", "ttl", "routing"],
  },
  {
    id: "flow-label",
    term: "Flow Label",
    definition:
      "A 20-bit field in IPv6 headers used to identify and prioritize related packets belonging to the same communication flow.",
    category: "protocol",
    relatedTerms: ["ipv6", "qos", "traffic-class"],
  },
  {
    id: "authentication",
    term: "Authentication",
    definition:
      "The process of verifying the identity of a user, device, or system, ensuring that communication is with the intended party.",
    category: "security",
    relatedTerms: ["ipsec", "ah", "digital-signature"],
  },
  {
    id: "integrity",
    term: "Integrity",
    definition:
      "Assurance that data has not been altered, corrupted, or tampered with during transmission or storage.",
    category: "security",
    relatedTerms: ["authentication", "hash", "checksum"],
  },
  {
    id: "confidentiality",
    term: "Confidentiality",
    definition:
      "Protection of information from unauthorized access or disclosure, typically achieved through encryption.",
    category: "security",
    relatedTerms: ["encryption", "esp", "privacy"],
  },

  // Service Provider and BGP/MPLS VPN Terms
  {
    id: "bgp-mpls-vpns",
    term: "BGP/MPLS VPNs",
    definition:
      "A technology that uses BGP to distribute VPN routing information and MPLS to forward traffic, enabling service providers to offer scalable VPN services.",
    category: "network",
    relatedTerms: ["bgp", "mpls", "vpn", "vrf", "route-target"],
  },
  {
    id: "bgp",
    term: "BGP",
    definition:
      "Border Gateway Protocol - The routing protocol used to exchange routing information between different autonomous systems on the internet.",
    category: "protocol",
    relatedTerms: ["routing", "autonomous-system", "bgp-mpls-vpns"],
  },
  {
    id: "mpls",
    term: "MPLS",
    definition:
      "Multiprotocol Label Switching - A technique that uses labels to forward packets through a network, enabling traffic engineering and VPN services.",
    category: "network",
    relatedTerms: ["label-switching", "bgp-mpls-vpns", "traffic-engineering"],
  },
  {
    id: "vrf",
    term: "VRF",
    definition:
      "Virtual Routing and Forwarding - A technology that allows multiple routing tables to coexist on the same router, enabling customer traffic isolation.",
    category: "network",
    relatedTerms: ["bgp-mpls-vpns", "route-target", "pe-router"],
  },
  {
    id: "route-target",
    term: "Route Target",
    definition:
      "BGP extended communities that control which VPN routes are imported and exported between different customer sites in BGP/MPLS VPNs.",
    category: "network",
    relatedTerms: ["bgp-mpls-vpns", "vrf", "route-distinguisher"],
  },
  {
    id: "route-distinguisher",
    term: "Route Distinguisher",
    definition:
      "A unique identifier prepended to customer routes in BGP/MPLS VPNs to make them globally unique across all customers.",
    category: "network",
    relatedTerms: ["bgp-mpls-vpns", "route-target", "vrf"],
  },
  {
    id: "pe-router",
    term: "PE Router",
    definition:
      "Provider Edge Router - A service provider router that maintains customer VRFs and handles VPN traffic separation and forwarding.",
    category: "network",
    relatedTerms: ["bgp-mpls-vpns", "vrf", "ce-router", "p-router"],
  },
  {
    id: "ce-router",
    term: "CE Router",
    definition:
      "Customer Edge Router - A customer-owned router that connects to the service provider network, typically unaware of VPN operations.",
    category: "network",
    relatedTerms: ["pe-router", "bgp-mpls-vpns", "customer-site"],
  },
  {
    id: "p-router",
    term: "P Router",
    definition:
      "Provider Core Router - An MPLS router in the service provider core that forwards traffic based on labels without VPN awareness.",
    category: "network",
    relatedTerms: ["mpls", "pe-router", "label-switching"],
  },
  {
    id: "label-switching",
    term: "Label Switching",
    definition:
      "A forwarding mechanism where packets are forwarded based on labels rather than IP addresses, enabling faster processing and traffic engineering.",
    category: "network",
    relatedTerms: ["mpls", "label", "p-router"],
  },
  {
    id: "traffic-engineering",
    term: "Traffic Engineering",
    definition:
      "The process of controlling how traffic flows through a network to optimize performance, utilization, and avoid congestion.",
    category: "network",
    relatedTerms: ["mpls", "qos", "bandwidth"],
  },

  // ATM Terms
  {
    id: "atm",
    term: "ATM",
    definition:
      "Asynchronous Transfer Mode - A cell-switching technology that uses fixed 53-byte cells to provide guaranteed quality of service for voice, video, and data.",
    category: "network",
    relatedTerms: ["cell", "vcc", "aal5", "qos"],
  },
  {
    id: "cell",
    term: "Cell",
    definition:
      "A fixed-size 53-byte data unit used in ATM networks, consisting of a 5-byte header and 48-byte payload, enabling predictable switching performance.",
    category: "network",
    relatedTerms: ["atm", "header", "payload"],
  },
  {
    id: "vcc",
    term: "VCC",
    definition:
      "Virtual Channel Connection - A connection-oriented path through an ATM network identified by VPI/VCI values, providing dedicated bandwidth and QoS.",
    category: "network",
    relatedTerms: ["atm", "vpi-vci", "virtual-circuit", "qos"],
  },
  {
    id: "vpi-vci",
    term: "VPI/VCI",
    definition:
      "Virtual Path Identifier/Virtual Channel Identifier - Address fields in ATM cell headers that identify the virtual circuit path.",
    category: "network",
    relatedTerms: ["atm", "vcc", "virtual-circuit"],
  },
  {
    id: "aal5",
    term: "AAL5",
    definition:
      "ATM Adaptation Layer 5 - The most common AAL for data services, segmenting variable-length packets into 48-byte ATM cell payloads.",
    category: "protocol",
    relatedTerms: ["atm", "segmentation", "reassembly"],
  },
  {
    id: "llc-snap",
    term: "LLC/SNAP",
    definition:
      "Logical Link Control/SubNetwork Access Protocol - An 8-byte header used in RFC 2684 to identify protocols when multiple protocols share an ATM VCC.",
    category: "protocol",
    relatedTerms: ["atm", "rfc2684", "encapsulation", "multiprotocol"],
  },
  {
    id: "vc-multiplexing",
    term: "VC Multiplexing",
    definition:
      "A method in RFC 2684 where an entire ATM virtual circuit is dedicated to a single protocol, eliminating the need for protocol identification headers.",
    category: "protocol",
    relatedTerms: ["atm", "rfc2684", "llc-snap", "efficiency"],
  },
  {
    id: "rfc2684",
    term: "RFC 2684",
    definition:
      "Multiprotocol Encapsulation over ATM - The specification that enables IP and other protocols to run efficiently over ATM networks.",
    category: "protocol",
    relatedTerms: ["atm", "multiprotocol", "encapsulation", "llc-snap"],
  },
  {
    id: "qos",
    term: "QoS",
    definition:
      "Quality of Service - Network mechanisms that provide different priority levels and performance guarantees for different types of traffic.",
    category: "network",
    relatedTerms: ["atm", "traffic-engineering", "bandwidth", "priority"],
  },
  {
    id: "virtual-circuit",
    term: "Virtual Circuit",
    definition:
      "A connection-oriented communication path that appears as a dedicated circuit but shares physical network resources with other connections.",
    category: "network",
    relatedTerms: ["atm", "vcc", "connection-oriented"],
  },
  {
    id: "segmentation",
    term: "Segmentation",
    definition:
      "The process of breaking large data units into smaller pieces that fit within the maximum transmission unit of the underlying network.",
    category: "protocol",
    relatedTerms: ["aal5", "atm", "reassembly", "mtu"],
  },
  {
    id: "reassembly",
    term: "Reassembly",
    definition:
      "The process of reconstructing original data from smaller segments that were transmitted separately across a network.",
    category: "protocol",
    relatedTerms: ["segmentation", "aal5", "atm"],
  },
  {
    id: "multiprotocol",
    term: "Multiprotocol",
    definition:
      "The ability to carry multiple different protocols (IP, IPX, AppleTalk, etc.) over the same network infrastructure.",
    category: "protocol",
    relatedTerms: ["rfc2684", "llc-snap", "encapsulation"],
  },
  {
    id: "encapsulation",
    term: "Encapsulation",
    definition:
      "The process of wrapping data from one protocol inside the data format of another protocol, enabling protocol interoperability.",
    category: "protocol",
    relatedTerms: ["rfc2684", "llc-snap", "multiprotocol", "tunnel"],
  },
  {
    id: "connection-oriented",
    term: "Connection-Oriented",
    definition:
      "A communication method that establishes a dedicated path between endpoints before data transmission, providing reliability and ordered delivery.",
    category: "network",
    relatedTerms: ["virtual-circuit", "atm", "tcp"],
  },
  {
    id: "bandwidth",
    term: "Bandwidth",
    definition:
      "The maximum rate of data transfer across a network connection, typically measured in bits per second (bps).",
    category: "network",
    relatedTerms: ["qos", "traffic-engineering", "capacity"],
  },
  {
    id: "autonomous-system",
    term: "Autonomous System",
    definition:
      "A collection of IP networks and routers under the control of a single administrative entity that presents a common routing policy to the internet.",
    category: "network",
    relatedTerms: ["bgp", "routing", "service-provider"],
  },
  {
    id: "service-provider",
    term: "Service Provider",
    definition:
      "An organization that provides networking services to customers, such as internet access, VPN services, or voice communications.",
    category: "general",
    relatedTerms: ["bgp-mpls-vpns", "autonomous-system", "pe-router"],
  },
];

// Create a lookup map for faster access
export const glossaryMap = new Map(
  glossaryTerms.map((term) => [term.id, term]),
);

// Helper function to find terms by keyword
export function findGlossaryTerm(keyword: string): GlossaryTerm | undefined {
  const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, "");

  // First try exact match on term
  const exactMatch = glossaryTerms.find(
    (term) =>
      term.term.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedKeyword,
  );

  if (exactMatch) return exactMatch;

  // Try ID match
  return glossaryMap.get(normalizedKeyword);
}

// Helper function to get terms by category
export function getTermsByCategory(
  category: GlossaryTerm["category"],
): GlossaryTerm[] {
  return glossaryTerms.filter((term) => term.category === category);
}
