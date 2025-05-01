import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { isAdmin } from '../../../../../lib/auth';

// POST /api/treasury/[id]/transactions - Add a transaction to a treasury update
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the wallet address from the request
    const walletAddress = request.headers.get('x-wallet-address');
    
    // Check if the user is an admin
    if (!walletAddress || !isAdmin(walletAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Get the treasury update ID from the URL params
    const { id } = params;

    // Check if the treasury update exists
    const treasuryUpdate = await prisma.treasuryUpdate.findUnique({
      where: { id },
    });

    if (!treasuryUpdate) {
      return NextResponse.json(
        { error: 'Treasury update not found' },
        { status: 404 }
      );
    }

    // Parse the request body
    const {
      type,
      assetName,
      amount,
      priceUsd,
      totalValueUsd,
      txHash,
      date,
    } = await request.json();

    // Validate required fields
    if (!type || !assetName || amount === undefined || priceUsd === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        treasuryUpdateId: id,
        type,
        assetName,
        amount,
        priceUsd,
        totalValueUsd: totalValueUsd || amount * priceUsd,
        txHash: txHash || null,
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// GET /api/treasury/[id]/transactions - Get all transactions for a treasury update
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the treasury update ID from the URL params
    const { id } = params;

    // Check if the treasury update exists
    const treasuryUpdate = await prisma.treasuryUpdate.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!treasuryUpdate) {
      return NextResponse.json(
        { error: 'Treasury update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(treasuryUpdate.transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
