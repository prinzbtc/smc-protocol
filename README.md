# SMC Protocol

<p align="center">
  <img src="public/smcprotocol-square.png" alt="SMC Protocol Logo" width="200"/>
</p>

## Introduction

The SMC Protocol is a personal hedge fund framework built on Solana, designed to let individuals manage, grow, and tokenize their trading performance. This platform blends active treasury management with community-facing utility by combining asset trading, financial reporting, and access to daily financial content.

To see a live example of this framework in action, check out [Smart Money Capital](https://www.smartmoneycapital.xyz/), which is our very own implementation of the SMC Protocol.

> **IMPORTANT NOTE**: This is a fairly new project and is still in development. Some features are still in beta. You may need to make adjustments to fit your specific requirements.

**ALSO**: If you managed to run this framework and came up with a cool iteration, please send SOL or any valuable SPL cryptocurrency to our treasury wallet (8CzQcMERqyZRUE6DTGophorgy46gqaSWqDmLmUo2LjzJ) to manifest your gratitude.

## Features

- **Personal Hedge Fund**: Create and manage your own treasury to optimize for growth, focusing on promising crypto assets.
- **Transparent NAV**: Live updates of your fund's Net Asset Value and portfolio holdings through either API integration (you'll need a Birdeye paid plan and an API key for that) or manual tracking via the admin panel (painful solution if you're broke).
- **Token-Gated Financial Content**: Allow users holding your token (or paying in SOL) to access exclusive financial research articles.
- **Open Market Speculation**: Make your token freely tradable on DEXes, enabling organic price discovery.
- **Automated Financial Publishing**: Leverage AI to automate the generation of high-quality financial articles. You'll need an OpenAI API key and a OpenAI paid plan (or any other LLM API) for this feature.

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

## Token Creation and Metadata Management

To fully set up your personal hedge fund, you'll need to create a token on Solana and configure its metadata. This guide covers the entire process using the Token-2022 program, which offers advanced features including updatable metadata.

### Prerequisites

- Solana CLI tools installed (`solana`, `spl-token`)
- A funded Solana wallet (at least 0.1 SOL for token creation)
- Node.js and npm for running scripts

### Step 1: Create a Token with Metadata

```javascript
// token-creation.js
const {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} = require('@solana/web3.js');
const {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createMintToInstruction,
  getOrCreateAssociatedTokenAccount
} = require('@solana/spl-token');
const {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
} = require('@solana/spl-token-metadata');
const fs = require('fs');

// Load your wallet keypair
const secretKeyArray = JSON.parse(fs.readFileSync('./treasury-keypair.json'));
const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));

// Connect to Solana
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Generate new keypair for Mint Account
const mintKeypair = Keypair.generate();
console.log('Token Mint Address:', mintKeypair.publicKey.toString());

// Define token properties
const decimals = 9;
const mintAuthority = keypair.publicKey;
const updateAuthority = keypair.publicKey;

// Metadata to store in Mint Account
const metaData = {
  updateAuthority: updateAuthority,
  mint: mintKeypair.publicKey,
  name: "Your Fund Name",
  symbol: "SYMBOL",
  uri: "https://raw.githubusercontent.com/yourusername/your-repo/main/public/token-metadata.json",
  additionalMetadata: [["description", "Your fund description"]]
};

// Calculate space and rent
const metadataExtension = 4; // 2 bytes for type, 2 bytes for length
const metadataLen = pack(metaData).length;
const mintLen = getMintLen([ExtensionType.MetadataPointer]);
const lamports = await connection.getMinimumBalanceForRentExemption(
  mintLen + metadataExtension + metadataLen
);

async function createToken() {
  // Build instructions
  // 1. Create account
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: keypair.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID
  });
  
  // 2. Initialize metadata pointer
  const initializeMetadataPointerInstruction = createInitializeMetadataPointerInstruction(
    mintKeypair.publicKey,
    updateAuthority,
    mintKeypair.publicKey,
    TOKEN_2022_PROGRAM_ID
  );
  
  // 3. Initialize mint
  const initializeMintInstruction = createInitializeMintInstruction(
    mintKeypair.publicKey,
    decimals,
    mintAuthority,
    null, // Freeze authority (null = no freeze authority)
    TOKEN_2022_PROGRAM_ID
  );
  
  // 4. Initialize metadata
  const initializeMetadataInstruction = createInitializeInstruction({
    programId: TOKEN_2022_PROGRAM_ID,
    metadata: mintKeypair.publicKey,
    updateAuthority: updateAuthority,
    mint: mintKeypair.publicKey,
    mintAuthority: mintAuthority,
    name: metaData.name,
    symbol: metaData.symbol,
    uri: metaData.uri
  });
  
  // 5. Update metadata with description
  const updateFieldInstruction = createUpdateFieldInstruction({
    programId: TOKEN_2022_PROGRAM_ID,
    metadata: mintKeypair.publicKey,
    updateAuthority: updateAuthority,
    field: metaData.additionalMetadata[0][0],
    value: metaData.additionalMetadata[0][1]
  });
  
  // Create transaction with all instructions
  const transaction = new Transaction().add(
    createAccountInstruction,
    initializeMetadataPointerInstruction,
    initializeMintInstruction,
    initializeMetadataInstruction,
    updateFieldInstruction
  );
  
  // Sign and send transaction
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair, mintKeypair],
    { commitment: 'confirmed', maxRetries: 5 }
  );
  
  console.log(`Token created successfully!`);
  console.log(`Transaction signature: ${signature}`);
  
  // Mint tokens to treasury
  const treasuryTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    mintKeypair.publicKey,
    keypair.publicKey,
    false,
    'confirmed',
    { commitment: 'confirmed' },
    TOKEN_2022_PROGRAM_ID
  );
  
  // Mint 1 billion tokens (with 9 decimals)
  const amount = 1_000_000_000 * Math.pow(10, decimals);
  
  // Create mint instruction
  const mintToInstruction = createMintToInstruction(
    mintKeypair.publicKey,
    treasuryTokenAccount.address,
    mintAuthority,
    amount,
    [],
    TOKEN_2022_PROGRAM_ID
  );
  
  // Create and send transaction
  const mintTx = new Transaction().add(mintToInstruction);
  
  const mintSignature = await sendAndConfirmTransaction(
    connection,
    mintTx,
    [keypair],
    { commitment: 'confirmed', maxRetries: 5 }
  );
  
  console.log(`Tokens minted successfully!`);
  console.log(`Mint transaction signature: ${mintSignature}`);
}

createToken();
```

### Step 2: Prepare Token Metadata JSON

Create a token metadata JSON file and host it on GitHub or another public location:

```json
{
  "name": "Your Fund Name",
  "symbol": "SYMBOL",
  "description": "Your fund description",
  "image": "https://raw.githubusercontent.com/yourusername/your-repo/main/public/token-logo.png",
  "decimals": 9
}
```

**Important**: For the image URL, always use the raw GitHub URL format (`https://raw.githubusercontent.com/...`) rather than the GitHub web interface URL (`https://github.com/...`).

### Step 3: Update Token Metadata (If Needed)

If you need to update your token's metadata after creation (e.g., fix the image URL), use the Solana CLI:

```bash
# Configure Solana CLI
solana config set --url mainnet-beta
solana config set --keypair path/to/your/treasury-keypair.json

# Update token metadata (example: updating the image URL)
spl-token update-metadata --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb YOUR_TOKEN_MINT_ADDRESS image "https://raw.githubusercontent.com/yourusername/your-repo/main/public/token-logo.png"
```

### Step 4: Verify Token Metadata

After creating or updating your token, verify it on Solana explorers:

- [Solscan](https://solscan.io/token/YOUR_TOKEN_MINT_ADDRESS)
- [Solana Explorer](https://explorer.solana.com/address/YOUR_TOKEN_MINT_ADDRESS)

### Security Considerations

1. **Protect Your Private Keys**: Never share or commit your treasury wallet keypair file to version control.
2. **Delete Sensitive Files**: After token operations, delete any files containing private keys.
3. **Use Reliable RPC Endpoints**: For production use, consider using paid RPC services like Helius for better reliability.

### Troubleshooting

- **Image Not Showing**: Ensure you're using the raw GitHub URL for your image.
- **Transaction Failures**: Try using a paid RPC endpoint if you encounter timeouts or errors.
- **Metadata Updates**: Only the update authority (typically your treasury wallet) can modify token metadata.

After completing these steps, update your `.env` file with your new token mint address.
