'use client';

import { useState, useEffect } from 'react';
import ListItem from './ListItem';
import Confirmation from './Confirmation';

export default function Wishlist({ memberName, currentUser, onItemUpdate }) {
  const [items, setItems] = useState([]);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    fetchWishlist(memberName);
  }, [memberName]);

  const fetchWishlist = async (memberName) => {
    try {
      const response = await fetch(`/api/wishlist/user/${memberName}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleBuyClick = (item) => {
    setConfirmationData({
      item: item.name,
      person: memberName,
      itemId: item._id,
    });
  };

  const handleConfirmBuy = async () => {
    try {
      const response = await fetch('/api/wishlist/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: confirmationData.itemId,
          buyerId: currentUser,
        }),
      });

      if (response.ok) {
        onItemUpdate();
        setConfirmationData(null);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to select item');
        setConfirmationData(null);
      }
    } catch (error) {
      console.error('Error buying item:', error);
      alert('Error selecting item');
    }
  };

  const handleCancelBuy = () => {
    setConfirmationData(null);
  };

  const handleDelete = async (item) => {
    if (!confirm('Are you sure you want to delete this item? 🗑️')) return;

    try {
      const response = await fetch(`/api/wishlist/item/${item._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload(); // Simple refresh for now
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-blue/10">
        <div className="text-blue/50 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-blue mb-2">Nothing here yet! 📝</h3>
        <p className="text-blue/70">
          {memberName === currentUser 
            ? "Time to fill this up with some awesome stuff! Click that \u2018Add Items\u2019 button above! ✨"
            : `Looks like ${memberName} hasn\u2019t shared their dreams yet... Maybe give them a gentle nudge? 😉`
          }
        </p>
      </div>
    );
  }

  const availableItems = items.filter(item => !item.taken);
  const takenItems = items.filter(item => item.taken);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-blue/10">
        <h2 className="text-xl font-semibold text-blue mb-1">
          {memberName === currentUser ? 'Your Amazing Wishlist 🌟' : `${memberName}\u2019s Wishlist 🎁`}
        </h2>
        <p className="text-sm text-blue/70">
          {availableItems.length} ready for action • {takenItems.length} already claimed! 🎉
        </p>
      </div>

      {/* Available Items */}
      {availableItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue/10">
          <div className="px-4 py-3 bg-green-50 border-b border-green-200">
            <h3 className="font-medium text-green-800 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Up for Grabs! ({availableItems.length}) ✨
            </h3>
          </div>
          <div className="divide-y divide-blue/10">
            {availableItems.map((item) => (
              <ListItem
                key={item._id}
                item={item}
                onBuyClick={handleBuyClick}
                onDeleteClick={handleDelete}
                currentUser={currentUser}
                memberName={memberName}
                isOwner={memberName === currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {/* Taken Items */}
      {takenItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue/10">
          <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
            <h3 className="font-medium text-blue/70 flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              Already Claimed! ({takenItems.length}) 🎯
            </h3>
          </div>
          <div className="divide-y divide-blue/10">
            {takenItems.map((item) => (
              <ListItem
                key={item._id}
                item={item}
                onBuyClick={handleBuyClick}
                onDeleteClick={handleDelete}
                currentUser={currentUser}
                memberName={memberName}
                isOwner={memberName === currentUser}
              />
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmationData && (
        <Confirmation
          isOpen={!!confirmationData}
          item={confirmationData.item}
          person={confirmationData.person}
          onConfirm={handleConfirmBuy}
          onCancel={handleCancelBuy}
        />
      )}
    </div>
  );
}