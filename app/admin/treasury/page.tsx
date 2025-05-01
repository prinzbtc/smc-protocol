'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import AppLayout from '../../AppLayout';

// Define token interface
interface Token {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  logoURI?: string;
  isReadOnly?: boolean; // Flag for tokens that are managed automatically
}

// Define treasury data interface
interface TreasuryData {
  address: string;
  nav: number;
  tokens: Token[];
}

const AdminTreasuryPage = () => {
  const { connected, publicKey } = useWallet();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Form state
  const [treasuryAddress, setTreasuryAddress] = useState<string>('');
  const [nav, setNav] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (connected && publicKey) {
        try {
          const response = await axios.get(`/api/admin/check?wallet=${publicKey.toString()}`);
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [connected, publicKey]);

  // Fetch current treasury data
  useEffect(() => {
    const fetchTreasuryData = async () => {
      try {
        // No need for auth header on GET request as it's public data
        const response = await axios.get('/api/treasury/balances');
        if (response.data) {
          setTreasuryAddress(response.data.address || '');
          setNav(response.data.nav || 0);
          
          // Mark SOL and USDC as read-only tokens
          const processedTokens = response.data.tokens.map((token: Token) => {
            if (token.symbol === 'SOL' || token.symbol === 'USDC') {
              return {
                ...token,
                isReadOnly: true // Mark as read-only
              };
            }
            return token;
          });
          
          setTokens(processedTokens || []);
        }
      } catch (error) {
        console.error('Error fetching treasury data:', error);
        // Initialize with empty data if fetch fails
        setTreasuryAddress('');
        setNav(0);
        setTokens([]);
      }
    };

    if (isAdmin && !isLoading) {
      fetchTreasuryData();
    }
  }, [isAdmin, isLoading]);

  // Handle treasury address change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreasuryAddress(e.target.value);
    setError(null);
    setSuccess(null);
  };

  // Handle NAV change
  const handleNavChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    // Format to 2 decimal places
    const formattedValue = Math.round(value * 100) / 100;
    setNav(formattedValue);
    setError(null);
    setSuccess(null);
  };

  // Add a new empty token
  const addToken = () => {
    setTokens([
      ...tokens,
      {
        mint: '',
        symbol: '',
        name: '',
        amount: 0,
        usdValue: 0,
        logoURI: '',
        isReadOnly: false
      }
    ]);
  };

  // Remove a token
  const removeToken = (index: number) => {
    // Don't allow removing read-only tokens
    if (tokens[index].isReadOnly) {
      setError('Cannot remove SOL or USDC as they are managed automatically');
      return;
    }
    setTokens(tokens.filter((_, i) => i !== index));
  };

  // Update token field
  const updateToken = (index: number, field: keyof Token, value: string | number) => {
    // Don't allow editing read-only tokens
    if (tokens[index].isReadOnly) {
      setError('Cannot edit SOL or USDC as they are managed automatically');
      return;
    }
    
    const updatedTokens = [...tokens];
    updatedTokens[index] = {
      ...updatedTokens[index],
      [field]: value
    };
    setTokens(updatedTokens);
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Check if wallet is connected
    if (!connected || !publicKey) {
      setError('Wallet must be connected to update treasury data');
      setIsSubmitting(false);
      return;
    }

    // Validate form
    if (!treasuryAddress) {
      setError('Treasury address is required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate tokens (skip read-only tokens)
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        // Skip validation for read-only tokens
        if (token.isReadOnly) continue;
        
        if (!token.mint) {
          throw new Error(`Token ${i + 1}: Mint address is required`);
        }
        if (!token.symbol) {
          throw new Error(`Token ${i + 1}: Symbol is required`);
        }
        if (!token.name) {
          throw new Error(`Token ${i + 1}: Name is required`);
        }
      }

      // Get manual tokens (non-SOL, non-USDC) from the form
      const manualTokens = tokens.filter(token => 
        !token.isReadOnly && token.symbol !== 'SOL' && token.symbol !== 'USDC'
      );
      
      // Get auto-managed tokens (SOL and USDC)
      const autoTokens = tokens.filter(token => 
        token.isReadOnly && (token.symbol === 'SOL' || token.symbol === 'USDC')
      );
      
      // Combine auto tokens with manual tokens
      const combinedTokens = [...autoTokens, ...manualTokens];
      
      // Prepare data
      const treasuryData: TreasuryData = {
        address: treasuryAddress,
        nav,
        tokens: combinedTokens
      };

      // Save the treasury data with wallet address in header for authentication
      const response = await axios.post('/api/treasury/balances', treasuryData, {
        headers: {
          'x-wallet-address': publicKey.toString()
        }
      });
      
      if (response.status === 200) {
        setSuccess('Treasury data updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating treasury data:', error);
      setError(error.message || 'Failed to update treasury data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total USD value
  const calculateTotalUsdValue = (): number => {
    return tokens.reduce((total, token) => total + (token.usdValue || 0), 0);
  };

  // Update NAV to match total USD value
  const updateNavToMatchTotal = () => {
    const total = calculateTotalUsdValue();
    // Format to 2 decimal places
    const formattedTotal = Math.round(total * 100) / 100;
    setNav(formattedTotal);
  };

  // Add sample tokens (now just adds a sample SPL token, not SOL or USDC)
  const addSampleTokens = () => {
    // Keep existing SOL and USDC tokens
    const existingTokens = tokens.filter(token => token.symbol === 'SOL' || token.symbol === 'USDC');
    
    // Add a sample SPL token
    setTokens([
      ...existingTokens,
      {
        mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        symbol: 'BONK',
        name: 'Bonk',
        amount: 1000000,
        usdValue: 500,
        isReadOnly: false
      }
    ]);
    
    // Update NAV
    const existingValue = existingTokens.reduce((sum, token) => sum + token.usdValue, 0);
    setNav(existingValue + 500);
  };

  // Loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-[#0e3d64] mb-8">Treasury Data Management</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-[#0e3d64]">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Not connected state
  if (!connected) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-[#0e3d64] mb-8">Treasury Data Management</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-lg mb-4">Please connect your wallet to access admin features.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Not admin state
  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-[#0e3d64] mb-8">Treasury Data Management</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-lg mb-4">You do not have permission to access this page.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Main form
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#0e3d64] mb-8">Treasury Data Management</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#0e3d64]">Update Treasury Data</h2>
          <p className="mb-4">
            Use this form to update the treasury data. SOL and USDC are automatically tracked via the Helius API and cannot be edited.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Treasury Address */}
            <div className="mb-6">
              <label htmlFor="treasuryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Treasury Wallet Address:
              </label>
              <input
                id="treasuryAddress"
                type="text"
                value={treasuryAddress}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter treasury wallet address"
              />
            </div>
            
            {/* NAV */}
            <div className="mb-6">
              <label htmlFor="nav" className="block text-sm font-medium text-gray-700 mb-2">
                Net Asset Value (USD):
              </label>
              <div className="flex items-center">
                <input
                  id="nav"
                  type="number"
                  value={nav.toFixed(2)}
                  onChange={handleNavChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter NAV in USD"
                  step="0.01"
                  min="0"
                />
                <button
                  type="button"
                  onClick={updateNavToMatchTotal}
                  className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Match Total
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Total token value: ${calculateTotalUsdValue().toLocaleString()}
              </p>
            </div>
            
            {/* Tokens */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tokens:
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={addSampleTokens}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-md transition-colors text-sm"
                  >
                    Add Sample SPL Token
                  </button>
                  <button
                    type="button"
                    onClick={addToken}
                    className="bg-blue-600 hover:bg-blue-700 text-black font-medium py-1 px-3 rounded-md transition-colors text-sm"
                  >
                    Add Token
                  </button>
                </div>
              </div>
              
              {tokens.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-gray-500">No tokens added. Click "Add Token" to add a token.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tokens.map((token, index) => (
                    <div key={index} className={`bg-gray-50 p-4 rounded-md ${token.isReadOnly ? 'border-l-4 border-blue-500' : ''}`}>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-medium text-[#0e3d64] flex items-center">
                          {token.isReadOnly && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                              Auto-Updated
                            </span>
                          )}
                          Token #{index + 1}: {token.symbol}
                        </h3>
                        {!token.isReadOnly ? (
                          <button
                            type="button"
                            onClick={() => removeToken(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-xs text-blue-600">Updated hourly via Helius API</span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mint */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mint Address:
                          </label>
                          <input
                            type="text"
                            value={token.mint}
                            onChange={(e) => updateToken(index, 'mint', e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${token.isReadOnly ? 'bg-gray-100' : ''}`}
                            placeholder="Enter token mint address"
                            disabled={token.isReadOnly}
                            readOnly={token.isReadOnly}
                          />
                        </div>
                        
                        {/* Symbol */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Symbol:
                          </label>
                          <input
                            type="text"
                            value={token.symbol}
                            onChange={(e) => updateToken(index, 'symbol', e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${token.isReadOnly ? 'bg-gray-100' : ''}`}
                            placeholder="Enter token symbol (e.g., SOL)"
                            disabled={token.isReadOnly}
                            readOnly={token.isReadOnly}
                          />
                        </div>
                        
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name:
                          </label>
                          <input
                            type="text"
                            value={token.name}
                            onChange={(e) => updateToken(index, 'name', e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${token.isReadOnly ? 'bg-gray-100' : ''}`}
                            placeholder="Enter token name (e.g., Solana)"
                            disabled={token.isReadOnly}
                            readOnly={token.isReadOnly}
                          />
                        </div>
                        
                        {/* Amount */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount:
                          </label>
                          <input
                            type="number"
                            value={token.amount}
                            onChange={(e) => updateToken(index, 'amount', parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${token.isReadOnly ? 'bg-gray-100' : ''}`}
                            placeholder="Enter token amount"
                            step="0.000001"
                            min="0"
                            disabled={token.isReadOnly}
                            readOnly={token.isReadOnly}
                          />
                        </div>
                        
                        {/* USD Value */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            USD Value:
                          </label>
                          <input
                            type="number"
                            value={token.usdValue}
                            onChange={(e) => updateToken(index, 'usdValue', parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${token.isReadOnly ? 'bg-gray-100' : ''}`}
                            placeholder="Enter USD value"
                            step="0.01"
                            min="0"
                            disabled={token.isReadOnly}
                            readOnly={token.isReadOnly}
                          />
                        </div>
                        
                        {/* Logo URI */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Logo URI (optional):
                          </label>
                          <input
                            type="text"
                            value={token.logoURI || ''}
                            onChange={(e) => updateToken(index, 'logoURI', e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${token.isReadOnly ? 'bg-gray-100' : ''}`}
                            placeholder="Enter logo URL (optional)"
                            disabled={token.isReadOnly}
                            readOnly={token.isReadOnly}
                          />
                        </div>
                      </div>
                      
                      {token.isReadOnly && (
                        <div className="mt-2 text-xs text-gray-500 italic">
                          This token's data is automatically updated via the Helius API and cannot be edited manually.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-black font-medium py-2 px-6 rounded-md transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? 'Updating...' : 'Update Treasury Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminTreasuryPage;
