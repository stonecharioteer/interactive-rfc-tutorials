import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC1945() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 1945: Hypertext Transfer Protocol -- HTTP/1.0 (May 1996)</h1>

      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Web Revolution Foundation
        </h3>
        <p className="text-purple-800">
          <GlossaryTerm>HTTP/1.0</GlossaryTerm> formalized the protocol that launched the World Wide Web revolution. 
          This simple request-response protocol made the web accessible to everyone and transformed 
          how humanity shares information.
        </p>
        <p className="text-purple-700 text-sm mt-2">
          <strong>Read the original:</strong> <a href="https://www.rfc-editor.org/rfc/rfc1945.html" 
          className="underline" target="_blank" rel="noopener noreferrer">RFC 1945</a>
        </p>
      </div>

      <h2>The Birth of the Web Protocol</h2>

      <p>
        <GlossaryTerm>HTTP/1.0</GlossaryTerm> was the first standardized version of the Hypertext Transfer Protocol, 
        formalizing the simple yet powerful protocol that Tim Berners-Lee created at CERN. 
        While the web had been growing since 1990, RFC 1945 provided the formal specification 
        that enabled explosive growth in the mid-1990s.
      </p>

      <h3>Key Features of HTTP/1.0</h3>

      <ul>
        <li>
          <strong>Simple Request-Response Model:</strong> Client sends request, server sends response
        </li>
        <li>
          <strong>Stateless Protocol:</strong> Each request is independent
        </li>
        <li>
          <strong>Human-Readable Format:</strong> Text-based headers and methods
        </li>
        <li>
          <strong>Multiple Content Types:</strong> Support for HTML, images, and other media
        </li>
        <li>
          <strong>Connection-per-Request:</strong> New <GlossaryTerm>TCP</GlossaryTerm> connection for each request
        </li>
      </ul>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">
          Basic HTTP/1.0 Request Example:
        </h4>
        <pre className="text-sm">
{`GET /index.html HTTP/1.0
Host: www.example.com
User-Agent: Mozilla/3.0

`}
        </pre>
        
        <h4 className="font-semibold mb-2 mt-4">
          Basic HTTP/1.0 Response Example:
        </h4>
        <pre className="text-sm">
{`HTTP/1.0 200 OK
Content-Type: text/html
Content-Length: 134

<html>
<head><title>Welcome</title></head>
<body><h1>Hello World!</h1></body>
</html>`}
        </pre>
      </div>

      <h3>HTTP Methods in HTTP/1.0</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900">GET</h4>
          <p className="text-blue-800 text-sm">Retrieve a resource from the server</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">POST</h4>
          <p className="text-green-800 text-sm">Send data to the server</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h4 className="font-semibold text-yellow-900">HEAD</h4>
          <p className="text-yellow-800 text-sm">Get headers only (no body)</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <h4 className="font-semibold text-red-900">Connection Model</h4>
          <p className="text-red-800 text-sm">One request per TCP connection</p>
        </div>
      </div>

      <h3>Status Codes</h3>

      <p>HTTP/1.0 introduced the status code system that remains largely unchanged today:</p>

      <div className="bg-gray-50 p-4 rounded-lg my-4">
        <ul className="text-sm space-y-1">
          <li><strong>200 OK:</strong> Request successful</li>
          <li><strong>301 Moved Permanently:</strong> Resource has moved</li>
          <li><strong>404 Not Found:</strong> Resource doesn't exist</li>
          <li><strong>500 Internal Server Error:</strong> Server error</li>
        </ul>
      </div>

      <ExpandableSection title="🐍 Python HTTP/1.0 Implementation">
        <p>
          Let's build a simple HTTP/1.0 server and client to understand the protocol:
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import threading
from datetime import datetime
import os

