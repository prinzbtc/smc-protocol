'use client';

import React from 'react';
import AppLayout from '../AppLayout';

const AboutPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="retro-container mx-4 my-2">
          <div className="retro-header">
            About Smart Money Capital
          </div>
          <div className="py-8">
            <div className="px-10 sm:px-16 md:px-20 lg:px-32 py-10">
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Our Mission</h2>
              <p className="text-lg mb-6 text-[#0e3d64]">
                Smart Money Capital is a decentralized protocol built on Solana that combines financial content, 
                asset management, and tokenized exposure to create a unique ecosystem for crypto investors.
              </p>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Our Vision</h2>
              <p className="text-lg mb-6 text-[#0e3d64]">
                We aim to democratize access to high-quality financial analysis while creating a sustainable 
                economic model through our native $SMC token. By aligning incentives between content creators, 
                investors, and token holders, we're building a new paradigm for financial content and asset management.
              </p>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">The Team</h2>
              <div className="space-y-8 mb-10">
                <div className="border-b border-[#0e3d64] pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#0e3d64]">Leadership</h3>
                  <p className="text-[#0e3d64] mb-4">
                    Our team consists of experienced professionals from both traditional finance and the crypto industry, 
                    bringing together diverse perspectives and expertise.
                  </p>
                  <ul className="list-disc pl-6 text-[#0e3d64] space-y-2">
                    <li>Financial analysts with backgrounds in hedge funds and investment banking</li>
                    <li>Blockchain developers with experience building on multiple chains</li>
                    <li>Content creators specializing in financial education and market analysis</li>
                  </ul>
                </div>
                
                <div className="border-b border-[#0e3d64] pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#0e3d64]">Our Values</h3>
                  <ul className="list-disc pl-6 text-[#0e3d64] space-y-2">
                    <li><span className="font-bold">Transparency:</span> All treasury activities and protocol metrics are publicly available</li>
                    <li><span className="font-bold">Quality:</span> We prioritize high-quality, well-researched content over quantity</li>
                    <li><span className="font-bold">Accessibility:</span> Making sophisticated financial analysis available to everyone</li>
                    <li><span className="font-bold">Sustainability:</span> Building economic models that work for the long term</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-6 text-[#0e3d64]">Join Us</h2>
              <p className="text-lg mb-4 text-[#0e3d64]">
                Smart Money Capital is more than just a protocol—it's a community of like-minded investors and 
                financial enthusiasts. We welcome you to join us on this journey.
              </p>
              <p className="text-lg text-[#0e3d64]">
                For more information about how the protocol works, check out our <a href="/docs" className="text-[#0e3d64] hover:text-[#3b77a8] visited:text-[#3b77a8] underline">documentation</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AboutPage;
