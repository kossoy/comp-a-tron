import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { RowItem } from '@/lib/types';
import { emitToClients, SOCKET_EVENTS } from '@/lib/socket';

// GET - List all items (public + user's private items)
export async function GET(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const db = await getDatabase();
    const itemsCollection = db.collection<RowItem>('rowItems');

    const items = await itemsCollection
      .find({
        $or: [
          { private: { $ne: true } },
          { owner: new ObjectId(user.id) },
        ],
      })
      .sort({ unitPrice: 1 })
      .toArray();

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new item
export async function POST(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const { title, quantity, price } = await req.json();

    if (!title || !quantity || !price) {
      return NextResponse.json(
        { error: 'Title, quantity, and price are required' },
        { status: 400 }
      );
    }

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (isNaN(quantityNum) || isNaN(priceNum) || quantityNum <= 0 || priceNum <= 0) {
      return NextResponse.json(
        { error: 'Quantity and price must be positive numbers' },
        { status: 400 }
      );
    }

    const unitPrice = parseFloat((priceNum / quantityNum).toFixed(2));

    const db = await getDatabase();
    const itemsCollection = db.collection<RowItem>('rowItems');

    const newItem: Omit<RowItem, '_id'> = {
      title,
      quantity: quantityNum,
      price: priceNum,
      unitPrice,
      createdAt: new Date(),
      owner: new ObjectId(user.id),
      username: user.username,
      private: false,
    };

    const result = await itemsCollection.insertOne(newItem as RowItem);

    const createdItem = {
      _id: result.insertedId,
      ...newItem,
    };

    // Emit Socket.io event for real-time updates
    emitToClients(SOCKET_EVENTS.ITEM_CREATED, { item: createdItem });

    return NextResponse.json({ item: createdItem });
  } catch (error) {
    console.error('Create item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
