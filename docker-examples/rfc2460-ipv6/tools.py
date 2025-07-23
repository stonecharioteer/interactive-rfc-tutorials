#!/usr/bin/env python3
"""
IPv6 Tools and Analysis for RFC 2460
Educational tools for exploring IPv6 concepts.
"""

import time
import ipaddress
import subprocess
import json
from shared_ipv6_utils import IPv6Utils, log_message

class IPv6Tools:
    """Educational IPv6 tools for RFC 2460 exploration."""
    
    def __init__(self):
        self.running = True
    
    def run_comprehensive_demo(self):
        """Run comprehensive IPv6 demonstration."""
        log_message('INFO', 'Starting IPv6 Tools Demonstration (RFC 2460)')
        log_message('INFO', '=' * 60)
        
        # Run all demonstrations
        self.demo_address_types()
        time.sleep(3)
        
        self.demo_header_analysis()
        time.sleep(3)
        
        self.demo_network_interfaces()
        time.sleep(3)
        
        self.demo_address_generation()
        time.sleep(3)
        
        self.demo_system_ipv6()
        time.sleep(3)
        
        log_message('SUCCESS', 'All IPv6 demonstrations completed')
    
    def demo_address_types(self):
        """Demonstrate different IPv6 address types."""
        log_message('INFO', '=== IPv6 Address Types Analysis ===')
        
        test_addresses = IPv6Utils.create_test_addresses()
        
        for addr_type, addresses in test_addresses.items():
            print(f"\n📍 {addr_type}:")
            print("-" * 40)
            
            for addr in addresses:
                analysis = IPv6Utils.format_ipv6_address(addr)
                if 'error' not in analysis:
                    print(f"Address: {addr}")
                    print(f"  Compressed: {analysis['compressed']}")
                    print(f"  Expanded:   {analysis['expanded']}")
                    print(f"  Type:       {analysis['type']}")
                    print(f"  Binary:     {analysis['binary'][:32]}...")
                    print()
    
    def demo_header_analysis(self):
        """Demonstrate IPv6 header structure."""
        log_message('INFO', '=== IPv6 Header Structure Demo ===')
        
        # Create sample headers with different parameters
        test_scenarios = [
            {
                'name': 'Basic Communication',
                'src': '2001:db8::1',
                'dst': '2001:db8::2', 
                'payload_length': 1024,
                'traffic_class': 0,
                'flow_label': 0,
                'hop_limit': 64
            },
            {
                'name': 'High Priority Traffic',
                'src': 'fe80::1',
                'dst': 'fe80::2',
                'payload_length': 512,
                'traffic_class': 8,  # High priority
                'flow_label': 12345,
                'hop_limit': 32
            },
            {
                'name': 'Multicast Communication',
                'src': '2001:db8::100',
                'dst': 'ff02::1',  # All nodes multicast
                'payload_length': 256,
                'traffic_class': 0,
                'flow_label': 54321,
                'hop_limit': 1  # Link-local multicast
            }
        ]
        
        for scenario in test_scenarios:
            print(f"\n🔍 Scenario: {scenario['name']}")
            print("-" * 50)
            
            # Create IPv6 header
            header_bytes = IPv6Utils.create_ipv6_header(
                src=scenario['src'],
                dst=scenario['dst'],
                payload_length=scenario['payload_length'],
                traffic_class=scenario['traffic_class'],
                flow_label=scenario['flow_label'],
                hop_limit=scenario['hop_limit']
            )
            
            # Parse the header
            parsed = IPv6Utils.parse_ipv6_header(header_bytes)
            
            print(f"Header Size: {len(header_bytes)} bytes (fixed)")
            print(f"Header Hex:  {header_bytes.hex()[:32]}...")
            print(f"Version:     {parsed['version']}")
            print(f"Traffic Class: {parsed['traffic_class']} (QoS)")
            print(f"Flow Label:  {parsed['flow_label']} (Flow ID)")
            print(f"Payload Len: {parsed['payload_length']} bytes")
            print(f"Next Header: {parsed['next_header']} (No Next Header)")
            print(f"Hop Limit:   {parsed['hop_limit']} (TTL equivalent)")
            print(f"Source:      {parsed['source_address']}")
            print(f"Destination: {parsed['destination_address']}")
    
    def demo_network_interfaces(self):
        """Demonstrate IPv6 network interfaces."""
        log_message('INFO', '=== Network Interfaces Analysis ===')
        
        print("📡 IPv6 Network Interfaces:")
        print("-" * 40)
        
        interfaces = IPv6Utils.get_network_interfaces()
        
        if interfaces:
            for iface in interfaces:
                print(f"Interface: {iface['interface']}")
                print(f"  Address: {iface['address']}")
                print(f"  Type:    {iface['type']}")
                
                # Additional analysis
                try:
                    addr = ipaddress.IPv6Address(iface['address'])
                    print(f"  Scope:   {'Global' if addr.is_global else 'Local'}")
                    print(f"  Special: {addr.is_loopback or addr.is_link_local or addr.is_multicast}")
                except:
                    pass
                print()
        else:
            print("No IPv6 interfaces found or netifaces not available")
        
        # Show system IPv6 status
        self.show_system_ipv6_status()
    
    def demo_address_generation(self):
        """Demonstrate IPv6 address generation techniques."""
        log_message('INFO', '=== IPv6 Address Generation Demo ===')
        
        print("🔧 Link-Local Address Generation (EUI-64):")
        print("-" * 50)
        
        # Example MAC addresses
        test_macs = [
            '00:1A:2B:3C:4D:5E',  # Standard unicast
            '02:00:5E:10:00:00',  # Locally administered
            'AA:BB:CC:DD:EE:FF',  # Broadcast-like
            '08:00:27:12:34:56'   # VirtualBox default range
        ]
        
        for mac in test_macs:
            try:
                link_local = IPv6Utils.generate_link_local_from_mac(mac)
                print(f"MAC: {mac}")
                print(f"  Link-Local: {link_local}")
                
                # Analyze the generated address
                analysis = IPv6Utils.format_ipv6_address(link_local)
                print(f"  Type: {analysis['type']}")
                print(f"  EUI-64 Process: MAC → EUI-64 → Interface ID")
                print()
                
            except ValueError as e:
                print(f"Error with {mac}: {e}")
                print()
        
        print("🌐 Address Space Utilization:")
        print("-" * 40)
        IPv6Utils.demonstrate_address_space()
    
    def demo_system_ipv6(self):
        """Demonstrate system-level IPv6 functionality."""
        log_message('INFO', '=== System IPv6 Configuration ===')
        
        # Show IPv6 addresses
        try:
            result = subprocess.run(['ip', '-6', 'addr', 'show'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print("📋 System IPv6 Addresses:")
                print("-" * 30)
                print(result.stdout[:500] + "..." if len(result.stdout) > 500 else result.stdout)
        except Exception as e:
            print(f"Could not get IPv6 addresses: {e}")
        
        # Show IPv6 routing table
        try:
            result = subprocess.run(['ip', '-6', 'route', 'show'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print("\n🗺️  IPv6 Routing Table:")
                print("-" * 25)
                print(result.stdout[:300] + "..." if len(result.stdout) > 300 else result.stdout)
        except Exception as e:
            print(f"Could not get IPv6 routes: {e}")
    
    def show_system_ipv6_status(self):
        """Show system IPv6 configuration status."""
        print("\n🔧 System IPv6 Status:")
        print("-" * 25)
        
        # Check if IPv6 is enabled
        try:
            with open('/proc/sys/net/ipv6/conf/all/disable_ipv6', 'r') as f:
                disabled = f.read().strip()
                status = "Disabled" if disabled == '1' else "Enabled"
                print(f"IPv6 Global Status: {status}")
        except:
            print("IPv6 Global Status: Unknown")
        
        # Check IPv6 forwarding
        try:
            with open('/proc/sys/net/ipv6/conf/all/forwarding', 'r') as f:
                forwarding = f.read().strip()
                status = "Enabled" if forwarding == '1' else "Disabled"
                print(f"IPv6 Forwarding: {status}")
        except:
            print("IPv6 Forwarding: Unknown")
    
    def interactive_tools(self):
        """Interactive IPv6 tools mode."""
        log_message('INFO', 'IPv6 Interactive Tools Mode')
        log_message('INFO', 'Type "help" for commands, "quit" to exit')
        
        while self.running:
            try:
                command = input("\nIPv6-Tools> ").strip().lower()
                
                if command in ['quit', 'exit']:
                    break
                elif command == 'help':
                    self.show_help()
                elif command == 'addresses':
                    self.demo_address_types()
                elif command == 'headers':
                    self.demo_header_analysis()
                elif command == 'interfaces':
                    self.demo_network_interfaces()
                elif command == 'generate':
                    self.demo_address_generation()
                elif command == 'system':
                    self.demo_system_ipv6()
                elif command == 'demo':
                    self.run_comprehensive_demo()
                elif command.startswith('analyze '):
                    addr = command.split()[1]
                    analysis = IPv6Utils.format_ipv6_address(addr)
                    print(json.dumps(analysis, indent=2))
                elif command.startswith('ping '):
                    addr = command.split()[1]
                    result = IPv6Utils.ping6(addr)
                    print(json.dumps(result, indent=2))
                elif command:
                    print(f"Unknown command: {command}. Type 'help' for available commands.")
                    
            except KeyboardInterrupt:
                break
            except Exception as e:
                log_message('ERROR', f'Command error: {e}')
        
        log_message('INFO', 'Exiting interactive mode')
    
    def show_help(self):
        """Show available commands."""
        print("\n📚 Available Commands:")
        print("=" * 30)
        print("addresses  - Show IPv6 address types")
        print("headers    - Demonstrate IPv6 headers")
        print("interfaces - Show network interfaces")
        print("generate   - Address generation demo")
        print("system     - System IPv6 configuration")
        print("demo       - Run comprehensive demo")
        print("analyze <addr> - Analyze IPv6 address")
        print("ping <addr>    - Test IPv6 connectivity")
        print("help       - Show this help")
        print("quit       - Exit interactive mode")

def main():
    """Main tools function."""
    log_message('INFO', 'Starting IPv6 Tools Container (RFC 2460)')
    log_message('INFO', '=' * 50)
    
    tools = IPv6Tools()
    
    try:
        # Run initial demonstration
        tools.run_comprehensive_demo()
        
        # Keep container running for exploration
        log_message('INFO', 'Tools demonstration complete. Container staying alive.')
        log_message('INFO', 'Use: docker exec -it ipv6-tools python -c "from tools import IPv6Tools; IPv6Tools().interactive_tools()"')
        
        # Keep container alive
        while True:
            time.sleep(60)
            log_message('INFO', 'IPv6 tools still running... (use docker exec for interaction)')
            
    except KeyboardInterrupt:
        log_message('INFO', 'Tools interrupted by user')
    except Exception as e:
        log_message('ERROR', f'Tools error: {e}')

if __name__ == '__main__':
    main()