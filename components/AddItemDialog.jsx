'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

export default function AddItemDialog({ isOpen, onClose, onSave }) {
  const [items, setItems] = useState([{ name: '', url: '' }]);
  const [saving, setSaving] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { name: '', url: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSave = async () => {
    const validItems = items.filter(item => item.name.trim() !== '');
    
    if (validItems.length === 0) {
      alert('Come on, give us at least one awesome thing to wish for! ✨');
      return;
    }

    setSaving(true);
    try {
      await onSave(validItems);
      setItems([{ name: '', url: '' }]);
    } catch (error) {
      console.error('Error saving items:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setItems([{ name: '', url: '' }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col border-2 border-blue/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue/10">
          <h3 className="text-lg font-semibold text-blue">Add to Your Wishlist! 🎁</h3>
          <button
            onClick={handleClose}
            className="text-blue/50 hover:text-blue transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border-2 border-blue/10 rounded-lg p-4 bg-blue/5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-blue">Gift Idea #{index + 1} ⭐</h4>
                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Item Name */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-blue mb-1">
                    What do you want? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-blue/20 rounded-lg focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors bg-white text-blue placeholder-blue/50"
                    placeholder="Something awesome..."
                  />
                </div>

                {/* Item URL */}
                <div>
                  <label className="block text-sm font-medium text-blue mb-1">
                    Got a link? (Optional) 🔗
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue/50" />
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => handleItemChange(index, 'url', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border-2 border-blue/20 rounded-lg focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors bg-white text-blue placeholder-blue/50"
                      placeholder="https://where-to-find-it.com"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Item Button */}
            <button
              onClick={handleAddItem}
              className="w-full py-3 border-2 border-dashed border-blue/30 rounded-lg text-blue hover:border-blue/50 hover:bg-blue/5 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Wish! ✨
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-blue/10 p-6">
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-blue bg-blue/10 rounded-lg hover:bg-blue/20 focus:outline-none focus:ring-2 focus:ring-blue/50 focus:ring-offset-2 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue/50 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving magic... ✨
                </div>
              ) : (
                'Save My Wishes! 🎯'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}