'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import AppLayout from '../../AppLayout';

// Article interface to match Prisma schema
interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  thumbnailUrl?: string | null;
  updatedAt: string;
  publishedAt: string | null;
  isPremium: boolean;
}

const ArticleDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { connected } = useWallet();
  const [article, setArticle] = useState<Article | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'none' | 'processing' | 'completed'>('none');
  
  const slug = params.slug as string;
  
  // Fetch article data from the API
  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/articles/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Article not found, redirect to articles page
            router.push('/articles');
            return;
          }
          throw new Error('Failed to fetch article');
        }
        
        const articleData = await response.json();
        setArticle(articleData);
        
        // Check if user has access to the article
        if (!articleData.isPremium) {
          setHasAccess(true);
        } else if (connected) {
          // This would be replaced with actual token balance checking logic
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        // Handle error state if needed
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug, connected, router]);
  
  // Handle SOL payment for article access
  const handlePayForAccess = () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('completed');
      setHasAccess(true);
    }, 2000);
  };
  
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
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (!article) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/articles" className="btn-primary">
            Back to Articles
          </Link>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="retro-container p-8">
          <div style={{ width: '65%', margin: '0 auto' }} className="my-8 text-left">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ) : !article ? (
              <div className="text-center py-8">
                <h1 className="text-2xl font-bold mb-4 text-[#0e3d64]">Article Not Found</h1>
                <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
                <Link href="/articles" className="btn-primary">
                  Back to Articles
                </Link>
              </div>
            ) : (
              <>
                {/* Article Container */}
                <div className="mb-8 mx-24 relative">
                  {/* Thumbnails have been removed as requested */}
                  
                  {/* Article Header */}
                  <div className="mb-4">
                    {/* Article Category */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium capitalize bg-[#0e3d64] text-white border-2 border-[#0a2d4a] shadow-md" style={{ marginRight: '50px' }}>
                        {article.category}
                      </span>
                      {article.isPremium && (
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-[#ffbd59] text-white border-2 border-[#d9a149] shadow-md">
                          Premium
                        </span>
                      )}
                    </div>
                    
                    {/* Article Title */}
                    <h1 className="text-3xl font-bold mb-4 text-[#0e3d64]">{article.title}</h1>
                    <p className="text-sm mb-6 font-bold italic text-[#0e3d64]">Published: {formatDate(article.publishedAt)}</p>
                  </div>
                
                  {/* Access Gate */}
                  {article.isPremium && !hasAccess && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/50 rounded-lg p-8 mb-8 text-center border border-[#0e3d64]">
                      <h2 className="text-2xl font-bold text-[#0e3d64] mb-4">
                        Premium Content
                      </h2>
                      <p className="text-[#0e3d64] mb-6">
                        This article is exclusive to $SMC token holders or available for a one-time payment.
                      </p>
                      
                      {paymentStatus === 'none' && (
                        <div className="flex flex-col items-center gap-4">
                          <button 
                            onClick={handlePayForAccess}
                            className="btn-primary py-3 px-6"
                          >
                            Pay 0.05 SOL for Access
                          </button>
                          <p className="text-sm text-[#0e3d64]">
                            Or connect your wallet with $SMC tokens for free access to all premium content
                          </p>
                        </div>
                      )}
                      
                      {paymentStatus === 'processing' && (
                        <div className="flex flex-col items-center gap-4">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0e3d64]"></div>
                          <p className="text-[#0e3d64]">Processing payment...</p>
                        </div>
                      )}
                      
                      {paymentStatus === 'completed' && (
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-green-600 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-green-600 font-medium">
                            Payment successful! Enjoy the article.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
              
                  {/* Article Summary */}
                  {article.summary && (
                    <div className="mb-8">
                      <p className="italic text-[#0e3d64]">{article.summary}</p>
                    </div>
                  )}
                  
                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none text-[#0e3d64]">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  </div>

                  {/* Article Footer */}
                  <div className="mt-12 pt-8 border-t border-[#0e3d64]">
                    <div className="flex justify-between items-center">
                      <Link href="/articles" className="flex items-center text-[#0e3d64] hover:text-[#0a2d4a]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Articles
                      </Link>
                      
                      <div className="flex space-x-4">
                        <button className="text-[#0e3d64] hover:text-[#0a2d4a]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <button className="text-[#0e3d64] hover:text-[#0a2d4a]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ArticleDetailPage;
