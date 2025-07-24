# RFC 4301: IPsec Security Architecture Demonstration

This directory contains a comprehensive Docker-based demonstration of IPsec security architecture as defined in RFC 4301. Experience how modern VPN technologies protect network traffic through security policies, associations, and encrypted tunnels.

## What You'll Learn

- IPsec security policy management (SPD) and implementation
- Security Association (SA) lifecycle and management
- Transport vs Tunnel mode differences in real network scenarios
- How IPsec provides authentication, integrity, and confidentiality
- Modern VPN architecture patterns used by enterprise networks

## Architecture Overview

```
                        IPsec Security Architecture Demo
    ┌─────────────────────────────────────────────────────────────────────┐
    │                    Internet (172.20.0.0/16)                        │
    │                                                                     │
    │         [IPsec GW A]  ←←←←←←  Tunnel  →→→→→→  [IPsec GW B]          │
    │         172.20.0.10                           172.20.0.20           │
    │              │                                     │                │
    │              │                                     │                │
    └──────────────┼─────────────────────────────────────┼────────────────┘
                   │                                     │
          ┌────────┴──────────┐                 ┌───────┴─────────┐
          │   Site A Network  │                 │  Site B Network │
          │   192.168.1.0/24  │                 │  10.0.0.0/24    │
          │                   │                 │                 │
          │  [Host A1]        │                 │    [Host B1]    │
          │  192.168.1.10     │                 │    10.0.0.10    │
          │                   │                 │                 │
          │  [Host A2]        │                 │    [Host B2]    │
          │  192.168.1.20     │                 │    10.0.0.20    │
          └───────────────────┘                 └─────────────────┘
```

## Components

### IPsec Gateways
- **IPsec Gateway A**: Site A security gateway with policy enforcement
- **IPsec Gateway B**: Site B security gateway with tunnel termination
- **Policy Monitor**: Real-time visualization of IPsec policy decisions

### Protected Networks
- **Site A Hosts**: Simulated corporate network endpoints
- **Site B Hosts**: Simulated branch office endpoints  
- **Traffic Generator**: Creates various traffic patterns for policy testing

## Quick Start

```bash
# Start the complete IPsec architecture demonstration
docker-compose up -d

# Wait for IPsec tunnels to establish
sleep 20

# Monitor IPsec tunnel establishment
docker logs -f ipsec-gateway-a

# Watch policy enforcement in action
docker logs -f policy-monitor

# Test site-to-site connectivity
docker exec host-a1 ping 10.0.0.10

# View IPsec statistics and status
open http://localhost:3000

# Clean up
docker-compose down
```

## Educational Scenarios

### 1. Security Policy Configuration

Explore how IPsec policies determine packet processing:

```bash
# View Security Policy Database (SPD) configuration
docker exec ipsec-gateway-a python3 /scripts/show-policies.py

# Test policy matching for different traffic types
docker exec ipsec-gateway-a python3 /scripts/test-policy-matching.py

# Modify policies and observe behavior changes
docker exec ipsec-gateway-a python3 /scripts/modify-policies.py
```

### 2. Security Association Management

Understand SA lifecycle and management:

```bash
# Display active Security Associations
docker exec ipsec-gateway-a python3 -c "
from scripts.ipsec_manager import IPsecManager
mgr = IPsecManager()
mgr.show_active_sas()
"

# Monitor SA creation and expiration
docker logs ipsec-gateway-a | grep -E "(SA created|SA expired|SA renewed)"

# Test SA rekeying process
docker exec ipsec-gateway-a python3 /scripts/trigger-rekey.py
```

### 3. Transport vs Tunnel Mode Comparison

See the differences between IPsec operating modes:

```bash
# Configure transport mode for host-to-host communication
docker exec ipsec-gateway-a python3 /scripts/configure-transport-mode.py

# Configure tunnel mode for site-to-site VPN
docker exec ipsec-gateway-a python3 /scripts/configure-tunnel-mode.py

# Compare packet headers and overhead
docker exec traffic-monitor tcpdump -i any -n esp
```

### 4. Authentication and Encryption Testing

Verify IPsec security services:

