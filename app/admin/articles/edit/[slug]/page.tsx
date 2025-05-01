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

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  isPremium: boolean;
  thumbnailUrl?: string;
  publishedAt: string;
  updatedAt: string;
}

const EditArticlePage = ({ params }: { params: { slug: string } }) => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    isPremium: false,
    thumbnailUrl: '',
  });

  // Set mounted state to handle client-side only components
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check admin status and fetch article
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
        
        // Fetch article data
        const articleResponse = await fetch(`/api/articles/${params.slug}`);
        
        if (!articleResponse.ok) {
          throw new Error('Article not found');
        }
        
        const articleData = await articleResponse.json();
        setArticle(articleData);
        
        // Set form data
        setFormData({
          title: articleData.title,
          summary: articleData.summary,
          content: articleData.content,
          category: articleData.category,
          isPremium: articleData.isPremium,
          thumbnailUrl: articleData.thumbnailUrl || '',
        });
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error initializing:', err);
        setError(err.message || 'Failed to load article');
        setIsLoading(false);
      }
    };

    initialize();
  }, [connected, publicKey, params.slug]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
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

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = ['title', 'summary', 'content', 'category'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }

      // Submit the form
      const response = await fetch(`/api/articles/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update article');
      }

      // Redirect to articles list
      router.push('/admin/articles');
    } catch (err: any) {
      console.error('Error updating article:', err);
      setError(err.message || 'Failed to update article');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
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
          <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
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

  if (!article) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
          <div className="retro-container p-6">
            <p className="mb-4">Article not found.</p>
            <Link href="/admin/articles" className="text-[#0000FF] hover:text-[#000080]">
              Return to Articles List
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Article</h1>

        {error && (
          <div className="retro-container p-4 mb-6 border-2 border-red-600">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="retro-container mb-6">
            <div className="retro-header">Article Details</div>
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
                <label htmlFor="category" className="block mb-2 font-bold">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300"
                  required
                >
                  <option value="crypto">Crypto</option>
                  <option value="stocks">Stocks</option>
                  <option value="macro">Macro</option>
                  <option value="treasury">Treasury</option>
                </select>
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
                  A brief summary that will appear in article listings.
                </p>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <span>Premium Content (requires SMC tokens or payment)</span>
                </label>
              </div>

              <ThumbnailUpload
                initialUrl={formData.thumbnailUrl}
                onImageChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                contentType="article"
              />

              <div className="mb-4 text-sm">
                <p><strong>Created:</strong> {new Date(article.publishedAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(article.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="retro-container mb-6">
            <div className="retro-header">Article Content</div>
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
                      placeholder="Start writing your article here. Use the toolbar above to format your content."
                    />
                  </div>
                ) : (
                  <div className="border border-gray-300 p-4 h-[400px] flex items-center justify-center bg-gray-50">
                    <p>Loading editor...</p>
                  </div>
                )}
                <p className="text-sm mt-1">
                  Format your content using the toolbar above the editor.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/admin/articles" className="text-[#0000FF] hover:text-[#000080]">
              ← Cancel and Return
            </Link>
            <div className="flex space-x-4">
              <Link 
                href={`/articles/${params.slug}`} 
                target="_blank"
                className="text-[#0000FF] hover:text-[#000080]"
              >
                View Live Article
              </Link>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Update Article'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default EditArticlePage;
