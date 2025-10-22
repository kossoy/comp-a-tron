import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { RowItem, SortField, SortOrder, ItemFilters } from '@/lib/types';
import { emitToClients, SOCKET_EVENTS } from '@/lib/socket';

// GET - List all items (public + user's private items) with filtering and sorting
export async function GET(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const sortBy = (searchParams.get('sortBy') || 'unitPrice') as SortField;
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as SortOrder;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const store = searchParams.get('store');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    const db = await getDatabase();
    const itemsCollection = db.collection<RowItem>('rowItems');

    // Build filter query
    const filter: any = {
      $or: [
        { private: { $ne: true } },
        { owner: new ObjectId(user.id) },
      ],
    };

    // Add category filter
    if (category) {
      filter.category = category;
    }

    // Add search filter
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Add store filter
    if (store) {
      filter.store = { $regex: store, $options: 'i' };
    }

    // Add tags filter
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Execute query with sorting
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const items = await itemsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
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

// POST - Create a new item with price history tracking
export async function POST(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const {
      title,
      quantity,
      price,
      unit = 'count',
      category,
      tags,
      notes,
      store,
    } = await req.json();

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

    // Calculate unit price
    const unitPrice = parseFloat((priceNum / quantityNum).toFixed(4));

    // Calculate normalized unit price for cross-unit comparison
    const { calculateNormalizedUnitPrice } = await import('@/lib/units');
    const normalizedUnitPrice = calculateNormalizedUnitPrice(priceNum, quantityNum, unit);

    const db = await getDatabase();
    const itemsCollection = db.collection<RowItem>('rowItems');

    const newItem: Omit<RowItem, '_id'> = {
      title,
      quantity: quantityNum,
      unit,
      price: priceNum,
      unitPrice,
      normalizedUnitPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: new ObjectId(user.id),
      username: user.username,
      private: false,
      category,
      tags: tags || [],
      notes,
      store,
    };

    const result = await itemsCollection.insertOne(newItem as RowItem);

    const createdItem = {
      _id: result.insertedId,
      ...newItem,
    };

    // Create price history entry
    const priceHistoryCollection = db.collection('priceHistory');
    await priceHistoryCollection.insertOne({
      itemId: result.insertedId,
      itemTitle: title,
      price: priceNum,
      unitPrice,
      quantity: quantityNum,
      unit,
      recordedAt: new Date(),
      owner: new ObjectId(user.id),
    });

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
