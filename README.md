# SMC Protocol

A Framework to create your own personal hedge fund on Solana.

SMC Protocol is a decentralized personal hedge fund framework built on Solana, designed to empower individuals to manage, grow, and tokenize their trading performance. This platform seamlessly blends active treasury management with community-facing utility by combining asset trading, transparent financial reporting, and exclusive access to daily financial content.

## Features

- **Personal Hedge Fund**: Create and manage your own treasury to optimize for growth, focusing on promising crypto assets.
- **Transparent NAV**: Live updates of your fund's Net Asset Value and portfolio holdings.
- **Token-Gated Financial Content**: Allow users holding your tokens (or paying in SOL) to access exclusive financial research articles.
- **Open Market Speculation**: Make your tokens freely tradable on DEXes, enabling organic price discovery.
- **Automated Financial Publishing**: Leverage cutting-edge AI (LLMs) to automate the generation of high-quality financial articles daily.

## Tech Stack

- **Frontend**: NextJS (React-based) + TypeScript, TailwindCSS
- **Wallet Integration**: Solana Wallet Adapter (Phantom, Backpack, Solflare)
- **Backend**: NextJS API routes, Prisma + PostgreSQL
- **Smart Contracts**: SPL Token standard for your fund's token
- **AI and Automation**: OpenAI GPT-4 API for article generation

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database connection string
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"

# Solana RPC URL
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"

# OpenAI API key for article generation
OPENAI_API_KEY="your-openai-api-key"

# Treasury wallet public key
TREASURY_WALLET_PUBKEY="your-treasury-wallet-public-key"

# Your fund's token mint address
TOKEN_MINT="your-token-mint-address"
```

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


