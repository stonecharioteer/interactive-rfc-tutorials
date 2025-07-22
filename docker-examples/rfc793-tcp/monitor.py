#!/usr/bin/env python3
"""
RFC 793 TCP Network Monitor

This monitor demonstrates:
- Network traffic observation
- TCP packet flow analysis
- Connection state monitoring
- Performance metrics collection
"""
import subprocess
import time
import threading
import signal
import sys
import re
from collections import defaultdict
from shared_utils import log_message


class TCPMonitor:
    def __init__(self):
        self.running = False
        self.stats = defaultdict(int)
        self.connections = {}

    def setup_signal_handlers(self):
        """Handle graceful shutdown"""

        def signal_handler(signum, frame):
            log_message("TCP-MONITOR", f"Received signal {signum}, shutting down...")
            self.shutdown()
            sys.exit(0)

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    def start_monitoring(self):
        """Start monitoring TCP connections"""
        self.setup_signal_handlers()
        self.running = True

        log_message("TCP-MONITOR", "🔍 Starting TCP traffic monitoring")
        log_message("TCP-MONITOR", "Monitoring TCP packets between client and server")

        # Start different monitoring threads
        threads = [
            threading.Thread(target=self._monitor_netstat, daemon=True),
            threading.Thread(target=self._monitor_tcpdump, daemon=True),
            threading.Thread(target=self._report_stats, daemon=True),
        ]

        for thread in threads:
            thread.start()

        # Keep main thread alive
        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.shutdown()

    def _monitor_netstat(self):
        """Monitor active TCP connections using netstat"""
        while self.running:
            try:
                # Run netstat to get current TCP connections
                result = subprocess.run(
                    ["netstat", "-tn"], capture_output=True, text=True, timeout=5
                )

                if result.returncode == 0:
                    self._parse_netstat_output(result.stdout)

            except subprocess.TimeoutExpired:
                log_message("TCP-MONITOR", "⏰ netstat command timed out", "WARN")
            except Exception as e:
                log_message("TCP-MONITOR", f"❌ netstat monitoring error: {e}", "ERROR")

            time.sleep(5)  # Check every 5 seconds

    def _parse_netstat_output(self, output: str):
        """Parse netstat output to track TCP connections"""
        lines = output.strip().split("\n")
        current_connections = {}

        for line in lines[2:]:  # Skip headers
            if "tcp" not in line.lower():
                continue

            parts = line.split()
            if len(parts) >= 6:
                protocol = parts[0]
                local_addr = parts[3]
                remote_addr = parts[4]
                state = parts[5]

                # Focus on port 8080 connections
                if ":8080" in local_addr or ":8080" in remote_addr:
                    conn_key = f"{local_addr}<->{remote_addr}"
                    current_connections[conn_key] = {
                        "protocol": protocol,
                        "local": local_addr,
                        "remote": remote_addr,
                        "state": state,
                    }

                    # Track state changes
                    if conn_key not in self.connections:
                        log_message(
                            "TCP-MONITOR",
                            f"🔗 New connection: {local_addr} <-> {remote_addr} ({state})",
                        )
                        self.stats["connections_established"] += 1
                    elif self.connections.get(conn_key, {}).get("state") != state:
                        log_message(
                            "TCP-MONITOR",
                            f"🔄 State change: {conn_key} {self.connections[conn_key]['state']} -> {state}",
                        )
                        self.stats[f"state_{state.lower()}"] += 1

        # Check for closed connections
        for conn_key in self.connections:
            if conn_key not in current_connections:
                log_message("TCP-MONITOR", f"🔌 Connection closed: {conn_key}")
                self.stats["connections_closed"] += 1

        self.connections = current_connections

    def _monitor_tcpdump(self):
        """Monitor TCP packets using tcpdump"""
        while self.running:
            try:
                # Monitor TCP traffic on port 8080
                cmd = [
                    "tcpdump",
                    "-i",
                    "any",
                    "-n",
                    "port 8080",
                    "-c",
                    "100",  # Capture 100 packets then restart
                    "-tt",  # Print timestamps
                ]

                log_message("TCP-MONITOR", "🕵️ Starting packet capture on port 8080...")

                process = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    bufsize=1,
                )

                # Read output line by line
                for line in process.stdout:
                    if not self.running:
                        break

                    line = line.strip()
                    if line:
                        self._parse_tcpdump_line(line)

                process.wait()

            except FileNotFoundError:
                log_message(
                    "TCP-MONITOR",
                    "⚠️  tcpdump not available, skipping packet capture",
                    "WARN",
                )
                break
            except Exception as e:
                log_message("TCP-MONITOR", f"❌ tcpdump error: {e}", "ERROR")
                time.sleep(5)

    def _parse_tcpdump_line(self, line: str):
        """Parse tcpdump output to extract TCP information"""
        try:
            # Look for TCP flags and other interesting patterns
            if "Flags [" in line:
                self.stats["packets_captured"] += 1

                # Extract TCP flags
                flags_match = re.search(r"Flags \[([^\]]+)\]", line)
                if flags_match:
                    flags = flags_match.group(1)

                    # Count specific TCP operations
                    if "S" in flags and "." not in flags:  # SYN
                        log_message("TCP-MONITOR", f"📡 SYN packet: {line}")
                        self.stats["syn_packets"] += 1
                    elif "S" in flags and "." in flags:  # SYN-ACK
                        log_message("TCP-MONITOR", f"📡 SYN-ACK packet: {line}")
                        self.stats["synack_packets"] += 1
                    elif "F" in flags:  # FIN
                        log_message("TCP-MONITOR", f"📡 FIN packet: {line}")
                        self.stats["fin_packets"] += 1
                    elif "R" in flags:  # RST
                        log_message("TCP-MONITOR", f"📡 RST packet: {line}")
                        self.stats["rst_packets"] += 1
                    elif "." in flags:  # ACK (without other flags)
                        self.stats["ack_packets"] += 1
                        # Only log every 10th ACK to avoid spam
                        if self.stats["ack_packets"] % 10 == 0:
                            log_message(
                                "TCP-MONITOR",
                                f"📡 Data/ACK packets: {self.stats['ack_packets']} total",
                            )

                # Extract sequence and acknowledgment numbers
                seq_match = re.search(r"seq (\d+)", line)
                ack_match = re.search(r"ack (\d+)", line)

                if seq_match or ack_match:
                    seq_info = f"seq={seq_match.group(1)}" if seq_match else ""
                    ack_info = f"ack={ack_match.group(1)}" if ack_match else ""
                    seq_ack = f"{seq_info} {ack_info}".strip()

                    # Only log interesting sequence/ack changes
                    if self.stats["packets_captured"] % 5 == 0:
                        log_message("TCP-MONITOR", f"📊 TCP sequence info: {seq_ack}")

        except Exception as e:
            log_message("TCP-MONITOR", f"❌ Error parsing tcpdump line: {e}", "ERROR")

    def _report_stats(self):
        """Periodically report monitoring statistics"""
        while self.running:
            time.sleep(15)  # Report every 15 seconds

            if (
                self.stats["connections_established"] > 0
                or self.stats["packets_captured"] > 0
            ):
                log_message("TCP-MONITOR", "📊 Monitoring Statistics:")

                # Connection statistics
                if self.stats["connections_established"] > 0:
                    log_message(
                        "TCP-MONITOR",
                        f"   🔗 Connections established: {self.stats['connections_established']}",
                    )
                    log_message(
                        "TCP-MONITOR",
                        f"   🔌 Connections closed: {self.stats['connections_closed']}",
                    )
                    log_message(
                        "TCP-MONITOR",
                        f"   📈 Active connections: {len(self.connections)}",
                    )

                # Packet statistics
                if self.stats["packets_captured"] > 0:
                    log_message(
                        "TCP-MONITOR",
                        f"   📡 Total packets captured: {self.stats['packets_captured']}",
                    )
                    log_message(
                        "TCP-MONITOR", f"   🔄 SYN packets: {self.stats['syn_packets']}"
                    )
                    log_message(
                        "TCP-MONITOR",
                        f"   ✅ SYN-ACK packets: {self.stats['synack_packets']}",
                    )
                    log_message(
                        "TCP-MONITOR",
                        f"   📨 ACK/Data packets: {self.stats['ack_packets']}",
                    )
                    log_message(
                        "TCP-MONITOR", f"   🔚 FIN packets: {self.stats['fin_packets']}"
                    )
                    log_message(
                        "TCP-MONITOR", f"   ❌ RST packets: {self.stats['rst_packets']}"
                    )

                # Connection states
                state_keys = [k for k in self.stats.keys() if k.startswith("state_")]
                if state_keys:
                    log_message("TCP-MONITOR", "   📋 Connection states observed:")
                    for key in state_keys:
                        state = key.replace("state_", "").upper()
                        log_message(
                            "TCP-MONITOR", f"      {state}: {self.stats[key]} times"
                        )

                # Current connections
                if self.connections:
                    log_message("TCP-MONITOR", "   🔗 Current active connections:")
                    for conn_key, conn_info in self.connections.items():
                        log_message(
                            "TCP-MONITOR",
                            f"      {conn_info['local']} <-> {conn_info['remote']} ({conn_info['state']})",
                        )
            else:
                log_message("TCP-MONITOR", "⏳ Waiting for TCP activity to monitor...")

    def shutdown(self):
        """Shutdown the monitor"""
        log_message("TCP-MONITOR", "🛑 Shutting down TCP monitor...")
        self.running = False


def main():
    log_message("TCP-MONITOR", "🎯 RFC 793 TCP Network Monitor")
    log_message("TCP-MONITOR", "Monitoring TCP connections and packet flow")
    log_message(
        "TCP-MONITOR",
        "Observing: Connection establishment, data transfer, connection termination",
    )

    monitor = TCPMonitor()

    try:
        # Give other services time to start
        log_message("TCP-MONITOR", "⏳ Waiting for services to initialize...")
        time.sleep(5)

        monitor.start_monitoring()

    except KeyboardInterrupt:
        log_message("TCP-MONITOR", "❌ Interrupted by user")
    except Exception as e:
        log_message("TCP-MONITOR", f"❌ Unexpected error: {e}", "ERROR")
    finally:
        monitor.shutdown()
        log_message("TCP-MONITOR", "🏁 TCP monitoring completed")


if __name__ == "__main__":
    main()
