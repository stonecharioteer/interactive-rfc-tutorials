export const getCodeExample = () => `
/**
 * RFC 4364: BGP/MPLS IP VPN Route Processing Implementation
 * 
 * This example demonstrates how PE routers process customer routes,
 * apply VRF policies, and exchange VPN routes via MP-BGP according
 * to RFC 4364 specifications.
 */

interface RouteDistinguisher {
  type: 0 | 1 | 2;
  value: string; // Format: "ASN:nn" or "IP:nn"
}

interface RouteTarget {
  type: 'import' | 'export' | 'both';
  value: string; // Format: "ASN:nn"
}

interface VPNv4Route {
  rd: RouteDistinguisher;
  prefix: string;
  nextHop: string;
  routeTargets: RouteTarget[];
  mpls_label: number;
  localPref?: number;
  med?: number;
}

interface VRFConfig {
  name: string;
  rd: RouteDistinguisher;
  importTargets: string[];
  exportTargets: string[];
  routingTable: Map<string, VPNv4Route>;
}

interface CustomerRoute {
  prefix: string;
  nextHop: string;
  protocol: 'bgp' | 'static' | 'ospf' | 'eigrp';
  adminDistance: number;
}

class BGPMPLSVPNProcessor {
  private vrfs = new Map<string, VRFConfig>();
  private labelPool = new Set<number>();
  private mpBgpPeers = new Map<string, any>();
  private globalRouteTable = new Map<string, VPNv4Route>();
  
  constructor(private routerId: string, private asn: number) {
    this.initializeLabelPool();
    console.log(\`🚀 BGP/MPLS VPN PE Router initialized: \${routerId} (AS \${asn})\`);
  }
  
  /**
   * Phase 1: VRF Configuration and Customer Onboarding
   * 
   * Creates isolated routing instances for each customer with
   * appropriate route distinguishers and route targets
   */
  createCustomerVRF(
    customerName: string, 
    rdValue: string, 
    importTargets: string[], 
    exportTargets: string[]
  ): void {
    console.log(\`\\n📝 Creating VRF for customer: \${customerName}\`);
    
    const rd: RouteDistinguisher = {
      type: 0, // ASN:nn format
      value: rdValue
    };
    
    const vrf: VRFConfig = {
      name: customerName,
      rd: rd,
      importTargets: importTargets,
      exportTargets: exportTargets,
      routingTable: new Map()
    };
    
    this.vrfs.set(customerName, vrf);
    
    console.log(\`✅ VRF '\${customerName}' created:\`);
    console.log(\`   📍 Route Distinguisher: \${rd.value}\`);
    console.log(\`   📥 Import Targets: [\${importTargets.join(', ')}]\`);
    console.log(\`   📤 Export Targets: [\${exportTargets.join(', ')}]\`);
    
    // Simulate route target validation
    this.validateRouteTargets(importTargets.concat(exportTargets));
  }
  
  /**
   * Phase 2: Customer Route Import from CE Router
   * 
   * Receives routes from customer equipment and imports them
   * into appropriate VRF with security validation
   */
  importCustomerRoute(
    vrfName: string, 
    customerRoute: CustomerRoute,
    ceRouterId: string
  ): boolean {
    console.log(\`\\n📥 Importing customer route into VRF '\${vrfName}':\`);
    console.log(\`   🛣️  Prefix: \${customerRoute.prefix}\`);
    console.log(\`   📍 Next-hop: \${customerRoute.nextHop}\`);
    console.log(\`   🔧 Protocol: \${customerRoute.protocol}\`);
    
    const vrf = this.vrfs.get(vrfName);
    if (!vrf) {
      console.error(\`❌ VRF '\${vrfName}' not found\`);
      return false;
    }
    
    // Security: Validate CE router authentication (simplified)
    if (!this.validateCEAuthentication(ceRouterId, vrfName)) {
      console.error(\`🔒 CE router authentication failed for \${ceRouterId}\`);
      return false;
    }
    
    // Allocate MPLS label for this route
    const mplsLabel = this.allocateMPLSLabel();
    if (!mplsLabel) {
      console.error(\`❌ Failed to allocate MPLS label\`);
      return false;
    }
    
    // Create VPNv4 route with RD prepended
    const vpnv4Route: VPNv4Route = {
      rd: vrf.rd,
      prefix: customerRoute.prefix,
      nextHop: this.routerId, // PE router becomes next-hop
      routeTargets: vrf.exportTargets.map(rt => ({ type: 'export' as const, value: rt })),
      mpls_label: mplsLabel,
      localPref: this.calculateLocalPreference(customerRoute),
      med: 0
    };
    
    // Install in VRF routing table
    vrf.routingTable.set(customerRoute.prefix, vpnv4Route);
    
    console.log(\`✅ Route imported successfully:\`);
    console.log(\`   🏷️  VPNv4 Route: \${vrf.rd.value}:\${customerRoute.prefix}\`);
    console.log(\`   🔖 MPLS Label: \${mplsLabel}\`);
    console.log(\`   🎯 Export Targets: [\${vrf.exportTargets.join(', ')}]\`);
    
    // Advertise to MP-BGP peers
    this.advertiseMPBGPRoute(vpnv4Route);
    
    return true;
  }
  
  /**
   * Phase 3: MP-BGP VPNv4 Route Advertisement
   * 
   * Distributes customer routes to other PE routers with
   * appropriate route targets and MPLS labels
   */
  private advertiseMPBGPRoute(route: VPNv4Route): void {
    console.log(\`\\n📡 Advertising VPNv4 route via MP-BGP:\`);
    console.log(\`   🛣️  Route: \${route.rd.value}:\${route.prefix}\`);
    console.log(\`   📍 Next-hop: \${route.nextHop}\`);
    console.log(\`   🏷️  MPLS Label: \${route.mpls_label}\`);
    
    // Add to global RIB for MP-BGP distribution
    const globalKey = \`\${route.rd.value}:\${route.prefix}\`;
    this.globalRouteTable.set(globalKey, route);
    
    // Send to all MP-BGP peers
    for (const [peerAddress, peer] of this.mpBgpPeers) {
      try {
        this.sendMPBGPUpdate(peer, route);
        console.log(\`   ✅ Sent to MP-BGP peer: \${peerAddress}\`);
      } catch (error) {
        console.warn(\`   ⚠️  Failed to send to peer \${peerAddress}: \${error.message}\`);
      }
    }
  }
  
  /**
   * Phase 4: MP-BGP VPNv4 Route Reception
   * 
   * Receives VPN routes from other PE routers and imports
   * them into appropriate VRFs based on route target policies
   */
  receiveMPBGPRoute(route: VPNv4Route, fromPeer: string): void {
    console.log(\`\\n📨 Received VPNv4 route from MP-BGP peer \${fromPeer}:\`);
    console.log(\`   🛣️  Route: \${route.rd.value}:\${route.prefix}\`);
    console.log(\`   📍 Next-hop: \${route.nextHop}\`);
    console.log(\`   🏷️  MPLS Label: \${route.mpls_label}\`);
    console.log(\`   🎯 Route Targets: [\${route.routeTargets.map(rt => rt.value).join(', ')}]\`);
    
    // Check which VRFs should import this route
    const importingVRFs = this.findImportingVRFs(route.routeTargets);
    
    if (importingVRFs.length === 0) {
      console.log(\`   ℹ️  No VRFs configured to import this route\`);
      return;
    }
    
    // Import into matching VRFs
    for (const vrfName of importingVRFs) {
      const vrf = this.vrfs.get(vrfName);
      if (vrf) {
        console.log(\`   📥 Importing into VRF '\${vrfName}'\`);
        
        // Install in VRF routing table
        vrf.routingTable.set(route.prefix, route);
        
        // If CE router exists, advertise the route
        this.advertiseToCE(vrfName, route);
      }
    }
  }
  
  /**
   * Phase 5: Customer Traffic Forwarding (Data Plane)
   * 
   * Processes customer IP packets and forwards them through
   * MPLS tunnels with appropriate label stacks
   */
  forwardCustomerTraffic(
    vrfName: string, 
    destIP: string, 
    sourcePacket: any
  ): boolean {
    console.log(\`\\n📦 Forwarding customer traffic in VRF '\${vrfName}':\`);
    console.log(\`   🎯 Destination: \${destIP}\`);
    
    const vrf = this.vrfs.get(vrfName);
    if (!vrf) {
      console.error(\`❌ VRF '\${vrfName}' not found\`);
      return false;
    }
    
    // Longest prefix match in VRF routing table
    const route = this.longestPrefixMatch(vrf.routingTable, destIP);
    if (!route) {
      console.log(\`   ❌ No route found for \${destIP} in VRF '\${vrfName}'\`);
      return false;
    }
    
    console.log(\`   ✅ Route found: \${route.prefix} via \${route.nextHop}\`);
    console.log(\`   🏷️  VPN Label: \${route.mpls_label}\`);
    
    // Build MPLS label stack
    const labelStack = this.buildLabelStack(route);
    
    console.log(\`   📚 MPLS Label Stack:\`);
    labelStack.forEach((label, index) => {
      const labelType = index === 0 ? 'Transport (LDP)' : 'VPN';
      console.log(\`      [\${index}] \${label} (\${labelType})\`);
    });
    
    // Forward with MPLS encapsulation
    const mplsPacket = this.encapsulateMPLS(sourcePacket, labelStack);
    const success = this.forwardMPLSPacket(mplsPacket, route.nextHop);
    
    if (success) {
      console.log(\`   ✅ Packet forwarded successfully to \${route.nextHop}\`);
    } else {
      console.error(\`   ❌ Failed to forward packet\`);
    }
    
    return success;
  }
  
  /**
   * Utility: Find VRFs that should import routes with given route targets
   */
  private findImportingVRFs(routeTargets: RouteTarget[]): string[] {
    const importingVRFs: string[] = [];
    
    for (const [vrfName, vrf] of this.vrfs) {
      // Check if any route target matches VRF import policy
      const shouldImport = routeTargets.some(rt => 
        vrf.importTargets.includes(rt.value)
      );
      
      if (shouldImport) {
        importingVRFs.push(vrfName);
      }
    }
    
    return importingVRFs;
  }
  
  /**
   * Utility: Perform longest prefix match in VRF routing table
   */
  private longestPrefixMatch(
    routingTable: Map<string, VPNv4Route>, 
    destIP: string
  ): VPNv4Route | null {
    let bestMatch: VPNv4Route | null = null;
    let longestPrefixLength = -1;
    
    for (const [prefix, route] of routingTable) {
      if (this.isIPInPrefix(destIP, route.prefix)) {
        const prefixLength = this.getPrefixLength(route.prefix);
        if (prefixLength > longestPrefixLength) {
          longestPrefixLength = prefixLength;
          bestMatch = route;
        }
      }
    }
    
    return bestMatch;
  }
  
  /**
   * Utility: Build MPLS label stack for VPN forwarding
   */
  private buildLabelStack(route: VPNv4Route): number[] {
    // In real implementation, would lookup LSP to next-hop PE
    const transportLabel = this.getLSPLabel(route.nextHop);
    const vpnLabel = route.mpls_label;
    
    return [transportLabel, vpnLabel];
  }
  
  /**
   * Utility: Validate route targets against configured policies
   */
  private validateRouteTargets(routeTargets: string[]): boolean {
    console.log(\`   🔍 Validating route targets...\`);
    
    for (const rt of routeTargets) {
      // Validate format (ASN:nn)
      if (!/^\\d+:\\d+$/.test(rt)) {
        console.error(\`   ❌ Invalid route target format: \${rt}\`);
        return false;
      }
      
      // Check authorization (simplified - would check against policy)
      const [asn, value] = rt.split(':');
      if (parseInt(asn) !== this.asn && !this.isAuthorizedExternalRT(rt)) {
        console.warn(\`   ⚠️  External route target requires authorization: \${rt}\`);
      }
    }
    
    console.log(\`   ✅ Route targets validated\`);
    return true;
  }
  
  /**
   * Generate comprehensive VPN status report
   */
  generateVPNStatusReport(): string {
    const vrfCount = this.vrfs.size;
    const totalRoutes = Array.from(this.vrfs.values())
      .reduce((sum, vrf) => sum + vrf.routingTable.size, 0);
    const labelsAllocated = 10000 - this.labelPool.size; // Assuming pool starts at 10000
    
    let report = \`
🔍 BGP/MPLS VPN PE Router Status Report
=====================================

📍 Router ID: \${this.routerId}
🏢 AS Number: \${this.asn}

📊 VPN Statistics:
   • Customer VRFs: \${vrfCount}
   • Total VPN Routes: \${totalRoutes}
   • MPLS Labels Allocated: \${labelsAllocated}
   • MP-BGP Peers: \${this.mpBgpPeers.size}

📋 Customer VRFs:
\`;
    
    for (const [name, vrf] of this.vrfs) {
      report += \`
   • \${name}:
     - RD: \${vrf.rd.value}
     - Import RTs: [\${vrf.importTargets.join(', ')}]
     - Export RTs: [\${vrf.exportTargets.join(', ')}]
     - Routes: \${vrf.routingTable.size}
\`;
    }
    
    report += \`
💡 RFC 4364 Implementation Features:
   ✅ Route Distinguisher isolation
   ✅ Route Target policy enforcement
   ✅ MP-BGP VPNv4 route exchange
   ✅ Two-level MPLS label stack
   ✅ PE-CE authentication
   ✅ VRF route leaking prevention
    \`;
    
    return report.trim();
  }
  
  // Helper methods (simplified implementations)
  
  private initializeLabelPool(): void {
    // Initialize with label range 1000-10000
    for (let i = 1000; i <= 10000; i++) {
      this.labelPool.add(i);
    }
  }
  
  private allocateMPLSLabel(): number | null {
    if (this.labelPool.size === 0) return null;
    
    const label = Array.from(this.labelPool)[0];
    this.labelPool.delete(label);
    return label;
  }
  
  private validateCEAuthentication(ceRouterId: string, vrfName: string): boolean {
    // Simplified authentication check
    console.log(\`   🔐 Validating CE router \${ceRouterId} for VRF \${vrfName}\`);
    return true; // In reality, would check MD5/KeyChain authentication
  }
  
  private calculateLocalPreference(route: CustomerRoute): number {
    // Route preference based on protocol and policy
    const preferences = {
      'bgp': 100,
      'static': 200,
      'ospf': 110,
      'eigrp': 90
    };
    return preferences[route.protocol] || 100;
  }
  
  private sendMPBGPUpdate(peer: any, route: VPNv4Route): void {
    // Simulate MP-BGP UPDATE message
    console.log(\`   📤 MP-BGP UPDATE: VPNv4 AFI/SAFI with route \${route.rd.value}:\${route.prefix}\`);
  }
  
  private advertiseToCE(vrfName: string, route: VPNv4Route): void {
    console.log(\`   📤 Advertising \${route.prefix} to CE router in VRF \${vrfName}\`);
  }
  
  private getLSPLabel(nextHop: string): number {
    // Simulate LDP label lookup for LSP to next-hop PE
    return 3000 + Math.floor(Math.random() * 1000);
  }
  
  private isIPInPrefix(ip: string, prefix: string): boolean {
    // Simplified IP prefix matching
    const [network, mask] = prefix.split('/');
    return ip.startsWith(network.split('.').slice(0, parseInt(mask) / 8).join('.'));
  }
  
  private getPrefixLength(prefix: string): number {
    return parseInt(prefix.split('/')[1]);
  }
  
  private encapsulateMPLS(packet: any, labelStack: number[]): any {
    return { originalPacket: packet, labels: labelStack };
  }
  
  private forwardMPLSPacket(packet: any, nextHop: string): boolean {
    console.log(\`   🚀 Forwarding MPLS packet to \${nextHop}\`);
    return true;
  }
  
  private isAuthorizedExternalRT(rt: string): boolean {
    // Check if external route target is authorized
    return false; // Simplified - would check policy database
  }
}

// Usage Example: Service Provider MPLS Network
async function demonstrateBGPMPLSVPN() {
  console.log("🚀 RFC 4364 BGP/MPLS IP VPN Demonstration");
  console.log("This shows how service providers deliver enterprise VPN services!");
  
  // Create PE routers
  const pe1 = new BGPMPLSVPNProcessor("10.0.0.1", 65001);
  const pe2 = new BGPMPLSVPNProcessor("10.0.0.2", 65001);
  
  // Configure customer VRFs on both PE routers
  console.log("\\n=== Customer Onboarding ===");
  
  // Enterprise customer with hub-and-spoke topology
  pe1.createCustomerVRF("acme-corp", "65001:100", ["65001:100"], ["65001:1"]);
  pe2.createCustomerVRF("acme-corp", "65001:100", ["65001:1"], ["65001:100"]);
  
  // Multi-tenant customer with any-to-any connectivity
  pe1.createCustomerVRF("globex-ltd", "65001:200", ["65001:200"], ["65001:200"]);
  pe2.createCustomerVRF("globex-ltd", "65001:200", ["65001:200"], ["65001:200"]);
  
  console.log("\\n=== Route Import and Processing ===");
  
  // Import customer routes from CE routers
  const acmeHQRoute: CustomerRoute = {
    prefix: "192.168.1.0/24",
    nextHop: "192.168.100.1", // CE router
    protocol: "bgp",
    adminDistance: 20
  };
  
  const acmeBranchRoute: CustomerRoute = {
    prefix: "192.168.2.0/24", 
    nextHop: "192.168.200.1", // CE router
    protocol: "static",
    adminDistance: 1
  };
  
  pe1.importCustomerRoute("acme-corp", acmeHQRoute, "ce-hq-01");
  pe2.importCustomerRoute("acme-corp", acmeBranchRoute, "ce-branch-01");
  
  console.log("\\n=== Traffic Forwarding Simulation ===");
  
  // Simulate customer traffic forwarding
  pe2.forwardCustomerTraffic("acme-corp", "192.168.1.100", { 
    src: "192.168.2.10", 
    dst: "192.168.1.100", 
    payload: "Enterprise application data" 
  });
  
  console.log("\\n=== Status Reports ===");
  console.log(pe1.generateVPNStatusReport());
  console.log("\\n" + pe2.generateVPNStatusReport());
  
  console.log("\\n🎓 Key RFC 4364 Concepts Demonstrated:");
  console.log("• Route Distinguishers create unique VPNv4 routes");
  console.log("• Route Targets control VPN topology and reachability");
  console.log("• MP-BGP distributes VPN routes between PE routers");
  console.log("• Two-level MPLS labels enable scalable VPN forwarding");
  console.log("• VRF isolation provides secure multi-tenancy");
  
  console.log("\\n💼 This is how enterprises connect globally:");
  console.log("• 95% of Fortune 500 companies use MPLS VPN services");
  console.log("• Service providers operate thousands of PE routers");
  console.log("• Millions of enterprise sites connected via BGP/MPLS VPNs");
  console.log("• Foundation for cloud connectivity (AWS Direct Connect, etc.)");
}

// Export for use in other modules
export { BGPMPLSVPNProcessor, type VRFConfig, type VPNv4Route, type CustomerRoute };
`;

export default { getCodeExample };