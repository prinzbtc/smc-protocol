'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '../../AppLayout';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  isPremium: boolean;
  publishedAt: string;
  updatedAt: string;
}

const AdminArticlesPage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        if (!data.isAdmin) {
          setIsLoading(false);
        } else {
          // If admin, fetch articles
          fetchArticles();
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin status');
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [connected, publicKey]);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      
      setArticles(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to fetch articles');
      setIsLoading(false);
    }
  };

  // Delete article
  const handleDeleteArticle = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove article from state
        setArticles(articles.filter(article => article.slug !== slug));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete article');
      }
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Manage Articles</h1>
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
          <h1 className="text-3xl font-bold mb-6">Manage Articles</h1>
          <div className="retro-container p-6">
            <p className="mb-4">Unauthorized. Admin access required.</p>
            <Link href="/admin" className="text-[#0e3d64] hover:text-[#0a2d4a]">
              Return to Admin Dashboard
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Manage Articles</h1>
          <div className="retro-container p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/admin" className="text-[#0e3d64] hover:text-[#0a2d4a]">
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
          <h1 className="text-3xl font-bold">Manage Articles</h1>
          <div>
            <Link href="/admin/articles/new" className="btn-primary">
              Create New Article
            </Link>
          </div>
        </div>

        <div className="retro-container mb-6">
          <div className="retro-header">Articles List</div>
          <div className="p-4">
            {articles.length === 0 ? (
              <p className="text-center py-4">No articles found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#0e3d64]">
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Published</th>
                      <th className="text-left p-2">Premium</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id} className="border-b border-[#0e3d64]">
                        <td className="p-2">
                          <Link href={`/articles/${article.slug}`} className="text-[#0e3d64] hover:text-[#0a2d4a]">
                            {article.title}
                          </Link>
                        </td>
                        <td className="p-2">{article.category}</td>
                        <td className="p-2">{formatDate(article.publishedAt)}</td>
                        <td className="p-2">{article.isPremium ? 'Yes' : 'No'}</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Link href={`/admin/articles/edit/${article.slug}`} className="text-[#0e3d64] hover:text-[#0a2d4a]">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(article.slug)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link href="/admin" className="text-[#0000FF] hover:text-[#000080]">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminArticlesPage;
