#!/usr/bin/env python3
"""
IPv6 Server Demonstration for RFC 2460
Educational implementation showing IPv6 networking concepts.
"""

import socket
import threading
import time
import json
from datetime import datetime
from shared_ipv6_utils import IPv6Utils, log_message, create_ipv6_socket

class IPv6Server:
    """Educational IPv6 server demonstrating RFC 2460 concepts."""
    
    def __init__(self, host='::1', port=8080):
        self.host = host
        self.port = port
        self.server_socket = None
        self.running = False
        self.connections = []
        
    def start(self):
        """Start the IPv6 server."""
        try:
            # Create IPv6 socket
            self.server_socket = create_ipv6_socket()
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            
            # Bind to IPv6 address
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            
            self.running = True
            
            log_message('SUCCESS', f'IPv6 Server started on [{self.host}]:{self.port}')
            log_message('INFO', f'Address type: {IPv6Utils.classify_address(ipaddress.IPv6Address(self.host))}')
            
            # Show server information
            self.show_server_info()
            
            # Start accepting connections
            while self.running:
                try:
                    client_socket, client_address = self.server_socket.accept()
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, client_address)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                    
                except Exception as e:
                    if self.running:
                        log_message('ERROR', f'Error accepting connection: {e}')
                        
        except Exception as e:
            log_message('ERROR', f'Server startup failed: {e}')
        finally:
            self.cleanup()
    
    def show_server_info(self):
        """Display server information and IPv6 concepts."""
        log_message('INFO', '=== IPv6 Server Information ===')
        
        # Show address analysis
        addr_info = IPv6Utils.format_ipv6_address(self.host)
        if 'error' not in addr_info:
            log_message('INFO', f"Compressed: {addr_info['compressed']}")
            log_message('INFO', f"Expanded: {addr_info['expanded']}")
            log_message('INFO', f"Type: {addr_info['type']}")
        
        # Show network interfaces
        interfaces = IPv6Utils.get_network_interfaces()
        log_message('INFO', f'Available IPv6 interfaces: {len(interfaces)}')
        for iface in interfaces[:3]:  # Show first 3
            log_message('INFO', f"  {iface['interface']}: {iface['address']} ({iface['type']})")
        
        # Demonstrate address space
        log_message('INFO', '=== IPv6 Address Space Demo ===')
        IPv6Utils.demonstrate_address_space()
    
    def handle_client(self, client_socket, client_address):
        """Handle IPv6 client connection."""
        client_ipv6 = client_address[0]
        client_port = client_address[1]
        
        log_message('SUCCESS', f'New IPv6 connection from [{client_ipv6}]:{client_port}')
        
        # Analyze client address
        client_info = IPv6Utils.format_ipv6_address(client_ipv6)
        if 'error' not in client_info:
            log_message('INFO', f"Client type: {client_info['type']}")
        
        connection_info = {
            'client_address': client_ipv6,
            'client_port': client_port,
            'connected_at': datetime.now().isoformat(),
            'connection_id': len(self.connections) + 1
        }
        self.connections.append(connection_info)
        
        try:
            while self.running:
                # Receive data from client
                data = client_socket.recv(1024)
                if not data:
                    break
                
                message = data.decode('utf-8').strip()
                log_message('INFO', f'Received from [{client_ipv6}]: {message}')
                
                # Process different commands
                response = self.process_command(message, client_ipv6)
                
                # Send response back to client
                client_socket.send(response.encode('utf-8'))
                
        except Exception as e:
            log_message('ERROR', f'Error handling client [{client_ipv6}]: {e}')
        finally:
            client_socket.close()
            log_message('INFO', f'Connection closed with [{client_ipv6}]:{client_port}')
    
    def process_command(self, command, client_addr):
        """Process client commands and return appropriate response."""
        
        if command.startswith('HELLO'):
            return self.handle_hello(client_addr)
        elif command.startswith('INFO'):
            return self.handle_info_request(client_addr)
        elif command.startswith('PING'):
            return self.handle_ping_request(command, client_addr)
        elif command.startswith('ANALYZE'):
            return self.handle_analyze_request(command)
        elif command.startswith('HEADER'):
            return self.handle_header_demo(client_addr)
        else:
            return self.handle_unknown_command(command)
    
    def handle_hello(self, client_addr):
        """Handle HELLO command."""
        response = {
            'command': 'HELLO_RESPONSE',
            'message': 'Welcome to IPv6 Server (RFC 2460 Demo)',
            'server_address': self.host,
            'client_address': client_addr,
            'timestamp': datetime.now().isoformat(),
            'available_commands': [
                'INFO - Get server information',
                'PING <address> - Test IPv6 connectivity', 
                'ANALYZE <address> - Analyze IPv6 address',
                'HEADER - Demonstrate IPv6 header'
            ]
        }
        return json.dumps(response, indent=2)
    
    def handle_info_request(self, client_addr):
        """Handle INFO command."""
        response = {
            'command': 'INFO_RESPONSE',
            'server_info': {
                'address': self.host,
                'port': self.port,
                'address_analysis': IPv6Utils.format_ipv6_address(self.host),
                'active_connections': len(self.connections),
                'uptime': time.time()
            },
            'ipv6_facts': {
                'address_space': '2^128 addresses',
                'header_size': '40 bytes (fixed)',
                'max_payload': '65535 bytes',
                'hop_limit_max': 255
            }
        }
        return json.dumps(response, indent=2)
    
    def handle_ping_request(self, command, client_addr):
        """Handle PING command."""
        parts = command.split()
        if len(parts) < 2:
            return json.dumps({'error': 'Usage: PING <ipv6_address>'})
        
        target = parts[1]
        ping_result = IPv6Utils.ping6(target, count=3)
        
        response = {
            'command': 'PING_RESPONSE',
            'from': client_addr,
            'result': ping_result
        }
        return json.dumps(response, indent=2)
    
    def handle_analyze_request(self, command):
        """Handle ANALYZE command."""
        parts = command.split()
        if len(parts) < 2:
            return json.dumps({'error': 'Usage: ANALYZE <ipv6_address>'})
        
        address = parts[1]
        analysis = IPv6Utils.format_ipv6_address(address)
        
        response = {
            'command': 'ANALYZE_RESPONSE',
            'address': address,
            'analysis': analysis
        }
        return json.dumps(response, indent=2)
    
    def handle_header_demo(self, client_addr):
        """Demonstrate IPv6 header creation and parsing."""
        # Create sample IPv6 header
        header_bytes = IPv6Utils.create_ipv6_header(
            src=client_addr,
            dst=self.host,
            payload_length=1024,
            traffic_class=0,
            flow_label=12345,
            hop_limit=64
        )
        
        # Parse it back
        parsed_header = IPv6Utils.parse_ipv6_header(header_bytes)
        
        response = {
            'command': 'HEADER_RESPONSE',
            'header_demo': {
                'header_size_bytes': len(header_bytes),
                'header_hex': header_bytes.hex(),
                'parsed_fields': parsed_header
            },
            'rfc2460_facts': {
                'fixed_header_size': '40 bytes',
                'simplified_vs_ipv4': 'No fragmentation fields, no checksum',
                'extension_headers': 'Optional functionality in separate headers'
            }
        }
        return json.dumps(response, indent=2)
    
    def handle_unknown_command(self, command):
        """Handle unknown commands."""
        response = {
            'error': f'Unknown command: {command}',
            'available_commands': [
                'HELLO - Welcome message',
                'INFO - Server information',
                'PING <address> - Test connectivity',
                'ANALYZE <address> - Address analysis',
                'HEADER - IPv6 header demonstration'
            ]
        }
        return json.dumps(response, indent=2)
    
    def cleanup(self):
        """Clean up server resources."""
        self.running = False
        if self.server_socket:
            self.server_socket.close()
        log_message('INFO', 'IPv6 Server shutdown complete')

if __name__ == '__main__':
    import ipaddress
    
    # Use the IPv6 address assigned by Docker Compose
    server_host = '2001:db8::10'  # From docker-compose.yml
    server_port = 8080
    
    log_message('INFO', 'Starting IPv6 Server Demonstration (RFC 2460)')
    log_message('INFO', '=' * 50)
    
    try:
        server = IPv6Server(server_host, server_port)
        server.start()
    except KeyboardInterrupt:
        log_message('INFO', 'Server interrupted by user')
    except Exception as e:
        log_message('ERROR', f'Server error: {e}')