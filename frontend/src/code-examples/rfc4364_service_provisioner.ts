export const getCodeExample = () => `
/**
 * RFC 4364: Enterprise VPN Service Provisioning System
 * 
 * This example demonstrates how service providers automate the
 * provisioning of BGP/MPLS IP VPN services for enterprise customers,
 * implementing the operational procedures defined in RFC 4364.
 */

interface CustomerSite {
  siteId: string;
  siteName: string;
  peRouter: string;
  ceRouter: string;
  connectivity: 'hub' | 'spoke' | 'any-to-any' | 'extranet';
  bandwidth: string;
  sla: {
    uptime: number; // percentage
    latency: number; // ms
    jitter: number; // ms
    packetLoss: number; // percentage
  };
  ipAddressing: {
    customerSubnets: string[];
    peceLink: string;
  };
}

interface VPNService {
  serviceId: string;
  customerName: string;
  serviceName: string;
  topology: 'hub-spoke' | 'any-to-any' | 'extranet';
  sites: CustomerSite[];
  routingProtocol: 'bgp' | 'static' | 'ospf' | 'eigrp';
  qosPolicy: string;
  securityPolicy: string;
  routeTargets: {
    hubExport?: string[];
    spokeImport?: string[];
    anyToAny?: string[];
  };
  status: 'planning' | 'provisioning' | 'active' | 'maintenance' | 'decommissioned';
}

interface ProvisioningTemplate {
  vrfConfig: string;
  bgpConfig: string;
  qosConfig: string;
  securityConfig: string;
}

class EnterpriseVPNServiceProvisioner {
  private services = new Map<string, VPNService>();
  private peRouters = new Map<string, any>();
  private rtPool = new Set<string>();
  private rdPool = new Set<string>();
  
  constructor(private providerASN: number) {
    this.initializeResourcePools();
    console.log(\`🏢 Enterprise VPN Service Provisioner initialized for AS \${providerASN}\`);
  }
  
  /**
   * Phase 1: Service Design and Planning
   * 
   * Analyzes customer requirements and designs appropriate VPN topology
   * with optimal route target and route distinguisher allocation
   */
  async designVPNService(
    customerName: string,
    requirements: {
      sites: Omit<CustomerSite, 'siteId'>[];
      topology: 'hub-spoke' | 'any-to-any' | 'extranet';
      sla: CustomerSite['sla'];
      bandwidth: string;
      routing: 'bgp' | 'static' | 'ospf' | 'eigrp';
    }
  ): Promise<VPNService> {
    console.log(\`\\n📋 Designing VPN service for customer: \${customerName}\`);
    console.log(\`   🌐 Topology: \${requirements.topology}\`);
    console.log(\`   📍 Sites: \${requirements.sites.length}\`);
    console.log(\`   🔧 Routing: \${requirements.routing}\`);
    
    const serviceId = this.generateServiceId(customerName);
    
    // Allocate resource pools
    const routeTargets = this.allocateRouteTargets(requirements.topology, requirements.sites.length);
    const routeDistinguisher = this.allocateRouteDistinguisher(customerName);
    
    // Assign PE routers to sites based on location and capacity
    const sitesWithAssignments = await this.assignPERouters(requirements.sites);
    
    const vpnService: VPNService = {
      serviceId,
      customerName,
      serviceName: \`\${customerName}-MPLS-VPN\`,
      topology: requirements.topology,
      sites: sitesWithAssignments,
      routingProtocol: requirements.routing,
      qosPolicy: this.selectQoSPolicy(requirements.sla),
      securityPolicy: this.selectSecurityPolicy(customerName),
      routeTargets,
      status: 'planning'
    };
    
    this.services.set(serviceId, vpnService);
    
    console.log(\`✅ VPN service designed successfully:\`);
    console.log(\`   🆔 Service ID: \${serviceId}\`);
    console.log(\`   🎯 Route Targets: \${JSON.stringify(routeTargets, null, 6)}\`);
    console.log(\`   📊 SLA: \${requirements.sla.uptime}% uptime, \${requirements.sla.latency}ms latency\`);
    
    return vpnService;
  }
  
  /**
   * Phase 2: Automated Configuration Generation
   * 
   * Generates router configurations for all PE routers based on
   * RFC 4364 best practices and customer requirements
   */
  async generateConfigurations(serviceId: string): Promise<Map<string, ProvisioningTemplate>> {
    console.log(\`\\n⚙️  Generating configurations for service: \${serviceId}\`);
    
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(\`Service \${serviceId} not found\`);
    }
    
    const configurations = new Map<string, ProvisioningTemplate>();
    
    for (const site of service.sites) {
      console.log(\`   🔧 Generating config for \${site.siteName} on \${site.peRouter}\`);
      
      const template = await this.generateSiteConfiguration(service, site);
      configurations.set(site.peRouter, template);
      
      console.log(\`   ✅ Configuration generated for \${site.peRouter}\`);
    }
    
    console.log(\`✅ All configurations generated successfully\`);
    return configurations;
  }
  
  /**
   * Phase 3: Service Provisioning and Deployment
   * 
   * Deploys configurations to PE routers and activates the VPN service
   * with comprehensive validation and rollback capabilities
   */
  async provisionVPNService(serviceId: string): Promise<boolean> {
    console.log(\`\\n🚀 Provisioning VPN service: \${serviceId}\`);
    
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(\`Service \${serviceId} not found\`);
    }
    
    service.status = 'provisioning';
    
    try {
      // Generate configurations
      const configurations = await this.generateConfigurations(serviceId);
      
      // Deploy to PE routers
      const deploymentResults = await this.deployConfigurations(configurations);
      
      // Validate service connectivity
      const validationResults = await this.validateServiceConnectivity(service);
      
      if (deploymentResults.success && validationResults.success) {
        service.status = 'active';
        console.log(\`✅ VPN service \${serviceId} provisioned successfully!\`);
        
        // Generate service documentation
        await this.generateServiceDocumentation(service);
        
        return true;
      } else {
        console.error(\`❌ Provisioning failed for \${serviceId}\`);
        
        // Rollback changes
        await this.rollbackService(serviceId);
        service.status = 'planning';
        
        return false;
      }
      
    } catch (error) {
      console.error(\`❌ Provisioning error: \${error.message}\`);
      service.status = 'planning';
      return false;
    }
  }
  
  /**
   * Generate site-specific configuration based on topology and requirements
   */
  private async generateSiteConfiguration(
    service: VPNService, 
    site: CustomerSite
  ): Promise<ProvisioningTemplate> {
    
    const vrfName = \`\${service.customerName}-\${site.siteId}\`.replace(/[^a-zA-Z0-9-]/g, '-');
    const rd = this.rdPool.values().next().value; // Get assigned RD
    
    // Generate VRF configuration
    const vrfConfig = this.generateVRFConfig(vrfName, rd, service, site);
    
    // Generate BGP configuration  
    const bgpConfig = this.generateBGPConfig(service, site);
    
    // Generate QoS configuration
    const qosConfig = this.generateQoSConfig(service.qosPolicy, site.bandwidth);
    
    // Generate security configuration
    const securityConfig = this.generateSecurityConfig(service.securityPolicy);
    
    return {
      vrfConfig,
      bgpConfig,
      qosConfig,
      securityConfig
    };
  }
  
  /**
   * Generate VRF configuration following RFC 4364 specifications
   */
  private generateVRFConfig(
    vrfName: string, 
    rd: string, 
    service: VPNService, 
    site: CustomerSite
  ): string {
    
    let importRTs: string[] = [];
    let exportRTs: string[] = [];
    
    // Configure route targets based on topology
    switch (service.topology) {
      case 'hub-spoke':
        if (site.connectivity === 'hub') {
          importRTs = service.routeTargets.spokeImport || [];
          exportRTs = service.routeTargets.hubExport || [];
        } else {
          importRTs = service.routeTargets.hubExport || [];
          exportRTs = service.routeTargets.spokeImport || [];
        }
        break;
        
      case 'any-to-any':
        importRTs = exportRTs = service.routeTargets.anyToAny || [];
        break;
        
      case 'extranet':
        // Complex extranet logic would go here
        importRTs = exportRTs = service.routeTargets.anyToAny || [];
        break;
    }
    
    return \`
! RFC 4364 BGP/MPLS IP VPN Configuration
! Customer: \${service.customerName}
! Site: \${site.siteName}
! Generated: \${new Date().toISOString()}

ip vrf \${vrfName}
 rd \${rd}
 route-target import \${importRTs.join(' ')}
 route-target export \${exportRTs.join(' ')}
 maximum routes 10000 80
 !
interface GigabitEthernet0/0/1
 description CE-\${site.siteName}-\${site.ceRouter}
 ip vrf forwarding \${vrfName}
 ip address \${site.ipAddressing.peceLink.split('/')[0]} 255.255.255.252
 no shutdown
 !
    \`.trim();
  }
  
  /**
   * Generate BGP configuration for PE-CE routing
   */
  private generateBGPConfig(service: VPNService, site: CustomerSite): string {
    const vrfName = \`\${service.customerName}-\${site.siteId}\`.replace(/[^a-zA-Z0-9-]/g, '-');
    
    let bgpConfig = \`
router bgp \${this.providerASN}
 !
 address-family ipv4 vrf \${vrfName}
\`;
    
    if (service.routingProtocol === 'bgp') {
      const ceASN = 65000 + Math.floor(Math.random() * 1000); // Simplified
      
      bgpConfig += \`
  neighbor \${site.ipAddressing.peceLink.split('/')[0].replace(/\\d+$/, '2')} remote-as \${ceASN}
  neighbor \${site.ipAddressing.peceLink.split('/')[0].replace(/\\d+$/, '2')} activate
  neighbor \${site.ipAddressing.peceLink.split('/')[0].replace(/\\d+$/, '2')} as-override
  neighbor \${site.ipAddressing.peceLink.split('/')[0].replace(/\\d+$/, '2')} send-community extended
  neighbor \${site.ipAddressing.peceLink.split('/')[0].replace(/\\d+$/, '2')} route-map RM-\${site.siteId}-IN in
  neighbor \${site.ipAddressing.peceLink.split('/')[0].replace(/\\d+$/, '2')} route-map RM-\${site.siteId}-OUT out
\`;
    } else if (service.routingProtocol === 'static') {
      site.ipAddressing.customerSubnets.forEach(subnet => {
        bgpConfig += \`
  network \${subnet}
\`;
      });
    }
    
    bgpConfig += \`
  redistribute connected
  maximum-paths 4
  exit-address-family
 !
\`;
    
    return bgpConfig;
  }
  
  /**
   * Generate QoS configuration based on SLA requirements
   */
  private generateQoSConfig(qosPolicy: string, bandwidth: string): string {
    return \`
! QoS Policy: \${qosPolicy}
! Bandwidth: \${bandwidth}

class-map match-any VOICE
 match dscp ef
 match dscp cs5
!
class-map match-any VIDEO
 match dscp af41
 match dscp af42
 match dscp af43
!
class-map match-any BUSINESS-DATA
 match dscp af21
 match dscp af22
 match dscp af23
!
policy-map \${qosPolicy}
 class VOICE
  priority percent 20
 class VIDEO
  bandwidth percent 30
 class BUSINESS-DATA
  bandwidth percent 40
 class class-default
  bandwidth percent 10
  random-detect
!
\`.trim();
  }
  
  /**
   * Allocate route targets based on VPN topology
   */
  private allocateRouteTargets(
    topology: string, 
    siteCount: number
  ): VPNService['routeTargets'] {
    
    const baseRT = this.rtPool.values().next().value;
    const [asn, base] = baseRT.split(':');
    const baseNum = parseInt(base);
    
    switch (topology) {
      case 'hub-spoke':
        return {
          hubExport: [\`\${asn}:\${baseNum}\`],
          spokeImport: [\`\${asn}:\${baseNum + 1}\`]
        };
        
      case 'any-to-any':
        return {
          anyToAny: [\`\${asn}:\${baseNum}\`]
        };
        
      case 'extranet':
        return {
          anyToAny: [\`\${asn}:\${baseNum}\`, \`\${asn}:\${baseNum + 1}\`]
        };
        
      default:
        return { anyToAny: [\`\${asn}:\${baseNum}\`] };
    }
  }
  
  /**
   * Deploy configurations to PE routers with validation
   */
  private async deployConfigurations(
    configurations: Map<string, ProvisioningTemplate>
  ): Promise<{ success: boolean; results: Map<string, boolean> }> {
    
    console.log(\`   🚀 Deploying configurations to \${configurations.size} PE routers\`);
    
    const results = new Map<string, boolean>();
    let overallSuccess = true;
    
    for (const [peRouter, template] of configurations) {
      try {
        console.log(\`   📤 Deploying to \${peRouter}...\`);
        
        // Simulate configuration deployment
        await this.deployToPERouter(peRouter, template);
        
        console.log(\`   ✅ Successfully deployed to \${peRouter}\`);
        results.set(peRouter, true);
        
      } catch (error) {
        console.error(\`   ❌ Failed to deploy to \${peRouter}: \${error.message}\`);
        results.set(peRouter, false);
        overallSuccess = false;
      }
    }
    
    return { success: overallSuccess, results };
  }
  
  /**
   * Validate end-to-end service connectivity
   */
  private async validateServiceConnectivity(
    service: VPNService
  ): Promise<{ success: boolean; details: string[] }> {
    
    console.log(\`   🔍 Validating service connectivity for \${service.serviceId}\`);
    
    const validationResults: string[] = [];
    let allTestsPass = true;
    
    // Test 1: VRF creation and route target assignment
    for (const site of service.sites) {
      const vrfExists = await this.validateVRFExists(site.peRouter, service.customerName);
      if (vrfExists) {
        validationResults.push(\`✅ VRF exists on \${site.peRouter} for \${site.siteName}\`);
      } else {
        validationResults.push(\`❌ VRF missing on \${site.peRouter} for \${site.siteName}\`);
        allTestsPass = false;
      }
    }
    
    // Test 2: MP-BGP route exchange
    const routeExchangeWorking = await this.validateMPBGPRouteExchange(service);
    if (routeExchangeWorking) {
      validationResults.push(\`✅ MP-BGP route exchange working\`);
    } else {
      validationResults.push(\`❌ MP-BGP route exchange failed\`);
      allTestsPass = false;
    }
    
    // Test 3: End-to-end connectivity
    const connectivityTest = await this.testEndToEndConnectivity(service);
    if (connectivityTest) {
      validationResults.push(\`✅ End-to-end connectivity verified\`);
    } else {
      validationResults.push(\`❌ End-to-end connectivity failed\`);
      allTestsPass = false;
    }
    
    // Test 4: SLA compliance
    const slaCompliance = await this.validateSLACompliance(service);
    if (slaCompliance) {
      validationResults.push(\`✅ SLA requirements met\`);
    } else {
      validationResults.push(\`⚠️  SLA requirements not fully met\`);
    }
    
    return { success: allTestsPass, details: validationResults };
  }
  
  /**
   * Generate service summary report
   */
  generateServiceReport(serviceId: string): string {
    const service = this.services.get(serviceId);
    if (!service) {
      return "Service not found";
    }
    
    return \`
🔍 Enterprise VPN Service Report
===============================

🆔 Service Details:
   • Service ID: \${service.serviceId}
   • Customer: \${service.customerName}
   • Service Name: \${service.serviceName}
   • Status: \${service.status.toUpperCase()}
   • Topology: \${service.topology}

🏢 Sites (\${service.sites.length}):
\${service.sites.map(site => 
  \`   • \${site.siteName} (\${site.connectivity})\\n     - PE Router: \${site.peRouter}\\n     - Subnets: \${site.ipAddressing.customerSubnets.join(', ')}\`
).join('\\n')}

🎯 Route Targets:
\${JSON.stringify(service.routeTargets, null, 3)}

📊 SLA Commitments:
   • Uptime: \${service.sites[0]?.sla.uptime}%
   • Latency: <\${service.sites[0]?.sla.latency}ms
   • Packet Loss: <\${service.sites[0]?.sla.packetLoss}%

💡 RFC 4364 Features Implemented:
   ✅ BGP/MPLS IP VPN architecture
   ✅ VRF isolation and route target policies  
   ✅ MP-BGP VPNv4 route distribution
   ✅ Two-level MPLS label forwarding
   ✅ QoS and SLA enforcement
   ✅ Enterprise-grade security
    \`.trim();
  }
  
  // Helper methods (simplified implementations)
  
  private initializeResourcePools(): void {
    // Initialize route target pool
    for (let i = 1; i <= 1000; i++) {
      this.rtPool.add(\`\${this.providerASN}:\${i}\`);
    }
    
    // Initialize route distinguisher pool  
    for (let i = 1; i <= 1000; i++) {
      this.rdPool.add(\`\${this.providerASN}:\${i}\`);
    }
  }
  
  private generateServiceId(customerName: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    return \`VPN-\${customerName.toUpperCase().substr(0, 4)}-\${timestamp}-\${random}\`;
  }
  
  private allocateRouteDistinguisher(customerName: string): string {
    const rd = this.rdPool.values().next().value;
    this.rdPool.delete(rd);
    return rd;
  }
  
  private async assignPERouters(sites: any[]): Promise<CustomerSite[]> {
    return sites.map((site, index) => ({
      ...site,
      siteId: \`SITE-\${(index + 1).toString().padStart(3, '0')}\`,
      peRouter: \`PE-\${Math.floor(Math.random() * 10) + 1}.example.com\`
    }));
  }
  
  private selectQoSPolicy(sla: any): string {
    return \`ENTERPRISE-\${sla.uptime >= 99.9 ? 'PREMIUM' : 'STANDARD'}\`;
  }
  
  private selectSecurityPolicy(customerName: string): string {
    return \`SEC-POLICY-\${customerName.toUpperCase()}\`;
  }
  
  private generateSecurityConfig(policy: string): string {
    return \`! Security Policy: \${policy}\\n! MD5 authentication and ACLs configured\`;
  }
  
  private async deployToPERouter(peRouter: string, template: ProvisioningTemplate): Promise<void> {
    // Simulate network deployment delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (Math.random() < 0.95) { // 95% success rate
      console.log(\`   ✅ Configuration deployed successfully to \${peRouter}\`);
    } else {
      throw new Error("Network connectivity timeout");
    }
  }
  
  private async validateVRFExists(peRouter: string, customerName: string): Promise<boolean> {
    return Math.random() > 0.1; // 90% success rate for demo
  }
  
  private async validateMPBGPRouteExchange(service: VPNService): Promise<boolean> {
    return Math.random() > 0.05; // 95% success rate for demo
  }
  
  private async testEndToEndConnectivity(service: VPNService): Promise<boolean> {
    return Math.random() > 0.1; // 90% success rate for demo
  }
  
  private async validateSLACompliance(service: VPNService): Promise<boolean> {
    return Math.random() > 0.2; // 80% success rate for demo
  }
  
  private async rollbackService(serviceId: string): Promise<void> {
    console.log(\`🔄 Rolling back service \${serviceId}...\`);
    // Rollback logic would go here
  }
  
  private async generateServiceDocumentation(service: VPNService): Promise<void> {
    console.log(\`📄 Generating service documentation for \${service.serviceId}\`);
    // Documentation generation logic
  }
}

// Usage Example: Enterprise VPN Service Delivery
async function demonstrateEnterpriseVPNService() {
  console.log("🏢 RFC 4364 Enterprise VPN Service Provisioning Demonstration");
  console.log("This shows how service providers deliver MPLS VPN services at scale!");
  
  const provisioner = new EnterpriseVPNServiceProvisioner(65001);
  
  console.log("\\n=== Customer Requirements Analysis ===");
  
  // Enterprise customer with multiple sites
  const customerRequirements = {
    sites: [
      {
        siteName: "Headquarters-NYC",
        peRouter: "",
        ceRouter: "CE-HQ-01",
        connectivity: 'hub' as const,
        bandwidth: "100Mbps",
        sla: { uptime: 99.9, latency: 50, jitter: 5, packetLoss: 0.1 },
        ipAddressing: {
          customerSubnets: ["10.1.0.0/16", "10.2.0.0/16"],
          peceLink: "192.168.1.0/30"
        }
      },
      {
        siteName: "Branch-Boston",
        peRouter: "",
        ceRouter: "CE-BOS-01", 
        connectivity: 'spoke' as const,
        bandwidth: "50Mbps",
        sla: { uptime: 99.5, latency: 75, jitter: 10, packetLoss: 0.2 },
        ipAddressing: {
          customerSubnets: ["10.10.0.0/16"],
          peceLink: "192.168.2.0/30"
        }
      },
      {
        siteName: "Branch-Chicago",
        peRouter: "",
        ceRouter: "CE-CHI-01",
        connectivity: 'spoke' as const,
        bandwidth: "50Mbps", 
        sla: { uptime: 99.5, latency: 60, jitter: 8, packetLoss: 0.15 },
        ipAddressing: {
          customerSubnets: ["10.20.0.0/16"],
          peceLink: "192.168.3.0/30"
        }
      }
    ],
    topology: 'hub-spoke' as const,
    sla: { uptime: 99.9, latency: 50, jitter: 5, packetLoss: 0.1 },
    bandwidth: "100Mbps",
    routing: 'bgp' as const
  };
  
  // Design the VPN service
  const vpnService = await provisioner.designVPNService(
    "GlobalCorp-Inc",
    customerRequirements
  );
  
  console.log("\\n=== Service Provisioning ===");
  
  // Provision the service
  const provisioningSuccess = await provisioner.provisionVPNService(vpnService.serviceId);
  
  if (provisioningSuccess) {
    console.log("\\n=== Service Report ===");
    console.log(provisioner.generateServiceReport(vpnService.serviceId));
    
    console.log("\\n🎉 Enterprise VPN service successfully delivered!");
    console.log("\\n💼 Business Impact:");
    console.log("• Customer can now securely connect all sites");
    console.log("• Guaranteed SLA with 99.9% uptime commitment");
    console.log("• Centralized security policies and internet breakout");
    console.log("• Foundation for cloud connectivity and digital transformation");
    
  } else {
    console.log("\\n❌ Service provisioning failed - entering maintenance mode");
  }
  
  console.log("\\n📈 Service Provider Benefits:");
  console.log("• Automated provisioning reduces deployment time from weeks to hours");
  console.log("• Standardized configurations ensure consistent service quality");
  console.log("• Resource pools enable efficient network utilization");
  console.log("• RFC 4364 compliance ensures interoperability and scalability");
}

// Export for use in other modules
export { 
  EnterpriseVPNServiceProvisioner, 
  type VPNService, 
  type CustomerSite, 
  type ProvisioningTemplate 
};
`;

export default { getCodeExample };