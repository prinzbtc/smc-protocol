'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: FC = () => {
  // Use state to handle client-side rendering
  const [mounted, setMounted] = useState(false);
  
  // Get wallet context
  const wallet = useWallet();
  
  // Get auth context
  const { isAuthenticated, isAuthenticating, isAdmin, login, logout } = useAuth();

  // Handle mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle wallet connection and authentication
  // We'll check authentication status first before deciding to prompt for signature
  const [authStatusChecked, setAuthStatusChecked] = useState(false);
  
  // First, check if user is already authenticated via cookies
  useEffect(() => {
    if (mounted && wallet.connected && !authStatusChecked) {
      // We'll let the AuthContext handle the status check
      // and only trigger login if needed after status is confirmed
      setAuthStatusChecked(true);
    }
  }, [mounted, wallet.connected, authStatusChecked]);
  
  // Only trigger login if needed after auth status is confirmed
  useEffect(() => {
    if (mounted && wallet.connected && authStatusChecked && !isAuthenticated && !isAuthenticating) {
      login();
    }
  }, [mounted, wallet.connected, authStatusChecked, isAuthenticated, isAuthenticating, login]);

  // Custom wallet button that handles authentication
  const AuthenticatedWalletButton = () => {
    if (!mounted) return null;
    
    // Listen for wallet disconnect to handle logout
    useEffect(() => {
      if (!wallet.connected && isAuthenticated) {
        // When wallet disconnects, also log out from the app
        logout();
      }
    }, [wallet.connected, isAuthenticated]);
    
    if (isAuthenticating) {
      return (
        <div className="flex items-center">
          <WalletMultiButton className="wallet-button mr-2" />
          <span className="text-sm text-gray-600">Authenticating...</span>
        </div>
      );
    } else {
      return <WalletMultiButton className="wallet-button" />;
    }
  };

  return (
    <nav className="py-2 px-4" style={{ background: 'linear-gradient(135deg, var(--gradient-light-gray), var(--gradient-light-purple))' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          {/* Logo - Left */}
          <div className="flex justify-center md:justify-start w-full md:w-auto py-2">
            <Link href="/" className="flex items-center no-underline">
              <div className="h-12 md:h-16 relative">
                <Image
                  src="/SmartMoney.png"
                  alt="Smart Money Capital Logo"
                  width={390}
                  height={65}
                  className="object-contain"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  priority
                />
              </div>
            </Link>
          </div>
          
          {/* Navigation Links - Center */}
          <div className="flex flex-wrap justify-center text-center py-2" 
               style={{ 
                 gap: 'clamp(1rem, 2vw, 2.5rem)'
               }}>
            <Link 
              href="/articles" 
              className="no-underline font-bold" 
              style={{ 
                padding: '0 clamp(0.5rem, 1vw, 1rem)', 
                margin: '0 clamp(0.25rem, 0.5vw, 0.5rem)', 
                color: '#0e3d64',
                textDecoration: 'none',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                whiteSpace: 'nowrap'
              }}
            >
              ARTICLES
            </Link>
            <Link 
              href="/treasury" 
              className="no-underline font-bold" 
              style={{ 
                padding: '0 clamp(0.5rem, 1vw, 1rem)', 
                margin: '0 clamp(0.25rem, 0.5vw, 0.5rem)', 
                color: '#0e3d64',
                textDecoration: 'none',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                whiteSpace: 'nowrap'
              }}
            >
              TREASURY
            </Link>
            <Link 
              href="/reports" 
              className="no-underline font-bold" 
              style={{ 
                padding: '0 clamp(0.5rem, 1vw, 1rem)', 
                margin: '0 clamp(0.25rem, 0.5vw, 0.5rem)', 
                color: '#0e3d64',
                textDecoration: 'none',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                whiteSpace: 'nowrap'
              }}
            >
              REPORTS
            </Link>
            {mounted && isAuthenticated && isAdmin && (
              <>
                <span className="text-black" style={{ margin: '0 clamp(0.25rem, 0.5vw, 0.75rem)' }}>|</span>
                <Link 
                  href="/admin" 
                  className="no-underline font-bold text-base" 
                  style={{ 
                    padding: '0 clamp(0.5rem, 1vw, 1rem)', 
                    margin: '0 clamp(0.25rem, 0.5vw, 0.5rem)', 
                    color: '#0e3d64',
                    textDecoration: 'none',
                    fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ADMIN
                </Link>
              </>
            )}
          </div>
          
          {/* Wallet Button - Right */}
          <div className="flex justify-center md:justify-end w-full md:w-auto" style={{ marginTop: '40px' }}>
            <AuthenticatedWalletButton />
          </div>
        </div>
      </div>
      <div className="mt-2" style={{ height: '2px', background: '#0e3d64', border: 'none', margin: '16px 0' }}></div>
    </nav>
  );
};

export default Navbar;
