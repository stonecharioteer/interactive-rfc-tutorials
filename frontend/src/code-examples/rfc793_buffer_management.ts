export const code = `import socket

# Create socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Check current buffer sizes
recv_buffer = sock.getsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF)
send_buffer = sock.getsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF)

print(f"Default receive buffer: {recv_buffer} bytes")
print(f"Default send buffer: {send_buffer} bytes")

# Set larger buffers for high-throughput applications
sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65536)  # 64KB
sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 65536)  # 64KB

print("Buffer sizes increased for better performance")`;