class HTTP10Server:
    """A simple HTTP/1.0 server implementation following RFC 1945."""
    
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.server_socket = None
        
    def start(self):
        """Start the HTTP/1.0 server."""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            
            print(f"🌐 HTTP/1.0 Server started on {self.host}:{self.port}")
            print("📡 Following RFC 1945 specification")
            
            while True:
                client_socket, client_address = self.server_socket.accept()
                print(f"🔗 New connection from {client_address}")
                
                # Handle each request in a separate thread
                client_thread = threading.Thread(
                    target=self.handle_request,
                    args=(client_socket, client_address)
                )
                client_thread.daemon = True
                client_thread.start()
                
        except KeyboardInterrupt:
            print("\\n🛑 Server shutting down...")
        finally:
            if self.server_socket:
                self.server_socket.close()
    
    def handle_request(self, client_socket, client_address):
        """Handle a single HTTP/1.0 request."""
        try:
            # Read the request
            request_data = client_socket.recv(4096).decode('utf-8')
            
            if not request_data:
                return
                
            print(f"📨 Request from {client_address}:")
            print(request_data)
            
            # Parse the request line
            lines = request_data.split('\\n')
            request_line = lines[0].strip()
            
            if not request_line:
                return
                
            parts = request_line.split()
            if len(parts) < 3:
                self.send_error_response(client_socket, 400, "Bad Request")
                return
                
            method, path, version = parts[0], parts[1], parts[2]
            
            # Validate HTTP version
            if version != "HTTP/1.0":
                self.send_error_response(client_socket, 505, "HTTP Version Not Supported")
                return
            
            # Handle different methods
            if method == "GET":
                self.handle_get(client_socket, path)
            elif method == "HEAD":
                self.handle_head(client_socket, path)
            elif method == "POST":
                self.handle_post(client_socket, path, request_data)
            else:
                self.send_error_response(client_socket, 501, "Not Implemented")
                
        except Exception as e:
            print(f"❌ Error handling request: {e}")
            self.send_error_response(client_socket, 500, "Internal Server Error")
        finally:
            # HTTP/1.0: Close connection after each request
            client_socket.close()
            print(f"🔌 Connection closed (HTTP/1.0 behavior)")
    
    def handle_get(self, client_socket, path):
        """Handle GET requests."""
        if path == "/":
            path = "/index.html"
            
        # Simple routing
        if path == "/index.html":
            content = self.get_html_content("Welcome to HTTP/1.0!", 
                "This server implements RFC 1945 - HTTP/1.0 specification.")
            self.send_response(client_socket, 200, "OK", content, "text/html")
            
        elif path == "/about":
            content = self.get_html_content("About HTTP/1.0", 
                "HTTP/1.0 was defined in RFC 1945 (May 1996). Key features: simple request-response, stateless, connection-per-request.")
            self.send_response(client_socket, 200, "OK", content, "text/html")
            
        elif path == "/stats":
            stats_info = f"""
            Server: HTTP/1.0 (RFC 1945)
            Current Time: {datetime.now()}
            Connection Model: One request per connection
            Supported Methods: GET, HEAD, POST
            """
            content = self.get_html_content("Server Statistics", stats_info)
            self.send_response(client_socket, 200, "OK", content, "text/html")
            
        else:
            self.send_error_response(client_socket, 404, "Not Found")
    
    def handle_head(self, client_socket, path):
        """Handle HEAD requests (headers only)."""
        if path == "/" or path == "/index.html":
            # Send headers without body
            self.send_headers(client_socket, 200, "OK", "text/html", 100)
        else:
            self.send_error_response(client_socket, 404, "Not Found", headers_only=True)
    
    def handle_post(self, client_socket, path, request_data):
        """Handle POST requests."""
        # Extract POST data (simplified)
        if "\\n\\n" in request_data:
            headers, body = request_data.split("\\n\\n", 1)
        else:
            body = ""
            
        response_content = f"""
        <html>
        <head><title>POST Response</title></head>
        <body>
        <h1>POST Request Received</h1>
        <p>Path: {path}</p>
        <p>Data received: {len(body)} bytes</p>
        <pre>{body}</pre>
        </body>
        </html>
        """
        
        self.send_response(client_socket, 200, "OK", response_content, "text/html")
    
    def get_html_content(self, title, content):
        """Generate simple HTML content."""
        return f"""<html>
<head><title>{title}</title></head>
<body>
<h1>{title}</h1>
<p>{content}</p>
<hr>
<p><small>HTTP/1.0 Server - RFC 1945 Implementation</small></p>
</body>
</html>"""
    
    def send_response(self, client_socket, status_code, status_text, content, content_type):
        """Send HTTP/1.0 response."""
        content_bytes = content.encode('utf-8')
        
        response = f"""HTTP/1.0 {status_code} {status_text}\\r
Content-Type: {content_type}\\r
Content-Length: {len(content_bytes)}\\r
Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}\\r
Server: Python-HTTP10-Server/1.0\\r
\\r
""".encode('utf-8') + content_bytes
        
        client_socket.sendall(response)
        print(f"📤 Sent {status_code} {status_text} response ({len(content_bytes)} bytes)")
    
    def send_headers(self, client_socket, status_code, status_text, content_type, content_length):
        """Send headers only (for HEAD requests)."""
        response = f"""HTTP/1.0 {status_code} {status_text}\\r
Content-Type: {content_type}\\r
Content-Length: {content_length}\\r
Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}\\r
Server: Python-HTTP10-Server/1.0\\r
\\r
"""
        client_socket.sendall(response.encode('utf-8'))
        print(f"📤 Sent {status_code} headers only")
    
    def send_error_response(self, client_socket, status_code, status_text, headers_only=False):
        """Send error response."""
        content = f"""<html>
<head><title>{status_code} {status_text}</title></head>
<body><h1>{status_code} {status_text}</h1></body>
</html>"""
        
        if headers_only:
            self.send_headers(client_socket, status_code, status_text, "text/html", len(content))
        else:
            self.send_response(client_socket, status_code, status_text, content, "text/html")

