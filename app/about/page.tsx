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
                [Your Fund Name] is a decentralized fund built on Solana that combines financial content, 
                asset management, and tokenized exposure to create a unique ecosystem for crypto investors.
              </p>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Our Vision</h2>
              <p className="text-lg mb-6 text-[#0e3d64]">
                We aim to democratize access to high-quality financial analysis while creating a sustainable 
                economic model through our native token. By aligning incentives between content creators, 
                investors, and token holders, we're building a new paradigm for financial content and asset management.
              </p>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">The Team</h2>
              <div className="space-y-8 mb-10">
                <div className="border-b border-[#0e3d64] pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#0e3d64]">Leadership</h3>
                  <p className="text-[#0e3d64] mb-4">
                    [Describe your team's background and expertise here]
                  </p>
                  <ul className="list-disc pl-6 text-[#0e3d64] space-y-2">
                    <li>[Team member role/expertise]</li>
                    <li>[Team member role/expertise]</li>
                    <li>[Team member role/expertise]</li>
                  </ul>
                </div>
                
                <div className="border-b border-[#0e3d64] pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#0e3d64]">Our Values</h3>
                  <ul className="list-disc pl-6 text-[#0e3d64] space-y-2">
                    <li><span className="font-bold">Transparency:</span> All treasury activities and fund metrics are publicly available</li>
                    <li><span className="font-bold">Quality:</span> We prioritize high-quality, well-researched content over quantity</li>
                    <li><span className="font-bold">Accessibility:</span> Making sophisticated financial analysis available to everyone</li>
                    <li><span className="font-bold">Sustainability:</span> Building economic models that work for the long term</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Join Us</h2>
              <p className="text-lg mb-4 text-[#0e3d64]">
                [Your Fund Name] is more than just a fund—it's a community of like-minded investors and 
                financial enthusiasts. We welcome you to join us on this journey.
              </p>
              <p className="text-lg text-[#0e3d64]">
                For more information about how our fund works, check out our <a href="/docs" className="text-[#0e3d64] hover:text-[#3b77a8] visited:text-[#3b77a8] underline">documentation</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AboutPage;
