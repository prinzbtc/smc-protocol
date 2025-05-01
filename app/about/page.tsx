'use client';

import React from 'react';
import AppLayout from '../AppLayout';

const AboutPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="retro-container mx-4 my-2">
          <div className="retro-header">
            About Your Fund
          </div>
          <div className="py-8">
            <div className="px-10 sm:px-16 md:px-20 lg:px-32 py-10">
              {/* Edit notice for users - remove this when customizing */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-8">
                <h3 className="font-bold text-[#0e3d64] mb-2">⚠️ Customization Required</h3>
                <p className="text-[#0e3d64] mb-2">This is a template page. Replace the content below with information about your own fund:</p>
                <ul className="list-disc list-inside text-[#0e3d64] ml-4 space-y-1">
                  <li>Your fund's mission and vision</li>
                  <li>Information about your team</li>
                  <li>Your investment philosophy and values</li>
                </ul>
                <p className="text-[#0e3d64] mt-2 text-sm">Edit this file at: <code className="bg-gray-100 px-1 rounded">/app/about/page.tsx</code></p>
              </div>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Our Mission</h2>
              <p className="text-lg mb-6 text-[#0e3d64]">
                [Your Fund Name] is a Solana-based fund that somehow believes it can outperform the market by
                combining questionable trading strategies with just enough financial jargon to sound legitimate.
                We're basically doing what everyone else is doing, but with a token attached.
              </p>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Our Vision</h2>
              <p className="text-lg mb-6 text-[#0e3d64]">
                We envision a world where our token somehow appreciates despite having no real utility.
                Our groundbreaking strategy involves buying low and selling high—revolutionary, we know.
                We're democratizing finance by letting anyone lose money alongside us, not just accredited investors.
              </p>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">The Team</h2>
              <div className="space-y-8 mb-10">
                <div className="border-b border-[#0e3d64] pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#0e3d64]">Leadership</h3>
                  <p className="text-[#0e3d64] mb-4">
                    Our team consists of former finance professionals who couldn't make it in traditional markets, so they've pivoted to crypto where the bar is significantly lower.
                  </p>
                  <ul className="list-disc pl-6 text-[#0e3d64] space-y-2">
                    <li>CEO - Has a Twitter account with laser eyes</li>
                    <li>CTO - Once wrote a smart contract that didn't get hacked (for at least 48 hours)</li>
                    <li>Head of Research - Reads CoinDesk and calls it "due diligence"</li>
                  </ul>
                </div>
                
                <div className="border-b border-[#0e3d64] pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#0e3d64]">Our Values</h3>
                  <ul className="list-disc pl-6 text-[#0e3d64] space-y-2">
                    <li><span className="font-bold">Transparency:</span> We'll tell you exactly how much we lost after it happens</li>
                    <li><span className="font-bold">Quality:</span> Our investment theses are marginally more sophisticated than throwing darts</li>
                    <li><span className="font-bold">Accessibility:</span> We've made losing money more accessible than ever before</li>
                    <li><span className="font-bold">Sustainability:</span> We'll keep this going as long as the market stays irrational</li>
                    <li><span className="font-bold">Innovation:</span> We're using the same strategies as everyone else, just with different branding</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Join Us</h2>
              <p className="text-lg mb-4 text-[#0e3d64]">
                [Your Fund Name] is a financial collective for people who find traditional investing too slow and
                sensible. We've created an environment where losing money feels like winning, as long as you're part of the community.
              </p>
              <p className="text-lg mb-4 text-[#0e3d64]">
                Not financial advice, of course. We're just as qualified to manage money as your neighbor's cat,
                but we have a website and a token, so clearly we're legitimate.
              </p>
              <p className="text-lg text-[#0e3d64]">
                For more information that carefully skirts securities regulations, check out our <a href="/docs" className="text-[#0e3d64] hover:text-[#3b77a8] visited:text-[#3b77a8] underline">documentation</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AboutPage;
