import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC2068() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 2068: Hypertext Transfer Protocol -- HTTP/1.1 (January 1997)</h1>

      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          The Performance Revolution
        </h3>
        <p className="text-purple-800">
          <GlossaryTerm>HTTP/1.1</GlossaryTerm> transformed web performance by introducing persistent connections, 
          chunked encoding, and the mandatory Host header. This was the first major evolution of HTTP 
          that addressed the scalability limitations of HTTP/1.0.
        </p>
        <p className="text-purple-700 text-sm mt-2">
          <strong>Read the original:</strong> <a href="https://www.rfc-editor.org/rfc/rfc2068.html" 
          className="underline" target="_blank" rel="noopener noreferrer">RFC 2068</a>
        </p>
      </div>

      <h2>Evolution from HTTP/1.0 to HTTP/1.1</h2>

      <p>
        By 1997, the web had exploded beyond what <GlossaryTerm>HTTP/1.0</GlossaryTerm> could efficiently handle. 
        Websites were becoming more complex, with multiple images, stylesheets, and scripts per page. 
        HTTP/1.0's "one request per connection" model was causing severe performance bottlenecks.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">HTTP/1.0 vs HTTP/1.1 Comparison:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-red-800">❌ HTTP/1.0 Problems</h5>
            <ul className="text-sm text-red-700 mt-2">
              <li>New TCP connection per request</li>
              <li>High latency for multiple resources</li>
              <li>No virtual hosting support</li>
              <li>Inefficient connection management</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-green-800">✅ HTTP/1.1 Solutions</h5>
            <ul className="text-sm text-green-700 mt-2">
              <li>Persistent connections by default</li>
              <li>Pipelining support</li>
              <li>Mandatory Host header</li>
              <li>Chunked transfer encoding</li>
            </ul>
          </div>
        </div>
      </div>

      <h3>Key Innovations in HTTP/1.1</h3>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900">🔗 Persistent Connections</h4>
          <p className="text-blue-800 text-sm">
            Connections stay open by default, allowing multiple requests over the same <GlossaryTerm>TCP</GlossaryTerm> connection. 
            This dramatically reduces connection overhead and improves performance.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">🏠 Mandatory Host Header</h4>
          <p className="text-green-800 text-sm">
            Enables virtual hosting - multiple websites can share the same IP address. 
            This was crucial for the web's scalability as IP addresses became scarce.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h4 className="font-semibold text-yellow-900">📦 Chunked Transfer Encoding</h4>
          <p className="text-yellow-800 text-sm">
            Allows servers to send data before knowing the total content length. 
            Perfect for dynamically generated content and streaming responses.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded">
          <h4 className="font-semibold text-purple-900">⚡ HTTP Pipelining</h4>
          <p className="text-purple-800 text-sm">
            Clients can send multiple requests without waiting for responses. 
            Reduces latency but requires careful implementation to avoid head-of-line blocking.
          </p>
        </div>
      </div>

      <h3>HTTP/1.1 Request Example</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Persistent Connection Request:</h4>
        <pre className="text-sm">
{`GET /style.css HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/4.0
Connection: keep-alive

HTTP/1.1 200 OK
Content-Type: text/css
Content-Length: 1234
Connection: keep-alive

/* CSS content here */

GET /script.js HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/4.0
Connection: keep-alive

HTTP/1.1 200 OK
Content-Type: application/javascript
Content-Length: 5678
Connection: keep-alive

/* JavaScript content here */`}
        </pre>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Note:</strong> Both requests use the same TCP connection!
        </p>
      </div>

      <h3>Chunked Transfer Encoding</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Chunked Response Format:</h4>
        <pre className="text-sm">
{`HTTP/1.1 200 OK
Content-Type: text/html
Transfer-Encoding: chunked

1a
<html><head><title>Demo
1b
</title></head><body>
10
<h1>Hello World!
c
</h1></body>
7
</html>
0

`}
        </pre>
        <p className="text-sm text-gray-600 mt-2">
          Each chunk starts with its size in hexadecimal, followed by the data. 
          A zero-length chunk marks the end.
        </p>
      </div>

      <ExpandableSection title="🐍 Python HTTP/1.1 Implementation">
        <p>
          Let's implement HTTP/1.1 features to understand the improvements:
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import threading
import time
from datetime import datetime

