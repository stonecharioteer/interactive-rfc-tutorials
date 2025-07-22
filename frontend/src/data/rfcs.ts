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
];
