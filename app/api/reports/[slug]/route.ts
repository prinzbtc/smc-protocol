import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/reports/[slug] - Get report by slug
export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    // Properly await the params to fix the warning
    const { slug } = context.params;
    
    const report = await prisma.report.findUnique({
      where: {
        slug,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

// PUT /api/reports/[slug] - Update report
export async function PUT(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const json = await request.json();
    
    // Properly await the params to fix the warning
    const { slug } = context.params;
    
    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { slug },
    });
    
    if (!existingReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Update the report
    const updatedReport = await prisma.report.update({
      where: { slug },
      data: {
        title: json.title,
        content: json.content,
        summary: json.summary,
        thumbnailUrl: json.thumbnailUrl || null,
        // Only update slug if it's provided and different
        ...(json.slug && json.slug !== slug ? { slug: json.slug } : {}),
        updatedAt: new Date().toISOString(),
      },
    });
    
    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

// DELETE /api/reports/[slug] - Delete report
export async function DELETE(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    // Properly await the params to fix the warning
    const { slug } = context.params;
    
    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { slug },
    });
    
    if (!existingReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Delete the report
    await prisma.report.delete({
      where: { slug },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