# Example usage
if __name__ == "__main__":
    print("🚀 Starting HTTP/1.0 Server (RFC 1945 Implementation)")
    server = HTTP10Server('localhost', 8000)
    server.start()`}
        />

        <p>
          <strong>HTTP/1.0 Client Implementation:</strong>
        </p>

        <CodeBlock
          language="python"
          code={`import socket
import time

class HTTP10Client:
    """A simple HTTP/1.0 client following RFC 1945."""
    
    def request(self, host, port, method, path, headers=None, body=None):
        """Make an HTTP/1.0 request."""
        
        # Create new connection for each request (HTTP/1.0 behavior)
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        
        try:
            print(f"🔗 Connecting to {host}:{port}")
            sock.connect((host, port))
            
            # Build request
            request_line = f"{method} {path} HTTP/1.0\\r\\n"
            
            # Default headers
            if headers is None:
                headers = {}
            headers.setdefault('Host', host)
            headers.setdefault('User-Agent', 'Python-HTTP10-Client/1.0')
            headers.setdefault('Connection', 'close')  # HTTP/1.0 style
            
            # Build headers
            header_lines = ""
            for name, value in headers.items():
                header_lines += f"{name}: {value}\\r\\n"
            
            # Complete request
            request = request_line + header_lines + "\\r\\n"
            
            if body:
                request += body
            
            print(f"📤 Sending request:")
            print(request)
            
            # Send request  
            sock.sendall(request.encode('utf-8'))
            
            # Read response
            response = b""
            while True:
                chunk = sock.recv(4096)
                if not chunk:
                    break
                response += chunk
            
            print(f"📨 Received response ({len(response)} bytes)")
            return response.decode('utf-8', errors='ignore')
            
        except Exception as e:
            print(f"❌ Request failed: {e}")
            return None
        finally:
            sock.close()
            print("🔌 Connection closed")

# Example usage
def test_http10():
    """Test HTTP/1.0 protocol behavior."""
    client = HTTP10Client()
    
    print("=" * 60)
    print("🧪 Testing HTTP/1.0 Protocol (RFC 1945)")
    print("=" * 60)
    
    # Test GET request
    print("\\n1️⃣  Testing GET request:")
    response = client.request('httpbin.org', 80, 'GET', '/get')
    if response:
        print("✅ GET request successful")
        # Show first few lines
        lines = response.split('\\n')[:10]
        for line in lines:
            print(f"   {line}")
    
    time.sleep(1)
    
    # Test HEAD request
    print("\\n2️⃣  Testing HEAD request:")
    response = client.request('httpbin.org', 80, 'HEAD', '/get')
    if response:
        print("✅ HEAD request successful (headers only)")
        print(response)
    
    time.sleep(1)
    
    # Test POST request
    print("\\n3️⃣  Testing POST request:")
    post_data = "name=RFC1945&version=HTTP/1.0"
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': str(len(post_data))
    }
    response = client.request('httpbin.org', 80, 'POST', '/post', headers, post_data)
    if response:
        print("✅ POST request successful")
        # Show response summary
        if '"form"' in response:
            print("   📝 Form data was received by server")
    
    print("\\n🎯 HTTP/1.0 Key Observations:")
    print("   • New TCP connection for each request")
    print("   • Simple text-based protocol")  
    print("   • Stateless request-response model")
    print("   • Connection closes after each response")

