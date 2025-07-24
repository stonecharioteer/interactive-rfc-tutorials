export const getCodeExample = () => `
/**
 * RFC 7540: HTTP/2 Client Implementation
 * 
 * This example demonstrates HTTP/2 client functionality including
 * stream multiplexing, header compression, and concurrent request
 * handling as specified in RFC 7540.
 */

interface HTTP2Frame {
  type: 'HEADERS' | 'DATA' | 'SETTINGS' | 'WINDOW_UPDATE' | 'PUSH_PROMISE' | 'PING' | 'RST_STREAM';
  flags: number;
  streamId: number;
  payload: any;
}

interface HTTP2Stream {
  id: number;
  state: 'idle' | 'open' | 'half-closed-local' | 'half-closed-remote' | 'closed';
  priority: {
    dependency: number;
    weight: number;
    exclusive: boolean;
  };
  window: number;
  headers?: Map<string, string>;
  data?: Buffer[];
}

interface HTTP2Connection {
  streams: Map<number, HTTP2Stream>;
  settings: Map<string, number>;
  window: number;
  maxStreamId: number;
  hpackEncoder: any;
  hpackDecoder: any;
}

class HTTP2Client {
  private connection: HTTP2Connection;
  private socket: any; // Abstracted socket connection
  private activeRequests = new Map<number, Promise<any>>();
  
  constructor(private hostname: string, private port: number = 443) {
    this.connection = {
      streams: new Map(),
      settings: new Map([
        ['HEADER_TABLE_SIZE', 4096],
        ['ENABLE_PUSH', 1],
        ['MAX_CONCURRENT_STREAMS', 100],
        ['INITIAL_WINDOW_SIZE', 65535],
        ['MAX_FRAME_SIZE', 16384],
        ['MAX_HEADER_LIST_SIZE', 8192]
      ]),
      window: 65535,
      maxStreamId: 0,
      hpackEncoder: this.createHPACKEncoder(),
      hpackDecoder: this.createHPACKDecoder()
    };
    
    console.log(\`🚀 HTTP/2 Client initialized for \${hostname}:\${port}\`);
  }
  
  /**
   * Phase 1: Connection Establishment and Settings Exchange
   * 
   * Establishes HTTP/2 connection with proper protocol negotiation
   * and settings exchange as required by RFC 7540
   */
  async connect(): Promise<void> {
    console.log(\`\\n🔗 Establishing HTTP/2 connection to \${this.hostname}:\${this.port}\`);
    
    // In real implementation: TLS negotiation with ALPN for h2
    this.socket = await this.establishTLSConnection();
    
    // Send connection preface
    await this.sendConnectionPreface();
    
    // Exchange initial SETTINGS frames
    await this.exchangeSettings();
    
    console.log(\`✅ HTTP/2 connection established successfully\`);
    console.log(\`   📊 Max Concurrent Streams: \${this.connection.settings.get('MAX_CONCURRENT_STREAMS')}\`);
    console.log(\`   📦 Max Frame Size: \${this.connection.settings.get('MAX_FRAME_SIZE')} bytes\`);
  }
  
  /**
   * Phase 2: Concurrent Request Processing
   * 
   * Demonstrates HTTP/2's key advantage: multiple concurrent requests
   * over a single connection with stream multiplexing
   */
  async makeRequests(requests: Array<{path: string, headers?: Record<string, string>}>): Promise<any[]> {
    console.log(\`\\n📤 Making \${requests.length} concurrent HTTP/2 requests:\`);
    
    const requestPromises = requests.map(async (request, index) => {
      const streamId = this.allocateStreamId();
      
      console.log(\`   🌊 Stream \${streamId}: GET \${request.path}\`);
      
      return this.sendRequest(streamId, 'GET', request.path, request.headers || {});
    });
    
    // All requests sent concurrently - this is HTTP/2's superpower!
    console.log(\`⚡ All requests sent simultaneously over single connection\`);
    
    const responses = await Promise.all(requestPromises);
    
    console.log(\`✅ All \${responses.length} responses received\`);
    return responses;
  }
  
  /**
   * Phase 3: Individual Request/Response Processing
   * 
   * Handles a single HTTP/2 request with proper header compression
   * and stream state management
   */
  private async sendRequest(
    streamId: number, 
    method: string, 
    path: string, 
    headers: Record<string, string>
  ): Promise<any> {
    
    // Create new stream
    const stream: HTTP2Stream = {
      id: streamId,
      state: 'idle',
      priority: { dependency: 0, weight: 16, exclusive: false },
      window: this.connection.settings.get('INITIAL_WINDOW_SIZE') || 65535,
      headers: new Map(),
      data: []
    };
    
    this.connection.streams.set(streamId, stream);
    
    // Prepare pseudo-headers (HTTP/2 requirement)
    const pseudoHeaders = new Map([
      [':method', method],
      [':path', path],
      [':scheme', 'https'],
      [':authority', this.hostname]
    ]);
    
    // Add custom headers
    const customHeaders = new Map(Object.entries(headers));
    
    // Combine all headers
    const allHeaders = new Map([...pseudoHeaders, ...customHeaders]);
    
    console.log(\`     📋 Headers for Stream \${streamId}:\`);
    for (const [name, value] of allHeaders) {
      console.log(\`       \${name}: \${value}\`);
    }
    
    // Compress headers using HPACK
    const compressedHeaders = this.compressHeaders(allHeaders);
    
    console.log(\`     🗜️  HPACK Compression: \${this.calculateHeaderSize(allHeaders)} → \${compressedHeaders.length} bytes\`);
    
    // Send HEADERS frame
    const headersFrame: HTTP2Frame = {
      type: 'HEADERS',
      flags: 0x05, // END_HEADERS | END_STREAM (no body)
      streamId: streamId,
      payload: compressedHeaders
    };
    
    stream.state = 'half-closed-local';
    
    await this.sendFrame(headersFrame);
    
    // Wait for response
    return this.waitForResponse(streamId);
  }
  
  /**
   * Phase 4: Response Processing and Stream Management
   * 
   * Handles incoming HTTP/2 frames and assembles complete responses
   */
  private async waitForResponse(streamId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = this.connection.streams.get(streamId)!;
      let response = {
        status: 0,
        headers: new Map<string, string>(),
        body: Buffer.alloc(0)
      };
      
      // Simulate frame reception (in real implementation, this would be event-driven)
      const frameHandler = (frame: HTTP2Frame) => {
        if (frame.streamId !== streamId) return;
        
        switch (frame.type) {
          case 'HEADERS':
            console.log(\`     📨 Received HEADERS frame for Stream \${streamId}\`);
            
            // Decompress headers using HPACK
            const decompressedHeaders = this.decompressHeaders(frame.payload);
            
            for (const [name, value] of decompressedHeaders) {
              if (name === ':status') {
                response.status = parseInt(value);
                console.log(\`       📊 Status: \${value}\`);
              } else {
                response.headers.set(name, value);
                console.log(\`       📋 \${name}: \${value}\`);
              }
            }
            
            // Check if END_STREAM flag is set
            if (frame.flags & 0x01) {
              stream.state = 'closed';
              resolve(response);
            } else {
              stream.state = 'half-closed-remote';
            }
            break;
            
          case 'DATA':
            console.log(\`     📦 Received DATA frame for Stream \${streamId} (\${frame.payload.length} bytes)\`);
            
            response.body = Buffer.concat([response.body, frame.payload]);
            
            // Send WINDOW_UPDATE to maintain flow control
            this.sendWindowUpdate(streamId, frame.payload.length);
            
            // Check if END_STREAM flag is set
            if (frame.flags & 0x01) {
              stream.state = 'closed';
              console.log(\`     ✅ Stream \${streamId} complete (\${response.body.length} bytes total)\`);
              resolve(response);
            }
            break;
            
          case 'RST_STREAM':
            console.error(\`     ❌ Stream \${streamId} reset by server\`);
            stream.state = 'closed';
            reject(new Error(\`Stream reset: \${frame.payload.errorCode}\`));
            break;
        }
      };
      
      // Simulate receiving response frames
      setTimeout(() => this.simulateResponse(streamId, frameHandler), 100 + Math.random() * 200);
    });
  }
  
  /**
   * Handle Server Push (when server proactively sends resources)
   */
  private handleServerPush(pushPromiseFrame: HTTP2Frame): void {
    console.log(\`\\n🚀 Server Push received!\`);
    console.log(\`   🆔 Promised Stream ID: \${pushPromiseFrame.payload.promisedStreamId}\`);
    
    // Decompress promised request headers
    const promisedHeaders = this.decompressHeaders(pushPromiseFrame.payload.headers);
    
    console.log(\`   📋 Promised Resource:\`);
    for (const [name, value] of promisedHeaders) {
      console.log(\`     \${name}: \${value}\`);
    }
    
    // Client can choose to accept or reject the push
    const shouldAccept = this.evaluateServerPush(promisedHeaders);
    
    if (shouldAccept) {
      console.log(\`   ✅ Accepting server push\`);
      // Wait for the pushed resource data
      this.waitForPushedResource(pushPromiseFrame.payload.promisedStreamId);
    } else {
      console.log(\`   ❌ Rejecting server push (already cached)\`);
      // Send RST_STREAM to cancel the push
      this.sendRstStream(pushPromiseFrame.payload.promisedStreamId, 8); // CANCEL error code
    }
  }
  
  /**
   * Demonstrate HTTP/2 performance benefits
   */
  async benchmarkPerformance(): Promise<void> {
    console.log(\`\\n📊 HTTP/2 Performance Benchmark\`);
    
    // Simulate loading a typical web page
    const resources = [
      { path: '/index.html', type: 'document' },
      { path: '/styles/main.css', type: 'stylesheet' },
      { path: '/styles/theme.css', type: 'stylesheet' },
      { path: '/js/app.js', type: 'script' },
      { path: '/js/vendor.js', type: 'script' },
      { path: '/api/user', type: 'xhr' },
      { path: '/api/config', type: 'xhr' },
      { path: '/images/logo.png', type: 'image' },
      { path: '/images/hero.jpg', type: 'image' },
      { path: '/fonts/roboto.woff2', type: 'font' }
    ];
    
    console.log(\`🌐 Loading web page with \${resources.length} resources...\`);
    
    const startTime = Date.now();
    
    // In HTTP/1.1, these would be limited by connection pool (typically 6-8 concurrent)
    // In HTTP/2, all requests can be sent immediately over single connection
    const responses = await this.makeRequests(resources);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(\`\\n📈 Performance Results:\`);
    console.log(\`   ⏱️  Total Load Time: \${totalTime}ms\`);
    console.log(\`   🌊 Concurrent Streams: \${responses.length}\`);
    console.log(\`   📦 Total Data: \${this.calculateTotalBytes(responses)} bytes\`);
    console.log(\`   🔗 Connections Used: 1 (vs 6-8 for HTTP/1.1)\`);
    
    // Calculate theoretical HTTP/1.1 time
    const http11Time = this.calculateHTTP11Time(resources);
    const improvement = ((http11Time - totalTime) / http11Time * 100).toFixed(1);
    
    console.log(\`\\n⚡ HTTP/2 Performance Improvement:\`);
    console.log(\`   📊 HTTP/1.1 estimated time: \${http11Time}ms\`);
    console.log(\`   📊 HTTP/2 actual time: \${totalTime}ms\`);
    console.log(\`   🚀 Performance improvement: \${improvement}% faster\`);
  }
  
  // Helper methods for HTTP/2 protocol implementation
  
  private allocateStreamId(): number {
    this.connection.maxStreamId += 2; // Client-initiated streams are odd
    return this.connection.maxStreamId;
  }
  
  private async sendConnectionPreface(): Promise<void> {
    // HTTP/2 connection preface: "PRI * HTTP/2.0\\r\\n\\r\\nSM\\r\\n\\r\\n"
    const preface = Buffer.from("PRI * HTTP/2.0\\r\\n\\r\\nSM\\r\\n\\r\\n");
    await this.socket.write(preface);
    console.log(\`   📤 Sent connection preface\`);
  }
  
  private async exchangeSettings(): Promise<void> {
    const settingsFrame: HTTP2Frame = {
      type: 'SETTINGS',
      flags: 0x00,
      streamId: 0,
      payload: Array.from(this.connection.settings.entries())
    };
    
    await this.sendFrame(settingsFrame);
    console.log(\`   ⚙️  Sent SETTINGS frame\`);
    
    // In real implementation, would wait for server SETTINGS and SETTINGS ACK
  }
  
  private compressHeaders(headers: Map<string, string>): Buffer {
    // Simplified HPACK compression simulation
    const headerStrings = Array.from(headers.entries())
      .map(([name, value]) => \`\${name}: \${value}\`)
      .join('\\n');
    
    // Real HPACK would use dynamic table and Huffman coding
    // This is a simplified representation
    const compressed = Buffer.from(headerStrings);
    
    // Simulate compression ratio (typically 70-90% compression)
    const compressionRatio = 0.8;
    return compressed.slice(0, Math.floor(compressed.length * compressionRatio));
  }
  
  private decompressHeaders(compressedData: Buffer): Map<string, string> {
    // Simplified HPACK decompression simulation
    const headerString = compressedData.toString();
    const headers = new Map<string, string>();
    
    // Parse simulated compressed format
    const lines = headerString.split('\\n').filter(line => line.includes(':'));
    for (const line of lines) {
      const [name, ...valueParts] = line.split(': ');
      headers.set(name.trim(), valueParts.join(': ').trim());
    }
    
    return headers;
  }
  
  private calculateHeaderSize(headers: Map<string, string>): number {
    let size = 0;
    for (const [name, value] of headers) {
      size += name.length + value.length + 4; // +4 for ": " and "\\r\\n"
    }
    return size;
  }
  
  private async sendFrame(frame: HTTP2Frame): Promise<void> {
    // Simulate frame serialization and sending
    console.log(\`     📤 Sending \${frame.type} frame (Stream \${frame.streamId})\`);
    
    // In real implementation: serialize frame with 9-byte header + payload
    // Frame format: Length(24) + Type(8) + Flags(8) + R(1) + Stream ID(31) + Payload
    
    await this.socket.write(this.serializeFrame(frame));
  }
  
  private sendWindowUpdate(streamId: number, increment: number): void {
    const windowUpdateFrame: HTTP2Frame = {
      type: 'WINDOW_UPDATE',
      flags: 0x00,
      streamId: streamId,
      payload: { increment }
    };
    
    this.sendFrame(windowUpdateFrame);
    console.log(\`     📈 Sent WINDOW_UPDATE for Stream \${streamId} (+\${increment} bytes)\`);
  }
  
  private sendRstStream(streamId: number, errorCode: number): void {
    const rstFrame: HTTP2Frame = {
      type: 'RST_STREAM',
      flags: 0x00,
      streamId: streamId,
      payload: { errorCode }
    };
    
    this.sendFrame(rstFrame);
  }
  
  private evaluateServerPush(headers: Map<string, string>): boolean {
    // Simplified push evaluation - check if resource is already cached
    const path = headers.get(':path') || '';
    
    // In real implementation, would check browser cache
    const isAlreadyCached = Math.random() < 0.3; // 30% chance already cached
    
    return !isAlreadyCached;
  }
  
  private async waitForPushedResource(streamId: number): Promise<void> {
    console.log(\`   ⏳ Waiting for pushed resource on Stream \${streamId}\`);
    // Implementation would handle DATA frames for pushed resource
  }
  
  private calculateTotalBytes(responses: any[]): number {
    return responses.reduce((total, response) => {
      return total + (response.body ? response.body.length : 0);
    }, 0);
  }
  
  private calculateHTTP11Time(resources: any[]): number {
    // Simulate HTTP/1.1 performance with 6 parallel connections
    const parallelConnections = 6;
    const batches = Math.ceil(resources.length / parallelConnections);
    const avgRequestTime = 150; // ms per request including latency
    
    return batches * avgRequestTime;
  }
  
  // Mock implementations for browser environment compatibility
  
  private async establishTLSConnection(): Promise<any> {
    console.log(\`   🔒 Establishing TLS connection with ALPN h2\`);
    
    // Simulate TLS handshake delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      write: async (data: Buffer) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    };
  }
  
  private createHPACKEncoder(): any {
    return {
      encode: (headers: Map<string, string>) => this.compressHeaders(headers)
    };
  }
  
  private createHPACKDecoder(): any {
    return {
      decode: (data: Buffer) => this.decompressHeaders(data)
    };
  }
  
  private serializeFrame(frame: HTTP2Frame): Buffer {
    // Simplified frame serialization
    const header = JSON.stringify({
      type: frame.type,
      flags: frame.flags,
      streamId: frame.streamId
    });
    
    const payload = JSON.stringify(frame.payload);
    
    return Buffer.concat([
      Buffer.from(header.length.toString(16).padStart(6, '0'), 'hex'),
      Buffer.from(header),
      Buffer.from(payload)
    ]);
  }
  
  private simulateResponse(streamId: number, frameHandler: (frame: HTTP2Frame) => void): void {
    // Simulate server response frames
    setTimeout(() => {
      // HEADERS frame with response
      frameHandler({
        type: 'HEADERS',
        flags: 0x04, // END_HEADERS
        streamId: streamId,
        payload: this.compressHeaders(new Map([
          [':status', '200'],
          ['content-type', 'application/json'],
          ['server', 'HTTP2-Server/1.0'],
          ['cache-control', 'max-age=3600']
        ]))
      });
    }, 50);
    
    setTimeout(() => {
      // DATA frame with response body
      const responseBody = JSON.stringify({
        message: "HTTP/2 response data",
        streamId: streamId,
        timestamp: new Date().toISOString()
      });
      
      frameHandler({
        type: 'DATA',
        flags: 0x01, // END_STREAM
        streamId: streamId,
        payload: Buffer.from(responseBody)
      });
    }, 100);
  }
}

// Usage Example: HTTP/2 Performance Demonstration
async function demonstrateHTTP2Client() {
  console.log("🚀 RFC 7540 HTTP/2 Client Demonstration");
  console.log("This shows the performance revolution that HTTP/2 brought to the web!");
  
  const client = new HTTP2Client("example.com", 443);
  
  try {
    // Phase 1: Establish connection
    await client.connect();
    
    // Phase 2: Demonstrate concurrent requests
    console.log("\\n=== Concurrent Request Demonstration ===");
    
    const webPageResources = [
      { path: "/", headers: { "accept": "text/html" } },
      { path: "/styles.css", headers: { "accept": "text/css" } },
      { path: "/app.js", headers: { "accept": "application/javascript" } },
      { path: "/api/data", headers: { "accept": "application/json" } }
    ];
    
    const responses = await client.makeRequests(webPageResources);
    
    console.log(\`\\n✅ Successfully loaded \${responses.length} resources concurrently!\`);
    
    // Phase 3: Performance benchmarking
    await client.benchmarkPerformance();
    
    console.log("\\n🎓 Key HTTP/2 Benefits Demonstrated:");
    console.log("• Multiplexing: All requests sent simultaneously over one connection");
    console.log("• Header Compression: HPACK reduces overhead by 70-90%");
    console.log("• Binary Protocol: Efficient parsing and processing");
    console.log("• Flow Control: Prevents fast senders from overwhelming receivers");
    console.log("• Stream Prioritization: Critical resources can be prioritized");
    
    console.log("\\n🌐 This is why modern web apps feel so responsive:");
    console.log("• Social media feeds load instantly");
    console.log("• E-commerce sites show products immediately");
    console.log("• Web applications feel like native apps");
    console.log("• Mobile browsing is finally fast and efficient");
    
  } catch (error) {
    console.error("❌ HTTP/2 demonstration failed:", error.message);
  }
}

// Export for use in other modules
export { HTTP2Client, type HTTP2Frame, type HTTP2Stream, type HTTP2Connection };
`;

export default { getCodeExample };