'use client';

import { useState } from 'react';
import { RowItem } from '@/lib/types';
import { fetchWithAuth } from '@/lib/client-auth';
import { useAuth } from '@/contexts/AuthContext';

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

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
        {item.private && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            Private
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-600">Quantity:</span>
          <span className="ml-2 font-medium">{item.quantity}</span>
        </div>
        <div>
          <span className="text-gray-600">Total:</span>
          <span className="ml-2 font-medium">${item.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-3">
        <span className="text-gray-600 text-sm">Unit Price:</span>
        <span className="ml-2 text-2xl font-bold text-green-600">
          ${item.unitPrice.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <span>By {item.username}</span>
        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>

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
