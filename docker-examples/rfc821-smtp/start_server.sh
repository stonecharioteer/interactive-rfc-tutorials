#!/bin/bash

# Start script for RFC 821 SMTP Server
# Runs both SMTP server and web interface

echo "🎯 Starting RFC 821 SMTP Demonstration Server"
echo "================================================"

# Create mail directory
mkdir -p /var/mail
chown -R root:root /var/mail

# Set environment variables
export MAIL_DIR=/var/mail
export SMTP_PORT=${SMTP_PORT:-25}
export WEB_PORT=${WEB_PORT:-8080}

echo "📧 SMTP Server will listen on port: $SMTP_PORT"
echo "🌐 Web Interface will be available on port: $WEB_PORT"
echo "📁 Mail directory: $MAIL_DIR"

# Start SMTP server in background
echo "🚀 Starting SMTP server..."
python /app/smtp_server.py &
SMTP_PID=$!

# Wait a moment for SMTP server to start
sleep 3

# Start web interface in background
echo "🌐 Starting web interface..."
python /app/web_interface.py &
WEB_PID=$!

echo "✅ Both services started successfully"
echo ""
echo "📧 SMTP Server: Ready to receive emails on port $SMTP_PORT"
echo "🌐 Web Interface: http://localhost:$WEB_PORT"
echo ""
echo "🔍 To test the SMTP server:"
echo "  telnet localhost $SMTP_PORT"
echo ""
echo "💡 The client container will automatically send test emails"
echo "   which you can view in the web interface!"

# Function to handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $SMTP_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    wait
    echo "✅ Cleanup complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Wait for both processes
wait
