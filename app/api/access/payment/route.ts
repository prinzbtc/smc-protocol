import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// POST /api/access/payment - Process a payment for article access
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    
    // Validate required fields
    const requiredFields = ['walletAddress', 'articleSlug', 'paymentTxHash'];
    for (const field of requiredFields) {
      if (!json[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { slug: json.articleSlug },
    });
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Connect to Solana network to verify transaction
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    
    // Get transaction details
    try {
      const txSignature = json.paymentTxHash;
      const tx = await connection.getTransaction(txSignature, {
        commitment: 'confirmed',
      });
      
      if (!tx) {
        return NextResponse.json(
          { error: 'Transaction not found or not confirmed' },
          { status: 400 }
        );
      }
      
      // Verify transaction is to treasury wallet
      const treasuryWallet = new PublicKey(process.env.TREASURY_WALLET_PUBKEY || '');
      let paymentVerified = false;
      
      if (tx.meta && tx.meta.postBalances && tx.meta.preBalances) {
        // Find the index of the treasury wallet in the accounts
        const treasuryIndex = tx.transaction.message.accountKeys.findIndex(
          (pubkey) => pubkey.equals(treasuryWallet)
        );
        
        if (treasuryIndex >= 0) {
          // Calculate the change in balance
          const balanceChange = 
            tx.meta.postBalances[treasuryIndex] - tx.meta.preBalances[treasuryIndex];
          
          // Minimum payment is 0.05 SOL (50,000,000 lamports)
          if (balanceChange >= 0.05 * LAMPORTS_PER_SOL) {
            paymentVerified = true;
          }
        }
      }
      
      if (!paymentVerified) {
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        );
      }
      
      // Record the payment in the access log
      const accessLog = await prisma.accessLog.create({
        data: {
          articleId: article.id,
          walletAddress: json.walletAddress,
          accessType: 'payment',
          paymentAmount: 0.05, // 0.05 SOL
          paymentTxHash: json.paymentTxHash,
          ipAddress: request.headers.get('x-forwarded-for') || request.ip,
          userAgent: request.headers.get('user-agent'),
        },
      });
      
      return NextResponse.json({
        success: true,
        accessGranted: true,
        accessLog,
      });
      
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return NextResponse.json(
        { error: 'Failed to verify transaction' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
