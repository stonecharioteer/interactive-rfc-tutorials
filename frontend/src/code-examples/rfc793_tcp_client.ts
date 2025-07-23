export const code = `import socket

# Create a TCP socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    # Connect to server (initiates three-way handshake)
    print("Initiating TCP handshake...")
    client_socket.connect(('localhost', 8080))
    print("✅ Connection established!")

    # Receive data
    response = client_socket.recv(1024)
    print(f"Received: {response.decode()}")

finally:
    # Close connection
    client_socket.close()
    print("Connection closed")`;
