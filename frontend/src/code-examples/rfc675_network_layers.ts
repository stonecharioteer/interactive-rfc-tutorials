export const code = `import socket
import struct

def demonstrate_network_layers():
    """Show how Python abstracts the network layer stack."""

    # Application Layer - Your Python code
    message = "Hello from the application layer!"

    # Transport Layer - TCP socket (Python handles this)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:

        # Internet Layer - IP addressing (Python abstracts this)
        host = 'httpbin.org'  # DNS resolves to IP address
        port = 80

        print(f"Application Layer: Sending '{message}'")

        # Network Interface Layer is handled by the OS
        print(f"Transport Layer: TCP socket created")
        print(f"Internet Layer: Connecting to {host}:{port}")

        sock.connect((host, port))

        # Send HTTP request (Application Layer protocol)
        http_request = f"""GET /get HTTP/1.1\\r
Host: {host}\\r
Connection: close\\r
\\r
"""

        sock.send(http_request.encode())
        print("Network Interface: Packet transmitted over physical network")

        # Receive response
        response = sock.recv(1024)
        print(f"\\nResponse received: {len(response)} bytes")
        print("All network layers worked together successfully!")

demonstrate_network_layers()`;