```bash
# Test authentication-only (AH) protection
docker exec ipsec-gateway-a python3 /scripts/test-ah-mode.py

# Test encryption with ESP
docker exec ipsec-gateway-a python3 /scripts/test-esp-mode.py

# Verify anti-replay protection
docker exec ipsec-gateway-a python3 /scripts/test-replay-protection.py
```

## Network Topologies Demonstrated

### Scenario 1: Site-to-Site VPN
- **Site A**: Corporate headquarters (192.168.1.0/24)
- **Site B**: Branch office (10.0.0.0/24)
- **IPsec Mode**: Tunnel mode ESP with AES-256-GCM
- **Authentication**: Pre-shared keys (educational setup)

### Scenario 2: Remote Access VPN  
- **VPN Clients**: Mobile workers (172.16.0.0/24)
- **Corporate Network**: Protected resources (192.168.1.0/24)
- **IPsec Mode**: Tunnel mode with user authentication
- **Features**: Dynamic IP assignment, split tunneling

### Scenario 3: DMZ Protection
- **DMZ**: Web servers and public services (172.16.1.0/24)
- **Internal**: Protected corporate network (192.168.1.0/24)
- **Policies**: Selective protection based on traffic type
- **Features**: Granular policy enforcement

## Performance Analysis

### Encryption Overhead Comparison

| Traffic Type | Plaintext | IPsec Overhead | Total Size | Overhead % |
|--------------|-----------|----------------|------------|-----------|
| **TCP Data (1500B)** | 1500 bytes | 73 bytes | 1573 bytes | 4.9% |
| **UDP Data (1024B)** | 1024 bytes | 73 bytes | 1097 bytes | 7.1% |
| **ICMP Ping (64B)** | 64 bytes | 73 bytes | 137 bytes | 114% |
| **Large Transfer** | 9000 bytes | 73 bytes | 9073 bytes | 0.8% |

### Throughput Impact

Monitor IPsec performance impact on network throughput:

```bash
# Baseline throughput without IPsec
docker exec host-a1 iperf3 -c host-b1 -t 30

# IPsec-protected throughput  
docker exec ipsec-gateway-a python3 /scripts/enable-ipsec.py
docker exec host-a1 iperf3 -c host-b1 -t 30

# Compare results and analyze overhead
docker exec policy-monitor python3 /scripts/analyze-performance.py
```

## Policy Configuration Examples

### Enterprise Network Policies

```bash
# Configure comprehensive enterprise IPsec policies
docker exec ipsec-gateway-a python3 -c "
from scripts.policy_manager import PolicyManager
pm = PolicyManager()

# Site-to-site VPN policies
pm.configure_site_to_site_vpn(
    local_network='192.168.1.0/24',
    remote_network='10.0.0.0/24',
    tunnel_endpoints=('172.20.0.10', '172.20.0.20')
)

# Remote access VPN policies  
pm.configure_remote_access_vpn(
    vpn_clients='172.16.0.0/24',
    protected_network='192.168.1.0/24'
)

# DMZ protection policies
pm.configure_dmz_policies(
    dmz_network='172.16.1.0/24',
    internal_network='192.168.1.0/24'
)

pm.display_all_policies()
"
```

### Traffic Shaping and QoS

```bash
# Configure IPsec with Quality of Service policies
docker exec ipsec-gateway-a python3 /scripts/configure-qos-policies.py

# Test different traffic classes
docker exec host-a1 python3 /scripts/generate-traffic-classes.py

# Monitor QoS enforcement
docker logs policy-monitor | grep -E "(QoS|DSCP|priority)"
```

## Security Testing

### Policy Enforcement Verification

```bash
# Test that unauthorized traffic is blocked
docker exec external-host ping 192.168.1.10
# Should fail - no policy allows external access

# Test that authorized traffic is protected
docker exec host-a1 curl http://10.0.0.10
# Should succeed with IPsec protection

# Verify encryption is applied
docker exec traffic-monitor tcpdump -i any -n -x host 10.0.0.10
# Should show encrypted ESP packets
```

### Cryptographic Algorithm Testing

```bash
# Test different encryption algorithms
docker exec ipsec-gateway-a python3 /scripts/test-crypto-algorithms.py

# Compare performance of different cipher suites
docker exec ipsec-gateway-a python3 /scripts/benchmark-ciphers.py

# Verify perfect forward secrecy
docker exec ipsec-gateway-a python3 /scripts/test-pfs.py
```

