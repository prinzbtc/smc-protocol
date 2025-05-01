'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import AppLayout from '../AppLayout';

const AdminDashboard: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!connected || !publicKey) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/admin/check?wallet=${publicKey.toString()}`);
        const data = await response.json();
        
        setIsAdmin(data.isAdmin);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin status');
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [connected, publicKey]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="retro-container p-6">
            <p>Checking admin status...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!connected) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="retro-container p-6">
            <p className="mb-4">Please connect your wallet to access the admin dashboard.</p>
            <WalletMultiButton />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="retro-container p-6">
            <p className="mb-2">Unauthorized Access</p>
            <p>Your wallet does not have admin privileges.</p>
            <p className="text-sm mt-2">Wallet: {publicKey?.toString()}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="retro-container p-6">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Setup Instructions */}
        <div className="retro-container mb-6">
          <div className="retro-header">SMC Protocol Admin Setup</div>
          <div className="p-6">
            <p className="mb-4 text-[#0e3d64]">Welcome to the SMC Protocol admin dashboard. This interface allows you to manage your fund's content and treasury data.</p>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
              <h3 className="font-bold text-[#0e3d64] mb-2">⚠️ Important: Configure Admin Access</h3>
              <p className="text-[#0e3d64] mb-2">By default, only the wallet that deployed this application has admin access. To configure admin access:</p>
              <ol className="list-decimal list-inside text-[#0e3d64] ml-4 space-y-1">
                <li>Edit the <code className="bg-gray-100 px-1 rounded">/app/api/admin/check/route.ts</code> file</li>
                <li>Add your wallet address to the <code className="bg-gray-100 px-1 rounded">ADMIN_WALLETS</code> array</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="retro-container">
            <div className="retro-header">Content Management</div>
            <div className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <Link href="/admin/articles" className="text-[#0000FF] hover:text-[#000080] font-normal">
                    → Manage Articles
                  </Link>
                  <div className="flex space-x-2">
                    <Link href="/admin/articles/generate" className="btn-secondary text-sm py-1 px-2">
                      Generate Article
                    </Link>
                    <Link href="/admin/articles/new" className="btn-primary text-sm py-1 px-2">
                      New Article
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Link href="/admin/reports" className="text-[#0000FF] hover:text-[#000080] font-normal">
                    → Manage Reports
                  </Link>
                  <Link href="/admin/reports/new" className="btn-primary text-sm py-1 px-2">
                    New Report
                  </Link>
                </div>
                <Link href="/admin/treasury" className="text-[#0000FF] hover:text-[#000080] font-normal">
                  → Update Treasury Data
                </Link>
              </div>
            </div>
          </div>
          
          <div className="retro-container">
            <div className="retro-header">Admin Info</div>
            <div className="p-4">
              <p className="mb-2"><strong>Wallet:</strong> {publicKey?.toString()}</p>
              <p className="mb-2"><strong>Status:</strong> Admin</p>
              <p className="mb-4"><strong>Last Login:</strong> {new Date().toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-4">To customize this dashboard for your fund, edit the files in the <code className="bg-gray-100 px-1 rounded">/app/admin</code> directory.</p>
            </div>
          </div>
        </div>
        
        <div className="retro-container mb-6">
          <div className="retro-header">Getting Started</div>
          <div className="p-4">
            <ol className="list-decimal list-inside text-[#0e3d64] ml-4 space-y-2">
              <li>Configure your treasury wallet address in <code className="bg-gray-100 px-1 rounded">.env</code></li>
              <li>Update your fund's branding in the Navbar and Footer components</li>
              <li>Create your first article or report to showcase your fund's expertise</li>
              <li>Set up your treasury data to display your fund's holdings</li>
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
