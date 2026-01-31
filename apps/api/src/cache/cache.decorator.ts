import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

/**
 * Apply caching to a route with custom TTL
 * @param ttl Time to live in milliseconds
 */
export function Cached(ttl?: number) {
  const decorators = [UseInterceptors(CacheInterceptor)];

  if (ttl) {
    decorators.push(CacheTTL(ttl));
  }

  return applyDecorators(...decorators);
}
