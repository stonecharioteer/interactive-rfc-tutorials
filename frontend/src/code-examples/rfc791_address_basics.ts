export const code = `import ipaddress
import socket
import struct

# Create IPv4 address objects
ip1 = ipaddress.IPv4Address('192.168.1.1')
ip2 = ipaddress.IPv4Address('10.0.0.1')

print(f"IP Address: {ip1}")
print(f"Binary representation: {bin(int(ip1))}")
print(f"32-bit integer: {int(ip1)}")

# Convert between formats
ip_int = int(ip1)  # 3232235777
ip_bytes = ip1.packed  # b'\\xc0\\xa8\\x01\\x01'

# Check address properties
print(f"Is private: {ip1.is_private}")
print(f"Is multicast: {ip1.is_multicast}")
print(f"Is loopback: {ip1.is_loopback}")

# Network calculations
network = ipaddress.IPv4Network('192.168.1.0/24', strict=False)
print(f"Network: {network}")
print(f"Network address: {network.network_address}")
print(f"Broadcast address: {network.broadcast_address}")
print(f"Netmask: {network.netmask}")
print(f"Number of hosts: {network.num_addresses}")`;
