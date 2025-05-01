import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WalletProviderWrapper } from "../components/WalletProviderWrapper";

import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Money Capital | Decentralized Personal Hedge Fund",
  description: "Smart Money Capital is a personal hedge fund built on Solana, designed to empower individuals to manage, grow, and tokenize their trading performance.",
  keywords: ["Solana", "Crypto", "Hedge Fund", "DeFi", "SMC", "Smart Money Capital", "Token", "Finance", "Trading"],
  icons: {
    icon: "/DarkSmartMoneySquare.png",
    apple: "/DarkSmartMoneySquare.png",
    shortcut: "/DarkSmartMoneySquare.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <WalletProviderWrapper>
          {children}
        </WalletProviderWrapper>
      </body>
    </html>
  );
}
