#!/usr/bin/env python3
"""
RFC 821 SMTP Client Demonstration

This client demonstrates SMTP protocol concepts:
- DNS MX record resolution
- SMTP command sequence (HELLO, MAIL FROM, RCPT TO, DATA)
- Response code handling (2xx, 3xx, 4xx, 5xx)
- Message formatting and transmission
- Error handling and retries
"""
import smtplib
import time
import os
import sys
import socket
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from shared_smtp_utils import (
    log_message,
    EmailMessage,
    create_sample_emails,
    simulate_mx_lookup,
    format_mx_records,
)


class RFC821SMTPClient:
    """SMTP client demonstrating RFC 821 concepts"""

    def __init__(self, smtp_host="smtp-server", smtp_port=25):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.stats = {
            "emails_sent": 0,
            "emails_failed": 0,
            "mx_lookups": 0,
            "connections": 0,
            "connection_failures": 0,
        }

    def demonstrate_mx_lookup(self, recipient_email: str) -> tuple[str, int]:
        """Demonstrate MX record lookup process"""
        log_message("SMTP-CLIENT", f"🔍 Performing MX lookup for {recipient_email}")

        if "@" not in recipient_email:
            log_message(
                "SMTP-CLIENT", f"❌ Invalid email format: {recipient_email}", "ERROR"
            )
            return None, None

        domain = recipient_email.split("@")[1]
        self.stats["mx_lookups"] += 1

        # Simulate DNS MX lookup
        mx_records = simulate_mx_lookup(domain)
        log_message("SMTP-CLIENT", f"📋 MX records for {domain}:")
        log_message("SMTP-CLIENT", f"\n{format_mx_records(mx_records)}")

        # Choose the highest priority (lowest number) MX record
        if mx_records:
            priority, mx_server = min(mx_records, key=lambda x: x[0])
            log_message(
                "SMTP-CLIENT",
                f"✅ Selected MX server: {mx_server} (priority {priority})",
            )

            # For our demonstration, map to our server
            if mx_server.endswith(".example.com") or domain == "example.com":
                return self.smtp_host, self.smtp_port
            else:
                # In real implementation, would use the actual MX server
                log_message(
                    "SMTP-CLIENT",
                    f"📍 Using demonstration server instead of {mx_server}",
                )
                return self.smtp_host, self.smtp_port

        log_message("SMTP-CLIENT", f"❌ No MX records found for {domain}", "WARN")
        return None, None

    def send_email_raw_smtp(self, email: EmailMessage) -> bool:
        """Send email using raw SMTP commands to demonstrate protocol"""
        log_message("SMTP-CLIENT", f"📧 Sending email: '{email.subject}'")
        log_message("SMTP-CLIENT", f"   From: {email.sender}")
        log_message("SMTP-CLIENT", f"   To: {', '.join(email.recipients)}")

        try:
            # Demonstrate MX lookup for first recipient
            if email.recipients:
                mx_host, mx_port = self.demonstrate_mx_lookup(email.recipients[0])
                if not mx_host:
                    return False
            else:
                mx_host, mx_port = self.smtp_host, self.smtp_port

            # Connect to SMTP server
            log_message("SMTP-CLIENT", f"🔌 Connecting to {mx_host}:{mx_port}")
            server = smtplib.SMTP()
            server.set_debuglevel(1)  # Enable debug output

            # Connect
            connection_start = time.time()
            server.connect(mx_host, mx_port)
            connection_time = (time.time() - connection_start) * 1000

            self.stats["connections"] += 1
            log_message("SMTP-CLIENT", f"✅ Connected in {connection_time:.2f}ms")

            # HELLO command
            log_message("SMTP-CLIENT", "🤝 Sending HELLO command")
            server.hello("smtp-client.company.com")

            # Demonstrate the full SMTP transaction
            log_message("SMTP-CLIENT", "📨 Starting SMTP transaction")

            # MAIL FROM
            log_message("SMTP-CLIENT", f"📤 MAIL FROM: {email.sender}")

            # RCPT TO (for each recipient)
            for recipient in email.recipients:
                log_message("SMTP-CLIENT", f"📥 RCPT TO: {recipient}")

            # Format message
            message = self._format_message(email)

            # Send the email
            send_start = time.time()
            server.sendmail(email.sender, email.recipients, message)
            send_time = (time.time() - send_start) * 1000

            log_message(
                "SMTP-CLIENT", f"✅ Email sent successfully in {send_time:.2f}ms"
            )
            log_message("SMTP-CLIENT", f"📊 Message size: {len(message)} bytes")

            # QUIT
            server.quit()
            log_message("SMTP-CLIENT", "👋 SMTP session closed with QUIT")

            self.stats["emails_sent"] += 1
            return True

        except smtplib.SMTPException as e:
            log_message("SMTP-CLIENT", f"❌ SMTP error: {e}", "ERROR")
            self.stats["emails_failed"] += 1
            return False
        except socket.error as e:
            log_message("SMTP-CLIENT", f"❌ Connection error: {e}", "ERROR")
            self.stats["connection_failures"] += 1
            return False
        except Exception as e:
            log_message("SMTP-CLIENT", f"❌ Unexpected error: {e}", "ERROR")
            self.stats["emails_failed"] += 1
            return False

    def _format_message(self, email: EmailMessage) -> str:
        """Format email message according to RFC standards"""
        # Create multipart message
        msg = MIMEMultipart()
        msg["From"] = email.sender
        msg["To"] = ", ".join(email.recipients)
        msg["Subject"] = email.subject
        msg["Date"] = (
            email.timestamp.strftime("%a, %d %b %Y %H:%M:%S %z")
            if email.timestamp
            else ""
        )
        msg["Message-ID"] = email.message_id

        # Add body
        body = MIMEText(email.body, "plain", "utf-8")
        msg.attach(body)

        # Add custom headers to demonstrate RFC concepts
        msg["X-Mailer"] = "RFC821-Demo-Client/1.0"
        msg["X-SMTP-Demo"] = "This email demonstrates RFC 821 concepts"

        return msg.as_string()

    def demonstrate_smtp_responses(self):
        """Demonstrate different SMTP response scenarios"""
        log_message("SMTP-CLIENT", "🔍 Demonstrating SMTP response codes")

        test_cases = [
            ("valid@example.com", "Should succeed with 250 OK"),
            ("invalid-format", "Should fail with 550 Invalid format"),
            (
                "toolongusernamethatexceedslimits@example.com",
                "May fail with validation error",
            ),
        ]

        for email_addr, expected in test_cases:
            log_message("SMTP-CLIENT", f"🧪 Testing: {email_addr} - {expected}")

            # Create test email
            test_email = EmailMessage(
                message_id=f"test-{int(time.time())}@company.com",
                sender="test@company.com",
                recipients=[email_addr],
                subject=f"SMTP Response Test - {email_addr}",
                body=f"This is a test email to demonstrate SMTP response handling.\n\nTesting recipient: {email_addr}\nExpected: {expected}",
                timestamp=datetime.now(),
            )

            # Try to send
            success = self.send_email_raw_smtp(test_email)
            result = "✅ SUCCESS" if success else "❌ FAILED"
            log_message("SMTP-CLIENT", f"🎯 Result: {result}")

            # Small delay between tests
            time.sleep(1)

    def send_sample_emails(self, count: int = 5, delay: float = 3.0):
        """Send a series of sample emails to demonstrate SMTP concepts"""
        log_message(
            "SMTP-CLIENT", f"📧 Sending {count} sample emails with {delay}s delay"
        )

        sample_emails = create_sample_emails()

        for i in range(count):
            # Use sample emails cyclically
            email = sample_emails[i % len(sample_emails)]

            # Modify for demonstration
            email.timestamp = datetime.now()
            email.message_id = f"demo-{i+1}-{int(time.time())}@company.com"

            log_message("SMTP-CLIENT", f"📨 Sending email {i+1}/{count}")

            # Send the email
            success = self.send_email_raw_smtp(email)

            if success:
                log_message("SMTP-CLIENT", f"✅ Email {i+1} sent successfully")
            else:
                log_message("SMTP-CLIENT", f"❌ Email {i+1} failed", "ERROR")

            # Demonstrate different sending patterns
            if i == count // 2:
                log_message(
                    "SMTP-CLIENT", "⚡ Demonstrating burst sending (reduced delay)"
                )
                actual_delay = delay / 3
            else:
                actual_delay = delay

            # Wait before next email (except for last)
            if i < count - 1:
                log_message(
                    "SMTP-CLIENT", f"⏳ Waiting {actual_delay}s before next email"
                )
                time.sleep(actual_delay)

    def print_statistics(self):
        """Print client statistics"""
        log_message("SMTP-CLIENT", "📊 SMTP Client Statistics:")
        log_message(
            "SMTP-CLIENT",
            f"   📧 Emails sent successfully: {self.stats['emails_sent']}",
        )
        log_message(
            "SMTP-CLIENT", f"   ❌ Emails failed: {self.stats['emails_failed']}"
        )
        log_message(
            "SMTP-CLIENT", f"   🔍 MX lookups performed: {self.stats['mx_lookups']}"
        )
        log_message(
            "SMTP-CLIENT", f"   🔌 SMTP connections: {self.stats['connections']}"
        )
        log_message(
            "SMTP-CLIENT",
            f"   💥 Connection failures: {self.stats['connection_failures']}",
        )

        if self.stats["emails_sent"] + self.stats["emails_failed"] > 0:
            total = self.stats["emails_sent"] + self.stats["emails_failed"]
            success_rate = (self.stats["emails_sent"] / total) * 100
            log_message("SMTP-CLIENT", f"   📈 Success rate: {success_rate:.1f}%")


