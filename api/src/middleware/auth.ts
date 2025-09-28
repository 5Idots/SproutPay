import { Context, Next } from 'hono'
import { z } from 'zod'
import { verifyMessage } from 'viem'

interface AuthContext extends Context {
  get: (key: 'walletAddress') => string | undefined
  set: (key: 'walletAddress', value: string) => void
}

// Validation schemas
export const walletSignatureSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format'),
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature format'),
  message: z.string().min(1, 'Message is required'),
  timestamp: z.number().min(0, 'Invalid timestamp')
})

/**
 * Middleware to validate wallet signatures and authenticate requests
 */
export const requireWalletAuth = () => {
  return async (c: AuthContext, next: Next) => {
    try {
      // Extract auth data from headers or body
      const authHeader = c.req.header('Authorization')
      let authData: any

      if (authHeader && authHeader.startsWith('Bearer ')) {
        // JWT-style auth header (base64 encoded JSON)
        try {
          const token = authHeader.substring(7)
          authData = JSON.parse(atob(token))
        } catch {
          return c.json({ error: 'Invalid authorization header format' }, 401)
        }
      } else {
        // Auth data in request body
        authData = await c.req.json()
      }

      // Validate auth data structure
      const validationResult = walletSignatureSchema.safeParse(authData)
      if (!validationResult.success) {
        return c.json({ 
          error: 'Invalid authentication data',
          details: validationResult.error.errors
        }, 400)
      }

      const { address, signature, message, timestamp } = validationResult.data

      // Check timestamp (5 minutes max age)
      const now = Date.now()
      const maxAge = 5 * 60 * 1000 // 5 minutes
      if (now - timestamp > maxAge) {
        return c.json({ 
          error: 'Authentication expired',
          message: 'Signature timestamp too old'
        }, 401)
      }

      // Verify the signature
      const isValidSignature = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: signature as `0x${string}`
      })

      if (!isValidSignature) {
        return c.json({ 
          error: 'Invalid signature',
          message: 'Wallet signature verification failed'
        }, 401)
      }

      // Store authenticated wallet address in context
      c.set('walletAddress', address.toLowerCase())

      return await next()
    } catch (error: any) {
      console.error('Wallet authentication error:', error)
      return c.json({ 
        error: 'Authentication failed',
        message: error.message
      }, 401)
    }
  }
}

/**
 * Middleware to validate wallet addresses in request parameters
 */
export const validateWalletAddress = (paramName: string = 'address') => {
  return async (c: Context, next: Next) => {
    try {
      const address = c.req.param(paramName)
      
      if (!address) {
        return c.json({ error: `${paramName} parameter is required` }, 400)
      }

      // Validate wallet address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return c.json({ error: `Invalid ${paramName} format` }, 400)
      }

      return await next()
    } catch (error: any) {
      console.error('Wallet address validation error:', error)
      return c.json({ 
        error: 'Validation failed',
        message: error.message
      }, 400)
    }
  }
}

/**
 * Middleware to check if authenticated wallet matches a specific address
 */
export const requireWalletMatch = (addressSource: 'param' | 'body' | 'custom', key?: string) => {
  return async (c: AuthContext, next: Next) => {
    try {
      const authenticatedAddress = c.get('walletAddress')
      if (!authenticatedAddress) {
        return c.json({ error: 'Wallet authentication required' }, 401)
      }

      let targetAddress: string | undefined

      switch (addressSource) {
        case 'param':
          targetAddress = c.req.param(key || 'address')
          break
        case 'body':
          const body = await c.req.json()
          targetAddress = body[key || 'address']
          break
        case 'custom':
          // Custom logic to extract address
          targetAddress = c.get(key || 'targetAddress')
          break
      }

      if (!targetAddress) {
        return c.json({ error: 'Target address not found' }, 400)
      }

      if (authenticatedAddress !== targetAddress.toLowerCase()) {
        return c.json({ 
          error: 'Wallet address mismatch',
          message: 'Authenticated wallet does not match required address'
        }, 403)
      }

      return await next()
    } catch (error: any) {
      console.error('Wallet match validation error:', error)
      return c.json({ 
        error: 'Authorization failed',
        message: error.message
      }, 403)
    }
  }
}

/**
 * Generate authentication message for wallet signing
 */
export const generateAuthMessage = (address: string, action: string = 'authenticate'): {
  message: string
  timestamp: number
} => {
  const timestamp = Date.now()
  const message = `SproutPay Authentication\n\nAddress: ${address}\nAction: ${action}\nTimestamp: ${timestamp}\n\nPlease sign this message to authenticate with SproutPay.`
  
  return { message, timestamp }
}

/**
 * Helper to create JWT-style auth token for frontend
 */
export const createAuthToken = (address: string, signature: string, message: string, timestamp: number): string => {
  const payload = {
    address,
    signature, 
    message,
    timestamp
  }
  
  return btoa(JSON.stringify(payload))
}