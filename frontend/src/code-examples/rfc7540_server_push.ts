export const getCodeExample = () => `
/**
 * RFC 7540: HTTP/2 Server Push Implementation
 * 
 * This example demonstrates HTTP/2 Server Push functionality,
 * allowing servers to proactively send resources to clients
 * before they're requested, eliminating round-trip delays.
 */

interface PushResource {
  path: string;
  contentType: string;
  data: Buffer;
  priority: number;
  cacheHeaders: Record<string, string>;
}

interface ClientConnection {
  id: string;
  streams: Map<number, any>;
  settings: Map<string, number>;
  pushPromises: Map<string, number>; // path -> promised stream ID
  pushDisabled: boolean;
}

class HTTP2ServerPush {
  private connections = new Map<string, ClientConnection>();
  private pushResources = new Map<string, PushResource>();
  private pushStatistics = {
    promised: 0,
    accepted: 0,
    rejected: 0,
    cacheMisses: 0
  };
  
  constructor() {
    this.initializePushResources();
    console.log(\`🚀 HTTP/2 Server Push engine initialized\`);
  }
  
  /**
   * Phase 1: Analyze Request and Determine Push Candidates
   * 
   * When a client requests a primary resource (like HTML), analyze
   * what secondary resources they'll likely need and prepare push
   */
  async handlePrimaryRequest(
    connectionId: string,
    streamId: number,
    requestPath: string,
    requestHeaders: Map<string, string>
  ): Promise<void> {
    
    console.log(\`\\n📥 Processing primary request: \${requestPath}\`);
    
    const connection = this.connections.get(connectionId);
    if (!connection) {
      console.error(\`❌ Connection \${connectionId} not found\`);
      return;
    }
    
    // Check if client supports push
    if (connection.pushDisabled) {
      console.log(\`   ⚠️  Client has disabled server push\`);
      return this.sendRegularResponse(connectionId, streamId, requestPath);
    }
    
    // Analyze request to determine push candidates
    const pushCandidates = this.analyzePushCandidates(requestPath, requestHeaders);
    
    if (pushCandidates.length === 0) {
      console.log(\`   ℹ️  No push candidates identified for \${requestPath}\`);
      return this.sendRegularResponse(connectionId, streamId, requestPath);
    }
    
    console.log(\`   🎯 Identified \${pushCandidates.length} push candidates:\`);
    pushCandidates.forEach(candidate => {
      console.log(\`     • \${candidate.path} (priority: \${candidate.priority})\`);
    });
    
    // Send push promises before the main response
    await this.sendPushPromises(connectionId, streamId, pushCandidates);
    
    // Send the main response
    await this.sendRegularResponse(connectionId, streamId, requestPath);
    
    // Send pushed resources
    await this.sendPushedResources(connectionId, pushCandidates);
  }
  
  /**
   * Phase 2: Send PUSH_PROMISE Frames
   * 
   * Notify the client about resources we're about to push,
   * giving them a chance to cancel if they already have them cached
   */
  private async sendPushPromises(
    connectionId: string,
    parentStreamId: number,
    candidates: PushResource[]
  ): Promise<void> {
    
    console.log(\`\\n🤝 Sending PUSH_PROMISE frames for \${candidates.length} resources\`);
    
    const connection = this.connections.get(connectionId)!;
    
    for (const candidate of candidates) {
      const promisedStreamId = this.allocateStreamId(connection);
      
      // Check if we've already promised this resource
      if (connection.pushPromises.has(candidate.path)) {
        console.log(\`   ⚠️  Resource \${candidate.path} already promised\`);
        continue;
      }
      
      console.log(\`   📤 PUSH_PROMISE: \${candidate.path} (Stream \${promisedStreamId})\`);
      
      // Create push promise headers
      const promiseHeaders = new Map([
        [':method', 'GET'],
        [':path', candidate.path],
        [':scheme', 'https'],
        [':authority', 'example.com']
      ]);
      
      // Send PUSH_PROMISE frame
      const pushPromiseFrame = {
        type: 'PUSH_PROMISE',
        flags: 0x04, // END_HEADERS
        streamId: parentStreamId,
        payload: {
          promisedStreamId: promisedStreamId,
          headers: this.compressHeaders(promiseHeaders)
        }
      };
      
      await this.sendFrame(connectionId, pushPromiseFrame);
      
      // Track the promise
      connection.pushPromises.set(candidate.path, promisedStreamId);
      this.pushStatistics.promised++;
      
      console.log(\`     ✅ Promised \${candidate.path} on Stream \${promisedStreamId}\`);
    }
  }
  
  /**
   * Phase 3: Send Pushed Resource Data
   * 
   * After sending promises, actually deliver the pushed resources
   * unless the client has cancelled them with RST_STREAM
   */
  private async sendPushedResources(
    connectionId: string,
    candidates: PushResource[]
  ): Promise<void> {
    
    console.log(\`\\n📦 Sending pushed resource data\`);
    
    const connection = this.connections.get(connectionId)!;
    
    // Sort by priority (higher number = higher priority)
    const sortedCandidates = candidates.sort((a, b) => b.priority - a.priority);
    
    for (const resource of sortedCandidates) {
      const streamId = connection.pushPromises.get(resource.path);
      
      if (!streamId) {
        console.log(\`   ⚠️  No stream ID found for \${resource.path}\`);
        continue;
      }
      
      // Check if client cancelled the push
      const stream = connection.streams.get(streamId);
      if (stream?.cancelled) {
        console.log(\`   ❌ Client cancelled push for \${resource.path}\`);
        this.pushStatistics.rejected++;
        continue;
      }
      
      console.log(\`   📤 Pushing \${resource.path} (\${resource.data.length} bytes)\`);
      
      // Send response headers
      const responseHeaders = new Map([
        [':status', '200'],
        ['content-type', resource.contentType],
        ['content-length', resource.data.length.toString()],
        ...Object.entries(resource.cacheHeaders)
      ]);
      
      const headersFrame = {
        type: 'HEADERS',
        flags: 0x04, // END_HEADERS
        streamId: streamId,
        payload: this.compressHeaders(responseHeaders)
      };
      
      await this.sendFrame(connectionId, headersFrame);
      
      // Send response data
      const dataFrame = {
        type: 'DATA',
        flags: 0x01, // END_STREAM
        streamId: streamId,
        payload: resource.data
      };
      
      await this.sendFrame(connectionId, dataFrame);
      
      this.pushStatistics.accepted++;
      console.log(\`     ✅ Successfully pushed \${resource.path}\`);
    }
  }
  
  /**
   * Analyze incoming request to determine what resources to push
   */
  private analyzePushCandidates(
    requestPath: string,
    requestHeaders: Map<string, string>
  ): PushResource[] {
    
    const candidates: PushResource[] = [];
    const userAgent = requestHeaders.get('user-agent') || '';
    const acceptEncoding = requestHeaders.get('accept-encoding') || '';
    
    // HTML pages - push critical CSS and JS
    if (requestPath === '/' || requestPath.endsWith('.html')) {
      console.log(\`   🔍 Analyzing HTML page request\`);
      
      // Always push critical CSS
      const criticalCSS = this.pushResources.get('/css/critical.css');
      if (criticalCSS) {
        candidates.push({ ...criticalCSS, priority: 10 });
      }
      
      // Push application JavaScript
      const appJS = this.pushResources.get('/js/app.js');
      if (appJS) {
        candidates.push({ ...appJS, priority: 8 });
      }
      
      // Push web fonts for faster text rendering
      const webFont = this.pushResources.get('/fonts/roboto.woff2');
      if (webFont && acceptEncoding.includes('woff2')) {
        candidates.push({ ...webFont, priority: 7 });
      }
      
      // Mobile-specific optimizations
      if (this.isMobileUserAgent(userAgent)) {
        const mobileCSS = this.pushResources.get('/css/mobile.css');
        if (mobileCSS) {
          candidates.push({ ...mobileCSS, priority: 9 });
        }
      }
    }
    
    // API endpoints - push related data
    if (requestPath.startsWith('/api/')) {
      console.log(\`   🔍 Analyzing API request\`);
      
      if (requestPath === '/api/user') {
        // When user data is requested, likely need user preferences too
        const userPrefs = this.pushResources.get('/api/user/preferences');
        if (userPrefs) {
          candidates.push({ ...userPrefs, priority: 6 });
        }
      }
      
      if (requestPath === '/api/dashboard') {
        // Dashboard requests often need config and notifications
        const config = this.pushResources.get('/api/config');
        const notifications = this.pushResources.get('/api/notifications');
        
        if (config) candidates.push({ ...config, priority: 5 });
        if (notifications) candidates.push({ ...notifications, priority: 4 });
      }
    }
    
    // E-commerce specific optimizations
    if (requestPath.includes('/product/')) {
      console.log(\`   🔍 Analyzing product page request\`);
      
      // Push product images and related products
      const productImages = this.pushResources.get('/images/product-gallery.jpg');
      const relatedProducts = this.pushResources.get('/api/products/related');
      
      if (productImages) candidates.push({ ...productImages, priority: 8 });
      if (relatedProducts) candidates.push({ ...relatedProducts, priority: 6 });
    }
    
    return candidates;
  }
  
  /**
   * Handle client's RST_STREAM frame (push cancellation)
   */
  handlePushCancellation(connectionId: string, streamId: number, errorCode: number): void {
    console.log(\`\\n❌ Client cancelled push on Stream \${streamId} (error: \${errorCode})\`);
    
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    
    // Find and mark the stream as cancelled
    const stream = connection.streams.get(streamId);
    if (stream) {
      stream.cancelled = true;
      this.pushStatistics.rejected++;
      
      // Find which resource was cancelled
      for (const [path, promisedStreamId] of connection.pushPromises) {
        if (promisedStreamId === streamId) {
          console.log(\`   📋 Cancelled resource: \${path}\`);
          
          // Update push strategy based on cancellation patterns
          this.updatePushStrategy(path, 'cancelled');
          break;
        }
      }
    }
  }
  
  /**
   * Update push strategy based on client behavior
   */
  private updatePushStrategy(resourcePath: string, outcome: 'accepted' | 'cancelled' | 'unused'): void {
    // In a real implementation, this would use machine learning or analytics
    // to improve push predictions based on user behavior patterns
    
    console.log(\`   📊 Updating push strategy for \${resourcePath}: \${outcome}\`);
    
    const resource = this.pushResources.get(resourcePath);
    if (resource) {
      switch (outcome) {
        case 'accepted':
          resource.priority = Math.min(resource.priority + 1, 10);
          break;
        case 'cancelled':
          resource.priority = Math.max(resource.priority - 1, 1);
          break;
        case 'unused':
          resource.priority = Math.max(resource.priority - 0.5, 1);
          break;
      }
      
      console.log(\`     📈 New priority for \${resourcePath}: \${resource.priority}\`);
    }
  }
  
  /**
   * Generate comprehensive push performance report  
   */
  generatePushReport(): string {
    const successRate = this.pushStatistics.promised > 0 
      ? ((this.pushStatistics.accepted / this.pushStatistics.promised) * 100).toFixed(1)
      : '0.0';
    
    const rejectionRate = this.pushStatistics.promised > 0
      ? ((this.pushStatistics.rejected / this.pushStatistics.promised) * 100).toFixed(1) 
      : '0.0';
    
    return \`
🔍 HTTP/2 Server Push Performance Report
=======================================

📊 Push Statistics:
   • Total Promises Sent: \${this.pushStatistics.promised}
   • Successfully Accepted: \${this.pushStatistics.accepted}
   • Client Rejections: \${this.pushStatistics.rejected}
   • Cache Misses: \${this.pushStatistics.cacheMisses}

📈 Performance Metrics:
   • Push Success Rate: \${successRate}%
   • Push Rejection Rate: \${rejectionRate}%
   • Active Connections: \${this.connections.size}

🎯 Top Push Resources:
\${Array.from(this.pushResources.entries())
  .sort(([,a], [,b]) => b.priority - a.priority)
  .slice(0, 5)
  .map(([path, resource]) => \`   • \${path} (priority: \${resource.priority})\`)
  .join('\\n')}

💡 RFC 7540 Server Push Benefits:
   ✅ Eliminates round-trip delays for critical resources
   ✅ Reduces time-to-first-paint and time-to-interactive
   ✅ Enables proactive resource delivery based on patterns
   ✅ Improves mobile performance on high-latency networks
   ✅ Allows intelligent cache warming strategies

⚠️  Server Push Considerations:
   • Careful analysis needed to avoid pushing unwanted resources
   • Client cache state awareness important for efficiency
   • Network conditions affect push effectiveness
   • HTTP/3 focuses more on 0-RTT and early data instead
    \`.trim();
  }
  
  // Helper methods for server implementation
  
  private initializePushResources(): void {
    // Critical CSS - highest priority
    this.pushResources.set('/css/critical.css', {
      path: '/css/critical.css',
      contentType: 'text/css',
      data: Buffer.from(\`
        /* Critical above-the-fold styles */
        body { font-family: -apple-system, sans-serif; margin: 0; }
        .header { background: #007bff; color: white; padding: 1rem; }
        .main { max-width: 1200px; margin: 0 auto; padding: 2rem; }
      \`),
      priority: 10,
      cacheHeaders: {
        'cache-control': 'public, max-age=31536000',
        'etag': '"css-v1.2"'
      }
    });
    
    // Application JavaScript
    this.pushResources.set('/js/app.js', {
      path: '/js/app.js', 
      contentType: 'application/javascript',
      data: Buffer.from(\`
        // Main application JavaScript
        console.log('App initialized via HTTP/2 Server Push!');
        
        // Initialize critical functionality
        document.addEventListener('DOMContentLoaded', function() {
          // App startup code
          window.App = { version: '2.1.0', pushEnabled: true };
        });
      \`),
      priority: 8,
      cacheHeaders: {
        'cache-control': 'public, max-age=86400',
        'etag': '"js-v2.1"'
      }
    });
    
    // Web font
    this.pushResources.set('/fonts/roboto.woff2', {
      path: '/fonts/roboto.woff2',
      contentType: 'font/woff2',
      data: Buffer.from('WOFF2 font data...'), // Simulated
      priority: 7,
      cacheHeaders: {
        'cache-control': 'public, max-age=31536000, immutable',
        'etag': '"font-roboto-v1"'
      }
    });
    
    // API responses for common endpoints
    this.pushResources.set('/api/user/preferences', {
      path: '/api/user/preferences',
      contentType: 'application/json',
      data: Buffer.from(JSON.stringify({
        theme: 'light',
        language: 'en',
        notifications: true,
        timezone: 'America/New_York'
      })),
      priority: 6,
      cacheHeaders: {
        'cache-control': 'private, max-age=300',
        'etag': '"prefs-v1"'
      }
    });
    
    console.log(\`   📚 Initialized \${this.pushResources.size} push resources\`);
  }
  
  private allocateStreamId(connection: ClientConnection): number {
    // Server-initiated streams are even numbers
    let streamId = 2;
    while (connection.streams.has(streamId)) {
      streamId += 2;
    }
    
    connection.streams.set(streamId, { id: streamId, cancelled: false });
    return streamId;
  }
  
  private compressHeaders(headers: Map<string, string>): Buffer {
    // Simplified HPACK compression
    const headerString = Array.from(headers.entries())
      .map(([name, value]) => \`\${name}: \${value}\`)
      .join('\\n');
    
    return Buffer.from(headerString);
  }
  
  private async sendFrame(connectionId: string, frame: any): Promise<void> {
    // Simulate sending HTTP/2 frame to client
    console.log(\`     📤 \${frame.type} frame sent (Stream \${frame.streamId})\`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  private async sendRegularResponse(connectionId: string, streamId: number, path: string): Promise<void> {
    console.log(\`   📤 Sending regular response for \${path}\`);
    
    // Send response headers
    const headers = new Map([
      [':status', '200'],
      ['content-type', 'text/html'],
      ['server', 'HTTP2-Push-Server/1.0']
    ]);
    
    await this.sendFrame(connectionId, {
      type: 'HEADERS',
      flags: 0x04,
      streamId: streamId,
      payload: this.compressHeaders(headers)
    });
    
    // Send response body
    const htmlContent = \`
      <!DOCTYPE html>
      <html>
      <head>
        <title>HTTP/2 Server Push Demo</title>
        <link rel="stylesheet" href="/css/critical.css">
      </head>
      <body>
        <div class="header">HTTP/2 Server Push Demo</div>
        <div class="main">
          <h1>Welcome!</h1>
          <p>This page's resources were pushed via HTTP/2 Server Push!</p>
        </div>
        <script src="/js/app.js"></script>
      </body>
      </html>
    \`;
    
    await this.sendFrame(connectionId, {
      type: 'DATA',
      flags: 0x01,
      streamId: streamId,
      payload: Buffer.from(htmlContent)
    });
  }
  
  private isMobileUserAgent(userAgent: string): boolean {
    return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }
}

// Usage Example: Server Push Optimization
async function demonstrateServerPush() {
  console.log("🚀 RFC 7540 HTTP/2 Server Push Demonstration");
  console.log("This shows how servers can eliminate round-trip delays!");
  
  const pushServer = new HTTP2ServerPush();
  
  // Simulate client connection
  const connectionId = "conn-123";
  
  console.log("\\n=== Simulating Client Requests ===");
  
  // Simulate various request scenarios
  const requestScenarios = [
    {
      path: "/",
      headers: new Map([
        ['user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'],
        ['accept-encoding', 'gzip, deflate, br, woff2']
      ])
    },
    {
      path: "/api/user",
      headers: new Map([
        ['accept', 'application/json'],
        ['authorization', 'Bearer token123']
      ])
    },
    {
      path: "/product/laptop-123",
      headers: new Map([
        ['accept', 'text/html'],
        ['user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)']
      ])
    }
  ];
  
  let streamId = 1;
  
  for (const scenario of requestScenarios) {
    console.log(\`\\n--- Request Scenario \${streamId} ---\`);
    
    await pushServer.handlePrimaryRequest(
      connectionId,
      streamId,
      scenario.path,
      scenario.headers
    );
    
    streamId += 2; // Client-initiated streams are odd
  }
  
  console.log("\\n=== Push Strategy Analysis ===");
  console.log(pushServer.generatePushReport());
  
  console.log("\\n🌐 Real-World Server Push Impact:");
  console.log("• Critical CSS pushed → Faster first paint");
  console.log("• JavaScript pushed → Reduced time-to-interactive");
  console.log("• Web fonts pushed → No font loading delays");
  console.log("• API data pushed → Instant application state");
  
  console.log("\\n⚡ Performance Benefits:");
  console.log("• 20-50% reduction in page load time");
  console.log("• Eliminates multiple round-trip delays");
  console.log("• Especially effective on high-latency mobile networks");
  console.log("• Enables sub-second web application startup");
  
  console.log("\\n🤔 Why Server Push Lost Favor:");
  console.log("• Difficult to predict what clients need");
  console.log("• Risk of pushing already-cached resources");
  console.log("• HTTP/3 focuses on 0-RTT and early data instead");
  console.log("• Complex cache state management required");
}

// Export for use in other modules
export { HTTP2ServerPush, type PushResource, type ClientConnection };
`;

export default { getCodeExample };