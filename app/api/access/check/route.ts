import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Function to check if wallet holds SMC tokens
async function checkTokenHolding(walletAddress: string): Promise<boolean> {
  try {
    // Connect to Solana network
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    
    // Get SMC token mint from environment
    const tokenMint = new PublicKey(process.env.SMC_TOKEN_MINT || '');
    const walletPublicKey = new PublicKey(walletAddress);
    
    // Find token accounts for this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    
    // Check if any account holds SMC tokens
    for (const account of tokenAccounts.value) {
      const parsedInfo = account.account.data.parsed.info;
      const mintAddress = parsedInfo.mint;
      const tokenBalance = parsedInfo.tokenAmount.uiAmount;
      
      if (mintAddress === tokenMint.toString() && tokenBalance > 0) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token holdings:', error);
    return false;
  }
}

// GET /api/access/check - Check if a wallet has access to premium content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    const articleSlug = searchParams.get('articleSlug');
    
    // Validate parameters
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    if (!articleSlug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }
    
    // Check if article exists and is premium
    const article = await prisma.article.findUnique({
      where: { slug: articleSlug },
    });
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // If article is not premium, access is granted
    if (!article.isPremium) {
      return NextResponse.json({ hasAccess: true, reason: 'free_content' });
    }
    
    // Check if this wallet has previously paid for this article
    const existingAccess = await prisma.accessLog.findFirst({
      where: {
        articleId: article.id,
        walletAddress,
      },
    });
    
    if (existingAccess) {
      return NextResponse.json({ hasAccess: true, reason: 'previously_paid' });
    }
    
    // Check if wallet holds SMC tokens
    const holdsTokens = await checkTokenHolding(walletAddress);
    
    if (holdsTokens) {
      // Log token-based access
      await prisma.accessLog.create({
        data: {
          articleId: article.id,
          walletAddress,
          accessType: 'token',
          ipAddress: request.headers.get('x-forwarded-for') || request.ip,
          userAgent: request.headers.get('user-agent'),
        },
      });
      
      return NextResponse.json({ hasAccess: true, reason: 'token_holder' });
    }
    
    // No access
    return NextResponse.json({ hasAccess: false, reason: 'no_access' });
  } catch (error) {
    console.error('Error checking access:', error);
    return NextResponse.json(
      { error: 'Failed to check access' },
      { status: 500 }
    );
  }
}
