export const code = `# The NAT Connectivity Problem

class NetworkTopology:
    def __init__(self):
        # Alice's network
        self.alice_private_ip = "192.168.1.100"
        self.alice_nat_public_ip = "203.0.113.50"

        # Bob's network
        self.bob_private_ip = "10.0.0.200"
        self.bob_nat_public_ip = "198.51.100.75"

    def direct_connection_problem(self):
        print("🚫 Connection Problem:")
        print(f"   Alice knows her private IP: {self.alice_private_ip}")
        print(f"   Bob knows his private IP: {self.bob_private_ip}")
        print("   ❌ Neither knows their public IP or how to reach the other!")

    def stun_solution(self):
        print("✅ STUN Solution:")
        print("   1. Contact STUN server to discover public IP")
        print("   2. Learn NAT type and behavior")
        print("   3. Exchange public addresses with peer")
        print("   4. Use UDP hole punching for direct connection")`;
