export const rfc9111_cache_implementation = `from datetime import datetime, timedelta
from typing import Dict, Optional, NamedTuple, List, Any
from dataclasses import dataclass
import asyncio
import hashlib
import re
from enum import Enum


class CacheDirective(Enum):
    """RFC 9111 Cache-Control directive types"""
    MAX_AGE = "max-age"
    S_MAXAGE = "s-maxage"
    NO_CACHE = "no-cache"
    NO_STORE = "no-store"
    PRIVATE = "private"
    PUBLIC = "public"
    MUST_REVALIDATE = "must-revalidate"
    PROXY_REVALIDATE = "proxy-revalidate"
    IMMUTABLE = "immutable"
    STALE_WHILE_REVALIDATE = "stale-while-revalidate"
    STALE_IF_ERROR = "stale-if-error"


@dataclass
class CacheControl:
    """Parsed Cache-Control header with RFC 9111 directives"""
    max_age: Optional[int] = None
    s_maxage: Optional[int] = None
    no_cache: bool = False
    no_store: bool = False
    private: bool = False
    public: bool = False
    must_revalidate: bool = False
    proxy_revalidate: bool = False
    immutable: bool = False
    stale_while_revalidate: Optional[int] = None
    stale_if_error: Optional[int] = None
    
    @classmethod
    def parse(cls, cache_control_header: str) -> 'CacheControl':
        """Parse Cache-Control header according to RFC 9111"""
        directives = {}
        
        # Split directives and handle quoted values
        parts = re.findall(r'([^,=]+)(?:=([^,]+))?', cache_control_header)
        
        for name, value in parts:
            name = name.strip().lower()
            
            if name in ['max-age', 's-maxage', 'stale-while-revalidate', 'stale-if-error']:
                try:
                    directives[name.replace('-', '_')] = int(value) if value else None
                except (ValueError, TypeError):
                    continue
            elif name in ['no-cache', 'no-store', 'private', 'public', 
                         'must-revalidate', 'proxy-revalidate', 'immutable']:
                directives[name.replace('-', '_')] = True
        
        return cls(**directives)


@dataclass
class CacheEntry:
    """HTTP cache entry with validation and freshness metadata"""
    url: str
    method: str
    status_code: int
    headers: Dict[str, str]
    body: bytes
    stored_at: datetime
    cache_control: CacheControl
    etag: Optional[str] = None
    last_modified: Optional[datetime] = None
    vary_key: Optional[str] = None
    
    def is_fresh(self, shared_cache: bool = False) -> bool:
        """Determine if cache entry is fresh according to RFC 9111"""
        if self.cache_control.no_store:
            return False
        
        # Calculate freshness lifetime
        max_age = (self.cache_control.s_maxage if shared_cache and self.cache_control.s_maxage 
                  else self.cache_control.max_age)
        
        if max_age is not None:
            age = (datetime.utcnow() - self.stored_at).total_seconds()
            return age < max_age
        
        # If immutable, consider fresh within reasonable bounds
        if self.cache_control.immutable:
            age = (datetime.utcnow() - self.stored_at).total_seconds()
            return age < 31536000  # 1 year for immutable resources
        
        # Default heuristic freshness (10% of Last-Modified age)
        if self.last_modified:
            current_age = (datetime.utcnow() - self.stored_at).total_seconds()
            last_modified_age = (self.stored_at - self.last_modified).total_seconds()
            heuristic_lifetime = max(0, last_modified_age * 0.1)
            return current_age < heuristic_lifetime
        
        return False
    
    def is_stale_but_usable(self, shared_cache: bool = False) -> bool:
        """Check if stale entry can be used with stale-while-revalidate"""
        if self.is_fresh(shared_cache):
            return False
        
        if self.cache_control.stale_while_revalidate:
            staleness = (datetime.utcnow() - self.stored_at).total_seconds()
            max_age = (self.cache_control.s_maxage if shared_cache and self.cache_control.s_maxage 
                      else self.cache_control.max_age or 0)
            
            return staleness < (max_age + self.cache_control.stale_while_revalidate)
        
        return False


class HTTPCache:
    """RFC 9111 compliant HTTP cache implementation"""
    
    def __init__(self, shared_cache: bool = False, max_size: int = 1000):
        self.shared_cache = shared_cache
        self.max_size = max_size
        self.storage: Dict[str, CacheEntry] = {}
        self.access_order: List[str] = []  # For LRU eviction
        
    def _generate_cache_key(self, url: str, method: str, 
                           vary_headers: Optional[Dict[str, str]] = None) -> str:
        """Generate cache key considering Vary header"""
        base_key = f"{method}:{url}"
        
        if vary_headers:
            vary_parts = []
            for header, value in sorted(vary_headers.items()):
                vary_parts.append(f"{header.lower()}:{value}")
            vary_key = hashlib.md5(":".join(vary_parts).encode()).hexdigest()
            return f"{base_key}:vary:{vary_key}"
        
        return base_key
    
    def _should_store(self, cache_control: CacheControl, method: str, 
                     status_code: int) -> bool:
        """Determine if response should be stored according to RFC 9111"""
        # No-store directive prevents caching
        if cache_control.no_store:
            return False
        
        # Private responses shouldn't be stored in shared caches
        if self.shared_cache and cache_control.private:
            return False
        
        # Only cache safe methods by default
        if method not in ['GET', 'HEAD', 'POST']:
            return False
        
        # Cache successful responses and some error responses
        cacheable_statuses = [200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501]
        return status_code in cacheable_statuses
    
    def _evict_if_needed(self):
        """LRU eviction when cache size limit is reached"""
        while len(self.storage) >= self.max_size and self.access_order:
            oldest_key = self.access_order.pop(0)
            self.storage.pop(oldest_key, None)
    
    def store(self, url: str, method: str, status_code: int, 
             headers: Dict[str, str], body: bytes,
             request_headers: Optional[Dict[str, str]] = None) -> bool:
        """Store response in cache according to RFC 9111 rules"""
        cache_control = CacheControl.parse(headers.get('cache-control', ''))
        
        if not self._should_store(cache_control, method, status_code):
            return False
        
        # Handle Vary header for request-specific caching
        vary_headers = None
        if 'vary' in headers:
            vary_header_names = [h.strip().lower() for h in headers['vary'].split(',')]
            if request_headers and vary_header_names != ['*']:
                vary_headers = {name: request_headers.get(name, '') 
                              for name in vary_header_names}
        
        cache_key = self._generate_cache_key(url, method, vary_headers)
        
        # Parse validation headers
        etag = headers.get('etag')
        last_modified = None
        if 'last-modified' in headers:
            try:
                last_modified = datetime.strptime(
                    headers['last-modified'], 
                    '%a, %d %b %Y %H:%M:%S %Z'
                )
            except ValueError:
                pass
        
        # Create cache entry
        entry = CacheEntry(
            url=url,
            method=method,
            status_code=status_code,
            headers=headers,
            body=body,
            stored_at=datetime.utcnow(),
            cache_control=cache_control,
            etag=etag,
            last_modified=last_modified,
            vary_key=hashlib.md5(str(vary_headers).encode()).hexdigest() if vary_headers else None
        )
        
        self._evict_if_needed()
        self.storage[cache_key] = entry
        
        # Update access order for LRU
        if cache_key in self.access_order:
            self.access_order.remove(cache_key)
        self.access_order.append(cache_key)
        
        return True
    
    def retrieve(self, url: str, method: str, 
                request_headers: Optional[Dict[str, str]] = None) -> Optional[CacheEntry]:
        """Retrieve response from cache with freshness checking"""
        # Try to find matching cache entry considering Vary
        cache_key = self._generate_cache_key(url, method)
        entry = self.storage.get(cache_key)
        
        if not entry:
            # Try with vary headers if present
            if request_headers:
                for stored_key, stored_entry in self.storage.items():
                    if stored_key.startswith(f"{method}:{url}:vary:"):
                        # This is a simplified vary matching - production would be more sophisticated
                        cache_key = stored_key
                        entry = stored_entry
                        break
        
        if not entry:
            return None
        
        # Update access order for LRU
        if cache_key in self.access_order:
            self.access_order.remove(cache_key)
            self.access_order.append(cache_key)
        
        # Check if no-cache requires revalidation
        if entry.cache_control.no_cache:
            # Should revalidate - return entry but mark for revalidation
            entry.requires_revalidation = True
            return entry
        
        # Return if fresh
        if entry.is_fresh(self.shared_cache):
            return entry
        
        # Check stale-while-revalidate
        if entry.is_stale_but_usable(self.shared_cache):
            entry.stale_but_usable = True
            return entry
        
        # Must revalidate if stale
        if entry.cache_control.must_revalidate or entry.cache_control.proxy_revalidate:
            return None
        
        return entry
    
    def invalidate(self, url: str, method: str = None):
        """Invalidate cache entries for a URL"""
        keys_to_remove = []
        
        for key in self.storage.keys():
            if method:
                if key.startswith(f"{method}:{url}"):
                    keys_to_remove.append(key)
            else:
                if f":{url}" in key:
                    keys_to_remove.append(key)
        
        for key in keys_to_remove:
            self.storage.pop(key, None)
            if key in self.access_order:
                self.access_order.remove(key)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics for monitoring"""
        total_entries = len(self.storage)
        fresh_entries = sum(1 for entry in self.storage.values() 
                           if entry.is_fresh(self.shared_cache))
        stale_entries = total_entries - fresh_entries
        
        return {
            'total_entries': total_entries,
            'fresh_entries': fresh_entries,
            'stale_entries': stale_entries,
            'cache_size_bytes': sum(len(entry.body) for entry in self.storage.values()),
            'hit_rate': getattr(self, '_hit_count', 0) / max(getattr(self, '_request_count', 1), 1)
        }


# Example usage demonstrating RFC 9111 caching patterns
async def demonstrate_http_caching():
    """Demonstrate HTTP caching with various RFC 9111 scenarios"""
    
    # Create shared cache (like a CDN or proxy)
    shared_cache = HTTPCache(shared_cache=True, max_size=100)
    
    # Example 1: Basic caching with max-age
    print("=== Basic Caching Example ===")
    
    headers_basic = {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=3600',  # 1 hour
        'etag': '"v1.0"'
    }
    
    stored = shared_cache.store(
        url='https://api.example.com/data',
        method='GET',
        status_code=200,
        headers=headers_basic,
        body=b'{"data": "example"}'
    )
    print(f"Stored in cache: {stored}")
    
    # Retrieve from cache
    cached_entry = shared_cache.retrieve('https://api.example.com/data', 'GET')
    if cached_entry:
        print(f"Cache hit! Fresh: {cached_entry.is_fresh(shared_cache=True)}")
    
    # Example 2: Stale-while-revalidate pattern
    print("\\n=== Stale-While-Revalidate Example ===")
    
    headers_swr = {
        'content-type': 'text/html',
        'cache-control': 'max-age=60, stale-while-revalidate=300',  # Fresh for 1 min, usable for 5 mins
    }
    
    shared_cache.store(
        url='https://example.com/page',
        method='GET',
        status_code=200,
        headers=headers_swr,
        body=b'<html>Page content</html>'
    )
    
    # Simulate time passing to make entry stale
    entry = shared_cache.storage['GET:https://example.com/page']
    entry.stored_at = datetime.utcnow() - timedelta(seconds=120)  # 2 minutes ago
    
    cached_entry = shared_cache.retrieve('https://example.com/page', 'GET')
    if cached_entry:
        print(f"Stale but usable: {cached_entry.is_stale_but_usable(shared_cache=True)}")
    
    # Example 3: Vary header handling
    print("\\n=== Vary Header Example ===")
    
    headers_vary = {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=1800',
        'vary': 'Accept-Language, User-Agent'
    }
    
    request_headers_en = {
        'accept-language': 'en-US',
        'user-agent': 'Mozilla/5.0 (compatible; Bot/1.0)'
    }
    
    shared_cache.store(
        url='https://api.example.com/content',
        method='GET',
        status_code=200,
        headers=headers_vary,
        body=b'{"content": "English content"}',
        request_headers=request_headers_en
    )
    
    # Different request should miss cache due to Vary
    request_headers_fr = {
        'accept-language': 'fr-FR',
        'user-agent': 'Mozilla/5.0 (compatible; Bot/1.0)'
    }
    
    cached_entry = shared_cache.retrieve(
        'https://api.example.com/content', 
        'GET', 
        request_headers_fr
    )
    print(f"Cache miss for different language: {cached_entry is None}")
    
    # Example 4: Cache statistics
    print("\\n=== Cache Statistics ===")
    stats = shared_cache.get_stats()
    for key, value in stats.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    asyncio.run(demonstrate_http_caching())`;

export default rfc9111_cache_implementation;