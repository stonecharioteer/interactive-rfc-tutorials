import GlossaryTerm from '../../components/GlossaryTerm';
import MermaidDiagram from '../../components/MermaidDiagram';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC959() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 959: File Transfer Protocol (October 1985)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          <GlossaryTerm>FTP</GlossaryTerm> established the foundation for file sharing over networks,
          introducing the client-server model that influenced countless internet protocols.
          While largely superseded by HTTP and modern protocols, FTP's architectural
          concepts remain fundamental to network design.
        </p>
      </div>

      <h2>The Foundation of Network File Transfer</h2>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 959 defined <GlossaryTerm>FTP</GlossaryTerm> (File Transfer Protocol), the standard
        method for transferring files between computers over a network. It introduced
        key concepts like separate control and data connections, active/passive modes,
        and standardized file operations.
      </p>

      <h3>Core FTP Architecture</h3>

      <p>
        FTP uses a unique dual-connection model that separates control commands
        from actual data transfer:
      </p>

      <MermaidDiagram
        chart={`
graph TD
    subgraph "FTP Client"
        A[User Interface]
        B[Control Process]
        C[Data Transfer Process]
    end
    
    subgraph "FTP Server"
        D[Server Control Process]
        E[Server Data Transfer Process]
    end
    
    A --> B
    B <-->|Control Connection<br/>Port 21<br/>Commands & Responses| D
    C <-->|Data Connection<br/>Port 20 or Dynamic<br/>File Transfer| E
    B -.->|Coordinates| C
    D -.->|Coordinates| E
    
    style B fill:#e1f5fe
    style D fill:#e1f5fe
    style C fill:#fff3cd
    style E fill:#fff3cd
        `}
        className="my-6"
      />

      <div className="bg-green-50 border border-green-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-green-800 mb-3">Dual Connection Model Benefits</h4>
        <ul className="text-green-700 text-sm space-y-1">
          <li>🔗 <strong>Separation of Concerns:</strong> Commands and data use different channels</li>
          <li>⚡ <strong>Efficiency:</strong> Control connection stays open, data connections as needed</li>
          <li>🔧 <strong>Flexibility:</strong> Different connection modes for different network setups</li>
          <li>🛡️ <strong>Control:</strong> Independent management of command flow and data flow</li>
        </ul>
      </div>

      <h3>FTP Connection Modes</h3>

      <p>
        FTP supports two distinct connection modes, each with different characteristics
        for network traversal and security:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="border border-orange-300 p-4 rounded-lg bg-orange-50">
          <h4 className="font-semibold text-orange-800 mb-3">Active Mode (PORT)</h4>
          <MermaidDiagram
            chart={`
sequenceDiagram
    participant C as Client
    participant S as Server
    
    Note over C,S: Control Connection Established
    C->>S: PORT 192.168.1.100,1234
    S->>C: 200 PORT command successful
    
    C->>S: LIST (or other data command)
    Note over S: Server initiates data connection
    S->>C: Data Connection (Port 20 → Port 1234)
    S->>C: Data Transfer
    S->>C: 226 Transfer complete
            `}
            className="my-4"
          />
          <p className="text-orange-700 text-sm">
            <strong>Active Mode:</strong> Server initiates data connection back to client.
            Can have firewall issues.
          </p>
        </div>

        <div className="border border-blue-300 p-4 rounded-lg bg-blue-50">
          <h4 className="font-semibold text-blue-800 mb-3">Passive Mode (PASV)</h4>
          <MermaidDiagram
            chart={`
sequenceDiagram
    participant C as Client
    participant S as Server
    
    Note over C,S: Control Connection Established
    C->>S: PASV
    S->>C: 227 Entering Passive Mode (192,168,1,50,8,0)
    
    C->>S: LIST (or other data command)
    Note over C: Client initiates data connection
    C->>S: Data Connection (Client → Port 2048)
    S->>C: Data Transfer
    S->>C: 226 Transfer complete
            `}
            className="my-4"
          />
          <p className="text-blue-700 text-sm">
            <strong>Passive Mode:</strong> Client initiates all connections.
            Better for firewalls and NAT.
          </p>
        </div>
      </div>

      <h3>Essential FTP Commands</h3>

      <p>
        FTP uses a text-based command protocol similar to SMTP. Here are the
        fundamental commands that enable file operations:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-3">Core FTP Commands</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="bg-blue-100 p-2 rounded">
              <strong className="text-blue-800">USER/PASS:</strong>
              <span className="text-blue-600"> Authentication commands</span>
            </div>
            <div className="bg-green-100 p-2 rounded">
              <strong className="text-green-800">PWD:</strong>
              <span className="text-green-600"> Print working directory</span>
            </div>
            <div className="bg-purple-100 p-2 rounded">
              <strong className="text-purple-800">CWD:</strong>
              <span className="text-purple-600"> Change working directory</span>
            </div>
            <div className="bg-orange-100 p-2 rounded">
              <strong className="text-orange-800">LIST/NLST:</strong>
              <span className="text-orange-600"> Directory listing</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-yellow-100 p-2 rounded">
              <strong className="text-yellow-800">RETR:</strong>
              <span className="text-yellow-600"> Retrieve (download) file</span>
            </div>
            <div className="bg-red-100 p-2 rounded">
              <strong className="text-red-800">STOR:</strong>
              <span className="text-red-600"> Store (upload) file</span>
            </div>
            <div className="bg-pink-100 p-2 rounded">
              <strong className="text-pink-800">DELE:</strong>
              <span className="text-pink-600"> Delete file</span>
            </div>
            <div className="bg-indigo-100 p-2 rounded">
              <strong className="text-indigo-800">QUIT:</strong>
              <span className="text-indigo-600"> Close connection</span>
            </div>
          </div>
        </div>
      </div>

      <h3>FTP Session Flow</h3>

      <p>
        A typical FTP session involves authentication, navigation, and file operations.
        Here's how a complete session works:
      </p>

      <MermaidDiagram
        chart={`
sequenceDiagram
    participant Client
    participant Server
    
    Note over Client,Server: Connection Establishment
    Client->>Server: TCP Connection (Port 21)
    Server->>Client: 220 Service ready
    
    Note over Client,Server: Authentication
    Client->>Server: USER alice
    Server->>Client: 331 Password required
    Client->>Server: PASS secret123
    Server->>Client: 230 User logged in
    
    Note over Client,Server: Navigation
    Client->>Server: PWD
    Server->>Client: 257 "/" is current directory
    Client->>Server: CWD /documents
    Server->>Client: 250 Directory changed
    
    Note over Client,Server: File Operations
    Client->>Server: PASV
    Server->>Client: 227 Entering Passive Mode
    Client->>Server: LIST
    Server->>Client: 150 Opening data connection
    Server->>Client: Directory listing data
    Server->>Client: 226 Transfer complete
    
    Client->>Server: RETR file.txt
    Server->>Client: 150 Opening data connection
    Server->>Client: File content data
    Server->>Client: 226 Transfer complete
    
    Note over Client,Server: Session End
    Client->>Server: QUIT
    Server->>Client: 221 Goodbye
        `}
        className="my-6"
      />

      <ExpandableSection title="🐳 Interactive Docker Demo: FTP Server in Action">
        <p>
          Experience FTP concepts hands-on with our Docker demonstration! This setup provides:
        </p>

        <ul>
          <li><strong>Educational FTP Server</strong> - See FTP commands and responses</li>
          <li><strong>File Operations</strong> - Upload, download, and manage files</li>
          <li><strong>Connection Modes</strong> - Observe active vs passive mode behavior</li>
          <li><strong>Protocol Logging</strong> - Detailed command and response logging</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
          <h4 className="font-semibold text-blue-900 mb-2">🚀 Quick Start</h4>

          <CodeBlock
            language="bash"
            code={`# Clone the repository
git clone https://github.com/stonecharioteer/interactive-rfc-tutorials.git
cd interactive-rfc-tutorials/docker-examples/rfc959-ftp

# Run the FTP demonstration
docker compose up --build

# Connect with FTP client
ftp localhost 2121`}
          />

          <p className="text-blue-800 text-sm mt-3">
            <strong>What you'll see:</strong> An educational FTP server with detailed
            logging of all commands, responses, and file operations. Perfect for
            understanding the FTP protocol in action.
          </p>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🐍 ELI-Pythonista: Building FTP Clients">
        <p>
          Python's ftplib makes it easy to work with FTP servers and understand
          the protocol operations:
        </p>

        <CodeBlock
          language="python"
          code={`import ftplib
import os
from datetime import datetime

def demonstrate_ftp_operations():
    """Demonstrate common FTP operations using Python."""
    
    # Connect to FTP server
    print("=== FTP Client Demonstration ===\\n")
    
    try:
        # Create FTP connection
        ftp = ftplib.FTP()
        
        # Connect to server (replace with actual server)
        print("1. Connecting to FTP server...")
        ftp.connect('ftp.example.com', 21)
        
        # Login (anonymous login for demo)
        print("2. Logging in...")
        ftp.login('anonymous', 'guest@example.com')
        
        # Get welcome message
        print(f"Welcome message: {ftp.getwelcome()}")
        
        # Print current directory
        print(f"3. Current directory: {ftp.pwd()}")
        
        # List files in current directory
        print("4. Directory listing:")
        files = []
        ftp.retrlines('LIST', files.append)
        for file_info in files[:5]:  # Show first 5 files
            print(f"   {file_info}")
        
        # Get directory listing as list
        filenames = ftp.nlst()
        print(f"5. Found {len(filenames)} files/directories")
        
        # Change directory (if possible)
        try:
            ftp.cwd('pub')
            print(f"6. Changed to directory: {ftp.pwd()}")
        except ftplib.error_perm:
            print("6. Could not change directory (permissions)")
        
        # Download a file (demo - replace with actual file)
        def download_file(filename, local_path):
            try:
                print(f"7. Downloading {filename}...")
                with open(local_path, 'wb') as local_file:
                    ftp.retrbinary(f'RETR {filename}', local_file.write)
                print(f"   Downloaded to {local_path}")
                return True
            except ftplib.error_perm:
                print(f"   Could not download {filename}")
                return False
        
        # Try to download README or similar common file
        common_files = ['README', 'readme.txt', 'README.txt', 'index.html']
        for filename in common_files:
            if filename in filenames:
                download_file(filename, f'downloaded_{filename}')
                break
        
        # Upload a file (create a test file first)
        def upload_file(local_path, remote_filename):
            try:
                print(f"8. Uploading {local_path} as {remote_filename}...")
                with open(local_path, 'rb') as local_file:
                    ftp.storbinary(f'STOR {remote_filename}', local_file)
                print(f"   Uploaded successfully")
                return True
            except ftplib.error_perm:
                print(f"   Could not upload (permissions)")
                return False
        
        # Create a test file and try to upload
        test_content = f"Test file created at {datetime.now()}"
        with open('test_upload.txt', 'w') as f:
            f.write(test_content)
        
        upload_file('test_upload.txt', 'python_test.txt')
        
        # Clean up local test file
        os.remove('test_upload.txt')
        
    except ftplib.all_errors as e:
        print(f"FTP Error: {e}")
    finally:
        try:
            ftp.quit()
            print("9. Disconnected from FTP server")
        except:
            pass

# Advanced FTP operations
def demonstrate_passive_vs_active():
    """Show the difference between passive and active FTP modes."""
    
    print("\\n=== FTP Connection Modes ===\\n")
    
    try:
        # Passive mode (default in Python ftplib)
        print("1. Testing Passive Mode:")
        ftp_passive = ftplib.FTP()
        ftp_passive.connect('ftp.example.com', 21)
        ftp_passive.login('anonymous', 'guest@example.com')
        
        # Set passive mode explicitly
        ftp_passive.set_pasv(True)
        print("   Passive mode enabled")
        
        # List files (this will use passive mode)
        files = ftp_passive.nlst()
        print(f"   Listed {len(files)} files using passive mode")
        
        ftp_passive.quit()
        
        # Active mode
        print("2. Testing Active Mode:")
        ftp_active = ftplib.FTP()
        ftp_active.connect('ftp.example.com', 21)
        ftp_active.login('anonymous', 'guest@example.com')
        
        # Set active mode
        ftp_active.set_pasv(False)
        print("   Active mode enabled")
        
        # List files (this will use active mode)
        files = ftp_active.nlst()
        print(f"   Listed {len(files)} files using active mode")
        
        ftp_active.quit()
        
    except ftplib.all_errors as e:
        print(f"Mode test error: {e}")
        print("   (Active mode often fails behind firewalls/NAT)")

def create_simple_ftp_client():
    """Create a simple interactive FTP client."""
    
    print("\\n=== Simple FTP Client ===\\n")
    
    class SimpleFTPClient:
        def __init__(self):
            self.ftp = None
            self.connected = False
        
        def connect(self, host, port=21):
            try:
                self.ftp = ftplib.FTP()
                self.ftp.connect(host, port)
                print(f"Connected to {host}:{port}")
                return True
            except Exception as e:
                print(f"Connection failed: {e}")
                return False
        
        def login(self, username='anonymous', password=''):
            try:
                self.ftp.login(username, password)
                self.connected = True
                print(f"Logged in as {username}")
                print(f"Server: {self.ftp.getwelcome()}")
                return True
            except Exception as e:
                print(f"Login failed: {e}")
                return False
        
        def list_files(self):
            if not self.connected:
                print("Not connected")
                return
            
            try:
                print(f"Current directory: {self.ftp.pwd()}")
                print("Files and directories:")
                self.ftp.retrlines('LIST')
            except Exception as e:
                print(f"Listing failed: {e}")
        
        def change_directory(self, path):
            if not self.connected:
                print("Not connected")
                return
            
            try:
                self.ftp.cwd(path)
                print(f"Changed to: {self.ftp.pwd()}")
            except Exception as e:
                print(f"Change directory failed: {e}")
        
        def download(self, remote_file, local_file=None):
            if not self.connected:
                print("Not connected")
                return
            
            local_file = local_file or remote_file
            try:
                with open(local_file, 'wb') as f:
                    self.ftp.retrbinary(f'RETR {remote_file}', f.write)
                print(f"Downloaded {remote_file} -> {local_file}")
            except Exception as e:
                print(f"Download failed: {e}")
        
        def close(self):
            if self.ftp:
                try:
                    self.ftp.quit()
                    print("Connection closed")
                except:
                    pass
                self.connected = False
    
    # Example usage
    client = SimpleFTPClient()
    
    # Demonstrate the client (replace with real server)
    print("Example client usage:")
    print("client.connect('ftp.example.com')")
    print("client.login('username', 'password')")
    print("client.list_files()")
    print("client.change_directory('/pub')")
    print("client.download('README.txt')")
    print("client.close()")

# Run demonstrations
if __name__ == "__main__":
    # Note: These examples use placeholder servers
    # Replace with actual FTP servers for testing
    
    print("FTP Protocol Demonstration with Python")
    print("=" * 50)
    
    # demonstrate_ftp_operations()
    # demonstrate_passive_vs_active()
    create_simple_ftp_client()
    
    print("\\nKey FTP Concepts Demonstrated:")
    print("1. Dual connection model (control + data)")
    print("2. Text-based command protocol")
    print("3. Passive vs Active connection modes")
    print("4. File upload/download operations")
    print("5. Directory navigation commands")`}
        />

        <p>
          This demonstrates how FTP's dual-connection architecture works in practice
          and why passive mode became essential for modern networks!
        </p>
      </ExpandableSection>

      <h3>FTP Response Codes</h3>

      <p>
        Like SMTP, FTP uses standardized numeric response codes to communicate
        status and results:
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-800 mb-3">FTP Response Code Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div><strong className="text-green-600">1xx - Positive Preliminary:</strong> Action started</div>
            <div className="ml-4 text-green-600 font-mono">150 Opening data connection</div>
            <div><strong className="text-blue-600">2xx - Positive Completion:</strong> Action completed</div>
            <div className="ml-4 text-blue-600 font-mono">226 Transfer complete, 230 User logged in</div>
          </div>
          <div className="space-y-1">
            <div><strong className="text-yellow-600">3xx - Positive Intermediate:</strong> More info needed</div>
            <div className="ml-4 text-yellow-600 font-mono">331 Password required</div>
            <div><strong className="text-red-600">4xx/5xx - Negative:</strong> Action failed</div>
            <div className="ml-4 text-red-600 font-mono">550 File not found, 530 Not logged in</div>
          </div>
        </div>
      </div>

      <h3>Modern Legacy and Alternatives</h3>

      <p>
        While FTP is still used today, its design limitations led to the development
        of more secure and efficient alternatives:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">FTP Limitations</h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• No encryption (passwords sent in clear text)</li>
            <li>• Complex firewall traversal (dual connections)</li>
            <li>• No integrity checking</li>
            <li>• Limited metadata support</li>
            <li>• ASCII vs Binary mode confusion</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Modern Alternatives</h4>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• <strong>SFTP:</strong> Secure FTP over SSH</li>
            <li>• <strong>FTPS:</strong> FTP with SSL/TLS encryption</li>
            <li>• <strong>HTTP/HTTPS:</strong> Web-based file transfer</li>
            <li>• <strong>SCP:</strong> Secure copy over SSH</li>
            <li>• <strong>WebDAV:</strong> Web-based distributed authoring</li>
          </ul>
        </div>
      </div>

      <h3>FTP's Lasting Influence</h3>

      <p>
        Despite its limitations, FTP established patterns that influenced internet development:
      </p>

      <ul>
        <li><strong>Client-Server Architecture:</strong> Clear separation of roles</li>
        <li><strong>Stateful Sessions:</strong> Persistent connections with context</li>
        <li><strong>Command-Response Protocol:</strong> Text-based interaction model</li>
        <li><strong>Data Channel Separation:</strong> Control vs data plane concepts</li>
        <li><strong>Passive Mode Innovation:</strong> Solving NAT/firewall challenges</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
        <h4 className="text-blue-900 font-semibold">Educational Value</h4>
        <p className="text-blue-800 text-sm">
          FTP remains valuable for understanding fundamental network programming
          concepts. Its clear separation of control and data planes, explicit
          connection management, and well-defined command set make it an excellent
          protocol for learning network programming principles.
        </p>
      </div>

      <h3>FTP's Legacy in the Modern File Transfer Ecosystem</h3>

      <p>
        While FTP's dominance has waned due to security concerns, its fundamental concepts 
        continue to influence modern file transfer protocols and cloud storage systems:
      </p>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-amber-900 mb-4">📂 FTP's Current Role in Digital Infrastructure</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-amber-800">Legacy Systems</h5>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• Mainframe data transfers</li>
              <li>• Industrial automation systems</li>
              <li>• Embedded device firmware updates</li>
              <li>• Legacy web hosting (declining)</li>
              <li>• Internal corporate file sharing</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-semibold text-amber-800">Specialized Applications</h5>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• Large file transfers (media production)</li>
              <li>• Automated backup systems</li>
              <li>• EDI (Electronic Data Interchange)</li>
              <li>• Scientific data exchange</li>
              <li>• Server provisioning and deployment</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-semibold text-amber-800">Modern Variants</h5>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• SFTP (SSH File Transfer Protocol)</li>
              <li>• FTPS (FTP over SSL/TLS)</li>
              <li>• Managed FTP services (AWS Transfer)</li>
              <li>• FTP-to-cloud gateways</li>
              <li>• Container deployment pipelines</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-red-900 mb-3">📊 FTP Usage Reality Check (2025)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-800">~5%</div>
            <div className="text-sm text-red-700">Of file transfers still use plain FTP</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-800">40+</div>
            <div className="text-sm text-red-700">Years of protocol evolution</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-800">80%</div>
            <div className="text-sm text-red-700">Enterprise usage via SFTP/FTPS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-800">Billions</div>
            <div className="text-sm text-red-700">Files transferred using FTP concepts</div>
          </div>
        </div>
      </div>

      <ExpandableSection title="🔄 FTP vs Modern File Transfer: The Evolution of Data Movement">
        <p>
          FTP's limitations led to numerous alternatives that address security, usability, and cloud-native requirements:
        </p>

        <div className="space-y-6 mt-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h5 className="font-semibold text-green-800 mb-2">🔒 Secure FTP Replacements</h5>
            <div className="text-green-700 text-sm space-y-2">
              <p><strong>SFTP (SSH File Transfer):</strong> Most common FTP replacement, built on SSH with strong encryption</p>
              <p><strong>FTPS (FTP over SSL/TLS):</strong> FTP with encryption layer, compatible with existing FTP clients</p>
              <p><strong>SCP (Secure Copy):</strong> Simple SSH-based file transfer, popular in Unix environments</p>
              <p><strong>Adoption:</strong> SFTP dominates enterprise, FTPS used in legacy migration scenarios</p>
              <p><strong>Success Factor:</strong> Addresses FTP's critical security vulnerabilities while maintaining familiar workflow</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h5 className="font-semibold text-blue-800 mb-2">☁️ Cloud-Native File Transfer</h5>
            <div className="text-blue-700 text-sm space-y-2">
              <p><strong>Object Storage APIs:</strong> Amazon S3, Google Cloud Storage, Azure Blob Storage</p>
              <p><strong>RESTful File APIs:</strong> HTTP-based with JSON metadata, authentication tokens</p>
              <p><strong>WebDAV:</strong> Web-based distributed authoring and versioning</p>
              <p><strong>Advantages:</strong> Cloud-native, web-friendly, scalable, integrated with modern auth</p>
              <p><strong>Challenge to FTP:</strong> Modern authentication, encryption by default, better error handling</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h5 className="font-semibold text-purple-800 mb-2">🌐 Modern File Sharing Platforms</h5>
            <div className="text-purple-700 text-sm space-y-2">
              <p><strong>Dropbox/Google Drive APIs:</strong> Consumer-friendly with enterprise features</p>
              <p><strong>SharePoint/OneDrive:</strong> Microsoft's integrated collaboration platform</p>
              <p><strong>Box/WeTransfer:</strong> Business-focused file sharing with compliance features</p>
              <p><strong>User Experience:</strong> Web interfaces, mobile apps, real-time collaboration</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded">
            <h5 className="font-semibent text-orange-800 mb-2">⚡ High-Performance Alternatives</h5>
            <div className="text-orange-700 text-sm space-y-2">
              <p><strong>rsync:</strong> Incremental file synchronization, widely used for backups</p>
              <p><strong>BitTorrent Protocol:</strong> Peer-to-peer for large file distribution</p>
              <p><strong>Aspera/Signiant:</strong> Proprietary high-speed transfer for media industry</p>
              <p><strong>GridFTP:</strong> High-performance scientific data transfer</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h5 className="font-semibold text-yellow-800 mb-2">🚫 Why FTP Failed to Modernize</h5>
            <div className="text-yellow-700 text-sm space-y-2">
              <p><strong>Security by Design:</strong> No encryption, clear-text passwords, passive mode vulnerabilities</p>
              <p><strong>NAT/Firewall Issues:</strong> Dual connections difficult for modern network architectures</p>
              <p><strong>Limited Metadata:</strong> No rich file attributes, permissions, or versioning</p>
              <p><strong>ASCII vs Binary Confusion:</strong> Transfer mode errors causing file corruption</p>
              <p><strong>Stateful Protocol:</strong> Connection management complexity vs stateless HTTP alternatives</p>
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-4 rounded">
            <h5 className="font-semibold text-cyan-800 mb-2">🏗️ FTP's Enduring Architectural Influence</h5>
            <div className="text-cyan-700 text-sm space-y-2">
              <p><strong>Client-Server Model:</strong> Foundation for modern file APIs and cloud storage</p>
              <p><strong>Directory Browsing:</strong> Hierarchical file system navigation in all file managers</p>
              <p><strong>Transfer Modes:</strong> Binary vs text handling concepts in modern protocols</p>
              <p><strong>Connection Management:</strong> Lessons learned influenced HTTP persistent connections</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
          <h5 className="font-semibold text-indigo-800 mb-2">📖 Further Reading</h5>
          <ul className="text-indigo-700 text-sm space-y-1">
            <li><a href="https://www.rfc-editor.org/rfc/rfc4253.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 4253: SSH Transport Layer Protocol (SFTP foundation)</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc4918.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 4918: HTTP Extensions for WebDAV</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc2585.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 2585: Internet X.509 Public Key Infrastructure</a></li>
            <li><a href="https://tools.ietf.org/html/rfc3659" className="underline" target="_blank" rel="noopener noreferrer">RFC 3659: Extensions to FTP (MLSx commands)</a></li>
            <li><a href="https://aws.amazon.com/aws-transfer-family/" className="underline" target="_blank" rel="noopener noreferrer">AWS Transfer Family - Modern FTP/SFTP Services</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-slate-900 mb-3">🏢 FTP in Modern Enterprise Architecture</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Legacy Integration</h5>
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• Mainframe-to-cloud data migration</li>
              <li>• EDI transaction processing</li>
              <li>• Automated report distribution</li>
              <li>• Compliance data archiving</li>
              <li>• Third-party vendor file exchanges</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Modern Managed Services</h5>
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• AWS Transfer Family (SFTP/FTPS/FTP)</li>
              <li>• Azure File Transfer</li>
              <li>• Google Cloud Transfer Service</li>
              <li>• Managed file transfer (MFT) solutions</li>
              <li>• FTP-to-API gateway services</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-emerald-900 mb-3">🔮 FTP's Future: Managed Legacy and Protocol Evolution</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-emerald-800">Managed FTP Services</h5>
            <p className="text-emerald-700 text-sm">
              Cloud providers offering FTP/SFTP as a service with modern security,
              compliance logging, and integration with cloud storage and APIs
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-emerald-800">Protocol Modernization</h5>
            <p className="text-emerald-700 text-sm">
              SFTP over QUIC for improved performance, OAuth integration for modern auth,
              and container-native file transfer protocols
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-emerald-800">Legacy Bridge Solutions</h5>
            <p className="text-emerald-700 text-sm">
              FTP-to-REST gateways, protocol translation services, and gradual
              migration tools for organizations dependent on FTP workflows
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 959's FTP created the template for network file transfer that dominated
          the internet for decades. While modern protocols have addressed FTP's
          security limitations, its architectural patterns continue to influence
          protocol design today. FTP's lasting legacy isn't its continued usage,
          but how it established fundamental concepts of client-server file transfer,
          directory navigation, and transfer modes that appear in every modern
          file sharing system—from cloud storage APIs to mobile app synchronization.
        </p>
      </div>
    </article>
  );
}