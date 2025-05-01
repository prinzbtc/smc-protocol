import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/treasury - Get treasury updates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }
    
    // Build where clause
    const where: any = {};
    if (startDate || endDate) {
      where.date = dateFilter;
    }
    
    const treasuryUpdates = await prisma.treasuryUpdate.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
      take: limit,
      include: {
        transactions: true,
      },
    });
    
    return NextResponse.json(treasuryUpdates);
  } catch (error) {
    console.error('Error fetching treasury updates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treasury updates' },
      { status: 500 }
    );
  }
}

// POST /api/treasury - Create a new treasury update
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    
    // Validate required fields
    const requiredFields = ['netAssetValue', 'previousNAV', 'percentChange', 'holdings'];
    for (const field of requiredFields) {
      if (json[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate holdings is a valid JSON array
    if (!Array.isArray(json.holdings)) {
      return NextResponse.json(
        { error: 'Holdings must be an array' },
        { status: 400 }
      );
    }
    
    // Create treasury update with transactions
    const treasuryUpdate = await prisma.treasuryUpdate.create({
      data: {
        netAssetValue: json.netAssetValue,
        previousNAV: json.previousNAV,
        percentChange: json.percentChange,
        holdings: json.holdings,
        date: json.date ? new Date(json.date) : new Date(),
        transactions: {
          create: json.transactions || [],
        },
      },
      include: {
        transactions: true,
      },
    });
    
    return NextResponse.json(treasuryUpdate, { status: 201 });
  } catch (error) {
    console.error('Error creating treasury update:', error);
    return NextResponse.json(
      { error: 'Failed to create treasury update' },
      { status: 500 }
    );
  }
}
