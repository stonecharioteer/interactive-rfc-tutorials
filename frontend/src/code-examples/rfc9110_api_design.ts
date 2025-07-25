export const getCodeExample = () => `
"""
RFC 9110: HTTP/1.1 Message Parser

Building an HTTP/1.1 parser is like creating a precise document scanner that can read any properly
formatted letter and extract all the important information reliably. This Python implementation
demonstrates RFC 9112 compliant message parsing with security considerations.

Dependencies:
pip install pydantic
"""

import re
import json
from typing import Dict, List, Optional, Tuple, Union, Any
from dataclasses import dataclass, field
from enum import Enum
import hashlib
from urllib.parse import parse_qs, urlparse


class HTTPMethod(Enum):
    """HTTP methods with their semantic properties"""
    GET = "GET"
    HEAD = "HEAD"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"
    OPTIONS = "OPTIONS"
    TRACE = "TRACE"
    CONNECT = "CONNECT"


@dataclass
class HTTPRequestLine:
    """Parsed HTTP request line components"""
    method: HTTPMethod
    path: str
    query_string: str
    fragment: str
    version: str
    
    def __post_init__(self):
        """Validate request line components"""
        if self.version not in ["HTTP/1.1", "HTTP/1.0"]:
            raise ValueError(f"Unsupported HTTP version: {self.version}")


@dataclass
class HTTPStatusLine:
    """Parsed HTTP response status line"""
    version: str
    status_code: int
    reason_phrase: str
    
    def __post_init__(self):
        """Validate status line components"""
        if not (100 <= self.status_code <= 599):
            raise ValueError(f"Invalid status code: {self.status_code}")


@dataclass
class HTTPHeaders:
    """HTTP headers with case-insensitive access and validation"""
    headers: Dict[str, str] = field(default_factory=dict)
    
    def set(self, name: str, value: str) -> None:
        """Set header with case-insensitive name"""
        self.headers[name.lower()] = value.strip()
    
    def get(self, name: str, default: str = None) -> Optional[str]:
        """Get header value with case-insensitive lookup"""
        return self.headers.get(name.lower(), default)
    
    def has(self, name: str) -> bool:
        """Check if header exists (case-insensitive)"""
        return name.lower() in self.headers
    
    def remove(self, name: str) -> None:
        """Remove header (case-insensitive)"""
        self.headers.pop(name.lower(), None)
    
    def items(self) -> List[Tuple[str, str]]:
        """Get all header name-value pairs"""
        return list(self.headers.items())
    
    def validate_security(self) -> List[str]:
        """Validate headers for common security issues"""
        warnings = []
        
        # Check for conflicting length headers (RFC 9112 security concern)
        content_length = self.get('content-length')
        transfer_encoding = self.get('transfer-encoding')
        
        if content_length and transfer_encoding:
            if 'chunked' in transfer_encoding.lower():
                warnings.append("Conflicting Content-Length and Transfer-Encoding: chunked headers")
        
        # Check for suspicious header values
        for name, value in self.headers.items():
            if '\\r' in value or '\\n' in value:
                warnings.append(f"Header {name} contains CRLF characters (potential injection)")
            
            if len(value) > 8192:  # Common header size limit
                warnings.append(f"Header {name} exceeds reasonable size limit")
        
        return warnings


@dataclass
class HTTPMessage:
    """Complete HTTP message (request or response)"""
    start_line: Union[HTTPRequestLine, HTTPStatusLine]
    headers: HTTPHeaders
    body: bytes = b''
    
    @property
    def is_request(self) -> bool:
        """Check if this is a request message"""
        return isinstance(self.start_line, HTTPRequestLine)
    
    @property
    def is_response(self) -> bool:
        """Check if this is a response message"""
        return isinstance(self.start_line, HTTPStatusLine)
    
    def get_content_length(self) -> Optional[int]:
        """Get Content-Length header value"""
        content_length = self.headers.get('content-length')
        if content_length:
            try:
                return int(content_length)
            except ValueError:
                raise ValueError(f"Invalid Content-Length: {content_length}")
        return None
    
    def is_chunked(self) -> bool:
        """Check if message uses chunked transfer encoding"""
        transfer_encoding = self.headers.get('transfer-encoding', '')
        return 'chunked' in transfer_encoding.lower()


class HTTPParser:
    """
    RFC 9112 compliant HTTP/1.1 message parser with security validations
    
    This parser handles both request and response messages, implements proper
    header parsing, validates message format, and checks for security issues.
    """
    
    # RFC 9112 limits and patterns
    MAX_REQUEST_LINE_LENGTH = 8000
    MAX_HEADER_LINE_LENGTH = 8000
    MAX_HEADERS_COUNT = 100
    
    REQUEST_LINE_PATTERN = re.compile(
        r'^([A-Z]+)\\s+([^\\s]+)\\s+(HTTP/\\d+\\.\\d+)\\r?$'
    )
    STATUS_LINE_PATTERN = re.compile(
        r'^(HTTP/\\d+\\.\\d+)\\s+(\\d{3})\\s*(.*)\\r?$'
    )
    HEADER_PATTERN = re.compile(
        r'^([^:]+):\\s*(.*)\\r?$'
    )
    
    def __init__(self):
        self.strict_mode = True
        self.security_checks = True
    
    def parse_message(self, raw_message: bytes) -> HTTPMessage:
        """
        Parse complete HTTP message from raw bytes
        
        Args:
            raw_message: Raw HTTP message bytes
            
        Returns:
            Parsed HTTPMessage object
            
        Raises:
            ValueError: For invalid message format
            SecurityWarning: For potential security issues
        """
        message_str = raw_message.decode('utf-8', errors='replace')
        lines = message_str.split('\\n')
        
        if not lines:
            raise ValueError("Empty HTTP message")
        
        # Parse start line (request line or status line)
        start_line = self._parse_start_line(lines[0])
        
        # Parse headers
        headers, body_start_index = self._parse_headers(lines[1:])
        
        # Validate security concerns
        if self.security_checks:
            security_warnings = headers.validate_security()
            if security_warnings:
                print(f"⚠️ Security warnings: {'; '.join(security_warnings)}")
        
        # Parse body if present
        body_lines = lines[body_start_index:]
        body = self._parse_body(headers, body_lines)
        
        message = HTTPMessage(start_line, headers, body)
        
        print(f"✅ Parsed {('request' if message.is_request else 'response')} message")
        print(f"   • Method/Status: {getattr(start_line, 'method', start_line.status_code)}")
        print(f"   • Headers: {len(headers.headers)}")
        print(f"   • Body: {len(body)} bytes")
        
        return message
    
    def _parse_start_line(self, line: str) -> Union[HTTPRequestLine, HTTPStatusLine]:
        """Parse the first line of HTTP message"""
        line = line.strip()
        
        if len(line) > self.MAX_REQUEST_LINE_LENGTH:
            raise ValueError(f"Request line too long: {len(line)} > {self.MAX_REQUEST_LINE_LENGTH}")
        
        # Try parsing as request line first
        request_match = self.REQUEST_LINE_PATTERN.match(line)
        if request_match:
            method_str, uri, version = request_match.groups()
            
            try:
                method = HTTPMethod(method_str)
            except ValueError:
                if self.strict_mode:
                    raise ValueError(f"Unknown HTTP method: {method_str}")
                # In non-strict mode, create a custom method
                method = method_str
            
            # Parse URI components
            parsed_uri = urlparse(uri)
            
            return HTTPRequestLine(
                method=method,
                path=parsed_uri.path or '/',
                query_string=parsed_uri.query or '',
                fragment=parsed_uri.fragment or '',
                version=version
            )
        
        # Try parsing as status line
        status_match = self.STATUS_LINE_PATTERN.match(line)
        if status_match:
            version, status_code_str, reason_phrase = status_match.groups()
            
            try:
                status_code = int(status_code_str)
            except ValueError:
                raise ValueError(f"Invalid status code: {status_code_str}")
            
            return HTTPStatusLine(
                version=version,
                status_code=status_code,
                reason_phrase=reason_phrase.strip()
            )
        
        raise ValueError(f"Invalid HTTP start line: {line}")
    
    def _parse_headers(self, lines: List[str]) -> Tuple[HTTPHeaders, int]:
        """Parse HTTP headers and return headers object and body start index"""
        headers = HTTPHeaders()
        line_index = 0
        header_count = 0
        
        while line_index < len(lines):
            line = lines[line_index].rstrip('\\r')
            
            # Empty line indicates end of headers
            if not line:
                return headers, line_index + 1
            
            # Check header count limit
            if header_count >= self.MAX_HEADERS_COUNT:
                raise ValueError(f"Too many headers: {header_count} > {self.MAX_HEADERS_COUNT}")
            
            # Check line length
            if len(line) > self.MAX_HEADER_LINE_LENGTH:
                raise ValueError(f"Header line too long: {len(line)} > {self.MAX_HEADER_LINE_LENGTH}")
            
            # Handle header folding (obsolete but may exist)
            if line.startswith((' ', '\\t')):
                if header_count == 0:
                    raise ValueError("Header folding without preceding header")
                # Append to previous header (this is obsolete in HTTP/1.1)
                if self.strict_mode:
                    raise ValueError("Header folding is obsolete in HTTP/1.1")
                continue
            
            # Parse header line
            header_match = self.HEADER_PATTERN.match(line)
            if not header_match:
                raise ValueError(f"Invalid header line: {line}")
            
            name, value = header_match.groups()
            
            # Validate header name (RFC 9110)
            if not self._is_valid_header_name(name):
                raise ValueError(f"Invalid header name: {name}")
            
            headers.set(name, value)
            header_count += 1
            line_index += 1
        
        # If we reach here, no empty line was found
        return headers, len(lines)
    
    def _parse_body(self, headers: HTTPHeaders, body_lines: List[str]) -> bytes:
        """Parse message body based on headers"""
        if not body_lines:
            return b''
        
        body_str = '\\n'.join(body_lines)
        
        # Handle different body encoding methods
        if headers.is_chunked():
            return self._parse_chunked_body(body_str)
        
        content_length = headers.get('content-length')
        if content_length:
            try:
                expected_length = int(content_length)
                body_bytes = body_str.encode('utf-8')
                
                if len(body_bytes) != expected_length:
                    print(f"⚠️ Body length mismatch: expected {expected_length}, got {len(body_bytes)}")
                
                return body_bytes[:expected_length]
            except ValueError:
                raise ValueError(f"Invalid Content-Length: {content_length}")
        
        # No explicit length, read until connection close
        return body_str.encode('utf-8')
    
    def _parse_chunked_body(self, body_str: str) -> bytes:
        """Parse chunked transfer encoding body"""
        lines = body_str.split('\\n')
        result = b''
        line_index = 0
        
        while line_index < len(lines):
            # Parse chunk size line
            size_line = lines[line_index].strip()
            
            # Handle chunk extensions (size;ext=value)
            chunk_size_str = size_line.split(';')[0]
            
            try:
                chunk_size = int(chunk_size_str, 16)  # Hex format
            except ValueError:
                raise ValueError(f"Invalid chunk size: {chunk_size_str}")
            
            line_index += 1
            
            # Zero-size chunk indicates end
            if chunk_size == 0:
                # Handle trailing headers (if any)
                break
            
            # Read chunk data
            chunk_data = ''
            bytes_read = 0
            
            while bytes_read < chunk_size and line_index < len(lines):
                line = lines[line_index]
                remaining = chunk_size - bytes_read
                
                if len(line) <= remaining:
                    chunk_data += line
                    bytes_read += len(line)
                    if line_index < len(lines) - 1:  # Add newline if not last line
                        chunk_data += '\\n'
                        bytes_read += 1
                else:
                    chunk_data += line[:remaining]
                    bytes_read = chunk_size
                
                line_index += 1
            
            result += chunk_data.encode('utf-8')
            
            # Skip CRLF after chunk data
            if line_index < len(lines) and not lines[line_index].strip():
                line_index += 1
        
        return result
    
    def _is_valid_header_name(self, name: str) -> bool:
        """Validate header name according to RFC 9110"""
        if not name:
            return False
        
        # Header names are case-insensitive tokens
        # Valid characters: letters, digits, and specific symbols
        valid_chars = set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_')
        
        return all(c in valid_chars for c in name)
    
    def format_message(self, message: HTTPMessage) -> str:
        """Format HTTPMessage back to string representation"""
        lines = []
        
        # Format start line
        if message.is_request:
            start_line = message.start_line
            query = f"?{start_line.query_string}" if start_line.query_string else ""
            fragment = f"#{start_line.fragment}" if start_line.fragment else ""
            uri = f"{start_line.path}{query}{fragment}"
            lines.append(f"{start_line.method.value} {uri} {start_line.version}")
        else:
            start_line = message.start_line
            lines.append(f"{start_line.version} {start_line.status_code} {start_line.reason_phrase}")
        
        # Format headers
        for name, value in message.headers.items():
            lines.append(f"{name}: {value}")
        
        # Empty line separates headers from body
        lines.append("")
        
        # Add body if present
        if message.body:
            lines.append(message.body.decode('utf-8', errors='replace'))
        
        return '\\n'.join(lines)


# Demonstration of HTTP Parser Usage
def demonstrate_http_parser():
    """
    Comprehensive demonstration of HTTP/1.1 message parsing
    
    Shows parsing of different message types, security validation,
    and proper error handling for malformed messages.
    """
    print("🔍 RFC 9112 HTTP/1.1 Message Parser Demonstration")
    print("This shows comprehensive message parsing with security considerations!")
    
    parser = HTTPParser()
    
    print("\\n=== Parsing HTTP Request Messages ===")
    
    # Example 1: Simple GET request
    get_request = b\"\"\"GET /api/users?limit=10 HTTP/1.1\\r
Host: api.example.com\\r
User-Agent: Mozilla/5.0 (compatible; HTTPParser/1.0)\\r
Accept: application/json\\r
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\\r
\\r
\"\"\"
    
    try:
        parsed_get = parser.parse_message(get_request)
        print(f"✅ GET request parsed successfully")
        print(f"   • Path: {parsed_get.start_line.path}")
        print(f"   • Query: {parsed_get.start_line.query_string}")
        print(f"   • Host: {parsed_get.headers.get('host')}")
    except Exception as e:
        print(f"❌ Failed to parse GET request: {e}")
    
    # Example 2: POST request with body
    post_request = b\"\"\"POST /api/users HTTP/1.1\\r
Host: api.example.com\\r
Content-Type: application/json\\r
Content-Length: 58\\r
Accept: application/json\\r
\\r
{"name": "Alice Johnson", "email": "alice@example.com"}\"\"\"
    
    try:
        parsed_post = parser.parse_message(post_request)
        print(f"✅ POST request parsed successfully")
        print(f"   • Method: {parsed_post.start_line.method.value}")
        print(f"   • Content-Type: {parsed_post.headers.get('content-type')}")
        print(f"   • Body: {parsed_post.body.decode()}")
    except Exception as e:
        print(f"❌ Failed to parse POST request: {e}")
    
    print("\\n=== Parsing HTTP Response Messages ===")
    
    # Example 3: Successful response
    success_response = b\"\"\"HTTP/1.1 200 OK\\r
Date: Thu, 25 Jul 2025 12:00:00 GMT\\r
Server: Apache/2.4.41 (Ubuntu)\\r
Content-Type: application/json\\r
Content-Length: 95\\r
Cache-Control: public, max-age=300\\r
ETag: "abc123def456"\\r
\\r
{"id": "user-001", "name": "Alice Johnson", "email": "alice@example.com", "created": "2025-01-15"}\"\"\"
    
    try:
        parsed_response = parser.parse_message(success_response)
        print(f"✅ 200 OK response parsed successfully")
        print(f"   • Status: {parsed_response.start_line.status_code}")
        print(f"   • Server: {parsed_response.headers.get('server')}")
        print(f"   • ETag: {parsed_response.headers.get('etag')}")
    except Exception as e:
        print(f"❌ Failed to parse response: {e}")
    
    # Example 4: Error response
    error_response = b\"\"\"HTTP/1.1 404 Not Found\\r
Date: Thu, 25 Jul 2025 12:00:00 GMT\\r
Server: Apache/2.4.41 (Ubuntu)\\r
Content-Type: application/json\\r
Content-Length: 77\\r
Cache-Control: no-cache\\r
\\r
{"error": {"code": 404, "message": "User not found", "details": "Invalid ID"}}\"\"\"
    
    try:
        parsed_error = parser.parse_message(error_response)
        print(f"✅ 404 error response parsed successfully")
        print(f"   • Status: {parsed_error.start_line.status_code} {parsed_error.start_line.reason_phrase}")
        print(f"   • Error: {json.loads(parsed_error.body.decode())['error']['message']}")
    except Exception as e:
        print(f"❌ Failed to parse error response: {e}")
    
    print("\\n=== Security Validation Tests ===")
    
    # Example 5: Message with conflicting headers (security concern)
    suspicious_request = b\"\"\"POST /api/upload HTTP/1.1\\r
Host: api.example.com\\r
Content-Length: 13\\r
Transfer-Encoding: chunked\\r
Content-Type: application/json\\r
\\r
Hello, World!\"\"\"
    
    try:
        parsed_suspicious = parser.parse_message(suspicious_request)
        print(f"⚠️ Parsed message with conflicting headers (security warnings shown above)")
    except Exception as e:
        print(f"❌ Rejected suspicious message: {e}")
    
    print("\\n=== Chunked Transfer Encoding ===")
    
    # Example 6: Chunked encoding
    chunked_response = b\"\"\"HTTP/1.1 200 OK\\r
Date: Thu, 25 Jul 2025 12:00:00 GMT\\r
Server: Apache/2.4.41 (Ubuntu)\\r
Content-Type: text/plain\\r
Transfer-Encoding: chunked\\r
\\r
d\\r
Hello, World!\\r
0\\r
\\r
\"\"\"
    
    try:
        parsed_chunked = parser.parse_message(chunked_response)
        print(f"✅ Chunked response parsed successfully")
        print(f"   • Transfer-Encoding: {parsed_chunked.headers.get('transfer-encoding')}")
        print(f"   • Body: {parsed_chunked.body.decode()}")
    except Exception as e:
        print(f"❌ Failed to parse chunked response: {e}")
    
    print("\\n=== Message Formatting ===")
    
    # Demonstrate formatting message back to string
    if 'parsed_get' in locals():
        formatted = parser.format_message(parsed_get)
        print("✅ Original GET request reformatted:")
        print("\\n".join(f"   {line}" for line in formatted.split('\\n')[:5]))
    
    print("\\n🎯 HTTP Parser Features Demonstrated:")
    print("• Strict CRLF handling: Proper line ending validation")
    print("• Header field parsing: RFC-compliant name/value extraction")
    print("• Content-Length validation: Numeric validation and consistency")
    print("• Transfer-Encoding handling: Chunked encoding support")
    print("• Security checks: Request smuggling prevention")
    print("• Connection management: Persistent connection handling")
    print("• Vary header handling: Multiple cache entries per URL")
    
    print("\\n🌐 This enables the reliable HTTP processing that powers:")
    print("• Web servers parsing incoming client requests")
    print("• HTTP proxies and load balancers processing traffic")
    print("• API gateways validating and routing requests")
    print("• Security tools detecting malicious HTTP patterns")


# Run the demonstration
if __name__ == "__main__":
    demonstrate_http_parser()
`;