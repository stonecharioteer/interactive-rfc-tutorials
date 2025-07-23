#!/usr/bin/env python3
"""
IPv6 Client Demonstration for RFC 2460
Educational implementation showing IPv6 client concepts.
"""

import socket
import json
import time
import os
from shared_ipv6_utils import IPv6Utils, log_message, create_ipv6_socket

class IPv6Client:
    """Educational IPv6 client demonstrating RFC 2460 concepts."""
    
    def __init__(self, server_host, server_port=8080):
        self.server_host = server_host
        self.server_port = server_port
        self.client_socket = None
        
    def connect(self):
        """Connect to IPv6 server."""
        try:
            # Create IPv6 client socket
            self.client_socket = create_ipv6_socket()
            
            log_message('INFO', f'Connecting to IPv6 server [{self.server_host}]:{self.server_port}')
            
            # Connect to server
            self.client_socket.connect((self.server_host, self.server_port))
            
            # Get local address info
            local_addr = self.client_socket.getsockname()
            log_message('SUCCESS', f'Connected from [{local_addr[0]}]:{local_addr[1]}')
            
            # Analyze addresses
            server_info = IPv6Utils.format_ipv6_address(self.server_host)
            client_info = IPv6Utils.format_ipv6_address(local_addr[0])
            
            log_message('INFO', f'Server type: {server_info.get("type", "Unknown")}')
            log_message('INFO', f'Client type: {client_info.get("type", "Unknown")}')
            
            return True
            
        except Exception as e:
            log_message('ERROR', f'Connection failed: {e}')
            return False
    
    def send_command(self, command):
        """Send command to server and receive response."""
        try:
            log_message('INFO', f'Sending: {command}')
            
            # Send command
            self.client_socket.send(command.encode('utf-8'))
            
            # Receive response
            response = self.client_socket.recv(4096)
            response_text = response.decode('utf-8')
            
            log_message('SUCCESS', 'Response received')
            
            # Try to parse as JSON for pretty printing
            try:
                response_json = json.loads(response_text)
                print(json.dumps(response_json, indent=2))
            except json.JSONDecodeError:
                print(response_text)
                
            return response_text
            
        except Exception as e:
            log_message('ERROR', f'Command failed: {e}')
            return None
    
    def run_demonstration(self):
        """Run comprehensive IPv6 demonstration."""
        if not self.connect():
            return
        
        log_message('INFO', '=== Starting IPv6 Client Demonstration ===')
        
        # Test commands in sequence
        test_commands = [
            'HELLO',
            'INFO', 
            'ANALYZE ::1',
            'ANALYZE 2001:db8::1',
            'ANALYZE fe80::1',
            'ANALYZE ff02::1',
            'PING 2001:db8::10',
            'HEADER'
        ]
        
        for i, command in enumerate(test_commands, 1):
            log_message('INFO', f'--- Test {i}/{len(test_commands)}: {command} ---')
            self.send_command(command)
            time.sleep(2)  # Pause between commands
            print()  # Add spacing
        
        # Demonstrate IPv6 concepts
        self.demonstrate_ipv6_concepts()
        
        log_message('SUCCESS', 'IPv6 demonstration completed')
    
    def demonstrate_ipv6_concepts(self):
        """Demonstrate key IPv6 concepts."""
        log_message('INFO', '=== IPv6 Concepts Demonstration ===')
        
        # Address types demonstration
        print("\n🎯 IPv6 Address Types:")
        test_addresses = IPv6Utils.create_test_addresses()
        
        for addr_type, addresses in test_addresses.items():
            print(f"\n{addr_type}:")
            for addr in addresses[:2]:  # Show first 2 of each type
                analysis = IPv6Utils.format_ipv6_address(addr)
                if 'error' not in analysis:
                    print(f"  {addr}")
                    print(f"    Compressed: {analysis['compressed']}")
                    print(f"    Type: {analysis['type']}")
        
        # Link-local generation from MAC
        print("\n🔗 Link-Local Address Generation:")
        test_macs = [
            '00:1A:2B:3C:4D:5E',
            '02:00:5E:10:00:00'
        ]
        
        for mac in test_macs:
            try:
                link_local = IPv6Utils.generate_link_local_from_mac(mac)
                print(f"  MAC: {mac} → Link-Local: {link_local}")
            except ValueError as e:
                print(f"  Error with {mac}: {e}")
        
        # Address space comparison
        print("\n🌐 Address Space Comparison:")
        IPv6Utils.demonstrate_address_space()
    
    def interactive_mode(self):
        """Interactive command mode."""
        if not self.connect():
            return
        
        log_message('INFO', 'Entering interactive mode. Type "help" for commands, "quit" to exit.')
        
        while True:
            try:
                command = input("\nIPv6> ").strip()
                
                if command.lower() in ['quit', 'exit']:
                    break
                elif command.lower() == 'help':
                    print("Available commands:")
                    print("  HELLO - Welcome message")
                    print("  INFO - Server information")
                    print("  PING <address> - Test connectivity")
                    print("  ANALYZE <address> - Address analysis")
                    print("  HEADER - IPv6 header demonstration")
                    print("  help - This help message")
                    print("  quit - Exit interactive mode")
                elif command:
                    self.send_command(command)
                    
            except KeyboardInterrupt:
                break
            except Exception as e:
                log_message('ERROR', f'Interactive error: {e}')
        
        log_message('INFO', 'Exiting interactive mode')
    
    def cleanup(self):
        """Clean up client resources."""
        if self.client_socket:
            self.client_socket.close()
        log_message('INFO', 'IPv6 Client disconnected')

def main():
    """Main client function."""
    # Get server address from environment or use default
    server_host = os.getenv('SERVER_HOST', '2001:db8::10')
    server_port = int(os.getenv('SERVER_PORT', '8080'))
    
    log_message('INFO', 'Starting IPv6 Client Demonstration (RFC 2460)')
    log_message('INFO', '=' * 50)
    
    client = IPv6Client(server_host, server_port)
    
    try:
        # Wait for server to be ready
        log_message('INFO', 'Waiting for server to be ready...')
        time.sleep(5)
        
        # Run demonstration
        client.run_demonstration()
        
        # Keep container running for manual interaction
        log_message('INFO', 'Demonstration complete. Container staying alive for exploration.')
        log_message('INFO', 'Use: docker exec -it ipv6-client python -c "from client import IPv6Client; IPv6Client(\\'2001:db8::10\\').interactive_mode()"')
        
        # Keep container alive
        while True:
            time.sleep(60)
            log_message('INFO', 'IPv6 client still running... (use docker exec for interaction)')
            
    except KeyboardInterrupt:
        log_message('INFO', 'Client interrupted by user')
    except Exception as e:
        log_message('ERROR', f'Client error: {e}')
    finally:
        client.cleanup()

if __name__ == '__main__':
    main()