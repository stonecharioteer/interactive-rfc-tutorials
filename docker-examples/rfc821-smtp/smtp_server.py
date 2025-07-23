#!/usr/bin/env python3
"""
RFC 821 SMTP Server Demonstration

This server implements the core SMTP protocol as defined in RFC 821:
- HELO/EHLO - Client identification
- MAIL FROM - Sender specification
- RCPT TO - Recipient specification
- DATA - Message content transmission
- QUIT - Connection termination

Features demonstrated:
- Store and forward architecture
- Response codes (2xx, 3xx, 4xx, 5xx)
- Email queuing and storage
- Multiple recipient handling
- Basic validation and error handling
"""
import asyncio
import os
import json
import signal
import sys
from datetime import datetime
from pathlib import Path
from aiosmtpd.controller import Controller
from aiosmtpd.smtp import SMTP, Envelope
from shared_smtp_utils import (
    log_message,
    EmailMessage,
    generate_message_id,
    validate_email_address,
    format_email_for_display,
)


class RFC821SMTPHandler:
    """SMTP handler implementing RFC 821 concepts"""

    def __init__(self, mail_dir: str = "/var/mail"):
        self.mail_dir = Path(mail_dir)
        self.mail_dir.mkdir(exist_ok=True)
        self.stats = {
            "connections": 0,
            "messages_received": 0,
            "messages_stored": 0,
            "commands_processed": 0,
            "errors": 0,
        }
        self.active_sessions = {}

    async def handle_RCPT(
        self, server: SMTP, session, envelope: Envelope, address: str, rcpt_options
    ):
        """Handle RCPT TO command - specify message recipients"""
        log_message("SMTP-SERVER", f"📧 RCPT TO: {address}")

        # Validate email address format
        if not validate_email_address(address):
            log_message("SMTP-SERVER", f"❌ Invalid email format: {address}", "WARN")
            return "550 Invalid email address format"

        # For demonstration, accept all addresses (in production, check local domains)
        envelope.rcpt_tos.append(address)
        log_message("SMTP-SERVER", f"✅ Recipient accepted: {address}")
        return "250 OK"

    async def handle_DATA(self, server: SMTP, session, envelope: Envelope):
        """Handle DATA command - receive message content"""
        log_message(
            "SMTP-SERVER",
            f"📨 Receiving message from {envelope.mail_from} to {len(envelope.rcpt_tos)} recipient(s)",
        )

        try:
            # Parse the message content
            message_content = envelope.content.decode("utf-8", errors="replace")

            # Create email message object
            now = datetime.now()
            email = EmailMessage(
                message_id=generate_message_id(envelope.mail_from, now),
                sender=envelope.mail_from,
                recipients=envelope.rcpt_tos.copy(),
                subject=self._extract_subject(message_content),
                body=message_content,
                timestamp=now,
                received_timestamp=now,
            )

            # Store the message (demonstrating store-and-forward)
            await self._store_message(email)

            self.stats["messages_received"] += 1
            self.stats["messages_stored"] += 1

            log_message("SMTP-SERVER", f"✅ Message stored with ID: {email.message_id}")
            log_message("SMTP-SERVER", f"📊 Subject: '{email.subject}'")
            log_message("SMTP-SERVER", f"📊 Body length: {len(email.body)} bytes")

            return "250 Message accepted for delivery"

        except Exception as e:
            log_message("SMTP-SERVER", f"❌ Error processing message: {e}", "ERROR")
            self.stats["errors"] += 1
            return "451 Error processing message"

    def _extract_subject(self, message_content: str) -> str:
        """Extract subject line from email content"""
        lines = message_content.split("\n")
        for line in lines:
            line = line.strip()
            if line.lower().startswith("subject:"):
                return line[8:].strip()  # Remove 'Subject:' prefix
        return "(No Subject)"

    async def _store_message(self, email: EmailMessage):
        """Store email message to disk (demonstrating store-and-forward)"""
        # Create filename with timestamp and message ID
        timestamp_str = email.timestamp.strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp_str}_{email.message_id.replace('@', '_at_')}.json"
        file_path = self.mail_dir / filename

        # Store as JSON for easy reading
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(email.to_dict(), f, indent=2, ensure_ascii=False)

        # Also store in a format similar to mbox for demonstration
        mbox_path = self.mail_dir / "messages.mbox"
        with open(mbox_path, "a", encoding="utf-8") as f:
            f.write(f"From {email.sender} {email.timestamp}\n")
            f.write(format_email_for_display(email))
            f.write("\n\n")

        log_message("SMTP-SERVER", f"💾 Email stored: {filename}")


