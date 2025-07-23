# RFC 1034 DNS Demonstration

This Docker Compose setup demonstrates the hierarchical Domain Name System concepts from RFC 1034 (Domain Names - Concepts and Facilities) through interactive Python services.

## What This Demonstrates

### Core DNS Concepts from RFC 1034
- **Hierarchical Name Space**: Tree-structured domain organization
- **Distributed Authority**: Different servers responsible for different zones
- **Caching**: Local storage of DNS responses for performance
- **Resource Records**: Different types of DNS data (A, NS, MX, TXT, CNAME)
- **Recursive Resolution**: Step-by-step query process from root to authoritative servers

### Observable Behaviors
- Complete DNS resolution process (Root → TLD → Authoritative)
- DNS caching effects on query performance  
- Different DNS record types and their purposes
- DNS error handling (NXDOMAIN responses)
- Zone delegation and authority

## Services Architecture

### Root DNS Server (`root-dns`)
- **Port**: 5300/udp
- **Role**: Simulates internet root DNS servers
- **Responsibility**: Delegates .com queries to TLD servers
- **Demonstrates**: Top level of DNS hierarchy

### TLD DNS Server (`tld-dns`) 
- **Port**: 5301/udp
- **Role**: Simulates .com Top Level Domain servers
- **Responsibility**: Delegates example.com to authoritative servers
- **Demonstrates**: Second level of DNS hierarchy

### Authoritative DNS Server (`authoritative-dns`)
- **Port**: 5302/udp  
- **Role**: Authoritative server for example.com zone
- **Responsibility**: Provides final answers for example.com subdomains
- **Demonstrates**: Final authority in DNS hierarchy

### Recursive Resolver (`recursive-resolver`)
- **Port**: 5303/udp
- **Role**: Performs recursive queries on behalf of clients
- **Responsibility**: Queries root, TLD, and authoritative servers
- **Demonstrates**: How real-world DNS resolvers work

### DNS Client (`dns-client`)
- **Role**: Educational client showing DNS concepts
- **Demonstrates**: 
  - Manual hierarchical resolution
  - Different record type queries
  - Caching behavior observation
  - Error handling examples

### DNS Monitor (`dns-monitor`)
- **Role**: Network traffic analysis and logging
- **Demonstrates**: DNS packet flow between servers
- **Capabilities**: Real-time DNS query monitoring

## Running the Demo

### Prerequisites
- Docker and Docker Compose
- At least 2GB RAM available for all services

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
docker compose logs -f dns-client
docker compose logs -f recursive-resolver
docker compose logs -f root-dns
```

## Expected Output

The demonstration shows:

1. **Hierarchical Resolution Process**:
   - Client queries recursive resolver
   - Resolver queries root server
   - Root refers to .com TLD servers
   - TLD refers to example.com authoritative servers
   - Authoritative server provides final answer

2. **DNS Record Types**:
   - A records (IPv4 addresses)
   - NS records (name server delegation)
   - MX records (mail server information)
   - TXT records (text information)
   - CNAME records (canonical name aliases)

3. **Caching Behavior**:
   - First query takes longer (cache miss)
   - Subsequent queries are faster (cache hit)
   - TTL countdown for cache expiration

4. **Error Handling**:
   - NXDOMAIN responses for non-existent domains
   - Proper DNS error codes and messages

## Educational Value

### For Understanding DNS Hierarchy:
- See the complete resolution process step-by-step
- Understand how delegation works at each level
- Learn about different server roles and responsibilities

### For Network Programming:
- DNS message format and parsing
- UDP socket programming for DNS
- Error handling and timeout management
- Caching implementation strategies

### For System Administration:
- DNS server configuration concepts
- Zone management and delegation
- Troubleshooting DNS resolution issues
- Performance optimization through caching

## Customization

### Environment Variables

**All Services**:
- `LOG_LEVEL`: Logging verbosity (default: INFO)

**DNS Client**:
- `RESOLVER_IP`: Recursive resolver address (default: 172.25.0.13)
- `ROOT_IP`: Root server address (default: 172.25.0.10)
- `TLD_IP`: TLD server address (default: 172.25.0.11)
- `AUTH_IP`: Authoritative server address (default: 172.25.0.12)

### Testing Different Domains

The servers are configured with example domains:
- `example.com` - Primary test domain
- `www.example.com` - Web server subdomain
- `mail.example.com` - Mail server subdomain
- `ftp.example.com` - FTP server subdomain

## Key Learning Points from RFC 1034

1. **Hierarchical Organization**: DNS uses a tree structure to organize names
2. **Distributed Management**: No single point of control or failure
3. **Caching for Performance**: Local storage dramatically improves response times
4. **Flexible Record Types**: Support for various types of information beyond IP addresses
5. **Scalable Architecture**: Design that scales from small networks to the global internet

## Advanced Exploration

### Manual DNS Queries

You can also perform manual queries using dig:

```bash
# Query the recursive resolver
docker compose exec dns-client dig @172.25.0.13 www.example.com

# Query root server directly  
docker compose exec dns-client dig @172.25.0.10 www.example.com

# Query TLD server directly
docker compose exec dns-client dig @172.25.0.11 www.example.com

# Query authoritative server directly
docker compose exec dns-client dig @172.25.0.12 www.example.com
```

### Different Record Types

```bash
# A record (IPv4 address)
docker compose exec dns-client dig @172.25.0.13 example.com A

# NS records (name servers)
docker compose exec dns-client dig @172.25.0.13 example.com NS

# MX records (mail servers)  
docker compose exec dns-client dig @172.25.0.13 example.com MX

# TXT records (text information)
docker compose exec dns-client dig @172.25.0.13 example.com TXT
```

## Troubleshooting

### Connection Issues
- Ensure no other services are using ports 5300-5303
- Check Docker network connectivity between containers
- Verify DNS server startup order (dependencies)

### Resolution Failures
- Check that all DNS servers are running and healthy
- Verify network connectivity between DNS hierarchy levels
- Review server logs for configuration errors

### Performance Issues
- Monitor resource usage (DNS can be CPU intensive)
- Check for DNS query loops or excessive recursion
- Review caching configuration and TTL values

## Files Description

- `docker-compose.yml`: Multi-service DNS hierarchy orchestration
- `shared_dns_utils.py`: Common DNS protocol implementation utilities
- `dns_client.py`: Educational DNS client with demonstrations
- `Dockerfile.*`: Container build configurations for each service type
- `README.md`: This comprehensive guide

## From HOSTS.TXT to DNS

This demonstration shows how RFC 1034 solved the internet's naming crisis:

**Before DNS (HOSTS.TXT era)**:
- Single centralized file for all internet hosts
- Manual distribution and updates
- No hierarchy or delegation
- Frequent naming conflicts
- Unsustainable for growth

**After DNS (RFC 1034)**:
- Hierarchical, distributed naming system
- Automatic caching and updates
- Clear authority delegation
- Namespace collision avoidance
- Scales to billions of domains

This hands-on demonstration provides direct experience with the revolutionary concepts that enabled the modern internet's naming infrastructure.

## Further Reading

- [RFC 1034](https://tools.ietf.org/rfc/rfc1034.txt) - Domain Names - Concepts and Facilities
- [RFC 1035](https://tools.ietf.org/rfc/rfc1035.txt) - Domain Names - Implementation and Specification