def main():
    smtp_host = os.getenv("SMTP_HOST", "smtp-server")
    smtp_port = int(os.getenv("SMTP_PORT", 25))
    email_count = int(os.getenv("EMAIL_COUNT", 5))
    delay_seconds = float(os.getenv("DELAY_SECONDS", 3.0))

    log_message("SMTP-CLIENT", "🎯 RFC 821 SMTP Client Demonstration")
    log_message(
        "SMTP-CLIENT", "Demonstrating: MX lookup, SMTP commands, response handling"
    )
    log_message("SMTP-CLIENT", f"Target server: {smtp_host}:{smtp_port}")

    client = RFC821SMTPClient(smtp_host, smtp_port)

    try:
        # Wait for server to be ready
        log_message("SMTP-CLIENT", "⏳ Waiting for SMTP server to be ready...")
        time.sleep(5)

        # Test basic connectivity
        log_message("SMTP-CLIENT", "🔍 Testing SMTP server connectivity...")
        try:
            sock = socket.create_connection((smtp_host, smtp_port), timeout=10)
            sock.close()
            log_message("SMTP-CLIENT", "✅ SMTP server is reachable")
        except Exception as e:
            log_message("SMTP-CLIENT", f"❌ Cannot reach SMTP server: {e}", "ERROR")
            sys.exit(1)

        # Send sample emails
        client.send_sample_emails(email_count, delay_seconds)

        # Demonstrate different response scenarios
        log_message("SMTP-CLIENT", "🧪 Demonstrating SMTP response scenarios...")
        time.sleep(2)
        client.demonstrate_smtp_responses()

        # Keep connection alive for a bit to show persistence
        log_message(
            "SMTP-CLIENT", "⏳ Demonstration complete, keeping client alive briefly..."
        )
        time.sleep(10)

    except KeyboardInterrupt:
        log_message("SMTP-CLIENT", "❌ Interrupted by user")
    except Exception as e:
        log_message("SMTP-CLIENT", f"❌ Unexpected error: {e}", "ERROR")
    finally:
        client.print_statistics()
        log_message("SMTP-CLIENT", "🏁 SMTP client demonstration completed")


if __name__ == "__main__":
    main()
