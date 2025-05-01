'use client';

import { FC, ReactNode, useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

// Import the wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

// Dynamically import components to prevent hydration errors
const WalletProviderComponents = dynamic(
  () => import('./WalletProviderComponents'),
  { ssr: false }
);

// Dynamically import AuthProvider to prevent hydration errors
const AuthProviderComponent = dynamic(
  () => import('@/contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })),
  { ssr: false }
);

interface WalletProviderWrapperProps {
  children: ReactNode;
}

export const WalletProviderWrapper: FC<WalletProviderWrapperProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Mainnet;
  
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    // Use custom RPC URL if available in environment variables
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    // Otherwise, fall back to Solana's public RPC
    return clusterApiUrl(network);
  }, [network]);

  // Use client-side rendering to prevent hydration errors
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted ? (
        <WalletProviderComponents network={network} endpoint={endpoint}>
          <AuthProviderComponent>
            {children}
          </AuthProviderComponent>
        </WalletProviderComponents>
      ) : (
        // Render a placeholder with the same structure during SSR
        <div className="wallet-provider-placeholder">{children}</div>
      )}
    </>
  );
};
