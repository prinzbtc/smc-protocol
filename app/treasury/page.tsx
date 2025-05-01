'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCoins, FaDollarSign } from 'react-icons/fa';
import AppLayout from '../AppLayout';

// USDC token mint address on Solana
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

interface Token {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  logoURI?: string;
  color: string;
}

interface TreasuryData {
  address: string;
  nav: number;
  tokens: Token[];
}



const TreasuryDashboard: React.FC = () => {
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format numbers with commas and decimal places
  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format currency with $ sign
  const formatCurrency = (amount: number): string => {
    return `$${formatNumber(amount)}`;
  };

  // Calculate percentage of total NAV
  const calculatePercentage = (value: number, total: number): string => {
    if (total === 0) return '0.00%';
    return `${((value / total) * 100).toFixed(2)}%`;
  };

  // Fetch treasury data from our backend API (which handles SOL and USDC caching)
  useEffect(() => {
    const fetchTreasuryData = async () => {
      try {
        setIsLoading(true);
        
        // Get data from our API (which now includes cached SOL and USDC data)
        const response = await axios.get('/api/treasury/balances');
        setTreasuryData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching treasury data:', error);
        setError('Failed to load treasury data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreasuryData();
  }, []);

  return (
    <AppLayout>
      <section className="py-12 bg-transparent">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="retro-container mx-4 my-2">
            <div className="retro-header">
              Treasury Dashboard
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-xl text-[#0e3d64]">Loading treasury data...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
                  <p>{error}</p>
                </div>
              ) : treasuryData ? (
                <>
                  {/* Treasury Overview - NAV */}
                  <div className="mb-10 text-center">
                    <h2 className="text-lg font-medium text-[#0e3d64] mb-2">Net Asset Value</h2>
                    <p className="text-5xl font-bold text-[#0e3d64] mb-2">
                      ${formatNumber(treasuryData.nav)}
                    </p>
                    <p className="text-sm text-[#0e3d64]">
                      Total value of all assets in the treasury
                    </p>
                  </div>
                  
                  {/* Token Table */}
                  <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-[#0e3d64]">
                      <h2 className="text-xl font-bold text-[#0e3d64]">Token Holdings</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#0e3d64]">
                        <thead className="bg-white">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0e3d64] uppercase tracking-wider">
                              Token
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#0e3d64] uppercase tracking-wider">
                              Balance
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#0e3d64] uppercase tracking-wider">
                              Value (USD)
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#0e3d64] uppercase tracking-wider">
                              % of Portfolio
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#0e3d64]">
                          {treasuryData.tokens
                            .sort((a, b) => b.usdValue - a.usdValue) // Sort by USD value (highest first)
                            .map((token) => (
                              <tr key={token.mint}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 relative">
                                      {token.logoURI ? (
                                        <img
                                          className="h-10 w-10 rounded-full"
                                          src={token.logoURI}
                                          alt={token.symbol}
                                        />
                                      ) : (
                                        <div
                                          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                                          style={{ backgroundColor: token.color }}
                                        >
                                          {token.symbol.substring(0, 2)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-[#0e3d64]">
                                        {token.symbol}
                                      </div>
                                      <div className="text-sm text-[#0e3d64]">{token.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-[#0e3d64]">
                                  {formatNumber(token.amount, token.symbol === 'SOL' ? 4 : 2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-[#0e3d64]">
                                  ${formatNumber(token.usdValue)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-[#0e3d64]">
                                  <div className="flex items-center justify-end">
                                    <span className="mr-2">
                                      {calculatePercentage(token.usdValue, treasuryData.nav)}
                                    </span>
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="h-2 rounded-full"
                                        style={{
                                          width: `${(token.usdValue / treasuryData.nav) * 100}%`,
                                          backgroundColor: token.color,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Treasury Address */}
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-bold text-[#0e3d64] mb-2">Treasury Address</h2>
                    <p className="text-sm font-mono break-all text-[#0e3d64]">{treasuryData.address}</p>
                    <p className="text-xs text-[#0e3d64] mt-2">
                      Data last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg mb-8">
                  <p>No treasury data available. Please check back later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default TreasuryDashboard;