#!/usr/bin/env python3
"""
RFC 793 TCP Client Demonstration

This client demonstrates:
- TCP connection establishment (three-way handshake)
- Reliable message delivery with sequence tracking
- Connection management and error handling
- Graceful shutdown (four-way handshake)
"""
import socket
import time
import os
import random
import sys
from shared_utils import (
    log_message,
    get_tcp_info,
    create_message_with_sequence,
    parse_message_with_sequence,
)


class TCPClient:
    def __init__(self, server_host="tcp-server", server_port=8080):
        self.server_host = server_host
        self.server_port = server_port
        self.client_socket = None
        self.stats = {
            "messages_sent": 0,
            "messages_received": 0,
            "bytes_sent": 0,
            "bytes_received": 0,
            "connection_failures": 0,
        }

    def connect(self) -> bool:
        """Establish TCP connection to server"""
        try:
            log_message(
                "TCP-CLIENT",
                f"🔄 Initiating TCP connection to {self.server_host}:{self.server_port}",
            )

            # Create TCP socket
            self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            # Configure socket options
            self.client_socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            self.client_socket.settimeout(10.0)  # 10 second timeout

            # Connect (triggers three-way handshake)
            start_time = time.time()
            self.client_socket.connect((self.server_host, self.server_port))
            connection_time = (time.time() - start_time) * 1000

            log_message(
                "TCP-CLIENT",
                f"✅ Three-way handshake completed in {connection_time:.2f}ms",
            )

            # Get connection details
            tcp_info = get_tcp_info(self.client_socket)
            log_message("TCP-CLIENT", f"📋 Connection established: {tcp_info}")

            return True

        except socket.timeout:
            log_message(
                "TCP-CLIENT",
                "❌ Connection timeout - server may be unavailable",
                "ERROR",
            )
            self.stats["connection_failures"] += 1
            return False
        except ConnectionRefusedError:
            log_message(
                "TCP-CLIENT", "❌ Connection refused - server not listening", "ERROR"
            )
            self.stats["connection_failures"] += 1
            return False
        except Exception as e:
            log_message("TCP-CLIENT", f"❌ Connection failed: {e}", "ERROR")
            self.stats["connection_failures"] += 1
            return False

    def send_messages(self, message_count: int = 5, delay: float = 2.0):
        """Send a series of messages to demonstrate TCP reliability"""
        if not self.client_socket:
            log_message("TCP-CLIENT", "❌ No connection established", "ERROR")
            return

        log_message(
            "TCP-CLIENT", f"📨 Sending {message_count} messages with {delay}s delay"
        )

        for i in range(1, message_count + 1):
            try:
                # Create message with variety
                messages = [
                    f"Hello from TCP client (message {i})",
                    f"Testing reliable delivery #{i}",
                    f"Sequence number demonstration {i}",
                    f"TCP flow control test {i}",
                    f"Connection state message {i}",
                ]

                message = random.choice(messages)
                message_data = create_message_with_sequence(i, message)

                # Send message
                log_message("TCP-CLIENT", f"📤 Sending seq={i}: '{message}'")
                send_start = time.time()
                bytes_sent = self.client_socket.send(message_data)
                send_time = (time.time() - send_start) * 1000

                self.stats["messages_sent"] += 1
                self.stats["bytes_sent"] += bytes_sent

                log_message(
                    "TCP-CLIENT", f"📊 Sent {bytes_sent} bytes in {send_time:.2f}ms"
                )

                # Wait for response
                try:
                    response_data = self.client_socket.recv(1024)
                    if response_data:
                        (
                            recv_seq,
                            recv_timestamp,
                            response_message,
                        ) = parse_message_with_sequence(response_data)

                        self.stats["messages_received"] += 1
                        self.stats["bytes_received"] += len(response_data)

                        log_message(
                            "TCP-CLIENT",
                            f"📨 Received seq={recv_seq}: '{response_message}'",
                        )
                    else:
                        log_message(
                            "TCP-CLIENT",
                            "🔌 Server closed connection unexpectedly",
                            "WARN",
                        )
                        break

                except socket.timeout:
                    log_message(
                        "TCP-CLIENT",
                        f"⏰ Timeout waiting for response to message {i}",
                        "WARN",
                    )

                # Demonstrate different sending patterns
                if i == message_count // 2:
                    log_message(
                        "TCP-CLIENT",
                        "⚡ Sending burst of messages to test flow control",
                    )
                    delay_override = 0.1
                else:
                    delay_override = delay

                # Wait before next message (except for last message)
                if i < message_count:
                    log_message(
                        "TCP-CLIENT",
                        f"⏳ Waiting {delay_override}s before next message",
                    )
                    time.sleep(delay_override)

            except socket.error as e:
                log_message(
                    "TCP-CLIENT", f"❌ Socket error on message {i}: {e}", "ERROR"
                )
                break
            except Exception as e:
                log_message(
                    "TCP-CLIENT", f"❌ Unexpected error on message {i}: {e}", "ERROR"
                )
                break

    def disconnect(self):
        """Gracefully disconnect from server"""
        if self.client_socket:
            try:
                log_message(
                    "TCP-CLIENT",
                    "🔄 Initiating graceful disconnect (four-way handshake)",
                )

                # Shutdown the connection
                self.client_socket.shutdown(socket.SHUT_WR)  # No more sending

                # Wait for server's FIN
                try:
                    final_data = self.client_socket.recv(1024)
                    if final_data:
                        log_message(
                            "TCP-CLIENT",
                            f"📨 Received final data: {len(final_data)} bytes",
                        )
                except socket.timeout:
                    log_message(
                        "TCP-CLIENT", "⏰ Timeout waiting for server FIN", "WARN"
                    )

                # Close socket
                self.client_socket.close()
                log_message(
                    "TCP-CLIENT", "✅ Four-way handshake completed, connection closed"
                )

            except Exception as e:
                log_message("TCP-CLIENT", f"❌ Error during disconnect: {e}", "WARN")
                try:
                    self.client_socket.close()
                except Exception:
                    pass
            finally:
                self.client_socket = None

    def print_stats(self):
        """Print final statistics"""
        log_message("TCP-CLIENT", "📊 Final Statistics:")
        log_message("TCP-CLIENT", f"   Messages sent: {self.stats['messages_sent']}")
        log_message(
            "TCP-CLIENT", f"   Messages received: {self.stats['messages_received']}"
        )
        log_message("TCP-CLIENT", f"   Bytes sent: {self.stats['bytes_sent']}")
        log_message("TCP-CLIENT", f"   Bytes received: {self.stats['bytes_received']}")
        log_message(
            "TCP-CLIENT", f"   Connection failures: {self.stats['connection_failures']}"
        )

        if self.stats["messages_sent"] > 0:
            success_rate = (
                self.stats["messages_received"] / self.stats["messages_sent"]
            ) * 100
            log_message("TCP-CLIENT", f"   Success rate: {success_rate:.1f}%")


