#!/usr/bin/env python3
"""
RFC 793 TCP Server Demonstration

This server demonstrates key TCP concepts:
- Three-way handshake (connection establishment)
- Reliable data delivery with sequence numbers
- Flow control and congestion management
- Graceful connection termination
- Socket options and buffer management
"""
import socket
import threading
import time
import os
import signal
import sys
from shared_utils import (
    log_message,
    get_tcp_info,
    parse_message_with_sequence,
    create_message_with_sequence,
)


class TCPServer:
    def __init__(self, host="0.0.0.0", port=8080):
        self.host = host
        self.port = port
        self.server_socket = None
        self.clients = []
        self.running = False
        self.stats = {
            "connections_accepted": 0,
            "messages_received": 0,
            "messages_sent": 0,
            "bytes_received": 0,
            "bytes_sent": 0,
        }

    def setup_signal_handlers(self):
        """Handle graceful shutdown"""

        def signal_handler(signum, frame):
            log_message("TCP-SERVER", f"Received signal {signum}, shutting down...")
            self.shutdown()
            sys.exit(0)

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    def start(self):
        """Start the TCP server"""
        self.setup_signal_handlers()

        # Create TCP socket
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # Set socket options for demonstration
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)

        # Bind to address and port
        self.server_socket.bind((self.host, self.port))

        # Listen for connections
        self.server_socket.listen(5)
        self.running = True

        log_message("TCP-SERVER", f"🚀 Server started on {self.host}:{self.port}")
        log_message(
            "TCP-SERVER",
            f"📊 Socket buffer sizes - RCV: {self.server_socket.getsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF)}, SND: {self.server_socket.getsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF)}",
        )
        log_message(
            "TCP-SERVER", "🔄 Ready to accept TCP connections (three-way handshake)"
        )

        # Start stats reporting thread
        stats_thread = threading.Thread(target=self._stats_reporter, daemon=True)
        stats_thread.start()

        try:
            while self.running:
                try:
                    # Accept incoming connections
                    client_socket, client_address = self.server_socket.accept()
                    self.stats["connections_accepted"] += 1

                    log_message(
                        "TCP-SERVER",
                        f"✅ Three-way handshake completed with {client_address}",
                    )

                    # Get detailed TCP connection info
                    tcp_info = get_tcp_info(client_socket)
                    log_message("TCP-SERVER", f"📋 Connection details: {tcp_info}")

                    # Handle client in separate thread
                    client_thread = threading.Thread(
                        target=self._handle_client,
                        args=(client_socket, client_address),
                        daemon=True,
                    )
                    client_thread.start()

                    self.clients.append((client_socket, client_address))

                except socket.error as e:
                    if self.running:
                        log_message("TCP-SERVER", f"❌ Socket error: {e}", "ERROR")
                    break

        except KeyboardInterrupt:
            log_message("TCP-SERVER", "Received interrupt, shutting down...")
        finally:
            self.shutdown()

    def _handle_client(self, client_socket: socket.socket, client_address: tuple):
        """Handle individual client connection"""
        client_id = f"{client_address[0]}:{client_address[1]}"
        log_message("TCP-SERVER", f"🔗 Handling client {client_id}")

        try:
            # Configure client socket for demonstration
            client_socket.setsockopt(
                socket.IPPROTO_TCP, socket.TCP_NODELAY, 1
            )  # Disable Nagle

            sequence_counter = 0

            while self.running:
                try:
                    # Receive data from client
                    data = client_socket.recv(1024)

                    if not data:
                        log_message(
                            "TCP-SERVER",
                            f"🔌 Client {client_id} disconnected (FIN received)",
                        )
                        break

                    self.stats["messages_received"] += 1
                    self.stats["bytes_received"] += len(data)

                    # Parse message with sequence number
                    seq_num, timestamp, message = parse_message_with_sequence(data)
                    receive_time = int(time.time() * 1000000)
                    latency = receive_time - timestamp if timestamp > 0 else 0

                    log_message(
                        "TCP-SERVER",
                        f"📨 Received seq={seq_num}, latency={latency/1000:.2f}ms: '{message}'",
                    )

                    # Echo response with server sequence number
                    sequence_counter += 1
                    response = f"Echo: {message} (server_seq={sequence_counter})"
                    response_data = create_message_with_sequence(
                        sequence_counter, response
                    )

                    # Send response
                    bytes_sent = client_socket.send(response_data)
                    self.stats["messages_sent"] += 1
                    self.stats["bytes_sent"] += bytes_sent

                    log_message(
                        "TCP-SERVER",
                        f"📤 Sent seq={sequence_counter}, bytes={bytes_sent}: '{response}'",
                    )

                    # Demonstrate flow control - slow down if too many messages
                    if self.stats["messages_received"] % 10 == 0:
                        log_message(
                            "TCP-SERVER",
                            "⏳ Flow control: brief pause to demonstrate backpressure",
                        )
                        time.sleep(0.5)

                except socket.timeout:
                    continue
                except socket.error as e:
                    log_message(
                        "TCP-SERVER",
                        f"❌ Client {client_id} socket error: {e}",
                        "ERROR",
                    )
                    break

        except Exception as e:
            log_message(
                "TCP-SERVER", f"❌ Error handling client {client_id}: {e}", "ERROR"
            )
        finally:
            try:
                client_socket.close()
                log_message(
                    "TCP-SERVER",
                    f"🔌 Connection to {client_id} closed (four-way handshake)",
                )
            except:
                pass

    def _stats_reporter(self):
        """Report server statistics periodically"""
        while self.running:
            time.sleep(10)
            if self.stats["connections_accepted"] > 0:
                log_message(
                    "TCP-SERVER",
                    f"📊 Stats: {self.stats['connections_accepted']} connections, "
                    f"{self.stats['messages_received']} msgs received ({self.stats['bytes_received']} bytes), "
                    f"{self.stats['messages_sent']} msgs sent ({self.stats['bytes_sent']} bytes)",
                )

    def shutdown(self):
        """Gracefully shutdown the server"""
        log_message("TCP-SERVER", "🛑 Shutting down server...")
        self.running = False

        # Close all client connections
        for client_socket, client_address in self.clients:
            try:
                client_socket.close()
                log_message("TCP-SERVER", f"🔌 Closed connection to {client_address}")
            except:
                pass

        # Close server socket
        if self.server_socket:
            try:
                self.server_socket.close()
                log_message("TCP-SERVER", "🔌 Server socket closed")
            except:
                pass


def main():
    port = int(os.getenv("SERVER_PORT", 8080))

    log_message("TCP-SERVER", "🎯 RFC 793 TCP Server Demonstration")
    log_message(
        "TCP-SERVER",
        "Demonstrating: Three-way handshake, reliable delivery, flow control",
    )
    log_message("TCP-SERVER", f"Starting server on port {port}...")

    server = TCPServer(port=port)
    server.start()


if __name__ == "__main__":
    main()
