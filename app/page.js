'use client';

import { useState, useEffect } from 'react';
import SignIn from '@/components/SignIn';
import Wishlist from '@/components/Wishlist';
import AddItemDialog from '@/components/AddItemDialog';
import SelectedItems from '@/components/SelectedItems';
import ChangePasswordDialog from '@/components/ChangePasswordDialog';
import { Plus, Gift, Settings } from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showSelectedItems, setShowSelectedItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      fetchFamilyMembers();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setFamilyMembers(data.users || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async (memberName) => {
    try {
      const response = await fetch(`/api/wishlist/user/${memberName}`);
      const data = await response.json();
      setWishlistItems(data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchSelectedItems = async () => {
    try {
      const response = await fetch(`/api/user/selected-items/${currentUser}`);
      const data = await response.json();
      setSelectedItems(data.items || []);
    } catch (error) {
      console.error('Error fetching selected items:', error);
    }
  };

  const handleMemberSelect = (e) => {
    const memberName = e.target.value;
    setSelectedMember(memberName);
    setShowSelectedItems(false); 
    if (memberName) {
      fetchWishlist(memberName);
    } else {
      setWishlistItems([]);
    }
  };

  const handleShowSelectedItems = () => {
    setShowSelectedItems(true);
    setSelectedMember(''); 
    fetchSelectedItems();
  };

  const handleSignIn = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', user);
    localStorage.setItem('authToken', 'authenticated');
    fetchFamilyMembers();
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedMember('');
    setWishlistItems([]);
    setSelectedItems([]);
    setShowSelectedItems(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const handleAddItems = async (newItems) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: newItems,
          userName: currentUser,
        }),
      });

      if (response.ok) {
        if (selectedMember === currentUser) {
          fetchWishlist(currentUser);
        }
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding items:', error);
    }
  };

  const handlePasswordChange = async (oldPassword, newPassword) => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsPasswordDialogOpen(false);
        alert('Password changed successfully!');
      } else {
        alert(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-blue">Loading the magic... ✨</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  const isSelectingMember = !selectedMember && !showSelectedItems;

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* Background SVGs */}
      {isSelectingMember ? (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md pointer-events-none">
          <div className="relative w-full h-auto">
            {/* Left SVG */}
            <img
              src="/select1.svg"
              alt="Background illustration left"
              className="absolute bottom-0 left-0 w-3/5 h-auto z-10"
            />
            {/* Right SVG with 10% overlap */}
            <img
              src="/select2.svg"
              alt="Background illustration right"
              className="absolute bottom-0 right-0 w-3/5 h-auto z-20"
              style={{ right: '10%' }}
            />
          </div>
        </div>
      ) : (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md pointer-events-none">
          <img
            src="/additem.svg"
            alt="Background illustration"
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm relative z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue/70 mt-1">Hey there, {currentUser}! 👋</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* My Selected Items Button */}
              <button
                onClick={handleShowSelectedItems}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors shadow-lg text-sm font-medium"
              >
                <Gift className="w-4 h-4 mr-1" />
                My Items
              </button>

              {/* Add Wishlist Button */}
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center px-3 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue/50 transition-colors shadow-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Items
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setIsPasswordDialogOpen(true)}
                className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-colors shadow-lg text-sm font-medium"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={handleSignOut}
                className="text-sm text-blue/70 hover:text-blue transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 relative z-10">
        {/* Show Selected Items or Member Selection */}
        {showSelectedItems ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-blue">Items You've Selected 🎁</h2>
              <button
                onClick={() => setShowSelectedItems(false)}
                className="text-sm text-blue/70 hover:text-blue transition-colors"
              >
                Back to Wishlists
              </button>
            </div>
            <SelectedItems
              items={selectedItems}
              currentUser={currentUser}
              onItemUpdate={fetchSelectedItems}
            />
          </div>
        ) : (
          <>
            {/* Member Selection */}
            <div className="mb-6">
              <label htmlFor="member-select" className="block text-sm font-medium text-blue mb-2">
                Whose wishlist shall we peek at? 👀
              </label>
              <select
                id="member-select"
                value={selectedMember}
                onChange={handleMemberSelect}
                className="w-full px-3 py-3 border-2 border-blue/20 rounded-lg focus:ring-2 focus:ring-blue/50 focus:border-blue bg-white text-blue font-medium shadow-sm"
              >
                <option value="">Pick a family member... 🤔</option>
                {familyMembers.map((member) => (
                  <option key={member} value={member}>
                    {member} {member === currentUser ? '(That\'s you! 😊)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Wishlist Display */}
            {selectedMember && (
              <Wishlist
                memberName={selectedMember}
                items={wishlistItems}
                currentUser={currentUser}
                onItemUpdate={() => fetchWishlist(selectedMember)}
              />
            )}
          </>
        )}
      </main>
      <AddItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddItems}
      />

      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onSave={handlePasswordChange}
      />
    </div>
  );
}