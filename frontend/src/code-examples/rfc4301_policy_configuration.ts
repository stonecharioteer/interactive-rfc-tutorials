export const rfc4301_policy_configuration = `"""
RFC 4301: Security Policy Database (SPD) Configuration Example

This example demonstrates how IPsec security policies are configured
and applied to determine packet processing (DISCARD, BYPASS, or PROTECT).
"""

from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import ipaddress
import re

class PolicyAction(Enum):
    DISCARD = "discard"    # Drop the packet
    BYPASS = "bypass"      # Allow without IPsec protection  
    PROTECT = "protect"    # Apply IPsec protection

class Protocol(Enum):
    ANY = 0
    TCP = 6
    UDP = 17
    ICMP = 1

@dataclass
class TrafficSelector:
    """
    RFC 4301 Traffic Selector for Security Policy matching
    
    Defines the traffic characteristics that determine
    which security policy applies to a packet.
    """
    src_address: str        # Source IP address/range
    dst_address: str        # Destination IP address/range  
    src_port_start: int     # Source port range start
    src_port_end: int       # Source port range end
    dst_port_start: int     # Destination port range start
    dst_port_end: int       # Destination port range end
    protocol: Protocol      # IP protocol (TCP, UDP, etc.)
    dscp: Optional[int] = None  # DSCP value for QoS
    
    def matches_packet(self, packet_info: dict) -> bool:
        """Check if this selector matches packet characteristics"""
        
        # Check source address
        if not self._address_matches(packet_info['src_ip'], self.src_address):
            return False
            
        # Check destination address
        if not self._address_matches(packet_info['dst_ip'], self.dst_address):
            return False
            
        # Check protocol
        if self.protocol != Protocol.ANY and packet_info['protocol'] != self.protocol.value:
            return False
            
        # Check ports (if applicable)
        if self.protocol in [Protocol.TCP, Protocol.UDP]:
            if not (self.src_port_start <= packet_info.get('src_port', 0) <= self.src_port_end):
                return False
            if not (self.dst_port_start <= packet_info.get('dst_port', 0) <= self.dst_port_end):
                return False
                
        return True
    
    def _address_matches(self, packet_ip: str, selector_address: str) -> bool:
        """Check if packet IP matches selector address/range"""
        try:
            if '/' in selector_address:
                # CIDR notation
                network = ipaddress.ip_network(selector_address, strict=False)
                return ipaddress.ip_address(packet_ip) in network
            elif '-' in selector_address:
                # Range notation (e.g., 192.168.1.1-192.168.1.100)
                start_ip, end_ip = selector_address.split('-')
                start = ipaddress.ip_address(start_ip.strip())
                end = ipaddress.ip_address(end_ip.strip())
                packet_addr = ipaddress.ip_address(packet_ip)
                return start <= packet_addr <= end
            else:
                # Single IP or wildcard
                if selector_address == "0.0.0.0/0" or selector_address == "any":
                    return True
                return packet_ip == selector_address
        except ValueError:
            return False

@dataclass  
class SecurityPolicyEntry:
    """
    RFC 4301 Security Policy Database (SPD) Entry
    
    Each entry contains selectors and the action to take
    for matching traffic (DISCARD, BYPASS, or PROTECT).
    """
    policy_id: int
    direction: str          # "inbound" or "outbound"
    selector: TrafficSelector
    action: PolicyAction
    sa_template: Optional[Dict] = None  # Template for SA creation
    priority: int = 0       # Higher number = higher priority
    
    def __str__(self) -> str:
        return (f"Policy {self.policy_id}: {self.direction} "
                f"{self.selector.src_address} -> {self.selector.dst_address} "
                f"proto={self.selector.protocol.name} action={self.action.value}")

class SecurityPolicyDatabase:
    """
    RFC 4301 Security Policy Database (SPD)
    
    The SPD specifies the policies that determine the disposition of
    all IP traffic inbound or outbound from a host, security gateway, etc.
    """
    
    def __init__(self):
        self.inbound_policies: List[SecurityPolicyEntry] = []
        self.outbound_policies: List[SecurityPolicyEntry] = []
        self.policy_counter = 1
    
    def add_policy(
        self,
        direction: str,
        selector: TrafficSelector, 
        action: PolicyAction,
        sa_template: Optional[Dict] = None,
        priority: int = 0
    ) -> int:
        """Add a new security policy to the SPD"""
        
        policy = SecurityPolicyEntry(
            policy_id=self.policy_counter,
            direction=direction,
            selector=selector,
            action=action,
            sa_template=sa_template,
            priority=priority
        )
        
        if direction == "inbound":
            self.inbound_policies.append(policy)
            self.inbound_policies.sort(key=lambda p: p.priority, reverse=True)
        else:
            self.outbound_policies.append(policy)
            self.outbound_policies.sort(key=lambda p: p.priority, reverse=True)
        
        print(f"Added {policy}")
        self.policy_counter += 1
        return policy.policy_id
    
    def lookup_policy(self, direction: str, packet_info: dict) -> Optional[SecurityPolicyEntry]:
        """
        Lookup security policy for a packet
        
        Returns the first matching policy based on priority ordering.
        This implements the RFC 4301 policy lookup algorithm.
        """
        policies = self.inbound_policies if direction == "inbound" else self.outbound_policies
        
        for policy in policies:
            if policy.selector.matches_packet(packet_info):
                print(f"Packet matched policy {policy.policy_id}: {policy.action.value}")
                return policy
        
        # Default policy: BYPASS (allow without protection)
        print("No policy matched - using default BYPASS")
        return None
    
    def display_policies(self):
        """Display all configured policies"""
        print("\\n=== Security Policy Database (SPD) ===")
        
        print("\\nInbound Policies:")
        for policy in self.inbound_policies:
            print(f"  {policy}")
            
        print("\\nOutbound Policies:")  
        for policy in self.outbound_policies:
            print(f"  {policy}")

class IPsecPolicyManager:
    """
    RFC 4301 IPsec Policy Management System
    
    Provides high-level interface for configuring common
    IPsec security policy scenarios.
    """
    
    def __init__(self):
        self.spd = SecurityPolicyDatabase()
    
    def configure_site_to_site_vpn(
        self, 
        local_network: str,
        remote_network: str,
        tunnel_endpoints: Tuple[str, str]
    ):
        """
        Configure IPsec policies for site-to-site VPN
        
        This creates policies to protect traffic between two networks
        using IPsec tunnel mode through designated gateways.
        """
        local_gw, remote_gw = tunnel_endpoints
        
        print(f"\\n=== Configuring Site-to-Site VPN ===")
        print(f"Local Network: {local_network}")
        print(f"Remote Network: {remote_network}")
        print(f"Tunnel: {local_gw} <-> {remote_gw}")
        
        # SA template for ESP tunnel mode
        sa_template = {
            "mode": "tunnel",
            "protocol": "esp",
            "encryption": "aes-256-cbc",
            "authentication": "hmac-sha256",
            "pfs_group": "modp2048"
        }
        
        # Outbound policy: local network -> remote network
        outbound_selector = TrafficSelector(
            src_address=local_network,
            dst_address=remote_network,
            src_port_start=0,
            src_port_end=65535,
            dst_port_start=0,
            dst_port_end=65535,
            protocol=Protocol.ANY
        )
        
        self.spd.add_policy(
            direction="outbound",
            selector=outbound_selector,
            action=PolicyAction.PROTECT,
            sa_template=sa_template,
            priority=100
        )
        
        # Inbound policy: remote network -> local network
        inbound_selector = TrafficSelector(
            src_address=remote_network,
            dst_address=local_network,
            src_port_start=0,
            src_port_end=65535,
            dst_port_start=0,
            dst_port_end=65535,
            protocol=Protocol.ANY
        )
        
        self.spd.add_policy(
            direction="inbound",
            selector=inbound_selector,
            action=PolicyAction.PROTECT,
            sa_template=sa_template,
            priority=100
        )
    
    def configure_remote_access_vpn(self, vpn_client_range: str, protected_network: str):
        """
        Configure IPsec policies for remote access VPN clients
        """
        print(f"\\n=== Configuring Remote Access VPN ===")
        print(f"VPN Clients: {vpn_client_range}")
        print(f"Protected Network: {protected_network}")
        
        sa_template = {
            "mode": "tunnel", 
            "protocol": "esp",
            "encryption": "aes-256-gcm",
            "authentication": "built-in",  # AEAD provides auth
            "pfs_group": "modp3072"
        }
        
        # Allow VPN clients to access protected network
        client_to_network = TrafficSelector(
            src_address=vpn_client_range,
            dst_address=protected_network,
            src_port_start=0,
            src_port_end=65535,
            dst_port_start=0,
            dst_port_end=65535,
            protocol=Protocol.ANY
        )
        
        self.spd.add_policy(
            direction="inbound",
            selector=client_to_network,
            action=PolicyAction.PROTECT,
            sa_template=sa_template,
            priority=90
        )
        
        # Allow protected network to respond to VPN clients  
        network_to_client = TrafficSelector(
            src_address=protected_network,
            dst_address=vpn_client_range,
            src_port_start=0,
            src_port_end=65535,
            dst_port_start=0,
            dst_port_end=65535,
            protocol=Protocol.ANY
        )
        
        self.spd.add_policy(
            direction="outbound",
            selector=network_to_client,
            action=PolicyAction.PROTECT,
            sa_template=sa_template,
            priority=90
        )
    
    def configure_dmz_policies(self, dmz_network: str, internal_network: str):
        """
        Configure IPsec policies for DMZ (demilitarized zone) protection
        """
        print(f"\\n=== Configuring DMZ Security Policies ===")
        print(f"DMZ Network: {dmz_network}")
        print(f"Internal Network: {internal_network}")
        
        # Allow internal -> DMZ with protection
        internal_to_dmz = TrafficSelector(
            src_address=internal_network,
            dst_address=dmz_network,
            src_port_start=0,
            src_port_end=65535,
            dst_port_start=0,
            dst_port_end=65535,
            protocol=Protocol.ANY
        )
        
        self.spd.add_policy(
            direction="outbound",
            selector=internal_to_dmz,
            action=PolicyAction.PROTECT,
            priority=80
        )
        
        # Block DMZ -> internal (except for established connections)
        dmz_to_internal = TrafficSelector(
            src_address=dmz_network,
            dst_address=internal_network,
            src_port_start=0,
            src_port_end=65535,
            dst_port_start=0,
            dst_port_end=65535,
            protocol=Protocol.ANY
        )
        
        self.spd.add_policy(
            direction="inbound",
            selector=dmz_to_internal,
            action=PolicyAction.DISCARD,
            priority=80
        )
        
        # Allow Internet -> DMZ on specific ports (e.g., HTTP/HTTPS)
        internet_to_dmz_web = TrafficSelector(
            src_address="0.0.0.0/0",
            dst_address=dmz_network,
            src_port_start=0,
            src_port_end=65535,
            dst_port_start=80,
            dst_port_end=443,
            protocol=Protocol.TCP
        )
        
        self.spd.add_policy(
            direction="inbound",
            selector=internet_to_dmz_web,
            action=PolicyAction.BYPASS,  # Public web services
            priority=70
        )
    
    def test_packet_processing(self, test_packets: List[dict]):
        """
        Test how various packets are processed by the security policies
        """
        print("\\n=== Testing Packet Processing ===")
        
        for i, packet in enumerate(test_packets, 1):
            print(f"\\nTest Packet {i}:")
            print(f"  {packet['src_ip']}:{packet.get('src_port', 'any')} -> "
                  f"{packet['dst_ip']}:{packet.get('dst_port', 'any')} "
                  f"proto={packet.get('protocol', 'any')}")
            
            # Test outbound policy lookup
            outbound_policy = self.spd.lookup_policy("outbound", packet)
            if outbound_policy:
                print(f"  Outbound: {outbound_policy.action.value} (Policy {outbound_policy.policy_id})")
            else:
                print(f"  Outbound: bypass (default)")
            
            # Test inbound policy lookup  
            inbound_policy = self.spd.lookup_policy("inbound", packet)
            if inbound_policy:
                print(f"  Inbound: {inbound_policy.action.value} (Policy {inbound_policy.policy_id})")
            else:
                print(f"  Inbound: bypass (default)")

# Example Usage: Enterprise IPsec Policy Configuration
def demonstrate_ipsec_policy_configuration():
    """
    Demonstrate comprehensive IPsec policy configuration for
    an enterprise network with multiple security zones.
    """
    print("RFC 4301: IPsec Security Policy Configuration Demo")
    print("=" * 55)
    
    # Initialize policy manager
    policy_mgr = IPsecPolicyManager()
    
    # Configure site-to-site VPN between headquarters and branch office
    policy_mgr.configure_site_to_site_vpn(
        local_network="192.168.1.0/24",    # Headquarters LAN
        remote_network="192.168.100.0/24",  # Branch office LAN
        tunnel_endpoints=("203.0.113.1", "198.51.100.1")
    )
    
    # Configure remote access VPN for mobile workers
    policy_mgr.configure_remote_access_vpn(
        vpn_client_range="10.10.0.0/16",    # VPN client address pool
        protected_network="192.168.1.0/24"  # Internal corporate network
    )
    
    # Configure DMZ protection policies
    policy_mgr.configure_dmz_policies(
        dmz_network="172.16.1.0/24",        # DMZ with web servers
        internal_network="192.168.1.0/24"   # Internal corporate network
    )
    
    # Display all configured policies
    policy_mgr.spd.display_policies()
    
    # Test packet processing with various scenarios
    test_packets = [
        # Headquarters to branch office communication
        {
            'src_ip': '192.168.1.10',
            'dst_ip': '192.168.100.10', 
            'protocol': 6,  # TCP
            'src_port': 12345,
            'dst_port': 80
        },
        # VPN client accessing internal server
        {
            'src_ip': '10.10.5.100',
            'dst_ip': '192.168.1.50',
            'protocol': 6,  # TCP  
            'src_port': 54321,
            'dst_port': 443
        },
        # Internet user accessing DMZ web server
        {
            'src_ip': '8.8.8.8',
            'dst_ip': '172.16.1.10',
            'protocol': 6,  # TCP
            'src_port': 55555,
            'dst_port': 80
        },
        # DMZ server attempting to access internal network (should be blocked)
        {
            'src_ip': '172.16.1.10',
            'dst_ip': '192.168.1.10',
            'protocol': 6,  # TCP
            'src_port': 8080,
            'dst_port': 3306
        }
    ]
    
    policy_mgr.test_packet_processing(test_packets)
    
    print("\\n=== Policy Configuration Complete ===")
    print("IPsec policies configured for:")
    print("✅ Site-to-site VPN connectivity")
    print("✅ Remote access VPN support") 
    print("✅ DMZ security isolation")
    print("✅ Comprehensive packet filtering")

if __name__ == "__main__":
    demonstrate_ipsec_policy_configuration()
`;