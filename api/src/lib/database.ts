import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Create connection pool
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const client = postgres(connectionString, {
  prepare: false,
  max: 10, // Connection pool size
})

export const db = drizzle(client, { schema })

// Export schema for easy access
export * from './schema'