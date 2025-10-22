import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { ShoppingList } from '@/lib/types';

// GET - List all shopping lists for the user
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
    const listsCollection = db.collection<ShoppingList>('shoppingLists');

    const lists = await listsCollection
      .find({ owner: new ObjectId(user.id) })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ lists });
  } catch (error) {
    console.error('Get shopping lists error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new shopping list
export async function POST(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const { name, items = [] } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const listsCollection = db.collection<ShoppingList>('shoppingLists');

    // Calculate total estimated cost
    const totalEstimatedCost = items.reduce(
      (sum: number, item: any) => sum + (item.estimatedPrice || 0),
      0
    );

    const newList: Omit<ShoppingList, '_id'> = {
      name,
      items,
      totalEstimatedCost,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: new ObjectId(user.id),
      username: user.username,
      shared: false,
    };

    const result = await listsCollection.insertOne(newList as ShoppingList);

    const createdList = {
      _id: result.insertedId,
      ...newList,
    };

    return NextResponse.json({ list: createdList });
  } catch (error) {
    console.error('Create shopping list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
