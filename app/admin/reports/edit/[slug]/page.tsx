'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '../../../../AppLayout';
import dynamic from 'next/dynamic';
import ThumbnailUpload from '../../../../../components/ThumbnailUpload';

// Import TipTap editor dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import('../../../../../components/RichTextEditor'), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>
});

interface ReportData {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl?: string;
  publishedAt: string;
  updatedAt: string;
}

const EditReportPage = ({ params }: { params: { slug: string } }) => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    thumbnailUrl: '',
  });

  // Set mounted state to handle client-side only components
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check admin status and fetch report
  useEffect(() => {
    const initialize = async () => {
      if (!connected || !publicKey) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check admin status
        const adminResponse = await fetch(`/api/admin/check?wallet=${publicKey.toString()}`);
        const adminData = await adminResponse.json();
        
        setIsAdmin(adminData.isAdmin);
        
        if (!adminData.isAdmin) {
          setIsLoading(false);
          return;
        }
        
        // Fetch report data
        const reportResponse = await fetch(`/api/reports/${params.slug}`);
        
        if (!reportResponse.ok) {
          throw new Error('Report not found');
        }
        
        const reportData = await reportResponse.json();
        
        setReport(reportData);
        
        // Set form data
        setFormData({
          title: reportData.title,
          summary: reportData.summary,
          content: reportData.content,
          thumbnailUrl: reportData.thumbnailUrl || '',
        });
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error initializing:', err);
        setError(err.message || 'Failed to load report');
        setIsLoading(false);
      }
    };

    initialize();
  }, [connected, publicKey, params.slug]);

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

      // Submit the form
      const response = await fetch(`/api/reports/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update report');
      }

      // Redirect to reports list
      router.push('/admin/reports');
    } catch (err: any) {
      console.error('Error updating report:', err);
      setError(err.message || 'Failed to update report');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Edit Treasury Report</h1>
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
          <h1 className="text-3xl font-bold mb-6">Edit Treasury Report</h1>
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

  if (!report) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Edit Treasury Report</h1>
          <div className="retro-container p-6">
            <p className="mb-4">Report not found.</p>
            <Link href="/admin/reports" className="text-[#0000FF] hover:text-[#000080]">
              Return to Reports List
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Treasury Report</h1>

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
                  className="w-full p-2 border border-gray-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="slug" className="block mb-2 font-bold">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={params.slug}
                  className="w-full p-2 border border-gray-300 bg-gray-100"
                  disabled
                />
                <p className="text-sm mt-1">
                  Slug cannot be changed after creation to preserve links.
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

              <div className="mb-4 text-sm">
                <p><strong>Created:</strong> {new Date(report.publishedAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(report.updatedAt).toLocaleString()}</p>
              </div>
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
                      placeholder="Treasury Report content. Include sections for Current Holdings, Performance Metrics, Recent Transactions, and Strategic Outlook."
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
            <div className="flex space-x-4">
              <Link 
                href={`/reports/${params.slug}`} 
                target="_blank"
                className="text-[#0000FF] hover:text-[#000080]"
              >
                View Live Report
              </Link>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Update Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default EditReportPage;
