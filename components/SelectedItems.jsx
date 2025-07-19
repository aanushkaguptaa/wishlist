// components/SelectedItems.js
'use client';

import { useState } from 'react';
import { ExternalLink, X, Gift, Calendar } from 'lucide-react';

export default function SelectedItems({ items, currentUser, onItemUpdate }) {
    const [unselectingItem, setUnselectingItem] = useState(null);

    const handleUnselectItem = async (itemId) => {
        if (unselectingItem) return;

        setUnselectingItem(itemId);

        try {
            const response = await fetch('/api/wishlist/unselect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId,
                    username: currentUser,
                }),
            });

            if (response.ok) {
                onItemUpdate();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to unselect item');
            }
        } catch (error) {
            console.error('Error unselecting item:', error);
            alert('Error unselecting item');
        } finally {
            setUnselectingItem(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <Gift className="w-16 h-16 text-blue/30 mx-auto mb-4" />
                <p className="text-blue/70 text-lg font-medium mb-2">No items selected yet!</p>
                <p className="text-blue/50 text-sm">
                    When you select items from family members&rsquo; wishlists, they&rsquo;ll appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-sm border border-blue/10 p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-blue text-lg">{item.name}</h3>
                                {item.url && (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue/60 hover:text-blue transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>

                            <div className="space-y-1 text-sm text-blue/60">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">From:</span>
                                    <span>{item.relatedTo}&rsquo;s wishlist</span>
                                </div>
                                {item.takenAt && (
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>Selected on {formatDate(item.takenAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => handleUnselectItem(item._id)}
                            disabled={unselectingItem === item._id}
                            className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            title="Unselect this item"
                        >
                            {unselectingItem === item._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                            ) : (
                                <X className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}