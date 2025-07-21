export interface RfcMetadata {
  number: number;
  title: string;
  description: string;
  era: "foundation" | "protocol-expansion" | "web-era" | "modern" | "current";
  year: number;
  priority: "critical" | "high" | "medium" | "low";
  estimatedTime: string;
  learningObjectives: string[];
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
    priority: "high",
    estimatedTime: "30 minutes",
    learningObjectives: [
      "Understand the historical significance of the first RFC",
      "Learn about the informal collaborative nature of early internet development",
      "Explore the origins of the RFC system",
    ],
  },
  {
    number: 675,
    title: "Internet Transmission Control Program",
    description:
      "The foundational document for what would become TCP/IP, establishing internetworking concepts.",
    era: "foundation",
    year: 1974,
    priority: "high",
    estimatedTime: "45 minutes",
    learningObjectives: [
      "Understand the evolution from NCP to TCP/IP",
      "Learn about Vint Cerf's early internetworking concepts",
      "Explore the foundation of modern internet protocols",
    ],
  },
  {
    number: 791,
    title: "Internet Protocol Version 4 (IPv4)",
    description:
      "The foundational IPv4 specification that powers most of today's internet.",
    era: "foundation",
    year: 1981,
    priority: "critical",
    estimatedTime: "90 minutes",
    learningObjectives: [
      "Understand IPv4 packet structure and addressing",
      "Learn about routing and fragmentation",
      "Explore the protocol that powers most of today's internet",
    ],
  },
  {
    number: 793,
    title: "Transmission Control Protocol (TCP)",
    description:
      "The TCP specification that enables reliable internet communication.",
    era: "foundation",
    year: 1981,
    priority: "critical",
    estimatedTime: "90 minutes",
    learningObjectives: [
      "Understand TCP's reliable delivery mechanisms",
      "Learn about connection establishment and teardown",
      "Explore flow control and congestion management",
      "Master the three-way handshake",
    ],
  },
  {
    number: 821,
    title: "Simple Mail Transfer Protocol (SMTP)",
    description:
      "The foundational email protocol that still powers internet email today.",
    era: "foundation",
    year: 1982,
    priority: "high",
    estimatedTime: "60 minutes",
    learningObjectives: [
      "Understand SMTP's role in email delivery",
      "Learn about mail routing and relay concepts",
      "Explore the protocol commands and responses",
      "Connect to modern email infrastructure",
    ],
  },
];