# Run the test
if __name__ == "__main__":
    test_http10()`}
        />

        <p>
          This implementation demonstrates HTTP/1.0's key characteristics: simplicity, 
          one connection per request, and the foundational request-response model that 
          enabled the web revolution.
        </p>
      </ExpandableSection>

      <h3>Historical Context</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>1990:</strong> Tim Berners-Lee creates first web browser and server at CERN
        </p>
        <p>
          <strong>1991:</strong> World Wide Web announced publicly
        </p>
        <p>
          <strong>1993:</strong> NCSA Mosaic browser popularizes the web
        </p>
        <p>
          <strong>1994:</strong> Netscape founded, browser wars begin
        </p>
        <p>
          <strong>1996:</strong> RFC 1945 formalizes HTTP/1.0
        </p>
      </div>

      <h3>Limitations of HTTP/1.0</h3>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-900 mb-3">Performance Issues</h4>
        <ul className="text-yellow-800 text-sm space-y-2">
          <li><strong>Connection Overhead:</strong> New TCP connection for each request</li>
          <li><strong>No Persistent Connections:</strong> High latency for multiple resources</li>
          <li><strong>Head-of-Line Blocking:</strong> Must wait for each request to complete</li>
          <li><strong>No Compression:</strong> Headers sent in full text every time</li>
        </ul>
      </div>

      <ExpandableSection title="🌐 HTTP/1.0's Impact on the Modern Internet">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">🚀 Web Explosion (1995-2000)</h4>
            <p className="text-blue-800 text-sm">
              HTTP/1.0's simplicity enabled rapid adoption. The number of websites grew from 
              10,000 in 1994 to over 17 million by 2000. The protocol's stateless design 
              made it easy to implement servers and scale horizontally.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">📊 Current Usage Statistics</h4>
            <p className="text-green-800 text-sm">
              While HTTP/1.1 and HTTP/2 dominate today, HTTP/1.0 concepts remain fundamental:
            </p>
            <ul className="text-green-700 text-xs mt-2 space-y-1">
              <li>• <strong>APIs:</strong> RESTful design follows HTTP/1.0's stateless model</li>
              <li>• <strong>Microservices:</strong> Request-response pattern everywhere</li>
              <li>• <strong>Status Codes:</strong> Original HTTP/1.0 codes still in use</li>
              <li>• <strong>Methods:</strong> GET, POST, HEAD remain the most common</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">🔮 Future Influence</h4>
            <p className="text-purple-800 text-sm">
              HTTP/1.0's design principles continue influencing modern protocols:
            </p>
            <ul className="text-purple-700 text-xs mt-2 space-y-1">
              <li>• <strong>GraphQL:</strong> Single request-response over HTTP</li>
              <li>• <strong>WebSockets:</strong> Upgrade from HTTP handshake</li>
              <li>• <strong>HTTP/3:</strong> Still uses HTTP/1.0's semantic model</li>
              <li>• <strong>REST APIs:</strong> Built on HTTP/1.0's stateless foundation</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">📚 External References</h5>
          <ul className="text-gray-700 text-sm space-y-1">
            <li><a href="https://www.w3.org/History/1989/proposal.html" className="underline" target="_blank" rel="noopener noreferrer">Tim Berners-Lee's Original Web Proposal (1989)</a></li>
            <li><a href="https://httparchive.org/reports/state-of-the-web" className="underline" target="_blank" rel="noopener noreferrer">HTTP Archive - Web Protocol Usage</a></li>
            <li><a href="https://tools.ietf.org/html/rfc2616" className="underline" target="_blank" rel="noopener noreferrer">RFC 2616: HTTP/1.1 (Successor to HTTP/1.0)</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP" className="underline" target="_blank" rel="noopener noreferrer">MDN: Evolution of HTTP</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <h3>Evolution Path</h3>

      <p>
        HTTP/1.0's limitations led to rapid evolution:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
            <span><strong>HTTP/1.0 (1996):</strong> Simple, connection-per-request</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
            <span><strong>HTTP/1.1 (1997):</strong> Persistent connections, chunked encoding</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
            <span><strong>HTTP/2 (2015):</strong> Binary protocol, multiplexing</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
            <span><strong>HTTP/3 (2022):</strong> QUIC transport, improved performance</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          HTTP/1.0's genius was its simplicity. By keeping the protocol straightforward 
          and human-readable, it enabled rapid adoption and experimentation. Every web 
          request you make today follows the basic request-response pattern established 
          by RFC 1945, proving that sometimes the simplest solution is the most enduring.
        </p>
      </div>
    </article>
  );
}