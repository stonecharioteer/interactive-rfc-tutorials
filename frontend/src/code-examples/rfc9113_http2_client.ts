export const rfc9113_http2_client = `import asyncio
import struct
from typing import Dict, List, Optional, Tuple, Any, Callable
from dataclasses import dataclass, field
from enum import Enum, IntEnum
import ssl
import logging


class FrameType(IntEnum):
    """HTTP/2 frame types according to RFC 9113"""
    DATA = 0x0
    HEADERS = 0x1
    PRIORITY = 0x2
    RST_STREAM = 0x3
    SETTINGS = 0x4
    PUSH_PROMISE = 0x5
    PING = 0x6
    GOAWAY = 0x7
    WINDOW_UPDATE = 0x8
    CONTINUATION = 0x9


class FrameFlags(IntEnum):
    """HTTP/2 frame flags"""
    # DATA flags
    DATA_END_STREAM = 0x1
    DATA_PADDED = 0x8
    
    # HEADERS flags
    HEADERS_END_STREAM = 0x1
    HEADERS_END_HEADERS = 0x4
    HEADERS_PADDED = 0x8
    HEADERS_PRIORITY = 0x20
    
    # SETTINGS flags
    SETTINGS_ACK = 0x1
    
    # PING flags
    PING_ACK = 0x1


class SettingsParameter(IntEnum):
    """HTTP/2 settings parameters"""
    HEADER_TABLE_SIZE = 0x1
    ENABLE_PUSH = 0x2
    MAX_CONCURRENT_STREAMS = 0x3
    INITIAL_WINDOW_SIZE = 0x4
    MAX_FRAME_SIZE = 0x5
    MAX_HEADER_LIST_SIZE = 0x6


class StreamState(Enum):
    """HTTP/2 stream states"""
    IDLE = "idle"
    OPEN = "open"
    RESERVED_LOCAL = "reserved_local"
    RESERVED_REMOTE = "reserved_remote"
    HALF_CLOSED_LOCAL = "half_closed_local"
    HALF_CLOSED_REMOTE = "half_closed_remote"
    CLOSED = "closed"


@dataclass
class HTTP2Frame:
    """HTTP/2 frame structure according to RFC 9113"""
    length: int
    type: FrameType
    flags: int
    stream_id: int
    payload: bytes
    
    def serialize(self) -> bytes:
        """Serialize frame to binary format"""
        # Frame header: 24-bit length + 8-bit type + 8-bit flags + 31-bit stream ID
        header = struct.pack(
            '>I', 
            (self.length << 8) | self.type
        )[1:]  # Remove the first byte to get 24-bit length
        
        header += struct.pack('>BI', self.flags, self.stream_id & 0x7FFFFFFF)
        
        return header + self.payload
    
    @classmethod
    def parse(cls, data: bytes) -> 'HTTP2Frame':
        """Parse binary data into HTTP/2 frame"""
        if len(data) < 9:
            raise ValueError("Incomplete frame header")
        
        # Parse frame header
        length_and_type = struct.unpack('>I', b'\\x00' + data[:3])[0]
        length = length_and_type >> 8
        frame_type = FrameType(length_and_type & 0xFF)
        
        flags, stream_id = struct.unpack('>BI', data[3:9])
        stream_id &= 0x7FFFFFFF  # Clear reserved bit
        
        if len(data) < 9 + length:
            raise ValueError("Incomplete frame payload")
        
        payload = data[9:9 + length]
        
        return cls(length, frame_type, flags, stream_id, payload)


@dataclass
class StreamInfo:
    """HTTP/2 stream information"""
    stream_id: int
    state: StreamState = StreamState.IDLE
    window_size: int = 65535
    headers: Dict[str, str] = field(default_factory=dict)
    data: bytes = b''
    priority_weight: int = 16
    priority_dependency: int = 0
    exclusive_dependency: bool = False


class SimpleHPACK:
    """Simplified HPACK implementation for demonstration"""
    
    # Static table entries (RFC 7541 Appendix B)
    STATIC_TABLE = [
        None,  # Index 0 is not used
        (':authority', ''),
        (':method', 'GET'),
        (':method', 'POST'),
        (':path', '/'),
        (':path', '/index.html'),
        (':scheme', 'http'),
        (':scheme', 'https'),
        (':status', '200'),
        (':status', '204'),
        (':status', '206'),
        (':status', '304'),
        (':status', '400'),
        (':status', '404'),
        (':status', '500'),
        ('accept-charset', ''),
        ('accept-encoding', 'gzip, deflate'),
        ('accept-language', ''),
        ('accept-ranges', ''),
        ('accept', ''),
        ('access-control-allow-origin', ''),
        ('age', ''),
        ('allow', ''),
        ('authorization', ''),
        ('cache-control', ''),
        ('content-disposition', ''),
        ('content-encoding', ''),
        ('content-language', ''),
        ('content-length', ''),
        ('content-location', ''),
        ('content-range', ''),
        ('content-type', ''),
        ('cookie', ''),
        ('date', ''),
        ('etag', ''),
        ('expect', ''),
        ('expires', ''),
        ('from', ''),
        ('host', ''),
        ('if-match', ''),
        ('if-modified-since', ''),
        ('if-none-match', ''),
        ('if-range', ''),
        ('if-unmodified-since', ''),
        ('last-modified', ''),
        ('link', ''),
        ('location', ''),
        ('max-forwards', ''),
        ('proxy-authenticate', ''),
        ('proxy-authorization', ''),
        ('range', ''),
        ('referer', ''),
        ('refresh', ''),
        ('retry-after', ''),
        ('server', ''),
        ('set-cookie', ''),
        ('strict-transport-security', ''),
        ('transfer-encoding', ''),
        ('user-agent', ''),
        ('vary', ''),
        ('via', ''),
        ('www-authenticate', ''),
    ]
    
    def __init__(self):
        self.dynamic_table: List[Tuple[str, str]] = []
        self.dynamic_table_size = 0
        self.max_dynamic_table_size = 4096
    
    def _find_in_tables(self, name: str, value: str) -> Tuple[Optional[int], Optional[int]]:
        """Find header in static and dynamic tables"""
        name_match = None
        full_match = None
        
        # Search static table
        for i, entry in enumerate(self.STATIC_TABLE[1:], 1):
            if entry and entry[0] == name:
                if entry[1] == value:
                    full_match = i
                    break
                elif name_match is None:
                    name_match = i
        
        # Search dynamic table (indices start after static table)
        static_size = len(self.STATIC_TABLE) - 1
        for i, entry in enumerate(self.dynamic_table):
            index = static_size + i + 1
            if entry[0] == name:
                if entry[1] == value:
                    full_match = index
                    break
                elif name_match is None:
                    name_match = index
        
        return full_match, name_match
    
    def encode_headers(self, headers: Dict[str, str]) -> bytes:
        """Encode headers using simplified HPACK"""
        encoded = bytearray()
        
        for name, value in headers.items():
            name = name.lower()
            full_match, name_match = self._find_in_tables(name, value)
            
            if full_match:
                # Indexed header field (RFC 7541 Section 6.1)
                if full_match < 128:
                    encoded.append(0x80 | full_match)
                else:
                    encoded.extend(self._encode_integer(full_match, 7, 0x80))
            elif name_match:
                # Literal header field with incremental indexing (RFC 7541 Section 6.2.1)
                encoded.extend(self._encode_integer(name_match, 6, 0x40))
                encoded.extend(self._encode_string(value))
                # Add to dynamic table
                self._add_to_dynamic_table(name, value)
            else:
                # Literal header field with incremental indexing - new name (RFC 7541 Section 6.2.1)
                encoded.append(0x40)
                encoded.extend(self._encode_string(name))
                encoded.extend(self._encode_string(value))
                # Add to dynamic table
                self._add_to_dynamic_table(name, value)
        
        return bytes(encoded)
    
    def _encode_integer(self, value: int, prefix_bits: int, prefix_pattern: int) -> bytes:
        """Encode integer with N-bit prefix (RFC 7541 Section 5.1)"""
        max_prefix = (1 << prefix_bits) - 1
        
        if value < max_prefix:
            return bytes([prefix_pattern | value])
        
        encoded = [prefix_pattern | max_prefix]
        value -= max_prefix
        
        while value >= 128:
            encoded.append((value % 128) + 128)
            value //= 128
        
        encoded.append(value)
        return bytes(encoded)
    
    def _encode_string(self, string: str) -> bytes:
        """Encode string literal (RFC 7541 Section 5.2)"""
        string_bytes = string.encode('utf-8')
        length_bytes = self._encode_integer(len(string_bytes), 7, 0x00)
        return length_bytes + string_bytes
    
    def _add_to_dynamic_table(self, name: str, value: str):
        """Add entry to dynamic table with size management"""
        entry_size = 32 + len(name) + len(value)  # RFC 7541 Section 4.1
        
        # Evict entries if necessary
        while (self.dynamic_table_size + entry_size > self.max_dynamic_table_size 
               and self.dynamic_table):
            removed = self.dynamic_table.pop()
            self.dynamic_table_size -= 32 + len(removed[0]) + len(removed[1])
        
        if entry_size <= self.max_dynamic_table_size:
            self.dynamic_table.insert(0, (name, value))
            self.dynamic_table_size += entry_size


class HTTP2Client:
    """Simplified HTTP/2 client implementation according to RFC 9113"""
    
    def __init__(self):
        self.connection_window_size = 65535
        self.streams: Dict[int, StreamInfo] = {}
        self.next_stream_id = 1  # Client uses odd stream IDs
        self.settings = {
            SettingsParameter.HEADER_TABLE_SIZE: 4096,
            SettingsParameter.ENABLE_PUSH: 1,
            SettingsParameter.MAX_CONCURRENT_STREAMS: 100,
            SettingsParameter.INITIAL_WINDOW_SIZE: 65535,
            SettingsParameter.MAX_FRAME_SIZE: 16384,
            SettingsParameter.MAX_HEADER_LIST_SIZE: 8192,
        }
        self.hpack = SimpleHPACK()
        self.reader: Optional[asyncio.StreamReader] = None
        self.writer: Optional[asyncio.StreamWriter] = None
        self.response_handlers: Dict[int, Callable] = {}
    
    async def connect(self, host: str, port: int = 443, use_tls: bool = True):
        """Establish HTTP/2 connection"""
        if use_tls:
            ssl_context = ssl.create_default_context()
            ssl_context.set_alpn_protocols(['h2'])
            
            self.reader, self.writer = await asyncio.open_connection(
                host, port, ssl=ssl_context
            )
            
            # Verify ALPN negotiation
            if self.writer.get_extra_info('ssl_object').selected_alpn_protocol() != 'h2':
                raise ValueError("Server does not support HTTP/2")
        else:
            self.reader, self.writer = await asyncio.open_connection(host, port)
        
        # Send connection preface (RFC 9113 Section 3.4)
        await self._send_connection_preface()
        
        # Start frame processing task
        asyncio.create_task(self._process_frames())
    
    async def _send_connection_preface(self):
        """Send HTTP/2 connection preface"""
        # Connection preface: magic string + SETTINGS frame
        preface = b'PRI * HTTP/2.0\\r\\n\\r\\nSM\\r\\n\\r\\n'
        self.writer.write(preface)
        
        # Send initial SETTINGS frame
        await self._send_settings()
        await self.writer.drain()
    
    async def _send_settings(self, ack: bool = False):
        """Send SETTINGS frame"""
        if ack:
            # SETTINGS ACK frame
            frame = HTTP2Frame(0, FrameType.SETTINGS, FrameFlags.SETTINGS_ACK, 0, b'')
        else:
            # SETTINGS frame with parameters
            payload = bytearray()
            for param, value in self.settings.items():
                payload.extend(struct.pack('>HI', param, value))
            
            frame = HTTP2Frame(len(payload), FrameType.SETTINGS, 0, 0, bytes(payload))
        
        self.writer.write(frame.serialize())
    
    async def _process_frames(self):
        """Process incoming HTTP/2 frames"""
        while True:
            try:
                # Read frame header
                header_data = await self.reader.readexactly(9)
                if not header_data:
                    break
                
                # Parse frame
                frame = HTTP2Frame.parse(header_data + await self.reader.readexactly(
                    struct.unpack('>I', b'\\x00' + header_data[:3])[0] >> 8
                ))
                
                await self._handle_frame(frame)
                
            except asyncio.IncompleteReadError:
                break
            except Exception as e:
                logging.error(f"Frame processing error: {e}")
                break
    
    async def _handle_frame(self, frame: HTTP2Frame):
        """Handle incoming HTTP/2 frame"""
        if frame.type == FrameType.SETTINGS:
            if frame.flags & FrameFlags.SETTINGS_ACK:
                logging.debug("Received SETTINGS ACK")
            else:
                # Parse settings and send ACK
                await self._handle_settings_frame(frame)
                await self._send_settings(ack=True)
        
        elif frame.type == FrameType.HEADERS:
            await self._handle_headers_frame(frame)
        
        elif frame.type == FrameType.DATA:
            await self._handle_data_frame(frame)
        
        elif frame.type == FrameType.WINDOW_UPDATE:
            await self._handle_window_update_frame(frame)
        
        elif frame.type == FrameType.PING:
            if not (frame.flags & FrameFlags.PING_ACK):
                # Send PING ACK
                ping_ack = HTTP2Frame(8, FrameType.PING, FrameFlags.PING_ACK, 0, frame.payload)
                self.writer.write(ping_ack.serialize())
                await self.writer.drain()
        
        elif frame.type == FrameType.GOAWAY:
            logging.info("Received GOAWAY frame - connection closing")
    
    async def _handle_settings_frame(self, frame: HTTP2Frame):
        """Handle SETTINGS frame"""
        payload = frame.payload
        while len(payload) >= 6:
            param, value = struct.unpack('>HI', payload[:6])
            payload = payload[6:]
            
            if param in SettingsParameter:
                logging.debug(f"Received setting {SettingsParameter(param)}: {value}")
                # Apply setting (simplified)
                if param == SettingsParameter.INITIAL_WINDOW_SIZE:
                    # Update stream window sizes
                    for stream in self.streams.values():
                        stream.window_size = value
    
    async def _handle_headers_frame(self, frame: HTTP2Frame):
        """Handle HEADERS frame"""
        stream_id = frame.stream_id
        
        if stream_id not in self.streams:
            logging.warning(f"Received HEADERS for unknown stream {stream_id}")
            return
        
        stream = self.streams[stream_id]
        
        # Simplified header decoding (would normally use HPACK)
        # For demo purposes, we'll just store raw payload
        stream.headers['_raw_headers'] = frame.payload.hex()
        
        if frame.flags & FrameFlags.HEADERS_END_STREAM:
            stream.state = StreamState.HALF_CLOSED_REMOTE
        
        # Notify response handler if registered
        if stream_id in self.response_handlers:
            await self.response_handlers[stream_id](stream, 'headers')
    
    async def _handle_data_frame(self, frame: HTTP2Frame):
        """Handle DATA frame"""
        stream_id = frame.stream_id
        
        if stream_id not in self.streams:
            logging.warning(f"Received DATA for unknown stream {stream_id}")
            return
        
        stream = self.streams[stream_id]
        stream.data += frame.payload
        
        # Update flow control windows
        stream.window_size -= len(frame.payload)
        self.connection_window_size -= len(frame.payload)
        
        if frame.flags & FrameFlags.DATA_END_STREAM:
            stream.state = StreamState.HALF_CLOSED_REMOTE
        
        # Send window updates if needed
        if stream.window_size < 32768:  # Arbitrary threshold
            await self._send_window_update(stream_id, 65535 - stream.window_size)
            stream.window_size = 65535
        
        if self.connection_window_size < 32768:
            await self._send_window_update(0, 65535 - self.connection_window_size)
            self.connection_window_size = 65535
        
        # Notify response handler if registered
        if stream_id in self.response_handlers:
            await self.response_handlers[stream_id](stream, 'data')
    
    async def _handle_window_update_frame(self, frame: HTTP2Frame):
        """Handle WINDOW_UPDATE frame"""
        increment = struct.unpack('>I', frame.payload)[0] & 0x7FFFFFFF
        
        if frame.stream_id == 0:
            self.connection_window_size += increment
            logging.debug(f"Connection window updated: {self.connection_window_size}")
        else:
            if frame.stream_id in self.streams:
                self.streams[frame.stream_id].window_size += increment
                logging.debug(f"Stream {frame.stream_id} window updated: {self.streams[frame.stream_id].window_size}")
    
    async def _send_window_update(self, stream_id: int, increment: int):
        """Send WINDOW_UPDATE frame"""
        payload = struct.pack('>I', increment & 0x7FFFFFFF)
        frame = HTTP2Frame(4, FrameType.WINDOW_UPDATE, 0, stream_id, payload)
        self.writer.write(frame.serialize())
        await self.writer.drain()
    
    async def send_request(self, method: str, path: str, headers: Dict[str, str] = None,
                          body: bytes = None) -> int:
        """Send HTTP/2 request and return stream ID"""
        stream_id = self.next_stream_id
        self.next_stream_id += 2  # Client uses odd stream IDs
        
        # Create stream
        stream = StreamInfo(stream_id)
        stream.state = StreamState.OPEN
        self.streams[stream_id] = stream
        
        # Prepare headers
        request_headers = {
            ':method': method,
            ':path': path,
            ':scheme': 'https',
            ':authority': 'example.com',  # Should be parameterized
        }
        
        if headers:
            request_headers.update(headers)
        
        # Encode headers using HPACK
        encoded_headers = self.hpack.encode_headers(request_headers)
        
        # Send HEADERS frame
        flags = FrameFlags.HEADERS_END_HEADERS
        if not body:
            flags |= FrameFlags.HEADERS_END_STREAM
            stream.state = StreamState.HALF_CLOSED_LOCAL
        
        headers_frame = HTTP2Frame(
            len(encoded_headers), FrameType.HEADERS, flags, stream_id, encoded_headers
        )
        
        self.writer.write(headers_frame.serialize())
        
        # Send DATA frame if body present
        if body:
            data_frame = HTTP2Frame(
                len(body), FrameType.DATA, FrameFlags.DATA_END_STREAM, stream_id, body
            )
            self.writer.write(data_frame.serialize())
            stream.state = StreamState.HALF_CLOSED_LOCAL
        
        await self.writer.drain()
        return stream_id
    
    def register_response_handler(self, stream_id: int, handler: Callable):
        """Register handler for stream responses"""
        self.response_handlers[stream_id] = handler
    
    async def close(self):
        """Close HTTP/2 connection"""
        if self.writer:
            # Send GOAWAY frame
            goaway_payload = struct.pack('>II', 0, 0)  # No error
            goaway_frame = HTTP2Frame(8, FrameType.GOAWAY, 0, 0, goaway_payload)
            self.writer.write(goaway_frame.serialize())
            await self.writer.drain()
            
            self.writer.close()
            await self.writer.wait_closed()


# Example usage demonstrating HTTP/2 client
async def demonstrate_http2_client():
    """Demonstrate HTTP/2 client with multiplexing"""
    
    client = HTTP2Client()
    
    try:
        # Connect to HTTP/2 server
        await client.connect('httpbin.org', 443)
        print("Connected to HTTP/2 server")
        
        # Response storage
        responses = {}
        
        async def response_handler(stream: StreamInfo, event_type: str):
            """Handle stream responses"""
            if stream.stream_id not in responses:
                responses[stream.stream_id] = {'headers': None, 'data': b''}
            
            if event_type == 'headers':
                responses[stream.stream_id]['headers'] = stream.headers
                print(f"Stream {stream.stream_id}: Received headers")
            elif event_type == 'data':
                responses[stream.stream_id]['data'] = stream.data
                print(f"Stream {stream.stream_id}: Received {len(stream.data)} bytes")
        
        # Send multiple concurrent requests
        requests = [
            ('GET', '/json'),
            ('GET', '/headers'),
            ('GET', '/user-agent'),
            ('POST', '/post', {'content-type': 'application/json'}, b'{"test": "data"}'),
        ]
        
        stream_ids = []
        for method, path, *args in requests:
            headers = args[0] if len(args) > 0 else None
            body = args[1] if len(args) > 1 else None
            
            stream_id = await client.send_request(method, path, headers, body)
            client.register_response_handler(stream_id, response_handler)
            stream_ids.append(stream_id)
            print(f"Sent {method} {path} on stream {stream_id}")
        
        # Wait for responses
        await asyncio.sleep(5)
        
        # Display results
        print("\\n=== Response Summary ===")
        for stream_id in stream_ids:
            if stream_id in responses:
                response = responses[stream_id]
                print(f"Stream {stream_id}:")
                print(f"  Headers: {len(response.get('headers', {}))}")
                print(f"  Data size: {len(response.get('data', b''))}")
                if response['data']:
                    preview = response['data'][:100].decode('utf-8', errors='ignore')
                    print(f"  Data preview: {preview}...")
        
    except Exception as e:
        print(f"HTTP/2 client error: {e}")
    
    finally:
        await client.close()


# Example demonstrating HTTP/2 features
async def demonstrate_http2_features():
    """Demonstrate HTTP/2 protocol features"""
    
    print("=== HTTP/2 Protocol Demonstration ===")
    
    # 1. Frame serialization
    print("\\n1. Frame Serialization:")
    settings_frame = HTTP2Frame(6, FrameType.SETTINGS, 0, 0, struct.pack('>HI', 1, 4096))
    serialized = settings_frame.serialize()
    print(f"SETTINGS frame: {serialized.hex()}")
    
    # Parse it back
    parsed = HTTP2Frame.parse(serialized)
    print(f"Parsed - Type: {parsed.type}, Length: {parsed.length}, Stream: {parsed.stream_id}")
    
    # 2. HPACK encoding
    print("\\n2. HPACK Header Compression:")
    hpack = SimpleHPACK()
    headers = {
        ':method': 'GET',
        ':path': '/api/data',
        ':authority': 'example.com',
        'user-agent': 'HTTP2-Client/1.0',
        'accept': 'application/json'
    }
    
    encoded = hpack.encode_headers(headers)
    print(f"Original headers: {headers}")
    print(f"Encoded size: {len(encoded)} bytes (vs ~{sum(len(k) + len(v) + 4 for k, v in headers.items())} uncompressed)")
    print(f"Compression ratio: {len(encoded) / sum(len(k) + len(v) + 4 for k, v in headers.items()):.2%}")
    
    # 3. Stream multiplexing simulation
    print("\\n3. Stream Multiplexing Simulation:")
    streams = {
        1: "HTML document",
        3: "CSS stylesheet", 
        5: "JavaScript file",
        7: "API request"
    }
    
    for stream_id, resource in streams.items():
        headers_frame = HTTP2Frame(50, FrameType.HEADERS, 0x4, stream_id, b'x' * 50)
        data_frame = HTTP2Frame(1024, FrameType.DATA, 0x1, stream_id, b'x' * 1024)
        
        print(f"Stream {stream_id}: {resource}")
        print(f"  HEADERS frame: {len(headers_frame.serialize())} bytes")
        print(f"  DATA frame: {len(data_frame.serialize())} bytes")


if __name__ == "__main__":
    # Run demonstrations
    asyncio.run(demonstrate_http2_features())
    print("\\n" + "="*50)
    asyncio.run(demonstrate_http2_client())`;

export default rfc9113_http2_client;