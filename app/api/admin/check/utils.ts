// List of admin wallet addresses
const ADMIN_WALLETS: string[] = [
  // Add your admin wallet addresses here
  // For example:
  // "YourWalletAddressHere"
];

/**
 * Check if a wallet address has admin privileges
 * @param walletAddress The wallet address to check
 * @returns true if the wallet is an admin, false otherwise
 */
export function isAdmin(walletAddress: string): boolean {
  // For development purposes, allow all wallets if no admin wallets are specified
  if (ADMIN_WALLETS.length === 0) {
    return true;
  }
  
  return ADMIN_WALLETS.includes(walletAddress);
}