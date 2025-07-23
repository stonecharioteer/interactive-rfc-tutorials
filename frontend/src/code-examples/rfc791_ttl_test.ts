export const code = `import socket
import time

def simple_hop_check(host, port=80, max_ttl=10):
    """Check connectivity with different TTL values."""

    target_ip = socket.gethostbyname(host)
    print(f"Testing connectivity to {host} ({target_ip})")

    for ttl in range(1, max_ttl + 1):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            # Set IP_TTL socket option
            sock.setsockopt(socket.IPPROTO_IP, socket.IP_TTL, ttl)
            sock.settimeout(2)

            start_time = time.time()
            result = sock.connect_ex((target_ip, port))
            end_time = time.time()

            if result == 0:
                rtt = (end_time - start_time) * 1000
                print(f"TTL {ttl:2d}: SUCCESS - Connected in {rtt:.1f}ms")
                sock.close()
                break
            else:
                print(f"TTL {ttl:2d}: Connection failed (may have been dropped by router)")

            sock.close()

        except Exception as e:
            print(f"TTL {ttl:2d}: Error - {e}")

# This works without root privileges
simple_hop_check('httpbin.org', 80)`;
