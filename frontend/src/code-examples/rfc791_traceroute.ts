export const code = `import socket
import struct
import time
import sys

def traceroute(target_host, max_hops=30):
    """Simple traceroute implementation using raw sockets."""

    try:
        # Resolve target hostname to IP
        target_ip = socket.gethostbyname(target_host)
        print(f"Tracing route to {target_host} ({target_ip})")
        print(f"Maximum hops: {max_hops}")
        print()

        for ttl in range(1, max_hops + 1):
            # Create raw socket for ICMP
            sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)

            # Set TTL for this packet
            sock.setsockopt(socket.IPPROTO_IP, socket.IP_TTL, ttl)
            sock.settimeout(3)  # 3 second timeout

            start_time = time.time()

            try:
                # Send ICMP Echo Request
                sock.sendto(b'\\x08\\x00\\x00\\x00\\x00\\x00\\x00\\x00', (target_ip, 0))

                # Receive response
                response, addr = sock.recvfrom(512)
                end_time = time.time()

                rtt = (end_time - start_time) * 1000  # Round-trip time in ms

                # Try to get hostname
                try:
                    hostname = socket.gethostbyaddr(addr[0])[0]
                except:
                    hostname = addr[0]

                print(f"{ttl:2d}  {rtt:6.1f} ms  {hostname} ({addr[0]})")

                # Check if we reached the destination
                if addr[0] == target_ip:
                    print(f"\\nTrace complete! Reached {target_host}")
                    break

            except socket.timeout:
                print(f"{ttl:2d}  *  *  *  Request timed out")
            except PermissionError:
                print("Error: Need root privileges for raw sockets")
                return
            finally:
                sock.close()

    except socket.gaierror:
        print(f"Error: Could not resolve hostname '{target_host}'")

# Note: This requires root privileges on most systems
# traceroute('google.com')`;
