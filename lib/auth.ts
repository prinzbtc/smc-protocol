import { NextRequest, NextResponse } from 'next/server';
import { serialize, parse } from 'cookie';
import { sign, verify } from 'jsonwebtoken';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

// List of authorized admin wallet addresses
export const ADMIN_WALLETS = [
  '58cPXoxj6f4VnNs8SYirXifURsvqAp8BJdw26UieVuiB', // Your wallet
];

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'smart-money-capital-jwt-secret';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Auth message that users will sign
export const AUTH_MESSAGE = `Sign this message to authenticate with Smart Money Capital.\n\nThis signature will not trigger any blockchain transaction or cost any gas fees.\n\nNonce: `;

// Check if a wallet address is an admin
export function isAdmin(walletAddress: string | null | undefined): boolean {
  if (!walletAddress) return false;
  return ADMIN_WALLETS.includes(walletAddress);
}

// Generate a nonce for message signing
export function generateNonce(): string {
  return Date.now().toString();
}

// Verify a signed message
export function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const messageBytes = new TextEncoder().encode(message);
    
    // Convert base64 signature to Uint8Array
    const signatureBytes = Uint8Array.from(Buffer.from(signature, 'base64'));
    
    // Decode the public key from base58
    const publicKeyBytes = bs58.decode(publicKey);
    
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Create a JWT token
export function createToken(walletAddress: string): string {
  return sign(
    {
      sub: walletAddress,
      exp: Math.floor(Date.now() / 1000) + SESSION_EXPIRY / 1000,
    },
    JWT_SECRET
  );
}

// Verify a JWT token
export function verifyToken(token: string): { sub: string } | null {
  try {
    return verify(token, JWT_SECRET) as { sub: string };
  } catch (error) {
    return null;
  }
}

// Set auth cookie
export function setAuthCookie(res: NextResponse, token: string): NextResponse {
  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_EXPIRY / 1000,
    path: '/',
  });
  
  res.headers.set('Set-Cookie', cookie);
  return res;
}

// Clear auth cookie
export function clearAuthCookie(res: NextResponse): NextResponse {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  
  res.headers.set('Set-Cookie', cookie);
  return res;
}

// Get wallet address from auth cookie
export function getWalletFromCookie(req: NextRequest): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = parse(cookieHeader);
  const token = cookies.auth_token;
  
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded?.sub || null;
}

// Middleware to check admin access
export async function checkAdminAccess(req: NextRequest) {
  const walletAddress = getWalletFromCookie(req);
  
  if (!walletAddress || !isAdmin(walletAddress)) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    );
  }
  
  return null; // No error, access granted
}
