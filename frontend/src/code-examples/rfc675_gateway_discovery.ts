export const code = `import socket
import struct
import subprocess
import platform

def find_default_gateway():
    """Find the default gateway (router) on different platforms."""

    system = platform.system().lower()

    if system == "linux":
        try:
            # Parse /proc/net/route to find default gateway
            with open('/proc/net/route', 'r') as f:
                lines = f.readlines()[1:]  # Skip header

            for line in lines:
                fields = line.strip().split()
                if fields[1] == '00000000':  # Default route (0.0.0.0)
                    gateway_hex = fields[2]
                    # Convert hex to IP (little endian)
                    gateway_ip = socket.inet_ntoa(
                        struct.pack('<L', int(gateway_hex, 16))
                    )
                    return gateway_ip
        except:
            pass

    elif system == "darwin" or system == "windows":
        try:
            # Use netstat to find default gateway
            if system == "windows":
                cmd = ["netstat", "-rn"]
            else:
                cmd = ["netstat", "-rn", "-f", "inet"]

            result = subprocess.run(cmd, capture_output=True, text=True)
            lines = result.stdout.split('\\n')

            for line in lines:
                if '0.0.0.0' in line or 'default' in line:
                    parts = line.split()
                    for part in parts:
                        if '.' in part and part != '0.0.0.0':
                            try:
                                socket.inet_aton(part)  # Validate IP
                                return part
                            except:
                                continue
        except:
            pass

    return "Unable to determine"

def trace_to_gateway():
    """Show how packets travel through the gateway."""

    gateway = find_default_gateway()
    print(f"Default Gateway (Router): {gateway}")

    if gateway != "Unable to determine":
        print(f"\\nYour computer sends packets to {gateway} first")
        print("The gateway/router then forwards them to the internet")
        print("This is exactly what RFC 675 described in 1974!")

        # Test connectivity to gateway
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex((gateway, 80))  # Try HTTP port

            if result == 0:
                print(f"✅ Gateway {gateway} is reachable")
            else:
                print(f"Gateway {gateway} found but HTTP port not open")
            sock.close()
        except Exception as e:
            print(f"Gateway check failed: {e}")

trace_to_gateway()`;
