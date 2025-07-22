#!/usr/bin/env python3
"""
DNS Simulator for SMTP Demonstration

This service simulates DNS MX record resolution for SMTP demonstration.
It provides a simple DNS server that responds to MX queries for demonstration domains.

Features demonstrated:
- MX record resolution for email routing
- DNS query/response protocol basics
- Priority-based mail server selection
- Integration with SMTP delivery process
"""
import socket
import threading
import time
import os
import signal
import sys
from shared_smtp_utils import log_message, simulate_mx_lookup


class DNSSimulator:
    """Simple DNS server for MX record demonstration"""

    def __init__(self, host="0.0.0.0", port=53):
        self.host = host
        self.port = port
        self.running = False
        self.sock = None
        self.stats = {
            "queries_received": 0,
            "mx_queries": 0,
            "responses_sent": 0,
            "errors": 0,
        }

        # Define MX records for demonstration
        self.mx_records = {
            "example.com": [(10, "smtp-server.example.com")],
            "company.com": [(5, "mail1.company.com"), (10, "mail2.company.com")],
            "university.edu": [
                (10, "mail.university.edu"),
                (20, "backup.university.edu"),
            ],
            "gmail.com": [(5, "gmail-smtp-in.l.google.com")],
            "test.com": [(10, "smtp-server.test.com")],
        }

    def setup_signal_handlers(self):
        """Handle graceful shutdown"""

        def signal_handler(signum, frame):
            log_message("DNS-SIMULATOR", f"Received signal {signum}, shutting down...")
            self.stop()
            sys.exit(0)

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    def start(self):
        """Start the DNS simulator"""
        self.setup_signal_handlers()
        self.running = True

        log_message("DNS-SIMULATOR", "🎯 DNS MX Record Simulator Starting")
        log_message("DNS-SIMULATOR", f"Listening on {self.host}:{self.port}")
        log_message(
            "DNS-SIMULATOR", "📋 Providing MX records for email routing demonstration"
        )

        try:
            # Create UDP socket for DNS
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            self.sock.bind((self.host, self.port))

            log_message("DNS-SIMULATOR", "🚀 DNS simulator ready")
            log_message(
                "DNS-SIMULATOR",
                f"📧 Configured domains: {list(self.mx_records.keys())}",
            )

            # Start stats reporting
            stats_thread = threading.Thread(target=self._stats_reporter, daemon=True)
            stats_thread.start()

            # Main DNS query processing loop
            while self.running:
                try:
                    # Receive DNS query
                    data, client_addr = self.sock.recvfrom(512)

                    if not self.running:
                        break

                    self.stats["queries_received"] += 1
                    log_message(
                        "DNS-SIMULATOR",
                        f"📥 DNS query from {client_addr[0]}:{client_addr[1]}",
                    )

                    # Process the query (simplified)
                    response = self._process_dns_query(data, client_addr)

                    if response:
                        # Send response
                        self.sock.sendto(response, client_addr)
                        self.stats["responses_sent"] += 1
                        log_message(
                            "DNS-SIMULATOR",
                            f"📤 Sent DNS response to {client_addr[0]}:{client_addr[1]}",
                        )

                except socket.timeout:
                    continue
                except socket.error as e:
                    if self.running:
                        log_message("DNS-SIMULATOR", f"❌ Socket error: {e}", "ERROR")
                        self.stats["errors"] += 1
                except Exception as e:
                    if self.running:
                        log_message(
                            "DNS-SIMULATOR", f"❌ Error processing query: {e}", "ERROR"
                        )
                        self.stats["errors"] += 1

        except Exception as e:
            log_message(
                "DNS-SIMULATOR", f"❌ Failed to start DNS simulator: {e}", "ERROR"
            )
        finally:
            self.stop()

    def _process_dns_query(self, data: bytes, client_addr: tuple) -> bytes:
        """Process DNS query and return response (simplified implementation)"""
        try:
            # This is a very simplified DNS query processor
            # In a real implementation, you'd parse the DNS protocol properly

            # For demonstration, we'll just look for domain names in the query
            query_str = data.decode("utf-8", errors="ignore").lower()

            # Check for MX queries
            for domain in self.mx_records.keys():
                if domain in query_str:
                    log_message("DNS-SIMULATOR", f"🔍 MX query detected for: {domain}")
                    self.stats["mx_queries"] += 1

                    # Get MX records for this domain
                    mx_records = self.mx_records[domain]

                    log_message(
                        "DNS-SIMULATOR",
                        f"📋 Found {len(mx_records)} MX record(s) for {domain}:",
                    )
                    for priority, server in mx_records:
                        log_message(
                            "DNS-SIMULATOR", f"   Priority {priority}: {server}"
                        )

                    # Create a simple response (not proper DNS format, just for demo)
                    response_text = f"MX:{domain}:"
                    for priority, server in mx_records:
                        response_text += f"{priority},{server};"

                    return response_text.encode("utf-8")

            # If no MX record found
            log_message("DNS-SIMULATOR", "❓ No MX records found for query", "WARN")
            return b"NXDOMAIN"

        except Exception as e:
            log_message("DNS-SIMULATOR", f"❌ Error processing DNS query: {e}", "ERROR")
            return None

    def _stats_reporter(self):
        """Report DNS statistics periodically"""
        while self.running:
            time.sleep(20)  # Report every 20 seconds

            if self.stats["queries_received"] > 0:
                log_message("DNS-SIMULATOR", "📊 DNS Simulator Statistics:")
                log_message(
                    "DNS-SIMULATOR",
                    f"   🔍 Total queries received: {self.stats['queries_received']}",
                )
                log_message(
                    "DNS-SIMULATOR",
                    f"   📧 MX queries processed: {self.stats['mx_queries']}",
                )
                log_message(
                    "DNS-SIMULATOR",
                    f"   📤 Responses sent: {self.stats['responses_sent']}",
                )
                log_message("DNS-SIMULATOR", f"   ❌ Errors: {self.stats['errors']}")

                # Show configured domains
                log_message("DNS-SIMULATOR", "📋 Available MX records:")
                for domain, records in self.mx_records.items():
                    servers = ", ".join([f"{srv}({pri})" for pri, srv in records])
                    log_message("DNS-SIMULATOR", f"   {domain}: {servers}")

    def demonstrate_mx_resolution(self):
        """Demonstrate MX resolution process"""
        log_message("DNS-SIMULATOR", "🧪 Demonstrating MX record resolution")

        for domain in self.mx_records.keys():
            log_message("DNS-SIMULATOR", f"📧 Domain: {domain}")
            mx_records = simulate_mx_lookup(domain)

            for priority, server in mx_records:
                log_message("DNS-SIMULATOR", f"   MX {priority} {server}")

            # Simulate selection process
            if mx_records:
                best_priority, best_server = min(mx_records, key=lambda x: x[0])
                log_message(
                    "DNS-SIMULATOR",
                    f"   ✅ Selected: {best_server} (priority {best_priority})",
                )

            time.sleep(1)

    def stop(self):
        """Stop the DNS simulator"""
        log_message("DNS-SIMULATOR", "🛑 Shutting down DNS simulator...")
        self.running = False

        if self.sock:
            try:
                self.sock.close()
                log_message("DNS-SIMULATOR", "🔌 DNS socket closed")
            except:
                pass