class HTTP11Server:
    """HTTP/1.1 server implementing RFC 2068 features."""
    
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.server_socket = None
        
    def start(self):
        """Start the HTTP/1.1 server."""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            
            print(f"🌐 HTTP/1.1 Server started on {self.host}:{self.port}")
            print("🚀 RFC 2068 features: persistent connections, chunked encoding, Host header")
            
            while True:
                client_socket, client_address = self.server_socket.accept()
                print(f"🔗 New connection from {client_address}")
                
                # Handle persistent connection
                client_thread = threading.Thread(
                    target=self.handle_persistent_connection,
                    args=(client_socket, client_address)
                )
                client_thread.daemon = True
                client_thread.start()
                
        except KeyboardInterrupt:
            print("\\n🛑 Server shutting down...")
        finally:
            if self.server_socket:
                self.server_socket.close()
    
    def handle_persistent_connection(self, client_socket, client_address):
        """Handle multiple requests on persistent connection."""
        request_count = 0
        connection_start = time.time()
        
        try:
            client_socket.settimeout(30)  # 30 second timeout
            
            while True:
                try:
                    # Read request
                    request_data = self.read_http_request(client_socket)
                    
                    if not request_data:
                        break
                        
                    request_count += 1
                    print(f"📨 Request #{request_count} from {client_address}")
                    
                    # Parse request
                    lines = request_data.split('\\n')
                    request_line = lines[0].strip()
                    
                    if not request_line:
                        break
                        
                    # Parse headers
                    headers = {}
                    for line in lines[1:]:
                        line = line.strip()
                        if not line:
                            break
                        if ':' in line:
                            key, value = line.split(':', 1)
                            headers[key.strip().lower()] = value.strip()
                    
                    # Validate HTTP/1.1 requirements
                    parts = request_line.split()
                    if len(parts) < 3:
                        self.send_error_response(client_socket, 400, "Bad Request")
                        break
                        
                    method, path, version = parts[0], parts[1], parts[2]
                    
                    # HTTP/1.1 requires Host header
                    if version == "HTTP/1.1" and 'host' not in headers:
                        self.send_error_response(client_socket, 400, "Bad Request", 
                                               "HTTP/1.1 requires Host header")
                        break
                    
                    # Handle the request
                    should_close = self.handle_request(client_socket, method, path, 
                                                     version, headers, request_count)
                    
                    # Check if connection should close
                    connection_header = headers.get('connection', '').lower()
                    if (should_close or 
                        connection_header == 'close' or 
                        version == "HTTP/1.0"):
                        print(f"🔌 Closing connection after {request_count} requests")
                        break
                        
                except socket.timeout:
                    print(f"⏰ Connection timeout after {request_count} requests")
                    break
                except Exception as e:
                    print(f"❌ Error handling request: {e}")
                    break
            
            connection_duration = time.time() - connection_start
            print(f"📊 Connection stats: {request_count} requests in {connection_duration:.2f}s")
            
        finally:
            client_socket.close()
    
    def read_http_request(self, client_socket):
        """Read a complete HTTP request."""
        request_data = ""
        
        while True:
            chunk = client_socket.recv(1024).decode('utf-8')
            if not chunk:
                break
                
            request_data += chunk
            
            # Check if we have complete headers (double CRLF)
            if '\\n\\n' in request_data or '\\r\\n\\r\\n' in request_data:
                break
        
        return request_data
    
    def handle_request(self, client_socket, method, path, version, headers, request_num):
        """Handle individual HTTP request."""
        
        if method == "GET":
            if path == "/" or path == "/index.html":
                content = self.get_demo_page(request_num)
                self.send_response(client_socket, 200, "OK", content, "text/html", 
                                 version, keep_alive=True)
                
            elif path == "/chunked":
                # Demonstrate chunked encoding
                self.send_chunked_response(client_socket, version)
                
            elif path == "/resources":
                # Simulate multiple resource requests
                content = self.get_resources_page()
                self.send_response(client_socket, 200, "OK", content, "text/html", 
                                 version, keep_alive=True)
                
            elif path == "/close":
                content = "<html><body><h1>Connection will close</h1></body></html>"
                self.send_response(client_socket, 200, "OK", content, "text/html", 
                                 version, keep_alive=False)
                return True  # Signal to close connection
                
            else:
                self.send_error_response(client_socket, 404, "Not Found")
                
        else:
            self.send_error_response(client_socket, 501, "Not Implemented")
            
        return False  # Keep connection open
    
    def send_response(self, client_socket, status_code, status_text, content, 
                     content_type, version, keep_alive=True):
        """Send HTTP/1.1 response with persistent connection support."""
        content_bytes = content.encode('utf-8')
        
        connection_header = "keep-alive" if keep_alive and version == "HTTP/1.1" else "close"
        
        response = f"""HTTP/1.1 {status_code} {status_text}\\r
Content-Type: {content_type}\\r
Content-Length: {len(content_bytes)}\\r
Connection: {connection_header}\\r
Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}\\r
Server: Python-HTTP11-Server/1.0\\r
\\r
""".encode('utf-8') + content_bytes
        
        client_socket.sendall(response)
        print(f"📤 Sent {status_code} response ({len(content_bytes)} bytes, connection: {connection_header})")
    
    def send_chunked_response(self, client_socket, version):
        """Demonstrate chunked transfer encoding."""
        
        # Send headers
        headers = f"""HTTP/1.1 200 OK\\r
Content-Type: text/html\\r
Transfer-Encoding: chunked\\r
Connection: keep-alive\\r
Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}\\r
Server: Python-HTTP11-Server/1.0\\r
\\r
"""
        client_socket.sendall(headers.encode('utf-8'))
        
        # Send chunks
        chunks = [
            "<html><head><title>Chunked Demo</title></head><body>",
            "<h1>This response is sent in chunks!</h1>",
            "<p>Each chunk is sent separately...</p>",
            "<p>Perfect for streaming content!</p>",
            "</body></html>"
        ]
        
        for i, chunk in enumerate(chunks):
            chunk_size = hex(len(chunk))[2:]  # Remove '0x' prefix
            chunk_data = f"{chunk_size}\\r\\n{chunk}\\r\\n"
            client_socket.sendall(chunk_data.encode('utf-8'))
            print(f"📦 Sent chunk {i+1}: {len(chunk)} bytes")
            time.sleep(0.5)  # Simulate processing time
        
        # Send terminating chunk
        client_socket.sendall(b"0\\r\\n\\r\\n")
        print("✅ Chunked response complete")
    
    def get_demo_page(self, request_num):
        """Generate demo page showing persistent connection."""
        return f"""<html>
<head><title>HTTP/1.1 Demo</title></head>
<body>
<h1>HTTP/1.1 Persistent Connection Demo</h1>
<p><strong>Request #{request_num}</strong> on this connection</p>
<p>This connection will stay open for multiple requests!</p>
<ul>
<li><a href="/chunked">Try chunked encoding</a></li>
<li><a href="/resources">Multiple resources</a></li>
<li><a href="/close">Close connection</a></li>
</ul>
<hr>
<p><small>HTTP/1.1 Server - RFC 2068 Implementation</small></p>
</body>
</html>"""
    
    def get_resources_page(self):
        """Page that would typically require multiple requests."""
        return """<html>
<head><title>Multiple Resources</title></head>
<body>
<h1>Multiple Resources Page</h1>
<p>In HTTP/1.0, this page would require multiple connections for:</p>
<ul>
<li>The HTML page itself</li>
<li>CSS stylesheets</li>
<li>JavaScript files</li>
<li>Images</li>
</ul>
<p><strong>HTTP/1.1 advantage:</strong> All resources can use the same persistent connection!</p>
</body>
</html>"""
    
    def send_error_response(self, client_socket, status_code, status_text, message=""):
        """Send error response."""
        content = f"""<html>
<head><title>{status_code} {status_text}</title></head>
<body>
<h1>{status_code} {status_text}</h1>
{f'<p>{message}</p>' if message else ''}
</body>
</html>"""
        self.send_response(client_socket, status_code, status_text, content, 
                          "text/html", "HTTP/1.1", keep_alive=False)

