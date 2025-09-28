import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Import routes
import paymentLinksRoutes from './routes/payment-links'
import yellowRoutes from './routes/yellow'
import { YellowNetworkService } from './lib/yellow-network'

// Import middleware
import { 
  ipRateLimit, 
  walletRateLimit,
  securityHeaders, 
  validateRequest, 
  productionCors,
  securityLogger
} from './middleware/security'

const app = new Hono()

// Security middleware (applied first)
app.use('*', securityHeaders())
app.use('*', productionCors())
app.use('*', validateRequest())
app.use('*', securityLogger())

// Rate limiting - general API
app.use('/api/*', ipRateLimit(100, 60000)) // 100 requests per minute per IP

// Standard middleware
app.use('*', logger())
app.use('*', prettyJSON())

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'sprout-hono-api'
  })
})

// API routes with specific rate limiting (rate limiting applied before routes)
app.use('/api/payment-links/*', walletRateLimit(20, 60000)) // 20 requests per minute per wallet
app.route('/api/payment-links', paymentLinksRoutes)

app.use('/api/yellow/*', walletRateLimit(10, 60000)) // 10 requests per minute for Yellow Network operations
app.route('/api/yellow', yellowRoutes)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(err)
  return c.json({ 
    error: 'Internal Server Error',
    message: err.message 
  }, 500)
})

const port = parseInt(process.env.PORT || '3001')

console.log(`🚀 Sprout Hono API starting on port ${port}`)

// Initialize Yellow Network monitoring on startup
const initializeYellowMonitoring = async () => {
  try {
    const yellowService = new YellowNetworkService()
    await yellowService.startChannelMonitoring()
    console.log('✅ Yellow Network ERC-7824 monitoring initialized')
  } catch (error) {
    console.error('❌ Failed to initialize Yellow Network monitoring:', error)
  }
}

// Start server with monitoring
serve({
  fetch: app.fetch,
  port,
})

// Initialize monitoring after server starts
initializeYellowMonitoring()