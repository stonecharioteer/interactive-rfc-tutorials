#!/usr/bin/env python3
"""
RFC 1034 DNS Client Demonstration

This client demonstrates:
- Hierarchical DNS resolution process
- Direct queries to different server types
- DNS message parsing and display
- Caching behavior observation
"""
import socket
import time
import os
import sys
from typing import List, Optional
from shared_dns_utils import *


class DNSClient:
    def __init__(self, resolver_ip='172.25.0.13', root_ip='172.25.0.10', 
                 tld_ip='172.25.0.11', auth_ip='172.25.0.12'):
        self.resolver_ip = resolver_ip
        self.root_ip = root_ip
        self.tld_ip = tld_ip
        self.auth_ip = auth_ip
        self.cache = DNSCache()
        
    def send_dns_query(self, server_ip: str, domain: str, qtype: int = DNSType.A.value, 
                      timeout: float = 5.0) -> Optional[DNSMessage]:
        """Send a DNS query to a specific server"""
        try:
            # Create DNS query
            transaction_id = generate_transaction_id()
            flags = 0x0100  # Standard query with recursion desired
            
            # Build query packet
            header = create_dns_header(transaction_id, flags, 1, 0, 0, 0)
            question = create_dns_question(domain, qtype)
            query_packet = header + question
            
            # Send query
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(timeout)
            
            start_time = time.time()
            sock.sendto(query_packet, (server_ip, 53))
            
            # Receive response
            response_data, _ = sock.recvfrom(4096)
            response_time = calculate_response_time(start_time)
            
            sock.close()
            
            # Parse response
            response = parse_dns_message(response_data)
            
            log_message("DNS-CLIENT", f"Query to {server_ip} completed in {response_time:.1f}ms")
            
            return response
            
        except socket.timeout:
            log_message("DNS-CLIENT", f"Query to {server_ip} timed out", "WARN")
            return None
        except Exception as e:
            log_message("DNS-CLIENT", f"Query to {server_ip} failed: {e}", "ERROR")
            return None
    
    def demonstrate_recursive_resolution(self, domain: str):
        """Demonstrate the full recursive DNS resolution process"""
        log_message("DNS-CLIENT", f"🔍 Demonstrating recursive resolution for: {domain}")
        log_message("DNS-CLIENT", "=" * 60)
        
        # Step 1: Query recursive resolver (normal client behavior)
        log_message("DNS-CLIENT", "📞 Step 1: Querying recursive resolver (normal client behavior)")
        response = self.send_dns_query(self.resolver_ip, domain)
        
        if response and response.answers:
            log_message("DNS-CLIENT", f"✅ Recursive resolver returned final answer:")
            for answer in response.answers:
                record_data = format_dns_record_data(answer)
                log_message("DNS-CLIENT", f"   {answer.name} {answer.ttl}s {get_dns_type_name(answer.rtype)} {record_data}")
        
        log_message("DNS-CLIENT", "")
        log_message("DNS-CLIENT", "🔍 Now let's see what the resolver did behind the scenes...")
        time.sleep(2)
        
        # Step 2: Manual hierarchical resolution
        self.demonstrate_hierarchical_resolution(domain)
    
    def demonstrate_hierarchical_resolution(self, domain: str):
        """Demonstrate manual step-by-step hierarchical resolution"""
        log_message("DNS-CLIENT", "🌳 Manual Hierarchical Resolution Process:")
        log_message("DNS-CLIENT", "-" * 50)
        
        # Step A: Query root servers
        log_message("DNS-CLIENT", f"📡 Step A: Asking root servers about '{domain}'")
        root_response = self.send_dns_query(self.root_ip, domain)
        
        if root_response:
            log_message("DNS-CLIENT", "🌐 Root server response:")
            self.display_dns_response(root_response, "ROOT")
            
            # Root should refer us to TLD servers
            if root_response.authority:
                log_message("DNS-CLIENT", "   Root says: 'I don't know, but ask the .com servers'")
        
        time.sleep(2)
        
        # Step B: Query TLD servers
        log_message("DNS-CLIENT", f"📡 Step B: Asking .com TLD servers about '{domain}'")
        tld_response = self.send_dns_query(self.tld_ip, domain)
        
        if tld_response:
            log_message("DNS-CLIENT", "🏢 TLD server response:")
            self.display_dns_response(tld_response, "TLD")
            
            if tld_response.authority:
                log_message("DNS-CLIENT", "   TLD says: 'I don't know, but ask the example.com servers'")
        
        time.sleep(2)
        
        # Step C: Query authoritative servers
        log_message("DNS-CLIENT", f"📡 Step C: Asking authoritative servers for '{domain}'")
        auth_response = self.send_dns_query(self.auth_ip, domain)
        
        if auth_response:
            log_message("DNS-CLIENT", "🎯 Authoritative server response:")
            self.display_dns_response(auth_response, "AUTHORITATIVE")
            
            if auth_response.answers:
                log_message("DNS-CLIENT", "   Authoritative server says: 'Here's the final answer!'")
        
        log_message("DNS-CLIENT", "")
        log_message("DNS-CLIENT", "✅ Hierarchical resolution complete!")
    
    def display_dns_response(self, response: DNSMessage, server_type: str):
        """Display DNS response in a readable format"""
        flags_str = format_dns_flags(response.flags)
        log_message("DNS-CLIENT", f"   Transaction ID: {response.transaction_id}")
        log_message("DNS-CLIENT", f"   Flags: {flags_str}")
        
        if response.questions:
            log_message("DNS-CLIENT", "   Questions:")
            for q in response.questions:
                log_message("DNS-CLIENT", f"     {q.name} {get_dns_type_name(q.qtype)}")
        
        if response.answers:
            log_message("DNS-CLIENT", "   Answers:")
            for answer in response.answers:
                record_data = format_dns_record_data(answer)
                log_message("DNS-CLIENT", f"     {answer.name} {answer.ttl}s {get_dns_type_name(answer.rtype)} {record_data}")
        
        if response.authority:
            log_message("DNS-CLIENT", "   Authority Records:")
            for auth in response.authority:
                record_data = format_dns_record_data(auth)
                log_message("DNS-CLIENT", f"     {auth.name} {auth.ttl}s {get_dns_type_name(auth.rtype)} {record_data}")
        
        if response.additional:
            log_message("DNS-CLIENT", "   Additional Records:")
            for add in response.additional:
                record_data = format_dns_record_data(add)
                log_message("DNS-CLIENT", f"     {add.name} {add.ttl}s {get_dns_type_name(add.rtype)} {record_data}")
        
        log_message("DNS-CLIENT", "")
    
    def demonstrate_different_record_types(self, domain: str):
        """Demonstrate querying different DNS record types"""
        log_message("DNS-CLIENT", f"📋 Querying different record types for: {domain}")
        log_message("DNS-CLIENT", "=" * 50)
        
        record_types = [
            (DNSType.A.value, "A (IPv4 Address)"),
            (DNSType.NS.value, "NS (Name Server)"),
            (DNSType.MX.value, "MX (Mail Exchange)"),
            (DNSType.TXT.value, "TXT (Text Records)"),
            (DNSType.CNAME.value, "CNAME (Canonical Name)")
        ]
        
        for rtype, description in record_types:
            log_message("DNS-CLIENT", f"🔍 Querying {description}:")
            response = self.send_dns_query(self.resolver_ip, domain, rtype)
            
            if response and response.answers:
                for answer in response.answers:
                    record_data = format_dns_record_data(answer)
                    log_message("DNS-CLIENT", f"   ✅ {answer.name} {get_dns_type_name(answer.rtype)} {record_data}")
            else:
                log_message("DNS-CLIENT", "   ❌ No records found")
            
            time.sleep(1)
        
        log_message("DNS-CLIENT", "")
    
    def demonstrate_caching_behavior(self, domain: str):
        """Demonstrate DNS caching behavior"""
        log_message("DNS-CLIENT", f"⚡ Demonstrating DNS caching for: {domain}")
        log_message("DNS-CLIENT", "=" * 40)
        
        queries = 3
        for i in range(queries):
            log_message("DNS-CLIENT", f"🔄 Query #{i+1}:")
            
            start_time = time.time()
            response = self.send_dns_query(self.resolver_ip, domain)
            
            if response and response.answers:
                ttl = response.answers[0].ttl
                record_data = format_dns_record_data(response.answers[0])
                log_message("DNS-CLIENT", f"   Answer: {response.answers[0].name} -> {record_data}")
                log_message("DNS-CLIENT", f"   TTL: {ttl} seconds (cache expires in {ttl}s)")
                
                if i == 0:
                    log_message("DNS-CLIENT", "   Status: Fresh lookup (cache miss)")
                else:
                    log_message("DNS-CLIENT", "   Status: Likely cached (much faster response)")
            
            if i < queries - 1:
                log_message("DNS-CLIENT", "   Waiting 2 seconds before next query...")
                time.sleep(2)
        
        log_message("DNS-CLIENT", "")
    
    def run_demonstration(self):
        """Run the complete DNS demonstration"""
        log_message("DNS-CLIENT", "🎯 RFC 1034 DNS Concepts Demonstration")
        log_message("DNS-CLIENT", "Demonstrating: Hierarchical resolution, record types, caching")
        log_message("DNS-CLIENT", "=" * 70)
        
        # Wait for servers to be ready
        log_message("DNS-CLIENT", "⏳ Waiting for DNS servers to be ready...")
        time.sleep(10)
        
        try:
            # Test domain
            test_domain = "www.example.com"
            
            # Demonstration 1: Recursive resolution
            self.demonstrate_recursive_resolution(test_domain)
            time.sleep(3)
            
            # Demonstration 2: Different record types
            self.demonstrate_different_record_types("example.com")
            time.sleep(3)
            
            # Demonstration 3: Caching behavior
            self.demonstrate_caching_behavior("www.example.com")
            time.sleep(3)
            
            # Demonstration 4: NXDOMAIN (non-existent domain)
            log_message("DNS-CLIENT", "❓ Testing non-existent domain:")
            log_message("DNS-CLIENT", "=" * 35)
            
            nonexistent = "nonexistent.example.com"
            response = self.send_dns_query(self.resolver_ip, nonexistent)
            
            if response:
                flags_str = format_dns_flags(response.flags)
                if response.flags & 0xF == 3:  # NXDOMAIN
                    log_message("DNS-CLIENT", f"✅ Correctly received NXDOMAIN for {nonexistent}")
                else:
                    log_message("DNS-CLIENT", f"🤔 Unexpected response: {flags_str}")
            
            log_message("DNS-CLIENT", "")
            log_message("DNS-CLIENT", "🏁 DNS demonstration completed successfully!")
            log_message("DNS-CLIENT", "Key concepts demonstrated:")
            log_message("DNS-CLIENT", "  ✓ Hierarchical resolution (Root -> TLD -> Authoritative)")
            log_message("DNS-CLIENT", "  ✓ Multiple record types (A, NS, MX, TXT, CNAME)")
            log_message("DNS-CLIENT", "  ✓ DNS caching for performance")
            log_message("DNS-CLIENT", "  ✓ Error handling (NXDOMAIN)")
            
        except KeyboardInterrupt:
            log_message("DNS-CLIENT", "❌ Demonstration interrupted by user")
        except Exception as e:
            log_message("DNS-CLIENT", f"❌ Unexpected error: {e}", "ERROR")


def main():
    resolver_ip = os.getenv('RESOLVER_IP', '172.25.0.13')
    root_ip = os.getenv('ROOT_IP', '172.25.0.10')
    tld_ip = os.getenv('TLD_IP', '172.25.0.11')
    auth_ip = os.getenv('AUTH_IP', '172.25.0.12')
    
    client = DNSClient(resolver_ip, root_ip, tld_ip, auth_ip)
    client.run_demonstration()


if __name__ == "__main__":
    main()