import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
}

/**
 * Rate limiting middleware for API routes
 */
export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests',
  } = options;

  return (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    // Clean up expired entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }

    // Get or create rate limit entry
    let rateLimitEntry = rateLimitMap.get(ip);
    if (!rateLimitEntry || rateLimitEntry.resetTime < now) {
      rateLimitEntry = { count: 0, resetTime: now + windowMs };
      rateLimitMap.set(ip, rateLimitEntry);
    }

    // Increment request count
    rateLimitEntry.count++;

    // Check if rate limit exceeded
    if (rateLimitEntry.count > maxRequests) {
      return NextResponse.json(
        {
          error: message,
          retryAfter: Math.ceil((rateLimitEntry.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(
              (rateLimitEntry.resetTime - now) / 1000
            ).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(
              0,
              maxRequests - rateLimitEntry.count
            ).toString(),
            'X-RateLimit-Reset': rateLimitEntry.resetTime.toString(),
          },
        }
      );
    }

    return null; // No rate limit exceeded
  };
}

// Predefined rate limiters for different endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please try again later.',
});

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  message: 'Rate limit exceeded, please slow down.',
});
