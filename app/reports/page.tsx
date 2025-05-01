'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import AppLayout from '../AppLayout';

// Report interface to match Prisma schema
interface Report {
  id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnailUrl?: string | null;
  publishedAt: string;
  updatedAt: string;
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 12;
  
  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/reports');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);
  
  // Calculate pagination
  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentReports = reports.slice(startIndex, endIndex);
  
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
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="retro-container mx-4 my-2">
          <div className="retro-header">
            Financial Reports
          </div>
          <div className="py-8 article-container">
            {isLoading ? (
              <div className="my-8 mx-24">
                <p className="text-center">Loading reports...</p>
              </div>
            ) : error ? (
              <div className="my-8 p-4 border-2 border-red-600 mx-24">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <>
                {/* Top separation line */}
                <div className="border-t border-[#0e3d64] mb-8 mx-24"></div>
                
                {/* Reports List */}
                <div className="space-y-10">
                  {currentReports.map((report, index) => (
                    <div key={report.id} className={`mb-10 ${index < currentReports.length - 1 ? 'border-b border-[#0e3d64]' : ''}`}>
                      <div className="mx-24 flex justify-between py-4">
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold mb-1">
                            <Link href={`/reports/${report.slug}`} className="text-[#0e3d64] hover:text-[#3b77a8] visited:text-[#3b77a8]">
                              {report.title}
                            </Link>
                          </h3>
                          <p className="text-sm mb-2 text-[#0e3d64]">Published: {formatDate(report.publishedAt)}</p>
                          <p className="text-[#0e3d64]">{report.summary}</p>
                        </div>
                        
                        {report.thumbnailUrl && (
                          <div className="ml-6 flex-shrink-0 self-center">
                            <Link href={`/reports/${report.slug}`}>
                              <img 
                                src={report.thumbnailUrl} 
                                alt={report.title} 
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
                
                {reports.length === 0 && !isLoading && (
                  <div className="text-center py-8 mx-24">
                    <p className="text-lg">No reports found.</p>
                  </div>
                )}
                
                {/* Pagination */}
                {reports.length > reportsPerPage && (
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
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
