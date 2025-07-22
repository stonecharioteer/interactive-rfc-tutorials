#!/usr/bin/env python3
"""
RFC 959 FTP Server Demonstration

This server demonstrates basic FTP concepts:
- Control and data connections
- Active vs Passive modes
- ASCII vs Binary transfers
- User authentication
- File operations (LIST, RETR, STOR)
"""
import os
import sys
import signal
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer
from shared_ftp_utils import log_message, create_test_files


class RFC959FTPHandler(FTPHandler):
    """Custom FTP handler with detailed logging"""

    def on_connect(self):
        """Called when client connects"""
        log_message(
            "FTP-SERVER", f"🔌 Client connected: {self.remote_ip}:{self.remote_port}"
        )

    def on_disconnect(self):
        """Called when client disconnects"""
        log_message("FTP-SERVER", f"🔌 Client disconnected: {self.remote_ip}")

    def on_login(self, username):
        """Called when user logs in"""
        log_message("FTP-SERVER", f"👤 User login: {username}")

    def on_logout(self, username):
        """Called when user logs out"""
        log_message("FTP-SERVER", f"👤 User logout: {username}")

    def on_file_sent(self, file):
        """Called when file is sent to client"""
        size = os.path.getsize(file) if os.path.exists(file) else 0
        log_message(
            "FTP-SERVER", f"📤 File sent: {os.path.basename(file)} ({size} bytes)"
        )

    def on_file_received(self, file):
        """Called when file is received from client"""
        size = os.path.getsize(file) if os.path.exists(file) else 0
        log_message(
            "FTP-SERVER", f"📥 File received: {os.path.basename(file)} ({size} bytes)"
        )

    def on_incomplete_file_sent(self, file):
        """Called when file transfer is incomplete"""
        log_message(
            "FTP-SERVER", f"⚠️  Incomplete transfer: {os.path.basename(file)}", "WARN"
        )

    def on_incomplete_file_received(self, file):
        """Called when file receive is incomplete"""
        log_message(
            "FTP-SERVER", f"⚠️  Incomplete receive: {os.path.basename(file)}", "WARN"
        )


def setup_ftp_server():
    """Setup and configure FTP server"""

    # Create authorizer for user authentication
    authorizer = DummyAuthorizer()

    # Get configuration from environment
    ftp_user = os.getenv("FTP_USER", "testuser")
    ftp_pass = os.getenv("FTP_PASS", "testpass")
    ftp_dir = "/srv/ftp"

    # Add user with read/write permissions
    authorizer.add_user(ftp_user, ftp_pass, ftp_dir, perm="elradfmwMT")

    # Add anonymous user (read-only)
    authorizer.add_anonymous(ftp_dir, perm="elr")

    log_message("FTP-SERVER", f"👤 Added user: {ftp_user} (full access)")
    log_message("FTP-SERVER", "👤 Added anonymous user (read-only)")

    # Create handler
    handler = RFC959FTPHandler
    handler.authorizer = authorizer

    # Configure passive mode
    pasv_min = int(os.getenv("PASV_MIN_PORT", 20000))
    pasv_max = int(os.getenv("PASV_MAX_PORT", 20010))
    handler.passive_ports = range(pasv_min, pasv_max + 1)

    log_message("FTP-SERVER", f"🔧 Passive port range: {pasv_min}-{pasv_max}")

    # Enable detailed logging
    handler.banner = "RFC 959 FTP Server Ready - Demonstrating File Transfer Protocol"

    return handler


def create_demo_environment():
    """Create demonstration files and directories"""
    ftp_dir = "/srv/ftp"

    # Create directories
    os.makedirs(f"{ftp_dir}/uploads", exist_ok=True)
    os.makedirs(f"{ftp_dir}/downloads", exist_ok=True)
    os.makedirs(f"{ftp_dir}/examples", exist_ok=True)

    # Create test files in examples directory
    test_files = create_test_files(f"{ftp_dir}/examples", 3)

    # Create welcome message
    welcome_text = """Welcome to RFC 959 FTP Server Demonstration!

This server demonstrates key FTP concepts:

📁 Directory Structure:
  /uploads/   - Upload your files here
  /downloads/ - Files available for download
  /examples/  - Sample files for testing

🔄 Transfer Modes:
  ASCII  - For text files (.txt, .cfg, .csv)
  BINARY - For binary files (.dat, .exe, .zip)

🌐 Connection Modes:
  ACTIVE  - Server connects to client
  PASSIVE - Client connects to server

📋 Common Commands:
  LIST - List directory contents
  RETR filename - Download file
  STOR filename - Upload file
  TYPE A - ASCII mode
  TYPE I - Binary mode
  PASV - Enter passive mode

Happy file transferring!
"""

    with open(f"{ftp_dir}/README.txt", "w") as f:
        f.write(welcome_text)

    log_message("FTP-SERVER", f"📁 Created demo environment in {ftp_dir}")
    log_message("FTP-SERVER", f"📄 Created {len(test_files)} test files")


def main():
    """Main FTP server function"""

    def signal_handler(signum, frame):
        log_message("FTP-SERVER", f"Received signal {signum}, shutting down...")
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    log_message("FTP-SERVER", "🎯 RFC 959 FTP Server Starting")
    log_message(
        "FTP-SERVER",
        "Demonstrating: File transfer, Active/Passive modes, ASCII/Binary transfer",
    )

    try:
        # Create demonstration environment
        create_demo_environment()

        # Setup FTP server
        handler = setup_ftp_server()

        # Get port from environment
        ftp_port = int(os.getenv("FTP_PORT", 21))

        # Create and start server
        server = FTPServer(("0.0.0.0", ftp_port), handler)
        server.max_cons = 256
        server.max_cons_per_ip = 5

        log_message("FTP-SERVER", f"🚀 FTP Server listening on port {ftp_port}")
        log_message("FTP-SERVER", "📁 Serving files from: /srv/ftp")
        log_message("FTP-SERVER", "👤 Test credentials: testuser/testpass")
        log_message("FTP-SERVER", "🔒 Anonymous access: enabled (read-only)")

        # Start serving
        server.serve_forever()

    except Exception as e:
        log_message("FTP-SERVER", f"❌ Failed to start FTP server: {e}", "ERROR")
        sys.exit(1)


if __name__ == "__main__":
    main()
