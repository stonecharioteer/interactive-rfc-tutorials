export const rfc9112_message_parser = `from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass
from enum import Enum
import re
import io


class HTTPVersion(Enum):
    """HTTP version enumeration"""
    HTTP_1_0 = "HTTP/1.0"
    HTTP_1_1 = "HTTP/1.1"


class TransferEncoding(Enum):
    """Transfer encoding types"""
    IDENTITY = "identity"
    CHUNKED = "chunked"
    GZIP = "gzip"
    DEFLATE = "deflate"


@dataclass
class HTTPMessage:
    """Base class for HTTP messages according to RFC 9112"""
    version: HTTPVersion
    headers: Dict[str, str]
    body: bytes
    connection_close: bool = False
    
    def get_header(self, name: str, default: Optional[str] = None) -> Optional[str]:
        """Get header value (case-insensitive lookup)"""
        for key, value in self.headers.items():
            if key.lower() == name.lower():
                return value
        return default
    
    def has_header(self, name: str) -> bool:
        """Check if header exists (case-insensitive)"""
        return self.get_header(name) is not None


@dataclass
class HTTPRequest(HTTPMessage):
    """HTTP request message according to RFC 9112"""
    method: str
    target: str
    
    def __str__(self) -> str:
        """Format as HTTP/1.1 request"""
        lines = [f"{self.method} {self.target} {self.version.value}"]
        
        for name, value in self.headers.items():
            lines.append(f"{name}: {value}")
        
        lines.append("")  # Empty line before body
        
        request_str = "\\r\\n".join(lines)
        if self.body:
            request_str += self.body.decode('utf-8', errors='replace')
        
        return request_str


@dataclass 
class HTTPResponse(HTTPMessage):
    """HTTP response message according to RFC 9112"""
    status_code: int
    reason_phrase: str
    
    def __str__(self) -> str:
        """Format as HTTP/1.1 response"""
        lines = [f"{self.version.value} {self.status_code} {self.reason_phrase}"]
        
        for name, value in self.headers.items():
            lines.append(f"{name}: {value}")
        
        lines.append("")  # Empty line before body
        
        response_str = "\\r\\n".join(lines)
        if self.body:
            response_str += self.body.decode('utf-8', errors='replace')
        
        return response_str


class HTTPParseError(Exception):
    """RFC 9112 parsing error"""
    pass


class HTTP11Parser:
    """RFC 9112 compliant HTTP/1.1 message parser"""
    
    def __init__(self):
        self.max_header_lines = 100
        self.max_header_line_length = 8192
        self.max_request_line_length = 8192
    
    def _read_line(self, data: bytes, offset: int) -> Tuple[str, int]:
        """Read a CRLF-terminated line according to RFC 9112"""
        line_start = offset
        
        while offset < len(data):
            if data[offset:offset + 2] == b'\\r\\n':
                line = data[line_start:offset].decode('ascii', errors='strict')
                return line, offset + 2
            offset += 1
            
            if offset - line_start > self.max_header_line_length:
                raise HTTPParseError("Line too long")
        
        raise HTTPParseError("Incomplete message - no CRLF found")
    
    def _parse_request_line(self, line: str) -> Tuple[str, str, HTTPVersion]:
        """Parse HTTP request line according to RFC 9112"""
        if len(line) > self.max_request_line_length:
            raise HTTPParseError("Request line too long")
        
        parts = line.split(' ', 2)
        if len(parts) != 3:
            raise HTTPParseError("Invalid request line format")
        
        method, target, version_str = parts
        
        # Validate method (token)
        if not re.match(r'^[!#$%&*+\\-.0-9A-Z^_a-z|~]+$', method):
            raise HTTPParseError("Invalid method format")
        
        # Validate HTTP version
        if version_str not in [v.value for v in HTTPVersion]:
            raise HTTPParseError(f"Unsupported HTTP version: {version_str}")
        
        version = HTTPVersion(version_str)
        
        return method, target, version
    
    def _parse_status_line(self, line: str) -> Tuple[HTTPVersion, int, str]:
        """Parse HTTP status line according to RFC 9112"""
        parts = line.split(' ', 2)
        if len(parts) < 2:
            raise HTTPParseError("Invalid status line format")
        
        version_str, status_str = parts[0], parts[1]
        reason_phrase = parts[2] if len(parts) > 2 else ""
        
        # Validate HTTP version
        if version_str not in [v.value for v in HTTPVersion]:
            raise HTTPParseError(f"Unsupported HTTP version: {version_str}")
        
        version = HTTPVersion(version_str)
        
        # Validate status code
        try:
            status_code = int(status_str)
            if not 100 <= status_code <= 599:
                raise HTTPParseError("Status code out of range")
        except ValueError:
            raise HTTPParseError("Invalid status code format")
        
        return version, status_code, reason_phrase
    
    def _parse_header_field(self, line: str) -> Tuple[str, str]:
        """Parse header field according to RFC 9112"""
        if ':' not in line:
            raise HTTPParseError("Invalid header field - no colon")
        
        name, value = line.split(':', 1)
        
        # Validate field name (token)
        name = name.strip()
        if not re.match(r'^[!#$%&*+\\-.0-9A-Z^_a-z|~]+$', name):
            raise HTTPParseError("Invalid header field name")
        
        # Field value may contain leading/trailing whitespace
        value = value.strip()
        
        # Validate field value (visible VCHAR, WSP, and obs-text)
        if not re.match(r'^[\\x21-\\x7E\\x80-\\xFF\\t ]*$', value):
            raise HTTPParseError("Invalid header field value")
        
        return name, value
    
    def _parse_headers(self, data: bytes, offset: int) -> Tuple[Dict[str, str], int]:
        """Parse header fields according to RFC 9112"""
        headers = {}
        header_count = 0
        
        while offset < len(data):
            line, offset = self._read_line(data, offset)
            
            # Empty line indicates end of headers
            if not line:
                break
            
            header_count += 1
            if header_count > self.max_header_lines:
                raise HTTPParseError("Too many header fields")
            
            name, value = self._parse_header_field(line)
            
            # RFC 9112: Multiple header fields with same name
            if name.lower() in [k.lower() for k in headers.keys()]:
                # Find existing header and combine values
                for existing_name in headers:
                    if existing_name.lower() == name.lower():
                        headers[existing_name] += f", {value}"
                        break
            else:
                headers[name] = value
        
        return headers, offset
    
    def _parse_message_body(self, headers: Dict[str, str], 
                           data: bytes, offset: int) -> Tuple[bytes, int, bool]:
        """Parse message body according to RFC 9112 framing rules"""
        # Check for Transfer-Encoding
        transfer_encoding = None
        for name, value in headers.items():
            if name.lower() == 'transfer-encoding':
                transfer_encoding = value.lower()
                break
        
        # Check for Content-Length
        content_length = None
        for name, value in headers.items():
            if name.lower() == 'content-length':
                try:
                    content_length = int(value)
                    if content_length < 0:
                        raise HTTPParseError("Negative Content-Length")
                except ValueError:
                    raise HTTPParseError("Invalid Content-Length format")
                break
        
        # RFC 9112 Security: Transfer-Encoding takes precedence
        if transfer_encoding and content_length is not None:
            # This is a potential request smuggling attack
            raise HTTPParseError(
                "Both Transfer-Encoding and Content-Length present - security violation"
            )
        
        connection_close = False
        
        # Parse based on framing method
        if transfer_encoding == 'chunked':
            body, new_offset = self._parse_chunked_body(data, offset)
        elif content_length is not None:
            if offset + content_length > len(data):
                raise HTTPParseError("Incomplete message body")
            body = data[offset:offset + content_length]
            new_offset = offset + content_length
        else:
            # No explicit length - read until connection close
            body = data[offset:]
            new_offset = len(data)
            connection_close = True
        
        return body, new_offset, connection_close
    
    def _parse_chunked_body(self, data: bytes, offset: int) -> Tuple[bytes, int]:
        """Parse chunked transfer encoding according to RFC 9112"""
        body_parts = []
        
        while offset < len(data):
            # Read chunk size line
            size_line, offset = self._read_line(data, offset)
            
            # Parse chunk size (hex) and optional extensions
            size_part = size_line.split(';')[0].strip()
            try:
                chunk_size = int(size_part, 16)
            except ValueError:
                raise HTTPParseError("Invalid chunk size")
            
            # Last chunk (size 0)
            if chunk_size == 0:
                # Read trailer headers (we'll skip them for simplicity)
                while offset < len(data):
                    trailer_line, offset = self._read_line(data, offset)
                    if not trailer_line:  # Empty line ends trailers
                        break
                break
            
            # Read chunk data
            if offset + chunk_size + 2 > len(data):  # +2 for trailing CRLF
                raise HTTPParseError("Incomplete chunk data")
            
            chunk_data = data[offset:offset + chunk_size]
            body_parts.append(chunk_data)
            offset += chunk_size
            
            # Read trailing CRLF
            if data[offset:offset + 2] != b'\\r\\n':
                raise HTTPParseError("Missing chunk trailing CRLF")
            offset += 2
        
        return b''.join(body_parts), offset
    
    def parse_request(self, data: bytes) -> HTTPRequest:
        """Parse HTTP request according to RFC 9112"""
        offset = 0
        
        # Parse request line
        request_line, offset = self._read_line(data, offset)
        method, target, version = self._parse_request_line(request_line)
        
        # Parse headers
        headers, offset = self._parse_headers(data, offset)
        
        # Validate required headers for HTTP/1.1
        if version == HTTPVersion.HTTP_1_1:
            if not any(name.lower() == 'host' for name in headers.keys()):
                raise HTTPParseError("HTTP/1.1 request missing Host header")
        
        # Parse message body
        body, _, connection_close = self._parse_message_body(headers, data, offset)
        
        # Check Connection header
        connection_hdr = None
        for name, value in headers.items():
            if name.lower() == 'connection':
                connection_hdr = value.lower()
                break
        
        if connection_hdr == 'close':
            connection_close = True
        
        return HTTPRequest(
            method=method,
            target=target,
            version=version,
            headers=headers,
            body=body,
            connection_close=connection_close
        )
    
    def parse_response(self, data: bytes) -> HTTPResponse:
        """Parse HTTP response according to RFC 9112"""
        offset = 0
        
        # Parse status line
        status_line, offset = self._read_line(data, offset)
        version, status_code, reason_phrase = self._parse_status_line(status_line)
        
        # Parse headers
        headers, offset = self._parse_headers(data, offset)
        
        # Parse message body
        body, _, connection_close = self._parse_message_body(headers, data, offset)
        
        # Check Connection header
        connection_hdr = None
        for name, value in headers.items():
            if name.lower() == 'connection':
                connection_hdr = value.lower()
                break
        
        if connection_hdr == 'close':
            connection_close = True
        
        return HTTPResponse(
            status_code=status_code,
            reason_phrase=reason_phrase,
            version=version,
            headers=headers,
            body=body,
            connection_close=connection_close
        )


# Example usage demonstrating RFC 9112 parsing
def demonstrate_http11_parsing():
    """Demonstrate HTTP/1.1 message parsing with various scenarios"""
    
    parser = HTTP11Parser()
    
    # Example 1: Simple GET request
    print("=== Simple GET Request ===")
    
    get_request = b"""GET /api/users HTTP/1.1\\r
Host: example.com\\r
User-Agent: Python-HTTP-Client/1.0\\r
Accept: application/json\\r
Connection: keep-alive\\r
\\r
"""
    
    try:
        request = parser.parse_request(get_request)
        print(f"Method: {request.method}")
        print(f"Target: {request.target}")
        print(f"Version: {request.version.value}")
        print(f"Host: {request.get_header('Host')}")
        print(f"Connection Close: {request.connection_close}")
    except HTTPParseError as e:
        print(f"Parse error: {e}")
    
    # Example 2: POST request with Content-Length
    print("\\n=== POST Request with Content-Length ===")
    
    post_request = b"""POST /api/users HTTP/1.1\\r
Host: example.com\\r
Content-Type: application/json\\r
Content-Length: 25\\r
\\r
{"name": "John Doe"}"""
    
    try:
        request = parser.parse_request(post_request)
        print(f"Method: {request.method}")
        print(f"Content-Length: {request.get_header('Content-Length')}")
        print(f"Body: {request.body.decode()}")
    except HTTPParseError as e:
        print(f"Parse error: {e}")
    
    # Example 3: Chunked transfer encoding
    print("\\n=== Chunked Transfer Encoding ===")
    
    chunked_request = b"""POST /api/stream HTTP/1.1\\r
Host: example.com\\r
Content-Type: application/json\\r
Transfer-Encoding: chunked\\r
\\r
1a\\r
{"chunk": "first part"}\\r
17\\r
{"chunk": "second"}\\r
0\\r
\\r
"""
    
    try:
        request = parser.parse_request(chunked_request)
        print(f"Transfer-Encoding: {request.get_header('Transfer-Encoding')}")
        print(f"Body: {request.body.decode()}")
    except HTTPParseError as e:
        print(f"Parse error: {e}")
    
    # Example 4: HTTP response parsing
    print("\\n=== HTTP Response ===")
    
    response_data = b"""HTTP/1.1 200 OK\\r
Content-Type: application/json\\r
Content-Length: 27\\r
Server: Python-HTTP-Server/1.0\\r
Connection: keep-alive\\r
\\r
{"message": "Success"}"""
    
    try:
        response = parser.parse_response(response_data)
        print(f"Status: {response.status_code} {response.reason_phrase}")
        print(f"Content-Type: {response.get_header('Content-Type')}")
        print(f"Body: {response.body.decode()}")
    except HTTPParseError as e:
        print(f"Parse error: {e}")
    
    # Example 5: Security validation - request smuggling prevention
    print("\\n=== Security Validation ===")
    
    malicious_request = b"""POST /api/data HTTP/1.1\\r
Host: example.com\\r
Content-Length: 13\\r
Transfer-Encoding: chunked\\r
\\r
0\\r
\\r
SMUGGLED"""
    
    try:
        request = parser.parse_request(malicious_request)
        print("ERROR: Should have rejected request smuggling attempt!")
    except HTTPParseError as e:
        print(f"Security validation successful: {e}")
    
    # Example 6: HTTP/1.1 Host header validation
    print("\\n=== HTTP/1.1 Host Header Validation ===")
    
    invalid_http11 = b"""GET /path HTTP/1.1\\r
User-Agent: Client/1.0\\r
\\r
"""
    
    try:
        request = parser.parse_request(invalid_http11)
        print("ERROR: Should have required Host header!")
    except HTTPParseError as e:
        print(f"HTTP/1.1 validation successful: {e}")


if __name__ == "__main__":
    demonstrate_http11_parsing()`;

export default rfc9112_message_parser;