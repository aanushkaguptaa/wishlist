'use client';

import { ExternalLink, Gift, Check, Trash2, Pencil } from 'lucide-react';

export default function ListItem({ item, onBuyClick, currentUser, memberName, isOwner }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/wishlist/item/${item._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload(); // Simple refresh for now
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData.message);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = async () => {
    const newName = prompt('Enter new name for the item (leave blank to keep unchanged):', item.name);
    if (newName === null) return;
    const newUrl = prompt('Enter new URL for the item (leave blank to keep unchanged):', item.url || '');
    if (newUrl === null) return;

    // Skip if no changes
    if (newName.trim() === item.name && newUrl.trim() === (item.url || '')) return;

    try {
      const response = await fetch(`/api/wishlist/item/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName.trim() || undefined,
          url: newUrl.trim() || null,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error editing item:', error);
      alert('Error editing item');
    }
  };

  return (
    <div className={`p-4 ${item.taken ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Item Name */}
          <h4 className={`font-medium text-gray-900 mb-1 ${item.taken ? 'line-through text-gray-500' : ''}`}>
            {item.name}
          </h4>

          {/* Item Link */}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 transition-colors mb-2"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Item
            </a>
          )}

          {/* Status */}
          {item.taken ? (
            <div className="flex items-center text-sm text-gray-500">
              <Check className="w-4 h-4 mr-1" />
              Taken!
            </div>
          ) : (
            <div className="flex items-center text-sm text-green-600">
              <Gift className="w-4 h-4 mr-1" />
              Available
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Edit Button (only for owner & item not taken) */}
          {isOwner && !item.taken && (
            <button
              onClick={handleEdit}
              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit item"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          {/* Delete Button (only for item owner) */}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Buy Button */}
          {!item.taken && memberName !== currentUser && (
            <button
              onClick={() => onBuyClick(item)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Buy
            </button>
          )}

          {/* Already Taken Badge */}
          {item.taken && (
            <div className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
              Taken
            </div>
          )}

          {/* Own Item Badge */}
          {memberName === currentUser && !item.taken && (
            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Your Item
            </div>
          )}
        </div>
      </div>
    </div>
  );
}