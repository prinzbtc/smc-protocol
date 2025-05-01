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

const GenerateArticlePage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
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
    category: 'crypto',
    isPremium: true,
    thumbnailUrl: '',
  });
  
  // Prompt state
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle prompt input change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
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

  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData({
      ...formData,
      slug,
    });
  };

  // Handle article generation
  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt for article generation');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/generate-article?wallet=${publicKey?.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate article');
      }
      
      const data = await response.json();
      
      // Update form with generated content
      setFormData({
        ...formData,
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        summary: data.content.split('\n').slice(0, 2).join(' ').substring(0, 150) + '...',
      });
      
      setGeneratedContent(data.content || '');
      
    } catch (err: any) {
      console.error('Error generating article:', err);
      setError(err.message || 'Failed to generate article');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle regeneration
  const handleRegenerateArticle = () => {
    handleGenerateArticle({ preventDefault: () => {} } as React.FormEvent);
  };

  // Handle form submission (publish)
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(null);
    
    try {
      // Validate required fields
      const requiredFields = ['title', 'summary', 'category', 'content'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }

      // If slug is empty, generate it from the title
      let finalSlug = formData.slug;
      if (!finalSlug) {
        finalSlug = formData.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
        setFormData({
          ...formData,
          slug: finalSlug,
        });
      }

      // Submit the form to create the article
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: finalSlug,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish article');
      }

      // Redirect to articles list
      router.push('/admin/articles');
    } catch (err: any) {
      console.error('Error publishing article:', err);
      setError(err.message || 'Failed to publish article');
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Generate Article</h1>
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
          <h1 className="text-3xl font-bold mb-6">Generate Article</h1>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Generate Article</h1>
          <Link href="/admin/articles" className="text-[#0000FF] hover:text-[#000080]">
            ← Back to Articles
          </Link>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          {/* Prompt Section */}
          <div className="retro-container">
            <div className="retro-header">Article Generation</div>
            <div className="p-4">
              <form onSubmit={handleGenerateArticle}>
                <div className="mb-4">
                  <label className="block mb-2 font-bold">
                    Prompt
                  </label>
                  <textarea
                    name="prompt"
                    value={prompt}
                    onChange={handlePromptChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter a detailed prompt for the article you want to generate..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Be specific about the topic, target audience, and key points to cover.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-primary"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Generated Content Preview & Edit */}
          {generatedContent && (
            <>
              <div className="retro-container">
                <div className="retro-header">Article Preview & Edit</div>
                <div className="p-4">
                  <form onSubmit={handlePublish}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2 font-bold">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-bold">
                          Slug
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className="flex-1 p-2 border border-gray-300 rounded-l"
                          />
                          <button
                            type="button"
                            onClick={generateSlug}
                            className="bg-gray-200 px-3 py-2 rounded-r border border-gray-300 border-l-0"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block mb-2 font-bold">
                        Summary
                      </label>
                      <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2 font-bold">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        >
                          <option value="crypto">Crypto</option>
                          <option value="defi">DeFi</option>
                          <option value="nft">NFT</option>
                          <option value="dao">DAO</option>
                          <option value="tech">Technology</option>
                          <option value="market">Market Analysis</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPremium"
                          name="isPremium"
                          checked={formData.isPremium}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <label htmlFor="isPremium" className="font-bold">
                          Premium Content
                        </label>
                      </div>
                    </div>
                    
                    <ThumbnailUpload
                      initialUrl={formData.thumbnailUrl}
                      onImageChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                      contentType="article"
                    />
                    
                    <div className="mb-4">
                      <label className="block mb-2 font-bold">
                        Content
                      </label>
                      {mounted && (
                        <RichTextEditor
                          content={formData.content}
                          onChange={handleEditorChange}
                          placeholder="Article content..."
                        />
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handleRegenerateArticle}
                        disabled={isGenerating}
                        className="btn-secondary"
                      >
                        {isGenerating ? 'Regenerating...' : 'Regenerate'}
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isPublishing}
                        className="btn-primary"
                      >
                        {isPublishing ? 'Publishing...' : 'Publish Article'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default GenerateArticlePage;
