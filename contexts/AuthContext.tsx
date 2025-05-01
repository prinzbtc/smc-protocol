'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { AUTH_MESSAGE, generateNonce } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  walletAddress: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthenticating: false,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
  walletAddress: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { connected, publicKey, signMessage, disconnect } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string>('');

  // Check auth status on mount and wallet connection changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Only check auth status if we're mounted to avoid SSR issues
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        // If we're already authenticated via cookie, update state
        if (data.authenticated) {
          setIsAuthenticated(true);
          setIsAdmin(data.isAdmin);
          setWalletAddress(data.walletAddress);
          console.log('User already authenticated via session');
        } else if (connected && publicKey) {
          // If we have a connected wallet but no valid session, we'll need to authenticate
          // This will be triggered by the Navbar component
          console.log('Wallet connected but not authenticated');
        } else {
          // Not authenticated and no wallet connected
          setIsAuthenticated(false);
          setIsAdmin(false);
          setWalletAddress(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setWalletAddress(null);
      }
    };

    checkAuthStatus();
  }, [connected, publicKey]);

  // Handle login with message signing
  const login = async () => {
    if (!connected || !publicKey || !signMessage) {
      console.error('Wallet not connected or signMessage not available');
      return;
    }

    try {
      setIsAuthenticating(true);
      
      // Generate a new nonce for this login attempt
      const newNonce = generateNonce();
      setNonce(newNonce);
      
      // Create the message to sign
      const message = `${AUTH_MESSAGE}${newNonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature from wallet
      const signatureBytes = await signMessage(encodedMessage);
      const signature = Buffer.from(signatureBytes).toString('base64');
      
      // Send to server for verification
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          signature,
          publicKey: publicKey.toString(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setIsAdmin(data.isAdmin);
        setWalletAddress(data.walletAddress);
      } else {
        console.error('Authentication failed:', data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setWalletAddress(null);
        
        // Optionally disconnect the wallet
        if (disconnect) {
          disconnect();
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        isAdmin,
        login,
        logout,
        walletAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
