'use client';

import { useEffect, useState } from 'react';
import { RowItem, SortField, SortOrder, CategoryType, CATEGORIES } from '@/lib/types';
import { fetchWithAuth } from '@/lib/client-auth';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket';
import ItemCard from './ItemCard';

export default function ItemList() {
  const [items, setItems] = useState<RowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  // Filter and sort state
  const [sortBy, setSortBy] = useState<SortField>('unitPrice');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchItems = async () => {
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetchWithAuth(`/api/items?${params.toString()}`);
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

  const handleExportCSV = async () => {
    try {
      const res = await fetchWithAuth('/api/items/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comp-a-tron-items-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export CSV');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [sortBy, sortOrder, categoryFilter, searchQuery]);

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

  return (
    <div>
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Price Comparison ({items.length} items)
        </h2>
        <div className="flex gap-2 items-center">
          {isConnected && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              ● Live
            </span>
          )}
          <button
            onClick={handleExportCSV}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded"
          >
            📊 Export CSV
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2 px-4 rounded"
          >
            {showFilters ? '🔽 Hide Filters' : '🔼 Show Filters'}
          </button>
        </div>
      </div>

      {/* Filters and Sorting */}
      {showFilters && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-3">Filters & Sorting</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="unitPrice">Unit Price</option>
                <option value="price">Total Price</option>
                <option value="quantity">Quantity</option>
                <option value="title">Name</option>
                <option value="createdAt">Date Added</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="asc">Ascending (Low to High)</option>
                <option value="desc">Descending (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery || categoryFilter) && (
            <div className="mt-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-600">
            {searchQuery || categoryFilter
              ? 'No items match your filters. Try adjusting your search.'
              : 'No items yet. Add your first item above!'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item._id?.toString()}
              item={item}
              onItemUpdated={fetchItems}
            />
          ))}
        </div>
      )}
    </div>
  );
}
