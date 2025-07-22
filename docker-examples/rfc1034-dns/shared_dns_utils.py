#!/usr/bin/env python3
"""
Shared DNS utilities for RFC 1034 demonstration.
Provides common functions for DNS server and client implementations.
"""
import time
import struct
import socket
import random
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum


class DNSType(Enum):
    """DNS Resource Record Types"""
    A = 1      # IPv4 address
    NS = 2     # Name Server
    CNAME = 5  # Canonical Name
    SOA = 6    # Start of Authority
    PTR = 12   # Pointer
    MX = 15    # Mail Exchange
    TXT = 16   # Text
    AAAA = 28  # IPv6 address


class DNSClass(Enum):
    """DNS Classes"""
    IN = 1     # Internet


@dataclass
class DNSQuestion:
    """DNS Question Section"""
    name: str
    qtype: int
    qclass: int


@dataclass
class DNSRecord:
    """DNS Resource Record"""
    name: str
    rtype: int
    rclass: int
    ttl: int
    data: bytes


@dataclass
class DNSMessage:
    """Complete DNS Message"""
    transaction_id: int
    flags: int
    questions: List[DNSQuestion]
    answers: List[DNSRecord]
    authority: List[DNSRecord]
    additional: List[DNSRecord]


def log_message(component: str, message: str, level: str = "INFO"):
    """Log a message with timestamp and component identification"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    color_codes = {
        "INFO": "\033[94m",    # Blue
        "WARN": "\033[93m",    # Yellow
        "ERROR": "\033[91m",   # Red
        "SUCCESS": "\033[92m", # Green
        "RESET": "\033[0m"     # Reset
    }
    
    color = color_codes.get(level, color_codes["INFO"])
    reset = color_codes["RESET"]
    
    print(f"{color}[{timestamp}] {component:15} | {level:5} | {message}{reset}")


def encode_domain_name(domain: str) -> bytes:
    """Encode a domain name in DNS wire format"""
    if domain == ".":
        return b'\x00'
    
    parts = domain.rstrip('.').split('.')
    encoded = b''
    
    for part in parts:
        if len(part) > 63:
            raise ValueError(f"Label too long: {part}")
        encoded += bytes([len(part)]) + part.encode('ascii')
    
    encoded += b'\x00'  # Root label
    return encoded


def decode_domain_name(data: bytes, offset: int = 0) -> Tuple[str, int]:
    """Decode a domain name from DNS wire format"""
    labels = []
    original_offset = offset
    jumped = False
    
    while True:
        if offset >= len(data):
            break
            
        length = data[offset]
        
        # Check for compression (first two bits set)
        if (length & 0xC0) == 0xC0:
            if not jumped:
                original_offset = offset + 2
                jumped = True
            # Extract pointer offset
            pointer = ((length & 0x3F) << 8) | data[offset + 1]
            offset = pointer
            continue
        
        if length == 0:
            # End of name
            if not jumped:
                original_offset = offset + 1
            break
        
        offset += 1
        if offset + length > len(data):
            break
            
        label = data[offset:offset + length].decode('ascii')
        labels.append(label)
        offset += length
    
    domain = '.'.join(labels)
    if domain:
        domain += '.'
    else:
        domain = '.'
    
    return domain, original_offset


def create_dns_header(transaction_id: int, flags: int, 
                     qdcount: int, ancount: int, nscount: int, arcount: int) -> bytes:
    """Create DNS header in wire format"""
    return struct.pack('!HHHHHH', transaction_id, flags, qdcount, ancount, nscount, arcount)


def parse_dns_header(data: bytes) -> Tuple[int, int, int, int, int, int]:
    """Parse DNS header from wire format"""
    return struct.unpack('!HHHHHH', data[:12])


def create_dns_question(name: str, qtype: int, qclass: int = 1) -> bytes:
    """Create DNS question section"""
    encoded_name = encode_domain_name(name)
    return encoded_name + struct.pack('!HH', qtype, qclass)


def create_dns_record(name: str, rtype: int, rclass: int, ttl: int, data: bytes) -> bytes:
    """Create DNS resource record"""
    encoded_name = encode_domain_name(name)
    return encoded_name + struct.pack('!HHIH', rtype, rclass, ttl, len(data)) + data


def parse_dns_message(data: bytes) -> DNSMessage:
    """Parse a complete DNS message"""
    if len(data) < 12:
        raise ValueError("DNS message too short")
    
    # Parse header
    transaction_id, flags, qdcount, ancount, nscount, arcount = parse_dns_header(data)
    
    offset = 12
    questions = []
    answers = []
    authority = []
    additional = []
    
    # Parse questions
    for _ in range(qdcount):
        name, offset = decode_domain_name(data, offset)
        if offset + 4 > len(data):
            break
        qtype, qclass = struct.unpack('!HH', data[offset:offset+4])
        questions.append(DNSQuestion(name, qtype, qclass))
        offset += 4
    
    # Parse answers, authority, and additional records
    for record_list, count in [(answers, ancount), (authority, nscount), (additional, arcount)]:
        for _ in range(count):
            if offset >= len(data):
                break
            name, new_offset = decode_domain_name(data, offset)
            if new_offset + 10 > len(data):
                break
            rtype, rclass, ttl, rdlength = struct.unpack('!HHIH', data[new_offset:new_offset+10])
            rdata = data[new_offset+10:new_offset+10+rdlength]
            record_list.append(DNSRecord(name, rtype, rclass, ttl, rdata))
            offset = new_offset + 10 + rdlength
    
    return DNSMessage(transaction_id, flags, questions, answers, authority, additional)


def format_dns_record_data(record: DNSRecord) -> str:
    """Format DNS record data for display"""
    if record.rtype == DNSType.A.value:
        if len(record.data) == 4:
            return socket.inet_ntoa(record.data)
    elif record.rtype == DNSType.NS.value or record.rtype == DNSType.CNAME.value:
        try:
            name, _ = decode_domain_name(record.data, 0)
            return name
        except Exception:
            return record.data.hex()
    elif record.rtype == DNSType.MX.value:
        if len(record.data) >= 2:
            preference = struct.unpack('!H', record.data[:2])[0]
            try:
                exchange, _ = decode_domain_name(record.data, 2)
                return f"{preference} {exchange}"
            except Exception:
                return f"{preference} {record.data[2:].hex()}"
    elif record.rtype == DNSType.TXT.value:
        try:
            # TXT records have length-prefixed strings
            result = []
            offset = 0
            while offset < len(record.data):
                length = record.data[offset]
                if offset + 1 + length > len(record.data):
                    break
                text = record.data[offset+1:offset+1+length].decode('ascii', errors='replace')
                result.append(text)
                offset += 1 + length
            return ' '.join(result)
        except Exception:
            return record.data.decode('ascii', errors='replace')
    
    return record.data.hex()


def get_dns_type_name(rtype: int) -> str:
    """Get human-readable name for DNS record type"""
    type_names = {
        1: "A", 2: "NS", 5: "CNAME", 6: "SOA", 12: "PTR",
        15: "MX", 16: "TXT", 28: "AAAA"
    }
    return type_names.get(rtype, f"TYPE{rtype}")


def create_a_record_data(ip: str) -> bytes:
    """Create A record data from IP address string"""
    return socket.inet_aton(ip)


def create_ns_record_data(nameserver: str) -> bytes:
    """Create NS record data from nameserver name"""
    return encode_domain_name(nameserver)


def create_cname_record_data(target: str) -> bytes:
    """Create CNAME record data from target name"""
    return encode_domain_name(target)


def create_mx_record_data(preference: int, exchange: str) -> bytes:
    """Create MX record data"""
    return struct.pack('!H', preference) + encode_domain_name(exchange)


def create_txt_record_data(text: str) -> bytes:
    """Create TXT record data"""
    if len(text) > 255:
        # Split into multiple strings if too long
        chunks = [text[i:i+255] for i in range(0, len(text), 255)]
    else:
        chunks = [text]
    
    data = b''
    for chunk in chunks:
        chunk_bytes = chunk.encode('ascii', errors='replace')
        data += bytes([len(chunk_bytes)]) + chunk_bytes
    
    return data


def is_subdomain(child: str, parent: str) -> bool:
    """Check if child is a subdomain of parent"""
    child = child.lower().rstrip('.')
    parent = parent.lower().rstrip('.')
    
    if parent == '.':
        return True  # Root domain contains everything
    
    return child.endswith('.' + parent) or child == parent


def get_parent_domain(domain: str) -> str:
    """Get the parent domain of a given domain"""
    domain = domain.rstrip('.')
    if '.' not in domain:
        return '.'  # Parent of TLD is root
    
    parts = domain.split('.')
    if len(parts) <= 1:
        return '.'
    
    return '.'.join(parts[1:]) + '.'


def generate_transaction_id() -> int:
    """Generate a random DNS transaction ID"""
    return random.randint(1, 65535)


def calculate_response_time(start_time: float) -> float:
    """Calculate response time in milliseconds"""
    return (time.time() - start_time) * 1000


class DNSCache:
    """Simple DNS cache implementation"""
    
    def __init__(self):
        self.cache: Dict[str, Dict] = {}
    
    def get(self, name: str, rtype: int) -> Optional[List[DNSRecord]]:
        """Get cached records"""
        key = f"{name.lower()}:{rtype}"
        if key in self.cache:
            entry = self.cache[key]
            if time.time() < entry['expires']:
                return entry['records']
            else:
                del self.cache[key]
        return None
    
    def put(self, name: str, rtype: int, records: List[DNSRecord], ttl: int):
        """Cache DNS records"""
        key = f"{name.lower()}:{rtype}"
        self.cache[key] = {
            'records': records,
            'expires': time.time() + ttl
        }
    
    def clear(self):
        """Clear all cached entries"""
        self.cache.clear()
    
    def size(self) -> int:
        """Get number of cached entries"""
        # Clean expired entries first
        current_time = time.time()
        expired_keys = [k for k, v in self.cache.items() if current_time >= v['expires']]
        for key in expired_keys:
            del self.cache[key]
        
        return len(self.cache)


def format_dns_flags(flags: int) -> str:
    """Format DNS flags for human reading"""
    flag_parts = []
    
    if flags & 0x8000:
        flag_parts.append("QR=1(Response)")
    else:
        flag_parts.append("QR=0(Query)")
    
    opcode = (flags >> 11) & 0xF
    flag_parts.append(f"OPCODE={opcode}")
    
    if flags & 0x0400:
        flag_parts.append("AA=1(Authoritative)")
    
    if flags & 0x0200:
        flag_parts.append("TC=1(Truncated)")
    
    if flags & 0x0100:
        flag_parts.append("RD=1(Recursion Desired)")
    
    if flags & 0x0080:
        flag_parts.append("RA=1(Recursion Available)")
    
    rcode = flags & 0xF
    rcode_names = {0: "NOERROR", 1: "FORMERR", 2: "SERVFAIL", 3: "NXDOMAIN", 5: "REFUSED"}
    flag_parts.append(f"RCODE={rcode}({rcode_names.get(rcode, 'UNKNOWN')})")
    
    return " | ".join(flag_parts)