import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '../../admin/check/utils';
import axios from 'axios';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Define the Token type based on our Prisma schema
type PrismaToken = {
  id: string;
  treasuryId: string;
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  logoURI: string | null;
  color: string | null;
  isAutoUpdated: boolean;
  updatedAt: Date;
  createdAt: Date;
};

// USDC token mint address on Solana
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// Fallback file storage for manual tokens if database connection fails
const MANUAL_TOKENS_FILE = path.join(process.cwd(), 'manual-tokens.json');

// Function to read manual tokens from file
function readManualTokensFromFile() {
  try {
    if (fs.existsSync(MANUAL_TOKENS_FILE)) {
      const data = fs.readFileSync(MANUAL_TOKENS_FILE, 'utf8');
      console.log('Read manual tokens from file:', MANUAL_TOKENS_FILE);
      return JSON.parse(data);
    } else {
      console.log('Manual tokens file does not exist:', MANUAL_TOKENS_FILE);
    }
  } catch (error) {
    console.error('Error reading manual tokens file:', error);
  }
  return { address: '', tokens: [] };
}

// Function to write manual tokens to file
function writeManualTokensToFile(data: any) {
  try {
    fs.writeFileSync(MANUAL_TOKENS_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('Wrote manual tokens to file:', MANUAL_TOKENS_FILE);
    console.log('Data saved:', data);
  } catch (error) {
    console.error('Error writing manual tokens file:', error);
  }
}

// Define token interfaces
interface TokenData {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  color?: string;
  logoURI?: string;
  isAutoUpdated?: boolean;
  isReadOnly?: boolean;
}

// Cache for SOL and USDC data
let cachedSolUsdcData: {
  solToken: TokenData | null;
  usdcToken: TokenData | null;
  lastUpdated: number | null;
} = {
  solToken: null,
  usdcToken: null,
  lastUpdated: null
};

// Function to fetch SOL and USDC data from APIs
async function fetchSolAndUsdcData(): Promise<{ solToken: TokenData | null; usdcToken: TokenData | null } | null> {
  try {
    const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || process.env.TREASURY_WALLET_PUBKEY || 'YOUR_TREASURY_WALLET_ADDRESS';
    if (!treasuryAddress) {
      console.error('Treasury address not set');
      return null;
    }
    
    // Fetch token balances from Helius API
    const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    const heliusResponse = await axios.get(
      `https://api.helius.xyz/v0/addresses/${treasuryAddress}/balances?api-key=${heliusApiKey}`
    );
    
    // Extract SOL and USDC balances from Helius response
    const { tokens, nativeBalance } = heliusResponse.data;
    
    // Get SOL price from CoinGecko
    const coinGeckoResponse = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    );
    const solPrice = coinGeckoResponse.data.solana.usd;
    
    // Calculate SOL balance and USD value
    const solBalance = nativeBalance / 1e9; // Convert lamports to SOL
    const solUsdValue = solBalance * solPrice;
    
    // Find USDC in the tokens array
    const usdcHeliusToken = tokens.find((token: any) => 
      token.mint === USDC_MINT
    );
    
    // Calculate USDC balance and USD value (USDC is pegged to USD)
    let usdcBalance = 0;
    let usdcUsdValue = 0;
    
    if (usdcHeliusToken) {
      usdcBalance = parseInt(usdcHeliusToken.amount) / (10 ** usdcHeliusToken.decimals);
      usdcUsdValue = usdcBalance; // USDC is pegged to USD
    }
    
    // Create token objects for SOL and USDC
    const solToken = {
      mint: 'So11111111111111111111111111111111111111112', // Native SOL mint address
      symbol: 'SOL',
      name: 'Solana',
      amount: solBalance,
      usdValue: solUsdValue,
      color: '#9945FF'
    };
    
    const usdcToken = {
      mint: USDC_MINT,
      symbol: 'USDC',
      name: 'USD Coin',
      amount: usdcBalance,
      usdValue: usdcUsdValue,
      color: '#2775CA'
    };
    
    return { solToken, usdcToken };
  } catch (error) {
    console.error('Error fetching SOL and USDC data:', error);
    return null;
  }
}

