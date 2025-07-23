# RFC 2460: IPv6 Docker Example

This directory contains a Docker-based demonstration of IPv6 concepts from RFC 2460.

## What You'll Learn

- IPv6 address structure and formatting
- Address types (unicast, multicast, anycast)
- Stateless Address Autoconfiguration (SLAAC)
- IPv6 header structure and extension headers
- Dual-stack networking (IPv4 + IPv6)

## Components

- **IPv6 Server**: Demonstrates IPv6 networking capabilities
- **IPv6 Client**: Shows IPv6 client communication
- **Network Tools**: IPv6 utilities for address generation and analysis

## Quick Start

```bash
# Start the IPv6 demonstration
docker-compose up -d

# View logs
docker-compose logs -f

# Access the interactive IPv6 shell
docker exec -it ipv6-server bash

# Clean up
docker-compose down
```

## Key Learning Points

1. **Address Space**: IPv6 provides 2^128 addresses vs IPv4's 2^32
2. **Simplified Header**: IPv6 header is fixed 40 bytes vs variable IPv4
3. **No NAT Required**: Global unicast addresses enable end-to-end connectivity
4. **Built-in Security**: IPsec integration for secure communications
5. **Autoconfiguration**: Devices can configure addresses automatically

## Exploring IPv6

Inside the containers, try these commands:

```bash
# Show IPv6 addresses
ip -6 addr show

# Test IPv6 connectivity
ping6 ::1

# Show IPv6 routing table
ip -6 route show

# Test DNS over IPv6
nslookup google.com 2001:4860:4860::8888
```

This demonstration helps you understand IPv6's revolutionary improvements over IPv4 and why it's essential for the internet's future.