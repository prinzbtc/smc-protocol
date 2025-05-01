'use client';

import { FC } from 'react';
import Link from 'next/link';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-4 mt-auto">
      {/* Top separation line */}
      <div style={{ height: '2px', background: '#0e3d64', border: 'none' }}></div>
      
      {/* Main content container with precise spacing */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative' }}>
        {/* Fixed height spacer to create exact distance from top line */}
        <div style={{ height: '32px' }}></div>
        
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center text-center" 
             style={{ 
               gap: 'clamp(1rem, 2vw, 2.5rem)',
               marginBottom: '32px' /* Exact same spacing as top spacer */
             }}>
          <Link 
            href="/" 
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
            HOME
          </Link>
          <Link 
            href="/about" 
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
            ABOUT
          </Link>
          <Link 
            href="/docs" 
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
            DOCS
          </Link>
        </div>
        
        {/* Social Links - with controlled spacing */}
        <div className="flex justify-center mb-6">
          <div className="retro-container inline-block px-4 sm:px-8 py-2 sm:py-4 w-full max-w-xs sm:max-w-md md:max-w-lg">
            <div className="flex flex-row items-center justify-center gap-2">
              <span className="font-bold text-[#0e3d64] text-sm sm:text-base mr-6" style={{ fontWeight: 700 }}>Connect with us:</span>
              <div className="flex items-center gap-2 sm:gap-4">
                <a 
                  href="https://twitter.com/smartmoneycap" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="no-underline font-bold text-[#0e3d64] text-sm sm:text-base"
                >
                  Twitter.com
                </a>
                <span className="text-[#0e3d64] mx-1 sm:mx-2">|</span>
                <a 
                  href="https://github.com/smartmoneycapital" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="no-underline font-bold text-[#0e3d64] text-sm sm:text-base"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-[#0e3d64] mt-4 mb-2">
            Smart Money Capital is a decentralized personal hedge fund protocol built on Solana.
          </p>
          <p className="text-xs sm:text-sm text-[#0e3d64]">
            &copy; {currentYear} Smart Money Capital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
