# RFC 4364: BGP/MPLS IP VPN - Docker Demonstration

This Docker demonstration provides a complete enterprise-grade BGP/MPLS IP VPN environment implementing RFC 4364 specifications. Experience how service providers deliver secure, scalable VPN services to enterprise customers.

## What This Demonstrates

This environment simulates a full service provider MPLS network with:

- **Complete BGP/MPLS IP VPN architecture**: PE routers, P routers, and CE routers
- **VRF isolation**: Separate routing tables for different customers
- **MP-BGP route distribution**: VPNv4 route exchange between PE routers
- **Route target policies**: Controlling route import/export between VPN sites
- **Service orchestration**: Automated VPN service provisioning
- **Network monitoring**: Real-time visibility into VPN operations

## Quick Start

```bash
# Start the complete BGP/MPLS IP VPN environment
docker compose up -d

# Access the VPN service orchestrator
open https://localhost:8443

# View network monitoring dashboard
open http://localhost:3000

# Monitor BGP/MPLS operations
docker compose logs -f vpn-orchestrator
```

## Network Architecture

### Service Provider Infrastructure

- **PE Routers** (Provider Edge): 3 routers connecting customer sites
  - PE1 (port 8181): Customer A Site 1 connection
  - PE2 (port 8182): Customer A Site 2 connection  
  - PE3 (port 8183): Customer B Site 1 connection

- **P Router** (Provider Core): MPLS label switching core router
- **Route Reflector**: Centralized MP-BGP route distribution

### Customer Equipment

- **Customer A**: Two sites with inter-site connectivity
  - CE-A-Site1 (port 8191): Headquarters location
  - CE-A-Site2 (port 8192): Branch office location

- **Customer B**: Single site deployment
  - CE-B-Site1 (port 8193): Main office location

### Management and Monitoring

- **VPN Orchestrator** (ports 8080, 8443): Service provisioning and management
- **Network Monitor** (port 3000): Real-time network visibility
- **Traffic Generator**: Automated testing and validation

## Testing Scenarios

### 1. VPN Service Provisioning

```bash
# Create new VPN service for Customer A
curl -X POST https://localhost:8443/api/vpn/services \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "GlobalCorp",
    "topology": "hub-spoke",
    "sites": [
      {"name": "HQ-NYC", "subnet": "10.1.0.0/16"},
      {"name": "Branch-Boston", "subnet": "10.10.0.0/16"}
    ]
  }'

# View service status
curl https://localhost:8443/api/vpn/services/GlobalCorp
```

### 2. Route Target Analysis

```bash
# View route target configuration
curl https://localhost:8443/api/vpn/route-targets

# Analyze route import/export policies
curl https://localhost:8443/api/vpn/policies/customer-a
```

### 3. Traffic Flow Testing

```bash
# Test connectivity between Customer A sites
docker exec rfc4364-traffic /app/test-connectivity.sh customer-a-inter-site

# Test traffic isolation between customers
docker exec rfc4364-traffic /app/test-isolation.sh customer-a customer-b

# Performance testing
docker exec rfc4364-traffic /app/performance-test.sh --duration 60s
```

## Real-World Enterprise Applications

This demonstration shows how RFC 4364 BGP/MPLS IP VPNs enable:

### Fortune 500 Enterprises
- **Global connectivity**: Secure connections between worldwide offices
- **Branch networking**: Reliable connectivity for retail locations
- **Data center interconnect**: High-performance site-to-site connections
- **Cloud on-ramp**: Hybrid cloud connectivity strategies

### Service Provider Business Models
- **Managed WAN services**: Enterprise network outsourcing
- **Cloud connectivity**: Direct connections to AWS, Azure, Google Cloud
- **Internet breakout**: Centralized or distributed internet access
- **QoS guarantees**: Service level agreements with performance commitments

## Key RFC 4364 Features Demonstrated

### 1. VRF (Virtual Routing and Forwarding)
- **Customer isolation**: Separate routing tables per customer
- **Route leaking**: Controlled route sharing between VRFs
- **Overlapping address spaces**: Multiple customers using same IP ranges

### 2. MP-BGP VPNv4 Routes
- **Route distinguisher**: Unique identification of customer routes
- **Route targets**: Control of route import/export policies
- **Next-hop resolution**: MPLS label assignment and distribution

### 3. Two-Level MPLS Labels
- **Transport label**: IGP-based forwarding through provider core
- **VPN label**: Customer-specific forwarding at PE routers
- **Label stack operations**: Push, swap, and pop operations

## Service Management Interface

### VPN Orchestrator Dashboard (port 8443)

Access comprehensive service management:
- **Service topology visualization**: Interactive network diagrams
- **Configuration management**: Automated router configuration deployment
- **SLA monitoring**: Real-time performance and availability metrics
- **Customer portal**: Self-service provisioning and monitoring

### Network Monitoring (port 3000)

View operational metrics:
- **BGP session status**: MP-BGP neighbor relationships
- **MPLS forwarding tables**: Label switching operations
- **VRF statistics**: Per-customer traffic and route counts
- **Performance dashboards**: Latency, throughput, and availability

## Log Analysis and Troubleshooting

### BGP/MPLS Operations

```bash
# Monitor MP-BGP route exchange
docker compose logs -f route-reflector

# View VRF configuration deployment
docker compose logs -f pe-router-1

# Analyze MPLS label operations
docker compose logs -f p-router
```

### Service Provisioning

```bash
# Track service orchestration
docker compose logs -f vpn-orchestrator

# Monitor configuration deployment
docker compose logs -f pe-router-2

# View customer equipment status
docker compose logs -f ce-customer-a-site1
```

## Educational Value

### Network Engineering Skills
- **MPLS fundamentals**: Label switching and distribution protocols
- **BGP advanced features**: Route reflectors, communities, and policies
- **VPN technologies**: Layer 3 VPN design and implementation
- **Service provider operations**: Enterprise service delivery

### Business Understanding
- **Enterprise networking needs**: Multi-site connectivity requirements
- **Service provider models**: Revenue generation through managed services
- **Technology evolution**: From Frame Relay/ATM to modern MPLS VPNs
- **Cloud integration**: Hybrid connectivity strategies

## Performance Testing

### Inter-Site Connectivity

```bash
# Test hub-spoke connectivity
./test-scripts/hub-spoke-connectivity.sh

# Measure latency and throughput
./test-scripts/performance-baseline.sh

# Simulate link failures
./test-scripts/failover-testing.sh
```

## Clean Up

```bash
# Stop all services gracefully
docker compose down

# Remove all data and configurations
docker compose down -v

# Clean up images
docker compose down --rmi all
```

## Industry Context

This demonstration represents the technology that powers:

- **95% of Fortune 500 WAN connectivity**: Enterprise backbone networks
- **$45+ billion market**: Annual service provider MPLS VPN revenue
- **Mission-critical applications**: ERP, VoIP, video conferencing
- **Digital transformation**: Foundation for cloud and SD-WAN migration

## Learning Outcomes

After completing this demonstration, you'll understand:

1. **RFC 4364 architecture**: Complete BGP/MPLS IP VPN implementation
2. **Service provider operations**: How enterprise VPN services are delivered
3. **Network troubleshooting**: Debugging VPN connectivity issues
4. **Technology evolution**: Path from legacy WAN to modern networking

This hands-on experience provides deep insight into the enterprise networking technologies that power global business operations.