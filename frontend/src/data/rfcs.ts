export interface RfcMetadata {
  number: number;
  title: string;
  description: string;
  era: "foundation" | "protocol-expansion" | "web-era" | "modern" | "current";
  year: number;
  learningObjectives: string[];
  rfcUrl?: string;
}

export const rfcEras = {
  foundation: {
    name: "Foundation Era",
    period: "1969-1982",
    description: "The birth of the internet and core protocols",
    color: "bg-blue-500",
  },
  "protocol-expansion": {
    name: "Protocol Expansion",
    period: "1983-1990",
    description: "Building the internet infrastructure",
    color: "bg-green-500",
  },
  "web-era": {
    name: "Web Era",
    period: "1990s-2000s",
    description: "The World Wide Web revolution",
    color: "bg-purple-500",
  },
  modern: {
    name: "Modern Networking",
    period: "2000s-2010s",
    description: "Security and performance improvements",
    color: "bg-amber-500",
  },
  current: {
    name: "Current Standards",
    period: "2020s",
    description: "Latest developments and standards",
    color: "bg-red-500",
  },
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
    rfcUrl: "https://www.rfc-editor.org/rfc/rfc2460.html",
  },
];