def main():
    server_host = os.getenv("SERVER_HOST", "tcp-server")
    server_port = int(os.getenv("SERVER_PORT", 8080))
    message_count = int(os.getenv("MESSAGE_COUNT", 5))
    delay_seconds = float(os.getenv("DELAY_SECONDS", 2.0))

    log_message("TCP-CLIENT", "🎯 RFC 793 TCP Client Demonstration")
    log_message(
        "TCP-CLIENT",
        "Demonstrating: Connection establishment, reliable delivery, graceful shutdown",
    )

    client = TCPClient(server_host, server_port)

    try:
        # Wait a bit for server to be ready
        log_message("TCP-CLIENT", "⏳ Waiting for server to be ready...")
        time.sleep(3)

        # Connect to server
        if not client.connect():
            log_message("TCP-CLIENT", "❌ Failed to establish connection", "ERROR")
            sys.exit(1)

        # Send messages
        client.send_messages(message_count, delay_seconds)

        # Demonstrate connection persistence
        log_message(
            "TCP-CLIENT",
            "⏳ Demonstrating connection persistence (keeping connection alive)",
        )
        time.sleep(5)

    except KeyboardInterrupt:
        log_message("TCP-CLIENT", "❌ Interrupted by user")
    except Exception as e:
        log_message("TCP-CLIENT", f"❌ Unexpected error: {e}", "ERROR")
    finally:
        # Always disconnect gracefully
        client.disconnect()
        client.print_stats()
        log_message("TCP-CLIENT", "🏁 TCP client demonstration completed")


if __name__ == "__main__":
    main()
