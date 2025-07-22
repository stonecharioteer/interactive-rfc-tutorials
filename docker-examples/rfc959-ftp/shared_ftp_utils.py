"""Shared utilities for FTP demonstration"""
import time
import os
import hashlib
from typing import List, Optional
from dataclasses import dataclass
from datetime import datetime


def log_message(component: str, message: str, level: str = "INFO"):
    """Consistent logging format across all FTP components"""
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {component:12} {level:5} | {message}")


@dataclass
class FileTransfer:
    """Represents a file transfer operation"""

    filename: str
    size: int
    mode: str  # ASCII or BINARY
    direction: str  # UPLOAD or DOWNLOAD
    start_time: datetime
    end_time: Optional[datetime] = None
    bytes_transferred: int = 0
    success: bool = False

    @property
    def duration(self) -> float:
        """Transfer duration in seconds"""
        if self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        return 0.0

    @property
    def transfer_rate(self) -> float:
        """Transfer rate in bytes per second"""
        if self.duration > 0:
            return self.bytes_transferred / self.duration
        return 0.0


def format_file_size(size_bytes: int) -> str:
    """Format file size in human-readable format"""
    if size_bytes == 0:
        return "0 B"

    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    size = float(size_bytes)

    while size >= 1024.0 and i < len(size_names) - 1:
        size /= 1024.0
        i += 1

    return f"{size:.1f} {size_names[i]}"


def format_transfer_rate(rate_bps: float) -> str:
    """Format transfer rate in human-readable format"""
    return f"{format_file_size(int(rate_bps))}/s"


def calculate_file_hash(filepath: str) -> str:
    """Calculate MD5 hash of a file"""
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception:
        return "unknown"


def create_test_files(directory: str, count: int = 5) -> List[str]:
    """Create test files for FTP demonstration"""
    os.makedirs(directory, exist_ok=True)
    created_files = []

    file_templates = [
        {
            "name": "text_file_{}.txt",
            "content": "This is test file number {}.\nIt contains multiple lines of text.\nUsed to demonstrate ASCII mode transfer.\n\nLine {}: Hello, FTP world!\nLine {}: This demonstrates text file transfer.\nLine {}: ASCII mode converts line endings.\n",
            "mode": "text",
        },
        {
            "name": "config_{}.cfg",
            "content": "[FTP Demo Config {}]\nserver_name=RFC959-Demo\nport=21\nmax_connections=10\n\n# This file demonstrates\n# configuration file transfer\nlogging=enabled\npassive_mode=true\n",
            "mode": "text",
        },
        {
            "name": "data_{}.csv",
            "content": "ID,Name,Value,Timestamp\n{},Item{},100.50,2025-01-{}\n{},Item{},200.75,2025-01-{}\n{},Item{},300.25,2025-01-{}\n",
            "mode": "text",
        },
    ]

    for i in range(count):
        template = file_templates[i % len(file_templates)]
        filename = template["name"].format(i + 1)
        filepath = os.path.join(directory, filename)

        try:
            with open(filepath, "w") as f:
                if template["mode"] == "text":
                    content = template["content"].format(
                        i + 1,
                        i + 1,
                        i + 1,
                        i + 1,
                        i + 1,
                        i + 1,
                        i + 1,
                        (i % 28) + 1,
                        (i % 28) + 1,
                        (i % 28) + 1,
                        (i % 28) + 1,
                    )
                    f.write(content)

            created_files.append(filename)
            log_message(
                "FTP-UTILS",
                f"Created test file: {filename} ({format_file_size(os.path.getsize(filepath))})",
            )

        except Exception as e:
            log_message("FTP-UTILS", f"Error creating {filename}: {e}", "ERROR")

    # Create one binary test file
    if count > 0:
        binary_filename = f"binary_test_{count}.dat"
        binary_filepath = os.path.join(directory, binary_filename)
        try:
            with open(binary_filepath, "wb") as f:
                # Create binary data pattern
                for i in range(1024):
                    f.write(bytes([i % 256]))

            created_files.append(binary_filename)
            log_message(
                "FTP-UTILS",
                f"Created binary file: {binary_filename} ({format_file_size(os.path.getsize(binary_filepath))})",
            )

        except Exception as e:
            log_message("FTP-UTILS", f"Error creating binary file: {e}", "ERROR")

    return created_files


