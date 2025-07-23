# RFC 7748 & RFC 8439: Modern Cryptographic Foundations

This directory contains a Docker-based demonstration of the cryptographic foundations that power WireGuard: Curve25519 key exchange (RFC 7748) and ChaCha20-Poly1305 authenticated encryption (RFC 8439).

## What You'll Learn

- How Curve25519 enables fast, secure key exchange
- ChaCha20-Poly1305 AEAD (Authenticated Encryption with Associated Data)
- Why these algorithms were chosen for WireGuard
- Performance characteristics of modern software-optimized cryptography
- Complete cryptographic protocol implementation

## Architecture Overview

```
                Modern Cryptographic Protocol Demo
    ┌─────────────────────────────────────────────────────────────┐
    │                 Crypto Network (10.2.0.0/24)               │
    │                                                             │
    │  [Server]        [Alice]        [Bob]        [Monitor]      │
    │  10.2.0.10      10.2.0.101    10.2.0.102    10.2.0.250     │
    │                                                             │
    │  Key Exchange + Encrypted Communication + Performance       │
    └─────────────────────────────────────────────────────────────┘
```

## Components

- **Crypto Server**: Facilitates key exchange and encrypted messaging
- **Alice & Bob**: Demonstrate peer-to-peer cryptographic communication  
- **Crypto Monitor**: Real-time visualization of cryptographic operations
- **Benchmark**: Performance analysis and algorithm comparison

## Quick Start

```bash
# Start the cryptographic demonstration
docker-compose up -d

# Wait for initialization
sleep 10

# Run the complete WireGuard crypto demo
docker exec -it wireguard-crypto-server python3 /scripts/wireguard-crypto-demo.py

# View real-time crypto operations
open http://localhost:3000

# Clean up
docker-compose down
```

## Key Learning Points

### 1. **Curve25519 (RFC 7748)**
- Modern elliptic curve optimized for software performance
- X25519 key agreement function for Diffie-Hellman exchange
- Provides ~128-bit security with 32-byte keys
- Resistant to timing attacks and implementation vulnerabilities

### 2. **ChaCha20-Poly1305 (RFC 8439)**
- Stream cipher + message authenticator = AEAD
- Optimized for software implementation (no hardware acceleration needed)
- Excellent performance on mobile ARM processors
- Constant-time operations prevent side-channel attacks

### 3. **WireGuard Integration**
- Curve25519 for initial key exchange
- ChaCha20-Poly1305 for all data encryption
- Session key derivation using HKDF
- Counter-based nonces prevent replay attacks

## Educational Scenarios

### Demonstrate Key Exchange
```bash
# Show X25519 key agreement process
docker exec -it wireguard-crypto-alice python3 -c "
from scripts.wireguard_crypto_demo import WireGuardCryptoDemo
demo = WireGuardCryptoDemo()
demo.demonstrate_key_exchange()
"
```

### Test Authenticated Encryption
```bash
# Demonstrate ChaCha20-Poly1305 AEAD
docker exec -it wireguard-crypto-bob python3 -c "
from scripts.wireguard_crypto_demo import WireGuardCryptoDemo  
demo = WireGuardCryptoDemo()
demo.demonstrate_aead_encryption()
"
```

### Performance Benchmarking
```bash
# Run cryptographic performance analysis
docker exec -it crypto-benchmark python3 /scripts/crypto-benchmarks.py

# Compare with traditional algorithms
docker exec -it crypto-benchmark python3 /benchmarks/algorithm-comparison.py
```

## Algorithm Comparison

| Algorithm | Key Size | Security Level | Software Speed | Mobile Performance |
|-----------|----------|----------------|----------------|--------------------|
| **Curve25519** | 32 bytes | ~128-bit | Very Fast | Excellent |
| NIST P-256 | 32 bytes | ~128-bit | Medium | Poor |
| RSA-3072 | 384 bytes | ~128-bit | Slow | Very Poor |

| Algorithm | Throughput | Hardware Req | Timing Safety | Implementation |
|-----------|------------|--------------|---------------|----------------|
| **ChaCha20-Poly1305** | 1-4 GB/s | None | Safe | Simple |
| AES-GCM | 0.5-3 GB/s | AES-NI | Vulnerable | Complex |

## Why WireGuard Chose These Algorithms

### Performance Benefits
- **Software Optimization**: No special CPU instructions required
- **Mobile First**: Excellent ARM processor performance
- **Battery Efficiency**: Lower CPU usage extends battery life
- **Scalability**: Servers can handle more concurrent connections

### Security Advantages
- **Modern Design**: Built with current cryptographic best practices
- **Implementation Safety**: Constant-time operations prevent attacks
- **Simplicity**: Fewer lines of code = smaller attack surface
- **No Crypto-Agility**: Fixed algorithms eliminate negotiation vulnerabilities

### Real-World Impact
- **Multi-Gigabit VPN**: WireGuard achieves exceptional throughput
- **Mobile VPN**: Smooth operation on smartphones and tablets
- **IoT Deployment**: Works well on resource-constrained devices
- **Enterprise Scale**: High-performance VPN infrastructure

## Advanced Exploration

### Custom Cryptographic Protocols
```bash
# Implement your own AEAD construction
docker exec -it crypto-benchmark python3 /scripts/custom-aead-demo.py

# Test different key derivation methods
docker exec -it wireguard-crypto-server python3 /scripts/kdf-comparison.py
```

### Side-Channel Analysis
```bash
# Demonstrate timing attack resistance
docker exec -it crypto-monitor python3 /monitoring/timing-analysis.py

# Show constant-time operation benefits
docker exec -it crypto-benchmark python3 /benchmarks/side-channel-demo.py
```

### Protocol Security Analysis
```bash
# Test message authentication
docker exec -it wireguard-crypto-alice python3 /scripts/auth-test.py

# Demonstrate forward secrecy
docker exec -it wireguard-crypto-bob python3 /scripts/forward-secrecy-demo.py
```

## Implementation Notes

### Production vs Educational Code
- **Educational**: Simplified implementations for learning
- **Production**: Use `cryptography` library for real applications
- **Never**: Use educational crypto implementations in production

### Security Considerations
- **Key Management**: Proper key generation and storage
- **Nonce Uniqueness**: Counter-based nonces prevent reuse
- **Perfect Forward Secrecy**: New keys for each session
- **Authentication**: Always verify before decryption

### Performance Optimization
- **Vectorization**: Modern CPUs can parallelize operations
- **Memory Access**: Avoid data-dependent memory patterns
- **Batch Processing**: Process multiple packets together
- **Hardware Features**: Use available CPU optimizations

## Modern Relevance

These RFCs represent the current state-of-the-art in practical cryptography:

### Industry Adoption
- **WireGuard**: Primary VPN protocol using these algorithms
- **TLS 1.3**: ChaCha20-Poly1305 for mobile optimization
- **Signal Protocol**: Messaging security with Curve25519
- **SSH**: Modern configurations prefer these algorithms

### Future-Proofing
- **Post-Quantum**: Preparing for quantum-resistant alternatives
- **Performance**: Continued optimization for new hardware
- **Standardization**: Ongoing IETF protocol development
- **Best Practices**: Influence on next-generation protocols

This demonstration provides hands-on experience with the cryptographic foundations that make modern VPN technology both secure and performant, showing why WireGuard represents a significant advancement in VPN protocol design.