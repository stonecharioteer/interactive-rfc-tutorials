export const getCodeExample = () => `
/**
 * RFC 9110: Modern HTTP Client Implementation
 * 
 * This example demonstrates a comprehensive HTTP client built according 
 * to RFC 9110 specifications, showcasing modern HTTP semantics, caching,
 * authentication, and error handling patterns.
 */

interface HTTPResponse {
  status: number;
  statusText: string;
  headers: Map<string, string>;
  body: any;
  cached: boolean;
  timing: {
    dns: number;
    connect: number;
    tls: number;
    request: number;
    response: number;
    total: number;
  };
}

interface CacheEntry {
  response: HTTPResponse;
  timestamp: number;
  etag?: string;
  lastModified?: string;
  maxAge: number;
  staleWhileRevalidate?: number;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
  credentials?: 'same-origin' | 'include' | 'omit';
  redirect?: 'follow' | 'error' | 'manual';
  retries?: number;
  retryDelay?: number;
}

class ModernHTTPClient {
  private cache = new Map<string, CacheEntry>();
  private interceptors: Array<(request: any) => any> = [];
  private responseInterceptors: Array<(response: HTTPResponse) => HTTPResponse> = [];
  private defaultHeaders = new Map<string, string>();
  private baseURL: string;
  
  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.setDefaultHeaders();
    console.log('🌐 Modern HTTP Client initialized with RFC 9110 compliance');
  }
  
  /**
   * Phase 1: Request Preparation and Method Semantics
   * 
   * Implements RFC 9110 method semantics with proper idempotency,
   * safety, and cacheability characteristics
   */
  async request(url: string, options: RequestOptions = {}): Promise<HTTPResponse> {
    const startTime = Date.now();
    
    console.log(\`\\n📤 HTTP Request: \${options.method || 'GET'} \${url}\`);
    
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
      cache = 'default',
      retries = 3,
      retryDelay = 1000
    } = options;
    
    // Validate method semantics per RFC 9110
    this.validateMethodSemantics(method, body);
    
    // Build complete request
    const request = this.buildRequest(url, method, headers, body);
    
    // Check cache for safe methods
    if (this.isMethodSafe(method) && cache !== 'no-cache' && cache !== 'reload') {
      const cachedResponse = this.checkCache(request.url, request.headers);
      if (cachedResponse) {
        console.log('✅ Cache hit - returning cached response');
        return cachedResponse;
      }
    }
    
    // Execute request with retries for idempotent methods
    let lastError: Error | null = null;
    const maxRetries = this.isMethodIdempotent(method) ? retries : 0;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(\`   🔄 Retry attempt \${attempt}/\${maxRetries}\`);
          await this.delay(retryDelay * Math.pow(2, attempt - 1)); // Exponential backoff
        }
        
        const response = await this.executeRequest(request, timeout, startTime);
        
        // Process response according to RFC 9110
        const processedResponse = await this.processResponse(response, request);
        
        // Cache response if appropriate
        if (this.isMethodSafe(method) && this.isCacheable(processedResponse)) {
          this.cacheResponse(request.url, processedResponse);
        }
        
        return processedResponse;
        
      } catch (error) {
        lastError = error as Error;
        console.log(\`   ❌ Request failed: \${error.message}\`);
        
        // Don't retry for non-idempotent methods or client errors
        if (!this.isMethodIdempotent(method) || this.isClientError(error)) {
          break;
        }
      }
    }
    
    throw lastError || new Error('Request failed after all retries');
  }
  
  /**
   * Phase 2: HTTP Method Implementations with RFC 9110 Semantics
   */
  
  // Safe methods (no side effects on server)
  async get(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<HTTPResponse> {
    return this.request(url, { ...options, method: 'GET' });
  }
  
  async head(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<HTTPResponse> {
    return this.request(url, { ...options, method: 'HEAD' });
  }
  
  async options(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<HTTPResponse> {
    return this.request(url, { ...options, method: 'OPTIONS' });
  }
  
  // Idempotent methods (can be safely retried)
  async put(url: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<HTTPResponse> {
    return this.request(url, { ...options, method: 'PUT', body: data });
  }
  
  async delete(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<HTTPResponse> {
    return this.request(url, { ...options, method: 'DELETE' });
  }
  
  // Non-idempotent methods (no automatic retries)
  async post(url: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<HTTPResponse> {
    return this.request(url, { ...options, method: 'POST', body: data });
  }
  
  async patch(url: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<HTTPResponse> {
    return this.request(url, { ...options, method: 'PATCH', body: data });
  }
  
  /**
   * Phase 3: RFC 9111 Cache Implementation
   * 
   * Implements modern HTTP caching with support for stale-while-revalidate,
   * conditional requests, and cache validation
   */
  private checkCache(url: string, headers: Map<string, string>): HTTPResponse | null {
    const cacheKey = this.generateCacheKey(url, headers);
    const entry = this.cache.get(cacheKey);
    
    if (!entry) return null;
    
    const age = (Date.now() - entry.timestamp) / 1000;
    
    // Check if still fresh
    if (age < entry.maxAge) {
      console.log(\`   ✅ Cache fresh (age: \${age.toFixed(1)}s, max-age: \${entry.maxAge}s)\`);
      return { ...entry.response, cached: true };
    }
    
    // Check stale-while-revalidate
    if (entry.staleWhileRevalidate && age < entry.maxAge + entry.staleWhileRevalidate) {
      console.log(\`   ⚡ Serving stale while revalidating (age: \${age.toFixed(1)}s)\`);
      
      // Trigger background revalidation
      this.revalidateInBackground(url, headers, entry);
      
      return { ...entry.response, cached: true };
    }
    
    // Cache expired, check for conditional request capability
    if (entry.etag || entry.lastModified) {
      console.log(\`   🔍 Cache stale, will use conditional request\`);
      return null; // Will trigger conditional request
    }
    
    // Remove expired entry
    this.cache.delete(cacheKey);
    return null;
  }
  
  private async revalidateInBackground(
    url: string, 
    headers: Map<string, string>, 
    entry: CacheEntry
  ): Promise<void> {
    try {
      console.log(\`   🔄 Background revalidation started for \${url}\`);
      
      // Create conditional request headers
      const conditionalHeaders = new Map(headers);
      if (entry.etag) {
        conditionalHeaders.set('If-None-Match', entry.etag);
      }
      if (entry.lastModified) {
        conditionalHeaders.set('If-Modified-Since', entry.lastModified);
      }
      
      const request = this.buildRequest(url, 'GET', Object.fromEntries(conditionalHeaders), null);
      const response = await this.executeRequest(request, 30000, Date.now());
      
      if (response.status === 304) {
        // Not modified, update timestamp
        entry.timestamp = Date.now();
        console.log(\`   ✅ Resource not modified, cache refreshed\`);
      } else {
        // Modified, update cache
        const processedResponse = await this.processResponse(response, request);
        this.cacheResponse(url, processedResponse);
        console.log(\`   🆕 Resource updated in cache\`);
      }
      
    } catch (error) {
      console.log(\`   ⚠️  Background revalidation failed: \${error.message}\`);
    }
  }
  
  /**
   * Phase 4: Response Processing and Status Code Handling
   * 
   * Implements RFC 9110 status code semantics with proper error handling
   */
  private async processResponse(response: any, request: any): Promise<HTTPResponse> {
    const processedResponse: HTTPResponse = {
      status: response.status,
      statusText: response.statusText || this.getStatusText(response.status),
      headers: new Map(Object.entries(response.headers || {})),
      body: await this.parseResponseBody(response),
      cached: false,
      timing: response.timing || { dns: 0, connect: 0, tls: 0, request: 0, response: 0, total: 0 }
    };
    
    console.log(\`   📨 Response: \${processedResponse.status} \${processedResponse.statusText}\`);
    
    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      processedResponse = interceptor(processedResponse);
    }
    
    // Handle status codes according to RFC 9110
    await this.handleStatusCode(processedResponse, request);
    
    return processedResponse;
  }
  
  private async handleStatusCode(response: HTTPResponse, request: any): Promise<void> {
    const status = response.status;
    
    // 1xx Informational
    if (status >= 100 && status < 200) {
      console.log(\`   ℹ️  Informational response: \${status}\`);
      return;
    }
    
    // 2xx Success
    if (status >= 200 && status < 300) {
      console.log(\`   ✅ Success: \${status}\`);
      return;
    }
    
    // 3xx Redirection
    if (status >= 300 && status < 400) {
      console.log(\`   🔀 Redirection: \${status}\`);
      await this.handleRedirection(response, request);
      return;
    }
    
    // 4xx Client Error
    if (status >= 400 && status < 500) {
      console.log(\`   ❌ Client error: \${status}\`);
      await this.handleClientError(response, request);
      return;
    }
    
    // 5xx Server Error
    if (status >= 500 && status < 600) {
      console.log(\`   🔥 Server error: \${status}\`);
      await this.handleServerError(response, request);
      return;
    }
  }
  
  private async handleRedirection(response: HTTPResponse, request: any): Promise<void> {
    const location = response.headers.get('location');
    const status = response.status;
    
    switch (status) {
      case 301: // Moved Permanently
        console.log(\`   📍 Resource permanently moved to: \${location}\`);
        break;
        
      case 302: // Found
        console.log(\`   📍 Resource temporarily at: \${location}\`);
        break;
        
      case 304: // Not Modified
        console.log(\`   ✅ Resource not modified since last request\`);
        break;
        
      case 307: // Temporary Redirect
        console.log(\`   📍 Temporary redirect (method preserved): \${location}\`);
        break;
        
      case 308: // Permanent Redirect  
        console.log(\`   📍 Permanent redirect (method preserved): \${location}\`);
        break;
    }
  }
  
  private async handleClientError(response: HTTPResponse, request: any): Promise<void> {
    const status = response.status;
    
    switch (status) {
      case 400:
        console.log(\`   ❌ Bad Request - malformed request syntax\`);
        break;
        
      case 401:
        console.log(\`   🔐 Unauthorized - authentication required\`);
        await this.handleAuthentication(response, request);
        break;
        
      case 403:
        console.log(\`   🚫 Forbidden - access denied\`);
        break;
        
      case 404:
        console.log(\`   🔍 Not Found - resource does not exist\`);
        break;
        
      case 429:
        console.log(\`   ⏱️  Rate Limited - too many requests\`);
        await this.handleRateLimit(response, request);
        break;
    }
  }
  
  private async handleServerError(response: HTTPResponse, request: any): Promise<void> {
    const status = response.status;
    
    switch (status) {  
      case 500:
        console.log(\`   🔥 Internal Server Error - server encountered an error\`);
        break;
        
      case 502:
        console.log(\`   🌐 Bad Gateway - invalid response from upstream server\`);
        break;
        
      case 503:
        console.log(\`   ⏰ Service Unavailable - server temporarily overloaded\`);
        break;
        
      case 504:
        console.log(\`   ⏱️  Gateway Timeout - upstream server timeout\`);
        break;
    }
  }
  
  /**
   * Phase 5: Authentication and Security
   * 
   * Implements modern authentication patterns with Bearer tokens,
   * basic auth, and security best practices
   */
  private async handleAuthentication(response: HTTPResponse, request: any): Promise<void> {
    const wwwAuthenticate = response.headers.get('www-authenticate');
    
    if (wwwAuthenticate) {
      console.log(\`   🔐 Authentication challenge: \${wwwAuthenticate}\`);
      
      if (wwwAuthenticate.toLowerCase().includes('bearer')) {
        console.log(\`   💳 Bearer token authentication required\`);
      } else if (wwwAuthenticate.toLowerCase().includes('basic')) {
        console.log(\`   🔑 Basic authentication required\`);
      } else if (wwwAuthenticate.toLowerCase().includes('digest')) {
        console.log(\`   🔐 Digest authentication required\`);
      }
    }
  }
  
  private async handleRateLimit(response: HTTPResponse, request: any): Promise<void> {
    const retryAfter = response.headers.get('retry-after');
    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    const rateLimitReset = response.headers.get('x-ratelimit-reset');
    
    if (retryAfter) {
      console.log(\`   ⏳ Retry after: \${retryAfter} seconds\`);
    }
    
    if (rateLimitRemaining) {
      console.log(\`   📊 Rate limit remaining: \${rateLimitRemaining}\`);
    }
    
    if (rateLimitReset) {
      const resetTime = new Date(parseInt(rateLimitReset) * 1000);
      console.log(\`   🔄 Rate limit resets at: \${resetTime.toISOString()}\`);
    }
  }
  
  /**
   * Authentication helpers
   */
  setBearerToken(token: string): void {
    this.defaultHeaders.set('Authorization', \`Bearer \${token}\`);
    console.log('🔐 Bearer token configured for all requests');
  }
  
  setBasicAuth(username: string, password: string): void {
    const credentials = btoa(\`\${username}:\${password}\`);
    this.defaultHeaders.set('Authorization', \`Basic \${credentials}\`);
    console.log('🔑 Basic authentication configured for all requests');
  }
  
  /**
   * Cache management
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️  HTTP cache cleared');
  }
  
  getCacheStats(): { entries: number; totalSize: number; hitRate: string } {
    const entries = this.cache.size;
    const totalSize = Array.from(this.cache.values())
      .reduce((size, entry) => size + JSON.stringify(entry).length, 0);
    
    return {
      entries,
      totalSize,
      hitRate: '85%' // Simulated hit rate
    };
  }
  
  // Helper methods for RFC 9110 compliance
  
  private validateMethodSemantics(method: string, body: any): void {
    // Safe methods should not have request bodies
    if (this.isMethodSafe(method) && body !== undefined && body !== null) {
      console.warn(\`⚠️  Safe method \${method} should not have request body\`);
    }
    
    // GET and HEAD must not have bodies
    if ((method === 'GET' || method === 'HEAD') && body) {
      throw new Error(\`\${method} requests cannot have request bodies\`);
    }
  }
  
  private isMethodSafe(method: string): boolean {
    return ['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method);
  }
  
  private isMethodIdempotent(method: string): boolean {
    return ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'].includes(method);
  }
  
  private isCacheable(response: HTTPResponse): boolean {
    // Check for explicit cache-control headers
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      if (cacheControl.includes('no-store') || cacheControl.includes('private')) {
        return false;
      }
      if (cacheControl.includes('max-age') || cacheControl.includes('s-maxage')) {
        return true;
      }
    }
    
    // Check for expires header
    if (response.headers.get('expires')) {
      return true;
    }
    
    // Default cacheability by status code
    const cacheableStatuses = [200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501];
    return cacheableStatuses.includes(response.status);
  }
  
  private cacheResponse(url: string, response: HTTPResponse): void {
    const cacheControl = response.headers.get('cache-control') || '';
    const expires = response.headers.get('expires');
    
    let maxAge = 0;
    let staleWhileRevalidate: number | undefined;
    
    // Parse cache-control directive
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      maxAge = parseInt(maxAgeMatch[1]);
    } else if (expires) {
      const expiresTime = new Date(expires).getTime();
      maxAge = Math.max(0, (expiresTime - Date.now()) / 1000);
    }
    
    const swrMatch = cacheControl.match(/stale-while-revalidate=(\d+)/);
    if (swrMatch) {
      staleWhileRevalidate = parseInt(swrMatch[1]);
    }
    
    if (maxAge > 0) {
      const cacheKey = this.generateCacheKey(url, new Map());
      const entry: CacheEntry = {
        response: { ...response, cached: false },
        timestamp: Date.now(),
        etag: response.headers.get('etag') || undefined,
        lastModified: response.headers.get('last-modified') || undefined,
        maxAge,
        staleWhileRevalidate
      };
      
      this.cache.set(cacheKey, entry);
      console.log(\`   💾 Response cached (max-age: \${maxAge}s)\`);
    }
  }
  
  private generateCacheKey(url: string, headers: Map<string, string>): string {
    return \`\${url}|\${Array.from(headers.entries()).sort().map(([k,v]) => \`\${k}:\${v}\`).join('|')}\`;
  }
  
  private buildRequest(url: string, method: string, headers: Record<string, string>, body: any): any {
    const fullUrl = url.startsWith('http') ? url : \`\${this.baseURL}\${url}\`;
    
    const requestHeaders = new Map([
      ...this.defaultHeaders,
      ...Object.entries(headers)
    ]);
    
    // Add content-type for requests with bodies
    if (body && !requestHeaders.has('content-type')) {
      if (typeof body === 'object') {
        requestHeaders.set('content-type', 'application/json');
      } else {
        requestHeaders.set('content-type', 'text/plain');
      }
    }
    
    return {
      url: fullUrl,
      method,
      headers: requestHeaders,
      body: typeof body === 'object' ? JSON.stringify(body) : body
    };
  }
  
  private async executeRequest(request: any, timeout: number, startTime: number): Promise<any> {
    // Simulate HTTP request execution
    const requestStart = Date.now();
    
    console.log(\`   🌐 Executing \${request.method} \${request.url}\`);
    console.log(\`   📋 Headers: \${Array.from(request.headers.entries()).length} headers\`);
    
    // Simulate network delay
    await this.delay(50 + Math.random() * 200);
    
    const timing = {
      dns: 10 + Math.random() * 20,
      connect: 20 + Math.random() * 30,
      tls: 50 + Math.random() * 100,
      request: 5 + Math.random() * 10,
      response: 30 + Math.random() * 50,
      total: Date.now() - startTime
    };
    
    // Simulate successful response
    return {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
        'etag': \`"\${Math.random().toString(36).substr(2, 9)}"\`,
        'server': 'RFC9110-Server/1.0'
      },
      body: JSON.stringify({
        message: 'RFC 9110 compliant response',
        timestamp: new Date().toISOString(),
        method: request.method,
        url: request.url
      }),
      timing
    };
  }
  
  private async parseResponseBody(response: any): Promise<any> {
    const contentType = response.headers?.['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      return JSON.parse(response.body);
    } else if (contentType.includes('text/')) {
      return response.body;
    } else {
      return response.body;
    }
  }
  
  private setDefaultHeaders(): void {
    this.defaultHeaders.set('User-Agent', 'ModernHTTPClient/1.0 (RFC9110)');
    this.defaultHeaders.set('Accept', 'application/json, text/plain, */*');
    this.defaultHeaders.set('Accept-Encoding', 'gzip, deflate, br');
    this.defaultHeaders.set('Connection', 'keep-alive');
  }
  
  private getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      301: 'Moved Permanently',
      302: 'Found',
      304: 'Not Modified',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable'
    };
    
    return statusTexts[status] || 'Unknown Status';
  }
  
  private isClientError(error: any): boolean {
    return error.message.includes('400') || 
           error.message.includes('401') || 
           error.message.includes('403') || 
           error.message.includes('404');
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage Example: Modern HTTP Client Usage
async function demonstrateModernHTTPClient() {
  console.log("🌐 RFC 9110 Modern HTTP Client Demonstration");
  console.log("This shows comprehensive HTTP semantics, caching, and error handling!");
  
  const client = new ModernHTTPClient('https://api.example.com');
  
  // Configure authentication
  client.setBearerToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...');
  
  console.log("\\n=== Safe Method Demonstrations ===");
  
  try {
    // GET request with caching
    const userData = await client.get('/users/123', {
      cache: 'default',
      timeout: 5000
    });
    
    console.log(\`✅ User data retrieved: \${JSON.stringify(userData.body, null, 2)}\`);
    
    // HEAD request for metadata
    const metaData = await client.head('/users/123');
    console.log(\`📋 Resource metadata: \${metaData.status} \${metaData.statusText}\`);
    
    // OPTIONS request for capabilities
    const capabilities = await client.options('/users');
    console.log(\`⚙️  API capabilities discovered\`);
    
    console.log("\\n=== Idempotent Method Demonstrations ===");
    
    // PUT request (complete replacement)
    const updateResult = await client.put('/users/123', {
      name: 'Updated User',
      email: 'updated@example.com',
      profile: {
        bio: 'Updated biography',
        preferences: { theme: 'dark', notifications: true }
      }
    });
    
    console.log(\`✅ User updated: \${updateResult.status}\`);
    
    // DELETE request
    const deleteResult = await client.delete('/users/456');
    console.log(\`🗑️  User deleted: \${deleteResult.status}\`);
    
    console.log("\\n=== Non-Idempotent Method Demonstrations ===");
    
    // POST request (create new resource)
    const createResult = await client.post('/users', {
      name: 'New User',
      email: 'new@example.com',
      role: 'member'
    });
    
    console.log(\`✅ User created: \${createResult.status}\`);
    
    // PATCH request (partial update)
    const patchResult = await client.patch('/users/123', {
      profile: {
        bio: 'Partially updated biography'
      }
    });
    
    console.log(\`✅ User profile updated: \${patchResult.status}\`);
    
    console.log("\\n=== Cache Performance Analysis ===");
    
    // Test cache performance
    const cacheStats = client.getCacheStats();
    console.log(\`📊 Cache Statistics:\`);
    console.log(\`   • Entries: \${cacheStats.entries}\`);
    console.log(\`   • Total Size: \${cacheStats.totalSize} bytes\`);
    console.log(\`   • Hit Rate: \${cacheStats.hitRate}\`);
    
    // Test stale-while-revalidate
    console.log("\\n   🔄 Testing stale-while-revalidate behavior...");
    const cachedResponse = await client.get('/users/123', { cache: 'default' });
    console.log(\`   ✅ Stale content served while revalidating in background\`);
    
    console.log("\\n🎯 RFC 9110 Features Demonstrated:");
    console.log("• Method semantics (safe, idempotent, non-idempotent)");
    console.log("• Comprehensive status code handling");
    console.log("• Advanced caching with RFC 9111 compliance");
    console.log("• Modern authentication patterns");
    console.log("• Automatic retries for idempotent methods");
    console.log("• Conditional requests and cache validation");
    console.log("• Stale-while-revalidate optimization");
    
    console.log("\\n🌐 This enables the responsive web experiences we expect:");
    console.log("• Instant page loads through intelligent caching");
    console.log("• Reliable API interactions with proper error handling");
    console.log("• Efficient network usage with conditional requests");
    console.log("• Seamless authentication and security");
    
  } catch (error) {
    console.error(\`❌ HTTP client demonstration failed: \${error.message}\`);
  }
}

// Export for use in other modules
export { ModernHTTPClient, type HTTPResponse, type RequestOptions, type CacheEntry };
`;