def main():
    port = int(os.getenv("DNS_PORT", 53))
    domain = os.getenv("DOMAIN", "example.com")
    mx_server = os.getenv("MX_SERVER", "smtp-server")

    log_message("DNS-SIMULATOR", "🎯 DNS MX Record Simulator")
    log_message("DNS-SIMULATOR", "Demonstrating: MX record resolution for SMTP routing")
    log_message("DNS-SIMULATOR", f"Primary domain: {domain} -> {mx_server}")

    simulator = DNSSimulator(port=port)

    try:
        # Add custom MX record from environment
        if domain and mx_server:
            simulator.mx_records[domain] = [(10, f"{mx_server}.{domain}")]
            log_message(
                "DNS-SIMULATOR", f"📧 Added MX record: {domain} -> {mx_server}.{domain}"
            )

        # Demonstrate MX resolution before starting server
        simulator.demonstrate_mx_resolution()

        # Start the DNS simulator
        simulator.start()

    except KeyboardInterrupt:
        log_message("DNS-SIMULATOR", "❌ Interrupted by user")
    except Exception as e:
        log_message("DNS-SIMULATOR", f"❌ Unexpected error: {e}", "ERROR")
    finally:
        simulator.stop()
        log_message("DNS-SIMULATOR", "🏁 DNS simulator shutdown complete")


if __name__ == "__main__":
    main()
