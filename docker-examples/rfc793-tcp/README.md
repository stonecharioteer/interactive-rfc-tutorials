# RFC 793 TCP Demonstration

This Docker Compose setup demonstrates the key concepts from RFC 793 (Transmission Control Protocol) through interactive Python services.

## What This Demonstrates

### Core TCP Concepts

- **Three-way Handshake**: Connection establishment (SYN, SYN-ACK, ACK)
- **Reliable Data Delivery**: Sequence numbers and acknowledgments
- **Flow Control**: Managing data flow to prevent buffer overflow
- **Four-way Handshake**: Graceful connection termination
- **Socket Options**: TCP_NODELAY, SO_KEEPALIVE, buffer sizes

### Observable Behaviors

- Connection establishment and teardown
- Packet-level TCP communication
- Error handling and retransmission
- Connection state monitoring
- Performance metrics

## Services

### TCP Server (`tcp-server`)

- Listens on port 8080
- Demonstrates server-side TCP concepts
- Shows connection acceptance and client handling
- Implements flow control and error handling
- Logs detailed connection information

### TCP Client (`tcp-client`)

- Connects to the TCP server
- Sends a series of test messages
- Demonstrates client-side TCP operations
- Shows graceful connection handling
- Reports communication statistics

### TCP Monitor (`tcp-monitor`)

- Monitors network traffic using `tcpdump` and `netstat`
- Captures TCP packets and connection states
- Provides real-time analysis of TCP behavior
- Reports statistics on handshakes and data flow

## Running the Demo

### Prerequisites

- Docker and Docker Compose
- At least 1GB RAM available

### Start the Demo

```bash
docker compose up --build
```

### Stop the Demo

```bash
docker compose down
```

### View Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f tcp-server
docker compose logs -f tcp-client
docker compose logs -f tcp-monitor
```

## Expected Output

You'll see logs showing:

1. **Server Startup**: TCP server binding and listening
2. **Client Connection**: Three-way handshake completion
3. **Message Exchange**: Reliable data transfer with sequence numbers
4. **Flow Control**: Backpressure demonstration
5. **Monitoring**: Real-time packet capture and analysis
6. **Graceful Shutdown**: Four-way handshake for connection termination

## Educational Value

### For Understanding TCP

- See the three-way handshake in action
- Observe sequence numbers and acknowledgments
- Understand flow control mechanisms
- Learn about connection states

### For Network Programming

- Python socket programming examples
- Error handling best practices
- Performance monitoring techniques
- Network debugging approaches

## Customization

### Environment Variables

**Server (`tcp-server`)**:

- `SERVER_PORT`: Port to listen on (default: 8080)
- `LOG_LEVEL`: Logging level (default: INFO)

**Client (`tcp-client`)**:

- `SERVER_HOST`: Server hostname (default: tcp-server)
- `SERVER_PORT`: Server port (default: 8080)
- `MESSAGE_COUNT`: Number of messages to send (default: 5)
- `DELAY_SECONDS`: Delay between messages (default: 2)

### Example with Custom Settings

```bash
# Send more messages with shorter delay
MESSAGE_COUNT=10 DELAY_SECONDS=1 docker compose up --build
```

## Key Learning Points

1. **Reliability**: TCP ensures all data arrives correctly
2. **Ordering**: Messages arrive in the same sequence they were sent
3. **Flow Control**: Receivers control how fast senders transmit
4. **Connection-Oriented**: Explicit setup and teardown procedures
5. **Error Recovery**: Automatic retransmission of lost data

## Troubleshooting

### Connection Issues

- Ensure no other services are using port 8080
- Check Docker network connectivity
- Verify container startup order

### Permission Issues (Monitor)

- The monitor needs NET_ADMIN capability for packet capture
- This is configured in docker-compose.yml

### High Resource Usage

- Reduce MESSAGE_COUNT if system is slow
- Increase DELAY_SECONDS to reduce traffic

## Files Description

- `docker-compose.yml`: Multi-service orchestration
- `server.py`: TCP server implementation
- `client.py`: TCP client implementation
- `monitor.py`: Network monitoring service
- `shared_utils.py`: Common utilities and logging
- `Dockerfile.*`: Container build configurations

This demonstration provides hands-on experience with TCP concepts that are foundational to internet communication.
