# RFC 2684: ATM Multiprotocol Encapsulation Docker Example

This directory contains a Docker-based demonstration of ATM multiprotocol encapsulation concepts from RFC 2684.

## What You'll Learn

- ATM cell structure and 53-byte format
- LLC/SNAP vs VC-based multiplexing methods
- AAL5 (ATM Adaptation Layer 5) segmentation
- IP over ATM encapsulation
- Ethernet bridging over ATM networks
- ATM Quality of Service concepts

## Network Architecture

```
              ATM Core Network (10.1.0.0/24)
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  [ATM Switch] ←─VCC─→ [IP Router] ←─VCC─→ [Bridge] │
    │   (10.1.0.1)         (10.1.0.10)       (10.1.0.20) │
    │                           │                 │     │
    └───────────────────────────┼─────────────────┼─────┘
                                │                 │
                     ┌──────────▼──────────┐     │
                     │   IP Network        │ ┌───▼────┐
                     │ (192.168.10.0/24)   │ │ LAN1   │
                     │                     │ │(.20/24)│
                     │   [IP Host]         │ │        │
                     │  (192.168.10.10)    │ │[Host1] │
                     └─────────────────────┘ └────────┘
```

## Components

- **ATM Switch**: Core ATM switching fabric
- **IP Router**: Demonstrates IP over ATM using RFC 2684
- **Ethernet Bridge**: Shows Ethernet LAN bridging over ATM
- **ATM Clients**: Direct ATM endpoint connections
- **Network Hosts**: End systems using ATM transport

## Quick Start

```bash
# Start the ATM demonstration
docker-compose up -d

# Wait for initialization
sleep 20

# Run the educational demonstration
docker exec -it atm-monitor python3 /scripts/atm-demo.py

# View specific component logs
docker-compose logs -f atm-switch-core

# Clean up
docker-compose down
```

## Key Learning Points

1. **ATM Cell Structure**: Fixed 53-byte cells (5-byte header + 48-byte payload)
2. **Encapsulation Methods**: LLC/SNAP for multiple protocols, VC-Mux for efficiency
3. **AAL5 Adaptation**: Segments variable-length data into ATM cells
4. **Virtual Circuits**: VPI/VCI addressing for connection-oriented service
5. **Quality of Service**: Multiple service categories with guaranteed performance

## Encapsulation Methods Comparison

| Method | Header Overhead | Protocol Support | VCC Usage | Best For |
|--------|-----------------|------------------|-----------|----------|
| LLC/SNAP | 8 bytes/packet | Multiple per VCC | Efficient | Mixed traffic |
| VC-Multiplexed | 0 bytes/packet | One per VCC | Many VCCs | Single protocol |

## ATM Cell Efficiency Analysis

| Packet Size | Cells Needed | ATM Bytes | Efficiency |
|-------------|--------------|-----------|------------|
| 64 bytes | 2 cells | 106 bytes | 60.4% |
| 256 bytes | 6 cells | 318 bytes | 80.5% |
| 1500 bytes | 32 cells | 1696 bytes | 88.4% |

*Note: Includes 8-byte AAL5 trailer overhead*

## Educational Scenarios

### Test IP over ATM
```bash
# Test IP connectivity through ATM network
docker exec -it atm-client1 ping 192.168.10.10

# Monitor ATM traffic
docker exec -it atm-switch-core tcpdump -i eth0 -n
```

### Examine ATM Cell Processing
```bash
# View simulated ATM cell segmentation
docker exec -it atm-ip-router python3 /scripts/cell-analyzer.py

# Show AAL5 frame processing
docker exec -it atm-switch-core python3 /scripts/aal5-demo.py
```

### Test Ethernet Bridging
```bash
# Test inter-LAN connectivity via ATM bridge
docker exec -it ethernet-host1 ping 192.168.21.10

# Show bridge learning table
docker exec -it atm-ethernet-bridge brctl show
```

## Virtual Circuit Configuration

| Service | VPI | VCI | Encapsulation | Purpose |
|---------|-----|-----|---------------|---------|
| IP_Service | 1 | 100 | LLC/SNAP | IP routing |
| Ethernet_Bridge | 2 | 200 | LLC/SNAP | LAN bridging |
| Client1_IP | 1 | 101 | VC-Mux | Direct IP |
| Client2_IP | 1 | 102 | VC-Mux | Direct IP |

## ATM Quality of Service

### Service Categories
- **CBR**: Constant Bit Rate (real-time voice/video)
- **VBR-RT**: Variable Bit Rate Real-Time (video conferencing)
- **VBR-NRT**: Variable Bit Rate Non-Real-Time (multimedia)
- **ABR**: Available Bit Rate (adaptive applications)
- **UBR**: Unspecified Bit Rate (best effort)
- **GFR**: Guaranteed Frame Rate (frame-based QoS)

### QoS Parameters
```bash
# Configure VCC with specific QoS
# PCR (Peak Cell Rate): 155520 cells/sec (OC-3)
# SCR (Sustained Cell Rate): 77760 cells/sec
# MBS (Maximum Burst Size): 1000 cells
# CLP (Cell Loss Priority): 0 (high) or 1 (low)
```

## Advanced Exploration

### Protocol Analysis
```bash
# Examine different protocol encapsulations
docker exec -it atm-monitor wireshark-cli -i eth0 -f "atm"

# Compare LLC/SNAP vs VC-Mux efficiency
docker exec -it atm-switch-core python3 /scripts/encap-comparison.py
```

### Traffic Engineering
```bash
# Simulate different traffic loads
docker exec -it atm-client1 iperf3 -c 192.168.10.10 -t 60

# Monitor cell loss and delays
docker exec -it atm-switch-core tc qdisc show
```

### Network Troubleshooting
```bash
# Check Virtual Circuit status
docker exec -it atm-switch-core cat /proc/net/atm/vcc

# Verify AAL5 statistics
docker exec -it atm-ip-router cat /proc/net/atm/aal5
```

## Historical Context

ATM was revolutionary in the 1990s because it provided:

1. **Guaranteed QoS**: Connection-oriented service with bandwidth guarantees
2. **Unified Transport**: Single network for voice, video, and data
3. **Scalable Switching**: Hardware-based cell switching at high speeds
4. **Traffic Engineering**: Explicit path control and resource allocation

RFC 2684 was crucial because it:
- Enabled IP networks to use ATM infrastructure
- Provided efficient encapsulation for multiple protocols
- Maintained ATM's QoS benefits for data applications
- Created the foundation for modern MPLS concepts

## Modern Relevance

While Ethernet has largely replaced ATM, RFC 2684's concepts live on in:

- **MPLS**: Label switching inspired by ATM VPI/VCI
- **SDN**: Centralized control similar to ATM network management
- **QoS**: Traffic engineering concepts from ATM service categories
- **Virtualization**: VRF and network slicing concepts

This demonstration helps understand how protocol encapsulation and quality-of-service guarantees work in multi-service networks—principles that remain essential in modern networking.