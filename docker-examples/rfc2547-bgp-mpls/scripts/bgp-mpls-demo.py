#!/usr/bin/env python3
"""
BGP/MPLS VPN Demonstration Script
Implements RFC 2547 concepts for educational purposes
"""

import subprocess
import time
import json
import sys
from typing import Dict, List, Tuple

class BGPMPLSDemo:
    """Educational BGP/MPLS VPN demonstration."""
    
    def __init__(self):
        self.pe_routers = {
            'PE1': '10.0.0.1',
            'PE2': '10.0.0.2'
        }
        
        self.customers = {
            'CustomerA': {
                'rt': '65001:100',
                'rd': '65001:100',
                'sites': {
                    'HQ': {'pe': 'PE1', 'network': '192.168.1.0/24'},
                    'Branch': {'pe': 'PE2', 'network': '192.168.2.0/24'}
                }
            },
            'CustomerB': {
                'rt': '65001:200', 
                'rd': '65001:200',
                'sites': {
                    'Main': {'pe': 'PE1', 'network': '172.16.1.0/24'},
                    'Remote': {'pe': 'PE2', 'network': '172.16.2.0/24'}
                }
            }
        }
    
    def run_command(self, command: str, container: str = None) -> Tuple[str, int]:
        """Execute command locally or in container."""
        if container:
            full_command = f"docker exec -it {container} {command}"
        else:
            full_command = command
            
        try:
            result = subprocess.run(
                full_command, 
                shell=True, 
                capture_output=True, 
                text=True,
                timeout=30
            )
            return result.stdout + result.stderr, result.returncode
        except subprocess.TimeoutExpired:
            return "Command timed out", 1
        except Exception as e:
            return f"Error: {e}", 1
    
    def print_header(self, title: str):
        """Print formatted section header."""
        print(f"\n{'='*60}")
        print(f"🔹 {title}")
        print('='*60)
    
    def print_step(self, step: str):
        """Print formatted step."""
        print(f"\n📍 {step}")
        print('-'*40)
    
    def check_container_status(self):
        """Check if all containers are running."""
        self.print_step("Checking Container Status")
        
        containers = [
            'bgp-mpls-pe1', 'bgp-mpls-pe2', 'bgp-mpls-core',
            'customer-a-hq', 'customer-a-branch', 
            'customer-b-main', 'customer-b-remote'
        ]
        
        for container in containers:
            output, code = self.run_command(f"docker ps --filter name={container} --format 'table {{.Names}}\\t{{.Status}}'")
            if container in output and "Up" in output:
                print(f"✅ {container}: Running")
            else:
                print(f"❌ {container}: Not running")
    
    def demonstrate_vrf_isolation(self):
        """Show VRF isolation between customers."""
        self.print_step("VRF Isolation Demonstration")
        
        print("Testing connectivity within Customer A VPN:")
        
        # Customer A: HQ to Branch
        output, code = self.run_command(
            "ping -c 3 192.168.2.10", 
            "customer-a-hq"
        )
        
        if code == 0:
            print("✅ Customer A HQ can reach Branch (192.168.2.10)")
        else:
            print("❌ Customer A HQ cannot reach Branch")
            print(f"Output: {output[:200]}...")
        
        print("\nTesting isolation between customers:")
        
        # Customer A trying to reach Customer B
        output, code = self.run_command(
            "ping -c 3 172.16.1.10", 
            "customer-a-hq"
        )
        
        if code != 0:
            print("✅ Customer A HQ correctly CANNOT reach Customer B (172.16.1.10)")
            print("    VRF isolation is working!")
        else:
            print("❌ VRF isolation failed - customers can reach each other")
    
    def show_bgp_vpn_routes(self):
        """Display BGP VPN routing tables."""
        self.print_step("BGP VPN Routing Tables")
        
        for pe_name, pe_ip in self.pe_routers.items():
            container = f"bgp-mpls-{pe_name.lower()}"
            print(f"\n🔹 {pe_name} Router ({pe_ip}) BGP Table:")
            
            # Show BGP VPN routes
            output, code = self.run_command(
                "vtysh -c 'show bgp vpnv4 unicast'",
                container
            )
            
            if code == 0 and output.strip():
                print(output[:500] + "..." if len(output) > 500 else output)
            else:
                print("📝 Note: BGP routes may not be visible without full FRR setup")
                
                # Show simulated routing table
                self.show_simulated_routes(pe_name)
    
    def show_simulated_routes(self, pe_name: str):
        """Show simulated VPN routes for educational purposes."""
        print(f"\n📋 Simulated VPN Routes for {pe_name}:")
        print(f"{'VPN Prefix':<25} {'Next Hop':<15} {'Route Target':<15} {'Label'}")
        print('-'*70)
        
        if pe_name == 'PE1':
            routes = [
                ('65001:100:192.168.1.0/24', 'CE-A-HQ', '65001:100', '1001'),
                ('65001:200:172.16.1.0/24', 'CE-B-Main', '65001:200', '2001'),
                ('65001:100:192.168.2.0/24', '10.0.0.2', '65001:100', '1002'),
                ('65001:200:172.16.2.0/24', '10.0.0.2', '65001:200', '2002')
            ]
        else:  # PE2
            routes = [
                ('65001:100:192.168.2.0/24', 'CE-A-Branch', '65001:100', '1002'),
                ('65001:200:172.16.2.0/24', 'CE-B-Remote', '65001:200', '2002'),
                ('65001:100:192.168.1.0/24', '10.0.0.1', '65001:100', '1001'),
                ('65001:200:172.16.1.0/24', '10.0.0.1', '65001:200', '2001')
            ]
        
        for vpn_prefix, next_hop, rt, label in routes:
            print(f"{vpn_prefix:<25} {next_hop:<15} {rt:<15} {label}")
    
    def show_mpls_labels(self):
        """Display MPLS label information."""
        self.print_step("MPLS Label Distribution")
        
        for pe_name, pe_ip in self.pe_routers.items():
            container = f"bgp-mpls-{pe_name.lower()}"
            print(f"\n🔹 {pe_name} Router MPLS Labels:")
            
            # Try to show actual MPLS table
            output, code = self.run_command(
                "ip -M route show",
                container
            )
            
            if code == 0 and output.strip():
                print(output)
            else:
                # Show simulated label table
                print(f"📋 Simulated MPLS Label Table for {pe_name}:")
                print(f"{'In Label':<10} {'Out Label':<10} {'Next Hop':<15} {'Interface'}")
                print('-'*50)
                
                if pe_name == 'PE1':
                    labels = [
                        ('1001', 'pop', 'CE-A-HQ', 'eth1'),
                        ('2001', 'pop', 'CE-B-Main', 'eth2'),
                        ('3001', '3002', '10.0.0.2', 'eth0'),
                        ('3002', '3001', '10.0.0.2', 'eth0')
                    ]
                else:
                    labels = [
                        ('1002', 'pop', 'CE-A-Branch', 'eth1'),
                        ('2002', 'pop', 'CE-B-Remote', 'eth2'),
                        ('3003', '3004', '10.0.0.1', 'eth0'),
                        ('3004', '3003', '10.0.0.1', 'eth0')
                    ]
                
                for in_label, out_label, next_hop, interface in labels:
                    print(f"{in_label:<10} {out_label:<10} {next_hop:<15} {interface}")
    
    def test_end_to_end_connectivity(self):
        """Test end-to-end connectivity between customer sites."""
        self.print_step("End-to-End Connectivity Tests")
        
        test_cases = [
            {
                'name': 'Customer A: HQ to Branch',
                'source': 'customer-a-hq',
                'target': '192.168.2.10',
                'expected': 'success'
            },
            {
                'name': 'Customer B: Main to Remote',
                'source': 'customer-b-main', 
                'target': '172.16.2.10',
                'expected': 'success'
            },
            {
                'name': 'Cross-customer (should fail)',
                'source': 'customer-a-hq',
                'target': '172.16.1.10', 
                'expected': 'fail'
            }
        ]
        
        for test in test_cases:
            print(f"\n🧪 Testing: {test['name']}")
            
            output, code = self.run_command(
                f"ping -c 2 -W 3 {test['target']}", 
                test['source']
            )
            
            if test['expected'] == 'success':
                if code == 0:
                    print(f"✅ SUCCESS: Connectivity works as expected")
                    # Extract ping statistics
                    lines = output.split('\n')
                    for line in lines:
                        if 'packet loss' in line or 'min/avg/max' in line:
                            print(f"    {line}")
                else:
                    print(f"❌ FAILED: Expected success but got failure")
            else:  # expected fail
                if code != 0:
                    print(f"✅ SUCCESS: Correctly blocked (VRF isolation working)")
                else:
                    print(f"❌ FAILED: Expected failure but got success")
    
    def show_route_target_demo(self):
        """Demonstrate Route Target functionality."""
        self.print_step("Route Target Policy Demonstration")
        
        print("📋 Route Target Configuration:")
        print(f"{'Customer':<12} {'Route Target':<15} {'Sites'}")
        print('-'*50)
        
        for customer, config in self.customers.items():
            sites = ', '.join(config['sites'].keys())
            print(f"{customer:<12} {config['rt']:<15} {sites}")
        
        print("\n🔍 Route Target Impact:")
        print("• Customer A sites import/export RT 65001:100")
        print("• Customer B sites import/export RT 65001:200")
        print("• Different RTs ensure traffic isolation")
        print("• PE routers maintain separate VRF tables per customer")
    
    def demonstrate_packet_flow(self):
        """Show packet flow through BGP/MPLS VPN."""
        self.print_step("Packet Flow Demonstration")
        
        print("📦 Packet Flow: Customer A HQ → Customer A Branch")
        print()
        
        flow_steps = [
            "1. Customer A HQ (192.168.1.10) sends packet to 192.168.2.10",
            "2. PE1 receives packet on Customer A VRF interface", 
            "3. PE1 looks up destination in Customer A VRF table",
            "4. PE1 finds route: 192.168.2.0/24 via PE2 (10.0.0.2)",
            "5. PE1 adds MPLS labels: [Transport=3002][VPN=1002]",
            "6. Packet forwarded through MPLS core to PE2",
            "7. PE2 pops VPN label, identifies Customer A VRF",
            "8. PE2 forwards to Customer A Branch via CE interface",
            "9. Customer A Branch (192.168.2.10) receives packet"
        ]
        
        for step in flow_steps:
            print(f"   {step}")
            time.sleep(0.5)
        
        print("\n🎯 Key Points:")
        print("• VRF separation ensures customer isolation")
        print("• MPLS labels enable efficient core forwarding") 
        print("• BGP carries VPN routes between PE routers")
        print("• Route Targets control route import/export")
    
    def run_full_demo(self):
        """Run complete BGP/MPLS VPN demonstration."""
        self.print_header("BGP/MPLS VPN Demonstration (RFC 2547)")
        
        print("🚀 Welcome to the BGP/MPLS VPN Educational Demo!")
        print("This demonstrates key concepts from RFC 2547:")
        print("• Virtual Routing and Forwarding (VRF)")
        print("• Route Distinguishers and Route Targets")  
        print("• MPLS label distribution")
        print("• Customer traffic isolation")
        
        try:
            self.check_container_status()
            time.sleep(2)
            
            self.show_route_target_demo()
            time.sleep(3)
            
            self.demonstrate_vrf_isolation()
            time.sleep(3)
            
            self.show_bgp_vpn_routes()
            time.sleep(3)
            
            self.show_mpls_labels() 
            time.sleep(3)
            
            self.test_end_to_end_connectivity()
            time.sleep(3)
            
            self.demonstrate_packet_flow()
            
            self.print_header("Demo Complete!")
            print("🎉 BGP/MPLS VPN demonstration finished!")
            print("🔍 Use 'docker exec -it <container> bash' to explore further")
            print("📚 Containers available:")
            print("   • bgp-mpls-pe1, bgp-mpls-pe2 (PE routers)")
            print("   • bgp-mpls-core (P router)")  
            print("   • customer-a-hq, customer-a-branch (Customer A)")
            print("   • customer-b-main, customer-b-remote (Customer B)")
            
        except KeyboardInterrupt:
            print("\n\n👋 Demo interrupted by user")
        except Exception as e:
            print(f"\n❌ Demo error: {e}")

if __name__ == "__main__":
    demo = BGPMPLSDemo()
    demo.run_full_demo()