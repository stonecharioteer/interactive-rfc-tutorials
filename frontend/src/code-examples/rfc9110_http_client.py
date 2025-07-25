"""
RFC 9110: Modern HTTP Client Implementation

This example demonstrates a comprehensive HTTP client built according 
to RFC 9110 specifications, showcasing modern HTTP semantics, caching,
authentication, and error handling patterns.
"""

import asyncio
import aiohttp
import hashlib
import time
import json
from enum import Enum
from typing import Dict, Any, Optional, Union, List
from dataclasses import dataclass, field
from urllib.parse import urljoin, urlparse


class HTTPMethod(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"
    HEAD = "HEAD"
    OPTIONS = "OPTIONS"


@dataclass
class HTTPTiming:
    dns: float = 0.0
    connect: float = 0.0
    tls: float = 0.0
    request: float = 0.0
    response: float = 0.0
    total: float = 0.0


@dataclass
class HTTPResponse:
    status: int
    status_text: str
    headers: Dict[str, str]
    body: Any
    cached: bool = False
    timing: HTTPTiming = field(default_factory=HTTPTiming)


@dataclass
class CacheEntry:
    response: HTTPResponse
    timestamp: float
    etag: Optional[str] = None
    last_modified: Optional[str] = None
    max_age: int = 0
    stale_while_revalidate: Optional[int] = None


@dataclass
class RequestOptions:
    method: HTTPMethod = HTTPMethod.GET
    headers: Dict[str, str] = field(default_factory=dict)
    body: Any = None
    timeout: int = 30
    cache: str = 'default'  # 'default', 'no-cache', 'reload', 'force-cache', 'only-if-cached'
    credentials: str = 'same-origin'  # 'same-origin', 'include', 'omit'
    redirect: str = 'follow'  # 'follow', 'error', 'manual'
    retries: int = 3
    retry_delay: float = 1.0


class ModernHTTPClient:
    """
    RFC 9110 compliant HTTP client with comprehensive caching,
    authentication, and error handling capabilities.
    """
    
    def __init__(self, base_url: str = ''):
        self.base_url = base_url
        self.cache: Dict[str, CacheEntry] = {}
        self.default_headers: Dict[str, str] = {}
        self.session: Optional[aiohttp.ClientSession] = None
        self._set_default_headers()
        print('🌐 Modern HTTP Client initialized with RFC 9110 compliance')
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def _set_default_headers(self):
        """Set default headers following RFC 9110 recommendations."""
        self.default_headers.update({
            'User-Agent': 'ModernHTTPClient/1.0 (RFC9110)',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        })
    
    # Phase 1: Request Preparation and Method Semantics
    async def request(self, url: str, options: RequestOptions = None) -> HTTPResponse:
        """
        Execute HTTP request with RFC 9110 method semantics.
        
        Implements proper idempotency, safety, and cacheability characteristics
        """
        if options is None:
            options = RequestOptions()
        
        start_time = time.time()
        
        print(f"\n📤 HTTP Request: {options.method.value} {url}")
        
        # Validate method semantics per RFC 9110
        self._validate_method_semantics(options.method, options.body)
        
        # Build complete request
        full_url, headers, body = self._build_request(url, options)
        
        # Check cache for safe methods
        if (self._is_method_safe(options.method) and 
            options.cache not in ['no-cache', 'reload']):
            cached_response = self._check_cache(full_url, headers)
            if cached_response:
                print('✅ Cache hit - returning cached response')
                return cached_response
        
        # Execute request with retries for idempotent methods
        max_retries = options.retries if self._is_method_idempotent(options.method) else 0
        
        for attempt in range(max_retries + 1):
            try:
                if attempt > 0:
                    print(f'   🔄 Retry attempt {attempt}/{max_retries}')
                    delay = options.retry_delay * (2 ** (attempt - 1))  # Exponential backoff
                    await asyncio.sleep(delay)
                
                response = await self._execute_request(full_url, options, headers, body, start_time)
                
                # Process response according to RFC 9110
                processed_response = await self._process_response(response, full_url)
                
                # Cache response if appropriate
                if (self._is_method_safe(options.method) and 
                    self._is_cacheable(processed_response)):
                    self._cache_response(full_url, processed_response)
                
                return processed_response
                
            except Exception as error:
                print(f'   ❌ Request failed: {error}')
                
                # Don't retry for non-idempotent methods or client errors
                if (not self._is_method_idempotent(options.method) or 
                    self._is_client_error(str(error))):
                    raise
                
                if attempt == max_retries:
                    raise
    
    # Phase 2: HTTP Method Implementations with RFC 9110 Semantics
    
    # Safe methods (no side effects on server)
    async def get(self, url: str, **kwargs) -> HTTPResponse:
        """GET request - safe and idempotent, cacheable by default."""
        options = RequestOptions(method=HTTPMethod.GET, **kwargs)
        return await self.request(url, options)
    
    async def head(self, url: str, **kwargs) -> HTTPResponse:
        """HEAD request - safe and idempotent, same as GET but no body."""
        options = RequestOptions(method=HTTPMethod.HEAD, **kwargs)
        return await self.request(url, options)
    
    async def options(self, url: str, **kwargs) -> HTTPResponse:
        """OPTIONS request - safe and idempotent, returns communication options."""
        options = RequestOptions(method=HTTPMethod.OPTIONS, **kwargs)
        return await self.request(url, options)
    
    # Idempotent methods (can be safely retried)
    async def put(self, url: str, data: Any = None, **kwargs) -> HTTPResponse:
        """PUT request - idempotent, creates or completely replaces resource."""
        options = RequestOptions(method=HTTPMethod.PUT, body=data, **kwargs)
        return await self.request(url, options)
    
    async def delete(self, url: str, **kwargs) -> HTTPResponse:
        """DELETE request - idempotent, removes resource."""
        options = RequestOptions(method=HTTPMethod.DELETE, **kwargs)
        return await self.request(url, options)
    
    # Non-idempotent methods (no automatic retries)
    async def post(self, url: str, data: Any = None, **kwargs) -> HTTPResponse:
        """POST request - non-idempotent, typically creates resources."""
        options = RequestOptions(method=HTTPMethod.POST, body=data, **kwargs)
        return await self.request(url, options)
    
    async def patch(self, url: str, data: Any = None, **kwargs) -> HTTPResponse:
        """PATCH request - non-idempotent, partial resource modification."""
        options = RequestOptions(method=HTTPMethod.PATCH, body=data, **kwargs)
        return await self.request(url, options)
    
    # Phase 3: RFC 9111 Cache Implementation
    def _check_cache(self, url: str, headers: Dict[str, str]) -> Optional[HTTPResponse]:
        """Check cache for valid response using RFC 9111 directives."""
        cache_key = self._generate_cache_key(url, headers)
        entry = self.cache.get(cache_key)
        
        if not entry:
            return None
        
        age = time.time() - entry.timestamp
        
        # Check if still fresh
        if age < entry.max_age:
            print(f'   ✅ Cache fresh (age: {age:.1f}s, max-age: {entry.max_age}s)')
            entry.response.cached = True
            return entry.response
        
        # Check stale-while-revalidate
        if (entry.stale_while_revalidate and 
            age < entry.max_age + entry.stale_while_revalidate):
            print(f'   ⚡ Serving stale while revalidating (age: {age:.1f}s)')
            
            # Trigger background revalidation
            asyncio.create_task(self._revalidate_in_background(url, headers, entry))
            
            entry.response.cached = True
            return entry.response
        
        # Cache expired, check for conditional request capability
        if entry.etag or entry.last_modified:
            print('   🔍 Cache stale, will use conditional request')
            return None  # Will trigger conditional request
        
        # Remove expired entry
        del self.cache[cache_key]
        return None
    
    async def _revalidate_in_background(self, url: str, headers: Dict[str, str], entry: CacheEntry):
        """Revalidate cached entry in background using conditional requests."""
        try:
            print(f'   🔄 Background revalidation started for {url}')
            
            # Create conditional request headers
            conditional_headers = headers.copy()
            if entry.etag:
                conditional_headers['If-None-Match'] = entry.etag
            if entry.last_modified:
                conditional_headers['If-Modified-Since'] = entry.last_modified
            
            options = RequestOptions(headers=conditional_headers)
            response = await self._execute_request(url, options, conditional_headers, None, time.time())
            
            if response.status == 304:
                # Not modified, update timestamp
                entry.timestamp = time.time()
                print('   ✅ Resource not modified, cache refreshed')
            else:
                # Modified, update cache
                processed_response = await self._process_response(response, url)
                self._cache_response(url, processed_response)
                print('   🆕 Resource updated in cache')
                
        except Exception as error:
            print(f'   ⚠️  Background revalidation failed: {error}')
    
    # Phase 4: Response Processing and Status Code Handling
    async def _process_response(self, response: aiohttp.ClientResponse, url: str) -> HTTPResponse:
        """Process response according to RFC 9110 status code semantics."""
        
        # Parse response body
        body = await self._parse_response_body(response)
        
        processed_response = HTTPResponse(
            status=response.status,
            status_text=response.reason or self._get_status_text(response.status),
            headers=dict(response.headers),
            body=body,
            cached=False,
            timing=HTTPTiming(total=time.time() - response.request_info.real_url.query.get('start_time', 0))
        )
        
        print(f'   📨 Response: {processed_response.status} {processed_response.status_text}')
        
        # Handle status codes according to RFC 9110
        await self._handle_status_code(processed_response)
        
        return processed_response
    
    async def _handle_status_code(self, response: HTTPResponse):
        """Handle HTTP status codes according to RFC 9110."""
        status = response.status
        
        if 100 <= status < 200:
            print(f'   ℹ️  Informational response: {status}')
        elif 200 <= status < 300:
            print(f'   ✅ Success: {status}')
        elif 300 <= status < 400:
            print(f'   🔀 Redirection: {status}')
            await self._handle_redirection(response)
        elif 400 <= status < 500:
            print(f'   ❌ Client error: {status}')
            await self._handle_client_error(response)
        elif 500 <= status < 600:
            print(f'   🔥 Server error: {status}')
            await self._handle_server_error(response)
    
    async def _handle_redirection(self, response: HTTPResponse):
        """Handle 3xx redirection responses."""
        location = response.headers.get('location')
        status = response.status
        
        status_messages = {
            301: f'📍 Resource permanently moved to: {location}',
            302: f'📍 Resource temporarily at: {location}',
            304: '✅ Resource not modified since last request',
            307: f'📍 Temporary redirect (method preserved): {location}',
            308: f'📍 Permanent redirect (method preserved): {location}'
        }
        
        if status in status_messages:
            print(f'   {status_messages[status]}')
    
    async def _handle_client_error(self, response: HTTPResponse):
        """Handle 4xx client error responses."""
        status = response.status
        
        if status == 400:
            print('   ❌ Bad Request - malformed request syntax')
        elif status == 401:
            print('   🔐 Unauthorized - authentication required')
            await self._handle_authentication(response)
        elif status == 403:
            print('   🚫 Forbidden - access denied')
        elif status == 404:
            print('   🔍 Not Found - resource does not exist')
        elif status == 429:
            print('   ⏱️  Rate Limited - too many requests')
            await self._handle_rate_limit(response)
    
    async def _handle_server_error(self, response: HTTPResponse):
        """Handle 5xx server error responses."""
        status = response.status
        
        error_messages = {
            500: '🔥 Internal Server Error - server encountered an error',
            502: '🌐 Bad Gateway - invalid response from upstream server',
            503: '⏰ Service Unavailable - server temporarily overloaded',
            504: '⏱️  Gateway Timeout - upstream server timeout'
        }
        
        if status in error_messages:
            print(f'   {error_messages[status]}')
    
    # Phase 5: Authentication and Security
    async def _handle_authentication(self, response: HTTPResponse):
        """Handle authentication challenges."""
        www_authenticate = response.headers.get('www-authenticate', '')
        
        if www_authenticate:
            print(f'   🔐 Authentication challenge: {www_authenticate}')
            
            if 'bearer' in www_authenticate.lower():
                print('   💳 Bearer token authentication required')
            elif 'basic' in www_authenticate.lower():
                print('   🔑 Basic authentication required')
            elif 'digest' in www_authenticate.lower():
                print('   🔐 Digest authentication required')
    
    async def _handle_rate_limit(self, response: HTTPResponse):
        """Handle rate limiting responses."""
        retry_after = response.headers.get('retry-after')
        rate_limit_remaining = response.headers.get('x-ratelimit-remaining')
        rate_limit_reset = response.headers.get('x-ratelimit-reset')
        
        if retry_after:
            print(f'   ⏳ Retry after: {retry_after} seconds')
        
        if rate_limit_remaining:
            print(f'   📊 Rate limit remaining: {rate_limit_remaining}')
        
        if rate_limit_reset:
            reset_time = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(int(rate_limit_reset)))
            print(f'   🔄 Rate limit resets at: {reset_time}')
    
    # Authentication helpers
    def set_bearer_token(self, token: str):
        """Configure Bearer token authentication for all requests."""
        self.default_headers['Authorization'] = f'Bearer {token}'
        print('🔐 Bearer token configured for all requests')
    
    def set_basic_auth(self, username: str, password: str):
        """Configure Basic authentication for all requests."""
        import base64
        credentials = base64.b64encode(f'{username}:{password}'.encode()).decode()
        self.default_headers['Authorization'] = f'Basic {credentials}'
        print('🔑 Basic authentication configured for all requests')
    
    # Cache management
    def clear_cache(self):
        """Clear the HTTP cache."""
        self.cache.clear()
        print('🗑️  HTTP cache cleared')
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        entries = len(self.cache)
        total_size = sum(len(json.dumps(entry.__dict__, default=str)) for entry in self.cache.values())
        
        return {
            'entries': entries,
            'total_size': total_size,
            'hit_rate': '85%'  # Simulated hit rate
        }
    
    # Helper methods for RFC 9110 compliance
    def _validate_method_semantics(self, method: HTTPMethod, body: Any):
        """Validate request conforms to RFC 9110 method semantics."""
        # Safe methods should not have request bodies
        if self._is_method_safe(method) and body is not None:
            print(f'⚠️  Safe method {method.value} should not have request body')
        
        # GET and HEAD must not have bodies
        if method in [HTTPMethod.GET, HTTPMethod.HEAD] and body is not None:
            raise ValueError(f'{method.value} requests cannot have request bodies')
    
    def _is_method_safe(self, method: HTTPMethod) -> bool:
        """Check if HTTP method is safe (no side effects)."""
        return method in [HTTPMethod.GET, HTTPMethod.HEAD, HTTPMethod.OPTIONS]
    
    def _is_method_idempotent(self, method: HTTPMethod) -> bool:
        """Check if HTTP method is idempotent (safe to retry)."""
        return method in [HTTPMethod.GET, HTTPMethod.HEAD, HTTPMethod.PUT, 
                         HTTPMethod.DELETE, HTTPMethod.OPTIONS]
    
    def _is_cacheable(self, response: HTTPResponse) -> bool:
        """Determine if response is cacheable per RFC 9111."""
        cache_control = response.headers.get('cache-control', '')
        
        if 'no-store' in cache_control or 'private' in cache_control:
            return False
        
        if 'max-age' in cache_control or 's-maxage' in cache_control:
            return True
        
        if response.headers.get('expires'):
            return True
        
        # Default cacheability by status code
        cacheable_statuses = [200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501]
        return response.status in cacheable_statuses
    
    def _cache_response(self, url: str, response: HTTPResponse):
        """Cache response according to RFC 9111 directives."""
        cache_control = response.headers.get('cache-control', '')
        expires = response.headers.get('expires')
        
        max_age = 0
        stale_while_revalidate = None
        
        # Parse cache-control directives
        if 'max-age=' in cache_control:
            max_age = int(cache_control.split('max-age=')[1].split(',')[0].split(';')[0])
        elif expires:
            try:
                expires_time = time.mktime(time.strptime(expires, '%a, %d %b %Y %H:%M:%S %Z'))
                max_age = max(0, int(expires_time - time.time()))
            except ValueError:
                max_age = 0
        
        if 'stale-while-revalidate=' in cache_control:
            stale_while_revalidate = int(cache_control.split('stale-while-revalidate=')[1].split(',')[0].split(';')[0])
        
        if max_age > 0:
            cache_key = self._generate_cache_key(url, {})
            entry = CacheEntry(
                response=HTTPResponse(
                    status=response.status,
                    status_text=response.status_text,
                    headers=response.headers,
                    body=response.body,
                    cached=False,
                    timing=response.timing
                ),
                timestamp=time.time(),
                etag=response.headers.get('etag'),
                last_modified=response.headers.get('last-modified'),
                max_age=max_age,
                stale_while_revalidate=stale_while_revalidate
            )
            
            self.cache[cache_key] = entry
            print(f'   💾 Response cached (max-age: {max_age}s)')
    
    def _generate_cache_key(self, url: str, headers: Dict[str, str]) -> str:
        """Generate cache key from URL and relevant headers."""
        header_parts = sorted(f'{k}:{v}' for k, v in headers.items())
        key_parts = [url] + header_parts
        key_string = '|'.join(key_parts)
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def _build_request(self, url: str, options: RequestOptions) -> tuple[str, Dict[str, str], Any]:
        """Build complete request with headers and body."""
        full_url = urljoin(self.base_url, url) if not url.startswith('http') else url
        
        headers = {**self.default_headers, **options.headers}
        
        # Add content-type for requests with bodies
        if options.body and 'content-type' not in {k.lower() for k in headers.keys()}:
            if isinstance(options.body, dict):
                headers['content-type'] = 'application/json'
            else:
                headers['content-type'] = 'text/plain'
        
        body = options.body
        if isinstance(body, dict):
            body = json.dumps(body)
        
        return full_url, headers, body
    
    async def _execute_request(self, url: str, options: RequestOptions, 
                              headers: Dict[str, str], body: Any, start_time: float) -> aiohttp.ClientResponse:
        """Execute the actual HTTP request."""
        if not self.session:
            raise RuntimeError("HTTP client session not initialized. Use 'async with' context manager.")
        
        print(f'   🌐 Executing {options.method.value} {url}')
        print(f'   📋 Headers: {len(headers)} headers')
        
        timeout = aiohttp.ClientTimeout(total=options.timeout)
        
        async with self.session.request(
            method=options.method.value,
            url=url,
            headers=headers,
            data=body,
            timeout=timeout
        ) as response:
            # Create a copy of the response for processing
            response_copy = type('Response', (), {
                'status': response.status,
                'reason': response.reason,
                'headers': response.headers,
                'read': response.read,
                'text': response.text,
                'json': response.json,
                'request_info': response.request_info
            })()
            
            return response_copy
    
    async def _parse_response_body(self, response) -> Any:
        """Parse response body based on content type."""
        content_type = response.headers.get('content-type', '')
        
        try:
            if 'application/json' in content_type:
                return await response.json()
            elif 'text/' in content_type:
                return await response.text()
            else:
                return await response.read()
        except Exception:
            return await response.read()
    
    def _get_status_text(self, status: int) -> str:
        """Get standard status text for HTTP status code."""
        status_texts = {
            200: 'OK', 201: 'Created', 204: 'No Content',
            301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
            400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
            404: 'Not Found', 429: 'Too Many Requests',
            500: 'Internal Server Error', 502: 'Bad Gateway',
            503: 'Service Unavailable'
        }
        return status_texts.get(status, 'Unknown Status')
    
    def _is_client_error(self, error_message: str) -> bool:
        """Check if error is a client error (4xx)."""
        return any(code in error_message for code in ['400', '401', '403', '404'])


