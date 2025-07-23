# RFC 2401: IPsec Security Architecture Docker Example

This directory contains a Docker-based demonstration of IPsec concepts from RFC 2401.

## What You'll Learn

- IPsec Security Architecture components (AH and ESP)
- Security Associations (SA) and Security Parameter Index (SPI)
- Authentication Header (AH) for integrity and authentication
- Encapsulating Security Payload (ESP) for confidentiality
- Key management concepts and IKE basics
- Transport vs Tunnel mode operations

## Components

- **IPsec Gateway**: Simulates VPN gateway functionality
- **IPsec Client**: Demonstrates secure communication
- **Key Manager**: Shows IKE-like key exchange simulation

## Quick Start

```bash
# Start the IPsec demonstration
docker-compose up -d

# View logs
docker-compose logs -f

# Access the interactive IPsec shell
docker exec -it ipsec-gateway bash

# Test IPsec operations
docker exec -it ipsec-client python client.py

# Clean up
docker-compose down
```

## Key Learning Points

1. **Network Layer Security**: IPsec operates at Layer 3 (Network Layer)
2. **Transparent Protection**: Applications don't need modification
3. **Authentication & Encryption**: Both integrity and confidentiality
4. **VPN Foundation**: Modern VPNs built on IPsec principles
5. **Key Management**: Automated SA establishment with IKE

## Educational Simulation

⚠️ **Note**: This is an educational simulation. Real IPsec implementations:
- Operate at kernel level with hardware acceleration
- Use standardized cryptographic algorithms (AES, SHA, etc.)
- Integrate with system routing and firewall rules
- Require root privileges for packet manipulation

## Exploring IPsec Concepts

Inside the containers, try these demonstrations:

```bash
# Create Security Association
python -c "from shared_ipsec_utils import IPSecUtils; utils = IPSecUtils(); utils.create_sa_demo()"

# Test AH (Authentication Header)
python -c "from shared_ipsec_utils import IPSecUtils; utils = IPSecUtils(); utils.test_ah_protection()"

# Test ESP (Encapsulating Security Payload)  
python -c "from shared_ipsec_utils import IPSecUtils; utils = IPSecUtils(); utils.test_esp_protection()"

# Show Security Association Database
python -c "from shared_ipsec_utils import IPSecUtils; utils = IPSecUtils(); utils.show_sad()"
```

This demonstration helps you understand how IPsec provides network-layer security and forms the foundation of modern VPN technologies.