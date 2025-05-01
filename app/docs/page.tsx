'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '../AppLayout';

const DocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-[#0e3d64]">Documentation</h1>
          <p className="text-xl text-[#0e3d64]">
            Learn about the SMC Protocol framework and how to customize it for your fund.
          </p>
          {/* Edit notice for users */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
            <h3 className="font-bold text-[#0e3d64] mb-2">⚠️ Customization Required</h3>
            <p className="text-[#0e3d64] mb-2">This documentation provides an overview of the SMC Protocol framework. You should customize it with information specific to your fund.</p>
            <p className="text-[#0e3d64] mt-2 text-sm">Edit this file at: <code className="bg-gray-100 px-1 rounded">/app/docs/page.tsx</code></p>
          </div>
        </div>
        
        {/* GitBook-style layout with side panel and content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Side Panel */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="retro-container p-4 sticky top-24">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`text-left px-4 py-2 rounded font-medium ${activeTab === 'overview' ? 'bg-[#0e3d64] text-white' : 'text-[#0e3d64] hover:bg-gray-100'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('protocol')}
                  className={`text-left px-4 py-2 rounded font-medium ${activeTab === 'protocol' ? 'bg-[#0e3d64] text-white' : 'text-[#0e3d64] hover:bg-gray-100'}`}
                >
                  Framework Guide
                </button>
                <button 
                  onClick={() => setActiveTab('tokenomics')}
                  className={`text-left px-4 py-2 rounded font-medium ${activeTab === 'tokenomics' ? 'bg-[#0e3d64] text-white' : 'text-[#0e3d64] hover:bg-gray-100'}`}
                >
                  Fund Tokenomics
                </button>
                <button 
                  onClick={() => setActiveTab('customization')}
                  className={`text-left px-4 py-2 rounded font-medium ${activeTab === 'customization' ? 'bg-[#0e3d64] text-white' : 'text-[#0e3d64] hover:bg-gray-100'}`}
                >
                  Customization
                </button>
              </div>
            </div>
          </div>
          
          {/* Content Container */}
          <div className="flex-1 retro-container">
            <div className="px-10 sm:px-16 md:px-20 lg:px-32 py-10">
            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Smart Money Capital Overview</h2>
                <p className="text-lg mb-4 text-[#0e3d64]">
                  Smart Money Capital is a decentralized personal hedge fund protocol built on Solana. It combines financial content, asset management, and tokenized exposure to create a unique ecosystem for crypto investors.
                </p>
                <p className="text-lg mb-6 text-[#0e3d64]">
                  The protocol aims to democratize access to high-quality financial analysis while creating a sustainable economic model through its native $SMC token.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-[#0e3d64]">Key Components</h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <span className="font-bold mr-2 text-[#0e3d64]">•</span>
                    <div>
                      <p className="font-bold text-[#0e3d64]">Content Platform</p>
                      <p className="text-[#0e3d64]">Premium financial analysis articles and reports accessible to token holders.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2 text-[#0e3d64]">•</span>
                    <div>
                      <p className="font-bold text-[#0e3d64]">Treasury</p>
                      <p className="text-[#0e3d64]">A protocol-owned portfolio of crypto assets actively managed to generate returns.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2 text-[#0e3d64]">•</span>
                    <div>
                      <p className="font-bold text-[#0e3d64]">$SMC Token</p>
                      <p className="text-[#0e3d64]">The native token providing access to content and speculative exposure to protocol performance.</p>
                    </div>
                  </li>
                </ul>
              </div>
            )}
            
            {/* Protocol Tab Content */}
            {activeTab === 'protocol' && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">SMC Protocol</h2>
                <p className="text-lg mb-6 text-[#0e3d64]">
                  The Smart Money Capital protocol consists of several interconnected components that work together to create a sustainable ecosystem for financial content and asset management.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-[#0e3d64]">Protocol Architecture</h3>
                <div className="space-y-6 mb-8">
                  <div className="border-b border-[#0e3d64] pb-4">
                    <h4 className="text-xl font-bold mb-2 text-[#0e3d64]">Content Access Layer</h4>
                    <p className="text-[#0e3d64]">
                      Token-gated access to premium financial analysis. Articles and reports are accessible to $SMC holders or through direct SOL payments.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#0e3d64] pb-4">
                    <h4 className="text-xl font-bold mb-2 text-[#0e3d64]">Treasury Management</h4>
                    <p className="text-[#0e3d64]">
                      Protocol-owned assets are actively managed to generate returns. The treasury consists of SOL, other crypto assets, and a reserve of $SMC tokens.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#0e3d64] pb-4">
                    <h4 className="text-xl font-bold mb-2 text-[#0e3d64]">Revenue Flows</h4>
                    <p className="text-[#0e3d64]">
                      SOL payments for content access flow into the treasury, contributing to Net Asset Value (NAV) growth. Trading profits from treasury assets further enhance protocol value.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-[#0e3d64]">Future Development</h3>
                <p className="text-[#0e3d64]">
                  The protocol roadmap includes governance mechanisms, expanded content offerings, and additional utility for $SMC token holders.
                </p>
              </div>
            )}
            
            {/* Tokenomics Tab Content */}
            {activeTab === 'tokenomics' && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">$SMC Tokenomics</h2>
                <p className="text-lg mb-6 text-[#0e3d64]">
                  The Smart Money Capital token ($SMC) represents speculative exposure to the protocol's overall performance.
                </p>
                
                {/* Token Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-[#0e3d64]">Token Overview</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-[#0e3d64]">
                        <span className="font-medium text-[#0e3d64]">Token Name:</span>
                        <span className="text-[#0e3d64]">Smart Money Capital</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[#0e3d64]">
                        <span className="font-medium text-[#0e3d64]">Ticker:</span>
                        <span className="text-[#0e3d64]">$SMC</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[#0e3d64]">
                        <span className="font-medium text-[#0e3d64]">Network:</span>
                        <span className="text-[#0e3d64]">Solana</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[#0e3d64]">
                        <span className="font-medium text-[#0e3d64]">Token Standard:</span>
                        <span className="text-[#0e3d64]">SPL Token</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[#0e3d64]">
                        <span className="font-medium text-[#0e3d64]">Total Supply:</span>
                        <span className="text-[#0e3d64]">1,000,000,000 (1 billion)</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[#0e3d64]">
                        <span className="font-medium text-[#0e3d64]">Initial Liquidity:</span>
                        <span className="text-[#0e3d64]">SMC/SOL pool on Raydium</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="font-medium text-[#0e3d64]">Initial Price Target:</span>
                        <span className="text-[#0e3d64]">$0.00001 per $SMC</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Token Distribution */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 text-[#0e3d64]">Token Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="card p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-semibold text-[#0e3d64]">Allocation Breakdown</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[#0e3d64]">
                            <span>Initial Liquidity Pool</span>
                            <span className="font-medium">0.5% (5M tokens)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-[#0e3d64] h-2.5 rounded-full" style={{ width: '0.5%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[#0e3d64]">
                            <span>Treasury Reserve</span>
                            <span className="font-medium">89.5% (895M tokens)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-[#0e3d64] h-2.5 rounded-full" style={{ width: '89.5%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[#0e3d64]">
                            <span>Ecosystem Incentives</span>
                            <span className="font-medium">5% (50M tokens)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-[#0e3d64] h-2.5 rounded-full" style={{ width: '5%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[#0e3d64]">
                            <span>Team & Operational Reserve</span>
                            <span className="font-medium">5% (50M tokens)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-[#0e3d64] h-2.5 rounded-full" style={{ width: '5%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="card p-6">
                        <h4 className="text-xl font-semibold mb-4 text-[#0e3d64]">Initial Liquidity Pool (0.5%)</h4>
                        <p className="text-[#0e3d64]">
                          5 million $SMC tokens will be paired with SOL to create the initial liquidity pool on Raydium, enabling immediate trading after launch.
                        </p>
                      </div>
                      
                      <div className="card p-6">
                        <h4 className="text-xl font-semibold mb-4 text-[#0e3d64]">Treasury Reserve (89.5%)</h4>
                        <p className="text-[#0e3d64]">
                          895 million tokens are held in the protocol treasury. These tokens will not be immediately circulated and will be managed according to the Treasury Token Management Policy.
                        </p>
                      </div>
                      
                      <div className="card p-6">
                        <h4 className="text-xl font-semibold mb-4 text-[#0e3d64]">Ecosystem Incentives (5%)</h4>
                        <p className="text-[#0e3d64]">
                          50 million tokens allocated for community rewards, liquidity mining programs, and other ecosystem growth initiatives.
                        </p>
                      </div>
                      
                      <div className="card p-6">
                        <h4 className="text-xl font-semibold mb-4 text-[#0e3d64]">Team & Operational Reserve (5%)</h4>
                        <p className="text-[#0e3d64]">
                          50 million tokens allocated to the team and for operational expenses. These tokens are locked for 6 months to ensure long-term commitment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Token Utility */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 text-[#0e3d64]">Token Utility</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-6">
                      <h4 className="text-xl font-semibold mb-2 text-[#0e3d64]">Access to Articles</h4>
                      <p className="text-[#0e3d64]">
                        Holders unlock exclusive financial analysis articles on the Smart Money Capital website, covering crypto, stocks, macroeconomics, and emerging technologies.
                      </p>
                    </div>
                    
                    <div className="card p-6">
                      <h4 className="text-xl font-semibold mb-2 text-[#0e3d64]">Community Status</h4>
                      <p className="text-[#0e3d64]">
                        Certain levels of $SMC holdings will unlock badges, perks, and voting power in future governance layers of the protocol.
                      </p>
                    </div>
                    
                    <div className="card p-6">
                      <h4 className="text-xl font-semibold mb-2 text-[#0e3d64]">Speculative Trading</h4>
                      <p className="text-[#0e3d64]">
                        $SMC is freely tradable on decentralized exchanges like Raydium, enabling organic price discovery based on market dynamics.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Treasury Token Management Policy */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 text-[#0e3d64]">Treasury Token Management Policy</h3>
                  <div className="card p-6">
                    <p className="text-[#0e3d64] mb-6">
                      To preserve long-term sustainability and community trust, Smart Money Capital adopts the following policies for managing Treasury-held $SMC tokens:
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex">
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold mb-2 text-[#0e3d64]">No Immediate Circulation</h4>
                          <p className="text-[#0e3d64]">
                            Treasury $SMC tokens will not be released or sold during the early stages post-launch.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold mb-2 text-[#0e3d64]">Gradual Supply Management</h4>
                          <p className="text-[#0e3d64]">
                            Treasury tokens may be deployed progressively to provide additional liquidity or to fund strategic operations only when there is sufficient market depth and demand.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold mb-2 text-[#0e3d64]">Incentives and Rewards</h4>
                          <p className="text-[#0e3d64]">
                            Portions of the Treasury $SMC supply may be allocated to reward active contributors, community engagement, or loyalty programs.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold mb-2 text-[#0e3d64]">Strategic Partnerships</h4>
                          <p className="text-[#0e3d64]">
                            Treasury tokens may be reserved for future partnerships, exchange listings, or ecosystem grants.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold mb-2 text-[#0e3d64]">Transparency Commitment</h4>
                          <p className="text-[#0e3d64]">
                            Any movement of Treasury $SMC tokens will be publicly announced and tracked via on-chain records and updates posted on the Smart Money Capital website.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Value Flows */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-6 text-[#0e3d64]">Value Flows</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card p-6">
                      <h4 className="text-xl font-semibold mb-4 text-[#0e3d64]">SOL Payments for Articles</h4>
                      <p className="text-[#0e3d64] mb-4">
                        Non-token holders pay SOL to access premium content. A portion of these payments is funneled to the protocol treasury, contributing to NAV growth.
                      </p>
                      <div className="flex items-center justify-center">
                        <div className="text-center p-4 bg-gray-100 rounded-lg">
                          <p className="font-medium text-[#0e3d64]">Users</p>
                        </div>
                        <div className="w-12 h-0.5 bg-[#0e3d64]"></div>
                        <div className="text-center p-4 bg-gray-100 rounded-lg">
                          <p className="font-medium text-[#0e3d64]">SOL Payment</p>
                        </div>
                        <div className="w-12 h-0.5 bg-[#0e3d64]"></div>
                        <div className="text-center p-4 bg-gray-100 rounded-lg">
                          <p className="font-medium text-[#0e3d64]">Treasury</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card p-6">
                      <h4 className="text-xl font-semibold mb-4 text-[#0e3d64]">Treasury Growth</h4>
                      <p className="text-[#0e3d64] mb-4">
                        Active asset trading and SOL revenue aim to grow NAV over time, which serves as a fundamental valuation anchor for the $SMC token.
                      </p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[#0e3d64]">Trading Profits</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#0e3d64]">SOL Revenue</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#0e3d64]">Treasury NAV</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Important Notes */}
                <div className="card p-6 mb-16">
                  <h3 className="text-2xl font-bold mb-6 text-[#0e3d64]">Important Notes</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <p className="text-[#0e3d64]">
                        <span className="font-medium">$SMC is not redeemable for treasury assets.</span> The token represents speculative exposure to the protocol's performance but does not entitle holders to claim underlying treasury assets.
                      </p>
                    </div>
                    
                    <div className="flex items-start">
                      <p className="text-[#0e3d64]">
                        <span className="font-medium">Market price and NAV can diverge freely based on market dynamics.</span> While NAV serves as a fundamental valuation anchor, $SMC price is determined by supply and demand on decentralized exchanges.
                      </p>
                    </div>
                    
                    <div className="flex items-start">
                      <p className="text-[#0e3d64]">
                        <span className="font-medium">Transparency:</span> Treasury portfolio and NAV updates will be published daily on the Smart Money Capital website, providing holders with up-to-date information on the protocol's performance.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* CTA Section */}
                <div className="bg-[#e6eef5] rounded-lg p-8 text-center">
                  <h3 className="text-2xl font-bold text-[#0e3d64] mb-4">
                    Ready to Launch Your Fund?
                  </h3>
                  <p className="text-[#0e3d64] mb-6 max-w-3xl mx-auto">
                    Customize this framework to create your own personal hedge fund on Solana. Connect your wallet to access the admin dashboard and start building your fund.
                  </p>
                </div>
              </div>
            )}
            
            {/* Customization Tab Content */}
            {activeTab === 'customization' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-[#0e3d64]">Customizing Your Fund</h2>
                
                <div className="space-y-10">
                  {/* Getting Started */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-[#0e3d64]">Getting Started</h3>
                    <p className="text-[#0e3d64] mb-4">
                      The SMC Protocol framework is designed to be easily customizable. Follow these steps to adapt it for your own fund:
                    </p>
                    
                    <ol className="list-decimal list-inside space-y-4 text-[#0e3d64] ml-4">
                      <li>
                        <span className="font-bold">Configure Environment Variables</span>
                        <p className="ml-6 mt-1">Rename <code className="bg-gray-100 px-1 rounded">example.env</code> to <code className="bg-gray-100 px-1 rounded">.env</code> and update the values with your own configuration, especially your treasury wallet address.</p>
                      </li>
                      
                      <li>
                        <span className="font-bold">Update Admin Access</span>
                        <p className="ml-6 mt-1">Edit <code className="bg-gray-100 px-1 rounded">/lib/auth.ts</code> to add your wallet address to the <code className="bg-gray-100 px-1 rounded">ADMIN_WALLETS</code> array.</p>
                      </li>
                      
                      <li>
                        <span className="font-bold">Customize Branding</span>
                        <p className="ml-6 mt-1">Update the logo, colors, and fund name in the Navbar and Footer components.</p>
                      </li>
                      
                      <li>
                        <span className="font-bold">Update Content</span>
                        <p className="ml-6 mt-1">Modify the About page and Documentation to reflect your fund's mission, vision, and strategy.</p>
                      </li>
                    </ol>
                  </div>
                  
                  {/* Key Files to Modify */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-[#0e3d64]">Key Files to Modify</h3>
                    
                    <div className="space-y-4 ml-4">
                      <div>
                        <p className="font-bold text-[#0e3d64]">Branding and Navigation</p>
                        <ul className="list-disc list-inside ml-4 text-[#0e3d64]">
                          <li><code className="bg-gray-100 px-1 rounded">/components/Navbar.tsx</code> - Update logo and navigation links</li>
                          <li><code className="bg-gray-100 px-1 rounded">/components/Footer.tsx</code> - Update footer content and links</li>
                          <li><code className="bg-gray-100 px-1 rounded">/public/</code> - Add your own logo and favicon</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-bold text-[#0e3d64]">Content Pages</p>
                        <ul className="list-disc list-inside ml-4 text-[#0e3d64]">
                          <li><code className="bg-gray-100 px-1 rounded">/app/page.tsx</code> - Update homepage content</li>
                          <li><code className="bg-gray-100 px-1 rounded">/app/about/page.tsx</code> - Customize about page</li>
                          <li><code className="bg-gray-100 px-1 rounded">/app/docs/page.tsx</code> - Update documentation</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-bold text-[#0e3d64]">Treasury Management</p>
                        <ul className="list-disc list-inside ml-4 text-[#0e3d64]">
                          <li><code className="bg-gray-100 px-1 rounded">/app/treasury/page.tsx</code> - Customize treasury dashboard</li>
                          <li><code className="bg-gray-100 px-1 rounded">/app/admin/treasury/page.tsx</code> - Modify admin treasury management</li>
                          <li><code className="bg-gray-100 px-1 rounded">/app/api/treasury/balances/route.ts</code> - Update API for treasury data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Deployment */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-[#0e3d64]">Deployment</h3>
                    <p className="text-[#0e3d64] mb-4">
                      Once you've customized the framework for your fund, you can deploy it to your preferred hosting provider:
                    </p>
                    
                    <ul className="list-disc list-inside ml-4 text-[#0e3d64] space-y-2">
                      <li>Vercel (recommended for Next.js applications)</li>
                      <li>Netlify</li>
                      <li>AWS Amplify</li>
                      <li>Any hosting provider that supports Next.js applications</li>
                    </ul>
                    
                    <p className="text-[#0e3d64] mt-4">
                      Make sure to set up your environment variables in your hosting provider's dashboard.
                    </p>
                  </div>
                </div>
                
                {/* CTA Section */}
                <div className="bg-[#e6eef5] rounded-lg p-8 text-center mt-10">
                  <h3 className="text-2xl font-bold text-[#0e3d64] mb-4">
                    Need Help Customizing?
                  </h3>
                  <p className="text-[#0e3d64] mb-6 max-w-3xl mx-auto">
                    Check out the GitHub repository for more detailed documentation and examples.
                  </p>
                  <a 
                    href="https://github.com/prinzbtc/smc-protocol" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-[#0e3d64] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0a2d4a] transition-colors"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DocsPage;
