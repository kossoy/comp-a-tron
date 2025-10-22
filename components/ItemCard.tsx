'use client';

import { useState } from 'react';
import { RowItem } from '@/lib/types';
import { fetchWithAuth } from '@/lib/client-auth';
import { useAuth } from '@/contexts/AuthContext';
import { formatUnitPriceDisplay, getNormalizedLabel } from '@/lib/units';

interface ItemCardProps {
  item: RowItem;
  onItemUpdated: () => void;
}

export default function ItemCard({ item, onItemUpdated }: ItemCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isOwner = user?.id === item.owner.toString();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/items/${item._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onItemUpdated();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrivate = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/items/${item._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ private: !item.private }),
      });

      if (res.ok) {
        onItemUpdated();
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const unitDisplay = item.unit || 'count';
  const categoryDisplay = item.category || 'other';

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
          {item.store && (
            <p className="text-sm text-gray-500 mt-1">
              📍 {item.store}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {item.category && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {categoryDisplay}
            </span>
          )}
          {item.private && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Private
            </span>
          )}
        </div>
      </div>

      {/* Quantity and Price */}
      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-600">Quantity:</span>
          <span className="ml-2 font-medium">
            {item.quantity} {unitDisplay}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Total:</span>
          <span className="ml-2 font-medium">${item.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Unit Price - Highlighted */}
      <div className="mb-3 bg-green-50 p-3 rounded">
        <div className="text-sm text-gray-600">Unit Price:</div>
        <div className="text-2xl font-bold text-green-600">
          {formatUnitPriceDisplay(item.price, item.quantity, item.unit || 'count')}
        </div>
        {item.normalizedUnitPrice && item.unit !== 'count' && (
          <div className="text-xs text-gray-500 mt-1">
            ${item.normalizedUnitPrice.toFixed(4)} {getNormalizedLabel(item.unit || 'count')}
          </div>
        )}
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {item.notes && (
        <div className="mb-3 text-sm">
          <span className="text-gray-600">📝 </span>
          <span className="text-gray-700 italic">{item.notes}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <span>By {item.username}</span>
        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      {isOwner && (
        <div className="flex gap-2">
          <button
            onClick={handleTogglePrivate}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            {item.private ? 'Make Public' : 'Make Private'}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
