import { pgTable, uuid, varchar, decimal, boolean, timestamp, text, integer } from 'drizzle-orm/pg-core'

// paymentLinks - Unified payment link system supporting both payer and receiver flows
export const paymentLinks = pgTable('payment_links', {
  // Core identifiers
  id: uuid('id').primaryKey().defaultRandom(),
  shortId: varchar('short_id', { length: 12 }).notNull().unique(), // For user-friendly URLs
  
  // Creator information
  creatorAddress: varchar('creator_address', { length: 42 }).notNull(), // Wallet who created the link
  linkType: varchar('link_type', { length: 10 }).notNull(), // 'payer' | 'receiver'
  
  // Target (optional - for directed payments)
  targetAddress: varchar('target_address', { length: 42 }), // Specific recipient (optional)
  
  // Payment details
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  token: varchar('token', { length: 10 }).notNull(), // USDC, ETH, DAI, etc.
  chain: varchar('chain', { length: 20 }).notNull(), // ethereum, polygon, arbitrum, etc.
  
  // Escrow configuration - matching UI
  escrowType: varchar('escrow_type', { length: 20 }).notNull(), // 'instant_transfer' | 'time_locked'
  escrowHours: integer('escrow_hours'), // Hours for time_locked, null for instant_transfer
  
  // Description and metadata
  description: text('description'), // Payment description/memo
  
  // Status tracking
  status: varchar('status', { length: 20 }).notNull().default('created'),
  // created → pending_acceptance → channel_active → funds_locked → early_released | disputed | auto_released → completed
  
  // Early release functionality (payer can release before timelock expires)
  canEarlyRelease: boolean('can_early_release').default(true), // Allow payer to release early
  earlyReleasedAt: timestamp('early_released_at'), // When payer released early
  earlyReleasedBy: varchar('early_released_by', { length: 42 }), // Wallet address who released early
  
  // Counterparty (filled when someone accepts the link)
  acceptedBy: varchar('accepted_by', { length: 42 }), // Wallet address that accepted
  acceptedAt: timestamp('accepted_at'),
  
  // Yellow Network integration
  yellowChannelId: varchar('yellow_channel_id', { length: 255 }),
  nitroliteTransactionHash: varchar('nitrolite_transaction_hash', { length: 66 }),
  yellowNetworkStatus: varchar('yellow_network_status', { length: 20 }),
  
  // Contract and dispute details - matching UI
  attachWorkContract: boolean('attach_work_contract').default(false), // "Attach work contract/requirements"
  disputeResolution: boolean('dispute_resolution').default(false), // "Enable dispute resolution"
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'), // Link expiration (optional)
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
})

// contractDetails - Store custom contract terms and dispute resolution info
export const contractDetails = pgTable('contract_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  paymentLinkId: uuid('payment_link_id').references(() => paymentLinks.id).notNull(),
  
  // Contract information
  contractTerms: text('contract_terms'), // Work requirements/terms text
  contractFileUrl: varchar('contract_file_url', { length: 500 }), // Uploaded contract file URL
  contractFileName: varchar('contract_file_name', { length: 255 }), // Original filename
  contractFileType: varchar('contract_file_type', { length: 50 }), // PDF, DOC, DOCX, TXT
  
  // Dispute resolution
  arbitratorAddress: varchar('arbitrator_address', { length: 42 }),
  arbitrationFee: decimal('arbitration_fee', { precision: 18, scale: 8 }),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// yellowChannels - Simplified Yellow Network state channel tracking  
export const yellowChannels = pgTable('yellow_channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  paymentLinkId: uuid('payment_link_id').references(() => paymentLinks.id).notNull(),
  
  channelId: varchar('channel_id', { length: 255 }).notNull().unique(),
  participantA: varchar('participant_a', { length: 42 }).notNull(), // Creator
  participantB: varchar('participant_b', { length: 42 }).notNull(), // Acceptor
  
  asset: varchar('asset', { length: 10 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 18, scale: 8 }).notNull(),
  
  status: varchar('status', { length: 20 }).notNull().default('active'),
  // active → processing → settled → closed
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  settledAt: timestamp('settled_at'),
})