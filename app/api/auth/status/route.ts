import { NextRequest, NextResponse } from 'next/server';
import { getWalletFromCookie, isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const walletAddress = getWalletFromCookie(request);
    
    if (!walletAddress) {
      return NextResponse.json({
        authenticated: false,
        walletAddress: null,
        isAdmin: false
      });
    }
    
    return NextResponse.json({
      authenticated: true,
      walletAddress,
      isAdmin: isAdmin(walletAddress)
    });
  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json(
      { error: 'Failed to check authentication status' },
      { status: 500 }
    );
  }
}
