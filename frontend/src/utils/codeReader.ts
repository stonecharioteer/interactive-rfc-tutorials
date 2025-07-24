// Utility to read code examples from external files

// RFC5389 - STUN Protocol
import { code as rfc5389StunClient } from "../code-examples/rfc5389_stun_client";
import { code as rfc5389UdpHolePuncher } from "../code-examples/rfc5389_udp_hole_puncher";
import { code as rfc5389NetworkTopology } from "../code-examples/rfc5389_network_topology";
import { code as rfc5389WebrtcConfig } from "../code-examples/rfc5389_webrtc_config";

// RFC8445 - ICE Protocol
import { code as rfc8445IceGatherer } from "../code-examples/rfc8445_ice_gatherer";
import { code as rfc8445ConnectivityChecker } from "../code-examples/rfc8445_connectivity_checker";
import { code as rfc8445IceConcepts } from "../code-examples/rfc8445_ice_concepts";
import { code as rfc8445WebrtcDemo } from "../code-examples/rfc8445_webrtc_demo";

// RFC1 - Host Software
import { code as rfc1Fetcher } from "../code-examples/rfc1_fetcher";
import { code as rfc1DocumentSystem } from "../code-examples/rfc1_document_system";

// RFC675 - Network Transmission Control Program
import { code as rfc675NetworkLayers } from "../code-examples/rfc675_network_layers";
import { code as rfc675GatewayDiscovery } from "../code-examples/rfc675_gateway_discovery";

// RFC791 - IPv4
import { code as rfc791AddressBasics } from "../code-examples/rfc791_address_basics";
import { code as rfc791NetworkScanner } from "../code-examples/rfc791_network_scanner";
import { code as rfc791Traceroute } from "../code-examples/rfc791_traceroute";
import { code as rfc791TtlTest } from "../code-examples/rfc791_ttl_test";

// RFC793 - TCP
import { code as rfc793TcpServer } from "../code-examples/rfc793_tcp_server";
import { code as rfc793TcpClient } from "../code-examples/rfc793_tcp_client";
import { code as rfc793BufferManagement } from "../code-examples/rfc793_buffer_management";

// RFC821 - SMTP
import { code as rfc821SmtpMethods } from "../code-examples/rfc821_smtp_methods";
import { code as rfc821SendEmail } from "../code-examples/rfc821_send_email";

// RFC4301 - IPsec Security Architecture
import { rfc4301_security_association } from "../code-examples/rfc4301_security_association";
import { rfc4301_policy_configuration } from "../code-examples/rfc4301_policy_configuration";

// RFC4303 - ESP (Encapsulating Security Payload)
import { rfc4303_esp_implementation } from "../code-examples/rfc4303_esp_implementation";
import { rfc4303_esp_processing } from "../code-examples/rfc4303_esp_processing";

// RFC8656 - TURN
import { rfc8656_turn_client } from "../code-examples/rfc8656_turn_client";

const codeExamples: Record<string, string> = {
  // RFC5389 - STUN Protocol
  rfc5389_stun_client: rfc5389StunClient,
  rfc5389_udp_hole_puncher: rfc5389UdpHolePuncher,
  rfc5389_network_topology: rfc5389NetworkTopology,
  rfc5389_webrtc_config: rfc5389WebrtcConfig,

  // RFC8445 - ICE Protocol
  rfc8445_ice_gatherer: rfc8445IceGatherer,
  rfc8445_connectivity_checker: rfc8445ConnectivityChecker,
  rfc8445_ice_concepts: rfc8445IceConcepts,
  rfc8445_webrtc_demo: rfc8445WebrtcDemo,

  // RFC1 - Host Software
  rfc1_fetcher: rfc1Fetcher,
  rfc1_document_system: rfc1DocumentSystem,

  // RFC675 - Network Transmission Control Program
  rfc675_network_layers: rfc675NetworkLayers,
  rfc675_gateway_discovery: rfc675GatewayDiscovery,

  // RFC791 - IPv4
  rfc791_address_basics: rfc791AddressBasics,
  rfc791_network_scanner: rfc791NetworkScanner,
  rfc791_traceroute: rfc791Traceroute,
  rfc791_ttl_test: rfc791TtlTest,

  // RFC793 - TCP
  rfc793_tcp_server: rfc793TcpServer,
  rfc793_tcp_client: rfc793TcpClient,
  rfc793_buffer_management: rfc793BufferManagement,

  // RFC821 - SMTP
  rfc821_smtp_methods: rfc821SmtpMethods,
  rfc821_send_email: rfc821SendEmail,

  // RFC4301 - IPsec Security Architecture
  rfc4301_security_association: rfc4301_security_association,
  rfc4301_policy_configuration: rfc4301_policy_configuration,

  // RFC4303 - ESP (Encapsulating Security Payload)
  rfc4303_esp_implementation: rfc4303_esp_implementation,
  rfc4303_esp_processing: rfc4303_esp_processing,

  // RFC8656 - TURN
  rfc8656_turn_client: rfc8656_turn_client,
};

export const getCodeExample = (key: string): string => {
  return codeExamples[key] || "";
};

export const availableExamples = Object.keys(codeExamples);
