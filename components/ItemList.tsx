'use client';

import { useEffect, useState } from 'react';
import { RowItem } from '@/lib/types';
import { fetchWithAuth } from '@/lib/client-auth';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket';
import ItemCard from './ItemCard';

export default function ItemList() {
  const [items, setItems] = useState<RowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const fetchItems = async () => {
    try {
      const res = await fetchWithAuth('/api/items');
      const data = await res.json();

      if (res.ok) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Fetch items error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Real-time updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleItemCreated = (data: { item: RowItem }) => {
      console.log('Item created via socket:', data);
      fetchItems(); // Refresh the list
    };

    const handleItemDeleted = (data: { id: string }) => {
      console.log('Item deleted via socket:', data);
      setItems((prev) => prev.filter((item) => item._id?.toString() !== data.id));
    };

    const handleItemUpdated = (data: { id: string; private: boolean }) => {
      console.log('Item updated via socket:', data);
      fetchItems(); // Refresh the list
    };

    socket.on(SOCKET_EVENTS.ITEM_CREATED, handleItemCreated);
    socket.on(SOCKET_EVENTS.ITEM_DELETED, handleItemDeleted);
    socket.on(SOCKET_EVENTS.ITEM_UPDATED, handleItemUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.ITEM_CREATED, handleItemCreated);
      socket.off(SOCKET_EVENTS.ITEM_DELETED, handleItemDeleted);
      socket.off(SOCKET_EVENTS.ITEM_UPDATED, handleItemUpdated);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">Loading items...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">No items yet. Add your first item above!</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Price Comparison ({items.length} items)
        </h2>
        {isConnected && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            ● Live
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemCard
            key={item._id?.toString()}
            item={item}
            onItemUpdated={fetchItems}
          />
        ))}
      </div>
    </div>
  );
}
