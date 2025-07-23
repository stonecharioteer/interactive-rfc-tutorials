"""Shared utilities for SMTP demonstration"""
import time
import hashlib
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime


def log_message(component: str, message: str, level: str = "INFO"):
    """Consistent logging format across all SMTP components"""
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {component:12} {level:5} | {message}")


@dataclass
class EmailMessage:
    """Represents an email message"""

    message_id: str
    sender: str
    recipients: List[str]
    subject: str
    body: str
    timestamp: datetime
    received_timestamp: Optional[datetime] = None
    smtp_commands: List[str] = None
    smtp_responses: List[str] = None

    def __post_init__(self):
        if self.smtp_commands is None:
            self.smtp_commands = []
        if self.smtp_responses is None:
            self.smtp_responses = []

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
        data = asdict(self)
        # Convert datetime objects to strings
        data["timestamp"] = self.timestamp.isoformat() if self.timestamp else None
        data["received_timestamp"] = (
            self.received_timestamp.isoformat() if self.received_timestamp else None
        )
        return data

    @classmethod
    def from_dict(cls, data: Dict) -> "EmailMessage":
        """Create from dictionary"""
        # Convert string timestamps back to datetime
        if data.get("timestamp"):
            data["timestamp"] = datetime.fromisoformat(data["timestamp"])
        if data.get("received_timestamp"):
            data["received_timestamp"] = datetime.fromisoformat(
                data["received_timestamp"]
            )
        return cls(**data)


def generate_message_id(sender: str, timestamp: datetime) -> str:
    """Generate a unique message ID"""
    unique_string = f"{sender}{timestamp.isoformat()}"
    hash_object = hashlib.md5(unique_string.encode())
    return f"{hash_object.hexdigest()[:8]}@example.com"


def parse_email_address(address: str) -> tuple[str, str]:
    """Parse email address into local and domain parts"""
    if "@" in address:
        local, domain = address.split("@", 1)
        return local.strip(), domain.strip()
    return address.strip(), ""


def format_smtp_response(code: int, message: str) -> str:
    """Format SMTP response according to RFC 821"""
    return f"{code} {message}"


def parse_smtp_command(command_line: str) -> tuple[str, str]:
    """Parse SMTP command line into command and arguments"""
    parts = command_line.strip().split(" ", 1)
    command = parts[0].upper()
    args = parts[1] if len(parts) > 1 else ""
    return command, args


def validate_email_address(email: str) -> bool:
    """Basic email address validation"""
    if "@" not in email:
        return False

    local, domain = parse_email_address(email)

    # Basic checks
    if not local or not domain:
        return False

    if len(local) > 64 or len(domain) > 255:
        return False

    # Check for basic invalid characters (simplified)
    invalid_chars = ["<", ">", "(", ")", "[", "]", "\\", ",", ";", ":", '"']
    for char in invalid_chars:
        if char in local:
            return False

    return True


def create_sample_emails() -> List[EmailMessage]:
    """Create sample email messages for demonstration"""
    now = datetime.now()

    emails = [
        EmailMessage(
            message_id=generate_message_id("alice@company.com", now),
            sender="alice@company.com",
            recipients=["bob@university.edu"],
            subject="Welcome to SMTP Demonstration",
            body="This is the first test email to demonstrate SMTP protocol concepts.\n\nBest regards,\nAlice",
            timestamp=now,
        ),
        EmailMessage(
            message_id=generate_message_id("system@company.com", now),
            sender="system@company.com",
            recipients=["admin@university.edu", "support@university.edu"],
            subject="System Status Report",
            body="Daily system status:\n- All services operational\n- Mail queue: empty\n- Network: stable\n\nAutomated message.",
            timestamp=now,
        ),
        EmailMessage(
            message_id=generate_message_id("alice@company.com", now),
            sender="alice@company.com",
            recipients=["charlie@university.edu"],
            subject="Re: RFC 821 Implementation",
            body="Hi Charlie,\n\nThe SMTP implementation is working great! You can see the store-and-forward mechanism in action.\n\nThis demonstrates:\n- HELO/EHLO commands\n- MAIL FROM validation\n- RCPT TO handling\n- DATA transmission\n- Proper response codes\n\nCheers,\nAlice",
            timestamp=now,
        ),
        EmailMessage(
            message_id=generate_message_id("marketing@company.com", now),
            sender="marketing@company.com",
            recipients=["team@university.edu"],
            subject="SMTP Protocol Deep Dive",
            body="Subject: Understanding Email Delivery\n\nSMTP (Simple Mail Transfer Protocol) is fascinating because:\n\n1. Text-based protocol - human readable\n2. Store and forward architecture\n3. MX record resolution for routing\n4. Built-in retry mechanisms\n5. Extensible design (ESMTP)\n\nThis email demonstrates the DATA command in action!\n\n--\nMarketing Team",
            timestamp=now,
        ),
        EmailMessage(
            message_id=generate_message_id("test@company.com", now),
            sender="test@company.com",
            recipients=["demo@university.edu"],
            subject="Testing Unicode and Special Characters: 🚀📧✨",
            body="This email tests handling of:\n\n• Unicode characters: àáâãäå\n• Emojis: 🌟💌📨📬📫\n• Special symbols: ©®™€£¥\n• Line breaks and formatting\n\nModern SMTP implementations handle international content well!\n\n测试中文\nПроверка русского\nテスト日本語",
            timestamp=now,
        ),
    ]

    return emails


