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

// RFC4787 - NAT Behavioral Requirements
import { getCodeExample as rfc4787NatDetector } from "../code-examples/rfc4787_nat_detector";
import { getCodeExample as rfc4787HolePuncher } from "../code-examples/rfc4787_hole_puncher";

// RFC4364 - BGP/MPLS IP VPNs
import { getCodeExample as rfc4364VpnProcessor } from "../code-examples/rfc4364_vpn_processor";
import { getCodeExample as rfc4364ServiceProvisioner } from "../code-examples/rfc4364_service_provisioner";

// RFC7540 - HTTP/2
import { getCodeExample as rfc7540Http2Client } from "../code-examples/rfc7540_http2_client";
import { getCodeExample as rfc7540ServerPush } from "../code-examples/rfc7540_server_push";

// RFC9110 - HTTP Semantics
import { getCodeExample as rfc9110HttpClient } from "../code-examples/rfc9110_http_client";
import { getCodeExample as rfc9110ApiDesign } from "../code-examples/rfc9110_api_design";

// RFC9111 - HTTP Caching
import { rfc9111_cache_implementation } from "../code-examples/rfc9111_cache_implementation";

// RFC9112 - HTTP/1.1 Message Syntax
import { rfc9112_message_parser } from "../code-examples/rfc9112_message_parser";

// RFC9113 - HTTP/2
import { rfc9113_http2_client } from "../code-examples/rfc9113_http2_client";

// RFC9114 - HTTP/3
import { rfc9114_http3_client } from "../code-examples/rfc9114_http3_client";

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

  // RFC4787 - NAT Behavioral Requirements  
  rfc4787_nat_detector: rfc4787NatDetector(),
  rfc4787_hole_puncher: rfc4787HolePuncher(),

  // RFC4364 - BGP/MPLS IP VPNs
  rfc4364_vpn_processor: rfc4364VpnProcessor(),
  rfc4364_service_provisioner: rfc4364ServiceProvisioner(),

  // RFC7540 - HTTP/2
  rfc7540_http2_client: rfc7540Http2Client(),
  rfc7540_server_push: rfc7540ServerPush(),

  // RFC9110 - HTTP Semantics
  rfc9110_http_client: rfc9110HttpClient(),
  rfc9110_api_design: rfc9110ApiDesign(),

  // RFC9111 - HTTP Caching
  rfc9111_cache_implementation: rfc9111_cache_implementation,

  // RFC9112 - HTTP/1.1 Message Syntax
  rfc9112_message_parser: rfc9112_message_parser,

  // RFC9113 - HTTP/2
  rfc9113_http2_client: rfc9113_http2_client,

  // RFC9114 - HTTP/3
  rfc9114_http3_client: rfc9114_http3_client,
};

export const getCodeExample = (key: string): string => {
  return codeExamples[key] || "";
};

export const availableExamples = Object.keys(codeExamples);
