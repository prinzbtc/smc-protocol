'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import AppLayout from '../AppLayout';

// Article interface to match Prisma schema
interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  thumbnailUrl?: string | null;
  updatedAt: string;
  publishedAt: string | null;
  isPremium: boolean;
}

const ArticlesPage: React.FC = () => {
  const { connected } = useWallet();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasTokenAccess, setHasTokenAccess] = useState(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;
  
  // Fetch articles from the API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/articles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  // Set mounted state to handle client-side only components
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Filter articles by category
  const filteredArticles = activeCategory
    ? articles.filter(article => article.category === activeCategory)
    : articles;
    
  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);
  
  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // In a real app, we would check if the user has SMC tokens
  useEffect(() => {
    if (connected) {
      // This would be replaced with actual token balance checking logic
      setHasTokenAccess(true);
    } else {
      setHasTokenAccess(false);
    }
  }, [connected]);
  
  // Get unique categories from articles
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
        <div className="retro-container mx-4 my-2">
          <div className="retro-header">
            Articles
          </div>
          <div className="py-8 article-container">
        
        {isLoading && (
          <div className="my-8 mx-24">
            <p className="text-center">Loading articles...</p>
          </div>
        )}
        
        {error && (
          <div className="my-8 p-4 border-2 border-red-600 mx-24">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {/* Access Banner */}
        {!connected && (
          <div className="border-2 border-[#0e3d64] p-6 mb-8 mx-24 shadow-md">
            <h2 className="text-xl font-bold mb-2 text-[#0e3d64]">Premium Content Available</h2>
            <p className="mb-4">Connect your wallet to access premium articles with your SMC tokens.</p>
            <p className="text-sm">Don't have SMC tokens? Premium articles can also be purchased individually.</p>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-16 mx-24">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1 border-2 shadow-md ${activeCategory === null ? 'bg-[#0e3d64] text-white border-[#0a2d4a]' : 'bg-white text-[#0e3d64] border-[#0e3d64]'}`}
            >
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 border-2 shadow-md capitalize ${activeCategory === category ? 'bg-[#0e3d64] text-white border-[#0a2d4a]' : 'bg-white text-[#0e3d64] border-[#0e3d64]'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Top separation line */}
        <div className="border-t border-[#0e3d64] mb-8 mx-24"></div>
        
        {/* Articles List */}
        <div className="space-y-10">
          {currentArticles.map((article, index) => (
            <div key={article.id} className={`mb-10 ${index < currentArticles.length - 1 ? 'border-b border-[#0e3d64]' : ''}`}>
              <div className="mx-24 flex justify-between py-4">
                <div className="flex-grow">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-medium capitalize bg-[#0e3d64] text-white border-2 border-[#0a2d4a] shadow-md" style={{ marginRight: '50px' }}>
                      {article.category}
                    </span>
                    {article.isPremium && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-[#ffbd59] text-white border-2 border-[#d9a149] shadow-md">
                        Premium
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-1">
                    <Link href={`/articles/${article.slug}`} className="text-[#0e3d64] hover:text-[#3b77a8] visited:text-[#3b77a8]">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm mb-2 text-[#0e3d64]">Published: {formatDate(article.publishedAt)}</p>
                  <p className="text-[#0e3d64]">{article.summary}</p>
                </div>
                
                {article.thumbnailUrl && (
                  <div className="ml-6 flex-shrink-0 self-center">
                    <Link href={`/articles/${article.slug}`}>
                      <img 
                        src={article.thumbnailUrl} 
                        alt={article.title} 
                        className="w-32 h-24 object-cover rounded shadow-sm" 
                        loading="eager"
                        width={128}
                        height={96}
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredArticles.length === 0 && !isLoading && (
          <div className="text-center py-8 mx-24">
            <p className="text-lg">No articles found in this category.</p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredArticles.length > articlesPerPage && (
          <div className="flex justify-center gap-4 my-16">
            <button 
              onClick={goToPreviousPage} 
              className={`btn-primary ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={goToNextPage} 
              className={`btn-primary ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
        
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ArticlesPage;
