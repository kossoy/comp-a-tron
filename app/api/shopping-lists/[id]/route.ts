import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { ShoppingList } from '@/lib/types';

// GET - Get a single shopping list
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
    const listsCollection = db.collection<ShoppingList>('shoppingLists');

    const list = await listsCollection.findOne({
      _id: new ObjectId(params.id),
      owner: new ObjectId(user.id),
    });

    if (!list) {
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ list });
  } catch (error) {
    console.error('Get shopping list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a shopping list
export async function PATCH(
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
    const { name, items } = await req.json();

    const db = await getDatabase();
    const listsCollection = db.collection<ShoppingList>('shoppingLists');

    // Calculate total estimated cost
    const totalEstimatedCost = items
      ? items.reduce(
          (sum: number, item: any) => sum + (item.estimatedPrice || 0),
          0
        )
      : undefined;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (items !== undefined) {
      updateData.items = items;
      updateData.totalEstimatedCost = totalEstimatedCost;
    }

    const result = await listsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(params.id),
        owner: new ObjectId(user.id),
      },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ list: result });
  } catch (error) {
    console.error('Update shopping list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a shopping list
export async function DELETE(
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
    const listsCollection = db.collection<ShoppingList>('shoppingLists');

    const result = await listsCollection.deleteOne({
      _id: new ObjectId(params.id),
      owner: new ObjectId(user.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete shopping list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
