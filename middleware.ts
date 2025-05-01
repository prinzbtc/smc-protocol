import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { existsSync } from 'fs';
import path from 'path';

// This middleware ensures that static files are served correctly
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Check if the request is for an uploaded file
  if (url.pathname.startsWith('/uploads/')) {
    // Just let it pass through - Next.js should handle static files in /public
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/uploads/:path*'],
};
