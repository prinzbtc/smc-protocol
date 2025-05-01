'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '../../AppLayout';

// Report interface to match Prisma schema
interface Report {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  thumbnailUrl?: string | null;
  updatedAt: string;
  publishedAt: string | null;
}

const ReportDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const slug = params.slug as string;
  
  // Fetch report data from the API
  useEffect(() => {
    const fetchReport = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/reports/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Report not found, redirect to reports page
            router.push('/reports');
            return;
          }
          throw new Error('Failed to fetch report');
        }
        
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Failed to load report. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [slug, router]);
  
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
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : !report ? (
              <div className="text-center py-8">
                <h1 className="text-2xl font-bold mb-4 text-[#0e3d64]">Report Not Found</h1>
                <p className="mb-6">The report you're looking for doesn't exist or has been removed.</p>
                <Link href="/reports" className="btn-primary">
                  Back to Reports
                </Link>
              </div>
            ) : (
              <>
                {/* Report Container */}
                <div className="mb-8 mx-24 relative">
                  {/* Thumbnails have been removed as requested */}
                  
                  {/* Report Header */}
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold mb-4 text-[#0e3d64]">{report.title}</h1>
                    <p className="text-sm mb-6 font-bold italic text-[#0e3d64]">Published: {formatDate(report.publishedAt || report.updatedAt)}</p>
                  </div>
                  
                  {/* Report Summary */}
                  <div className="mb-8">
                    <p className="italic text-[#0e3d64]">{report.summary}</p>
                  </div>
                  
                  {/* Report Content */}
                  <div className="prose prose-lg max-w-none text-[#0e3d64]">
                    <div dangerouslySetInnerHTML={{ __html: report.content }} />
                  </div>
                  
                  {/* Report Footer */}
                  <div className="mt-12 pt-8 border-t border-[#0e3d64]">
                    <div className="flex justify-between items-center">
                      <Link href="/reports" className="flex items-center text-[#0e3d64] hover:text-[#0a2d4a]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Reports
                      </Link>
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

export default ReportDetailPage;
