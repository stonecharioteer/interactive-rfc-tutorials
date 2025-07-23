"""
Shared IPv6 utilities for RFC 2460 demonstration.
Educational implementation of IPv6 concepts.
"""

import socket
import struct
import ipaddress
import random
import binascii
from typing import Dict, List, Tuple, Optional

class IPv6Utils:
    """Utility class for IPv6 operations following RFC 2460."""
    
    @staticmethod
    def format_ipv6_address(addr_str: str) -> Dict[str, str]:
        """Format IPv6 address in different representations."""
        try:
            addr = ipaddress.IPv6Address(addr_str)
            return {
                'compressed': str(addr.compressed),
                'expanded': str(addr.exploded),
                'binary': format(int(addr), '0128b'),
                'hex': format(int(addr), '032x'),
                'type': IPv6Utils.classify_address(addr)
            }
        except ipaddress.AddressValueError:
            return {'error': f'Invalid IPv6 address: {addr_str}'}
    
    @staticmethod
    def classify_address(addr: ipaddress.IPv6Address) -> str:
        """Classify IPv6 address type according to RFC 2460."""
        if addr.is_loopback:
            return "Loopback (::1)"
        elif addr.is_unspecified:
            return "Unspecified (::)"
        elif addr.is_link_local:
            return "Link-Local Unicast (fe80::/10)"
        elif addr.is_multicast:
            scope = IPv6Utils.get_multicast_scope(addr)
            return f"Multicast {scope} (ff{format(int(addr) >> 120, '02x')}::/8)"
        elif addr.is_private:
            return "Unique Local Unicast (fc00::/7)"
        elif addr.is_global:
            return "Global Unicast (2000::/3)"
        else:
            return "Reserved/Special"
    
    @staticmethod
    def get_multicast_scope(addr: ipaddress.IPv6Address) -> str:
        """Get multicast scope from IPv6 multicast address."""
        scope_map = {
            0x1: "Interface-Local",
            0x2: "Link-Local", 
            0x4: "Admin-Local",
            0x5: "Site-Local",
            0x8: "Organization-Local",
            0xE: "Global"
        }
        
        # Extract scope from the 4 bits after ff
        addr_int = int(addr)
        scope_bits = (addr_int >> 116) & 0xF
        return scope_map.get(scope_bits, f"Reserved-{scope_bits}")
    
    @staticmethod
    def generate_link_local_from_mac(mac_address: str) -> str:
        """Generate IPv6 link-local address from MAC using EUI-64."""
        # Clean MAC address
        mac = mac_address.replace(':', '').replace('-', '').upper()
        if len(mac) != 12:
            raise ValueError("Invalid MAC address format")
        
        # Convert to EUI-64
        eui64 = mac[:6] + 'FFFE' + mac[6:]
        
        # Flip universal/local bit (7th bit of first byte)
        first_byte = int(eui64[:2], 16)
        first_byte ^= 0x02
        eui64 = f"{first_byte:02X}{eui64[2:]}"
        
        # Format as IPv6 interface identifier
        interface_id = ':'.join([eui64[i:i+4] for i in range(0, 16, 4)])
        
        return f"fe80::{interface_id}"
    
    @staticmethod
    def create_ipv6_header(src: str, dst: str, payload_length: int, 
                          next_header: int = 59, traffic_class: int = 0,
                          flow_label: int = 0, hop_limit: int = 64) -> bytes:
        """Create IPv6 header according to RFC 2460 format."""
        
        # Version (4) + Traffic Class (8) + Flow Label (20) = 32 bits
        version_tc_fl = (6 << 28) | (traffic_class << 20) | flow_label
        
        # Pack the header
        header = struct.pack('!IHBB',
                           version_tc_fl,
                           payload_length,
                           next_header,
                           hop_limit)
        
        # Add source and destination addresses
        src_bytes = ipaddress.IPv6Address(src).packed
        dst_bytes = ipaddress.IPv6Address(dst).packed
        
        return header + src_bytes + dst_bytes
    
    @staticmethod
    def parse_ipv6_header(header_bytes: bytes) -> Dict:
        """Parse IPv6 header from binary data."""
        if len(header_bytes) < 40:
            return {'error': 'Header too short'}
        
        # Unpack first 8 bytes
        version_tc_fl, payload_length, next_header, hop_limit = struct.unpack('!IHBB', header_bytes[:8])
        
        # Extract fields from first 32 bits
        version = (version_tc_fl >> 28) & 0xF
        traffic_class = (version_tc_fl >> 20) & 0xFF
        flow_label = version_tc_fl & 0xFFFFF
        
        # Extract addresses
        src_addr = ipaddress.IPv6Address(header_bytes[8:24])
        dst_addr = ipaddress.IPv6Address(header_bytes[24:40])
        
        return {
            'version': version,
            'traffic_class': traffic_class,
            'flow_label': flow_label,
            'payload_length': payload_length,
            'next_header': next_header,
            'hop_limit': hop_limit,
            'source_address': str(src_addr.compressed),
            'destination_address': str(dst_addr.compressed)
        }
    
    @staticmethod
    def demonstrate_address_space():
        """Show IPv6 address space comparison with IPv4."""
        ipv4_total = 2**32
        ipv6_total = 2**128
        
        print("🌐 IPv6 vs IPv4 Address Space")
        print("=" * 40)
        print(f"IPv4 addresses: {ipv4_total:,}")
        print(f"IPv6 addresses: {ipv6_total:,}")
        print(f"Ratio: {ipv6_total // ipv4_total:,}x larger")
        
        # Practical examples
        print(f"\n📊 Practical Allocations:")
        print(f"/48 site: {2**(128-48):,} addresses")
        print(f"/64 subnet: {2**(128-64):,} addresses")
        
        # Earth analogy
        earth_surface = 510_100_000_000_000  # m²
        addrs_per_m2 = ipv6_total // earth_surface
        print(f"\n🌍 Earth analogy: {addrs_per_m2:,} addresses per m²")
    
    @staticmethod
    def get_network_interfaces() -> List[Dict]:
        """Get IPv6 network interfaces information."""
        interfaces = []
        
        try:
            import netifaces
            for interface in netifaces.interfaces():
                try:
                    addrs = netifaces.ifaddresses(interface)
                    if netifaces.AF_INET6 in addrs:
                        for addr_info in addrs[netifaces.AF_INET6]:
                            addr = addr_info['addr'].split('%')[0]  # Remove scope ID
                            interfaces.append({
                                'interface': interface,
                                'address': addr,
                                'type': IPv6Utils.classify_address(ipaddress.IPv6Address(addr))
                            })
                except (ValueError, KeyError):
                    continue
        except ImportError:
            # Fallback without netifaces
            interfaces.append({
                'interface': 'lo',
                'address': '::1',
                'type': 'Loopback'
            })
        
        return interfaces
    
    @staticmethod
    def ping6(target: str, count: int = 4) -> Dict:
        """Simulate IPv6 ping functionality."""
        try:
            target_addr = ipaddress.IPv6Address(target)
            
            # Create ICMPv6 socket (requires root in real implementation)
            results = {
                'target': str(target_addr.compressed),
                'target_type': IPv6Utils.classify_address(target_addr),
                'packets_sent': count,
                'simulated': True,
                'results': []
            }
            
            for i in range(count):
                # Simulate round-trip time
                rtt = random.uniform(1.0, 50.0)
                results['results'].append({
                    'sequence': i + 1,
                    'rtt_ms': round(rtt, 2),
                    'status': 'success'
                })
            
            return results
            
        except ipaddress.AddressValueError:
            return {'error': f'Invalid IPv6 address: {target}'}
    
    @staticmethod
    def create_test_addresses() -> Dict[str, List[str]]:
        """Generate test IPv6 addresses for different types."""
        return {
            'Global Unicast': [
                '2001:db8:85a3::8a2e:370:7334',
                '2001:4860:4860::8888',  # Google DNS
                '2606:4700:4700::1111'   # Cloudflare DNS
            ],
            'Link-Local': [
                'fe80::1',
                'fe80::200:5eff:fe00:5301'
            ],
            'Unique Local': [
                'fc00::1',
                'fd12:3456:789a::1'
            ],
            'Multicast': [
                'ff02::1',    # All nodes
                'ff02::2',    # All routers
                'ff05::101'   # NTP servers
            ],
            'Special': [
                '::1',        # Loopback
                '::',         # Unspecified
                '::ffff:192.0.2.1'  # IPv4-mapped
            ]
        }

def log_message(level: str, message: str, component: str = "IPv6"):
    """Formatted logging for IPv6 demonstrations."""
    timestamp = __import__('datetime').datetime.now().strftime('%H:%M:%S')
    icon = {
        'INFO': '📡',
        'SUCCESS': '✅', 
        'ERROR': '❌',
        'WARNING': '⚠️',
        'DEBUG': '🔍'
    }.get(level, '📝')
    
    print(f"[{timestamp}] {icon} [{component}] {message}")

def create_ipv6_socket(address_family=socket.AF_INET6, socket_type=socket.SOCK_STREAM):
    """Create IPv6 socket with proper configuration."""
    sock = socket.socket(address_family, socket_type)
    
    # Allow IPv6 and IPv4 on the same socket
    if hasattr(socket, 'IPPROTO_IPV6') and hasattr(socket, 'IPV6_V6ONLY'):
        sock.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
    
    return sock