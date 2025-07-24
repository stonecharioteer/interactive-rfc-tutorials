export const getCodeExample = () => `"""
RFC 7540: HTTP/2 Client Implementation

This example demonstrates HTTP/2 client functionality including
stream multiplexing, header compression, and concurrent request
handling as specified in RFC 7540.
"""

import asyncio
import time
import json
from typing import Dict, List, Optional, Any, NamedTuple
from dataclasses import dataclass
from enum import Enum


class HTTP2FrameType(Enum):
    HEADERS = "HEADERS"
    DATA = "DATA"
    SETTINGS = "SETTINGS"
    WINDOW_UPDATE = "WINDOW_UPDATE"
    PUSH_PROMISE = "PUSH_PROMISE"
    PING = "PING"
    RST_STREAM = "RST_STREAM"


@dataclass
class HTTP2Frame:
    type: HTTP2FrameType
    flags: int
    stream_id: int
    payload: Any


@dataclass
class HTTP2Stream:
    id: int
    state: str  # 'idle', 'open', 'half-closed-local', 'half-closed-remote', 'closed'
    priority: Dict[str, Any]
    window: int
    headers: Optional[Dict[str, str]] = None
    data: Optional[List[bytes]] = None


class HTTP2Connection:
    def __init__(self):
        self.streams: Dict[int, HTTP2Stream] = {}
        self.settings = {
            'HEADER_TABLE_SIZE': 4096,
            'ENABLE_PUSH': 1,
            'MAX_CONCURRENT_STREAMS': 100,
            'INITIAL_WINDOW_SIZE': 65535,
            'MAX_FRAME_SIZE': 16384,
            'MAX_HEADER_LIST_SIZE': 8192
        }
        self.window = 65535
        self.max_stream_id = 0


class HTTP2Client:
    """
    HTTP/2 Client demonstrating the revolutionary performance improvements
    that RFC 7540 brought to web communications.
    """

    def __init__(self, hostname: str, port: int = 443):
        self.hostname = hostname
        self.port = port
        self.connection = HTTP2Connection()
        self.socket = None  # Abstracted socket connection
        self.active_requests: Dict[int, asyncio.Future] = {}

        print(f"🚀 HTTP/2 Client initialized for {hostname}:{port}")

    async def connect(self) -> None:
        """
        Phase 1: Connection Establishment and Settings Exchange

        Establishes HTTP/2 connection with proper protocol negotiation
        and settings exchange as required by RFC 7540
        """
        print(f"\\n🔗 Establishing HTTP/2 connection to {self.hostname}:{self.port}")

        # In real implementation: TLS negotiation with ALPN for h2
        self.socket = await self._establish_tls_connection()

        # Send connection preface
        await self._send_connection_preface()

        # Exchange initial SETTINGS frames
        await self._exchange_settings()

        print("✅ HTTP/2 connection established successfully")
        print(f"   📊 Max Concurrent Streams: {self.connection.settings['MAX_CONCURRENT_STREAMS']}")
        print(f"   📦 Max Frame Size: {self.connection.settings['MAX_FRAME_SIZE']} bytes")

    async def make_requests(self, requests: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Phase 2: Concurrent Request Processing

        Demonstrates HTTP/2's key advantage: multiple concurrent requests
        over a single connection with stream multiplexing
        """
        print(f"\\n📤 Making {len(requests)} concurrent HTTP/2 requests:")

        # Create tasks for all requests - this is HTTP/2's superpower!
        tasks = []
        for i, request in enumerate(requests):
            stream_id = self._allocate_stream_id()
            print(f"   🌊 Stream {stream_id}: GET {request['path']}")

            task = asyncio.create_task(
                self._send_request(stream_id, 'GET', request['path'], request.get('headers', {}))
            )
            tasks.append(task)

        # All requests sent concurrently - this is HTTP/2's superpower!
        print("⚡ All requests sent simultaneously over single connection")

        responses = await asyncio.gather(*tasks)

        print(f"✅ All {len(responses)} responses received")
        return responses

    async def _send_request(
        self,
        stream_id: int,
        method: str,
        path: str,
        headers: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Phase 3: Individual Request/Response Processing

        Handles a single HTTP/2 request with proper header compression
        and stream state management
        """

        # Create new stream
        stream = HTTP2Stream(
            id=stream_id,
            state='idle',
            priority={'dependency': 0, 'weight': 16, 'exclusive': False},
            window=self.connection.settings['INITIAL_WINDOW_SIZE'],
            headers={},
            data=[]
        )

        self.connection.streams[stream_id] = stream

        # Prepare pseudo-headers (HTTP/2 requirement)
        pseudo_headers = {
            ':method': method,
            ':path': path,
            ':scheme': 'https',
            ':authority': self.hostname
        }

        # Combine all headers
        all_headers = {**pseudo_headers, **headers}

        print(f"     📋 Headers for Stream {stream_id}:")
        for name, value in all_headers.items():
            print(f"       {name}: {value}")

        # Compress headers using HPACK
        compressed_headers = self._compress_headers(all_headers)
        original_size = self._calculate_header_size(all_headers)

        print(f"     🗜️  HPACK Compression: {original_size} → {len(compressed_headers)} bytes")

        # Send HEADERS frame
        headers_frame = HTTP2Frame(
            type=HTTP2FrameType.HEADERS,
            flags=0x05,  # END_HEADERS | END_STREAM (no body)
            stream_id=stream_id,
            payload=compressed_headers
        )

        stream.state = 'half-closed-local'

        await self._send_frame(headers_frame)

        # Wait for response
        return await self._wait_for_response(stream_id)

    async def _wait_for_response(self, stream_id: int) -> Dict[str, Any]:
        """
        Phase 4: Response Processing and Stream Management

        Handles incoming HTTP/2 frames and assembles complete responses
        """
        stream = self.connection.streams[stream_id]
        response = {
            'status': 0,
            'headers': {},
            'body': b''
        }

        # Simulate frame reception (in real implementation, this would be event-driven)
        await asyncio.sleep(0.1 + (stream_id % 3) * 0.05)  # Simulate network delay

        # Simulate receiving HEADERS frame
        print(f"     📨 Received HEADERS frame for Stream {stream_id}")

        # Simulate decompressed headers
        response_headers = {
            ':status': '200',
            'content-type': 'application/json',
            'server': 'HTTP2-Server/1.0',
            'cache-control': 'max-age=3600'
        }

        for name, value in response_headers.items():
            if name == ':status':
                response['status'] = int(value)
                print(f"       📊 Status: {value}")
            else:
                response['headers'][name] = value
                print(f"       📋 {name}: {value}")

        # Simulate receiving DATA frame
        response_body = json.dumps({
            "message": "HTTP/2 response data",
            "streamId": stream_id,
            "timestamp": time.time()
        }).encode()

        print(f"     📦 Received DATA frame for Stream {stream_id} ({len(response_body)} bytes)")

        response['body'] = response_body

        # Send WINDOW_UPDATE to maintain flow control
        await self._send_window_update(stream_id, len(response_body))

        stream.state = 'closed'
        print(f"     ✅ Stream {stream_id} complete ({len(response_body)} bytes total)")

        return response

    # Helper methods for HTTP/2 protocol implementation

    def _allocate_stream_id(self) -> int:
        """Allocate a new stream ID (client-initiated streams are odd)"""
        self.connection.max_stream_id += 2
        return self.connection.max_stream_id

    async def _send_connection_preface(self) -> None:
        """Send HTTP/2 connection preface"""
        # HTTP/2 connection preface: "PRI * HTTP/2.0\\r\\n\\r\\nSM\\r\\n\\r\\n"
        preface = b"PRI * HTTP/2.0\\r\\n\\r\\nSM\\r\\n\\r\\n"
        # await self.socket.write(preface)  # In real implementation
        print("   📤 Sent connection preface")

    async def _exchange_settings(self) -> None:
        """Exchange SETTINGS frames with server"""
        settings_frame = HTTP2Frame(
            type=HTTP2FrameType.SETTINGS,
            flags=0x00,
            stream_id=0,
            payload=list(self.connection.settings.items())
        )

        await self._send_frame(settings_frame)
        print("   ⚙️  Sent SETTINGS frame")

        # In real implementation, would wait for server SETTINGS and SETTINGS ACK

    def _compress_headers(self, headers: Dict[str, str]) -> bytes:
        """
        Simplified HPACK compression simulation
        Real HPACK would use dynamic table and Huffman coding
        """
        header_string = '\\n'.join([f"{name}: {value}" for name, value in headers.items()])
        compressed = header_string.encode()

        # Simulate compression ratio (typically 70-90% compression)
        compression_ratio = 0.8
        return compressed[:int(len(compressed) * compression_ratio)]

    def _calculate_header_size(self, headers: Dict[str, str]) -> int:
        """Calculate uncompressed header size"""
        return sum(len(name) + len(value) + 4 for name, value in headers.items())  # +4 for ": " and "\\r\\n"

    async def _send_frame(self, frame: HTTP2Frame) -> None:
        """Simulate frame serialization and sending"""
        print(f"     📤 Sending {frame.type.value} frame (Stream {frame.stream_id})")

        # In real implementation: serialize frame with 9-byte header + payload
        # Frame format: Length(24) + Type(8) + Flags(8) + R(1) + Stream ID(31) + Payload

        # Simulate network delay
        await asyncio.sleep(0.01)

    async def _send_window_update(self, stream_id: int, increment: int) -> None:
        """Send WINDOW_UPDATE frame for flow control"""
        window_update_frame = HTTP2Frame(
            type=HTTP2FrameType.WINDOW_UPDATE,
            flags=0x00,
            stream_id=stream_id,
            payload={'increment': increment}
        )

        await self._send_frame(window_update_frame)
        print(f"     📈 Sent WINDOW_UPDATE for Stream {stream_id} (+{increment} bytes)")


# Usage Example: HTTP/2 Performance Demonstration
async def demonstrate_http2_client():
    """
    RFC 7540 HTTP/2 Client Demonstration
    This shows the performance revolution that HTTP/2 brought to the web!
    """
    print("🚀 RFC 7540 HTTP/2 Client Demonstration")
    print("This shows the performance revolution that HTTP/2 brought to the web!")

    client = HTTP2Client("example.com", 443)

    try:
        # Phase 1: Establish connection
        await client.connect()

        # Phase 2: Demonstrate concurrent requests
        print("\\n=== Concurrent Request Demonstration ===")

        web_page_resources = [
            {"path": "/", "headers": {"accept": "text/html"}},
            {"path": "/styles.css", "headers": {"accept": "text/css"}},
            {"path": "/app.js", "headers": {"accept": "application/javascript"}},
            {"path": "/api/data", "headers": {"accept": "application/json"}}
        ]

        responses = await client.make_requests(web_page_resources)

        print(f"\\n✅ Successfully loaded {len(responses)} resources concurrently!")

        print("\\n🎓 Key HTTP/2 Benefits Demonstrated:")
        print("• Multiplexing: All requests sent simultaneously over one connection")
        print("• Header Compression: HPACK reduces overhead by 70-90%")
        print("• Binary Protocol: Efficient parsing and processing")
        print("• Flow Control: Prevents fast senders from overwhelming receivers")
        print("• Stream Prioritization: Critical resources can be prioritized")

    except Exception as error:
        print(f"❌ HTTP/2 demonstration failed: {error}")


# Python HTTP/2 Libraries for Production Use
def show_python_http2_libraries():
    """
    Real Python libraries for HTTP/2 in production applications
    """
    print("\\n📚 Python HTTP/2 Libraries:")

    print("\\n🔧 httpx - Modern async HTTP client:")
    print('''import httpx

async def concurrent_http2_requests():
    async with httpx.AsyncClient(http2=True) as client:
        # Multiple requests over single HTTP/2 connection
        tasks = [
            client.get('https://httpbin.org/delay/1'),
            client.get('https://httpbin.org/json'),
            client.get('https://httpbin.org/user-agent')
        ]
        responses = await asyncio.gather(*tasks)
        return responses''')

    print("\\n🔧 aiohttp - Async HTTP framework:")
    print('''from aiohttp import ClientSession

async def aiohttp_http2():
    async with ClientSession() as session:
        async with session.get('https://api.github.com/user') as resp:
            return await resp.json()''')

    print("\\n🔧 h2 - Pure Python HTTP/2 implementation:")
    print('''import h2.connection

def low_level_http2():
    conn = h2.connection.H2Connection()
    conn.initiate_connection()

    headers = [
        (':method', 'GET'),
        (':path', '/'),
        (':authority', 'example.com'),
        (':scheme', 'https'),
    ]
    conn.send_headers(stream_id=1, headers=headers)
    return conn.data_to_send()''')


if __name__ == "__main__":
    asyncio.run(demonstrate_http2_client())
    show_python_http2_libraries()
`;

export default { getCodeExample };
