# Sprout Hono API

This is the Hono-based API backend for the Sprout application, extracted from the original Nuxt project to work with a React frontend.

## Features

- **Hono Framework**: Fast, lightweight web framework
- **PostgreSQL + Drizzle**: Type-safe database operations
- **Yellow Network Integration**: ERC-7824 state channels via Official Gryffindors Yellow SDK
- **Wallet Validation**: On-chain wallet verification
- **CORS Support**: Ready for React frontend integration

## API Endpoints

### Users
- `POST /api/users` - Create new user
- `GET /api/users/:username` - Get user by username

### Payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/:id` - Get payment by ID

### Yellow Network
- `POST /api/yellow/channels` - Create Yellow Network channel
- `GET /api/yellow/channels/:channelId/status` - Get channel status
- `POST /api/yellow/channels/:channelId/settle` - Settle channel

## Setup

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Fill in your database and Yellow Network credentials
```

3. Generate and run database migrations:
```bash
bun run db:generate
bun run db:migrate
```

4. Start the development server:
```bash
bun run dev
```

The API will be available at `http://localhost:3001`

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `YELLOW_PRIVATE_KEY` - Yellow Network private key for authentication
- `YELLOW_WS_URL` - Yellow Network WebSocket URL (default: wss://clearnet.yellow.com/ws)
- `YELLOW_APP_NAME` - Application name for Yellow Network (default: SproutPay)
- `YELLOW_NETWORK` - Network environment (default: mainnet)
- `PORT` - Server port (default: 3001)

## Migration from Nuxt

This API maintains the same database schema and business logic from the original Nuxt project, but is restructured to work as a standalone Hono API that can be consumed by any frontend framework.