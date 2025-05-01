import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, getWalletFromCookie } from '@/lib/auth';

// GET /api/admin/check - Check if a wallet has admin access
export async function GET(request: NextRequest) {
  try {
    // Get wallet address from auth cookie
    const walletAddress = getWalletFromCookie(request);
    
    // If no wallet in cookie, check query param for backward compatibility
    const queryWallet = new URL(request.url).searchParams.get('wallet');
    const effectiveWallet = walletAddress || queryWallet;
    
    if (!effectiveWallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    const adminStatus = isAdmin(effectiveWallet);
    
    return NextResponse.json({
      isAdmin: adminStatus,
      walletAddress: effectiveWallet
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}
