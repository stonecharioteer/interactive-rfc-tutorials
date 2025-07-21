export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'protocol' | 'network' | 'security' | 'web' | 'email' | 'general';
  relatedTerms?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  // Protocol Terms
  {
    id: 'tcp',
    term: 'TCP',
    definition: 'Transmission Control Protocol - A reliable, connection-oriented protocol that ensures data is delivered accurately and in order between applications over a network.',
    category: 'protocol',
    relatedTerms: ['ip', 'udp', 'three-way-handshake']
  },
  {
    id: 'ip',
    term: 'IP',
    definition: 'Internet Protocol - The fundamental protocol that routes data packets across networks using IP addresses to identify source and destination.',
    category: 'protocol',
    relatedTerms: ['tcp', 'udp', 'ipv4', 'ipv6']
  },
  {
    id: 'ipv4',
    term: 'IPv4',
    definition: 'Internet Protocol Version 4 - Uses 32-bit addresses (like 192.168.1.1) allowing for about 4.3 billion unique addresses.',
    category: 'protocol',
    relatedTerms: ['ip', 'ipv6', 'subnet']
  },
  {
    id: 'ipv6',
    term: 'IPv6',
    definition: 'Internet Protocol Version 6 - Uses 128-bit addresses providing virtually unlimited address space for future internet growth.',
    category: 'protocol',
    relatedTerms: ['ip', 'ipv4']
  },
  {
    id: 'smtp',
    term: 'SMTP',
    definition: 'Simple Mail Transfer Protocol - The standard protocol for sending email messages between servers across the internet.',
    category: 'email',
    relatedTerms: ['email', 'mx-record', 'pop3', 'imap']
  },
  {
    id: 'http',
    term: 'HTTP',
    definition: 'HyperText Transfer Protocol - The foundation protocol of the World Wide Web, used for transferring web pages and resources.',
    category: 'web',
    relatedTerms: ['https', 'html', 'url', 'web-server']
  },
  {
    id: 'https',
    term: 'HTTPS',
    definition: 'HTTP Secure - HTTP over TLS/SSL, providing encrypted communication between web browsers and servers.',
    category: 'web',
    relatedTerms: ['http', 'tls', 'ssl', 'encryption']
  },
  {
    id: 'dns',
    term: 'DNS',
    definition: 'Domain Name System - Translates human-readable domain names (like example.com) into IP addresses that computers use to connect.',
    category: 'network',
    relatedTerms: ['domain', 'ip', 'mx-record', 'cname']
  },
  {
    id: 'ftp',
    term: 'FTP',
    definition: 'File Transfer Protocol - A standard protocol for transferring files between computers over a network, commonly used for website uploads.',
    category: 'protocol',
    relatedTerms: ['sftp', 'file-transfer']
  },
  
  // Network Terms
  {
    id: 'packet',
    term: 'Packet',
    definition: 'A formatted unit of data carried across a network. Contains both the data being sent and control information like source/destination addresses.',
    category: 'network',
    relatedTerms: ['header', 'payload', 'routing']
  },
  {
    id: 'header',
    term: 'Header',
    definition: 'Control information at the beginning of a data packet that contains metadata like source/destination addresses and protocol information.',
    category: 'network',
    relatedTerms: ['packet', 'payload']
  },
  {
    id: 'payload',
    term: 'Payload',
    definition: 'The actual data being transmitted in a packet, excluding headers and control information.',
    category: 'network',
    relatedTerms: ['packet', 'header']
  },
  {
    id: 'routing',
    term: 'Routing',
    definition: 'The process of determining the best path for data packets to travel from source to destination across networks.',
    category: 'network',
    relatedTerms: ['router', 'packet', 'bgp']
  },
  {
    id: 'subnet',
    term: 'Subnet',
    definition: 'A logical subdivision of a larger network, allowing for better organization and security of network resources.',
    category: 'network',
    relatedTerms: ['ipv4', 'network', 'cidr']
  },
  {
    id: 'port',
    term: 'Port',
    definition: 'A numerical identifier (0-65535) that allows multiple services to run on the same IP address by differentiating network connections.',
    category: 'network',
    relatedTerms: ['tcp', 'udp', 'socket']
  },
  
  // Web Terms
  {
    id: 'url',
    term: 'URL',
    definition: 'Uniform Resource Locator - A web address that specifies the location and method for retrieving a resource on the internet.',
    category: 'web',
    relatedTerms: ['http', 'domain', 'uri']
  },
  {
    id: 'html',
    term: 'HTML',
    definition: 'HyperText Markup Language - The standard markup language for creating web pages and applications.',
    category: 'web',
    relatedTerms: ['http', 'web-page', 'css']
  },
  {
    id: 'web-server',
    term: 'Web Server',
    definition: 'A computer system that serves web pages to users over the internet using HTTP protocol.',
    category: 'web',
    relatedTerms: ['http', 'html', 'client-server']
  },
  
  // Email Terms
  {
    id: 'mx-record',
    term: 'MX Record',
    definition: 'Mail Exchange record - A DNS record that specifies which mail servers are responsible for receiving email for a domain.',
    category: 'email',
    relatedTerms: ['dns', 'smtp', 'email']
  },
  {
    id: 'pop3',
    term: 'POP3',
    definition: 'Post Office Protocol 3 - An email retrieval protocol that downloads messages from a server to a local client.',
    category: 'email',
    relatedTerms: ['smtp', 'imap', 'email']
  },
  {
    id: 'imap',
    term: 'IMAP',
    definition: 'Internet Message Access Protocol - Allows email clients to access and manage messages stored on a mail server.',
    category: 'email',
    relatedTerms: ['smtp', 'pop3', 'email']
  },
  
  // Security Terms
  {
    id: 'encryption',
    term: 'Encryption',
    definition: 'The process of encoding data so that only authorized parties can access it, protecting information during transmission.',
    category: 'security',
    relatedTerms: ['https', 'tls', 'ssl']
  },
  {
    id: 'tls',
    term: 'TLS',
    definition: 'Transport Layer Security - A cryptographic protocol that provides secure communication over networks, successor to SSL.',
    category: 'security',
    relatedTerms: ['ssl', 'https', 'encryption']
  },
  {
    id: 'ssl',
    term: 'SSL',
    definition: 'Secure Sockets Layer - An older cryptographic protocol for secure communication, now largely replaced by TLS.',
    category: 'security',
    relatedTerms: ['tls', 'https', 'encryption']
  },
  
  // General Terms
  {
    id: 'client-server',
    term: 'Client-Server',
    definition: 'A network architecture where client devices request services or resources from centralized server computers.',
    category: 'general',
    relatedTerms: ['web-server', 'http', 'tcp']
  },
  {
    id: 'three-way-handshake',
    term: 'Three-way Handshake',
    definition: 'TCP connection establishment process: SYN (client initiates), SYN-ACK (server responds), ACK (client confirms).',
    category: 'protocol',
    relatedTerms: ['tcp', 'connection']
  },
  {
    id: 'arpanet',
    term: 'ARPANET',
    definition: 'The Advanced Research Projects Agency Network - The precursor to the modern internet, developed by DARPA in the late 1960s.',
    category: 'general',
    relatedTerms: ['internet', 'tcp', 'ip']
  },
  {
    id: 'rfc',
    term: 'RFC',
    definition: 'Request for Comments - Documents that describe internet standards, protocols, and procedures. The collaborative process that built the internet.',
    category: 'general',
    relatedTerms: ['ietf', 'internet-standard']
  },
  {
    id: 'ietf',
    term: 'IETF',
    definition: 'Internet Engineering Task Force - The organization that develops and promotes voluntary internet standards through the RFC process.',
    category: 'general',
    relatedTerms: ['rfc', 'internet-standard']
  }
];

// Create a lookup map for faster access
export const glossaryMap = new Map(
  glossaryTerms.map(term => [term.id, term])
);

// Helper function to find terms by keyword
export function findGlossaryTerm(keyword: string): GlossaryTerm | undefined {
  const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // First try exact match on term
  const exactMatch = glossaryTerms.find(
    term => term.term.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedKeyword
  );
  
  if (exactMatch) return exactMatch;
  
  // Try ID match
  return glossaryMap.get(normalizedKeyword);
}

// Helper function to get terms by category
export function getTermsByCategory(category: GlossaryTerm['category']): GlossaryTerm[] {
  return glossaryTerms.filter(term => term.category === category);
}