class RFC821SMTPServer:
    """Main SMTP server class"""

    def __init__(self, host="0.0.0.0", port=25, mail_dir="/var/mail"):
        self.host = host
        self.port = port
        self.mail_dir = mail_dir
        self.controller = None
        self.handler = RFC821SMTPHandler(mail_dir)
        self.stats_task = None

    def setup_signal_handlers(self):
        """Handle graceful shutdown"""

        def signal_handler(signum, frame):
            log_message("SMTP-SERVER", f"Received signal {signum}, shutting down...")
            self.stop()
            sys.exit(0)

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    def start(self):
        """Start the SMTP server"""
        self.setup_signal_handlers()

        log_message("SMTP-SERVER", "🎯 RFC 821 SMTP Server Starting")
        log_message("SMTP-SERVER", f"Listening on {self.host}:{self.port}")
        log_message("SMTP-SERVER", f"Mail directory: {self.mail_dir}")

        # Create the SMTP controller
        self.controller = Controller(self.handler, hostname=self.host, port=self.port)

        try:
            # Start the server
            self.controller.start()

            log_message("SMTP-SERVER", "🚀 SMTP Server ready to accept connections")
            log_message(
                "SMTP-SERVER", "📨 Supports: HELO/EHLO, MAIL FROM, RCPT TO, DATA, QUIT"
            )
            log_message("SMTP-SERVER", "🔄 Implementing store-and-forward architecture")

            # Start stats reporting
            self.stats_task = asyncio.create_task(self._stats_reporter())

            # Keep the server running
            try:
                while True:
                    asyncio.get_event_loop().run_until_complete(asyncio.sleep(1))
            except KeyboardInterrupt:
                log_message("SMTP-SERVER", "Received interrupt, shutting down...")

        except Exception as e:
            log_message("SMTP-SERVER", f"❌ Failed to start server: {e}", "ERROR")
        finally:
            self.stop()

    async def _stats_reporter(self):
        """Report server statistics periodically"""
        while True:
            await asyncio.sleep(30)  # Report every 30 seconds

            if self.handler.stats["messages_received"] > 0:
                log_message("SMTP-SERVER", "📊 Server Statistics:")
                log_message(
                    "SMTP-SERVER",
                    f"   📧 Messages received: {self.handler.stats['messages_received']}",
                )
                log_message(
                    "SMTP-SERVER",
                    f"   💾 Messages stored: {self.handler.stats['messages_stored']}",
                )
                log_message(
                    "SMTP-SERVER",
                    f"   🔗 Total connections: {self.handler.stats['connections']}",
                )
                log_message(
                    "SMTP-SERVER",
                    f"   ⚙️  Commands processed: {self.handler.stats['commands_processed']}",
                )
                log_message(
                    "SMTP-SERVER", f"   ❌ Errors: {self.handler.stats['errors']}"
                )

                # Show recent messages
                await self._show_recent_messages()

    async def _show_recent_messages(self):
        """Show information about recently received messages"""
        try:
            mail_dir = Path(self.mail_dir)
            json_files = list(mail_dir.glob("*.json"))

            if json_files:
                # Get the 3 most recent files
                recent_files = sorted(json_files, key=lambda f: f.stat().st_mtime)[-3:]

                log_message("SMTP-SERVER", "📬 Recent messages:")
                for file_path in recent_files:
                    with open(file_path, "r") as f:
                        email_data = json.load(f)

                    sender = email_data.get("sender", "unknown")
                    subject = email_data.get("subject", "(no subject)")
                    recipients = email_data.get("recipients", [])

                    log_message("SMTP-SERVER", f"   • From: {sender}")
                    log_message("SMTP-SERVER", f"     To: {', '.join(recipients)}")
                    log_message("SMTP-SERVER", f"     Subject: {subject}")

        except Exception as e:
            log_message(
                "SMTP-SERVER", f"❌ Error showing recent messages: {e}", "ERROR"
            )

    def stop(self):
        """Stop the SMTP server"""
        log_message("SMTP-SERVER", "🛑 Shutting down SMTP server...")

        if self.stats_task:
            self.stats_task.cancel()

        if self.controller:
            self.controller.stop()
            log_message("SMTP-SERVER", "✅ SMTP server stopped")


def main():
    port = int(os.getenv("SMTP_PORT", 25))
    mail_dir = os.getenv("MAIL_DIR", "/var/mail")

    log_message("SMTP-SERVER", "🎯 RFC 821 SMTP Server Demonstration")
    log_message(
        "SMTP-SERVER",
        "Implementing: Store-and-forward, Response codes, Email validation",
    )

    server = RFC821SMTPServer(port=port, mail_dir=mail_dir)
    server.start()


if __name__ == "__main__":
    main()