// Function to generate a deterministic color for a token based on its mint address
function generateTokenColor(mintAddress: string): string {
  // Simple hash function to convert the mint address to a number
  let hash = 0;
  for (let i = 0; i < mintAddress.length; i++) {
    hash = ((hash << 5) - hash) + mintAddress.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Generate a pastel color using HSL
  // Use the hash to determine the hue (0-360)
  const hue = Math.abs(hash) % 360;
  // Fixed saturation and lightness for pastel colors
  const saturation = 70; // %
  const lightness = 60; // %
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// We don't need to store auto-updated tokens in the database
// They will be fetched from the API on each request

// GET handler to retrieve treasury data
export async function GET() {
  try {
    // Check if we need to update SOL and USDC data
    const currentTime = Date.now();
    const oneHourInMs = 60 * 60 * 1000;
    const shouldUpdateSolUsdc = !cachedSolUsdcData.lastUpdated || 
      (currentTime - cachedSolUsdcData.lastUpdated > oneHourInMs);
    
    if (shouldUpdateSolUsdc) {
      console.log('Fetching fresh SOL and USDC data...');
      const solUsdcData = await fetchSolAndUsdcData();
      
      if (solUsdcData) {
        cachedSolUsdcData = {
          solToken: solUsdcData.solToken,
          usdcToken: solUsdcData.usdcToken,
          lastUpdated: currentTime
        };
      }
    }
    
    // Initialize response data
    let manualTokens = [];
    let treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || process.env.TREASURY_WALLET_PUBKEY || 'YOUR_TREASURY_WALLET_ADDRESS';
    let dbSuccess = false;
    
    // Try to get manual tokens from database first
    try {
      console.log('Attempting to get tokens from database...');
      // Get treasury data from the database
      const treasury = await prisma.treasury.findFirst({
        include: {
          tokens: true
        }
      });
      
      if (treasury) {
        console.log('Found treasury in database:', treasury.id);
        // Get all tokens associated with this treasury
        manualTokens = treasury.tokens.map((token: PrismaToken) => ({
          mint: token.mint,
          symbol: token.symbol,
          name: token.name,
          amount: token.amount,
          usdValue: token.usdValue,
          color: token.color || generateTokenColor(token.mint),
          logoURI: token.logoURI,
          isAutoUpdated: token.isAutoUpdated,
          isReadOnly: token.isAutoUpdated
        }));
        dbSuccess = true;
        treasuryAddress = treasury.address;
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      dbSuccess = false;
    }
    
    // If database retrieval failed, try file storage
    if (!dbSuccess) {
      console.log('Database retrieval failed or not available, reading from file storage...');
      try {
        const fileData = readManualTokensFromFile();
        if (fileData && fileData.tokens) {
          manualTokens = fileData.tokens;
          if (fileData.address) {
            treasuryAddress = fileData.address;
          }
          console.log('Loaded tokens from file:', manualTokens.length);
        } else {
          console.log('No tokens found in file storage');
        }
      } catch (fileError) {
        console.error('Error reading from file storage:', fileError);
      }
    }
    
    // Filter out any SOL and USDC tokens from manual data
    // (they should only come from the API)
    manualTokens = manualTokens.filter((token: TokenData) => 
      token.symbol !== 'SOL' && token.mint !== 'So11111111111111111111111111111111111111112' &&
      token.symbol !== 'USDC' && token.mint !== USDC_MINT
    );
    
    // Prepare the combined tokens array
    let allTokens = [...manualTokens];
    
    // Add the auto-updated SOL and USDC tokens if available
    if (cachedSolUsdcData.solToken) {
      allTokens.push({
        ...cachedSolUsdcData.solToken,
        color: cachedSolUsdcData.solToken.color || generateTokenColor('So11111111111111111111111111111111111111112'),
        logoURI: cachedSolUsdcData.solToken.logoURI || '',
        isAutoUpdated: true,
        isReadOnly: true
      });
    }
    
    if (cachedSolUsdcData.usdcToken) {
      allTokens.push({
        ...cachedSolUsdcData.usdcToken,
        color: cachedSolUsdcData.usdcToken.color || generateTokenColor(USDC_MINT),
        logoURI: cachedSolUsdcData.usdcToken.logoURI || '',
        isAutoUpdated: true,
        isReadOnly: true
      });
    }
    
    // Calculate total NAV
    const totalNav = allTokens.reduce((sum, token) => sum + token.usdValue, 0);
    
    // Return the combined data
    return NextResponse.json({
      address: treasuryAddress,
      nav: totalNav,
      tokens: allTokens
    });
    

    
    // Return the combined data (already done above)
  } catch (error) {
    console.error('Error fetching treasury data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treasury data' },
      { status: 500 }
    );
  }
}

// POST handler to update treasury data
export async function POST(request: NextRequest) {
  try {
    // Get the wallet address from the request
    const walletAddress = request.headers.get('x-wallet-address');
    
    // Check if the user is an admin
    if (!walletAddress || !isAdmin(walletAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    
    // Validate the data structure
    if (!data.address || (data.nav === undefined) || !Array.isArray(data.tokens)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }
    
    // Filter out auto-updated tokens (SOL and USDC)
    const manualTokens = data.tokens.filter((token: TokenData) => {
      const isAutoToken = token.symbol === 'SOL' || token.symbol === 'USDC' ||
                         token.mint === 'So11111111111111111111111111111111111111112' || 
                         token.mint === USDC_MINT;
      return !isAutoToken || !token.isReadOnly;
    });
    
    // Try to save to database first
    let dbSuccess = false;
    console.log('Attempting to save treasury data...');
    
    try {
      console.log('Attempting database save');
      // Find or create the treasury record
      let treasury = await prisma.treasury.findFirst();
      
      if (!treasury) {
        // Create a new treasury if none exists
        treasury = await prisma.treasury.create({
          data: {
            address: data.address,
            netAssetValue: data.nav
          }
        });
      } else {
        // Update existing treasury
        treasury = await prisma.treasury.update({
          where: { id: treasury.id },
          data: { 
            address: data.address,
            netAssetValue: data.nav 
          }
        });
      }
      
      // Get existing tokens
      const existingTokens = await prisma.token.findMany({
        where: { treasuryId: treasury.id }
      });
      
      // Delete tokens that aren't auto-updated
      await prisma.token.deleteMany({
        where: {
          treasuryId: treasury.id,
          isAutoUpdated: false
        }
      });
      
      // Save each manual token with the treasury relationship
      for (const token of manualTokens) {
        await prisma.token.create({
          data: {
            treasuryId: treasury.id,
            mint: token.mint,
            symbol: token.symbol,
            name: token.name,
            amount: token.amount,
            usdValue: token.usdValue,
            logoURI: token.logoURI || '',
            color: token.color || generateTokenColor(token.mint),
            isAutoUpdated: false
          }
        });
      }
      
      // Create a treasury update record for history
      await prisma.treasuryUpdate.create({
        data: {
          treasuryId: treasury.id,
          netAssetValue: data.nav,
          previousNAV: treasury.netAssetValue,
          percentChange: treasury.netAssetValue > 0 
            ? ((data.nav - treasury.netAssetValue) / treasury.netAssetValue) * 100 
            : 0,
          snapshot: JSON.stringify(data.tokens)
        }
      });
      
      dbSuccess = true;
    } catch (dbError) {
      console.error('Failed to save to database:', dbError);
      console.error(dbError);
      dbSuccess = false;
    }
    
    // If database save failed, save to file as backup
    if (!dbSuccess) {
      console.log('Database save failed or not available, saving to file instead');
      try {
        // Prepare token data for file storage
        const tokenDataForFile = manualTokens.map((token: TokenData) => ({
          mint: token.mint,
          symbol: token.symbol,
          name: token.name,
          amount: token.amount,
          usdValue: token.usdValue,
          logoURI: token.logoURI || '',
          color: token.color || generateTokenColor(token.mint)
        }));
        
        // Save to file
        const fileData = {
          address: data.address,
          tokens: tokenDataForFile
        };
        
        writeManualTokensToFile(fileData);
        
        // Verify the file was written
        if (fs.existsSync(MANUAL_TOKENS_FILE)) {
          const fileSize = fs.statSync(MANUAL_TOKENS_FILE).size;
          console.log(`File saved successfully. Size: ${fileSize} bytes`);
        } else {
          console.error('File was not created successfully');
        }
      } catch (fileError) {
        console.error('Error saving to file:', fileError);
      }
    } else {
      console.log('Database save successful!');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating treasury data:', error);
    return NextResponse.json(
      { error: 'Failed to update treasury data' },
      { status: 500 }
    );
  }
}