## Monitoring and Visualization

### Real-Time Policy Monitoring

The web interface (http://localhost:3000) provides:

- **Policy Database Viewer**: Current SPD entries and matching rules
- **Active SA Status**: Security associations and their parameters  
- **Traffic Flow Visualization**: Real-time packet processing decisions
- **Performance Metrics**: Throughput, latency, and encryption overhead
- **Security Events**: Authentication failures, policy violations

### Command Line Monitoring

```bash
# Monitor IPsec events in real-time
docker logs -f ipsec-gateway-a | grep -E "(PROTECT|BYPASS|DISCARD)"

# Watch SA establishment and rekeying
docker exec ipsec-gateway-a tail -f /var/log/ipsec/sa-events.log

# Monitor network traffic patterns
docker exec traffic-monitor python3 /scripts/traffic-analyzer.py
```

## Modern Internet Context

### IPsec in Cloud Infrastructure

```bash
# Simulate AWS VPC-to-VPC connection
docker exec ipsec-gateway-a python3 /scripts/simulate-aws-vpn.py

# Test Azure ExpressRoute-like connectivity
docker exec ipsec-gateway-a python3 /scripts/simulate-azure-connection.py

# Demonstrate Google Cloud VPN configuration
docker exec ipsec-gateway-a python3 /scripts/simulate-gcp-vpn.py
```

### Integration with Modern Protocols

```bash
# IPsec with IPv6 dual-stack
docker exec ipsec-gateway-a python3 /scripts/test-ipv6-ipsec.py

# Integration with MPLS networks
docker exec ipsec-gateway-a python3 /scripts/test-mpls-ipsec.py

# SD-WAN integration patterns
docker exec ipsec-gateway-a python3 /scripts/simulate-sdwan.py
```

## Troubleshooting Common Issues

### 1. Tunnel Establishment Failures

```bash
# Check IKE negotiation logs
docker exec ipsec-gateway-a cat /var/log/ipsec/ike.log

# Verify network connectivity
docker exec ipsec-gateway-a ping 172.20.0.20

# Test UDP 500 and 4500 connectivity
docker exec ipsec-gateway-a nc -u 172.20.0.20 500
```

### 2. Policy Matching Problems

```bash
# Debug policy lookup process
docker exec ipsec-gateway-a python3 /scripts/debug-policy-matching.py

# Verify selector configuration
docker exec ipsec-gateway-a python3 /scripts/validate-selectors.py

# Test policy precedence
docker exec ipsec-gateway-a python3 /scripts/test-policy-precedence.py
```

### 3. Performance Issues

```bash
# Monitor CPU usage during encryption
docker exec ipsec-gateway-a top -p `pgrep ipsec`

# Check for packet drops
docker exec ipsec-gateway-a netstat -i

# Analyze latency impact
docker exec host-a1 ping -c 100 10.0.0.10 | python3 /scripts/analyze-latency.py
```

## Learning Outcomes

After completing this demonstration, you'll understand:

1. **IPsec Architecture**: How security policies, associations, and protocols work together
2. **Policy Management**: Configuring SPD entries for different network scenarios
3. **SA Lifecycle**: Security association establishment, maintenance, and renewal
4. **Operating Modes**: When to use transport vs tunnel mode
5. **Performance Impact**: Understanding IPsec overhead and optimization techniques
6. **Enterprise Deployment**: Real-world IPsec configuration patterns
7. **Troubleshooting**: Common issues and debugging techniques

## Implementation Notes

### Educational vs Production

- **Educational Focus**: Simplified key management and logging for learning
- **Production Warning**: Real deployments require proper PKI, certificate management
- **Security Note**: Never use pre-shared keys or weak algorithms in production

### Protocol Compliance

- **RFC 4301**: Implements core security architecture and policy framework
- **Standards**: Compatible with industry-standard IPsec implementations
- **Interoperability**: Demonstrates integration with common VPN solutions

This demonstration provides comprehensive hands-on experience with IPsec security architecture, showing how RFC 4301 enables the secure network communications that power modern enterprise connectivity and VPN technologies.