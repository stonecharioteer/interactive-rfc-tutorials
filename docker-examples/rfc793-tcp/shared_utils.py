"""Shared utilities for TCP demonstration"""
import socket
import struct
import time
from typing import Dict, Any


def log_message(component: str, message: str, level: str = "INFO"):
    """Consistent logging format across all components"""
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {component:12} {level:5} | {message}")


def get_tcp_info(sock: socket.socket) -> Dict[str, Any]:
    """Extract TCP connection information where available"""
    info = {
        "local_addr": sock.getsockname(),
        "peer_addr": None,
        "tcp_nodelay": None,
        "keepalive": None,
        "recv_buffer": None,
        "send_buffer": None,
    }

    try:
        info["peer_addr"] = sock.getpeername()
    except:
        pass

    try:
        info["tcp_nodelay"] = sock.getsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY)
    except:
        pass

    try:
        info["keepalive"] = sock.getsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE)
    except:
        pass

    try:
        info["recv_buffer"] = sock.getsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF)
        info["send_buffer"] = sock.getsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF)
    except:
        pass

    return info


def format_tcp_flags(flags: int) -> str:
    """Convert TCP flags to human-readable format"""
    flag_names = []
    if flags & 0x01:
        flag_names.append("FIN")
    if flags & 0x02:
        flag_names.append("SYN")
    if flags & 0x04:
        flag_names.append("RST")
    if flags & 0x08:
        flag_names.append("PSH")
    if flags & 0x10:
        flag_names.append("ACK")
    if flags & 0x20:
        flag_names.append("URG")
    if flags & 0x40:
        flag_names.append("ECE")
    if flags & 0x80:
        flag_names.append("CWR")

    return " | ".join(flag_names) if flag_names else "None"


def create_message_with_sequence(sequence: int, message: str) -> bytes:
    """Create a message with sequence number for tracking"""
    timestamp = int(time.time() * 1000000)  # microseconds
    header = struct.pack("!IQ", sequence, timestamp)  # Network byte order
    return header + message.encode("utf-8")


def parse_message_with_sequence(data: bytes) -> tuple[int, int, str]:
    """Parse message with sequence number"""
    if len(data) < 12:  # 4 bytes seq + 8 bytes timestamp
        return 0, 0, data.decode("utf-8", errors="ignore")

    sequence, timestamp = struct.unpack("!IQ", data[:12])
    message = data[12:].decode("utf-8", errors="ignore")
    return sequence, timestamp, message
