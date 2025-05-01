# SMC Protocol

## Introduction

SMC Protocol is a personal hedge fund framework built on Solana, designed to let individuals manage, grow, and tokenize their trading performance. This platform blends active treasury management with community-facing utility by combining asset trading, financial reporting, and access to daily financial content.

> **IMPORTANT NOTE**: This is a fairly new project and is still in development. Some features are still in beta. You may need to make adjustments to fit your specific requirements.

## Features

- **Personal Hedge Fund**: Create and manage your own treasury to optimize for growth, focusing on promising crypto assets.
- **Transparent NAV**: Live updates of your fund's Net Asset Value and portfolio holdings through either API integration or manual tracking via the admin panel.
- **Token-Gated Financial Content**: Allow users holding your token (or paying in SOL) to access exclusive financial research articles.
- **Open Market Speculation**: Make your token freely tradable on DEXes, enabling organic price discovery.
- **Automated Financial Publishing**: Leverage AI to automate the generation of high-quality financial articles.

## Tech Stack

- **Frontend**: NextJS (React-based) + TypeScript, TailwindCSS
- **Wallet Integration**: Solana Wallet Adapter (Phantom, Backpack, Solflare)
- **Backend**: NextJS API routes, Prisma + PostgreSQL
- **Smart Contracts**: SPL Token standard for your fund's token
- **AI and Automation**: OpenAI GPT-4 API for article generation (or any other LLM API)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database connection string
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"

# Solana RPC URL (use a provider like Helius, QuickNode, or the public endpoint)
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"

# OpenAI API key for article generation (optional)
OPENAI_API_KEY="your-openai-api-key"

# Birdeye API key for token price data (optional)
BIRDEYE_API_KEY="your-birdeye-api-key"

# Your treasury wallet public key
TREASURY_WALLET_PUBKEY="your-treasury-wallet-public-key"

# Your fund's token mint address (if you've created one)
TOKEN_MINT="your-token-mint-address"
```

You can find a sample environment file at `example.env` that you can rename to `.env` and update with your values.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the environment variables in `.env`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Database Setup

This project uses Prisma with PostgreSQL. To set up the database:

1. Make sure PostgreSQL is installed and running
2. Update the DATABASE_URL in your `.env` file
3. Run migrations: `npx prisma migrate dev`
4. Generate Prisma client: `npx prisma generate`


