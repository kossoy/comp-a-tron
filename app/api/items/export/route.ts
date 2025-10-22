import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { RowItem } from '@/lib/types';

// GET - Export items to CSV
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

    // Get all items (public + user's private)
    const items = await itemsCollection
      .find({
        $or: [
          { private: { $ne: true } },
          { owner: new ObjectId(user.id) },
        ],
      })
      .sort({ unitPrice: 1 })
      .toArray();

    // Generate CSV
    const headers = [
      'Title',
      'Quantity',
      'Unit',
      'Price',
      'Unit Price',
      'Category',
      'Tags',
      'Store',
      'Notes',
      'Owner',
      'Private',
      'Created At',
    ];

    const csvRows = [
      headers.join(','),
      ...items.map((item) =>
        [
          `"${item.title.replace(/"/g, '""')}"`, // Escape quotes
          item.quantity,
          item.unit || 'count',
          item.price.toFixed(2),
          item.unitPrice.toFixed(4),
          item.category || '',
          `"${(item.tags || []).join('; ')}"`,
          item.store ? `"${item.store.replace(/"/g, '""')}"` : '',
          item.notes ? `"${item.notes.replace(/"/g, '""')}"` : '',
          item.username,
          item.private ? 'Yes' : 'No',
          item.createdAt.toISOString(),
        ].join(',')
      ),
    ];

    const csv = csvRows.join('\n');

    // Return CSV with appropriate headers
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="comp-a-tron-items-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