class SMTPResponseCodes:
    """SMTP response codes from RFC 821"""

    # 2xx Success
    SERVICE_READY = 220
    CLOSING = 221
    OK = 250
    USER_NOT_LOCAL = 251
    CANNOT_VERIFY = 252

    # 3xx Intermediate
    START_MAIL_INPUT = 354

    # 4xx Temporary Failure
    SERVICE_NOT_AVAILABLE = 421
    MAILBOX_BUSY = 450
    LOCAL_ERROR = 451
    INSUFFICIENT_STORAGE = 452

    # 5xx Permanent Failure
    SYNTAX_ERROR = 500
    PARAMETER_ERROR = 501
    COMMAND_NOT_IMPLEMENTED = 502
    BAD_SEQUENCE = 503
    PARAMETER_NOT_IMPLEMENTED = 504
    MAILBOX_UNAVAILABLE = 550
    USER_NOT_LOCAL_PERM = 551
    EXCEEDED_STORAGE = 552
    MAILBOX_NAME_NOT_ALLOWED = 553
    TRANSACTION_FAILED = 554


def get_smtp_response_description(code: int) -> str:
    """Get human-readable description of SMTP response code"""
    descriptions = {
        220: "Service ready",
        221: "Service closing transmission channel",
        250: "Requested mail action okay, completed",
        251: "User not local; will forward",
        252: "Cannot verify user, but will accept message",
        354: "Start mail input; end with <CRLF>.<CRLF>",
        421: "Service not available, closing transmission channel",
        450: "Requested mail action not taken: mailbox unavailable",
        451: "Requested action aborted: local error in processing",
        452: "Requested action not taken: insufficient system storage",
        500: "Syntax error, command unrecognized",
        501: "Syntax error in parameters or arguments",
        502: "Command not implemented",
        503: "Bad sequence of commands",
        504: "Command parameter not implemented",
        550: "Requested action not taken: mailbox unavailable",
        551: "User not local; please try forwarding",
        552: "Requested mail action aborted: exceeded storage allocation",
        553: "Requested action not taken: mailbox name not allowed",
        554: "Transaction failed",
    }
    return descriptions.get(code, f"Unknown response code: {code}")


def format_email_for_display(email: EmailMessage) -> str:
    """Format email message for display"""
    lines = [
        f"Message-ID: {email.message_id}",
        f"From: {email.sender}",
        f"To: {', '.join(email.recipients)}",
        f"Subject: {email.subject}",
        f"Date: {email.timestamp.strftime('%a, %d %b %Y %H:%M:%S %z') if email.timestamp else 'Unknown'}",
        "",  # Empty line before body
    ]

    # Add body lines
    lines.extend(email.body.split("\n"))

    return "\n".join(lines)


def simulate_mx_lookup(domain: str) -> List[tuple[int, str]]:
    """Simulate MX record lookup for demonstration"""
    mx_records = {
        "example.com": [(10, "smtp-server.example.com")],
        "university.edu": [(10, "mail.university.edu"), (20, "backup.university.edu")],
        "company.com": [(5, "mail1.company.com"), (10, "mail2.company.com")],
        "gmail.com": [
            (5, "gmail-smtp-in.l.google.com"),
            (10, "alt1.gmail-smtp-in.l.google.com"),
        ],
    }

    return mx_records.get(domain, [(10, f"mail.{domain}")])


def format_mx_records(mx_records: List[tuple[int, str]]) -> str:
    """Format MX records for display"""
    if not mx_records:
        return "No MX records found"

    lines = []
    for priority, server in sorted(mx_records):
        lines.append(f"  {priority:2d} {server}")

    return "\n".join(lines)
