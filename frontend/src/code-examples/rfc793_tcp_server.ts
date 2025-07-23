export const code = `import socket

# Create a TCP socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Allow socket reuse
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# Bind to address and port
server_socket.bind(('localhost', 8080))

# Listen for connections (three-way handshake happens here)
server_socket.listen(5)
print("Server listening on port 8080...")

while True:
    # Accept connection (completes handshake)
    client_socket, client_address = server_socket.accept()
    print(f"Connection from {client_address}")

    # Send data
    client_socket.send(b"Hello from TCP server!")

    # Close connection (four-way handshake)
    client_socket.close()`;
