export const getCodeExample = () => `
/**
 * RFC 4787: NAT Behavior Detection Implementation
 * 
 * This example demonstrates how to detect NAT mapping and filtering behaviors
 * using multiple STUN servers, which is essential for determining the best
 * peer-to-peer connection strategy.
 */

interface STUNServer {
  host: string;
  port: number;
  name: string;
}

interface NATMapping {
  internal: { address: string; port: number };
  external: { address: string; port: number };
  server: string;
}

enum MappingBehavior {
  ENDPOINT_INDEPENDENT = "endpoint-independent",
  ADDRESS_DEPENDENT = "address-dependent", 
  ADDRESS_PORT_DEPENDENT = "address-port-dependent"
}

enum FilteringBehavior {
  ENDPOINT_INDEPENDENT = "endpoint-independent",
  ADDRESS_DEPENDENT = "address-dependent",
  ADDRESS_PORT_DEPENDENT = "address-port-dependent"
}

class NATBehaviorDetector {
  private stunServers: STUNServer[] = [
    { host: "stun.l.google.com", port: 19302, name: "Google" },
    { host: "stun1.l.google.com", port: 19302, name: "Google-1" },
    { host: "stun.cloudflare.com", port: 3478, name: "Cloudflare" },
    { host: "stun.nextcloud.com", port: 443, name: "Nextcloud" }
  ];
  
  private mappings: NATMapping[] = [];
  
  /**
   * Phase 1: Detect NAT mapping behavior
   * 
   * Tests whether the NAT uses the same external port when contacting
   * different destinations from the same internal address:port
   */
  async detectMappingBehavior(): Promise<MappingBehavior> {
    console.log("🔍 Testing NAT Mapping Behavior...");
    
    // Create UDP socket bound to specific port
    const socket = this.createUDPSocket(5000);
    
    // Test with multiple STUN servers
    for (const server of this.stunServers.slice(0, 3)) {
      try {
        const mapping = await this.performSTUNBinding(socket, server);
        this.mappings.push(mapping);
        
        console.log(\`📍 \${server.name}: Internal \${mapping.internal.address}:\${mapping.internal.port} -> External \${mapping.external.address}:\${mapping.external.port}\`);
      } catch (error) {
        console.warn(\`⚠️  Failed to contact \${server.name}: \${error.message}\`);
      }
    }
    
    return this.analyzeMappingBehavior();
  }
  
  /**
   * Phase 2: Detect NAT filtering behavior
   * 
   * Tests whether external hosts can send packets to the NAT's external
   * mapping without the internal host having contacted them first
   */
  async detectFilteringBehavior(): Promise<FilteringBehavior> {
    console.log("🔍 Testing NAT Filtering Behavior...");
    
    if (this.mappings.length === 0) {
      throw new Error("Must detect mapping behavior first");
    }
    
    const primaryMapping = this.mappings[0];
    
    // Test if unknown hosts can reach us through the mapping
    const filteringTests = await Promise.allSettled([
      this.testDirectReachability(primaryMapping),
      this.testFromDifferentAddress(primaryMapping),
      this.testFromDifferentPort(primaryMapping)
    ]);
    
    return this.analyzeFilteringBehavior(filteringTests);
  }
  
  /**
   * Analyze mapping behavior based on external port consistency
   */
  private analyzeMappingBehavior(): MappingBehavior {
    if (this.mappings.length < 2) {
      console.log("⚠️  Insufficient data for mapping analysis");
      return MappingBehavior.ENDPOINT_INDEPENDENT; // Conservative assumption
    }
    
    const externalPorts = this.mappings.map(m => m.external.port);
    const uniquePorts = new Set(externalPorts);
    
    if (uniquePorts.size === 1) {
      console.log("✅ Endpoint-Independent Mapping detected!");
      console.log("   Same external port used for all destinations");
      console.log("   🎯 Excellent for peer-to-peer applications");
      return MappingBehavior.ENDPOINT_INDEPENDENT;
    } else {
      console.log("❌ Address-Dependent or Address/Port-Dependent Mapping");
      console.log("   Different external ports for different destinations");  
      console.log("   🚫 Challenging for peer-to-peer connections");
      
      // Could do more sophisticated analysis here to distinguish
      // between address-dependent and address/port-dependent
      return MappingBehavior.ADDRESS_DEPENDENT;
    }
  }
  
  /**
   * Analyze filtering behavior based on reachability tests
   */
  private analyzeFilteringBehavior(testResults: PromiseSettledResult<boolean>[]): FilteringBehavior {
    const [directTest, addressTest, portTest] = testResults;
    
    if (directTest.status === 'fulfilled' && directTest.value) {
      console.log("✅ Endpoint-Independent Filtering detected!");
      console.log("   Any external host can reach the mapping");
      console.log("   🎯 Perfect for Tailscale direct connections");
      return FilteringBehavior.ENDPOINT_INDEPENDENT;
    }
    
    if (addressTest.status === 'fulfilled' && addressTest.value) {
      console.log("⚠️  Address-Dependent Filtering detected");
      console.log("   Only contacted addresses can reach the mapping");
      console.log("   🔄 Requires UDP hole punching coordination");
      return FilteringBehavior.ADDRESS_DEPENDENT;
    }
    
    console.log("❌ Address/Port-Dependent Filtering detected");
    console.log("   Only exact contacted address:port can reach mapping");
    console.log("   🚫 Very challenging for peer-to-peer connections");
    return FilteringBehavior.ADDRESS_PORT_DEPENDENT;
  }
  
  /**
   * Simulate STUN binding request to discover external mapping
   */
  private async performSTUNBinding(socket: any, server: STUNServer): Promise<NATMapping> {
    // In a real implementation, this would:
    // 1. Send STUN Binding Request to server
    // 2. Parse STUN Binding Response  
    // 3. Extract XOR-MAPPED-ADDRESS attribute
    
    // Simulated response for educational purposes
    const simulatedExternalAddress = this.simulateNATMapping(server);
    
    return {
      internal: { address: "192.168.1.100", port: 5000 },
      external: simulatedExternalAddress,
      server: server.name
    };
  }
  
  /**
   * Simulate NAT mapping based on behavior type
   */
  private simulateNATMapping(server: STUNServer): { address: string; port: number } {
    // Simulate endpoint-independent mapping (same external port)
    const basePort = 12345;
    
    // For demonstration - in reality, this depends on actual NAT behavior
    return {
      address: "203.0.113.1", // Our simulated external IP  
      port: basePort + (server.name === "Google" ? 0 : 1) // Vary port for demo
    };
  }
  
  /**
   * Test if external hosts can reach our mapping directly
   */
  private async testDirectReachability(mapping: NATMapping): Promise<boolean> {
    console.log("🧪 Testing direct reachability...");
    
    // In reality, this would involve coordinating with a test server
    // to send packets directly to our external mapping
    
    // Simulate based on common NAT behaviors
    return Math.random() > 0.4; // ~60% of NATs allow this
  }
  
  /**
   * Test filtering from different source address
   */
  private async testFromDifferentAddress(mapping: NATMapping): Promise<boolean> {
    console.log("🧪 Testing address-dependent filtering...");
    return Math.random() > 0.6; // Fewer NATs allow this
  }
  
  /**
   * Test filtering from different source port
   */ 
  private async testFromDifferentPort(mapping: NATMapping): Promise<boolean> {
    console.log("🧪 Testing port-dependent filtering...");
    return Math.random() > 0.8; // Even fewer NATs allow this
  }
  
  /**
   * Create UDP socket helper (browser/Node.js abstraction)
   */
  private createUDPSocket(port: number): any {
    // In browser: would use WebRTC DataChannels or fetch to STUN
    // In Node.js: would use dgram module
    console.log(\`📡 Creating UDP socket on port \${port}\`);
    return { port };
  }
  
  /**
   * Generate comprehensive NAT behavior report
   */
  async generateNATReport(): Promise<string> {
    const mappingBehavior = await this.detectMappingBehavior();
    const filteringBehavior = await this.detectFilteringBehavior();
    
    let p2pCompatibility = "Unknown";
    let tailscaleEffectiveness = "Unknown";
    
    // Determine P2P compatibility based on behavior combination
    if (mappingBehavior === MappingBehavior.ENDPOINT_INDEPENDENT && 
        filteringBehavior === FilteringBehavior.ENDPOINT_INDEPENDENT) {
      p2pCompatibility = "Excellent";
      tailscaleEffectiveness = "Direct connections work reliably";
    } else if (mappingBehavior === MappingBehavior.ENDPOINT_INDEPENDENT) {
      p2pCompatibility = "Good";  
      tailscaleEffectiveness = "Direct connections with coordination";
    } else {
      p2pCompatibility = "Challenging";
      tailscaleEffectiveness = "May require DERP relay servers";
    }
    
    return \`
🔍 NAT Behavior Analysis Report
=====================================

📍 Mapping Behavior: \${mappingBehavior}
🔒 Filtering Behavior: \${filteringBehavior}

🎯 P2P Compatibility: \${p2pCompatibility}
🚀 Tailscale Effectiveness: \${tailscaleEffectiveness}

📊 Discovered Mappings:
\${this.mappings.map(m => 
  \`   • \${m.server}: \${m.internal.address}:\${m.internal.port} -> \${m.external.address}:\${m.external.port}\`
).join('\\n')}

💡 Recommendations:
\${this.generateRecommendations(mappingBehavior, filteringBehavior)}
    \`.trim();
  }
  
  /**
   * Generate specific recommendations based on detected NAT behavior
   */
  private generateRecommendations(mapping: MappingBehavior, filtering: FilteringBehavior): string {
    const recommendations = [];
    
    if (mapping !== MappingBehavior.ENDPOINT_INDEPENDENT) {
      recommendations.push("• Consider upgrading router firmware for better NAT behavior");
      recommendations.push("• Enable UPnP/NAT-PMP if available for port mapping control");
    }
    
    if (filtering === FilteringBehavior.ADDRESS_PORT_DEPENDENT) {
      recommendations.push("• Applications will rely heavily on relay servers (TURN/DERP)");
      recommendations.push("• Consider DMZ or port forwarding for critical P2P applications");
    }
    
    if (mapping === MappingBehavior.ENDPOINT_INDEPENDENT && 
        filtering === FilteringBehavior.ENDPOINT_INDEPENDENT) {
      recommendations.push("• Excellent NAT configuration for P2P applications");
      recommendations.push("• Tailscale should establish direct connections reliably");
      recommendations.push("• WebRTC and gaming applications should work well");
    }
    
    return recommendations.join('\\n   ') || "• Current NAT configuration is suitable for most applications";
  }
}

// Usage Example: Detect your NAT's behavior
async function analyzeMyNAT() {
  console.log("🚀 Starting NAT Behavior Analysis...");
  console.log("This helps understand why some P2P connections work better than others!");
  
  const detector = new NATBehaviorDetector();
  
  try {
    const report = await detector.generateNATReport();
    console.log(report);
    
    console.log("\\n🎓 Understanding Your Results:");
    console.log("• Endpoint-Independent = Best for P2P (Tailscale magic!)");
    console.log("• Address-Dependent = Requires coordination (STUN/ICE)");  
    console.log("• Address/Port-Dependent = Challenging (needs TURN/DERP)");
    
  } catch (error) {
    console.error("❌ NAT analysis failed:", error.message);
    console.log("💡 This might indicate a very restrictive firewall/NAT");
  }
}

// Export for use in other modules
export { NATBehaviorDetector, MappingBehavior, FilteringBehavior };
`;

export default { getCodeExample };