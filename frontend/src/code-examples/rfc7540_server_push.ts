export const getCodeExample = () => `"""
RFC 7540: HTTP/2 Server Push Implementation

This example demonstrates HTTP/2 Server Push functionality,
allowing servers to proactively send resources to clients
before they're requested, eliminating round-trip delays.
"""

import asyncio
import json
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum


@dataclass
class PushResource:
    path: str
    content_type: str
    data: bytes
    priority: int
    cache_headers: Dict[str, str]


@dataclass
class ClientConnection:
    id: str
    streams: Dict[int, Any]
    settings: Dict[str, int]
    push_promises: Dict[str, int]  # path -> promised stream ID
    push_disabled: bool


class HTTP2ServerPush:
    """
    HTTP/2 Server Push implementation demonstrating proactive resource delivery
    """

    def __init__(self):
        self.connections: Dict[str, ClientConnection] = {}
        self.push_resources: Dict[str, PushResource] = {}
        self.push_statistics = {
            'promised': 0,
            'accepted': 0,
            'rejected': 0,
            'cache_misses': 0
        }

        self._initialize_push_resources()
        print("🚀 HTTP/2 Server Push engine initialized")

    async def handle_primary_request(
        self,
        connection_id: str,
        stream_id: int,
        request_path: str,
        request_headers: Dict[str, str]
    ) -> None:
        """
        Phase 1: Analyze Request and Determine Push Candidates

        When a client requests a primary resource (like HTML), analyze
        what secondary resources they'll likely need and prepare push
        """

        print(f"\\n📥 Processing primary request: {request_path}")

        connection = self.connections.get(connection_id)
        if not connection:
            print(f"❌ Connection {connection_id} not found")
            return

        # Check if client supports push
        if connection.push_disabled:
            print("   ⚠️  Client has disabled server push")
            return await self._send_regular_response(connection_id, stream_id, request_path)

        # Analyze request to determine push candidates
        push_candidates = self._analyze_push_candidates(request_path, request_headers)

        if not push_candidates:
            print(f"   ℹ️  No push candidates identified for {request_path}")
            return await self._send_regular_response(connection_id, stream_id, request_path)

        print(f"   🎯 Identified {len(push_candidates)} push candidates:")
        for candidate in push_candidates:
            print(f"     • {candidate.path} (priority: {candidate.priority})")

        # Send push promises before the main response
        await self._send_push_promises(connection_id, stream_id, push_candidates)

        # Send the main response
        await self._send_regular_response(connection_id, stream_id, request_path)

        # Send pushed resources
        await self._send_pushed_resources(connection_id, push_candidates)

    async def _send_push_promises(
        self,
        connection_id: str,
        parent_stream_id: int,
        candidates: List[PushResource]
    ) -> None:
        """
        Phase 2: Send PUSH_PROMISE Frames

        Notify the client about resources we're about to push,
        giving them a chance to cancel if they already have them cached
        """

        print(f"\\n🤝 Sending PUSH_PROMISE frames for {len(candidates)} resources")

        connection = self.connections[connection_id]

        for candidate in candidates:
            promised_stream_id = self._allocate_stream_id(connection)

            # Check if we've already promised this resource
            if candidate.path in connection.push_promises:
                print(f"   ⚠️  Resource {candidate.path} already promised")
                continue

            print(f"   📤 PUSH_PROMISE: {candidate.path} (Stream {promised_stream_id})")

            # Create push promise headers
            promise_headers = {
                ':method': 'GET',
                ':path': candidate.path,
                ':scheme': 'https',
                ':authority': 'example.com'
            }

            # Send PUSH_PROMISE frame
            push_promise_frame = {
                'type': 'PUSH_PROMISE',
                'flags': 0x04,  # END_HEADERS
                'stream_id': parent_stream_id,
                'payload': {
                    'promised_stream_id': promised_stream_id,
                    'headers': self._compress_headers(promise_headers)
                }
            }

            await self._send_frame(connection_id, push_promise_frame)

            # Track the promise
            connection.push_promises[candidate.path] = promised_stream_id
            self.push_statistics['promised'] += 1

            print(f"     ✅ Promised {candidate.path} on Stream {promised_stream_id}")

    async def _send_pushed_resources(
        self,
        connection_id: str,
        candidates: List[PushResource]
    ) -> None:
        """
        Phase 3: Send Pushed Resource Data

        After sending promises, actually deliver the pushed resources
        unless the client has cancelled them with RST_STREAM
        """

        print("\\n📦 Sending pushed resource data")

        connection = self.connections[connection_id]

        # Sort by priority (higher number = higher priority)
        sorted_candidates = sorted(candidates, key=lambda x: x.priority, reverse=True)

        for resource in sorted_candidates:
            stream_id = connection.push_promises.get(resource.path)

            if not stream_id:
                print(f"   ⚠️  No stream ID found for {resource.path}")
                continue

            # Check if client cancelled the push
            stream = connection.streams.get(stream_id, {})
            if stream.get('cancelled'):
                print(f"   ❌ Client cancelled push for {resource.path}")
                self.push_statistics['rejected'] += 1
                continue

            print(f"   📤 Pushing {resource.path} ({len(resource.data)} bytes)")

            # Send response headers
            response_headers = {
                ':status': '200',
                'content-type': resource.content_type,
                'content-length': str(len(resource.data)),
                **resource.cache_headers
            }

            headers_frame = {
                'type': 'HEADERS',
                'flags': 0x04,  # END_HEADERS
                'stream_id': stream_id,
                'payload': self._compress_headers(response_headers)
            }

            await self._send_frame(connection_id, headers_frame)

            # Send response data
            data_frame = {
                'type': 'DATA',
                'flags': 0x01,  # END_STREAM
                'stream_id': stream_id,
                'payload': resource.data
            }

            await self._send_frame(connection_id, data_frame)

            self.push_statistics['accepted'] += 1
            print(f"     ✅ Successfully pushed {resource.path}")

    def _analyze_push_candidates(
        self,
        request_path: str,
        request_headers: Dict[str, str]
    ) -> List[PushResource]:
        """
        Analyze incoming request to determine what resources to push
        """

        candidates = []
        user_agent = request_headers.get('user-agent', '')
        accept_encoding = request_headers.get('accept-encoding', '')

        # HTML pages - push critical CSS and JS
        if request_path == '/' or request_path.endswith('.html'):
            print("   🔍 Analyzing HTML page request")

            # Always push critical CSS
            critical_css = self.push_resources.get('/css/critical.css')
            if critical_css:
                candidates.append(critical_css)

            # Push application JavaScript
            app_js = self.push_resources.get('/js/app.js')
            if app_js:
                candidates.append(app_js)

            # Push web fonts for faster text rendering
            web_font = self.push_resources.get('/fonts/roboto.woff2')
            if web_font and 'woff2' in accept_encoding:
                candidates.append(web_font)

            # Mobile-specific optimizations
            if self._is_mobile_user_agent(user_agent):
                mobile_css = self.push_resources.get('/css/mobile.css')
                if mobile_css:
                    candidates.append(mobile_css)

        # API endpoints - push related data
        elif request_path.startswith('/api/'):
            print("   🔍 Analyzing API request")

            if request_path == '/api/user':
                # When user data is requested, likely need user preferences too
                user_prefs = self.push_resources.get('/api/user/preferences')
                if user_prefs:
                    candidates.append(user_prefs)

            elif request_path == '/api/dashboard':
                # Dashboard requests often need config and notifications
                config = self.push_resources.get('/api/config')
                notifications = self.push_resources.get('/api/notifications')

                if config:
                    candidates.append(config)
                if notifications:
                    candidates.append(notifications)

        # E-commerce specific optimizations
        elif '/product/' in request_path:
            print("   🔍 Analyzing product page request")

            # Push product images and related products
            product_images = self.push_resources.get('/images/product-gallery.jpg')
            related_products = self.push_resources.get('/api/products/related')

            if product_images:
                candidates.append(product_images)
            if related_products:
                candidates.append(related_products)

        return candidates

    def handle_push_cancellation(self, connection_id: str, stream_id: int, error_code: int) -> None:
        """
        Handle client's RST_STREAM frame (push cancellation)
        """
        print(f"\\n❌ Client cancelled push on Stream {stream_id} (error: {error_code})")

        connection = self.connections.get(connection_id)
        if not connection:
            return

        # Find and mark the stream as cancelled
        stream = connection.streams.get(stream_id, {})
        stream['cancelled'] = True
        self.push_statistics['rejected'] += 1

        # Find which resource was cancelled
        for path, promised_stream_id in connection.push_promises.items():
            if promised_stream_id == stream_id:
                print(f"   📋 Cancelled resource: {path}")

                # Update push strategy based on cancellation patterns
                self._update_push_strategy(path, 'cancelled')
                break

    def _update_push_strategy(self, resource_path: str, outcome: str) -> None:
        """
        Update push strategy based on client behavior
        """
        # In a real implementation, this would use machine learning or analytics
        # to improve push predictions based on user behavior patterns

        print(f"   📊 Updating push strategy for {resource_path}: {outcome}")

        resource = self.push_resources.get(resource_path)
        if resource:
            if outcome == 'accepted':
                resource.priority = min(resource.priority + 1, 10)
            elif outcome == 'cancelled':
                resource.priority = max(resource.priority - 1, 1)
            elif outcome == 'unused':
                resource.priority = max(resource.priority - 0.5, 1)

            print(f"     📈 New priority for {resource_path}: {resource.priority}")

    def generate_push_report(self) -> str:
        """
        Generate comprehensive push performance report
        """
        success_rate = (
            (self.push_statistics['accepted'] / self.push_statistics['promised'] * 100)
            if self.push_statistics['promised'] > 0 else 0.0
        )

        rejection_rate = (
            (self.push_statistics['rejected'] / self.push_statistics['promised'] * 100)
            if self.push_statistics['promised'] > 0 else 0.0
        )

        # Get top push resources by priority
        top_resources = sorted(
            self.push_resources.items(),
            key=lambda x: x[1].priority,
            reverse=True
        )[:5]

        top_resources_text = '\\n'.join([
            f"   • {path} (priority: {resource.priority})"
            for path, resource in top_resources
        ])

        return f'''
🔍 HTTP/2 Server Push Performance Report
=======================================

📊 Push Statistics:
   • Total Promises Sent: {self.push_statistics['promised']}
   • Successfully Accepted: {self.push_statistics['accepted']}
   • Client Rejections: {self.push_statistics['rejected']}
   • Cache Misses: {self.push_statistics['cache_misses']}

📈 Performance Metrics:
   • Push Success Rate: {success_rate:.1f}%
   • Push Rejection Rate: {rejection_rate:.1f}%
   • Active Connections: {len(self.connections)}

🎯 Top Push Resources:
{top_resources_text}

💡 RFC 7540 Server Push Benefits:
   ✅ Eliminates round-trip delays for critical resources
   ✅ Reduces time-to-first-paint and time-to-interactive
   ✅ Enables proactive resource delivery based on patterns
   ✅ Improves mobile performance on high-latency networks
   ✅ Allows intelligent cache warming strategies

⚠️  Server Push Considerations:
   • Careful analysis needed to avoid pushing unwanted resources
   • Client cache state awareness important for efficiency
   • Network conditions affect push effectiveness
   • HTTP/3 focuses more on 0-RTT and early data instead
        '''.strip()

    # Helper methods for server implementation

    def _initialize_push_resources(self) -> None:
        """Initialize common push resources"""

        # Critical CSS - highest priority
        self.push_resources['/css/critical.css'] = PushResource(
            path='/css/critical.css',
            content_type='text/css',
            data=b'''
                /* Critical above-the-fold styles */
                body { font-family: -apple-system, sans-serif; margin: 0; }
                .header { background: #007bff; color: white; padding: 1rem; }
                .main { max-width: 1200px; margin: 0 auto; padding: 2rem; }
            ''',
            priority=10,
            cache_headers={
                'cache-control': 'public, max-age=31536000',
                'etag': '"css-v1.2"'
            }
        )

        # Application JavaScript
        self.push_resources['/js/app.js'] = PushResource(
            path='/js/app.js',
            content_type='application/javascript',
            data=b'''
                // Main application JavaScript
                console.log('App initialized via HTTP/2 Server Push!');

                // Initialize critical functionality
                document.addEventListener('DOMContentLoaded', function() {
                    // App startup code
                    window.App = { version: '2.1.0', pushEnabled: true };
                });
            ''',
            priority=8,
            cache_headers={
                'cache-control': 'public, max-age=86400',
                'etag': '"js-v2.1"'
            }
        )

        # API responses for common endpoints
        self.push_resources['/api/user/preferences'] = PushResource(
            path='/api/user/preferences',
            content_type='application/json',
            data=json.dumps({
                'theme': 'light',
                'language': 'en',
                'notifications': True,
                'timezone': 'America/New_York'
            }).encode(),
            priority=6,
            cache_headers={
                'cache-control': 'private, max-age=300',
                'etag': '"prefs-v1"'
            }
        )

        print(f"   📚 Initialized {len(self.push_resources)} push resources")

    def _allocate_stream_id(self, connection: ClientConnection) -> int:
        """Allocate stream ID for server-initiated streams (even numbers)"""
        stream_id = 2
        while stream_id in connection.streams:
            stream_id += 2

        connection.streams[stream_id] = {'id': stream_id, 'cancelled': False}
        return stream_id

    def _compress_headers(self, headers: Dict[str, str]) -> bytes:
        """Simplified HPACK compression"""
        header_string = '\\n'.join([f"{name}: {value}" for name, value in headers.items()])
        return header_string.encode()

    async def _send_frame(self, connection_id: str, frame: Dict[str, Any]) -> None:
        """Simulate sending HTTP/2 frame to client"""
        print(f"     📤 {frame['type']} frame sent (Stream {frame['stream_id']})")

        # Simulate network delay
        await asyncio.sleep(0.01)

    async def _send_regular_response(self, connection_id: str, stream_id: int, path: str) -> None:
        """Send regular HTTP response"""
        print(f"   📤 Sending regular response for {path}")

        # Send response headers
        headers = {
            ':status': '200',
            'content-type': 'text/html',
            'server': 'HTTP2-Push-Server/1.0'
        }

        await self._send_frame(connection_id, {
            'type': 'HEADERS',
            'flags': 0x04,
            'stream_id': stream_id,
            'payload': self._compress_headers(headers)
        })

        # Send response body
        html_content = '''
            <!DOCTYPE html>
            <html>
            <head>
                <title>HTTP/2 Server Push Demo</title>
                <link rel="stylesheet" href="/css/critical.css">
            </head>
            <body>
                <div class="header">HTTP/2 Server Push Demo</div>
                <div class="main">
                    <h1>Welcome!</h1>
                    <p>This page's resources were pushed via HTTP/2 Server Push!</p>
                </div>
                <script src="/js/app.js"></script>
            </body>
            </html>
        '''

        await self._send_frame(connection_id, {
            'type': 'DATA',
            'flags': 0x01,
            'stream_id': stream_id,
            'payload': html_content.encode()
        })

    def _is_mobile_user_agent(self, user_agent: str) -> bool:
        """Check if user agent indicates mobile device"""
        mobile_indicators = ['Mobile', 'Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'IEMobile', 'Opera Mini']
        return any(indicator in user_agent for indicator in mobile_indicators)


# Usage Example: Server Push Optimization
async def demonstrate_server_push():
    """
    RFC 7540 HTTP/2 Server Push Demonstration
    This shows how servers can eliminate round-trip delays!
    """
    print("🚀 RFC 7540 HTTP/2 Server Push Demonstration")
    print("This shows how servers can eliminate round-trip delays!")

    push_server = HTTP2ServerPush()

    # Simulate client connection
    connection_id = "conn-123"
    push_server.connections[connection_id] = ClientConnection(
        id=connection_id,
        streams={},
        settings={'ENABLE_PUSH': 1},
        push_promises={},
        push_disabled=False
    )

    print("\\n=== Simulating Client Requests ===")

    # Simulate various request scenarios
    request_scenarios = [
        {
            'path': "/",
            'headers': {
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
                'accept-encoding': 'gzip, deflate, br, woff2'
            }
        },
        {
            'path': "/api/user",
            'headers': {
                'accept': 'application/json',
                'authorization': 'Bearer token123'
            }
        },
        {
            'path': "/product/laptop-123",
            'headers': {
                'accept': 'text/html',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }
    ]

    stream_id = 1

    for i, scenario in enumerate(request_scenarios):
        print(f"\\n--- Request Scenario {stream_id} ---")

        await push_server.handle_primary_request(
            connection_id,
            stream_id,
            scenario['path'],
            scenario['headers']
        )

        stream_id += 2  # Client-initiated streams are odd

    print("\\n=== Push Strategy Analysis ===")
    print(push_server.generate_push_report())

    print("\\n🌐 Real-World Server Push Impact:")
    print("• Critical CSS pushed → Faster first paint")
    print("• JavaScript pushed → Reduced time-to-interactive")
    print("• Web fonts pushed → No font loading delays")
    print("• API data pushed → Instant application state")

    print("\\n⚡ Performance Benefits:")
    print("• 20-50% reduction in page load time")
    print("• Eliminates multiple round-trip delays")
    print("• Especially effective on high-latency mobile networks")
    print("• Enables sub-second web application startup")


# Python HTTP/2 Server Libraries
def show_python_http2_server_libraries():
    """
    Real Python libraries for HTTP/2 server implementation
    """
    print("\\n📚 Python HTTP/2 Server Libraries:")

    print("\\n🔧 hypercorn - ASGI HTTP/2 server:")
    print('''# Install: pip install hypercorn[h2]
from hypercorn.config import Config
from hypercorn.asyncio import serve
import asyncio

async def app(scope, receive, send):
    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [[b'content-type', b'text/plain']],
    })
    await send({
        'type': 'http.response.body',
        'body': b'Hello HTTP/2!',
    })

config = Config()
config.bind = ["localhost:8000"]
config.alpn_protocols = ["h2", "http/1.1"]
asyncio.run(serve(app, config))''')

    print("\\n🔧 aiohttp - HTTP/2 server support:")
    print('''from aiohttp import web, web_response
import ssl

async def handle(request):
    # aiohttp automatically handles HTTP/2 when TLS is configured
    return web_response.Response(text="Hello HTTP/2!")

app = web.Application()
app.router.add_get('/', handle)

# TLS context for HTTP/2
ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain('cert.pem', 'key.pem')

web.run_app(app, host='localhost', port=8443, ssl_context=ssl_context)''')


if __name__ == "__main__":
    asyncio.run(demonstrate_server_push())
    show_python_http2_server_libraries()
`;

export default { getCodeExample };
