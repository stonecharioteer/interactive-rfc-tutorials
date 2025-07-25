export const getCodeExample = () => `
/**
 * RFC 4787: UDP Hole Punching Implementation
 * 
 * This example demonstrates the UDP hole punching technique that enables
 * peer-to-peer connections across NATs with compliant behavior as defined
 * in RFC 4787. This is the foundation of how Tailscale establishes direct
 * connections between devices.
 */

interface PeerInfo {
  id: string;
  internalAddress: { ip: string; port: number };
  externalAddress: { ip: string; port: number };
  natType: string;
}

interface CoordinationServer {
  register(peer: PeerInfo): Promise<void>;
  findPeer(peerId: string): Promise<PeerInfo | null>;
  exchangeAddresses(fromId: string, toId: string): Promise<void>;
}

class UDPHolePuncher {
  private localPeer: PeerInfo;
  private socket: any; // Abstracted UDP socket
  private coordinationServer: CoordinationServer;
  private activeConnections = new Map<string, any>();
  
  constructor(localId: string, coordinationServer: CoordinationServer) {
    this.localPeer = {
      id: localId,
      internalAddress: { ip: "192.168.1.100", port: 0 }, // Will be set when socket created
      externalAddress: { ip: "", port: 0 }, // Discovered via STUN
      natType: "unknown"
    };
    
    this.coordinationServer = coordinationServer;
  }
  
  /**
   * Phase 1: Initialize and discover our external address via STUN
   * This creates the initial NAT mapping that peers will target
   */
  async initialize(): Promise<void> {
    console.log("🚀 Phase 1: Initializing UDP Hole Puncher...");
    
    // Create UDP socket and bind to available port
    this.socket = await this.createUDPSocket();
    this.localPeer.internalAddress.port = this.socket.port;
    
    console.log(\`📡 Local socket bound to \${this.localPeer.internalAddress.ip}:\${this.localPeer.internalAddress.port}\`);
    
    // Discover external address using STUN
    await this.discoverExternalAddress();
    
    // Register with coordination server
    await this.coordinationServer.register(this.localPeer);
    
    console.log(\`✅ Registered with coordination server as '\${this.localPeer.id}'\`);
    console.log(\`📍 External address: \${this.localPeer.externalAddress.ip}:\${this.localPeer.externalAddress.port}\`);
  }
  
  /**
   * Phase 2: Establish peer-to-peer connection using hole punching
   * This is the core RFC 4787 behavior that enables direct connectivity
   */
  async connectToPeer(peerId: string): Promise<boolean> {
    console.log(\`\\n🔗 Phase 2: Attempting to connect to peer '\${peerId}'...\`);
    
    // Get peer information from coordination server
    const remotePeer = await this.coordinationServer.findPeer(peerId);
    if (!remotePeer) {
      throw new Error(\`Peer '\${peerId}' not found\`);
    }
    
    console.log(\`📍 Remote peer external address: \${remotePeer.externalAddress.ip}:\${remotePeer.externalAddress.port}\`);
    
    // Coordinate simultaneous hole punching
    await this.coordinationServer.exchangeAddresses(this.localPeer.id, peerId);
    
    // Perform simultaneous UDP hole punching
    const connectionEstablished = await this.performHolePunching(remotePeer);
    
    if (connectionEstablished) {
      console.log(\`✅ Direct P2P connection established with '\${peerId}'!\`);
      console.log("🎯 This demonstrates RFC 4787 compliant NAT behavior");
      this.activeConnections.set(peerId, remotePeer);
      
      // Start keepalive to maintain NAT mapping
      this.startKeepalive(peerId);
      
      return true;
    } else {
      console.log(\`❌ Failed to establish direct connection with '\${peerId}'\`);
      console.log("🚫 This indicates non-compliant NAT behavior or firewall restrictions");
      return false;
    }
  }
  
  /**
   * Core hole punching algorithm implementing RFC 4787 techniques
   */
  private async performHolePunching(remotePeer: PeerInfo): Promise<boolean> {
    console.log("🕳️  Performing simultaneous UDP hole punching...");
    
    const maxAttempts = 10;
    const attemptInterval = 500; // ms
    let connectionEstablished = false;
    
    // This promise resolves when we receive a response from the peer
    const connectionPromise = new Promise<boolean>((resolve) => {
      const responseHandler = (data: any, remoteInfo: any) => {
        if (remoteInfo.address === remotePeer.externalAddress.ip && 
            remoteInfo.port === remotePeer.externalAddress.port) {
          console.log(\`📨 Received response from \${remoteInfo.address}:\${remoteInfo.port}\`);
          console.log("🎉 Hole punching successful!");
          resolve(true);
        }
      };
      
      this.socket.on('message', responseHandler);
      
      // Timeout if no response received
      setTimeout(() => {
        this.socket.off('message', responseHandler);
        resolve(false);
      }, maxAttempts * attemptInterval + 2000);
    });
    
    // Send packets to remote peer's external address
    // This creates the "hole" in our NAT that allows return traffic
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const message = this.createHolePunchPacket(attempt);
        
        console.log(\`📤 Attempt \${attempt}: Sending to \${remotePeer.externalAddress.ip}:\${remotePeer.externalAddress.port}\`);
        
        await this.sendUDPPacket(
          message,
          remotePeer.externalAddress.ip,
          remotePeer.externalAddress.port
        );
        
        // RFC 4787 compliant NATs should now allow return traffic
        // from the remote peer's external address
        
        await this.sleep(attemptInterval);
        
      } catch (error) {
        console.warn(\`⚠️  Attempt \${attempt} failed: \${error.message}\`);
      }
    }
    
    return await connectionPromise;
  }
  
  /**
   * Discover external address using STUN (RFC 5389)
   * This creates the initial NAT mapping that RFC 4787 defines
   */
  private async discoverExternalAddress(): Promise<void> {
    console.log("🔍 Discovering external address via STUN...");
    
    // Simulate STUN Binding Request/Response
    // In reality, this would use actual STUN protocol messages
    
    const stunServers = [
      "stun.l.google.com:19302",
      "stun.cloudflare.com:3478"
    ];
    
    for (const server of stunServers) {
      try {
        // Send STUN Binding Request
        console.log(\`📡 Querying \${server}...\`);
        
        // Simulate STUN response with external address
        // Real implementation would parse STUN response packet
        const externalAddress = await this.simulateSTUNQuery(server);
        
        this.localPeer.externalAddress = externalAddress;
        console.log(\`📍 Discovered external address: \${externalAddress.ip}:\${externalAddress.port}\`);
        
        // Success - we have our external mapping
        break;
        
      } catch (error) {
        console.warn(\`⚠️  STUN server \${server} failed: \${error.message}\`);
      }
    }
    
    if (!this.localPeer.externalAddress.ip) {
      throw new Error("Failed to discover external address via STUN");
    }
  }
  
  /**
   * Create hole punch packet with connection attempt information
   */
  private createHolePunchPacket(attempt: number): Buffer {
    const packet = {
      type: "HOLE_PUNCH",
      fromId: this.localPeer.id,
      attempt: attempt,
      timestamp: Date.now(),
      message: "RFC4787 UDP Hole Punching"
    };
    
    return Buffer.from(JSON.stringify(packet));
  }
  
  /**
   * Send UDP packet to specific destination
   */
  private async sendUDPPacket(data: Buffer, ip: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.send(data, port, ip, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  
  /**
   * Start keepalive mechanism to maintain NAT mapping
   * RFC 4787 recommends minimum 2-minute timeout, but we use shorter intervals
   */
  private startKeepalive(peerId: string): void {
    const keepaliveInterval = 30000; // 30 seconds
    
    const keepaliveTimer = setInterval(async () => {
      const peer = this.activeConnections.get(peerId);
      if (!peer) {
        clearInterval(keepaliveTimer);
        return;
      }
      
      try {
        const keepalivePacket = Buffer.from(JSON.stringify({
          type: "KEEPALIVE",
          fromId: this.localPeer.id,
          timestamp: Date.now()
        }));
        
        await this.sendUDPPacket(
          keepalivePacket,
          peer.externalAddress.ip,
          peer.externalAddress.port
        );
        
        console.log(\`💓 Sent keepalive to '\${peerId}'\`);
        
      } catch (error) {
        console.warn(\`⚠️  Keepalive failed for '\${peerId}': \${error.message}\`);
      }
    }, keepaliveInterval);
    
    console.log(\`⏰ Started keepalive for '\${peerId}' (every \${keepaliveInterval/1000}s)\`);
  }
  
  /**
   * Send application data over established P2P connection
   */
  async sendToPeer(peerId: string, data: string): Promise<boolean> {
    const peer = this.activeConnections.get(peerId);
    if (!peer) {
      console.error(\`❌ No active connection to '\${peerId}'\`);
      return false;
    }
    
    try {
      const dataPacket = Buffer.from(JSON.stringify({
        type: "DATA",
        fromId: this.localPeer.id,
        payload: data,
        timestamp: Date.now()
      }));
      
      await this.sendUDPPacket(
        dataPacket,
        peer.externalAddress.ip,
        peer.externalAddress.port
      );
      
      console.log(\`📤 Sent data to '\${peerId}': \${data.substring(0, 50)}...\`);
      return true;
      
    } catch (error) {
      console.error(\`❌ Failed to send data to '\${peerId}': \${error.message}\`);
      return false;
    }
  }
  
  /**
   * Handle incoming packets from established connections
   */
  private setupPacketHandler(): void {
    this.socket.on('message', (data: Buffer, remoteInfo: any) => {
      try {
        const packet = JSON.parse(data.toString());
        
        switch (packet.type) {
          case "HOLE_PUNCH":
            console.log(\`📨 Received hole punch from \${packet.fromId}\`);
            // Respond to complete the hole punching
            this.respondToHolePunch(packet, remoteInfo);
            break;
            
          case "KEEPALIVE":
            console.log(\`💓 Received keepalive from \${packet.fromId}\`);
            break;
            
          case "DATA":
            console.log(\`📥 Received data from \${packet.fromId}: \${packet.payload.substring(0, 50)}...\`);
            break;
            
          default:
            console.log(\`❓ Unknown packet type: \${packet.type}\`);
        }
        
      } catch (error) {
        console.warn("⚠️  Failed to parse incoming packet:", error.message);
      }
    });
  }
  
  /**
   * Respond to hole punch attempt to complete connection
   */
  private async respondToHolePunch(packet: any, remoteInfo: any): Promise<void> {
    const response = {
      type: "HOLE_PUNCH_RESPONSE",
      fromId: this.localPeer.id,
      toId: packet.fromId,
      originalAttempt: packet.attempt,
      timestamp: Date.now()
    };
    
    const responseBuffer = Buffer.from(JSON.stringify(response));
    
    try {
      await this.sendUDPPacket(responseBuffer, remoteInfo.address, remoteInfo.port);
      console.log(\`📤 Sent hole punch response to \${packet.fromId}\`);
    } catch (error) {
      console.error("❌ Failed to send hole punch response:", error.message);
    }
  }
  
  // Utility methods
  
  private async createUDPSocket(): Promise<any> {
    // Platform-specific UDP socket creation
    // In Node.js: const dgram = require('dgram'); return dgram.createSocket('udp4');
    // In browser: Would use WebRTC DataChannels for similar functionality
    
    const mockSocket = {
      port: 5000 + Math.floor(Math.random() * 1000),
      send: (data: Buffer, port: number, ip: string, callback: Function) => {
        // Simulate network delay
        setTimeout(() => callback(null), 10 + Math.random() * 50);
      },
      on: (event: string, handler: Function) => {
        // Set up event handlers
      },
      off: (event: string, handler: Function) => {
        // Remove event handlers
      }
    };
    
    return mockSocket;
  }
  
  private async simulateSTUNQuery(server: string): Promise<{ ip: string; port: number }> {
    // Simulate network delay and STUN response
    await this.sleep(100 + Math.random() * 200);
    
    // Return simulated external address
    return {
      ip: "203.0.113." + (100 + Math.floor(Math.random() * 50)),
      port: 12345 + Math.floor(Math.random() * 1000)
    };
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Get comprehensive status report
   */
  getStatus(): string {
    return \`
🔗 UDP Hole Puncher Status
============================

👤 Local Peer: \${this.localPeer.id}
📍 Internal Address: \${this.localPeer.internalAddress.ip}:\${this.localPeer.internalAddress.port}
🌐 External Address: \${this.localPeer.externalAddress.ip}:\${this.localPeer.externalAddress.port}
🔗 Active Connections: \${this.activeConnections.size}

📋 Connected Peers:
\${Array.from(this.activeConnections.keys()).map(id => \`   • \${id}\`).join('\\n') || '   None'}

💡 This demonstrates RFC 4787 compliant NAT traversal:
   • Endpoint-independent mapping allows predictable external ports
   • Endpoint-independent filtering enables direct peer communication
   • UDP hole punching creates bidirectional communication paths
    \`.trim();
  }
}

// Usage Example: Connect two peers directly
async function demonstrateHolePunching() {
  console.log("🚀 RFC 4787 UDP Hole Punching Demonstration");
  console.log("This shows how Tailscale establishes direct connections!");
  
  // Mock coordination server for demo
  const coordinationServer: CoordinationServer = {
    peers: new Map(),
    
    async register(peer: PeerInfo) {
      this.peers.set(peer.id, peer);
      console.log(\`📝 Server: Registered peer '\${peer.id}'\`);
    },
    
    async findPeer(peerId: string) {
      return this.peers.get(peerId) || null;
    },
    
    async exchangeAddresses(fromId: string, toId: string) {
      console.log(\`🤝 Server: Coordinating connection between '\${fromId}' and '\${toId}'\`);
      // In reality, this would notify both peers to start hole punching
    }
  };
  
  // Create two peers
  const peer1 = new UDPHolePuncher("device-laptop", coordinationServer);
  const peer2 = new UDPHolePuncher("device-phone", coordinationServer);
  
  try {
    // Initialize both peers
    await peer1.initialize();
    await peer2.initialize();
    
    console.log("\\n" + peer1.getStatus());
    console.log("\\n" + peer2.getStatus());
    
    // Attempt peer-to-peer connection
    const connected = await peer1.connectToPeer("device-phone");
    
    if (connected) {
      console.log("\\n🎉 Success! Direct P2P connection established!");
      console.log("🚀 This is how Tailscale creates its 'magic' direct connections");
      
      // Demonstrate data exchange
      await peer1.sendToPeer("device-phone", "Hello from laptop! 🖥️");
      
      console.log("\\n💡 Key RFC 4787 behaviors demonstrated:");
      console.log("   ✅ Endpoint-independent mapping (same external port)");
      console.log("   ✅ Endpoint-independent filtering (any host can reach)");
      console.log("   ✅ UDP hole punching creates bidirectional communication");
      console.log("   ✅ Keepalive maintains NAT mapping");
      
    } else {
      console.log("\\n❌ Connection failed - likely due to:");
      console.log("   • Address/port-dependent NAT mapping");
      console.log("   • Address/port-dependent NAT filtering");
      console.log("   • Symmetric NAT configuration");
      console.log("   • Firewall blocking UDP traffic");
      console.log("\\n🔄 In this case, Tailscale would use DERP relay servers");
    }
    
  } catch (error) {
    console.error("❌ Demonstration failed:", error.message);
  }
}

// Export for use in other modules
export { UDPHolePuncher, type PeerInfo, type CoordinationServer };
`;

export default { getCodeExample };