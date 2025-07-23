#!/usr/bin/env python3
"""
ATM Multiprotocol Encapsulation Demo
Educational implementation of RFC 2684 concepts
"""

import subprocess
import time
import struct
import sys
from typing import Dict, List, Tuple, Optional

class ATMDemo:
    """Educational ATM encapsulation demonstration."""
    
    def __init__(self):
        self.containers = {
            'switch': 'atm-switch-core',
            'ip_router': 'atm-ip-router', 
            'ethernet_bridge': 'atm-ethernet-bridge',
            'client1': 'atm-client1',
            'client2': 'atm-client2',
            'eth_host1': 'ethernet-host1',
            'eth_host2': 'ethernet-host2',
            'ip_host': 'ip-host'
        }
        
        self.vcc_table = {
            'IP_Service': {'vpi': 1, 'vci': 100, 'encap': 'LLC/SNAP'},
            'Ethernet_Bridge': {'vpi': 2, 'vci': 200, 'encap': 'LLC/SNAP'},
            'Client1_IP': {'vpi': 1, 'vci': 101, 'encap': 'VC-Mux'},
            'Client2_IP': {'vpi': 1, 'vci': 102, 'encap': 'VC-Mux'}
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
        """Check ATM network container status."""
        self.print_step("Checking ATM Network Status")
        
        for name, container in self.containers.items():
            output, code = self.run_command(f"docker ps --filter name={container} --format 'table {{.Names}}\\t{{.Status}}'")
            if container in output and "Up" in output:
                print(f"✅ {name.upper()}: {container} running")
            else:
                print(f"❌ {name.upper()}: {container} not running")
    
    def demonstrate_atm_cell_structure(self):
        """Show ATM cell structure and overhead."""
        self.print_step("ATM Cell Structure Analysis")
        
        print("📦 ATM Cell Anatomy (53 bytes total):")
        print()
        
        cell_structure = [
            ("Header", 5, "VPI/VCI routing, PTI, CLP, HEC"),
            ("Payload", 48, "User data (AAL5 frame segments)")
        ]
        
        print(f"{'Component':<10} {'Bytes':<8} {'Description'}")
        print('-'*60)
        for component, bytes_count, description in cell_structure:
            print(f"{component:<10} {bytes_count:<8} {description}")
        
        print(f"\n📊 Overhead Analysis:")
        print(f"   Header overhead: {5/53*100:.1f}% (5 bytes per cell)")
        print(f"   Payload efficiency: {48/53*100:.1f}% (48 bytes per cell)")
        
        # Show efficiency for different packet sizes
        self.show_efficiency_analysis()
    
    def show_efficiency_analysis(self):
        """Analyze ATM efficiency for different packet sizes."""
        print(f"\n📈 Efficiency by Packet Size:")
        print(f"{'Packet Size':<12} {'Cells Needed':<12} {'ATM Bytes':<12} {'Efficiency'}")
        print('-'*55)
        
        packet_sizes = [64, 128, 256, 576, 1500]  # Common sizes
        
        for size in packet_sizes:
            # Account for AAL5 trailer (8 bytes)
            data_with_trailer = size + 8
            cells_needed = (data_with_trailer + 47) // 48  # Round up
            atm_bytes = cells_needed * 53
            efficiency = (size / atm_bytes) * 100
            
            print(f"{size:<12} {cells_needed:<12} {atm_bytes:<12} {efficiency:.1f}%")
    
    def show_vcc_configuration(self):
        """Display Virtual Channel Connection configuration."""
        self.print_step("Virtual Channel Connection (VCC) Configuration")
        
        print("🔗 ATM Virtual Circuits:")
        print(f"{'Service':<15} {'VPI':<5} {'VCI':<5} {'Encapsulation':<12} {'Purpose'}")
        print('-'*60)
        
        service_descriptions = {
            'IP_Service': 'IP over ATM routing',
            'Ethernet_Bridge': 'Ethernet LAN bridging', 
            'Client1_IP': 'Direct IP client connection',
            'Client2_IP': 'Direct IP client connection'
        }
        
        for service, config in self.vcc_table.items():
            purpose = service_descriptions.get(service, 'Unknown')
            print(f"{service:<15} {config['vpi']:<5} {config['vci']:<5} {config['encap']:<12} {purpose}")
        
        print(f"\n🎯 Key Points:")
        print(f"   • Each VCC provides dedicated bandwidth and QoS")
        print(f"   • VPI/VCI combination uniquely identifies the circuit")  
        print(f"   • Encapsulation method determines protocol support")
    
    def demonstrate_llc_snap_encapsulation(self):
        """Show LLC/SNAP encapsulation process."""
        self.print_step("LLC/SNAP Encapsulation Demonstration")
        
        print("📦 LLC/SNAP Header Structure (8 bytes):")
        print()
        
        llc_snap_format = [
            ("DSAP", 1, "0xAA", "Destination Service Access Point"),
            ("SSAP", 1, "0xAA", "Source Service Access Point"),
            ("Control", 1, "0x03", "Unnumbered Information"),
            ("OUI", 3, "0x000000", "Organizationally Unique Identifier"),
            ("EtherType", 2, "varies", "Protocol identifier (0x0800=IP, 0x0806=ARP)")
        ]
        
        print(f"{'Field':<12} {'Bytes':<6} {'Value':<10} {'Description'}")
        print('-'*65)
        for field, bytes_count, value, description in llc_snap_format:
            print(f"{field:<12} {bytes_count:<6} {value:<10} {description}")
        
        print(f"\n🔍 Example LLC/SNAP Headers:")
        examples = [
            ("IP Packet", "AA AA 03 00 00 00 08 00"),
            ("ARP Packet", "AA AA 03 00 00 00 08 06"),
            ("IPv6 Packet", "AA AA 03 00 00 00 86 DD"),
            ("Ethernet Frame", "AA AA 03 00 00 00 00 00")
        ]
        
        for protocol, header in examples:
            print(f"   {protocol:<15}: {header}")
    
    def demonstrate_vc_multiplexing(self):
        """Show VC-based multiplexing approach."""
        self.print_step("VC-Based Multiplexing Demonstration")
        
        print("⚡ VC-Multiplexed Encapsulation:")
        print()
        print("🔹 Concept:")
        print("   • Entire VCC dedicated to single protocol type")
        print("   • No protocol identification header needed")
        print("   • More efficient but requires separate VCCs per protocol")
        print()
        
        print("🔹 Comparison with LLC/SNAP:")
        print(f"{'Aspect':<20} {'LLC/SNAP':<25} {'VC-Multiplexed'}")
        print('-'*70)
        
        comparisons = [
            ("Header Overhead", "8 bytes per packet", "0 bytes per packet"),
            ("Protocol Support", "Multiple on same VCC", "One per VCC"),
            ("VCC Efficiency", "Lower (shared)", "Higher (dedicated)"),
            ("Setup Complexity", "Simple (fewer VCCs)", "Complex (many VCCs)"),
            ("Best Use Case", "Mixed traffic", "Single protocol")
        ]
        
        for aspect, llc_snap, vc_mux in comparisons:
            print(f"{aspect:<20} {llc_snap:<25} {vc_mux}")
    
    def test_ip_over_atm(self):
        """Test IP connectivity over ATM."""
        self.print_step("IP over ATM Connectivity Test")
        
        print("🌐 Testing IP connectivity through ATM network:")
        print()
        
        # Test basic connectivity
        print("1️⃣ Testing ATM IP Router connectivity:")
        output, code = self.run_command("ping -c 3 10.1.0.10", self.containers['switch'])
        
        if code == 0:
            print("✅ ATM Switch can reach IP Router")
            # Extract ping stats
            lines = output.split('\n')
            for line in lines:
                if 'packet loss' in line:
                    print(f"    {line}")
        else:
            print("❌ ATM Switch cannot reach IP Router")
        
        print("\n2️⃣ Testing end-to-end IP connectivity:")
        output, code = self.run_command("ping -c 3 192.168.10.10", self.containers['client1'])
        
        if code == 0:
            print("✅ ATM Client can reach IP Host via ATM network")
            lines = output.split('\n')
            for line in lines:
                if 'packet loss' in line or 'min/avg/max' in line:
                    print(f"    {line}")
        else:
            print("❌ End-to-end IP connectivity failed")
            print(f"    Output: {output[:200]}...")
    
    def test_ethernet_bridging(self):
        """Test Ethernet bridging over ATM."""
        self.print_step("Ethernet Bridging over ATM Test")
        
        print("🌉 Testing Ethernet LAN bridging via ATM:")
        print()
        
        print("1️⃣ Testing bridge connectivity:")
        output, code = self.run_command("ping -c 3 10.1.0.20", self.containers['switch'])
        
        if code == 0:
            print("✅ ATM Switch can reach Ethernet Bridge")
        else:
            print("❌ ATM Switch cannot reach Ethernet Bridge")
        
        print("\n2️⃣ Testing inter-LAN connectivity:")
        output, code = self.run_command("ping -c 3 192.168.21.10", self.containers['eth_host1'])
        
        if code == 0:
            print("✅ Ethernet Host 1 can reach Ethernet Host 2 via ATM bridge")
            lines = output.split('\n') 
            for line in lines:
                if 'packet loss' in line:
                    print(f"    {line}")
        else:
            print("❌ Inter-LAN bridging failed")
            print("    Note: This may be expected in simulation environment")
    
    def demonstrate_qos_concepts(self):
        """Explain ATM QoS service categories."""
        self.print_step("ATM Quality of Service Concepts")
        
        print("🎯 ATM Service Categories:")
        print()
        
        service_categories = [
            ("CBR", "Constant Bit Rate", "Real-time voice, video", "Fixed bandwidth"),
            ("VBR-RT", "Variable Bit Rate - Real Time", "Video conferencing", "Statistical mux"),
            ("VBR-NRT", "Variable Bit Rate - Non-Real Time", "Multimedia data", "Bursty traffic"),
            ("ABR", "Available Bit Rate", "TCP applications", "Adaptive rate"),
            ("UBR", "Unspecified Bit Rate", "Best effort data", "No guarantees"),
            ("GFR", "Guaranteed Frame Rate", "Frame-based apps", "Minimum rate")
        ]
        
        print(f"{'Type':<10} {'Full Name':<35} {'Use Case':<20} {'Characteristics'}")
        print('-'*90)
        
        for stype, full_name, use_case, characteristics in service_categories:
            print(f"{stype:<10} {full_name:<35} {use_case:<20} {characteristics}")
        
        print(f"\n🔧 QoS Parameters:")
        print(f"   • Peak Cell Rate (PCR): Maximum transmission rate")
        print(f"   • Sustained Cell Rate (SCR): Average long-term rate")
        print(f"   • Maximum Burst Size (MBS): Largest acceptable burst")
        print(f"   • Cell Loss Priority (CLP): Discard priority (0=high, 1=low)")
    
    def show_aal5_process(self):
        """Demonstrate AAL5 segmentation and reassembly."""
        self.print_step("AAL5 Segmentation and Reassembly Process")
        
        print("🔄 AAL5 (ATM Adaptation Layer 5) Process:")
        print()
        
        # Simulate processing a 200-byte IP packet
        packet_size = 200
        trailer_size = 8
        total_size = packet_size + trailer_size
        cells_needed = (total_size + 47) // 48
        
        print(f"📝 Example: Processing {packet_size}-byte IP packet")
        print()
        
        steps = [
            f"1. Original packet: {packet_size} bytes",
            f"2. Add AAL5 trailer: {packet_size} + {trailer_size} = {total_size} bytes",
            f"3. Calculate cells needed: ceiling({total_size}/48) = {cells_needed} cells",
            f"4. Add padding: {cells_needed * 48 - total_size} bytes of padding", 
            f"5. Segment into {cells_needed} ATM cells of 48 bytes each",
            f"6. Add ATM headers: {cells_needed} × 5 = {cells_needed * 5} bytes",
            f"7. Total ATM overhead: {cells_needed * 53 - packet_size} bytes ({((cells_needed * 53 - packet_size)/packet_size)*100:.1f}%)"
        ]
        
        for step in steps:
            print(f"   {step}")
        
        print(f"\n🔍 AAL5 Trailer Structure (8 bytes):")
        trailer_fields = [
            ("UU", 1, "User-to-User indication"),
            ("CPI", 1, "Common Part Indicator"), 
            ("Length", 2, "Original data length"),
            ("CRC-32", 4, "Error detection checksum")
        ]
        
        print(f"{'Field':<10} {'Bytes':<6} {'Description'}")
        print('-'*40)
        for field, bytes_count, description in trailer_fields:
            print(f"{field:<10} {bytes_count:<6} {description}")
    
    def show_network_topology(self):
        """Display the simulated ATM network topology."""
        self.print_step("ATM Network Topology")
        
        print("🏗️ Simulated ATM Network Architecture:")
        print()
        print("┌─────────────────────────────────────────────────────────────┐")
        print("│                    ATM Core Network                         │")  
        print("│                      (10.1.0.0/24)                         │")
        print("├─────────────────────────────────────────────────────────────┤")
        print("│                                                             │")
        print("│  [ATM Switch]          [IP Router]       [Ethernet Bridge]   │")
        print("│   10.1.0.1  ←VPI/VCI→   10.1.0.10  ←VPI/VCI→  10.1.0.20    │")
        print("│                              │                     │         │") 
        print("└──────────────────────────────┼─────────────────────┼─────────┘")
        print("                               │                     │          ")
        print("                               │                     │          ")
        print("                    ┌──────────▼──────────┐         │          ")
        print("                    │    IP Network       │    ┌────▼────┐     ")
        print("                    │  (192.168.10.0/24)  │    │ LAN1    │     ") 
        print("                    │                     │    │(.20/24) │     ")
        print("                    │   [IP Host]         │    │         │     ")
        print("                    │  192.168.10.10      │    │[EthHost1]│    ")
        print("                    └─────────────────────┘    │.20.10   │     ")
        print("                                               └─────────┘     ")
        print("                                                               ")
        print("🔗 Virtual Circuit Assignments:")
        for service, config in self.vcc_table.items():
            print(f"   {service}: VPI={config['vpi']}, VCI={config['vci']} ({config['encap']})")
    
    def run_full_demo(self):
        """Run complete ATM demonstration."""
        self.print_header("ATM Multiprotocol Encapsulation Demo (RFC 2684)")
        
        print("🚀 Welcome to the ATM Educational Demonstration!")
        print("This explores RFC 2684 concepts:")
        print("• ATM cell structure and efficiency")
        print("• LLC/SNAP vs VC-based multiplexing")
        print("• AAL5 adaptation layer")
        print("• IP and Ethernet over ATM")
        print("• Quality of Service in ATM networks")
        
        try:
            self.check_container_status()
            time.sleep(2)
            
            self.show_network_topology()
            time.sleep(3)
            
            self.demonstrate_atm_cell_structure()
            time.sleep(3)
            
            self.show_vcc_configuration()
            time.sleep(3)
            
            self.demonstrate_llc_snap_encapsulation()
            time.sleep(3)
            
            self.demonstrate_vc_multiplexing()
            time.sleep(3)
            
            self.show_aal5_process()
            time.sleep(3)
            
            self.test_ip_over_atm()
            time.sleep(3)
            
            self.test_ethernet_bridging()
            time.sleep(3)
            
            self.demonstrate_qos_concepts()
            
            self.print_header("Demo Complete!")
            print("🎉 ATM demonstration finished!")
            print("🔍 Use 'docker exec -it <container> bash' to explore further")
            print("📚 Containers available:")
            print("   • atm-switch-core (ATM switching fabric)")
            print("   • atm-ip-router (IP over ATM)")
            print("   • atm-ethernet-bridge (Ethernet bridging)")
            print("   • atm-client1, atm-client2 (ATM endpoints)")
            print("   • ethernet-host1, ethernet-host2 (bridged LANs)")
            
        except KeyboardInterrupt:
            print("\n\n👋 Demo interrupted by user")
        except Exception as e:
            print(f"\n❌ Demo error: {e}")

if __name__ == "__main__":
    demo = ATMDemo()
    demo.run_full_demo()