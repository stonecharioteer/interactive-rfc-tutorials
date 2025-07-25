# RFC 4787: NAT Behavioral Requirements - Docker Demonstration

This Docker demonstration provides an interactive environment for testing and understanding NAT (Network Address Translation) behavioral requirements as specified in RFC 4787.

## What This Demonstrates

This environment simulates different types of NAT devices and their behaviors, allowing you to:

- **Test NAT mapping behaviors**: Endpoint-Independent, Address-Dependent, Address and Port-Dependent
- **Analyze filtering behaviors**: How NAT devices handle inbound traffic
- **Understand UDP hole punching**: Techniques for NAT traversal
- **Visualize NAT behavior patterns**: Real-time analysis of NAT operations

## Quick Start

```bash
# Start the RFC 4787 NAT testing environment
docker compose up -d

# Access the web interface
open https://localhost:8443

# View real-time NAT testing
open http://localhost:8080

# Monitor logs
docker compose logs -f nat-tester
```

## Services Overview

### Core Testing Services

- **nat-tester** (port 8080): Main testing orchestrator that coordinates NAT behavior analysis
- **endpoint-detector** (ports 3001, 3002): STUN-like service for detecting NAT mapping behavior
- **behavior-analyzer** (port 4001): Service that analyzes and categorizes NAT behaviors

### NAT Simulators

- **nat-eif** (port 5001): Endpoint-Independent Filtering NAT simulator
- **nat-adf** (port 5002): Address-Dependent Filtering NAT simulator  
- **nat-apdf** (port 5003): Address and Port-Dependent Filtering NAT simulator

### Web Interface

- **web-interface** (port 8443): HTTPS web dashboard for visualizing results and real-time monitoring

## Testing Scenarios

### 1. Basic NAT Mapping Detection

```bash
# Test endpoint-independent mapping
curl http://localhost:8080/test/mapping/endpoint-independent

# Test address-dependent mapping
curl http://localhost:8080/test/mapping/address-dependent

# Test address-port-dependent mapping
curl http://localhost:8080/test/mapping/address-port-dependent
```

### 2. Filtering Behavior Analysis

```bash
# Test endpoint-independent filtering
curl http://localhost:8080/test/filtering/endpoint-independent

# Test address-dependent filtering
curl http://localhost:8080/test/filtering/address-dependent

# Test address-port-dependent filtering
curl http://localhost:8080/test/filtering/address-port-dependent
```

### 3. UDP Hole Punching Demonstration

```bash
# Demonstrate successful hole punching
curl http://localhost:8080/test/hole-punching/success

# Demonstrate failed hole punching scenarios
curl http://localhost:8080/test/hole-punching/failure
```

## Real-World Applications

This demonstration shows how RFC 4787 NAT behaviors affect:

- **WebRTC connections**: Video calls and peer-to-peer communication
- **Gaming applications**: Real-time multiplayer gaming
- **VoIP services**: Voice over IP communication
- **IoT devices**: Internet of Things connectivity
- **Peer-to-peer applications**: File sharing and decentralized systems

## Educational Benefits

- **Understand NAT complexity**: See how different NAT implementations affect applications
- **Learn troubleshooting techniques**: Identify and resolve NAT-related connectivity issues
- **Explore modern solutions**: See how STUN, TURN, and ICE work with different NAT types
- **Visualize network behavior**: Real-time monitoring of NAT operations and decisions

## Architecture

```
Internet
    |
[NAT Device]  ← RFC 4787 behaviors simulated
    |
Private Network
    |
[Applications] ← Testing various connectivity scenarios
```

## Log Analysis

View detailed logs showing NAT behavior analysis:

```bash
# Real-time NAT detection logs
docker compose logs -f endpoint-detector

# Behavior analysis results
docker compose logs -f behavior-analyzer

# Overall testing coordination
docker compose logs -f nat-tester
```

## Clean Up

```bash
# Stop all services
docker compose down

# Remove volumes and data
docker compose down -v

# Remove images
docker compose down --rmi all
```

## Learning Resources

- **RFC 4787**: Network Address Translation (NAT) Behavioral Requirements for Unicast UDP
- **STUN Protocol**: Session Traversal Utilities for NAT
- **ICE Framework**: Interactive Connectivity Establishment
- **WebRTC**: Web Real-Time Communication

This demonstration provides hands-on experience with the NAT behavioral requirements that are fundamental to modern internet communication and real-time applications.