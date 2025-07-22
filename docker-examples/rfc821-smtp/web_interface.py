#!/usr/bin/env python3
"""
SMTP Web Interface for Email Viewing

This web interface allows viewing emails received by the SMTP server,
demonstrating the store-and-forward architecture of SMTP.

Features:
- View received emails in real-time
- Display SMTP protocol information
- Show email headers and content
- Real-time updates of email queue
"""
import os
import json
from pathlib import Path
from datetime import datetime
from flask import Flask, render_template_string, jsonify
from shared_smtp_utils import log_message, EmailMessage


class SMTPWebInterface:
    """Web interface for viewing SMTP emails"""

    def __init__(self, mail_dir="/var/mail", port=8080):
        self.mail_dir = Path(mail_dir)
        self.port = port
        self.app = Flask(__name__)
        self.setup_routes()

    def setup_routes(self):
        """Setup Flask routes"""

        @self.app.route("/")
        def index():
            """Main email viewing interface"""
            return render_template_string(self.get_email_viewer_template())

        @self.app.route("/api/emails")
        def get_emails():
            """API endpoint to get list of emails"""
            emails = self.load_emails()
            return jsonify(
                {
                    "emails": [email.to_dict() for email in emails],
                    "count": len(emails),
                    "timestamp": datetime.now().isoformat(),
                }
            )

        @self.app.route("/api/email/<email_id>")
        def get_email_detail(email_id):
            """API endpoint to get specific email details"""
            emails = self.load_emails()

            for email in emails:
                if email.message_id == email_id:
                    return jsonify(email.to_dict())

            return jsonify({"error": "Email not found"}), 404

        @self.app.route("/api/stats")
        def get_stats():
            """API endpoint for email statistics"""
            emails = self.load_emails()

            # Calculate statistics
            total_emails = len(emails)
            senders = set(email.sender for email in emails)
            recipients = set()
            for email in emails:
                recipients.update(email.recipients)

            # Recent activity (last hour)
            now = datetime.now()
            recent_emails = [
                email
                for email in emails
                if email.received_timestamp
                and (now - email.received_timestamp).total_seconds() < 3600
            ]

            return jsonify(
                {
                    "total_emails": total_emails,
                    "unique_senders": len(senders),
                    "unique_recipients": len(recipients),
                    "recent_emails": len(recent_emails),
                    "last_email": emails[0].received_timestamp.isoformat()
                    if emails
                    else None,
                }
            )

    def load_emails(self):
        """Load emails from the mail directory"""
        emails = []

        try:
            # Look for JSON email files
            json_files = list(self.mail_dir.glob("*.json"))

            for json_file in json_files:
                try:
                    with open(json_file, "r", encoding="utf-8") as f:
                        email_data = json.load(f)

                    # Convert timestamps
                    if email_data.get("timestamp"):
                        email_data["timestamp"] = datetime.fromisoformat(
                            email_data["timestamp"]
                        )
                    if email_data.get("received_timestamp"):
                        email_data["received_timestamp"] = datetime.fromisoformat(
                            email_data["received_timestamp"]
                        )

                    email = EmailMessage.from_dict(email_data)
                    emails.append(email)

                except Exception as e:
                    log_message(
                        "WEB-INTERFACE", f"❌ Error loading {json_file}: {e}", "ERROR"
                    )

            # Sort by received timestamp (newest first)
            emails.sort(key=lambda e: e.received_timestamp or e.timestamp, reverse=True)

        except Exception as e:
            log_message("WEB-INTERFACE", f"❌ Error loading emails: {e}", "ERROR")

        return emails

    def get_email_viewer_template(self):
        """HTML template for email viewer"""
        return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RFC 821 SMTP Email Viewer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: #2c5aa0; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .header h1 { margin: 0; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-card h3 { margin: 0 0 5px 0; color: #333; }
        .stat-card .value { font-size: 2em; font-weight: bold; color: #2c5aa0; }
        .email-list { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .email-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #dee2e6; border-radius: 8px 8px 0 0; }
        .email-item { padding: 15px; border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.2s; }
        .email-item:hover { background: #f8f9fa; }
        .email-item:last-child { border-bottom: none; }
        .email-meta { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; align-items: center; }
        .email-subject { font-weight: bold; color: #333; }
        .email-from, .email-to { color: #666; }
        .email-time { color: #999; font-size: 0.9em; text-align: right; }
        .email-details { display: none; margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 4px; }
        .email-details.expanded { display: block; }
        .email-body { white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; margin-top: 10px; border: 1px solid #dee2e6; }
        .loading { text-align: center; padding: 40px; color: #666; }
        .auto-refresh { position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 8px 12px; border-radius: 4px; font-size: 0.9em; }
        .protocol-info { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .message-id { font-family: monospace; font-size: 0.8em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 RFC 821 SMTP Email Viewer</h1>
        <p>Demonstrating store-and-forward email delivery • Real-time email monitoring</p>
    </div>

    <div class="auto-refresh" id="refresh-indicator">🔄 Auto-refreshing</div>

    <div class="stats" id="stats-container">
        <div class="stat-card">
            <h3>📧 Total Emails</h3>
            <div class="value" id="total-emails">-</div>
        </div>
        <div class="stat-card">
            <h3>👤 Unique Senders</h3>
            <div class="value" id="unique-senders">-</div>
        </div>
        <div class="stat-card">
            <h3>👥 Recipients</h3>
            <div class="value" id="unique-recipients">-</div>
        </div>
        <div class="stat-card">
            <h3>⏰ Recent (1h)</h3>
            <div class="value" id="recent-emails">-</div>
        </div>
    </div>

    <div class="email-list">
        <div class="email-header">
            <h2>📬 Received Messages (Store-and-Forward Queue)</h2>
        </div>
        <div id="email-container">
            <div class="loading">Loading emails...</div>
        </div>
    </div>

    <script>
        let emailData = [];

        function formatTime(timestamp) {
            if (!timestamp) return 'Unknown';
            const date = new Date(timestamp);
            return date.toLocaleString();
        }

        function truncate(str, maxLength) {
            return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
        }

        function toggleEmailDetails(index) {
            const details = document.getElementById(`details-${index}`);
            if (details.classList.contains('expanded')) {
                details.classList.remove('expanded');
            } else {
                details.classList.add('expanded');
            }
        }

        function renderEmails(emails) {
            const container = document.getElementById('email-container');

            if (emails.length === 0) {
                container.innerHTML = '<div class="loading">No emails received yet. Send some emails to see them here!</div>';
                return;
            }

            let html = '';
            emails.forEach((email, index) => {
                html += `
                    <div class="email-item" onclick="toggleEmailDetails(${index})">
                        <div class="email-meta">
                            <div class="email-subject">${email.subject || '(No Subject)'}</div>
                            <div class="email-from">From: ${email.sender}</div>
                            <div class="email-to">To: ${email.recipients.join(', ')}</div>
                            <div class="email-time">${formatTime(email.received_timestamp)}</div>
                        </div>
                        <div class="email-details" id="details-${index}">
                            <div class="protocol-info">
                                <strong>🔍 SMTP Protocol Information:</strong><br>
                                Message-ID: <span class="message-id">${email.message_id}</span><br>
                                Timestamp: ${formatTime(email.timestamp)}<br>
                                Received: ${formatTime(email.received_timestamp)}<br>
                                Recipients: ${email.recipients.length}
                            </div>
                            <div class="email-body">${email.body}</div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        function updateStats(stats) {
            document.getElementById('total-emails').textContent = stats.total_emails;
            document.getElementById('unique-senders').textContent = stats.unique_senders;
            document.getElementById('unique-recipients').textContent = stats.unique_recipients;
            document.getElementById('recent-emails').textContent = stats.recent_emails;
        }

        function loadEmails() {
            fetch('/api/emails')
                .then(response => response.json())
                .then(data => {
                    emailData = data.emails;
                    renderEmails(emailData);
                })
                .catch(error => {
                    console.error('Error loading emails:', error);
                    document.getElementById('email-container').innerHTML =
                        '<div class="loading">Error loading emails. Check server logs.</div>';
                });
        }

        function loadStats() {
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    updateStats(data);
                })
                .catch(error => {
                    console.error('Error loading stats:', error);
                });
        }

        function refresh() {
            loadEmails();
            loadStats();

            // Visual feedback for refresh
            const indicator = document.getElementById('refresh-indicator');
            indicator.style.backgroundColor = '#ffc107';
            setTimeout(() => {
                indicator.style.backgroundColor = '#28a745';
            }, 200);
        }

        // Initial load
        refresh();

        // Auto-refresh every 5 seconds
        setInterval(refresh, 5000);

        console.log('🎯 RFC 821 SMTP Email Viewer loaded');
        console.log('📧 This interface demonstrates the store-and-forward email architecture');
        console.log('🔄 Auto-refreshing every 5 seconds to show new emails');
    </script>
</body>
</html>
        """

    def run(self):
        """Run the web interface"""
        log_message("WEB-INTERFACE", f"🌐 Starting web interface on port {self.port}")
        log_message("WEB-INTERFACE", f"📧 Mail directory: {self.mail_dir}")
        log_message("WEB-INTERFACE", f"🔗 Access at: http://localhost:{self.port}")

        try:
            # Run Flask app
            self.app.run(
                host="0.0.0.0",
                port=self.port,
                debug=False,
                use_reloader=False,
                threaded=True,
            )
        except Exception as e:
            log_message(
                "WEB-INTERFACE", f"❌ Error starting web interface: {e}", "ERROR"
            )


def main():
    port = int(os.getenv("WEB_PORT", 8080))
    mail_dir = os.getenv("MAIL_DIR", "/var/mail")

    log_message("WEB-INTERFACE", "🎯 SMTP Web Interface Starting")
    log_message(
        "WEB-INTERFACE",
        "Providing: Email viewing, SMTP demonstration, Real-time updates",
    )

    interface = SMTPWebInterface(mail_dir=mail_dir, port=port)
    interface.run()


if __name__ == "__main__":
    main()
