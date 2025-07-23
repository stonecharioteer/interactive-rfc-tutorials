# RFC 2547: BGP/MPLS VPN Docker Example

This directory contains a Docker-based demonstration of BGP/MPLS VPN concepts from RFC 2547.

## What You'll Learn

- BGP/MPLS VPN architecture with PE, P, and CE routers
- Virtual Routing and Forwarding (VRF) isolation
- Route Distinguishers and Route Targets
- MPLS label distribution and forwarding
- Customer traffic separation and security

## Network Architecture

```
Customer A Sites:           Service Provider Core:          Customer B Sites:
                                                           
[CustomerA-HQ]              [PE1]━━━━━[P1]━━━━━[PE2]         [CustomerB-Main]
192.168.1.10 ───────────── VRF-A     MPLS Core    VRF-B ───────────── 172.16.1.10
                                                           
                                                           
[CustomerA-Branch]                                          [CustomerB-Remote]  
192.168.2.10 ───────────────────────────────────────────── 172.16.2.10
                            VRF-A                   VRF-B
```

## Components

- **PE Routers (PE1, PE2)**: Provider Edge routers maintaining customer VRFs
- **P Router**: Core MPLS router providing label-switched paths
- **Customer Sites**: Simulated customer networks with different address spaces
- **VPN Monitor**: Educational tools and demonstrations

## Quick Start

```bash
# Start the BGP/MPLS VPN demonstration
docker-compose up -d

# Wait for containers to initialize (30 seconds)
sleep 30

# Run the educational demonstration
docker exec -it bgp-mpls-monitor python3 /scripts/bgp-mpls-demo.py

# View logs from specific components
docker-compose logs -f pe1-router
docker-compose logs -f customer-a-hq

# Clean up
docker-compose down
```

## Key Learning Points

1. **VRF Isolation**: Each customer has separate routing tables
2. **Route Targets**: Control which routes are imported/exported between sites
3. **MPLS Labels**: Enable efficient forwarding through provider core
4. **BGP Extensions**: Carry VPN routes between PE routers
5. **Service Scalability**: Add new customers without affecting existing ones

## Educational Scenarios

### Test Customer Connectivity
```bash
# Customer A: HQ to Branch (should work)
docker exec -it customer-a-hq ping 192.168.2.10

# Customer B: Main to Remote (should work)  
docker exec -it customer-b-main ping 172.16.2.10

# Cross-customer access (should fail - VRF isolation)
docker exec -it customer-a-hq ping 172.16.1.10
```

### Examine VRF Tables
```bash
# View PE1 routing information
docker exec -it bgp-mpls-pe1 ip route show table all

# Check BGP VPN routes (if FRR is running)
docker exec -it bgp-mpls-pe1 vtysh -c "show bgp vpnv4 unicast"
```

### Monitor MPLS Traffic
```bash
# Capture MPLS traffic on core network
docker exec -it bgp-mpls-core tcpdump -i eth0 -n mpls

# Test with traffic generation
docker exec -it customer-a-hq ping -c 5 192.168.2.10
```

## Route Target Configuration

| Customer | Route Target | Import/Export | Sites |
|----------|--------------|---------------|-------|
| Customer A | 65001:100 | Import & Export | HQ, Branch |
| Customer B | 65001:200 | Import & Export | Main, Remote |

This ensures Customer A sites can only reach other Customer A sites, and similarly for Customer B.

## Advanced Exploration

### Custom Route Target Policies
```bash
# Modify route targets to create hub-and-spoke topology
# Hub: Import/Export both RTs
# Spokes: Import/Export unique RT + hub RT
```

### Quality of Service
```bash
# Apply different QoS policies per VRF
# Simulate guaranteed bandwidth for premium customers
```

### Multi-Protocol Support
```bash
# Add IPv6 VPN routes
# Demonstrate Layer 2 VPN concepts
```

## Troubleshooting

### Container Status
```bash
# Check all containers are running
docker-compose ps

# Restart specific service
docker-compose restart pe1-router
```

### Network Connectivity
```bash
# Test MPLS core connectivity
docker exec -it bgp-mpls-pe1 ping 10.0.0.2

# Verify interface configuration
docker exec -it bgp-mpls-pe1 ip addr show
```

### BGP/MPLS Issues
```bash
# Check routing daemon status
docker exec -it bgp-mpls-pe1 systemctl status frr

# View FRR logs
docker exec -it bgp-mpls-pe1 tail -f /var/log/frr/bgpd.log
```

This demonstration provides hands-on experience with BGP/MPLS VPN concepts that revolutionized service provider networking and remain fundamental to enterprise connectivity today.