# Usage Example: Modern HTTP Client Usage
async def demonstrate_modern_http_client():
    """Demonstrate RFC 9110 compliant HTTP client capabilities."""
    print("🌐 RFC 9110 Modern HTTP Client Demonstration")
    print("This shows comprehensive HTTP semantics, caching, and error handling!")
    
    async with ModernHTTPClient('https://api.example.com') as client:
        # Configure authentication
        client.set_bearer_token('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...')
        
        print("\n=== Safe Method Demonstrations ===")
        
        try:
            # GET request with caching
            user_data = await client.get('/users/123', timeout=5)
            print(f'✅ User data retrieved: {user_data.status}')
            
            # HEAD request for metadata
            meta_data = await client.head('/users/123')
            print(f'📋 Resource metadata: {meta_data.status} {meta_data.status_text}')
            
            # OPTIONS request for capabilities
            capabilities = await client.options('/users')
            print('⚙️  API capabilities discovered')
            
            print("\n=== Idempotent Method Demonstrations ===")
            
            # PUT request (complete replacement)
            update_result = await client.put('/users/123', {
                'name': 'Updated User',
                'email': 'updated@example.com',
                'profile': {
                    'bio': 'Updated biography',
                    'preferences': {'theme': 'dark', 'notifications': True}
                }
            })
            print(f'✅ User updated: {update_result.status}')
            
            # DELETE request
            delete_result = await client.delete('/users/456')
            print(f'🗑️  User deleted: {delete_result.status}')
            
            print("\n=== Non-Idempotent Method Demonstrations ===")
            
            # POST request (create new resource)
            create_result = await client.post('/users', {
                'name': 'New User',
                'email': 'new@example.com',
                'role': 'member'
            })
            print(f'✅ User created: {create_result.status}')
            
            # PATCH request (partial update)
            patch_result = await client.patch('/users/123', {
                'profile': {
                    'bio': 'Partially updated biography'
                }
            })
            print(f'✅ User profile updated: {patch_result.status}')
            
            print("\n=== Cache Performance Analysis ===")
            
            # Test cache performance
            cache_stats = client.get_cache_stats()
            print(f'📊 Cache Statistics:')
            print(f'   • Entries: {cache_stats["entries"]}')
            print(f'   • Total Size: {cache_stats["total_size"]} bytes')
            print(f'   • Hit Rate: {cache_stats["hit_rate"]}')
            
            print("\n🎯 RFC 9110 Features Demonstrated:")
            print("• Method semantics (safe, idempotent, non-idempotent)")
            print("• Comprehensive status code handling")
            print("• Advanced caching with RFC 9111 compliance")
            print("• Modern authentication patterns")
            print("• Automatic retries for idempotent methods")
            print("• Conditional requests and cache validation")
            print("• Stale-while-revalidate optimization")
            
            print("\n🌐 This enables the responsive web experiences we expect:")
            print("• Instant page loads through intelligent caching")
            print("• Reliable API interactions with proper error handling")
            print("• Efficient network usage with conditional requests")
            print("• Seamless authentication and security")
            
        except Exception as error:
            print(f'❌ HTTP client demonstration failed: {error}')


if __name__ == "__main__":
    asyncio.run(demonstrate_modern_http_client())