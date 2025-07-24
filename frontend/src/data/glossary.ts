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

  // Modern Cryptography Terms (RFC 7748 & RFC 8439)
  {
    id: "curve25519",
    term: "Curve25519",
    definition:
      "A high-performance elliptic curve defined in RFC 7748, offering ~128-bit security with excellent software performance and resistance to implementation attacks.",
    category: "security",
    relatedTerms: ["x25519", "elliptic-curve", "wireguard", "key-exchange"],
  },
  {
    id: "x25519",
    term: "X25519",
    definition:
      "The Diffie-Hellman key agreement function built on Curve25519, used for establishing shared secrets between parties without transmitting the secret itself.",
    category: "security",
    relatedTerms: ["curve25519", "key-exchange", "diffie-hellman", "wireguard"],
  },
  {
    id: "chacha20",
    term: "ChaCha20",
    definition:
      "A stream cipher designed by Daniel J. Bernstein, optimized for software implementation and providing high performance without hardware acceleration.",
    category: "security",
    relatedTerms: ["chacha20-poly1305", "stream-cipher", "poly1305", "wireguard"],
  },
  {
    id: "poly1305",
    term: "Poly1305",
    definition:
      "A message authentication code (MAC) that uses polynomial evaluation in a large prime field, providing information-theoretic security with one-time keys.",
    category: "security",
    relatedTerms: ["chacha20-poly1305", "mac", "authentication", "chacha20"],
  },
  {
    id: "chacha20-poly1305",
    term: "ChaCha20-Poly1305",
    definition:
      "An Authenticated Encryption with Associated Data (AEAD) algorithm combining ChaCha20 stream cipher with Poly1305 authenticator, used as WireGuard's encryption.",
    category: "security",
    relatedTerms: ["aead", "chacha20", "poly1305", "wireguard", "authenticated-encryption"],
  },
  {
    id: "aead",
    term: "AEAD",
    definition:
      "Authenticated Encryption with Associated Data - A cryptographic mode that provides both confidentiality and authenticity in a single operation.",
    category: "security",
    relatedTerms: ["chacha20-poly1305", "authenticated-encryption", "confidentiality", "authenticity"],
  },
  {
    id: "elliptic-curve",
    term: "Elliptic Curve",
    definition:
      "A mathematical structure used in cryptography that provides equivalent security to RSA with much smaller key sizes, enabling faster operations.",
    category: "security",
    relatedTerms: ["curve25519", "ecc", "public-key-crypto", "x25519"],
  },
  {
    id: "montgomery-ladder",
    term: "Montgomery Ladder",
    definition:
      "An algorithm for scalar multiplication on elliptic curves that runs in constant time, preventing timing attacks and used in X25519.",
    category: "security",
    relatedTerms: ["curve25519", "x25519", "constant-time", "timing-attack-resistance"],
  },
  {
    id: "stream-cipher",
    term: "Stream Cipher",
    definition:
      "A symmetric encryption algorithm that generates a keystream to encrypt plaintext one bit or byte at a time, as opposed to block ciphers.",
    category: "security",
    relatedTerms: ["chacha20", "keystream", "symmetric-encryption", "block-cipher"],
  },
  {
    id: "keystream",
    term: "Keystream",
    definition:
      "A sequence of pseudorandom bits generated by a stream cipher, which is XORed with plaintext to produce ciphertext.",
    category: "security",
    relatedTerms: ["stream-cipher", "chacha20", "xor", "pseudorandom"],
  },
  {
    id: "quarter-round",
    term: "Quarter-Round",
    definition:
      "The core operation in ChaCha20 that mixes four 32-bit words using addition, rotation, and XOR operations to provide cryptographic diffusion.",
    category: "security",
    relatedTerms: ["chacha20", "cryptographic-primitive", "diffusion"],
  },
  {
    id: "mac",
    term: "MAC",
    definition:
      "Message Authentication Code - A cryptographic checksum that verifies data integrity and authenticity using a shared secret key.",
    category: "security",
    relatedTerms: ["poly1305", "authentication", "integrity", "hmac"],
  },
  {
    id: "nonce",
    term: "Nonce",
    definition:
      "A 'number used once' - a unique value used in cryptographic operations to ensure that identical plaintexts encrypt to different ciphertexts.",
    category: "security",
    relatedTerms: ["chacha20-poly1305", "replay-attack", "unique", "iv"],
  },
  {
    id: "key-exchange",
    term: "Key Exchange",
    definition:
      "A cryptographic protocol that allows two parties to establish a shared secret over an insecure channel, often using Diffie-Hellman methods.",
    category: "security",
    relatedTerms: ["x25519", "diffie-hellman", "shared-secret", "public-key-crypto"],
  },
  {
    id: "diffie-hellman",
    term: "Diffie-Hellman",
    definition:
      "A key exchange protocol that allows two parties to generate a shared secret without directly transmitting it, forming the basis of X25519.",
    category: "security",
    relatedTerms: ["x25519", "key-exchange", "shared-secret", "public-key-crypto"],
  },
  {
    id: "shared-secret",
    term: "Shared Secret",
    definition:
      "A secret key known to both parties in a communication, typically established through key exchange protocols like X25519.",
    category: "security",
    relatedTerms: ["key-exchange", "x25519", "symmetric-key", "session-key"],
  },
  {
    id: "authenticated-encryption",
    term: "Authenticated Encryption",
    definition:
      "Cryptographic schemes that provide both confidentiality (encryption) and authenticity (authentication) guarantees in a single operation.",
    category: "security",
    relatedTerms: ["aead", "chacha20-poly1305", "confidentiality", "authenticity"],
  },
  {
    id: "constant-time",
    term: "Constant-Time",
    definition:
      "Cryptographic operations that take the same amount of time regardless of the input values, preventing timing-based side-channel attacks.",
    category: "security",
    relatedTerms: ["timing-attack-resistance", "side-channel", "curve25519", "chacha20"],
  },
  {
    id: "timing-attack-resistance",
    term: "Timing Attack Resistance",
    definition:
      "The property of cryptographic implementations that prevents attackers from learning secret information by measuring execution times.",
    category: "security",
    relatedTerms: ["constant-time", "side-channel", "implementation-security"],
  },
  {
    id: "side-channel",
    term: "Side-Channel Attack",
    definition:
      "Cryptographic attacks that exploit information leaked through physical implementation characteristics like timing, power consumption, or electromagnetic emissions.",
    category: "security",
    relatedTerms: ["timing-attack-resistance", "constant-time", "implementation-security"],
  },
  {
    id: "perfect-forward-secrecy",
    term: "Perfect Forward Secrecy",
    definition:
      "A security property ensuring that compromise of long-term keys does not compromise past session keys, typically achieved through ephemeral key exchange.",
    category: "security",
    relatedTerms: ["key-exchange", "session-key", "ephemeral-key", "wireguard"],
  },
  {
    id: "session-key",
    term: "Session Key",
    definition:
      "A temporary symmetric key used to encrypt communication during a single session, derived from key exchange and providing forward secrecy.",
    category: "security",
    relatedTerms: ["shared-secret", "perfect-forward-secrecy", "symmetric-key", "key-derivation"],
  },
  {
    id: "key-derivation",
    term: "Key Derivation",
    definition:
      "The process of generating cryptographic keys from a master secret or password using functions like HKDF to create session-specific keys.",
    category: "security",
    relatedTerms: ["session-key", "hkdf", "shared-secret", "key-management"],
  },
  {
    id: "hkdf",
    term: "HKDF",
    definition:
      "HMAC-based Key Derivation Function - A standardized method for deriving multiple keys from a single master secret, used in modern protocols.",
    category: "security",
    relatedTerms: ["key-derivation", "hmac", "session-key", "key-management"],
  },
  {
    id: "wireguard",
    term: "WireGuard",
    definition:
      "A modern VPN protocol that uses Curve25519 for key exchange and ChaCha20-Poly1305 for encryption, designed for simplicity and performance.",
    category: "protocol",
    relatedTerms: ["curve25519", "chacha20-poly1305", "x25519", "vpn", "noise-protocol"],
  },
  {
    id: "noise-protocol",
    term: "Noise Protocol Framework",
    definition:
      "A framework for building cryptographic protocols that provides patterns for key agreement, used as the foundation for WireGuard's handshake.",
    category: "security",
    relatedTerms: ["wireguard", "key-exchange", "handshake", "cryptographic-protocol"],
  },
  {
    id: "cryptographic-primitive",
    term: "Cryptographic Primitive",
    definition:
      "Basic cryptographic building blocks (like hash functions, ciphers, or signature schemes) that are combined to create larger cryptographic systems.",
    category: "security",
    relatedTerms: ["chacha20", "poly1305", "hash-function", "cipher"],
  },
  {
    id: "implementation-security",
    term: "Implementation Security",
    definition:
      "Security properties that depend on how cryptographic algorithms are implemented in software or hardware, including resistance to side-channel attacks.",
    category: "security",
    relatedTerms: ["constant-time", "side-channel", "timing-attack-resistance"],
  },
  
  // IPsec and VPN Security Terms (RFC 4301 & RFC 4303)
  {
    id: "ipsec",
    term: "IPsec",
    definition:
      "Internet Protocol Security - A suite of protocols providing authentication, integrity, and confidentiality at the network layer, fundamental to modern VPN technologies.",
    category: "security",
    relatedTerms: ["esp", "ah", "vpn", "sa", "spd", "tunnel-mode", "transport-mode"],
  },
  {
    id: "esp",
    term: "ESP",
    definition:
      "Encapsulating Security Payload - The IPsec protocol providing confidentiality through encryption, plus optional authentication and anti-replay protection.",
    category: "security",
    relatedTerms: ["ipsec", "ah", "encryption", "authentication", "anti-replay", "spi"],
  },
  {
    id: "ah",
    term: "AH",
    definition:
      "Authentication Header - An IPsec protocol providing data origin authentication, integrity, and anti-replay protection without confidentiality.",
    category: "security",
    relatedTerms: ["ipsec", "esp", "authentication", "integrity", "anti-replay"],
  },
  {
    id: "sa",
    term: "Security Association (SA)",
    definition:
      "A unidirectional relationship between communicating parties that defines the security parameters for IPsec communication, identified by SPI, destination IP, and protocol.",
    category: "security",
    relatedTerms: ["ipsec", "spi", "sad", "esp", "ah", "security-parameters"],
  },
  {
    id: "spd",
    term: "Security Policy Database (SPD)",
    definition:
      "IPsec database containing policies that determine packet processing decisions: DISCARD, BYPASS, or PROTECT with specific security services.",
    category: "security",
    relatedTerms: ["ipsec", "security-policy", "selector", "sa", "packet-processing"],
  },
  {
    id: "sad",
    term: "Security Association Database (SAD)",
    definition:
      "IPsec database containing parameters for active security associations including cryptographic keys, algorithms, and lifetime information.",
    category: "security",
    relatedTerms: ["sa", "ipsec", "security-parameters", "cryptographic-keys", "spi"],
  },
  {
    id: "spi",
    term: "Security Parameter Index (SPI)",
    definition:
      "A 32-bit identifier in IPsec packets that, combined with destination IP and protocol, uniquely identifies a Security Association.",
    category: "security",
    relatedTerms: ["sa", "ipsec", "esp", "ah", "packet-identification"],
  },
  {
    id: "tunnel-mode",
    term: "Tunnel Mode",
    definition:
      "IPsec mode that encapsulates the entire original packet within a new IP packet, providing traffic flow confidentiality and commonly used for VPNs.",
    category: "security",
    relatedTerms: ["ipsec", "transport-mode", "vpn", "encapsulation", "traffic-flow-confidentiality"],
  },
  {
    id: "transport-mode",
    term: "Transport Mode",
    definition:
      "IPsec mode that protects the payload while preserving the original IP header, used for end-to-end communication between hosts.",
    category: "security",
    relatedTerms: ["ipsec", "tunnel-mode", "end-to-end", "payload-protection"],
  },
  {
    id: "anti-replay",
    term: "Anti-Replay Protection",
    definition:
      "Security mechanism using sequence numbers and sliding windows to detect and prevent replay attacks where captured packets are retransmitted.",
    category: "security",
    relatedTerms: ["esp", "sequence-number", "sliding-window", "replay-attack", "packet-security"],
  },
  {
    id: "sequence-number",
    term: "Sequence Number",
    definition:
      "A monotonically increasing counter in ESP packets used for anti-replay protection, ensuring each packet can be identified and duplicates detected.",
    category: "security",
    relatedTerms: ["esp", "anti-replay", "packet-ordering", "replay-protection"],
  },
  {
    id: "selector",
    term: "IPsec Selector",
    definition:
      "Traffic classification criteria in security policies including source/destination addresses, ports, protocol numbers, and DSCP values for packet matching.",
    category: "security",
    relatedTerms: ["spd", "security-policy", "traffic-classification", "packet-matching"],
  },
  {
    id: "security-policy",
    term: "Security Policy",
    definition:
      "IPsec rules defining how traffic should be processed, specifying selectors for traffic matching and actions (DISCARD, BYPASS, or PROTECT).",
    category: "security",
    relatedTerms: ["spd", "selector", "ipsec", "traffic-processing", "security-action"],
  },
  {
    id: "vpn",
    term: "VPN",
    definition:
      "Virtual Private Network - A secure network connection over public infrastructure, typically implemented using IPsec tunnel mode for site-to-site connectivity.",
    category: "security",
    relatedTerms: ["ipsec", "tunnel-mode", "secure-tunnel", "remote-access", "site-to-site"],
  },
  {
    id: "ike",
    term: "IKE",
    definition:
      "Internet Key Exchange - A protocol for establishing and managing IPsec Security Associations, handling authentication and key negotiation automatically.",
    category: "security",
    relatedTerms: ["ipsec", "sa", "key-management", "authentication", "key-negotiation"],
  },
  {
    id: "encryption",
    term: "Encryption",
    definition:
      "The process of converting plaintext data into ciphertext using cryptographic algorithms and keys to provide confidentiality protection.",
    category: "security",
    relatedTerms: ["esp", "confidentiality", "aes", "cipher", "cryptographic-algorithm"],
  },
  {
    id: "authentication",
    term: "Authentication",
    definition:
      "Cryptographic verification of data origin and integrity, ensuring data comes from the claimed source and hasn't been tampered with.",
    category: "security",
    relatedTerms: ["esp", "ah", "integrity", "hmac", "data-origin"],
  },
  {
    id: "integrity",
    term: "Data Integrity",
    definition:
      "Assurance that data has not been altered or corrupted during transmission or storage, typically verified using cryptographic hash functions.",
    category: "security",
    relatedTerms: ["authentication", "esp", "ah", "hash-function", "tampering-detection"],
  },
  {
    id: "confidentiality",
    term: "Confidentiality",
    definition:
      "Protection of information from unauthorized disclosure, achieved through encryption to ensure only authorized parties can access the data.",
    category: "security",
    relatedTerms: ["encryption", "esp", "privacy", "data-protection", "unauthorized-access"],
  },
  {
    id: "replay-attack",
    term: "Replay Attack",
    definition:
      "A network attack where captured packets are retransmitted to trick the receiver, prevented by anti-replay mechanisms using sequence numbers.",
    category: "security",
    relatedTerms: ["anti-replay", "sequence-number", "packet-capture", "network-attack"],
  },
  {
    id: "sliding-window",
    term: "Sliding Window",
    definition:
      "Anti-replay mechanism maintaining a window of acceptable sequence numbers, rejecting packets outside the window or previously received.",
    category: "security",
    relatedTerms: ["anti-replay", "sequence-number", "esp", "window-size", "packet-acceptance"],
  },
  {
    id: "encapsulation",
    term: "Encapsulation",
    definition:
      "The process of wrapping data with protocol headers and trailers, such as ESP encapsulation adding security headers to protect the original packet.",
    category: "network",
    relatedTerms: ["esp", "tunnel-mode", "packet-wrapping", "protocol-headers"],
  },
  {
    id: "esp-header",
    term: "ESP Header",
    definition:
      "The IPsec ESP packet header containing Security Parameter Index (SPI) and sequence number, followed by the Initialization Vector for encryption.",
    category: "security",
    relatedTerms: ["esp", "spi", "sequence-number", "iv", "packet-structure"],
  },
  {
    id: "esp-trailer",
    term: "ESP Trailer",
    definition:
      "The end portion of ESP packets containing padding, pad length, next header field, and optional Integrity Check Value for authentication.",
    category: "security",
    relatedTerms: ["esp", "padding", "next-header", "icv", "packet-structure"],
  },
  {
    id: "iv",
    term: "Initialization Vector (IV)",
    definition:
      "A random or pseudo-random value used with encryption algorithms to ensure identical plaintexts encrypt to different ciphertexts.",
    category: "security",
    relatedTerms: ["encryption", "esp", "aes-cbc", "randomness", "cryptographic-security"],
  },
  {
    id: "icv",
    term: "Integrity Check Value (ICV)",
    definition:
      "The authentication data appended to ESP packets containing HMAC or other authentication codes to verify data integrity and origin.",
    category: "security",
    relatedTerms: ["esp", "authentication", "hmac", "integrity", "auth-tag"],
  },
  {
    id: "padding",
    term: "ESP Padding",
    definition:
      "Extra bytes added to ESP packets to align data to cipher block boundaries and conceal the actual payload length for block ciphers.",
    category: "security",
    relatedTerms: ["esp", "block-cipher", "aes-cbc", "alignment", "traffic-analysis"],
  },
  {
    id: "next-header",
    term: "Next Header",
    definition:
      "Field in IPsec packets identifying the protocol of the protected data (e.g., TCP=6, UDP=17), indicating what follows the IPsec processing.",
    category: "protocol",
    relatedTerms: ["esp", "ah", "protocol-identification", "packet-processing"],
  },
  {
    id: "site-to-site",
    term: "Site-to-Site VPN",
    definition:
      "VPN connection between two network locations (like offices) using IPsec tunnel mode to create a secure bridge over the internet.",
    category: "security",
    relatedTerms: ["vpn", "tunnel-mode", "ipsec", "enterprise-connectivity", "network-bridge"],
  },
  {
    id: "remote-access",
    term: "Remote Access VPN",
    definition:
      "VPN allowing individual users to securely connect to a corporate network from remote locations, typically using IPsec or SSL/TLS.",
    category: "security",
    relatedTerms: ["vpn", "ipsec", "ssl-vpn", "mobile-access", "corporate-network"],
  },
  {
    id: "traffic-flow-confidentiality",
    term: "Traffic Flow Confidentiality",
    definition:
      "Security service that conceals traffic patterns and communication relationships by hiding source/destination information in tunnel mode.",
    category: "security",
    relatedTerms: ["tunnel-mode", "ipsec", "traffic-analysis", "communication-privacy"],
  },
  
  // TURN Relay Protocol Terms (RFC 8656)
  {
    id: "turn-allocation",
    term: "TURN Allocation",
    definition:
      "A relay address and port on a TURN server allocated to a client, providing a public endpoint for receiving data from peers when direct connections fail.",
    category: "network",
    relatedTerms: ["turn", "relay-address", "nat-traversal", "allocation-request", "fallback"],
  },
  {
    id: "turn-permission",
    term: "TURN Permission",
    definition:
      "Authorization mechanism in TURN that specifies which peer IP addresses are allowed to send data to the client's relay allocation, preventing unauthorized usage.",
    category: "security",
    relatedTerms: ["turn", "turn-allocation", "peer-authorization", "access-control", "relay-security"],
  },
  {
    id: "turn-channel",
    term: "TURN Channel",
    definition:
      "An optimized TURN data transmission method using 4-byte headers instead of full STUN encapsulation, reducing overhead for high-volume communications.",
    category: "network",
    relatedTerms: ["turn", "channel-data", "send-indication", "data-indication", "optimization"],
  },
  {
    id: "send-indication",
    term: "Send Indication",
    definition:
      "TURN message type used by clients to send data to peers through the relay server, containing the peer address and the data to be forwarded.",
    category: "protocol",
    relatedTerms: ["turn", "data-indication", "turn-channel", "relay-data", "peer-communication"],
  },
  {
    id: "data-indication",
    term: "Data Indication",
    definition:
      "TURN message type used by the server to forward peer data to clients, containing the peer source address and the received data.",
    category: "protocol",
    relatedTerms: ["turn", "send-indication", "turn-channel", "relay-data", "peer-communication"],
  },
  {
    id: "channel-data",
    term: "Channel Data",
    definition:
      "Compact TURN data transmission format using channel numbers instead of full STUN headers, providing 90% reduction in packet overhead.",
    category: "protocol",
    relatedTerms: ["turn-channel", "turn", "channel-bind", "optimization", "header-reduction"],
  },
  {
    id: "allocation-request",
    term: "Allocation Request",
    definition:
      "TURN message requesting the server to create a new relay allocation, specifying transport protocols and lifetime preferences.",
    category: "protocol",
    relatedTerms: ["turn-allocation", "turn", "relay-address", "allocation-response"],
  },
  {
    id: "allocation-response",
    term: "Allocation Response",
    definition:
      "TURN server response containing the allocated relay address and transport information, or an error if allocation failed.",
    category: "protocol",
    relatedTerms: ["allocation-request", "turn-allocation", "relay-address", "turn"],
  },
  {
    id: "channel-bind",
    term: "Channel Bind",
    definition:
      "TURN operation that associates a channel number with a peer address, enabling the use of compact Channel Data messages for that peer.",
    category: "protocol",
    relatedTerms: ["turn-channel", "channel-data", "turn", "peer-binding"],
  },
  {
    id: "refresh-request",
    term: "Refresh Request",
    definition:
      "TURN message used to extend the lifetime of an existing allocation, preventing it from expiring during active communications.",
    category: "protocol",
    relatedTerms: ["turn-allocation", "turn", "allocation-lifetime", "keep-alive"],
  },
  {
    id: "relay-address",
    term: "Relay Address",
    definition:
      "The public IP address and port allocated by a TURN server for a client, serving as the destination address for peers to reach the client.",
    category: "network",
    relatedTerms: ["turn-allocation", "turn", "public-address", "nat-traversal"],
  },
  {
    id: "relay",
    term: "Relay",
    definition:
      "Intermediate server that forwards data between endpoints when direct communication is not possible, used as fallback in NAT traversal.",
    category: "network",
    relatedTerms: ["turn", "relay-address", "fallback", "nat-traversal", "indirect-connection"],
  },
  {
    id: "allocation-lifetime",
    term: "Allocation Lifetime",
    definition:
      "The duration for which a TURN allocation remains active, after which it expires unless refreshed by the client.",
    category: "network",
    relatedTerms: ["turn-allocation", "refresh-request", "turn", "resource-management"],
  },
  {
    id: "turn-server",
    term: "TURN Server",
    definition:
      "A network server implementing the TURN protocol to provide relay services for clients behind restrictive NATs or firewalls.",
    category: "network",
    relatedTerms: ["turn", "relay", "nat-traversal", "stun-server", "relay-service"],
  },
  {
    id: "fallback",
    term: "Fallback Connection",
    definition:
      "Alternative communication method used when the preferred direct connection fails, such as TURN relay when P2P connectivity cannot be established.",
    category: "network",
    relatedTerms: ["turn", "relay", "ice", "connectivity-fallback", "backup-path"],
  },
  {
    id: "peer-authorization",
    term: "Peer Authorization",
    definition:
      "TURN security mechanism requiring explicit permission for each peer IP address before it can send data to the client's relay allocation.",
    category: "security",
    relatedTerms: ["turn-permission", "turn", "access-control", "relay-security"],
  },
  {
    id: "relay-security",
    term: "Relay Security",
    definition:
      "Security mechanisms in TURN including authentication, rate limiting, and peer permissions to prevent abuse and unauthorized relay usage.",
    category: "security",
    relatedTerms: ["turn", "turn-permission", "authentication", "rate-limiting", "abuse-prevention"],
  },
  {
    id: "bandwidth-throttling",
    term: "Bandwidth Throttling",
    definition:
      "Rate limiting mechanism in TURN servers to prevent abuse and manage resource consumption by limiting data transfer rates per allocation.",
    category: "network",
    relatedTerms: ["turn", "rate-limiting", "resource-management", "abuse-prevention"],
  },
  {
    id: "relay-candidate",
    term: "Relay Candidate",
    definition:
      "An ICE candidate obtained through a TURN server that provides a relay address for cases where direct connectivity cannot be established.",
    category: "network",
    relatedTerms: ["ice-candidate", "turn", "relay", "fallback", "symmetric-nat"],
  },
  
  // NAT Traversal Terms (RFC 5389 & RFC 8445)
  {
    id: "nat",
    term: "NAT (Network Address Translation)",
    definition:
      "A networking technique that allows multiple devices on a private network to share a single public IP address by translating private addresses to public ones.",
    category: "network",
    relatedTerms: ["stun", "ice", "nat-traversal", "private-ip", "public-ip"],
  },
  {
    id: "stun",
    term: "STUN",
    definition:
      "Session Traversal Utilities for NAT (RFC 5389) - A protocol that allows applications to discover their public IP address and the type of NAT they are behind.",
    category: "protocol",
    relatedTerms: ["nat", "ice", "turn", "nat-traversal", "binding-request"],
  },
  {
    id: "ice",
    term: "ICE",
    definition:
      "Interactive Connectivity Establishment (RFC 8445) - A comprehensive framework for NAT traversal that combines STUN, TURN, and host discovery to establish peer-to-peer connections.",
    category: "protocol",
    relatedTerms: ["stun", "turn", "nat-traversal", "candidate", "connectivity-check"],
  },
  {
    id: "turn",
    term: "TURN",
    definition:
      "Traversal Using Relays around NAT - A protocol that provides relay functionality when direct peer-to-peer connections cannot be established due to restrictive NATs or firewalls.",
    category: "protocol",
    relatedTerms: ["stun", "ice", "nat-traversal", "relay", "symmetric-nat"],
  },
  {
    id: "nat-traversal",
    term: "NAT Traversal",
    definition:
      "Techniques and protocols that enable applications to establish connections through Network Address Translation devices, essential for peer-to-peer communications.",
    category: "network",
    relatedTerms: ["nat", "stun", "ice", "turn", "udp-hole-punching"],
  },
  {
    id: "udp-hole-punching",
    term: "UDP Hole Punching",
    definition:
      "A NAT traversal technique where both peers simultaneously send packets to each other's public addresses, creating temporary openings (holes) in NAT devices.",
    category: "network",
    relatedTerms: ["nat-traversal", "stun", "ice", "peer-to-peer", "nat-binding"],
  },
  {
    id: "ice-candidate",
    term: "ICE Candidate",
    definition:
      "A transport address (IP and port combination) that an ICE agent can use to communicate, including host, server reflexive, peer reflexive, and relay candidates.",
    category: "network",
    relatedTerms: ["ice", "host-candidate", "srflx-candidate", "relay-candidate", "candidate-pair"],
  },
  {
    id: "host-candidate",
    term: "Host Candidate",
    definition:
      "An ICE candidate obtained directly from a local network interface, representing the device's actual IP address on its local network.",
    category: "network",
    relatedTerms: ["ice-candidate", "local-interface", "private-ip", "direct-connection"],
  },
  {
    id: "srflx-candidate",
    term: "Server Reflexive Candidate",
    definition:
      "An ICE candidate discovered through STUN that represents the public IP address and port as seen by a STUN server, used for NAT traversal.",
    category: "network",
    relatedTerms: ["ice-candidate", "stun", "public-ip", "nat-binding", "reflexive-address"],
  },
  {
    id: "relay-candidate",
    term: "Relay Candidate",
    definition:
      "An ICE candidate obtained through a TURN server that provides a relay address for cases where direct connectivity cannot be established.",
    category: "network",
    relatedTerms: ["ice-candidate", "turn", "relay", "fallback", "symmetric-nat"],
  },
  {
    id: "candidate-pair",
    term: "Candidate Pair",
    definition:
      "A combination of local and remote ICE candidates that represents a potential communication path between two peers in the ICE connectivity establishment process.",
    category: "network",
    relatedTerms: ["ice-candidate", "connectivity-check", "ice", "pair-priority", "nominated-pair"],
  },
  {
    id: "connectivity-check",
    term: "Connectivity Check",
    definition:
      "ICE procedure that tests whether a candidate pair can be used for communication by sending STUN Binding Requests between the paired addresses.",
    category: "network",
    relatedTerms: ["candidate-pair", "ice", "stun", "binding-request", "reachability"],
  },
  {
    id: "binding-request",
    term: "STUN Binding Request",
    definition:
      "A STUN message sent to discover the reflexive transport address (public IP and port) as seen by the STUN server, fundamental to NAT discovery.",
    category: "protocol",
    relatedTerms: ["stun", "binding-response", "reflexive-address", "nat-discovery", "transaction-id"],
  },
  {
    id: "binding-response",
    term: "STUN Binding Response",
    definition:
      "A STUN message containing the XOR-MAPPED-ADDRESS attribute that reveals the sender's public IP address and port as observed by the STUN server.",
    category: "protocol",
    relatedTerms: ["binding-request", "stun", "xor-mapped-address", "reflexive-address"],
  },
  {
    id: "xor-mapped-address",
    term: "XOR-MAPPED-ADDRESS",
    definition:
      "A STUN attribute that contains the reflexive transport address with values XORed with the STUN magic cookie to provide some protection against tampering.",
    category: "protocol",
    relatedTerms: ["binding-response", "stun", "reflexive-address", "magic-cookie"],
  },
  {
    id: "reflexive-address",
    term: "Reflexive Address",
    definition:
      "The public IP address and port of a host as observed by a STUN server, representing how the host appears to external networks through its NAT.",
    category: "network",
    relatedTerms: ["stun", "nat", "public-ip", "xor-mapped-address", "nat-binding"],
  },
  {
    id: "nat-binding",
    term: "NAT Binding",
    definition:
      "A mapping created by a NAT device that associates an internal private address with an external public address and port for communication.",
    category: "network",
    relatedTerms: ["nat", "port-mapping", "public-ip", "private-ip", "nat-type"],
  },
  {
    id: "nat-type",
    term: "NAT Type",
    definition:
      "Classification of NAT behavior affecting traversal difficulty, including full cone, restricted cone, port restricted cone, and symmetric NAT types.",
    category: "network",
    relatedTerms: ["nat", "full-cone", "restricted-cone", "symmetric-nat", "nat-traversal"],
  },
  {
    id: "full-cone",
    term: "Full Cone NAT",
    definition:
      "The most permissive NAT type that allows any external host to send packets to the mapped public port, making P2P connections easiest to establish.",
    category: "network",
    relatedTerms: ["nat-type", "cone-nat", "nat-traversal", "port-mapping"],
  },
  {
    id: "restricted-cone",
    term: "Restricted Cone NAT",
    definition:
      "A NAT type that only allows packets from external hosts that the internal host has previously contacted, requiring coordinated connection attempts.",
    category: "network",
    relatedTerms: ["nat-type", "cone-nat", "udp-hole-punching", "nat-filtering"],
  },
  {
    id: "symmetric-nat",
    term: "Symmetric NAT",
    definition:
      "The most restrictive NAT type that creates different external port mappings for each destination, making direct P2P connections very difficult or impossible.",
    category: "network",
    relatedTerms: ["nat-type", "turn", "relay-candidate", "nat-traversal", "port-mapping"],
  },
  {
    id: "peer-to-peer",
    term: "Peer-to-Peer (P2P)",
    definition:
      "Direct communication between two devices without intermediate servers, enabled by NAT traversal techniques for applications like video calling and file sharing.",
    category: "network",
    relatedTerms: ["direct-connection", "nat-traversal", "ice", "webrtc", "tailscale"],
  },
  {
    id: "webrtc",
    term: "WebRTC",
    definition:
      "Web Real-Time Communication - A browser standard that uses ICE, STUN, and TURN for peer-to-peer audio, video, and data communication without plugins.",
    category: "protocol",
    relatedTerms: ["ice", "stun", "turn", "peer-to-peer", "browser", "rtc"],
  },
  {
    id: "tailscale",
    term: "Tailscale",
    definition:
      "A mesh VPN service that uses ICE and STUN for peer-to-peer connectivity, allowing devices to connect directly when possible while falling back to relays.",
    category: "protocol",
    relatedTerms: ["mesh-vpn", "ice", "stun", "peer-to-peer", "wireguard", "derp"],
  },
  {
    id: "derp",
    term: "DERP",
    definition:
      "Designated Encrypted Relay for Packets - Tailscale's relay system that provides fallback connectivity when direct peer-to-peer connections fail.",
    category: "protocol",
    relatedTerms: ["tailscale", "relay", "turn", "fallback", "mesh-vpn"],
  },
  {
    id: "signaling-server",
    term: "Signaling Server",
    definition:
      "A server that facilitates the exchange of ICE candidates and session descriptions between peers during the connection establishment process.",
    category: "network",
    relatedTerms: ["ice", "candidate-exchange", "sdp", "webrtc", "peer-coordination"],
  },
  {
    id: "candidate-exchange",
    term: "Candidate Exchange",
    definition:
      "The ICE process where peers share their discovered candidates through a signaling channel to enable connectivity testing between all possible paths.",
    category: "network",
    relatedTerms: ["ice-candidate", "signaling-server", "ice", "connectivity-check"],
  },
  {
    id: "nominated-pair",
    term: "Nominated Pair",
    definition:
      "The ICE candidate pair selected as the optimal communication path after connectivity checks, representing the best available connection between peers.",
    category: "network",
    relatedTerms: ["candidate-pair", "connectivity-check", "ice", "optimal-path", "pair-selection"],
  },
  {
    id: "trickle-ice",
    term: "Trickle ICE",
    definition:
      "An ICE optimization that allows candidates to be sent incrementally as they are discovered, rather than waiting for complete gathering before exchange.",
    category: "network",
    relatedTerms: ["ice", "candidate-exchange", "optimization", "webrtc", "incremental-discovery"],
  },
  {
    id: "ice-lite",
    term: "ICE Lite",
    definition:
      "A simplified ICE implementation for servers that only generate host candidates and respond to connectivity checks, reducing complexity for server deployments.",
    category: "protocol",
    relatedTerms: ["ice", "simplified-ice", "server-implementation", "host-candidate"],
  },
  // High-priority networking infrastructure terms
  {
    id: "router",
    term: "Router",
    definition:
      "A network device that forwards packets between different networks using routing tables and protocols. Routers operate at Layer 3 and make path decisions based on IP addresses.",
    category: "network",
    relatedTerms: ["routing", "gateway", "ip", "packet", "layer-3"],
  },
  {
    id: "gateway",
    term: "Gateway",
    definition:
      "A network node that serves as an access point to another network, often translating between different protocols. In home networks, typically refers to the default gateway (router).",
    category: "network",
    relatedTerms: ["router", "default-gateway", "network", "protocol-translation"],
  },
  {
    id: "firewall",
    term: "Firewall",
    definition:
      "A network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules, acting as a barrier between trusted and untrusted networks.",
    category: "security",
    relatedTerms: ["security", "packet-filtering", "access-control", "network-security"],
  },
  {
    id: "proxy",
    term: "Proxy",
    definition:
      "An intermediary server that acts on behalf of clients, forwarding requests to other servers. Proxies can provide caching, security, anonymity, and access control functions.",
    category: "network",
    relatedTerms: ["proxy-server", "intermediary", "cache", "reverse-proxy"],
  },
  {
    id: "cache",
    term: "Cache",
    definition:
      "A temporary storage area that stores frequently accessed data closer to the user to improve performance and reduce network load. Common in web browsers, CDNs, and proxy servers.",
    category: "network",
    relatedTerms: ["caching", "cdn", "proxy", "performance", "temporary-storage"],
  },
  {
    id: "load-balancer",
    term: "Load Balancer",
    definition:
      "A device or software that distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed, improving performance and reliability.",
    category: "network",
    relatedTerms: ["load-balancing", "traffic-distribution", "server-farm", "high-availability"],
  },
  {
    id: "cdn",
    term: "CDN",
    definition:
      "Content Delivery Network - A geographically distributed group of servers that work together to provide fast delivery of internet content by serving users from the nearest location.",
    category: "network",
    relatedTerms: ["content-delivery", "cache", "edge-server", "performance", "distributed-system"],
  },
  {
    id: "latency",
    term: "Latency",
    definition:
      "The time delay between sending a request and receiving a response over a network. Measured in milliseconds, it's a key factor in network performance and user experience.",
    category: "network",
    relatedTerms: ["delay", "rtt", "performance", "network-performance"],
  },
  {
    id: "throughput",
    term: "Throughput",
    definition:
      "The actual amount of data successfully transmitted over a network in a given time period, usually measured in bits per second (bps). Different from bandwidth, which is theoretical capacity.",
    category: "network",
    relatedTerms: ["bandwidth", "data-rate", "performance", "network-capacity"],
  },
  {
    id: "websocket",
    term: "WebSocket",
    definition:
      "A communication protocol that provides full-duplex communication channels over a single TCP connection, enabling real-time data exchange between client and server.",
    category: "web",
    relatedTerms: ["real-time", "full-duplex", "tcp", "web-protocol"],
  },
  {
    id: "cors",
    term: "CORS",
    definition:
      "Cross-Origin Resource Sharing - A mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.",
    category: "web",
    relatedTerms: ["cross-origin", "security", "web-security", "same-origin-policy"],
  },
  {
    id: "jwt",
    term: "JWT",
    definition:
      "JSON Web Token - A compact, URL-safe means of representing claims between two parties. Commonly used for authentication and information exchange in web applications.",
    category: "web",
    relatedTerms: ["authentication", "token", "json", "web-authentication"],
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
