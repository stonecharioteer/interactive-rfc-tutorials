import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC7748() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 7748: Elliptic Curves for Security (January 2016)</h1>

      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          WireGuard's Cryptographic Foundation
        </h3>
        <p className="text-purple-800">
          <GlossaryTerm>RFC 7748</GlossaryTerm> defines <GlossaryTerm>Curve25519</GlossaryTerm> and 
          Curve448, with Curve25519 being the elliptic curve that powers WireGuard's key exchange. 
          This specification represents modern cryptography that prioritizes security, performance, 
          and implementation simplicity over older approaches.
        </p>
        <p className="text-purple-700 text-sm mt-2">
          <strong>Read the original:</strong> <a href="https://www.rfc-editor.org/rfc/rfc7748.html" 
          className="underline" target="_blank" rel="noopener noreferrer">RFC 7748</a>
        </p>
      </div>

      <h2>The Evolution Beyond RSA and NIST Curves</h2>

      <p>
        By 2016, the cryptographic landscape was shifting away from RSA and NIST-standardized 
        elliptic curves due to performance concerns and potential vulnerabilities. RFC 7748 
        introduced <GlossaryTerm>Curve25519</GlossaryTerm> and Curve448 as modern alternatives 
        designed for high performance, security, and resistance to implementation attacks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <h4 className="font-semibold text-red-900">⚠️ Problems with Legacy Crypto</h4>
          <ul className="text-red-800 text-sm mt-2 space-y-1">
            <li>• <strong>RSA:</strong> Slow, large keys, quantum vulnerable</li>
            <li>• <strong>NIST Curves:</strong> Complex, potential backdoors</li>
            <li>• <strong>Implementation:</strong> Timing attack vulnerabilities</li>
            <li>• <strong>Performance:</strong> Poor software optimization</li>
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h4 className="font-semibold text-green-900">✅ Modern Curve Benefits</h4>
          <ul className="text-green-800 text-sm mt-2 space-y-1">
            <li>• <strong>Performance:</strong> Optimized for software</li>
            <li>• <strong>Security:</strong> Twist-secure, timing-safe</li>
            <li>• <strong>Simplicity:</strong> Reduced implementation complexity</li>
            <li>• <strong>Verification:</strong> Transparent design process</li>
          </ul>
        </div>
      </div>

      <h3>Curve25519 Mathematical Foundation</h3>

      <p>
        Curve25519 is defined over the prime field with p = 2²⁵⁵ - 19, using the Montgomery 
        curve equation: By² = x³ + Ax² + x, where A = 486662.
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-900 mb-3">Key Mathematical Properties</h4>
        
        <div className="space-y-3 text-sm">
          <div className="bg-white p-3 rounded border">
            <strong>Prime Field:</strong> p = 2²⁵⁵ - 19 (extremely large prime number)
          </div>
          <div className="bg-white p-3 rounded border">
            <strong>Base Point:</strong> x = 9, providing ~128-bit security level
          </div>
          <div className="bg-white p-3 rounded border">
            <strong>Cofactor:</strong> 8 (handled automatically by the protocol)
          </div>
          <div className="bg-white p-3 rounded border">
            <strong>Key Size:</strong> 32 bytes (256 bits) for public/private keys
          </div>
        </div>
      </div>

      <h3>The X25519 Key Agreement Function</h3>

      <p>
        RFC 7748 defines X25519, the Diffie-Hellman function built on Curve25519. Unlike 
        traditional ECDH, X25519 only uses the x-coordinate, simplifying implementation 
        and improving performance.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-yellow-900 mb-3">X25519 Operation</h4>
        
        <div className="space-y-2 text-sm">
          <div><strong>Input:</strong> 32-byte private key k, 32-byte public key u</div>
          <div><strong>Process:</strong> Compute k × u using Montgomery ladder</div>
          <div><strong>Output:</strong> 32-byte shared secret</div>
          <div><strong>Security:</strong> Computational Diffie-Hellman assumption</div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <code className="text-xs">
            shared_secret = X25519(private_key, public_key)
          </code>
        </div>
      </div>

      <ExpandableSection title="🐍 Python X25519 Implementation (Educational)">
        <p>
          <strong>⚠️ Warning:</strong> This is an educational implementation to understand the 
          mathematical concepts. Never use this for production cryptography - use established 
          libraries like <code>cryptography</code> or <code>nacl</code>.
        </p>

        <CodeBlock
          language="python"
          code={`import secrets
import struct
from typing import Tuple

class Curve25519Educational:
    """
    Educational implementation of Curve25519 operations.
    DO NOT USE IN PRODUCTION - For learning purposes only!
    """
    
    # Curve25519 prime: 2^255 - 19
    P = (1 << 255) - 19
    
    # Montgomery curve coefficient A = 486662
    A = 486662
    
    # Base point x-coordinate
    BASE_POINT = 9
    
    def __init__(self):
        print("🔒 Educational Curve25519 Implementation")
        print("⚠️  WARNING: Not for production use!")
        
    def clamp_private_key(self, private_key: bytes) -> int:
        """
        Clamp private key according to Curve25519 specification.
        Sets specific bits to ensure security properties.
        """
        # Convert to little-endian integer
        k = int.from_bytes(private_key, 'little')
        
        # Clamp according to RFC 7748:
        # - Clear bit 0 (make even)
        # - Clear bit 1 
        # - Clear bit 2
        # - Set bit 254
        # - Clear bit 255
        k &= ~7  # Clear bottom 3 bits
        k |= (1 << 254)  # Set bit 254
        k &= ~((1 << 255))  # Clear bit 255 (top bit)
        
        return k
    
    def mod_inverse(self, a: int) -> int:
        """Compute modular inverse using Fermat's little theorem."""
        # Since P is prime, a^(-1) = a^(P-2) mod P
        return pow(a, self.P - 2, self.P)
    
    def montgomery_ladder(self, k: int, u: int) -> int:
        """
        Montgomery ladder for scalar multiplication.
        Computes k * u on the curve using x-coordinates only.
        """
        x1, x2, z2, x3, z3 = u, 1, 0, u, 1
        
        # Process bits from most significant to least significant
        for i in range(254, -1, -1):  # 255 bits total, but skip MSB
            bit = (k >> i) & 1
            
            if bit:
                x2, x3 = x3, x2
                z2, z3 = z3, z2
            
            # Montgomery ladder step
            A24 = (self.A + 2) // 4  # (A+2)/4 for Montgomery curves
            
            # Differential addition and doubling
            t1 = (x2 + z2) % self.P
            t2 = (x2 - z2) % self.P
            t3 = (x3 + z3) % self.P
            t4 = (x3 - z3) % self.P
            
            t5 = (t1 * t4) % self.P
            t6 = (t2 * t3) % self.P
            t7 = (t5 + t6) % self.P
            t8 = (t5 - t6) % self.P
            
            x3 = (t7 * t7) % self.P
            z3 = (x1 * t8 * t8) % self.P
            
            t9 = (t1 * t1) % self.P
            t10 = (t2 * t2) % self.P
            x2 = (t9 * t10) % self.P
            
            t11 = (t9 - t10) % self.P
            t12 = (A24 * t11) % self.P
            t13 = (t10 + t12) % self.P
            z2 = (t11 * t13) % self.P
            
            if bit:
                x2, x3 = x3, x2
                z2, z3 = z3, z2
        
        # Convert from projective coordinates (X:Z) to affine coordinate x
        if z2 == 0:
            return 0
        else:
            return (x2 * self.mod_inverse(z2)) % self.P
    
    def x25519(self, private_key: bytes, public_key: bytes) -> bytes:
        """
        Perform X25519 key agreement.
        
        Args:
            private_key: 32-byte private key
            public_key: 32-byte public key (u-coordinate)
            
        Returns:
            32-byte shared secret
        """
        if len(private_key) != 32 or len(public_key) != 32:
            raise ValueError("Keys must be exactly 32 bytes")
        
        # Clamp private key
        k = self.clamp_private_key(private_key)
        
        # Convert public key to integer (little-endian)
        u = int.from_bytes(public_key, 'little')
        
        # Ensure u is in valid range
        u %= self.P
        
        # Perform scalar multiplication
        result = self.montgomery_ladder(k, u)
        
        # Convert result back to bytes (little-endian)
        return result.to_bytes(32, 'little')
    
    def generate_keypair(self) -> Tuple[bytes, bytes]:
        """
        Generate a Curve25519 keypair.
        
        Returns:
            Tuple of (private_key, public_key)
        """
        # Generate random 32-byte private key
        private_key = secrets.token_bytes(32)
        
        # Compute public key = private_key * base_point
        public_key = self.x25519(private_key, self.BASE_POINT.to_bytes(32, 'little'))
        
        return private_key, public_key
    
    def demonstrate_key_exchange(self):
        """Demonstrate complete X25519 key exchange."""
        print("\\n🔑 X25519 Key Exchange Demonstration")
        print("=" * 50)
        
        # Alice generates her keypair
        alice_private, alice_public = self.generate_keypair()
        print(f"👩 Alice's private key: {alice_private.hex()[:16]}...")
        print(f"👩 Alice's public key:  {alice_public.hex()[:16]}...")
        
        # Bob generates his keypair  
        bob_private, bob_public = self.generate_keypair()
        print(f"👨 Bob's private key:   {bob_private.hex()[:16]}...")
        print(f"👨 Bob's public key:    {bob_public.hex()[:16]}...")
        
        # Alice computes shared secret using Bob's public key
        alice_shared = self.x25519(alice_private, bob_public)
        print(f"\\n🤝 Alice's shared secret: {alice_shared.hex()[:16]}...")
        
        # Bob computes shared secret using Alice's public key
        bob_shared = self.x25519(bob_private, alice_public)
        print(f"🤝 Bob's shared secret:   {bob_shared.hex()[:16]}...")
        
        # Verify they computed the same shared secret
        if alice_shared == bob_shared:
            print("\\n✅ SUCCESS: Both parties computed the same shared secret!")
            print("   This shared secret can now be used for symmetric encryption.")
        else:
            print("\\n❌ ERROR: Shared secrets don't match!")
        
        return alice_shared == bob_shared
    
    def analyze_security_properties(self):
        """Analyze Curve25519's security properties."""
        print("\\n🛡️ Curve25519 Security Analysis")
        print("=" * 40)
        
        properties = [
            ("🎯 Security Level", "~128 bits (equivalent to 3072-bit RSA)"),
            ("⚡ Performance", "~4x faster than NIST P-256 in software"),
            ("🔒 Twist Security", "Secure against invalid curve attacks"),
            ("⏱️ Timing Safety", "Constant-time operations resist timing attacks"),
            ("🎲 Randomness", "No special points or weak keys to avoid"),
            ("📊 Key Size", "32 bytes (vs 384 bytes for 3072-bit RSA)"),
            ("🔍 Verification", "Simple curve equation, transparent design"),
            ("🚀 WireGuard Use", "Chosen for performance and security balance")
        ]
        
        for title, description in properties:
            print(f"{title:<20}: {description}")
    
    def compare_with_alternatives(self):
        """Compare Curve25519 with alternative approaches."""
        print("\\n📊 Cryptographic Algorithm Comparison")
        print("=" * 50)
        
        algorithms = [
            ("Algorithm", "Key Size", "Security", "SW Performance", "Complexity"),
            ("-" * 10, "-" * 8, "-" * 8, "-" * 14, "-" * 10),
            ("RSA-3072", "384 bytes", "~128-bit", "Slow", "High"),
            ("NIST P-256", "32 bytes", "~128-bit", "Medium", "High"),
            ("Curve25519", "32 bytes", "~128-bit", "Fast", "Low"),
            ("Curve448", "56 bytes", "~224-bit", "Medium", "Low")
        ]
        
        for row in algorithms:
            print(f"{row[0]:<12} {row[1]:<10} {row[2]:<10} {row[3]:<15} {row[4]}")
        
        print("\\n🎯 Why WireGuard Chose Curve25519:")
        print("   • Optimal balance of security, performance, and simplicity")
        print("   • Resistant to implementation vulnerabilities")
        print("   • Excellent performance on mobile devices")
        print("   • Transparent design without potential backdoors")

def demonstrate_curve25519():
    """Run comprehensive Curve25519 demonstration."""
    print("🚀 RFC 7748: Elliptic Curves for Security")
    print("   Educational Implementation of Curve25519")
    print("=" * 60)
    
    # Initialize curve
    curve = Curve25519Educational()
    
    # Demonstrate key exchange
    success = curve.demonstrate_key_exchange()
    
    if success:
        # Analyze security properties
        curve.analyze_security_properties()
        
        # Compare with alternatives
        curve.compare_with_alternatives()
        
        print("\\n✨ Educational Goals Achieved:")
        print("   • Understanding elliptic curve key exchange")
        print("   • Appreciation for modern cryptographic design")
        print("   • Foundation for understanding WireGuard's security")
        print("   • Knowledge of performance vs security trade-offs")
    
    print("\\n⚠️  Remember: Use production libraries like 'cryptography' or 'nacl'")
    print("   This implementation is for educational purposes only!")

if __name__ == "__main__":
    demonstrate_curve25519()`}
        />

        <p>
          This educational implementation demonstrates the core concepts of Curve25519 and X25519. 
          The Montgomery ladder algorithm efficiently computes scalar multiplication using only 
          x-coordinates, which is why it's faster than traditional elliptic curve implementations.
        </p>
      </ExpandableSection>

      <h3>WireGuard's Curve25519 Integration</h3>

      <p>
        WireGuard uses X25519 as its key agreement function in the Noise Protocol Framework handshake. 
        This choice provides several critical benefits for VPN applications:
      </p>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-indigo-900 mb-3">WireGuard Implementation Benefits</h4>
        
        <div className="space-y-3 text-sm">
          <div className="bg-white p-2 rounded border">
            <strong>Mobile Performance:</strong> Optimized for ARM processors in smartphones and tablets
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Battery Efficiency:</strong> Fast computation reduces CPU time and power consumption
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Implementation Safety:</strong> Constant-time operations prevent timing attacks
          </div>
          <div className="bg-white p-2 rounded border">
            <strong>Crypto Agility Elimination:</strong> Fixed curve choice removes negotiation complexity
          </div>
        </div>
      </div>

      <h3>Security Properties Deep Dive</h3>

      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-gray-900 mb-3">Advanced Security Features</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-gray-800">Twist Security</h5>
            <p className="text-gray-700 mt-1">
              Curve25519 is twist-secure, meaning that even if an attacker provides 
              points on the "twisted" curve, the protocol remains secure.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-800">Timing Attack Resistance</h5>
            <p className="text-gray-700 mt-1">
              The Montgomery ladder runs in constant time regardless of the private 
              key bits, preventing timing-based key recovery attacks.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-800">Small Subgroup Security</h5>
            <p className="text-gray-700 mt-1">
              The cofactor is handled correctly, ensuring that small subgroup 
              attacks cannot recover private key information.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-800">Implementation Simplicity</h5>
            <p className="text-gray-700 mt-1">
              Using only x-coordinates simplifies implementation and reduces 
              opportunities for implementation bugs and vulnerabilities.
            </p>
          </div>
        </div>
      </div>

      <ExpandableSection title="🔧 Performance Analysis and Benchmarks">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">📈 Performance Characteristics</h4>
            <p className="text-green-800 text-sm">
              Curve25519 was specifically designed for high performance in software implementations:
            </p>
            <ul className="text-green-700 text-xs mt-2 space-y-1">
              <li>• <strong>x86-64:</strong> ~240,000 operations/second on modern CPUs</li>
              <li>• <strong>ARM:</strong> Excellent performance on mobile processors</li>
              <li>• <strong>Memory:</strong> Minimal memory requirements (32-byte keys)</li>
              <li>• <strong>Constant Time:</strong> No key-dependent branching or memory access</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">⚡ WireGuard Performance Impact</h4>
            <p className="text-blue-800 text-sm">
              Fast key exchange enables WireGuard's performance advantages:
            </p>
            <ul className="text-blue-700 text-xs mt-2 space-y-1">
              <li>• <strong>Handshake Speed:</strong> Rapid connection establishment</li>
              <li>• <strong>Rekeying:</strong> Frequent key rotation without performance penalty</li>
              <li>• <strong>Mobile Battery:</strong> Reduced CPU usage extends battery life</li>
              <li>• <strong>Scalability:</strong> Servers can handle many concurrent handshakes</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded">
            <h4 className="font-semibold text-orange-900 mb-2">🔍 Code Size and Complexity</h4>
            <p className="text-orange-800 text-sm">
              Implementation simplicity contributes to WireGuard's security:
            </p>
            <ul className="text-orange-700 text-xs mt-2 space-y-1">
              <li>• <strong>Small Codebase:</strong> Fewer lines of code to audit</li>
              <li>• <strong>No Edge Cases:</strong> Simplified curve arithmetic</li>
              <li>• <strong>Verifiable:</strong> Mathematical operations are transparent</li>
              <li>• <strong>Maintainable:</strong> Less complex than traditional ECC implementations</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h5 className="font-semibold text-gray-800 mb-2">🔗 External References</h5>
          <ul className="text-gray-700 text-sm space-y-1">
            <li><a href="https://cr.yp.to/ecdh.html" className="underline" target="_blank" rel="noopener noreferrer">Curve25519 Original Paper by Daniel J. Bernstein</a></li>
            <li><a href="https://tools.ietf.org/html/rfc7748" className="underline" target="_blank" rel="noopener noreferrer">RFC 7748: Elliptic Curves for Security</a></li>
            <li><a href="https://www.wireguard.com/protocol/" className="underline" target="_blank" rel="noopener noreferrer">WireGuard Protocol & Cryptography</a></li>
            <li><a href="https://eprint.iacr.org/2014/130.pdf" className="underline" target="_blank" rel="noopener noreferrer">SafeCurves: Choosing Safe Curves for ECC</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <h3>Historical Context and Adoption</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>2005-2006:</strong> Daniel J. Bernstein develops Curve25519
        </p>
        <p>
          <strong>2008-2013:</strong> Academic research validates security properties
        </p>
        <p>
          <strong>January 2016:</strong> RFC 7748 published as Internet Standard
        </p>
        <p>
          <strong>2016-2018:</strong> WireGuard adopts Curve25519 for key exchange
        </p>
        <p>
          <strong>2018-Present:</strong> Widespread adoption in modern protocols
        </p>
      </div>

      <h3>Modern Applications Beyond WireGuard</h3>

      <p>
        RFC 7748's Curve25519 has become the foundation for many modern cryptographic applications:
      </p>

      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-emerald-900 mb-2">Widespread Adoption</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <h5 className="font-semibold text-emerald-800">VPN Technologies</h5>
            <ul className="text-emerald-700 mt-1 space-y-1">
              <li>• WireGuard (key exchange)</li>
              <li>• Tailscale (underlying WireGuard)</li>
              <li>• Modern OpenVPN implementations</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-emerald-800">Communication Protocols</h5>
            <ul className="text-emerald-700 mt-1 space-y-1">
              <li>• Signal Protocol (messaging)</li>
              <li>• TLS 1.3 (web security)</li>
              <li>• SSH modern implementations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 7748's Curve25519 represents a paradigm shift in cryptographic design, prioritizing 
          performance, security, and implementation simplicity. Its adoption in WireGuard demonstrates 
          how modern cryptography can achieve both exceptional security and practical performance. 
          Understanding Curve25519 provides insight into the mathematical foundations that make 
          WireGuard both secure and fast, while illustrating the evolution from complex, potentially 
          vulnerable legacy cryptography to clean, verifiable modern alternatives. This RFC exemplifies 
          how careful cryptographic engineering can solve real-world problems while maintaining the 
          highest security standards.
        </p>
      </div>
    </article>
  );
}