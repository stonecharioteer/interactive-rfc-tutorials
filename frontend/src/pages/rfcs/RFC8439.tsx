import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC8439() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 8439: ChaCha20 and Poly1305 for IETF Protocols (June 2018)</h1>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          WireGuard's Encryption Engine
        </h3>
        <p className="text-green-800">
          <GlossaryTerm>RFC 8439</GlossaryTerm> defines <GlossaryTerm>ChaCha20-Poly1305</GlossaryTerm>, 
          the authenticated encryption algorithm that powers WireGuard's data protection. This 
          specification represents modern <GlossaryTerm>AEAD</GlossaryTerm> (Authenticated Encryption 
          with Associated Data) cryptography optimized for software performance.
        </p>
        <p className="text-green-700 text-sm mt-2">
          <strong>Read the original:</strong> <a href="https://www.rfc-editor.org/rfc/rfc8439.html" 
          className="underline" target="_blank" rel="noopener noreferrer">RFC 8439</a>
        </p>
      </div>

      <h2>Evolution from AES-GCM to ChaCha20-Poly1305</h2>

      <p>
        Traditional encryption relied on AES-GCM for authenticated encryption, but this approach 
        had performance limitations in software and potential timing vulnerabilities. ChaCha20-Poly1305 
        was designed to provide equivalent security with superior software performance and 
        implementation safety.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <h4 className="font-semibold text-red-900">⚠️ AES-GCM Limitations</h4>
          <ul className="text-red-800 text-sm mt-2 space-y-1">
            <li>• <strong>Performance:</strong> Requires hardware acceleration for speed</li>
            <li>• <strong>Mobile:</strong> Poor performance on ARM processors</li>
            <li>• <strong>Timing:</strong> Cache-timing attack vulnerabilities</li>
            <li>• <strong>Complexity:</strong> Complex finite field arithmetic</li>
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">✅ ChaCha20-Poly1305 Benefits</h4>
          <ul className="text-green-800 text-sm mt-2 space-y-1">
            <li>• <strong>Software Speed:</strong> Optimized for CPU-only operation</li>
            <li>• <strong>Mobile First:</strong> Excellent ARM performance</li>
            <li>• <strong>Constant Time:</strong> No key-dependent operations</li>
            <li>• <strong>Simplicity:</strong> Addition, rotation, XOR operations only</li>
          </ul>
        </div>
      </div>

      <h3>ChaCha20 Stream Cipher</h3>

      <p>
        ChaCha20 is a stream cipher designed by Daniel J. Bernstein as an evolution of 
        Salsa20. It generates a keystream by repeatedly applying the ChaCha20 "quarter-round" 
        function to a 512-bit state.
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-900 mb-3">ChaCha20 State Structure</h4>
        
        <div className="space-y-3 text-sm">
          <div className="bg-white p-3 rounded border">
            <strong>Constants (128 bits):</strong> "expand 32-byte k" in ASCII
          </div>
          <div className="bg-white p-3 rounded border">
            <strong>Key (256 bits):</strong> Secret encryption key
          </div>
          <div className="bg-white p-3 rounded border">
            <strong>Counter (32 bits):</strong> Block counter (starts at 0 or 1)
          </div>
          <div className="bg-white p-3 rounded border">
            <strong>Nonce (96 bits):</strong> Unique number for each encryption
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <code className="text-xs">
            State = [Constants][Key][Counter][Nonce] = 16 × 32-bit words
          </code>
        </div>
      </div>

      <h3>Poly1305 Message Authentication</h3>

      <p>
        Poly1305 is a one-time authenticator that computes a 128-bit authentication tag 
        using a one-time key derived from ChaCha20. It uses polynomial evaluation in a 
        large prime field for fast computation.
      </p>

      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-purple-900 mb-3">Poly1305 Operation</h4>
        
        <div className="space-y-2 text-sm">
          <div><strong>Input:</strong> Message, one-time key (derived from ChaCha20)</div>
          <div><strong>Process:</strong> Polynomial evaluation modulo 2¹³⁰ - 5</div>
          <div><strong>Output:</strong> 128-bit authentication tag</div>
          <div><strong>Security:</strong> Information-theoretic security with one-time keys</div>
        </div>
        
        <div className="mt-4 p-3 bg-purple-100 rounded">
          <code className="text-xs">
            tag = ((m₁×r¹ + m₂×r² + ... + mₙ×rⁿ + s)) mod (2¹³⁰ - 5)
          </code>
        </div>
      </div>

      <ExpandableSection title="🐍 Python ChaCha20-Poly1305 Implementation (Educational)">
        <p>
          <strong>⚠️ Warning:</strong> This is an educational implementation to understand the 
          cryptographic concepts. Never use this for production - use established libraries 
          like <code>cryptography</code> or <code>pycryptodome</code>.
        </p>

        <CodeBlock
          language="python"
          code={`import struct
import secrets
from typing import Tuple, List

class ChaCha20Poly1305Educational:
    """
    Educational implementation of ChaCha20-Poly1305 AEAD.
    DO NOT USE IN PRODUCTION - For learning purposes only!
    """
    
    def __init__(self):
        print("🔒 Educational ChaCha20-Poly1305 Implementation")
        print("⚠️  WARNING: Not for production use!")
    
    def _quarter_round(self, state: List[int], a: int, b: int, c: int, d: int):
        """ChaCha20 quarter-round function."""
        state[a] = (state[a] + state[b]) & 0xFFFFFFFF
        state[d] ^= state[a]
        state[d] = ((state[d] << 16) | (state[d] >> 16)) & 0xFFFFFFFF
        
        state[c] = (state[c] + state[d]) & 0xFFFFFFFF
        state[b] ^= state[c]
        state[b] = ((state[b] << 12) | (state[b] >> 20)) & 0xFFFFFFFF
        
        state[a] = (state[a] + state[b]) & 0xFFFFFFFF
        state[d] ^= state[a]
        state[d] = ((state[d] << 8) | (state[d] >> 24)) & 0xFFFFFFFF
        
        state[c] = (state[c] + state[d]) & 0xFFFFFFFF
        state[b] ^= state[c]
        state[b] = ((state[b] << 7) | (state[b] >> 25)) & 0xFFFFFFFF
    
    def _chacha20_block(self, key: bytes, counter: int, nonce: bytes) -> bytes:
        """Generate one ChaCha20 block (64 bytes)."""
        if len(key) != 32:
            raise ValueError("Key must be 32 bytes")
        if len(nonce) != 12:
            raise ValueError("Nonce must be 12 bytes")
        
        # Initialize state
        constants = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]  # "expand 32-byte k"
        key_words = list(struct.unpack('<8I', key))
        counter_word = [counter]
        nonce_words = list(struct.unpack('<3I', nonce))
        
        state = constants + key_words + counter_word + nonce_words
        working_state = state[:]
        
        # Perform 20 rounds (10 double-rounds)
        for _ in range(10):
            # Column rounds
            self._quarter_round(working_state, 0, 4, 8, 12)
            self._quarter_round(working_state, 1, 5, 9, 13)
            self._quarter_round(working_state, 2, 6, 10, 14)
            self._quarter_round(working_state, 3, 7, 11, 15)
            
            # Diagonal rounds
            self._quarter_round(working_state, 0, 5, 10, 15)
            self._quarter_round(working_state, 1, 6, 11, 12)
            self._quarter_round(working_state, 2, 7, 8, 13)
            self._quarter_round(working_state, 3, 4, 9, 14)
        
        # Add original state
        for i in range(16):
            working_state[i] = (working_state[i] + state[i]) & 0xFFFFFFFF
        
        # Convert to bytes
        return struct.pack('<16I', *working_state)
    
    def _chacha20_encrypt(self, key: bytes, counter: int, nonce: bytes, plaintext: bytes) -> bytes:
        """Encrypt/decrypt using ChaCha20 stream cipher."""
        ciphertext = bytearray()
        block_counter = counter
        
        for i in range(0, len(plaintext), 64):
            keystream = self._chacha20_block(key, block_counter, nonce)
            block = plaintext[i:i+64]
            
            # XOR with keystream
            for j in range(len(block)):
                ciphertext.append(block[j] ^ keystream[j])
            
            block_counter += 1
        
        return bytes(ciphertext)
    
    def _poly1305_mac(self, key: bytes, message: bytes) -> bytes:
        """Compute Poly1305 MAC (simplified educational version)."""
        if len(key) != 32:
            raise ValueError("Poly1305 key must be 32 bytes")
        
        # Extract r and s from key
        r = int.from_bytes(key[:16], 'little')
        s = int.from_bytes(key[16:32], 'little')
        
        # Clamp r according to Poly1305 spec
        r &= 0x0ffffffc0ffffffc0ffffffc0fffffff
        
        # Poly1305 prime
        p = (1 << 130) - 5
        
        # Process message in 16-byte blocks
        accumulator = 0
        
        for i in range(0, len(message), 16):
            block = message[i:i+16]
            
            # Pad block to 16 bytes and add high bit
            if len(block) < 16:
                block += b'\\x00' * (16 - len(block))
                n = int.from_bytes(block, 'little') + (1 << (8 * len(message[i:i+16])))
            else:
                n = int.from_bytes(block, 'little') + (1 << 128)
            
            # Accumulate
            accumulator = ((accumulator + n) * r) % p
        
        # Add s and reduce
        accumulator = (accumulator + s) % (1 << 128)
        
        return accumulator.to_bytes(16, 'little')
    
    def _pad16(self, data: bytes) -> bytes:
        """Pad data to 16-byte boundary."""
        remainder = len(data) % 16
        if remainder != 0:
            return data + b'\\x00' * (16 - remainder)
        return data
    
    def aead_encrypt(self, key: bytes, nonce: bytes, plaintext: bytes, 
                     associated_data: bytes = b'') -> Tuple[bytes, bytes]:
        """
        ChaCha20-Poly1305 AEAD encryption.
        
        Returns:
            Tuple of (ciphertext, authentication_tag)
        """
        if len(key) != 32:
            raise ValueError("Key must be 32 bytes")
        if len(nonce) != 12:
            raise ValueError("Nonce must be 12 bytes")
        
        # Generate Poly1305 key using ChaCha20
        poly1305_key = self._chacha20_block(key, 0, nonce)[:32]
        
        # Encrypt plaintext
        ciphertext = self._chacha20_encrypt(key, 1, nonce, plaintext)
        
        # Construct AAD for MAC
        aad_padded = self._pad16(associated_data)
        ciphertext_padded = self._pad16(ciphertext)
        lengths = struct.pack('<QQ', len(associated_data), len(ciphertext))
        
        mac_data = aad_padded + ciphertext_padded + lengths
        
        # Compute authentication tag
        tag = self._poly1305_mac(poly1305_key, mac_data)
        
        return ciphertext, tag
    
    def aead_decrypt(self, key: bytes, nonce: bytes, ciphertext: bytes, 
                     tag: bytes, associated_data: bytes = b'') -> bytes:
        """
        ChaCha20-Poly1305 AEAD decryption.
        
        Returns:
            Plaintext if authentication succeeds
        
        Raises:
            ValueError if authentication fails
        """
        if len(key) != 32:
            raise ValueError("Key must be 32 bytes")
        if len(nonce) != 12:
            raise ValueError("Nonce must be 12 bytes")
        if len(tag) != 16:
            raise ValueError("Tag must be 16 bytes")
        
        # Generate Poly1305 key
        poly1305_key = self._chacha20_block(key, 0, nonce)[:32]
        
        # Construct AAD for MAC verification
        aad_padded = self._pad16(associated_data)
        ciphertext_padded = self._pad16(ciphertext)
        lengths = struct.pack('<QQ', len(associated_data), len(ciphertext))
        
        mac_data = aad_padded + ciphertext_padded + lengths
        
        # Verify authentication tag
        expected_tag = self._poly1305_mac(poly1305_key, mac_data)
        
        # Constant-time comparison (simplified)
        if tag != expected_tag:
            raise ValueError("Authentication failed - message may be tampered")
        
        # Decrypt if authentication passes
        plaintext = self._chacha20_encrypt(key, 1, nonce, ciphertext)
        
        return plaintext
    
    def demonstrate_aead(self):
        """Demonstrate ChaCha20-Poly1305 AEAD operations."""
        print("\\n🔐 ChaCha20-Poly1305 AEAD Demonstration")
        print("=" * 50)
        
        # Generate key and nonce
        key = secrets.token_bytes(32)
        nonce = secrets.token_bytes(12)
        
        # Test data
        plaintext = b"Hello, WireGuard uses ChaCha20-Poly1305 for encryption!"
        associated_data = b"WireGuard packet header"
        
        print(f"🔑 Key: {key.hex()[:16]}...")
        print(f"🎲 Nonce: {nonce.hex()}")
        print(f"📝 Plaintext: {plaintext.decode()}")
        print(f"📋 Associated Data: {associated_data.decode()}")
        
        # Encrypt
        ciphertext, tag = self.aead_encrypt(key, nonce, plaintext, associated_data)
        
        print(f"\\n🔒 Ciphertext: {ciphertext.hex()[:32]}...")
        print(f"🏷️  Auth Tag: {tag.hex()}")
        
        # Decrypt
        try:
            decrypted = self.aead_decrypt(key, nonce, ciphertext, tag, associated_data)
            print(f"\\n🔓 Decrypted: {decrypted.decode()}")
            
            if decrypted == plaintext:
                print("✅ SUCCESS: Encryption/decryption cycle completed!")
            else:
                print("❌ ERROR: Decryption mismatch!")
        
        except ValueError as e:
            print(f"❌ Authentication failed: {e}")
        
        # Test tampering detection
        print("\\n🚨 Testing Tampering Detection:")
        tampered_ciphertext = bytearray(ciphertext)
        tampered_ciphertext[0] ^= 1  # Flip one bit
        
        try:
            self.aead_decrypt(key, nonce, bytes(tampered_ciphertext), tag, associated_data)
            print("❌ ERROR: Tampering not detected!")
        except ValueError:
            print("✅ SUCCESS: Tampering correctly detected and rejected!")
    
    def performance_analysis(self):
        """Analyze ChaCha20-Poly1305 performance characteristics."""
        print("\\n⚡ Performance Analysis")
        print("=" * 30)
        
        characteristics = [
            ("🏃 Software Speed", "~1-4 GB/s on modern CPUs"),
            ("📱 Mobile Performance", "Excellent on ARM processors"),
            ("🔋 Battery Impact", "Low CPU usage extends battery life"),
            ("💾 Memory Usage", "Minimal memory requirements"),
            ("🎯 Cache Behavior", "No data-dependent memory access"),
            ("⏱️ Timing Safety", "Constant-time operations"),
            ("🔧 Implementation", "Simple: add, rotate, XOR only"),
            ("🚀 WireGuard Benefit", "Enables high-speed VPN performance")
        ]
        
        for title, description in characteristics:
            print(f"{title:<20}: {description}")
    
    def compare_with_aes_gcm(self):
        """Compare ChaCha20-Poly1305 with AES-GCM."""
        print("\\n📊 ChaCha20-Poly1305 vs AES-GCM")
        print("=" * 40)
        
        comparisons = [
            ("Aspect", "ChaCha20-Poly1305", "AES-GCM"),
            ("-" * 15, "-" * 17, "-" * 8),
            ("Software Speed", "Very Fast", "Medium"),
            ("Hardware Accel", "Not Required", "Recommended"),
            ("ARM Performance", "Excellent", "Poor"),
            ("Implementation", "Simple", "Complex"),
            ("Timing Attacks", "Resistant", "Vulnerable"),
            ("Patent Issues", "None", "Some"),
            ("Standardization", "RFC 8439", "NIST SP 800-38D"),
            ("WireGuard Use", "Primary Choice", "Not Used")
        ]
        
        for row in comparisons:
            print(f"{row[0]:<15} {row[1]:<17} {row[2]}")
        
        print("\\n🎯 Why WireGuard Chose ChaCha20-Poly1305:")
        print("   • Superior software performance across all platforms")
        print("   • Constant-time operations prevent side-channel attacks")
        print("   • Simpler implementation reduces bug probability")
        print("   • Better mobile device performance and battery life")

def demonstrate_chacha20_poly1305():
    """Run comprehensive ChaCha20-Poly1305 demonstration."""
    print("🚀 RFC 8439: ChaCha20 and Poly1305 for IETF Protocols")
    print("   Educational Implementation of ChaCha20-Poly1305 AEAD")
    print("=" * 65)
    
    # Initialize cipher
    cipher = ChaCha20Poly1305Educational()
    
    # Demonstrate AEAD operations
    cipher.demonstrate_aead()
    
    # Analyze performance
    cipher.performance_analysis()
    
    # Compare with alternatives
    cipher.compare_with_aes_gcm()
    
    print("\\n✨ Educational Goals Achieved:")
    print("   • Understanding authenticated encryption (AEAD)")
    print("   • Appreciation for software-optimized cryptography")
    print("   • Foundation for understanding WireGuard's performance")
    print("   • Knowledge of modern cryptographic design principles")
    
    print("\\n⚠️  Remember: Use production libraries like 'cryptography'")
    print("   This is educational code to understand the concepts!")

if __name__ == "__main__":
    demonstrate_chacha20_poly1305()`}
        />

        <p>
          This educational implementation demonstrates how ChaCha20 generates a keystream through 
          repeated application of the quarter-round function, and how Poly1305 provides 
          authentication through polynomial evaluation. The AEAD construction combines both 
          for authenticated encryption.
        </p>
      </ExpandableSection>

      <h3>AEAD (Authenticated Encryption with Associated Data)</h3>

      <p>
        ChaCha20-Poly1305 is an AEAD cipher, meaning it provides both confidentiality and 
        authenticity in a single operation. This is crucial for WireGuard's security model:
      </p>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-amber-900 mb-3">AEAD Properties</h4>
        
        <div className="space-y-3 text-sm">
          <div className="bg-white p-2 rounded border">
            <strong>Confidentiality:</strong> ChaCha20 encrypts plaintext data
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Authenticity:</strong> Poly1305 authenticates both ciphertext and associated data
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Associated Data:</strong> Headers/metadata authenticated but not encrypted
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Atomicity:</strong> Decryption fails completely if authentication fails
          </div>
        </div>
      </div>

      <h3>WireGuard's ChaCha20-Poly1305 Integration</h3>

      <p>
        WireGuard uses ChaCha20-Poly1305 as its only symmetric encryption algorithm, 
        eliminating crypto-agility complexity while providing optimal performance:
      </p>

      <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-cyan-900 mb-3">WireGuard Implementation Details</h4>
        
        <div className="space-y-3 text-sm">
          <div className="bg-white p-2 rounded border">
            <strong>Packet Encryption:</strong> Each WireGuard data packet encrypted with unique nonce
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Header Authentication:</strong> Packet headers authenticated as associated data
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Key Derivation:</strong> Session keys derived from X25519 shared secrets
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Nonce Management:</strong> Counter-based nonces prevent reuse
          </div>
        </div>
      </div>

      <h3>Performance Advantages</h3>

      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-emerald-900 mb-3">Software Optimization Benefits</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-emerald-800">CPU Architecture Benefits</h5>
            <ul className="text-emerald-700 mt-1 space-y-1">
              <li>• <strong>x86-64:</strong> Vectorized implementations possible</li>
              <li>• <strong>ARM:</strong> Excellent performance without NEON</li>
              <li>• <strong>RISC-V:</strong> Simple operations map well</li>
              <li>• <strong>General:</strong> No special instructions required</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-emerald-800">Implementation Advantages</h5>
            <ul className="text-emerald-700 mt-1 space-y-1">
              <li>• <strong>No Lookup Tables:</strong> Prevents cache-timing attacks</li>
              <li>• <strong>Constant Time:</strong> No key-dependent branches</li>
              <li>• <strong>Simple Operations:</strong> Easy to implement correctly</li>
              <li>• <strong>Parallelizable:</strong> Multiple blocks can be processed simultaneously</li>
            </ul>
          </div>
        </div>
      </div>

      <ExpandableSection title="🚀 WireGuard Performance Deep Dive">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">📈 Real-World Performance Impact</h4>
            <p className="text-blue-800 text-sm">
              ChaCha20-Poly1305's performance characteristics directly translate to WireGuard benefits:
            </p>
            <ul className="text-blue-700 text-xs mt-2 space-y-1">
              <li>• <strong>Throughput:</strong> Multi-gigabit speeds on modern CPUs</li>
              <li>• <strong>Latency:</strong> Low encryption/decryption overhead</li>
              <li>• <strong>Mobile:</strong> Excellent smartphone and tablet performance</li>
              <li>• <strong>IoT:</strong> Works well on resource-constrained devices</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded">
            <h4 className="font-semibold text-orange-900 mb-2">🔋 Power Efficiency</h4>
            <p className="text-orange-800 text-sm">
              Optimized software implementation reduces power consumption:
            </p>
            <ul className="text-orange-700 text-xs mt-2 space-y-1">
              <li>• <strong>CPU Usage:</strong> Lower CPU utilization for encryption</li>
              <li>• <strong>Battery Life:</strong> Extended mobile device operation</li>
              <li>• <strong>Heat Generation:</strong> Reduced thermal load on devices</li>
              <li>• <strong>Scalability:</strong> Servers can handle more concurrent connections</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">🛡️ Security Through Simplicity</h4>
            <p className="text-purple-800 text-sm">
              Simple operations reduce implementation vulnerability surface:
            </p>
            <ul className="text-purple-700 text-xs mt-2 space-y-1">
              <li>• <strong>Code Audit:</strong> Easier to verify correct implementation</li>
              <li>• <strong>Side Channels:</strong> Constant-time operations prevent leaks</li>
              <li>• <strong>Timing Attacks:</strong> No key-dependent memory access</li>
              <li>• <strong>Fault Attacks:</strong> Simple operations are more fault-resistant</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">🎯 Design Philosophy Impact</h4>
            <p className="text-green-800 text-sm">
              ChaCha20-Poly1305 embodies WireGuard's design principles:
            </p>
            <ul className="text-green-700 text-xs mt-2 space-y-1">
              <li>• <strong>Simplicity:</strong> One algorithm eliminates negotiation complexity</li>
              <li>• <strong>Performance:</strong> Optimized for real-world hardware</li>
              <li>• <strong>Security:</strong> Modern cryptographic practices</li>
              <li>• <strong>Auditability:</strong> Clear, verifiable implementation</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">📚 Technical References</h5>
          <ul className="text-gray-700 text-sm space-y-1">
            <li><a href="https://cr.yp.to/chacha.html" className="underline" target="_blank" rel="noopener noreferrer">ChaCha20 Original Specification by Daniel J. Bernstein</a></li>
            <li><a href="https://cr.yp.to/mac/poly1305-20050329.pdf" className="underline" target="_blank" rel="noopener noreferrer">Poly1305-AES Original Paper</a></li>
            <li><a href="https://tools.ietf.org/html/rfc8439" className="underline" target="_blank" rel="noopener noreferrer">RFC 8439: ChaCha20 and Poly1305 for IETF Protocols</a></li>
            <li><a href="https://www.wireguard.com/protocol/" className="underline" target="_blank" rel="noopener noreferrer">WireGuard Protocol & Cryptography Details</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <h3>Historical Context and Adoption</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>2008:</strong> Daniel J. Bernstein publishes ChaCha20 and Poly1305
        </p>
        <p>
          <strong>2013:</strong> Google adopts ChaCha20-Poly1305 for mobile TLS
        </p>
        <p>
          <strong>2015:</strong> RFC 7539 published (later obsoleted by RFC 8439)
        </p>
        <p>
          <strong>2016-2018:</strong> WireGuard adopts ChaCha20-Poly1305 as sole cipher
        </p>
        <p>
          <strong>June 2018:</strong> RFC 8439 published as Internet Standard
        </p>
        <p>
          <strong>2019-Present:</strong> Widespread adoption in modern protocols
        </p>
      </div>

      <h3>Beyond WireGuard: Modern Protocol Adoption</h3>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-indigo-900 mb-2">Widespread Modern Usage</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <h5 className="font-semibold text-indigo-800">Network Protocols</h5>
            <ul className="text-indigo-700 mt-1 space-y-1">
              <li>• WireGuard VPN (primary cipher)</li>
              <li>• TLS 1.3 (mobile optimization)</li>
              <li>• QUIC protocol (HTTP/3)</li>
              <li>• OpenSSH (modern configurations)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-indigo-800">Applications</h5>
            <ul className="text-indigo-700 mt-1 space-y-1">
              <li>• Signal messaging protocol</li>
              <li>• Google Chrome (mobile TLS)</li>
              <li>• Cloudflare (edge encryption)</li>
              <li>• Various VPN implementations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 8439's ChaCha20-Poly1305 represents a fundamental shift in cryptographic design, 
          prioritizing software performance and implementation safety over hardware acceleration 
          requirements. Its adoption in WireGuard demonstrates how modern cryptography can achieve 
          both exceptional security and practical performance across diverse computing platforms. 
          Understanding ChaCha20-Poly1305 provides insight into authenticated encryption concepts, 
          the importance of constant-time operations, and why WireGuard can deliver multi-gigabit 
          VPN performance even on mobile devices. This specification exemplifies how thoughtful 
          cryptographic engineering can create algorithms that are simultaneously secure, fast, 
          and implementable—the trifecta that makes modern VPN technology both practical and trustworthy.
        </p>
      </div>
    </article>
  );
}