# Example usage
if __name__ == "__main__":
    print("🚀 Starting HTTP/1.1 Server (RFC 2068 Implementation)")
    server = HTTP11Server('localhost', 8000)
    server.start()`}
        />

        <p>
          <strong>HTTP/1.1 Performance Testing Client:</strong>
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import time
import threading

def test_http11_performance():
    """Compare HTTP/1.0 vs HTTP/1.1 performance."""
    
    def test_http10_style():
        """Simulate HTTP/1.0 behavior (new connection per request)."""
        start_time = time.time()
        
        for i in range(5):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            try:
                sock.connect(('httpbin.org', 80))
                
                request = f"""GET /delay/1 HTTP/1.0\\r
Host: httpbin.org\\r
Connection: close\\r
\\r
"""
                sock.sendall(request.encode())
                
                # Read response
                response = b""
                while True:
                    chunk = sock.recv(1024)
                    if not chunk:
                        break
                    response += chunk
                        
                print(f"  Request {i+1}: {len(response)} bytes")
                
            finally:
                sock.close()
        
        duration = time.time() - start_time
        print(f"HTTP/1.0 style: {duration:.2f} seconds")
        return duration
    
    def test_http11_persistent():
        """Test HTTP/1.1 persistent connections."""
        start_time = time.time()
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.connect(('httpbin.org', 80))
            
            for i in range(5):
                request = f"""GET /delay/1 HTTP/1.1\\r
Host: httpbin.org\\r
Connection: keep-alive\\r
\\r
"""
                sock.sendall(request.encode())
                
                # Read response headers
                response = b""
                while b"\\r\\n\\r\\n" not in response:
                    chunk = sock.recv(1024)
                    if not chunk:
                        break
                    response += chunk
                
                # Parse Content-Length and read body
                headers = response.decode('utf-8', errors='ignore')
                if 'Content-Length:' in headers:
                    content_length = int(headers.split('Content-Length: ')[1].split('\\r\\n')[0])
                    
                    # Read remaining body
                    body_received = len(response.split(b'\\r\\n\\r\\n', 1)[1])
                    while body_received < content_length:
                        chunk = sock.recv(1024)
                        if not chunk:
                            break
                        body_received += len(chunk)
                
                print(f"  Request {i+1}: {len(response)} bytes (persistent connection)")
                
        finally:
            sock.close()
        
        duration = time.time() - start_time
        print(f"HTTP/1.1 persistent: {duration:.2f} seconds")
        return duration
    
    print("🧪 HTTP/1.0 vs HTTP/1.1 Performance Comparison")
    print("=" * 50)
    
    print("\\n1️⃣  Testing HTTP/1.0 style (new connection per request):")
    http10_time = test_http10_style()
    
    print("\\n2️⃣  Testing HTTP/1.1 persistent connections:")
    http11_time = test_http11_persistent()
    
    print("\\n📊 Results:")
    print(f"   HTTP/1.0 style: {http10_time:.2f}s")
    print(f"   HTTP/1.1 persistent: {http11_time:.2f}s")
    
    if http10_time > http11_time:
        improvement = ((http10_time - http11_time) / http10_time) * 100
        print(f"   🚀 HTTP/1.1 is {improvement:.1f}% faster!")
    
    print("\\n🎯 Key Observations:")
    print("   • Persistent connections reduce connection overhead")
    print("   • TCP connection establishment/teardown is expensive")
    print("   • HTTP/1.1 enables better resource utilization")

if __name__ == "__main__":
    test_http11_performance()`}
        />

        <p>
          This comparison demonstrates why HTTP/1.1's persistent connections 
          were such a significant improvement for web performance.
        </p>
      </ExpandableSection>

      <h3>Virtual Hosting with Host Header</h3>

      <p>
        The mandatory Host header in HTTP/1.1 enabled virtual hosting, allowing multiple 
        websites to share the same IP address. This was crucial as the web grew exponentially.
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-900 mb-2">Virtual Hosting Example</h4>
        <div className="text-sm space-y-2">
          <div className="bg-white p-2 rounded border">
            <code>Host: www.example.com</code> → Serves example.com website
          </div>
          <div className="bg-white p-2 rounded border">
            <code>Host: blog.example.com</code> → Serves blog subdomain
          </div>
          <div className="bg-white p-2 rounded border">
            <code>Host: api.example.com</code> → Serves API endpoints
          </div>
        </div>
        <p className="text-blue-800 text-sm mt-2">
          All using the same server IP address (e.g., 192.168.1.100)
        </p>
      </div>

      <h3>Historical Impact</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>1996:</strong> Web performance problems become critical
        </p>
        <p>
          <strong>January 1997:</strong> RFC 2068 (HTTP/1.1) published
        </p>
        <p>
          <strong>1997-1999:</strong> Rapid adoption by browsers and servers
        </p>
        <p>
          <strong>1999:</strong> RFC 2616 refines and improves HTTP/1.1
        </p>
      </div>

      <ExpandableSection title="🌐 HTTP/1.1's Lasting Impact on the Web">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">🚀 Web Scalability Revolution</h4>
            <p className="text-green-800 text-sm">
              HTTP/1.1 enabled the web to scale from thousands to billions of pages:
            </p>
            <ul className="text-green-700 text-xs mt-2 space-y-1">
              <li>• <strong>Virtual Hosting:</strong> Reduced need for IPv4 addresses</li>
              <li>• <strong>Persistent Connections:</strong> 60-80% performance improvement</li>
              <li>• <strong>Chunked Encoding:</strong> Enabled dynamic content generation</li>
              <li>• <strong>Caching:</strong> Better cache control mechanisms</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">📊 Modern Usage Statistics</h4>
            <p className="text-blue-800 text-sm">
              HTTP/1.1 remains widely used even in 2025:
            </p>
            <ul className="text-blue-700 text-xs mt-2 space-y-1">
              <li>• <strong>40% of web traffic</strong> still uses HTTP/1.1</li>
              <li>• <strong>REST APIs:</strong> Predominantly HTTP/1.1</li>
              <li>• <strong>IoT devices:</strong> Often use HTTP/1.1 for simplicity</li>
              <li>• <strong>Legacy systems:</strong> Billions of endpoints still HTTP/1.1</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">🔮 Influence on Modern Protocols</h4>
            <p className="text-purple-800 text-sm">
              HTTP/1.1 concepts live on in newer technologies:
            </p>
            <ul className="text-purple-700 text-xs mt-2 space-y-1">
              <li>• <strong>HTTP/2:</strong> Builds on HTTP/1.1 semantics</li>
              <li>• <strong>WebSockets:</strong> Upgrade mechanism from HTTP/1.1</li>
              <li>• <strong>Server-Sent Events:</strong> Uses chunked encoding</li>
              <li>• <strong>Progressive Enhancement:</strong> HTTP/1.1 as fallback</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">📚 External References</h5>
          <ul className="text-gray-700 text-sm space-y-1">
            <li><a href="https://tools.ietf.org/html/rfc2616" className="underline" target="_blank" rel="noopener noreferrer">RFC 2616: HTTP/1.1 Revised Specification</a></li>
            <li><a href="https://httparchive.org/reports/state-of-the-web#protocolVersions" className="underline" target="_blank" rel="noopener noreferrer">HTTP Archive: Protocol Version Usage</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Connection_management_in_HTTP_1.x" className="underline" target="_blank" rel="noopener noreferrer">MDN: HTTP/1.x Connection Management</a></li>
            <li><a href="https://www.w3.org/Protocols/HTTP/1.1/rfc2068bis/" className="underline" target="_blank" rel="noopener noreferrer">W3C HTTP/1.1 Specification Updates</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <h3>Limitations and Future Evolution</h3>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-900 mb-3">Remaining Challenges</h4>
        <ul className="text-yellow-800 text-sm space-y-2">
          <li><strong>Head-of-Line Blocking:</strong> Pipelining doesn't fully solve ordering issues</li>
          <li><strong>Text-Based Protocol:</strong> Parsing overhead for headers</li>
          <li><strong>Limited Multiplexing:</strong> Still fundamentally request-response</li>
          <li><strong>Connection Limits:</strong> Browsers limit concurrent connections</li>
        </ul>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          HTTP/1.1 transformed the web from a document delivery system into a 
          platform for rich, interactive applications. Its persistent connections, 
          virtual hosting, and chunked encoding remain fundamental to how the web 
          operates today. Every modern web application still benefits from the 
          performance improvements RFC 2068 introduced in 1997.
        </p>
      </div>
    </article>
  );
}