class FTPResponseCodes:
    """FTP response codes from RFC 959"""

    # 1xx Positive Preliminary Reply
    RESTART_MARKER = 110
    SERVICE_READY_SOON = 120
    DATA_CONNECTION_OPEN = 125
    FILE_STATUS_OK = 150

    # 2xx Positive Completion Reply
    OK = 200
    COMMAND_NOT_IMPLEMENTED = 202
    SYSTEM_STATUS = 211
    DIRECTORY_STATUS = 212
    FILE_STATUS = 213
    HELP_MESSAGE = 214
    NAME_SYSTEM_TYPE = 215
    SERVICE_READY = 220
    SERVICE_CLOSING = 221
    DATA_CONNECTION_OPEN_NO_TRANSFER = 225
    CLOSING_DATA_CONNECTION = 226
    ENTERING_PASSIVE_MODE = 227
    USER_LOGGED_IN = 230
    FILE_ACTION_OK = 250
    PATHNAME_CREATED = 257

    # 3xx Positive Intermediate Reply
    USER_NAME_OK = 331
    NEED_ACCOUNT = 332
    FILE_ACTION_PENDING = 350

    # 4xx Transient Negative Completion Reply
    SERVICE_NOT_AVAILABLE = 421
    CANNOT_OPEN_DATA_CONNECTION = 425
    CONNECTION_CLOSED = 426
    FILE_ACTION_NOT_TAKEN_FILE_BUSY = 450
    ACTION_ABORTED_LOCAL_ERROR = 451
    ACTION_NOT_TAKEN_INSUFFICIENT_STORAGE = 452

    # 5xx Permanent Negative Completion Reply
    SYNTAX_ERROR_UNRECOGNIZED_COMMAND = 500
    SYNTAX_ERROR_IN_PARAMETERS = 501
    COMMAND_NOT_IMPLEMENTED = 502
    BAD_SEQUENCE_OF_COMMANDS = 503
    COMMAND_NOT_IMPLEMENTED_FOR_PARAMETER = 504
    NOT_LOGGED_IN = 530
    NEED_ACCOUNT_FOR_STORING_FILES = 532
    FILE_ACTION_NOT_TAKEN_FILE_UNAVAILABLE = 550
    ACTION_ABORTED_PAGE_TYPE_UNKNOWN = 551
    FILE_ACTION_ABORTED_EXCEEDED_STORAGE = 552
    FILE_ACTION_NOT_TAKEN_FILE_NAME_NOT_ALLOWED = 553


def get_ftp_response_description(code: int) -> str:
    """Get human-readable description of FTP response code"""
    descriptions = {
        110: "Restart marker reply",
        120: "Service ready in nnn minutes",
        125: "Data connection already open; transfer starting",
        150: "File status okay; about to open data connection",
        200: "Command okay",
        202: "Command not implemented, superfluous at this site",
        211: "System status, or system help reply",
        212: "Directory status",
        213: "File status",
        214: "Help message",
        215: "NAME system type",
        220: "Service ready for new user",
        221: "Service closing control connection",
        225: "Data connection open; no transfer in progress",
        226: "Closing data connection. Requested file action successful",
        227: "Entering Passive Mode",
        230: "User logged in, proceed",
        250: "Requested file action okay, completed",
        257: "PATHNAME created",
        331: "User name okay, need password",
        332: "Need account for login",
        350: "Requested file action pending further information",
        421: "Service not available, closing control connection",
        425: "Can't open data connection",
        426: "Connection closed; transfer aborted",
        450: "Requested file action not taken. File unavailable",
        451: "Requested action aborted: local error in processing",
        452: "Requested action not taken. Insufficient storage space",
        500: "Syntax error, command unrecognized",
        501: "Syntax error in parameters or arguments",
        502: "Command not implemented",
        503: "Bad sequence of commands",
        504: "Command not implemented for that parameter",
        530: "Not logged in",
        532: "Need account for storing files",
        550: "Requested action not taken. File unavailable",
        551: "Requested action aborted: page type unknown",
        552: "Requested file action aborted. Exceeded storage allocation",
        553: "Requested action not taken. File name not allowed",
    }

    return descriptions.get(code, f"Unknown FTP response code: {code}")


def parse_ftp_response(response: str) -> tuple[int, str]:
    """Parse FTP response into code and message"""
    try:
        parts = response.strip().split(" ", 1)
        code = int(parts[0])
        message = parts[1] if len(parts) > 1 else ""
        return code, message
    except (ValueError, IndexError):
        return 0, response


def format_passive_response(ip: str, port: int) -> str:
    """Format passive mode response"""
    ip_parts = ip.split(".")
    port_high = port // 256
    port_low = port % 256
    return f"227 Entering Passive Mode ({','.join(ip_parts)},{port_high},{port_low})"
