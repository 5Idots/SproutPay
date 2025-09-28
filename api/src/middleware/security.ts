import { Context, Next } from 'hono'
import { Redis } from 'ioredis'

// Redis client for rate limiting (optional - falls back to in-memory)
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null

// In-memory store for rate limiting when Redis is not available
const memoryStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (c: Context) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

/**
 * Rate limiting middleware
 */
export const rateLimit = (options: RateLimitOptions) => {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (c) => c.req.header('x-forwarded-for') || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options

  return async (c: Context, next: Next) => {
    const key = `ratelimit:${keyGenerator(c)}`
    const now = Date.now()
    const windowStart = now - windowMs

    try {
      let currentCount: number
      let resetTime: number

      if (redis) {
        // Redis-based rate limiting
        const pipe = redis.pipeline()
        pipe.zremrangebyscore(key, 0, windowStart)
        pipe.zadd(key, now, now)
        pipe.zcount(key, windowStart, now)
        pipe.expire(key, Math.ceil(windowMs / 1000))
        
        const results = await pipe.exec()
        currentCount = (results?.[2]?.[1] as number) || 0
        resetTime = now + windowMs
      } else {
        // In-memory rate limiting
        const record = memoryStore.get(key)
        
        if (!record || record.resetTime <= now) {
          currentCount = 1
          resetTime = now + windowMs
          memoryStore.set(key, { count: currentCount, resetTime })
        } else {
          currentCount = record.count + 1
          resetTime = record.resetTime
          memoryStore.set(key, { count: currentCount, resetTime })
        }
      }

      // Add rate limit headers
      c.header('X-RateLimit-Limit', maxRequests.toString())
      c.header('X-RateLimit-Remaining', Math.max(0, maxRequests - currentCount).toString())
      c.header('X-RateLimit-Reset', new Date(resetTime).toISOString())

      if (currentCount > maxRequests) {
        return c.json({
          error: 'Rate limit exceeded',
          message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
          retryAfter: Math.ceil((resetTime - now) / 1000)
        }, 429)
      }

      await next()

      // Optionally skip counting successful requests
      if (skipSuccessfulRequests && c.res.status < 400) {
        if (redis) {
          await redis.zrem(key, now.toString())
        } else {
          const record = memoryStore.get(key)
          if (record) {
            memoryStore.set(key, { count: record.count - 1, resetTime: record.resetTime })
          }
        }
      }

    } catch (error) {
      console.error('Rate limiting error:', error)
      // Continue without rate limiting if there's an error
      await next()
    }
  }
}

/**
 * IP-based rate limiting
 */
export const ipRateLimit = (maxRequests: number, windowMs: number = 60000) => {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
  })
}

/**
 * Wallet-based rate limiting
 */
export const walletRateLimit = (maxRequests: number, windowMs: number = 60000) => {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (c) => {
      // Try to get wallet address from context or headers
      const walletAddress = (c as any).get?.('walletAddress') || 
                           c.req.header('x-wallet-address') || 
                           'anonymous'
      return `wallet:${walletAddress.toLowerCase()}`
    }
  })
}

/**
 * Security headers middleware
 */
export const securityHeaders = () => {
  return async (c: Context, next: Next) => {
    // Security headers
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')
    c.header('X-XSS-Protection', '1; mode=block')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    
    // Remove server header
    c.header('Server', 'SproutPay API')
    
    await next()
  }
}

/**
 * Request validation middleware
 */
export const validateRequest = () => {
  return async (c: Context, next: Next) => {
    try {
      const contentType = c.req.header('content-type')
      
      // Validate content type for POST/PUT requests
      if (['POST', 'PUT', 'PATCH'].includes(c.req.method)) {
        if (!contentType?.includes('application/json')) {
          return c.json({
            error: 'Invalid content type',
            message: 'Content-Type must be application/json'
          }, 400)
        }
      }

      // Check for common attack patterns in headers
      const userAgent = c.req.header('user-agent') || ''
      const suspiciousPatterns = [
        /sqlmap/i,
        /nikto/i,
        /nessus/i,
        /<script/i,
        /javascript:/i
      ]

      if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
        console.warn('Suspicious request detected:', {
          userAgent,
          ip: c.req.header('x-forwarded-for'),
          path: c.req.url
        })
        
        return c.json({
          error: 'Request blocked',
          message: 'Suspicious activity detected'
        }, 403)
      }

      await next()
    } catch (error) {
      console.error('Request validation error:', error)
      return c.json({
        error: 'Request validation failed',
        message: 'Invalid request format'
      }, 400)
    }
  }
}

/**
 * CORS configuration for production
 */
export const productionCors = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://sproutpay.app'
  ]

  return async (c: Context, next: Next) => {
    const origin = c.req.header('origin')
    
    if (origin && allowedOrigins.includes(origin)) {
      c.header('Access-Control-Allow-Origin', origin)
    } else if (process.env.NODE_ENV !== 'production') {
      // Allow all origins in development
      c.header('Access-Control-Allow-Origin', '*')
    }

    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Wallet-Address')
    c.header('Access-Control-Max-Age', '86400')

    if (c.req.method === 'OPTIONS') {
      return c.text('', 204)
    }

    await next()
  }
}

/**
 * Request logging with security context
 */
export const securityLogger = () => {
  return async (c: Context, next: Next) => {
    const start = Date.now()
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
    const userAgent = c.req.header('user-agent') || 'unknown'
    const walletAddress = (c as any).get?.('walletAddress') || 'anonymous'

    await next()

    const duration = Date.now() - start
    
    // Log security-relevant requests
    if (c.res.status >= 400 || duration > 5000) {
      console.warn('Security event:', {
        method: c.req.method,
        path: c.req.url,
        status: c.res.status,
        duration,
        ip,
        userAgent,
        walletAddress,
        timestamp: new Date().toISOString()
      })
    }
  }
}