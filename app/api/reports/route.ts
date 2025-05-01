import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sampleReports } from './sample-data';

// GET /api/reports - Get all reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;
    
    try {
      const reports = await prisma.report.findMany({
        orderBy: {
          publishedAt: 'desc',
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          thumbnailUrl: true,
          publishedAt: true,
          updatedAt: true,
          // Don't include full content in list view
        },
      });
      
      // If no reports are found in the database, return the sample reports
      if (reports.length === 0) {
        console.log('No reports found in database, returning sample reports');
        return NextResponse.json(sampleReports);
      }
      
      return NextResponse.json(reports);
    } catch (dbError) {
      console.error('Database error, falling back to sample data:', dbError);
      // If there's a database error, fall back to sample data
      return NextResponse.json(sampleReports);
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'content', 'summary'];
    for (const field of requiredFields) {
      if (!json[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Check if a report with this slug already exists
    const existingReport = await prisma.report.findUnique({
      where: { slug: json.slug },
    });
    
    if (existingReport) {
      return NextResponse.json(
        { error: 'A report with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Create the report
    const report = await prisma.report.create({
      data: {
        title: json.title,
        slug: json.slug,
        content: json.content,
        summary: json.summary,
        thumbnailUrl: json.thumbnailUrl || null,
        publishedAt: new Date().toISOString(),
      },
    });
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
