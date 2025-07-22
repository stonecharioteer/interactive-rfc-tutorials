# RFC 821 SMTP Demonstration

This Docker Compose setup demonstrates the key concepts from RFC 821 (Simple Mail Transfer Protocol)
through interactive Python services and a web interface.

## What This Demonstrates

### Core SMTP Concepts

- **Store-and-Forward Architecture**: Messages are received, stored, and then forwarded
- **SMTP Command Sequence**: HELLO, MAIL FROM, RCPT TO, DATA, QUIT
- **Response Codes**: 2xx (success), 3xx (intermediate), 4xx (temp failure), 5xx (permanent failure)
- **MX Record Resolution**: DNS-based mail server discovery
- **Email Format Standards**: Proper message formatting and headers

### Observable Behaviors

- Real-time email reception and storage
- SMTP protocol command/response flow
- DNS MX record lookup simulation
- Email queue management
- Web-based email viewing

## Services

### SMTP Server (`smtp-server`)

- Implements RFC 821 SMTP protocol
- Accepts emails on port 25 (mapped to 2525 for non-root access)
- Demonstrates store-and-forward architecture
- Provides detailed logging of SMTP transactions
- Stores emails in JSON format and mbox format
- Serves web interface on port 8080

### SMTP Client (`smtp-client`)

- Connects to SMTP server
- Performs MX record lookups
- Sends variety of test emails
- Demonstrates proper SMTP command sequence
- Tests different response scenarios
- Reports detailed statistics

### DNS Simulator (`dns-simulator`)

- Simulates DNS MX record resolution
- Provides MX records for demonstration domains
- Shows mail server priority selection
- Integrates with SMTP routing process

## Running the Demo

### Prerequisites

- Docker and Docker Compose
- At least 1GB RAM available
- Port 2525 and 8080 available

### Start the Demo

```bash
docker compose up --build
```

### Stop the Demo

```bash
docker compose down
```

### Access the Web Interface

Open your browser and go to: <http://localhost:8080>

### View Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f smtp-server
docker compose logs -f smtp-client
docker compose logs -f dns-simulator
```

## Expected Output

You'll see logs showing:

1. **SMTP Server Startup**: Server binding and listening on port 25
2. **DNS Simulator**: MX record configuration and query handling
3. **Client Connection**: SMTP handshake and authentication
4. **Email Transmission**: Full SMTP command sequence (HELLO → MAIL FROM → RCPT TO → DATA)
5. **Store-and-Forward**: Email storage and queuing
6. **Web Interface**: Real-time email viewing and statistics

## Web Interface Features

The web interface (<http://localhost:8080>) provides:

- **📧 Real-time Email Viewing**: See emails as they arrive
- **📊 Statistics Dashboard**: Email counts, senders, recipients
- **🔍 Protocol Information**: Message IDs, timestamps, SMTP details
- **📬 Message Queue**: Store-and-forward demonstration
- **🔄 Auto-refresh**: Updates every 5 seconds

## Educational Value

### For Understanding SMTP

- See the complete email delivery process
- Understand store-and-forward architecture
- Learn SMTP response codes and their meanings
- Observe MX record resolution for routing

### For Email System Design

- Message queuing and retry mechanisms
- Email format standards and headers
- DNS integration for mail routing
- Error handling and bounce management

## Customization

### Environment Variables

**SMTP Server**:

- `SMTP_PORT`: SMTP listening port (default: 25)
- `WEB_PORT`: Web interface port (default: 8080)
- `DOMAIN`: Primary domain (default: example.com)
- `MAIL_DIR`: Mail storage directory (default: /var/mail)

**SMTP Client**:

- `SMTP_HOST`: SMTP server hostname (default: smtp-server)
- `SMTP_PORT`: SMTP server port (default: 25)
- `EMAIL_COUNT`: Number of emails to send (default: 5)
- `DELAY_SECONDS`: Delay between emails (default: 3)

**DNS Simulator**:

- `DOMAIN`: Domain to serve MX records for (default: example.com)
- `MX_SERVER`: Mail server hostname (default: smtp-server)
- `MX_PRIORITY`: MX record priority (default: 10)

### Example with Custom Settings

```bash
# Send more emails with shorter delay
EMAIL_COUNT=10 DELAY_SECONDS=1 docker compose up --build

# Test different domain
DOMAIN=mycompany.com docker compose up --build
```

## Testing SMTP Manually

You can test the SMTP server manually using telnet:

```bash
# Connect to SMTP server
telnet localhost 2525

# Then type SMTP commands:
HELLO test.com
MAIL FROM:<test@example.com>
RCPT TO:<user@example.com>
DATA
Subject: Manual Test
This is a manual SMTP test.
.
QUIT
```

## Key Learning Points

1. **Text-based Protocol**: SMTP is human-readable and debuggable
2. **Stateful Communication**: Commands must be sent in proper sequence
3. **Store-and-Forward**: Emails are queued and can be retried
4. **DNS Integration**: MX records determine mail routing
5. **Response Codes**: Standardized error reporting and status indication
6. **Extensibility**: Modern SMTP extensions (ESMTP) build on this foundation

## Files Description

- `docker-compose.yml`: Multi-service orchestration with networking
- `smtp_server.py`: RFC 821 SMTP server implementation
- `client.py`: SMTP client with MX lookup demonstration
- `dns_simulator.py`: DNS MX record resolution simulator
- `web_interface.py`: Flask-based email viewing interface
- `shared_smtp_utils.py`: Common utilities and email handling
- `start_server.sh`: Multi-service startup script
- `Dockerfile.*`: Container build configurations

## Troubleshooting

### Port Conflicts

- SMTP uses port 2525 (mapped from 25) to avoid conflicts
- Web interface uses port 8080
- DNS simulator uses port 5353

### Permission Issues

- Mail directory is created with proper permissions
- All services run as root in containers for simplicity

### No Emails Showing

- Check SMTP server logs for connection issues
- Verify client is connecting successfully
- Refresh web interface (auto-refreshes every 5 seconds)

### Memory Usage

- Reduce EMAIL_COUNT if system is constrained
- Increase DELAY_SECONDS to reduce processing load

This demonstration provides comprehensive hands-on experience with SMTP concepts that power modern email systems!
