import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC2401() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 2401: Security Architecture for the Internet Protocol (November 1998)</h1>

      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Network Security Foundation
        </h3>
        <p className="text-red-800">
          <GlossaryTerm>IPsec</GlossaryTerm> revolutionized network security by providing authentication, 
          integrity, and confidentiality at the network layer. This protocol suite became the foundation 
          for modern <GlossaryTerm>VPN</GlossaryTerm> technologies and secure communications across the internet.
        </p>
        <p className="text-red-700 text-sm mt-2">
          <strong>Read the original:</strong> <a href="https://www.rfc-editor.org/rfc/rfc2401.html" 
          className="underline" target="_blank" rel="noopener noreferrer">RFC 2401</a>
        </p>
      </div>

      <h2>The Need for Network-Layer Security</h2>

      <p>
        By 1998, the internet had grown exponentially, but <GlossaryTerm>IPv4</GlossaryTerm> lacked built-in security mechanisms. 
        Traditional security operated at the application layer, creating inefficiencies and gaps. 
        IPsec addressed this by moving security to the network layer, providing transparent 
        protection for all traffic between endpoints.
      </p>

      <h3>Core IPsec Components</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h4 className="font-semibold text-blue-900">🔐 Authentication Header (AH)</h4>
          <p className="text-blue-800 text-sm">
            Provides data integrity and authentication without encryption. 
            Protects against tampering and replay attacks.
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">🛡️ Encapsulating Security Payload (ESP)</h4>
          <p className="text-green-800 text-sm">
            Provides confidentiality through encryption, plus optional 
            authentication and integrity protection.
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded">
          <h4 className="font-semibold text-purple-900">🤝 Security Associations (SA)</h4>
          <p className="text-purple-800 text-sm">
            Establishes security parameters between communicating parties, 
            including encryption algorithms and keys.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h4 className="font-semibold text-yellow-900">🔑 Key Management</h4>
          <p className="text-yellow-800 text-sm">
            Automated key exchange and management using protocols like 
            <GlossaryTerm>IKE</GlossaryTerm> (Internet Key Exchange).
          </p>
        </div>
      </div>

      <h3>IPsec Operating Modes</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-3">Transport Mode vs Tunnel Mode</h4>
        
        <div className="space-y-4">
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-green-800">🚌 Transport Mode</h5>
            <p className="text-sm text-green-700 mt-1">
              Secures payload between endpoints. Original <GlossaryTerm>IP</GlossaryTerm> header remains visible.
              Used for end-to-end communication.
            </p>
            <code className="text-xs bg-green-50 p-1 rounded block mt-2">
              [IP Header] [IPsec Header] [Protected Payload]
            </code>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-blue-800">🌐 Tunnel Mode</h5>
            <p className="text-sm text-blue-700 mt-1">
              Encapsulates entire original packet. New IP header added for routing through <GlossaryTerm>VPN</GlossaryTerm> gateways.
            </p>
            <code className="text-xs bg-blue-50 p-1 rounded block mt-2">
              [New IP Header] [IPsec Header] [Original IP Header + Payload]
            </code>
          </div>
        </div>
      </div>

      <h3>Security Association Database (SAD)</h3>

      <p>
        The <GlossaryTerm>SAD</GlossaryTerm> stores security parameters for active connections, including:
      </p>

      <ul className="list-disc list-inside mt-4 space-y-2">
        <li><strong>Security Parameter Index (<GlossaryTerm>SPI</GlossaryTerm>):</strong> Unique identifier for each SA</li>
        <li><strong>Encryption Algorithms:</strong> DES, 3DES, AES for confidentiality</li>
        <li><strong>Authentication Algorithms:</strong> HMAC-MD5, HMAC-SHA1 for integrity</li>
        <li><strong>Key Material:</strong> Encryption and authentication keys</li>
        <li><strong>Lifetime:</strong> Expiration time for security associations</li>
      </ul>

      <ExpandableSection title="🐍 Python IPsec Simulation">
        <p>
          While real IPsec operates at kernel level, let's simulate IPsec concepts to understand the protocol:
        </p>

        <CodeBlock
          language="python"
          code={`import hashlib
import hmac
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os
import socket
import struct
import time

class IPSecSimulator:
    """Educational IPsec implementation demonstrating RFC 2401 concepts."""
    
    def __init__(self):
        self.security_associations = {}
        self.spi_counter = 1000
        
        # Simulate supported algorithms
        self.auth_algorithms = {
            'HMAC-SHA1': self._hmac_sha1,
            'HMAC-MD5': self._hmac_md5
        }
        
        self.encr_algorithms = {
            'AES': self._aes_encrypt_decrypt
        }
    
    def create_security_association(self, src_ip, dst_ip, protocol, mode='tunnel'):
        """Create a Security Association (SA) between two endpoints."""
        
        spi = self.spi_counter
        self.spi_counter += 1
        
        # Generate keys (in real IPsec, this would be done by IKE)
        password = f"ipsec-key-{spi}".encode()
        salt = os.urandom(16)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(password))
        
        sa = {
            'spi': spi,
            'src_ip': src_ip,
            'dst_ip': dst_ip,
            'protocol': protocol,  # 'AH' or 'ESP'
            'mode': mode,  # 'transport' or 'tunnel'
            'auth_algorithm': 'HMAC-SHA1',
            'encr_algorithm': 'AES' if protocol == 'ESP' else None,
            'auth_key': os.urandom(20),  # 160-bit key for HMAC-SHA1
            'encr_key': key if protocol == 'ESP' else None,
            'created_time': time.time(),
            'lifetime': 3600,  # 1 hour
            'sequence_number': 0
        }
        
        sa_key = (src_ip, dst_ip, protocol)
        self.security_associations[sa_key] = sa
        
        print(f"🔐 Created {protocol} SA:")
        print(f"   SPI: {spi}")
        print(f"   Endpoints: {src_ip} → {dst_ip}")
        print(f"   Mode: {mode}")
        print(f"   Auth: {sa['auth_algorithm']}")
        if sa['encr_algorithm']:
            print(f"   Encryption: {sa['encr_algorithm']}")
        
        return spi
    
    def _hmac_sha1(self, key, data):
        """HMAC-SHA1 authentication."""
        return hmac.new(key, data, hashlib.sha1).digest()
    
    def _hmac_md5(self, key, data):
        """HMAC-MD5 authentication.""" 
        return hmac.new(key, data, hashlib.md5).digest()
    
    def _aes_encrypt_decrypt(self, key, data, encrypt=True):
        """AES encryption/decryption using Fernet."""
        f = Fernet(key)
        if encrypt:
            return f.encrypt(data)
        else:
            return f.decrypt(data)
    
    def create_ah_packet(self, src_ip, dst_ip, payload):
        """Create Authentication Header packet."""
        
        sa_key = (src_ip, dst_ip, 'AH')
        if sa_key not in self.security_associations:
            raise ValueError(f"No AH SA found for {src_ip} → {dst_ip}")
        
        sa = self.security_associations[sa_key]
        sa['sequence_number'] += 1
        
        # AH Header structure (simplified)
        # Next Header (1) + Payload Length (1) + Reserved (2) + SPI (4) + Sequence (4) + Auth Data (variable)
        
        next_header = 1  # ICMP (simplified)
        payload_length = 4  # Length in 32-bit words minus 2
        reserved = 0
        spi = sa['spi']
        sequence = sa['sequence_number']
        
        # Build AH header without authentication data
        ah_header = struct.pack('!BBHI', next_header, payload_length, reserved, spi)
        ah_header += struct.pack('!I', sequence)
        
        # Calculate authentication data (ICV - Integrity Check Value)
        # In real AH, this covers the entire IP packet with mutable fields zeroed
        auth_data_input = ah_header + payload
        auth_data = self._hmac_sha1(sa['auth_key'], auth_data_input)[:12]  # Truncate to 96 bits
        
        complete_ah_header = ah_header + auth_data
        
        print(f"📦 Created AH packet:")
        print(f"   SPI: {spi}")
        print(f"   Sequence: {sequence}")
        print(f"   Auth Data: {auth_data.hex()[:24]}...")
        print(f"   Total AH Header: {len(complete_ah_header)} bytes")
        
        return complete_ah_header + payload
    
    def create_esp_packet(self, src_ip, dst_ip, payload):
        """Create Encapsulating Security Payload packet."""
        
        sa_key = (src_ip, dst_ip, 'ESP')
        if sa_key not in self.security_associations:
            raise ValueError(f"No ESP SA found for {src_ip} → {dst_ip}")
        
        sa = self.security_associations[sa_key]
        sa['sequence_number'] += 1
        
        # ESP Header: SPI (4) + Sequence Number (4)
        spi = sa['spi']
        sequence = sa['sequence_number']
        
        esp_header = struct.pack('!II', spi, sequence)
        
        # Encrypt payload
        encrypted_payload = self._aes_encrypt_decrypt(
            sa['encr_key'], 
            payload, 
            encrypt=True
        )
        
        # ESP Trailer (simplified): Padding + Pad Length + Next Header
        # In real ESP, padding ensures proper block alignment
        pad_length = 0
        next_header = 1  # ICMP
        esp_trailer = struct.pack('!BB', pad_length, next_header)
        
        # Calculate authentication data if required
        esp_packet = esp_header + encrypted_payload + esp_trailer
        
        if sa['auth_algorithm']:
            auth_data = self._hmac_sha1(sa['auth_key'], esp_packet)[:12]
            esp_packet += auth_data
            
            print(f"🔒 Created ESP packet:")
            print(f"   SPI: {spi}")
            print(f"   Sequence: {sequence}")
            print(f"   Encrypted Payload: {len(encrypted_payload)} bytes")
            print(f"   Auth Data: {auth_data.hex()[:24]}...")
        else:
            print(f"🔒 Created ESP packet (no auth):")
            print(f"   SPI: {spi}")
            print(f"   Sequence: {sequence}")
            print(f"   Encrypted Payload: {len(encrypted_payload)} bytes")
        
        return esp_packet
    
    def verify_ah_packet(self, src_ip, dst_ip, packet_data):
        """Verify Authentication Header packet integrity."""
        
        sa_key = (src_ip, dst_ip, 'AH')
        if sa_key not in self.security_associations:
            return False, "No SA found"
        
        sa = self.security_associations[sa_key]
        
        # Parse AH header (simplified)
        if len(packet_data) < 24:  # Minimum AH header size
            return False, "Packet too short"
        
        header = packet_data[:8]
        sequence = struct.unpack('!I', packet_data[8:12])[0]
        received_auth = packet_data[12:24]
        payload = packet_data[24:]
        
        # Recalculate authentication data
        auth_data_input = header + struct.pack('!I', sequence) + payload
        expected_auth = self._hmac_sha1(sa['auth_key'], auth_data_input)[:12]
        
        if hmac.compare_digest(received_auth, expected_auth):
            print(f"✅ AH verification successful (sequence: {sequence})")
            return True, "Authentication successful"
        else:
            print(f"❌ AH verification failed (sequence: {sequence})")
            return False, "Authentication failed"
    
    def decrypt_esp_packet(self, src_ip, dst_ip, packet_data):
        """Decrypt ESP packet and verify integrity."""
        
        sa_key = (src_ip, dst_ip, 'ESP')
        if sa_key not in self.security_associations:
            return None, "No SA found"
        
        sa = self.security_associations[sa_key]
        
        # Parse ESP header
        if len(packet_data) < 8:
            return None, "Packet too short"
        
        spi, sequence = struct.unpack('!II', packet_data[:8])
        
        # Extract encrypted payload (excluding auth data if present)
        auth_data_len = 12 if sa['auth_algorithm'] else 0
        encrypted_data = packet_data[8:-auth_data_len] if auth_data_len else packet_data[8:]
        
        # Verify authentication if present
        if sa['auth_algorithm'] and auth_data_len:
            received_auth = packet_data[-auth_data_len:]
            packet_for_auth = packet_data[:-auth_data_len]
            expected_auth = self._hmac_sha1(sa['auth_key'], packet_for_auth)[:12]
            
            if not hmac.compare_digest(received_auth, expected_auth):
                print(f"❌ ESP authentication failed (sequence: {sequence})")
                return None, "Authentication failed"
        
        # Decrypt payload
        try:
            # Remove ESP trailer (last 2 bytes in simplified version)
            encrypted_payload = encrypted_data[:-2]
            decrypted_payload = self._aes_encrypt_decrypt(
                sa['encr_key'], 
                encrypted_payload, 
                encrypt=False
            )
            
            print(f"🔓 ESP decryption successful (sequence: {sequence})")
            return decrypted_payload, "Decryption successful"
            
        except Exception as e:
            print(f"❌ ESP decryption failed: {e}")
            return None, "Decryption failed"
    
    def show_security_associations(self):
        """Display all active Security Associations."""
        print("\\n🔐 Active Security Associations:")
        print("=" * 60)
        
        for (src, dst, proto), sa in self.security_associations.items():
            age = int(time.time() - sa['created_time'])
            remaining = max(0, sa['lifetime'] - age)
            
            print(f"\\n{proto} SA (SPI: {sa['spi']}):")
            print(f"   Route: {src} → {dst}")
            print(f"   Mode: {sa['mode']}")
            print(f"   Auth: {sa['auth_algorithm']}")
            if sa['encr_algorithm']:
                print(f"   Encryption: {sa['encr_algorithm']}")
            print(f"   Sequence: {sa['sequence_number']}")
            print(f"   Lifetime: {remaining}s remaining")

# Example usage and demonstration
def demonstrate_ipsec():
    """Demonstrate IPsec concepts from RFC 2401."""
    
    print("🚀 IPsec Security Architecture Demonstration (RFC 2401)")
    print("=" * 70)
    
    ipsec = IPSecSimulator()
    
    # Simulate two endpoints
    client_ip = "192.168.1.100"
    server_ip = "10.0.0.50"
    
    print("\\n1️⃣  Creating Security Associations...")
    
    # Create AH SA for authentication only
    ah_spi = ipsec.create_security_association(
        client_ip, server_ip, 'AH', mode='transport'
    )
    
    # Create ESP SA for encryption + authentication
    esp_spi = ipsec.create_security_association(
        client_ip, server_ip, 'ESP', mode='tunnel'
    )
    
    print("\\n2️⃣  Testing Authentication Header (AH)...")
    
    # Test AH protection
    test_payload = b"Hello, this message needs authentication!"
    
    ah_packet = ipsec.create_ah_packet(client_ip, server_ip, test_payload)
    
    # Verify AH packet
    is_valid, message = ipsec.verify_ah_packet(client_ip, server_ip, ah_packet)
    print(f"   Verification result: {message}")
    
    print("\\n3️⃣  Testing Encapsulating Security Payload (ESP)...")
    
    # Test ESP protection
    secret_payload = b"This is confidential data that needs encryption!"
    
    esp_packet = ipsec.create_esp_packet(client_ip, server_ip, secret_payload)
    
    # Decrypt ESP packet
    decrypted_data, result = ipsec.decrypt_esp_packet(client_ip, server_ip, esp_packet)
    
    if decrypted_data:
        print(f"   Original: {secret_payload}")
        print(f"   Decrypted: {decrypted_data}")
        print(f"   Match: {secret_payload == decrypted_data}")
    
    print("\\n4️⃣  Security Association Status:")
    ipsec.show_security_associations()
    
    print("\\n🎯 Key IPsec Benefits Demonstrated:")
    print("   • Authentication: Verify sender identity and data integrity")
    print("   • Confidentiality: Protect data from eavesdropping")
    print("   • Replay Protection: Sequence numbers prevent replay attacks")
    print("   • Transparent Security: Applications don't need modification")

if __name__ == "__main__":
    demonstrate_ipsec()`}
        />

        <p>
          This simulation demonstrates core IPsec concepts: Security Associations, 
          Authentication Header for integrity, and ESP for confidentiality. 
          Real IPsec implementations operate at the kernel level with hardware acceleration.
        </p>
      </ExpandableSection>

      <h3>Key Management with IKE</h3>

      <p>
        <GlossaryTerm>IKE</GlossaryTerm> (Internet Key Exchange) automates the establishment of Security Associations:
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-900 mb-3">IKE Phase 1 & 2</h4>
        <div className="space-y-3">
          <div>
            <h5 className="font-semibold text-blue-800">Phase 1: ISAKMP SA</h5>
            <p className="text-blue-700 text-sm">
              Establishes secure channel for negotiation. Uses Diffie-Hellman key exchange 
              and pre-shared keys or certificates for authentication.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-blue-800">Phase 2: IPsec SA</h5>
            <p className="text-blue-700 text-sm">
              Negotiates actual IPsec parameters: protocols (AH/ESP), algorithms, 
              and keys using the secure channel from Phase 1.
            </p>
          </div>
        </div>
      </div>

      <h3>Historical Context</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>Mid-1990s:</strong> Internet security concerns grow with commercial adoption
        </p>
        <p>
          <strong>1995-1997:</strong> IETF IPsec Working Group develops specifications
        </p>
        <p>
          <strong>November 1998:</strong> RFC 2401 published, establishing IPsec architecture
        </p>
        <p>
          <strong>1999-2000:</strong> VPN market explodes with IPsec-based solutions
        </p>
      </div>

      <ExpandableSection title="🌐 IPsec's Transformative Impact on Internet Security">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">🏢 Enterprise VPN Revolution</h4>
            <p className="text-green-800 text-sm">
              IPsec enabled the remote work revolution by making secure site-to-site and remote access VPNs practical:
            </p>
            <ul className="text-green-700 text-xs mt-2 space-y-1">
              <li>• <strong>Site-to-Site VPNs:</strong> Secure branch office connections</li>
              <li>• <strong>Remote Access:</strong> Secure work-from-home capabilities</li>
              <li>• <strong>Cost Savings:</strong> Eliminated need for expensive private lines</li>
              <li>• <strong>Scalability:</strong> Network-layer security scales with infrastructure</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">📊 Modern Usage Statistics</h4>
            <p className="text-blue-800 text-sm">
              IPsec remains fundamental to internet security infrastructure:
            </p>
            <ul className="text-blue-700 text-xs mt-2 space-y-1">
              <li>• <strong>Enterprise VPNs:</strong> 90%+ use IPsec for site-to-site connections</li>
              <li>• <strong>Cloud Security:</strong> AWS/Azure/GCP implement IPsec for VPC connections</li>
              <li>• <strong>Mobile Networks:</strong> 4G/5G core networks use IPsec extensively</li>
              <li>• <strong>IoT Security:</strong> Industrial IoT deployments rely on IPsec tunnels</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">🚀 Evolution and Modern Influence</h4>
            <p className="text-purple-800 text-sm">
              IPsec concepts influenced modern security protocols:
            </p>
            <ul className="text-purple-700 text-xs mt-2 space-y-1">
              <li>• <strong>WireGuard:</strong> Modern VPN protocol inspired by IPsec simplification needs</li>
              <li>• <strong>TLS 1.3:</strong> Adopted IPsec's approach to perfect forward secrecy</li>
              <li>• <strong>QUIC:</strong> Incorporates IPsec-like built-in encryption principles</li>
              <li>• <strong>Kubernetes:</strong> Network policies often implemented using IPsec</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h4 className="font-semibold text-yellow-900 mb-2">⚡ Performance and Implementation</h4>
            <p className="text-yellow-800 text-sm">
              Hardware acceleration made IPsec practical at scale:
            </p>
            <ul className="text-yellow-700 text-xs mt-2 space-y-1">
              <li>• <strong>ASIC Acceleration:</strong> Dedicated chips handle encryption/decryption</li>
              <li>• <strong>Multi-Gigabit Throughput:</strong> Modern firewalls process 100+ Gbps</li>
              <li>• <strong>CPU Integration:</strong> Intel AES-NI and ARM crypto extensions</li>
              <li>• <strong>Cloud Native:</strong> Kubernetes CNI plugins implement IPsec meshes</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">📚 External References</h5>
          <ul className="text-gray-700 text-sm space-y-1">
            <li><a href="https://tools.ietf.org/html/rfc4301" className="underline" target="_blank" rel="noopener noreferrer">RFC 4301: Security Architecture for IP (Updated)</a></li>
            <li><a href="https://www.cisco.com/c/en/us/support/docs/security-vpn/ipsec-negotiation-ike-protocols/14106-how-vpn-works.html" className="underline" target="_blank" rel="noopener noreferrer">Cisco: How VPNs Work</a></li>
            <li><a href="https://datatracker.ietf.org/wg/ipsec/about/" className="underline" target="_blank" rel="noopener noreferrer">IETF IPsec Working Group</a></li>
            <li><a href="https://tools.ietf.org/html/rfc7296" className="underline" target="_blank" rel="noopener noreferrer">RFC 7296: Internet Key Exchange Protocol Version 2 (IKEv2)</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <h3>IPsec vs Alternative Security Approaches</h3>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-blue-800">Network Layer (IPsec)</h5>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Pros:</strong> Transparent to applications, comprehensive protection
            </p>
            <p className="text-sm text-blue-600">
              <strong>Cons:</strong> Complex configuration, NAT traversal issues
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-green-800">Transport Layer (<GlossaryTerm>TLS</GlossaryTerm>)</h5>
            <p className="text-sm text-green-700 mt-1">
              <strong>Pros:</strong> Easy to implement, NAT-friendly
            </p>
            <p className="text-sm text-green-600">
              <strong>Cons:</strong> Per-application, limited to TCP
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <h5 className="font-semibold text-purple-800">Application Layer</h5>
            <p className="text-sm text-purple-700 mt-1">
              <strong>Pros:</strong> Full control, end-to-end
            </p>
            <p className="text-sm text-purple-600">
              <strong>Cons:</strong> Every app must implement, inconsistent
            </p>
          </div>
        </div>
      </div>

      <h3>IPsec in IPv6</h3>

      <p>
        Originally, IPsec was mandatory in <GlossaryTerm>IPv6</GlossaryTerm>, reflecting the importance of built-in security. 
        While later made optional, IPv6's design assumes IPsec availability for security-sensitive applications.
      </p>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-indigo-900 mb-2">IPv6 + IPsec Benefits</h4>
        <ul className="text-indigo-800 text-sm space-y-1">
          <li>• <strong>Native Integration:</strong> IPsec headers are IPv6 extension headers</li>
          <li>• <strong>End-to-End Security:</strong> No NAT complications</li>
          <li>• <strong>Simplified Deployment:</strong> Built-in address autoconfiguration</li>
          <li>• <strong>Scalable Architecture:</strong> Hierarchical addressing + security</li>
        </ul>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          IPsec revolutionized network security by moving protection to the network layer, 
          enabling transparent security for all applications. Its influence extends far beyond 
          VPNs - from cloud networking to mobile infrastructure, IPsec's architectural 
          principles continue to secure the modern internet. Understanding IPsec is essential 
          for anyone working with network security, as it represents the foundation upon 
          which much of today's secure networking is built.
        </p>
      </div>
    </article>
  );
}