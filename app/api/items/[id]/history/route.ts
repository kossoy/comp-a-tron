import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { PriceHistoryEntry } from '@/lib/types';

// GET - Get price history for an item
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const db = await getDatabase();
    const priceHistoryCollection = db.collection<PriceHistoryEntry>('priceHistory');

    const history = await priceHistoryCollection
      .find({ itemId: new ObjectId(params.id) })
      .sort({ recordedAt: -1 })
      .toArray();

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Get price history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
