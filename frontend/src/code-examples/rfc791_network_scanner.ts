export const code = `import ipaddress
import socket
import threading
from concurrent.futures import ThreadPoolExecutor

def ping_ip(ip_str):
    """Check if an IP address responds to a basic connection attempt."""
    try:
        ip = ipaddress.IPv4Address(ip_str)

        # Try to connect to a common port (like HTTP)
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1)  # 1 second timeout
            result = sock.connect_ex((str(ip), 80))
            if result == 0:
                return f"{ip}: Port 80 OPEN"
            else:
                return f"{ip}: Port 80 closed/filtered"
    except Exception as e:
        return f"{ip}: Error - {e}"

def scan_network(network_str):
    """Scan a network range for active hosts."""
    try:
        network = ipaddress.IPv4Network(network_str, strict=False)
        print(f"Scanning network: {network}")
        print(f"Total addresses to scan: {network.num_addresses}")

        # Use threading for faster scanning
        with ThreadPoolExecutor(max_workers=50) as executor:
            # Scan first 20 addresses to avoid overwhelming
            hosts_to_scan = list(network.hosts())[:20]
            results = executor.map(ping_ip, [str(ip) for ip in hosts_to_scan])

            for result in results:
                print(result)

    except ValueError as e:
        print(f"Invalid network: {e}")

# Example usage
scan_network("192.168.1.0/24")`;
