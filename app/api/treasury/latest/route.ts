import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/treasury/latest - Get the latest treasury update
export async function GET(request: NextRequest) {
  try {
    const latestUpdate = await prisma.treasuryUpdate.findFirst({
      orderBy: {
        date: 'desc',
      },
      include: {
        transactions: true,
      },
    });
    
    if (!latestUpdate) {
      return NextResponse.json(
        { error: 'No treasury updates found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(latestUpdate);
  } catch (error) {
    console.error('Error fetching latest treasury update:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest treasury update' },
      { status: 500 }
    );
  }
}
