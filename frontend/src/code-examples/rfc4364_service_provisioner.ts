export const getCodeExample = () => `"""
RFC 4364: Enterprise VPN Service Provisioning System

This example demonstrates how service providers automate the
provisioning of BGP/MPLS IP VPN services for enterprise customers,
implementing the operational procedures defined in RFC 4364.
"""

import asyncio
import json
import random
import time
from datetime import datetime
from typing import Dict, List, Optional, Set, Union, Literal
from dataclasses import dataclass
from enum import Enum


@dataclass
class SLA:
    uptime: float  # percentage
    latency: int   # ms
    jitter: int    # ms
    packet_loss: float  # percentage


@dataclass
class IPAddressing:
    customer_subnets: List[str]
    pece_link: str


@dataclass
class CustomerSite:
    site_id: str
    site_name: str
    pe_router: str
    ce_router: str
    connectivity: str  # 'hub' | 'spoke' | 'any-to-any' | 'extranet'
    bandwidth: str
    sla: SLA
    ip_addressing: IPAddressing


@dataclass
class RouteTargets:
    hub_export: Optional[List[str]] = None
    spoke_import: Optional[List[str]] = None
    any_to_any: Optional[List[str]] = None


@dataclass
class VPNService:
    service_id: str
    customer_name: str
    service_name: str
    topology: str  # 'hub-spoke' | 'any-to-any' | 'extranet'
    sites: List[CustomerSite]
    routing_protocol: str  # 'bgp' | 'static' | 'ospf' | 'eigrp'
    qos_policy: str
    security_policy: str
    route_targets: RouteTargets
    status: str  # 'planning' | 'provisioning' | 'active' | 'maintenance' | 'decommissioned'


@dataclass
class ProvisioningTemplate:
    vrf_config: str
    bgp_config: str
    qos_config: str
    security_config: str


class EnterpriseVPNServiceProvisioner:
    """
    Enterprise VPN Service Provisioning System using Python automation
    """
    
    def __init__(self, provider_asn: int):
        self.provider_asn = provider_asn
        self.services: Dict[str, VPNService] = {}
        self.pe_routers: Dict[str, dict] = {}
        self.rt_pool: Set[str] = set()
        self.rd_pool: Set[str] = set()
        
        self._initialize_resource_pools()
        print(f"🏢 Enterprise VPN Service Provisioner initialized for AS {provider_asn}")
    
    async def design_vpn_service(
        self,
        customer_name: str,
        requirements: dict
    ) -> VPNService:
        """
        Phase 1: Service Design and Planning
        
        Analyzes customer requirements and designs appropriate VPN topology
        with optimal route target and route distinguisher allocation
        """
        print(f"\n📋 Designing VPN service for customer: {customer_name}")
        print(f"   🌐 Topology: {requirements['topology']}")
        print(f"   📍 Sites: {len(requirements['sites'])}")
        print(f"   🔧 Routing: {requirements['routing']}")
        
        service_id = self._generate_service_id(customer_name)
        
        # Allocate resource pools
        route_targets = self._allocate_route_targets(requirements['topology'], len(requirements['sites']))
        route_distinguisher = self._allocate_route_distinguisher(customer_name)
        
        # Assign PE routers to sites based on location and capacity
        sites_with_assignments = await self._assign_pe_routers(requirements['sites'])
        
        vpn_service = VPNService(
            service_id=service_id,
            customer_name=customer_name,
            service_name=f"{customer_name}-MPLS-VPN",
            topology=requirements['topology'],
            sites=sites_with_assignments,
            routing_protocol=requirements['routing'],
            qos_policy=self._select_qos_policy(requirements['sla']),
            security_policy=self._select_security_policy(customer_name),
            route_targets=route_targets,
            status='planning'
        )
        
        self.services[service_id] = vpn_service
        
        print("✅ VPN service designed successfully:")
        print(f"   🆔 Service ID: {service_id}")
        print(f"   🎯 Route Targets: {json.dumps(route_targets.__dict__, indent=2)}")
        print(f"   📊 SLA: {requirements['sla']['uptime']}% uptime, {requirements['sla']['latency']}ms latency")
        
        return vpn_service
    
    async def generate_configurations(self, service_id: str) -> Dict[str, ProvisioningTemplate]:
        """
        Phase 2: Automated Configuration Generation
        
        Generates router configurations for all PE routers based on
        RFC 4364 best practices and customer requirements
        """
        print(f"\n⚙️  Generating configurations for service: {service_id}")
        
        service = self.services.get(service_id)
        if not service:
            raise ValueError(f"Service {service_id} not found")
        
        configurations = {}
        
        for site in service.sites:
            print(f"   🔧 Generating config for {site.site_name} on {site.pe_router}")
            
            template = await self._generate_site_configuration(service, site)
            configurations[site.pe_router] = template
            
            print(f"   ✅ Configuration generated for {site.pe_router}")
        
        print("✅ All configurations generated successfully")
        return configurations
    
    async def provision_vpn_service(self, service_id: str) -> bool:
        """
        Phase 3: Service Provisioning and Deployment
        
        Deploys configurations to PE routers and activates the VPN service
        with comprehensive validation and rollback capabilities
        """
        print(f"\n🚀 Provisioning VPN service: {service_id}")
        
        service = self.services.get(service_id)
        if not service:
            raise ValueError(f"Service {service_id} not found")
        
        service.status = 'provisioning'
        
        try:
            # Generate configurations
            configurations = await self.generate_configurations(service_id)
            
            # Deploy to PE routers
            deployment_results = await self._deploy_configurations(configurations)
            
            # Validate service connectivity
            validation_results = await self._validate_service_connectivity(service)
            
            if deployment_results['success'] and validation_results['success']:
                service.status = 'active'
                print(f"✅ VPN service {service_id} provisioned successfully!")
                
                # Generate service documentation
                await self._generate_service_documentation(service)
                
                return True
            else:
                print(f"❌ Provisioning failed for {service_id}")
                
                # Rollback changes
                await self._rollback_service(service_id)
                service.status = 'planning'
                
                return False
                
        except Exception as error:
            print(f"❌ Provisioning error: {error}")
            service.status = 'planning'
            return False
    
    async def _generate_site_configuration(self, service: VPNService, site: CustomerSite) -> ProvisioningTemplate:
        """
        Generate site-specific configuration based on topology and requirements
        """
        import re
        
        vrf_name = re.sub(r'[^a-zA-Z0-9-]', '-', f"{service.customer_name}-{site.site_id}")
        rd = next(iter(self.rd_pool))  # Get assigned RD
        
        # Generate VRF configuration
        vrf_config = self._generate_vrf_config(vrf_name, rd, service, site)
        
        # Generate BGP configuration  
        bgp_config = self._generate_bgp_config(service, site)
        
        # Generate QoS configuration
        qos_config = self._generate_qos_config(service.qos_policy, site.bandwidth)
        
        # Generate security configuration
        security_config = self._generate_security_config(service.security_policy)
        
        return ProvisioningTemplate(
            vrf_config=vrf_config,
            bgp_config=bgp_config,
            qos_config=qos_config,
            security_config=security_config
        )
    
    def _generate_vrf_config(self, vrf_name: str, rd: str, service: VPNService, site: CustomerSite) -> str:
        """
        Generate VRF configuration following RFC 4364 specifications
        """
        import_rts = []
        export_rts = []
        
        # Configure route targets based on topology
        if service.topology == 'hub-spoke':
            if site.connectivity == 'hub':
                import_rts = service.route_targets.spoke_import or []
                export_rts = service.route_targets.hub_export or []
            else:
                import_rts = service.route_targets.hub_export or []
                export_rts = service.route_targets.spoke_import or []
        elif service.topology == 'any-to-any':
            import_rts = export_rts = service.route_targets.any_to_any or []
        elif service.topology == 'extranet':
            # Complex extranet logic would go here
            import_rts = export_rts = service.route_targets.any_to_any or []
        
        pe_ce_link_ip = site.ip_addressing.pece_link.split('/')[0]
        
        return f"""! RFC 4364 BGP/MPLS IP VPN Configuration
! Customer: {service.customer_name}
! Site: {site.site_name}
! Generated: {datetime.now().isoformat()}

ip vrf {vrf_name}
 rd {rd}
 route-target import {' '.join(import_rts)}
 route-target export {' '.join(export_rts)}
 maximum routes 10000 80
 !
interface GigabitEthernet0/0/1
 description CE-{site.site_name}-{site.ce_router}
 ip vrf forwarding {vrf_name}
 ip address {pe_ce_link_ip} 255.255.255.252
 no shutdown
 !""".strip()
    
    def _generate_bgp_config(self, service: VPNService, site: CustomerSite) -> str:
        """
        Generate BGP configuration for PE-CE routing
        """
        import re
        
        vrf_name = re.sub(r'[^a-zA-Z0-9-]', '-', f"{service.customer_name}-{site.site_id}")
        
        bgp_config = f"""router bgp {self.provider_asn}
 !
 address-family ipv4 vrf {vrf_name}"""
        
        if service.routing_protocol == 'bgp':
            ce_asn = 65000 + random.randint(0, 999)  # Simplified
            pe_ce_neighbor = site.ip_addressing.pece_link.split('/')[0].replace(site.ip_addressing.pece_link.split('/')[0][-1], '2')
            
            bgp_config += f"""
  neighbor {pe_ce_neighbor} remote-as {ce_asn}
  neighbor {pe_ce_neighbor} activate
  neighbor {pe_ce_neighbor} as-override
  neighbor {pe_ce_neighbor} send-community extended
  neighbor {pe_ce_neighbor} route-map RM-{site.site_id}-IN in
  neighbor {pe_ce_neighbor} route-map RM-{site.site_id}-OUT out"""
        elif service.routing_protocol == 'static':
            for subnet in site.ip_addressing.customer_subnets:
                bgp_config += f"""
  network {subnet}"""
        
        bgp_config += """
  redistribute connected
  maximum-paths 4
  exit-address-family
 !"""
        
        return bgp_config
    
    def _generate_qos_config(self, qos_policy: str, bandwidth: str) -> str:
        """
        Generate QoS configuration based on SLA requirements
        """
        return f"""! QoS Policy: {qos_policy}
! Bandwidth: {bandwidth}

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
policy-map {qos_policy}
 class VOICE
  priority percent 20
 class VIDEO
  bandwidth percent 30
 class BUSINESS-DATA
  bandwidth percent 40
 class class-default
  bandwidth percent 10
  random-detect
!""".strip()
    
    def _allocate_route_targets(self, topology: str, site_count: int) -> RouteTargets:
        """
        Allocate route targets based on VPN topology
        """
        base_rt = next(iter(self.rt_pool))
        asn, base = base_rt.split(':')
        base_num = int(base)
        
        if topology == 'hub-spoke':
            return RouteTargets(
                hub_export=[f"{asn}:{base_num}"],
                spoke_import=[f"{asn}:{base_num + 1}"]
            )
        elif topology == 'any-to-any':
            return RouteTargets(
                any_to_any=[f"{asn}:{base_num}"]
            )
        elif topology == 'extranet':
            return RouteTargets(
                any_to_any=[f"{asn}:{base_num}", f"{asn}:{base_num + 1}"]
            )
        else:
            return RouteTargets(any_to_any=[f"{asn}:{base_num}"])
    
    async def _deploy_configurations(self, configurations: Dict[str, ProvisioningTemplate]) -> Dict[str, any]:
        """
        Deploy configurations to PE routers with validation
        """
        print(f"   🚀 Deploying configurations to {len(configurations)} PE routers")
        
        results = {}
        overall_success = True
        
        for pe_router, template in configurations.items():
            try:
                print(f"   📤 Deploying to {pe_router}...")
                
                # Simulate configuration deployment
                await self._deploy_to_pe_router(pe_router, template)
                
                print(f"   ✅ Successfully deployed to {pe_router}")
                results[pe_router] = True
                
            except Exception as error:
                print(f"   ❌ Failed to deploy to {pe_router}: {error}")
                results[pe_router] = False
                overall_success = False
        
        return {'success': overall_success, 'results': results}
    
    async def _validate_service_connectivity(self, service: VPNService) -> Dict[str, any]:
        """
        Validate end-to-end service connectivity
        """
        print(f"   🔍 Validating service connectivity for {service.service_id}")
        
        validation_results = []
        all_tests_pass = True
        
        # Test 1: VRF creation and route target assignment
        for site in service.sites:
            vrf_exists = await self._validate_vrf_exists(site.pe_router, service.customer_name)
            if vrf_exists:
                validation_results.append(f"✅ VRF exists on {site.pe_router} for {site.site_name}")
            else:
                validation_results.append(f"❌ VRF missing on {site.pe_router} for {site.site_name}")
                all_tests_pass = False
        
        # Test 2: MP-BGP route exchange
        route_exchange_working = await self._validate_mp_bgp_route_exchange(service)
        if route_exchange_working:
            validation_results.append("✅ MP-BGP route exchange working")
        else:
            validation_results.append("❌ MP-BGP route exchange failed")
            all_tests_pass = False
        
        # Test 3: End-to-end connectivity
        connectivity_test = await self._test_end_to_end_connectivity(service)
        if connectivity_test:
            validation_results.append("✅ End-to-end connectivity verified")
        else:
            validation_results.append("❌ End-to-end connectivity failed")
            all_tests_pass = False
        
        # Test 4: SLA compliance
        sla_compliance = await self._validate_sla_compliance(service)
        if sla_compliance:
            validation_results.append("✅ SLA requirements met")
        else:
            validation_results.append("⚠️  SLA requirements not fully met")
        
        return {'success': all_tests_pass, 'details': validation_results}
    
    def generate_service_report(self, service_id: str) -> str:
        """
        Generate service summary report
        """
        service = self.services.get(service_id)
        if not service:
            return "Service not found"
        
        sites_info = []
        for site in service.sites:
            sites_info.append(f"   • {site.site_name} ({site.connectivity})")
            sites_info.append(f"     - PE Router: {site.pe_router}")
            sites_info.append(f"     - Subnets: {', '.join(site.ip_addressing.customer_subnets)}")
        
        return f"""🔍 Enterprise VPN Service Report
===============================

🆔 Service Details:
   • Service ID: {service.service_id}
   • Customer: {service.customer_name}
   • Service Name: {service.service_name}
   • Status: {service.status.upper()}
   • Topology: {service.topology}

🏢 Sites ({len(service.sites)}):
{chr(10).join(sites_info)}

🎯 Route Targets:
{json.dumps(service.route_targets.__dict__, indent=3)}

📊 SLA Commitments:
   • Uptime: {service.sites[0].sla.uptime if service.sites else 'N/A'}%
   • Latency: <{service.sites[0].sla.latency if service.sites else 'N/A'}ms
   • Packet Loss: <{service.sites[0].sla.packet_loss if service.sites else 'N/A'}%

💡 RFC 4364 Features Implemented:
   ✅ BGP/MPLS IP VPN architecture
   ✅ VRF isolation and route target policies  
   ✅ MP-BGP VPNv4 route distribution
   ✅ Two-level MPLS label forwarding
   ✅ QoS and SLA enforcement
   ✅ Enterprise-grade security""".strip()
    
    # Helper methods (simplified implementations)
    
    def _initialize_resource_pools(self) -> None:
        """Initialize route target and route distinguisher pools"""
        # Initialize route target pool
        for i in range(1, 1001):
            self.rt_pool.add(f"{self.provider_asn}:{i}")
        
        # Initialize route distinguisher pool  
        for i in range(1, 1001):
            self.rd_pool.add(f"{self.provider_asn}:{i}")
    
    def _generate_service_id(self, customer_name: str) -> str:
        """Generate unique service ID"""
        timestamp = hex(int(time.time()))[2:]
        random_part = hex(random.randint(0, 65535))[2:]
        return f"VPN-{customer_name.upper()[:4]}-{timestamp}-{random_part}"
    
    def _allocate_route_distinguisher(self, customer_name: str) -> str:
        """Allocate route distinguisher from pool"""
        rd = next(iter(self.rd_pool))
        self.rd_pool.remove(rd)
        return rd
    
    async def _assign_pe_routers(self, sites: List[dict]) -> List[CustomerSite]:
        """Assign PE routers to customer sites"""
        assigned_sites = []
        
        for index, site in enumerate(sites):
            site_id = f"SITE-{str(index + 1).zfill(3)}"
            pe_router = f"PE-{random.randint(1, 10)}.example.com"
            
            assigned_sites.append(CustomerSite(
                site_id=site_id,
                site_name=site['site_name'],
                pe_router=pe_router,
                ce_router=site['ce_router'],
                connectivity=site['connectivity'],
                bandwidth=site['bandwidth'],
                sla=SLA(**site['sla']),
                ip_addressing=IPAddressing(**site['ip_addressing'])
            ))
        
        return assigned_sites
    
    def _select_qos_policy(self, sla: dict) -> str:
        """Select QoS policy based on SLA requirements"""
        return f"ENTERPRISE-{'PREMIUM' if sla['uptime'] >= 99.9 else 'STANDARD'}"
    
    def _select_security_policy(self, customer_name: str) -> str:
        """Select security policy for customer"""
        return f"SEC-POLICY-{customer_name.upper()}"
    
    def _generate_security_config(self, policy: str) -> str:
        """Generate security configuration"""
        return f"! Security Policy: {policy}\n! MD5 authentication and ACLs configured"
    
    async def _deploy_to_pe_router(self, pe_router: str, template: ProvisioningTemplate) -> None:
        """Simulate deployment to PE router"""
        # Simulate network deployment delay
        await asyncio.sleep(1 + random.random() * 2)
        
        if random.random() < 0.95:  # 95% success rate
            print(f"   ✅ Configuration deployed successfully to {pe_router}")
        else:
            raise Exception("Network connectivity timeout")
    
    async def _validate_vrf_exists(self, pe_router: str, customer_name: str) -> bool:
        """Validate VRF exists on PE router"""
        return random.random() > 0.1  # 90% success rate for demo
    
    async def _validate_mp_bgp_route_exchange(self, service: VPNService) -> bool:
        """Validate MP-BGP route exchange"""
        return random.random() > 0.05  # 95% success rate for demo
    
    async def _test_end_to_end_connectivity(self, service: VPNService) -> bool:
        """Test end-to-end connectivity"""
        return random.random() > 0.1  # 90% success rate for demo
    
    async def _validate_sla_compliance(self, service: VPNService) -> bool:
        """Validate SLA compliance"""
        return random.random() > 0.2  # 80% success rate for demo
    
    async def _rollback_service(self, service_id: str) -> None:
        """Rollback service configuration"""
        print(f"🔄 Rolling back service {service_id}...")
        # Rollback logic would go here
    
    async def _generate_service_documentation(self, service: VPNService) -> None:
        """Generate service documentation"""
        print(f"📄 Generating service documentation for {service.service_id}")
        # Documentation generation logic


# Usage Example: Enterprise VPN Service Delivery
async def demonstrate_enterprise_vpn_service():
    """
    RFC 4364 Enterprise VPN Service Provisioning Demonstration
    This shows how service providers deliver MPLS VPN services at scale!
    """
    print("🏢 RFC 4364 Enterprise VPN Service Provisioning Demonstration")
    print("This shows how service providers deliver MPLS VPN services at scale!")
    
    provisioner = EnterpriseVPNServiceProvisioner(65001)
    
    print("\n=== Customer Requirements Analysis ===")
    
    # Enterprise customer with multiple sites
    customer_requirements = {
        'sites': [
            {
                'site_name': "Headquarters-NYC",
                'pe_router': "",
                'ce_router': "CE-HQ-01",
                'connectivity': 'hub',
                'bandwidth': "100Mbps",
                'sla': {'uptime': 99.9, 'latency': 50, 'jitter': 5, 'packet_loss': 0.1},
                'ip_addressing': {
                    'customer_subnets': ["10.1.0.0/16", "10.2.0.0/16"],
                    'pece_link': "192.168.1.0/30"
                }
            },
            {
                'site_name': "Branch-Boston",
                'pe_router': "",
                'ce_router': "CE-BOS-01",
                'connectivity': 'spoke',
                'bandwidth': "50Mbps",
                'sla': {'uptime': 99.5, 'latency': 75, 'jitter': 10, 'packet_loss': 0.2},
                'ip_addressing': {
                    'customer_subnets': ["10.10.0.0/16"],
                    'pece_link': "192.168.2.0/30"
                }
            },
            {
                'site_name': "Branch-Chicago",
                'pe_router': "",
                'ce_router': "CE-CHI-01",
                'connectivity': 'spoke',
                'bandwidth': "50Mbps",
                'sla': {'uptime': 99.5, 'latency': 60, 'jitter': 8, 'packet_loss': 0.15},
                'ip_addressing': {
                    'customer_subnets': ["10.20.0.0/16"],
                    'pece_link': "192.168.3.0/30"
                }
            }
        ],
        'topology': 'hub-spoke',
        'sla': {'uptime': 99.9, 'latency': 50, 'jitter': 5, 'packet_loss': 0.1},
        'bandwidth': "100Mbps",
        'routing': 'bgp'
    }
    
    # Design the VPN service
    vpn_service = await provisioner.design_vpn_service(
        "GlobalCorp-Inc",
        customer_requirements
    )
    
    print("\n=== Service Provisioning ===")
    
    # Provision the service
    provisioning_success = await provisioner.provision_vpn_service(vpn_service.service_id)
    
    if provisioning_success:
        print("\n=== Service Report ===")
        print(provisioner.generate_service_report(vpn_service.service_id))
        
        print("\n🎉 Enterprise VPN service successfully delivered!")
        print("\n💼 Business Impact:")
        print("• Customer can now securely connect all sites")
        print("• Guaranteed SLA with 99.9% uptime commitment")
        print("• Centralized security policies and internet breakout")
        print("• Foundation for cloud connectivity and digital transformation")
        
    else:
        print("\n❌ Service provisioning failed - entering maintenance mode")
    
    print("\n📈 Service Provider Benefits:")
    print("• Automated provisioning reduces deployment time from weeks to hours")
    print("• Standardized configurations ensure consistent service quality")
    print("• Resource pools enable efficient network utilization")
    print("• RFC 4364 compliance ensures interoperability and scalability")


# Python Network Automation Libraries
def show_python_automation_libraries():
    """
    Real Python libraries for network automation and service provisioning
    """
    print("\n📚 Python Network Automation Libraries:")
    
    print("\n🔧 netmiko - SSH network device automation:")
    print("""# Install: pip install netmiko
from netmiko import ConnectHandler

# Connect to PE router
pe_router = {
    'device_type': 'cisco_ios',
    'host': '10.0.0.1',
    'username': 'admin',
    'password': 'password',
    'secret': 'enable_secret'
}

with ConnectHandler(**pe_router) as net_connect:
    # Deploy VRF configuration
    config_commands = [
        'ip vrf CUSTOMER-ACME',
        'rd 65001:100',
        'route-target export 65001:100',
        'route-target import 65001:100'
    ]
    
    output = net_connect.send_config_set(config_commands)
    print(output)""")
    
    print("\n🔧 napalm - Multi-vendor network automation:")
    print("""# Install: pip install napalm
from napalm import get_network_driver

# Multi-vendor support
driver = get_network_driver('ios')
device = driver('10.0.0.1', 'admin', 'password')

# Open connection and deploy config
device.open()
device.load_merge_candidate(config=bgp_config)
device.commit_config()
device.close()""")
    
    print("\n🔧 nornir - Parallel network automation:")
    print("""# Install: pip install nornir
from nornir import InitNornir
from nornir.plugins.tasks import networking

# Initialize Nornir with inventory
nr = InitNornir(config_file="config.yaml")

# Deploy to all PE routers in parallel
result = nr.run(
    task=networking.netmiko_send_config,
    config_file="vpn_config.txt"
)

# Check results
for host, task_result in result.items():
    print(f"{host}: {'Success' if task_result.failed else 'Failed'}")""")


if __name__ == "__main__":
    asyncio.run(demonstrate_enterprise_vpn_service())
    show_python_automation_libraries()
`;

export default { getCodeExample };