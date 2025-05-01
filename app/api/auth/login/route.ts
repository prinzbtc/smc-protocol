import { NextRequest, NextResponse } from 'next/server';
import { 
  verifySignature, 
  createToken, 
  setAuthCookie, 
  isAdmin 
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, signature, publicKey } = body;
    
    if (!message || !signature || !publicKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify the signature
    const isValid = verifySignature(message, signature, publicKey);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Create a JWT token
    const token = createToken(publicKey);
    
    // Create the response
    const response = NextResponse.json({
      success: true,
      walletAddress: publicKey,
      isAdmin: isAdmin(publicKey)
    });
    
    // Set the auth cookie
    return setAuthCookie(response, token);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
