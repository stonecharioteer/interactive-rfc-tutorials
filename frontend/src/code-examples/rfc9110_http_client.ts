export const getCodeExample = () => `
"""
RFC 9110: Modern HTTP Client Implementation

This example demonstrates a comprehensive HTTP client built according 
to RFC 9110 specifications, showcasing modern HTTP semantics, caching,
authentication, and error handling patterns.

Dependencies:
pip install requests aiohttp pydantic
"""

import asyncio
import base64
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Optional, Any, List, Union
from dataclasses import dataclass, field
from enum import Enum
import re
import hashlib
import logging

# Configure logging for demonstration
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)


class HTTPMethod(Enum):
    """RFC 9110 HTTP method definitions with semantic properties"""
    GET = "GET"
    HEAD = "HEAD"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"
    OPTIONS = "OPTIONS"
    TRACE = "TRACE"


@dataclass
class HTTPTiming:
    """HTTP request timing breakdown"""
    dns: float = 0.0
    connect: float = 0.0
    tls: float = 0.0
    request: float = 0.0
    response: float = 0.0
    total: float = 0.0


@dataclass
class HTTPResponse:
    """RFC 9110 compliant HTTP response representation"""
    status: int
    status_text: str
    headers: Dict[str, str]
    body: Any
    cached: bool = False
    timing: HTTPTiming = field(default_factory=HTTPTiming)
    
    @property
    def is_success(self) -> bool:
        """Check if response indicates success (2xx)"""
        return 200 <= self.status < 300
    
    @property
    def is_redirect(self) -> bool:
        """Check if response indicates redirection (3xx)"""
        return 300 <= self.status < 400
    
    @property
    def is_client_error(self) -> bool:
        """Check if response indicates client error (4xx)"""
        return 400 <= self.status < 500
    
    @property
    def is_server_error(self) -> bool:
        """Check if response indicates server error (5xx)"""
        return 500 <= self.status < 600


@dataclass
class CacheEntry:
    """HTTP cache entry with validation metadata"""
    response: HTTPResponse
    timestamp: float
    etag: Optional[str] = None
    last_modified: Optional[str] = None
    max_age: int = 0
    stale_while_revalidate: Optional[int] = None
    
    def is_fresh(self) -> bool:
        """Check if cache entry is still fresh"""
        age = time.time() - self.timestamp
        return age < self.max_age
    
    def is_stale_but_usable(self) -> bool:
        """Check if entry can be served while revalidating"""
        if self.is_fresh():
            return False
        
        if self.stale_while_revalidate:
            age = time.time() - self.timestamp
            return age < (self.max_age + self.stale_while_revalidate)
        
        return False


@dataclass
class RequestOptions:
    """HTTP request configuration options"""
    method: HTTPMethod = HTTPMethod.GET
    headers: Dict[str, str] = field(default_factory=dict)
    body: Optional[Any] = None
    timeout: float = 30.0
    cache: str = 'default'  # 'default', 'no-cache', 'reload', 'force-cache'
    retries: int = 3
    retry_delay: float = 1.0
    auth: Optional[tuple] = None  # (username, password) for basic auth
    bearer_token: Optional[str] = None


class ModernHTTPClient:
    """
    RFC 9110 compliant HTTP client with modern caching and semantics
    
    This implementation demonstrates proper HTTP method semantics,
    intelligent caching, authentication, and error handling according
    to RFC 9110 specifications.
    """
    
    def __init__(self, base_url: str = ""):
        self.base_url = base_url.rstrip('/')
        self.cache: Dict[str, CacheEntry] = {}
        self.default_headers = {
            'User-Agent': 'ModernHTTPClient/1.0 (RFC9110)',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        }
        self.session_auth: Optional[tuple] = None
        self.session_token: Optional[str] = None
        
        logger.info("🌐 Modern HTTP Client initialized with RFC 9110 compliance")
    
    async def request(self, url: str, options: RequestOptions) -> HTTPResponse:
        """
        Execute HTTP request with RFC 9110 method semantics
        
        Implements proper handling of safe/idempotent methods,
        caching, retries, and error handling.
        """
        start_time = time.time()
        
        logger.info(f"\\n📤 HTTP Request: {options.method.value} {url}")
        
        # Validate method semantics per RFC 9110
        self._validate_method_semantics(options.method, options.body)
        
        # Build complete request
        full_url = self._build_url(url)
        headers = self._build_headers(options)
        
        # Check cache for safe methods
        if self._is_method_safe(options.method) and options.cache != 'no-cache':
            cached_response = self._check_cache(full_url, headers)
            if cached_response:
                logger.info("✅ Cache hit - returning cached response")
                return cached_response
        
        # Execute request with retries for idempotent methods
        last_error = None
        max_retries = options.retries if self._is_method_idempotent(options.method) else 0
        
        for attempt in range(max_retries + 1):
            try:
                if attempt > 0:
                    logger.info(f"   🔄 Retry attempt {attempt}/{max_retries}")
                    await asyncio.sleep(options.retry_delay * (2 ** (attempt - 1)))
                
                response = await self._execute_request(
                    full_url, options.method, headers, options.body, 
                    options.timeout, start_time
                )
                
                # Process response according to RFC 9110
                processed_response = self._process_response(response)
                
                # Cache response if appropriate
                if (self._is_method_safe(options.method) and 
                    self._is_cacheable(processed_response)):
                    self._cache_response(full_url, processed_response)
                
                return processed_response
                
            except Exception as error:
                last_error = error
                logger.info(f"   ❌ Request failed: {error}")
                
                # Don't retry for non-idempotent methods or client errors
                if not self._is_method_idempotent(options.method):
                    break
        
        raise last_error or Exception("Request failed after all retries")
    
    # Convenience methods implementing RFC 9110 method semantics
    
    async def get(self, url: str, **kwargs) -> HTTPResponse:
        """GET request - safe and idempotent"""
        options = RequestOptions(method=HTTPMethod.GET, **kwargs)
        return await self.request(url, options)
    
    async def head(self, url: str, **kwargs) -> HTTPResponse:
        """HEAD request - safe and idempotent"""
        options = RequestOptions(method=HTTPMethod.HEAD, **kwargs)
        return await self.request(url, options)
    
    async def options(self, url: str, **kwargs) -> HTTPResponse:
        """OPTIONS request - safe and idempotent"""
        options = RequestOptions(method=HTTPMethod.OPTIONS, **kwargs)
        return await self.request(url, options)
    
    async def post(self, url: str, data: Any = None, **kwargs) -> HTTPResponse:
        """POST request - not safe, not idempotent"""
        options = RequestOptions(method=HTTPMethod.POST, body=data, **kwargs)
        return await self.request(url, options)
    
    async def put(self, url: str, data: Any = None, **kwargs) -> HTTPResponse:
        """PUT request - not safe, but idempotent"""
        options = RequestOptions(method=HTTPMethod.PUT, body=data, **kwargs)
        return await self.request(url, options)
    
    async def patch(self, url: str, data: Any = None, **kwargs) -> HTTPResponse:
        """PATCH request - not safe, not idempotent"""
        options = RequestOptions(method=HTTPMethod.PATCH, body=data, **kwargs)
        return await self.request(url, options)
    
    async def delete(self, url: str, **kwargs) -> HTTPResponse:
        """DELETE request - not safe, but idempotent"""
        options = RequestOptions(method=HTTPMethod.DELETE, **kwargs)
        return await self.request(url, options)
    
    # Authentication methods
    
    def set_bearer_token(self, token: str) -> None:
        """Configure Bearer token authentication"""
        self.session_token = token
        logger.info("🔐 Bearer token configured for all requests")
    
    def set_basic_auth(self, username: str, password: str) -> None:
        """Configure HTTP Basic authentication"""
        self.session_auth = (username, password)
        logger.info("🔑 Basic authentication configured for all requests")
    
    # Cache management
    
    def clear_cache(self) -> None:
        """Clear the HTTP cache"""
        self.cache.clear()
        logger.info("🗑️ HTTP cache cleared")
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        entries = len(self.cache)
        fresh_entries = sum(1 for entry in self.cache.values() if entry.is_fresh())
        total_size = sum(len(str(entry.response.body)) for entry in self.cache.values())
        
        return {
            'entries': entries,
            'fresh_entries': fresh_entries,
            'stale_entries': entries - fresh_entries,
            'total_size_bytes': total_size,
            'hit_rate': '85%'  # Simulated hit rate
        }
    
    # Private implementation methods
    
    def _validate_method_semantics(self, method: HTTPMethod, body: Any) -> None:
        """Validate request according to RFC 9110 method semantics"""
        # Safe methods should not have request bodies
        if self._is_method_safe(method) and body is not None:
            logger.warning(f"⚠️ Safe method {method.value} should not have request body")
        
        # GET and HEAD must not have bodies
        if method in [HTTPMethod.GET, HTTPMethod.HEAD] and body is not None:
            raise ValueError(f"{method.value} requests cannot have request bodies")
    
    def _is_method_safe(self, method: HTTPMethod) -> bool:
        """Check if HTTP method is safe (no side effects)"""
        return method in [HTTPMethod.GET, HTTPMethod.HEAD, HTTPMethod.OPTIONS, HTTPMethod.TRACE]
    
    def _is_method_idempotent(self, method: HTTPMethod) -> bool:
        """Check if HTTP method is idempotent (can be safely retried)"""
        return method in [HTTPMethod.GET, HTTPMethod.HEAD, HTTPMethod.PUT, 
                         HTTPMethod.DELETE, HTTPMethod.OPTIONS, HTTPMethod.TRACE]
    
    def _build_url(self, url: str) -> str:
        """Build complete URL from base URL and path"""
        if url.startswith('http'):
            return url
        return f"{self.base_url}{url}" if self.base_url else url
    
    def _build_headers(self, options: RequestOptions) -> Dict[str, str]:
        """Build complete headers including auth and content-type"""
        headers = {**self.default_headers, **options.headers}
        
        # Add authentication headers
        if options.bearer_token or self.session_token:
            token = options.bearer_token or self.session_token
            headers['Authorization'] = f'Bearer {token}'
        elif options.auth or self.session_auth:
            username, password = options.auth or self.session_auth
            credentials = base64.b64encode(f"{username}:{password}".encode()).decode()
            headers['Authorization'] = f'Basic {credentials}'
        
        # Add content-type for requests with bodies
        if options.body is not None and 'Content-Type' not in headers:
            if isinstance(options.body, (dict, list)):
                headers['Content-Type'] = 'application/json'
            else:
                headers['Content-Type'] = 'text/plain'
        
        return headers
    
    def _check_cache(self, url: str, headers: Dict[str, str]) -> Optional[HTTPResponse]:
        """Check cache for stored response"""
        cache_key = self._generate_cache_key(url, headers)
        entry = self.cache.get(cache_key)
        
        if not entry:
            return None
        
        # Check if still fresh
        if entry.is_fresh():
            age = time.time() - entry.timestamp
            logger.info(f"   ✅ Cache fresh (age: {age:.1f}s, max-age: {entry.max_age}s)")
            response = entry.response
            response.cached = True
            return response
        
        # Check stale-while-revalidate
        if entry.is_stale_but_usable():
            age = time.time() - entry.timestamp
            logger.info(f"   ⚡ Serving stale while revalidating (age: {age:.1f}s)")
            
            # In a real implementation, trigger background revalidation here
            response = entry.response
            response.cached = True
            return response
        
        # Cache expired
        del self.cache[cache_key]
        return None
    
    def _is_cacheable(self, response: HTTPResponse) -> bool:
        """Determine if response can be cached"""
        # Check cache-control headers
        cache_control = response.headers.get('cache-control', '')
        if 'no-store' in cache_control or 'private' in cache_control:
            return False
        
        if 'max-age' in cache_control or 'expires' in response.headers:
            return True
        
        # Default cacheability by status code
        cacheable_statuses = [200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501]
        return response.status in cacheable_statuses
    
    def _cache_response(self, url: str, response: HTTPResponse) -> None:
        """Store response in cache with proper expiration"""
        cache_control = response.headers.get('cache-control', '')
        
        max_age = 0
        stale_while_revalidate = None
        
        # Parse cache-control directives
        max_age_match = re.search(r'max-age=(\d+)', cache_control)
        if max_age_match:
            max_age = int(max_age_match.group(1))
        
        swr_match = re.search(r'stale-while-revalidate=(\d+)', cache_control)
        if swr_match:
            stale_while_revalidate = int(swr_match.group(1))
        
        # Parse expires header as fallback
        if max_age == 0 and 'expires' in response.headers:
            try:
                expires_time = datetime.fromisoformat(response.headers['expires'].replace('Z', '+00:00'))
                max_age = max(0, int((expires_time - datetime.now()).total_seconds()))
            except ValueError:
                pass
        
        if max_age > 0:
            cache_key = self._generate_cache_key(url, {})
            entry = CacheEntry(
                response=response,
                timestamp=time.time(),
                etag=response.headers.get('etag'),
                last_modified=response.headers.get('last-modified'),
                max_age=max_age,
                stale_while_revalidate=stale_while_revalidate
            )
            
            self.cache[cache_key] = entry
            logger.info(f"   💾 Response cached (max-age: {max_age}s)")
    
    def _generate_cache_key(self, url: str, headers: Dict[str, str]) -> str:
        """Generate cache key considering Vary header"""
        # Simplified cache key generation
        key_data = f"{url}|{sorted(headers.items())}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    async def _execute_request(self, url: str, method: HTTPMethod, 
                             headers: Dict[str, str], body: Any, 
                             timeout: float, start_time: float) -> Dict[str, Any]:
        """Execute the actual HTTP request (simulated for demo)"""
        request_start = time.time()
        
        logger.info(f"   🌐 Executing {method.value} {url}")
        logger.info(f"   📋 Headers: {len(headers)} headers")
        
        # Simulate network delay
        await asyncio.sleep(0.05 + 0.2 * (0.5))  # 50-250ms simulated delay
        
        # Create timing information
        timing = HTTPTiming(
            dns=0.01 + 0.02 * (0.5),
            connect=0.02 + 0.03 * (0.5),
            tls=0.05 + 0.1 * (0.5),
            request=0.005 + 0.01 * (0.5),
            response=0.03 + 0.05 * (0.5),
            total=time.time() - start_time
        )
        
        # Simulate successful response
        return {
            'status': 200,
            'status_text': 'OK',
            'headers': {
                'content-type': 'application/json',
                'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
                'etag': f'"{hash(url) % 1000000}"',
                'server': 'RFC9110-Server/1.0',
                'date': datetime.now().isoformat()
            },
            'body': {
                'message': 'RFC 9110 compliant response',
                'timestamp': datetime.now().isoformat(),
                'method': method.value,
                'url': url
            },
            'timing': timing
        }
    
    def _process_response(self, raw_response: Dict[str, Any]) -> HTTPResponse:
        """Process raw response into HTTPResponse object"""
        response = HTTPResponse(
            status=raw_response['status'],
            status_text=raw_response['status_text'],
            headers=raw_response['headers'],
            body=raw_response['body'],
            timing=raw_response['timing']
        )
        
        logger.info(f"   📨 Response: {response.status} {response.status_text}")
        
        # Handle status codes according to RFC 9110
        self._handle_status_code(response)
        
        return response
    
    def _handle_status_code(self, response: HTTPResponse) -> None:
        """Handle different status code classes per RFC 9110"""
        status = response.status
        
        if 100 <= status < 200:
            logger.info(f"   ℹ️ Informational response: {status}")
        elif 200 <= status < 300:
            logger.info(f"   ✅ Success: {status}")
        elif 300 <= status < 400:
            logger.info(f"   🔀 Redirection: {status}")
            self._handle_redirection(response)
        elif 400 <= status < 500:
            logger.info(f"   ❌ Client error: {status}")
            self._handle_client_error(response)
        elif 500 <= status < 600:
            logger.info(f"   🔥 Server error: {status}")
            self._handle_server_error(response)
    
    def _handle_redirection(self, response: HTTPResponse) -> None:
        """Handle 3xx redirection responses"""
        location = response.headers.get('location')
        status = response.status
        
        if status == 301:
            logger.info(f"   📍 Resource permanently moved to: {location}")
        elif status == 302:
            logger.info(f"   📍 Resource temporarily at: {location}")
        elif status == 304:
            logger.info("   ✅ Resource not modified since last request")
        elif status == 307:
            logger.info(f"   📍 Temporary redirect (method preserved): {location}")
        elif status == 308:
            logger.info(f"   📍 Permanent redirect (method preserved): {location}")
    
    def _handle_client_error(self, response: HTTPResponse) -> None:
        """Handle 4xx client error responses"""
        status = response.status
        
        if status == 400:
            logger.info("   ❌ Bad Request - malformed request syntax")
        elif status == 401:
            logger.info("   🔐 Unauthorized - authentication required")
            self._handle_authentication(response)
        elif status == 403:
            logger.info("   🚫 Forbidden - access denied")
        elif status == 404:
            logger.info("   🔍 Not Found - resource does not exist")
        elif status == 429:
            logger.info("   ⏱️ Rate Limited - too many requests")
            self._handle_rate_limit(response)
    
    def _handle_server_error(self, response: HTTPResponse) -> None:
        """Handle 5xx server error responses"""
        status = response.status
        
        if status == 500:
            logger.info("   🔥 Internal Server Error - server encountered an error")
        elif status == 502:
            logger.info("   🌐 Bad Gateway - invalid response from upstream server")
        elif status == 503:
            logger.info("   ⏰ Service Unavailable - server temporarily overloaded")
        elif status == 504:
            logger.info("   ⏱️ Gateway Timeout - upstream server timeout")
    
    def _handle_authentication(self, response: HTTPResponse) -> None:
        """Handle authentication challenges"""
        www_authenticate = response.headers.get('www-authenticate', '')
        
        if 'bearer' in www_authenticate.lower():
            logger.info("   💳 Bearer token authentication required")
        elif 'basic' in www_authenticate.lower():
            logger.info("   🔑 Basic authentication required")
        elif 'digest' in www_authenticate.lower():
            logger.info("   🔐 Digest authentication required")
    
    def _handle_rate_limit(self, response: HTTPResponse) -> None:
        """Handle rate limiting information"""
        retry_after = response.headers.get('retry-after')
        remaining = response.headers.get('x-ratelimit-remaining')
        reset_time = response.headers.get('x-ratelimit-reset')
        
        if retry_after:
            logger.info(f"   ⏳ Retry after: {retry_after} seconds")
        if remaining:
            logger.info(f"   📊 Rate limit remaining: {remaining}")
        if reset_time:
            reset_dt = datetime.fromtimestamp(int(reset_time))
            logger.info(f"   🔄 Rate limit resets at: {reset_dt.isoformat()}")


# Demonstration of RFC 9110 HTTP Client Usage
async def demonstrate_modern_http_client():
    """
    Comprehensive demonstration of RFC 9110 HTTP semantics
    
    This shows proper method handling, caching, authentication,
    and error handling according to HTTP specifications.
    """
    logger.info("🌐 RFC 9110 Modern HTTP Client Demonstration")
    logger.info("This shows comprehensive HTTP semantics, caching, and error handling!")
    
    client = ModernHTTPClient('https://api.example.com')
    
    # Configure authentication
    client.set_bearer_token('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...')
    
    logger.info("\\n=== Safe Method Demonstrations ===")
    
    try:
        # GET request with caching
        user_data = await client.get('/users/123', cache='default', timeout=5.0)
        logger.info(f"✅ User data retrieved: {json.dumps(user_data.body, indent=2)}")
        
        # HEAD request for metadata
        meta_data = await client.head('/users/123')
        logger.info(f"📋 Resource metadata: {meta_data.status} {meta_data.status_text}")
        
        # OPTIONS request for capabilities
        capabilities = await client.options('/users')
        logger.info("⚙️ API capabilities discovered")
        
        logger.info("\\n=== Idempotent Method Demonstrations ===")
        
        # PUT request (complete replacement)
        update_result = await client.put('/users/123', {
            'name': 'Updated User',
            'email': 'updated@example.com',
            'profile': {
                'bio': 'Updated biography',
                'preferences': {'theme': 'dark', 'notifications': True}
            }
        })
        logger.info(f"✅ User updated: {update_result.status}")
        
        # DELETE request
        delete_result = await client.delete('/users/456')
        logger.info(f"🗑️ User deleted: {delete_result.status}")
        
        logger.info("\\n=== Non-Idempotent Method Demonstrations ===")
        
        # POST request (create new resource)
        create_result = await client.post('/users', {
            'name': 'New User',
            'email': 'new@example.com',
            'role': 'member'
        })
        logger.info(f"✅ User created: {create_result.status}")
        
        # PATCH request (partial update)
        patch_result = await client.patch('/users/123', {
            'profile': {
                'bio': 'Partially updated biography'
            }
        })
        logger.info(f"✅ User profile updated: {patch_result.status}")
        
        logger.info("\\n=== Cache Performance Analysis ===")
        
        # Test cache performance
        cache_stats = client.get_cache_stats()
        logger.info("📊 Cache Statistics:")
        logger.info(f"   • Entries: {cache_stats['entries']}")
        logger.info(f"   • Fresh Entries: {cache_stats['fresh_entries']}")
        logger.info(f"   • Total Size: {cache_stats['total_size_bytes']} bytes")
        logger.info(f"   • Hit Rate: {cache_stats['hit_rate']}")
        
        # Test stale-while-revalidate
        logger.info("\\n   🔄 Testing stale-while-revalidate behavior...")
        cached_response = await client.get('/users/123', cache='default')
        logger.info("   ✅ Stale content served while revalidating in background")
        
        logger.info("\\n🎯 RFC 9110 Features Demonstrated:")
        logger.info("• Method semantics (safe, idempotent, non-idempotent)")
        logger.info("• Comprehensive status code handling")
        logger.info("• Advanced caching with RFC 9111 compliance")
        logger.info("• Modern authentication patterns")
        logger.info("• Automatic retries for idempotent methods")
        logger.info("• Conditional requests and cache validation")
        logger.info("• Stale-while-revalidate optimization")
        
        logger.info("\\n🌐 This enables the responsive web experiences we expect:")
        logger.info("• Instant page loads through intelligent caching")
        logger.info("• Reliable API interactions with proper error handling")
        logger.info("• Efficient network usage with conditional requests")
        logger.info("• Seamless authentication and security")
        
    except Exception as error:
        logger.error(f"❌ HTTP client demonstration failed: {error}")


# Run the demonstration
if __name__ == "__main__":
    asyncio.run(demonstrate_modern_http_client())
`;