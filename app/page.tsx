'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import AppLayout from "./AppLayout";

// Article interface to match Prisma schema
interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  isPremium: boolean;
}

// Report interface to match Prisma schema
interface Report {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export default function Home() {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [latestReport, setLatestReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  
  // Fetch latest articles from the API
  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/articles?limit=5');
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        setLatestArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLatestArticles();
  }, []);
  
  // Fetch latest report from the API
  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        setIsLoadingReport(true);
        const response = await fetch('/api/reports?limit=1');
        
        if (!response.ok) {
          throw new Error('Failed to fetch latest report');
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          setLatestReport(data[0]);
        }
      } catch (err) {
        console.error('Error fetching latest report:', err);
        setReportError('Failed to load latest report. Please try again later.');
      } finally {
        setIsLoadingReport(false);
      }
    };
    
    fetchLatestReport();
  }, []);
  
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
      {/* Main Content */}
      <section className="py-12 bg-transparent">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 mx-4">
            {/* Publications Section (2/3 width) */}
            <div className="w-full md:w-2/3">
              <div className="retro-container mx-4 my-2">
                <div className="retro-header">
                  Publications
                </div>
                <div className="py-8 article-container">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p>Loading latest articles...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{error}</p>
                    </div>
                  ) : (
                    <>
                      {latestArticles.length === 0 ? (
                        <div className="text-center py-8">
                          <p>No articles found.</p>
                        </div>
                      ) : (
                        <>
                          {/* Top separation line */}
                          <div className="border-t border-[#0e3d64] mb-8 mx-24"></div>
                          
                          {/* Map through latest articles */}
                          {latestArticles.map((article, index) => (
                            <div key={article.id} className={`mb-10 ${index < latestArticles.length - 1 ? 'border-b border-[#0e3d64]' : ''}`}>
                              <div className="mx-24 flex justify-between py-4">
                                <div className="flex-grow pr-4">
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
                                  <div className="ml-4 flex-shrink-0 self-center">
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
                        </>
                      )}
                      

                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Latest Report Section (1/3 width) */}
            <div className="w-full md:w-1/3">
              <div className="retro-container mx-4 my-2">
                <div className="retro-header">
                  Latest Report
                </div>
                <div className="py-8 article-container">
                  {isLoadingReport ? (
                    <div className="text-center py-8">
                      <p>Loading latest report...</p>
                    </div>
                  ) : reportError ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{reportError}</p>
                    </div>
                  ) : !latestReport ? (
                    <div className="text-center py-8">
                      <p>No reports available.</p>
                    </div>
                  ) : (
                    <div className="flex justify-between py-4">
                      <div className="flex-grow pr-4">
                        <h3 className="text-lg font-bold mb-2">
                          <Link href={`/reports/${latestReport.slug}`} className="text-[#0e3d64] hover:text-[#3b77a8] visited:text-[#3b77a8]">
                            {latestReport.title}
                          </Link>
                        </h3>
                        <p className="mb-4 text-[#0e3d64]">Published: {formatDate(latestReport.publishedAt)}</p>
                        <p className="text-[#0e3d64]">{latestReport.summary}</p>
                      </div>
                      
                      {latestReport.thumbnailUrl && (
                        <div className="ml-4 flex-shrink-0 self-center">
                          <Link href={`/reports/${latestReport.slug}`}>
                            <img 
                              src={latestReport.thumbnailUrl} 
                              alt={latestReport.title} 
                              className="w-32 h-24 object-cover rounded shadow-sm" 
                              loading="eager"
                              width={128}
                              height={96}
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </section>
    </AppLayout>
  );
}
