import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { RowItem } from '@/lib/types';
import { emitToClients, SOCKET_EVENTS } from '@/lib/socket';

// DELETE - Remove an item
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const itemsCollection = db.collection<RowItem>('rowItems');

    const item = await itemsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user owns the item
    if (item.owner.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this item' },
        { status: 403 }
      );
    }

    await itemsCollection.deleteOne({ _id: new ObjectId(id) });

    // Emit Socket.io event for real-time updates
    emitToClients(SOCKET_EVENTS.ITEM_DELETED, { id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update item privacy
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const { private: isPrivate } = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    if (typeof isPrivate !== 'boolean') {
      return NextResponse.json(
        { error: 'Private field must be a boolean' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const itemsCollection = db.collection<RowItem>('rowItems');

    const item = await itemsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user owns the item
    if (item.owner.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this item' },
        { status: 403 }
      );
    }

    await itemsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { private: isPrivate } }
    );

    // Emit Socket.io event for real-time updates
    emitToClients(SOCKET_EVENTS.ITEM_UPDATED, { id, private: isPrivate });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
