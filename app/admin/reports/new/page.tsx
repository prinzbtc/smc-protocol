'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '../../../AppLayout';
import dynamic from 'next/dynamic';
import ThumbnailUpload from '../../../../components/ThumbnailUpload';

// Import TipTap editor dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>
});

const NewReportPage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Set mounted state to handle client-side only components
  useEffect(() => {
    setMounted(true);
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'treasury', // Always treasury for reports
    isPremium: false, // Reports are not premium
    thumbnailUrl: '',
  });
  


  // Check admin status
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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle rich text editor content changes
  const handleEditorChange = (content: string) => {
    setFormData({
      ...formData,
      content,
    });
  };

  // Generate slug from title
  const generateSlug = () => {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const year = date.getFullYear();
    
    const slug = `${month}-${year}-treasury-report`;
    
    setFormData({
      ...formData,
      slug,
    });
  };



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = ['title', 'summary', 'content'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }

      // If slug is empty, generate it
      if (!formData.slug) {
        generateSlug();
      }

      // Submit the form
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create report');
      }

      // Redirect to reports list
      router.push('/admin/reports');
    } catch (err: any) {
      console.error('Error creating report:', err);
      setError(err.message || 'Failed to create report');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Create New Treasury Report</h1>
          <div className="retro-container p-6">
            <p>Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!connected || !isAdmin) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Create New Treasury Report</h1>
          <div className="retro-container p-6">
            <p className="mb-4">Unauthorized. Admin access required.</p>
            <Link href="/admin" className="text-[#0000FF] hover:text-[#000080]">
              Return to Admin Dashboard
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Treasury Report</h1>

        {error && (
          <div className="retro-container p-4 mb-6 border-2 border-red-600">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="retro-container mb-6">
            <div className="retro-header">Report Details</div>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2 font-bold">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={() => !formData.slug && generateSlug()}
                  className="w-full p-2 border border-gray-300"
                  placeholder=""
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="slug" className="block mb-2 font-bold">
                  Slug
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="flex-grow p-2 border border-gray-300"
                    placeholder=""
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="ml-2 btn-primary"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-sm mt-1">
                  URL-friendly version of the title. Will be auto-generated if left empty.
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="summary" className="block mb-2 font-bold">
                  Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300"
                  rows={3}
                  placeholder=""
                  required
                />
                <p className="text-sm mt-1">
                  A brief summary that will appear in report listings.
                </p>
              </div>
              
              <ThumbnailUpload
                initialUrl={formData.thumbnailUrl}
                onImageChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                contentType="report"
              />
            </div>
          </div>

          <div className="retro-container mb-6">
            <div className="retro-header">Report Content</div>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="content" className="block mb-2 font-bold">
                  Content
                </label>
                {mounted ? (
                  <div className="border border-gray-300 bg-white">
                    <RichTextEditor
                      content={formData.content}
                      onChange={handleEditorChange}
                      placeholder="Treasury Report: April 2025. Include sections for Current Holdings, Performance Metrics, Recent Transactions, and Strategic Outlook."
                      includeTable={true}
                    />
                  </div>
                ) : (
                  <div className="border border-gray-300 p-4 h-[400px] flex items-center justify-center bg-gray-50">
                    <p>Loading editor...</p>
                  </div>
                )}
                <p className="text-sm mt-1">
                  Format your content using the toolbar above the editor. Use the table button to create treasury tables.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/admin/reports" className="text-[#0000FF] hover:text-[#000080]">
              ← Cancel and Return
            </Link>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Publish Report'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default NewReportPage;
