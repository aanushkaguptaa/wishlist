'use client';

import { useState, useEffect } from 'react';
import SignIn from '@/components/SignIn';
import Wishlist from '@/components/Wishlist';
import AddItemDialog from '@/components/AddItemDialog';
import { Plus } from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
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

  const handleMemberSelect = (e) => {
    const memberName = e.target.value;
    setSelectedMember(memberName);
    if (memberName) {
      fetchWishlist(memberName);
    } else {
      setWishlistItems([]);
    }
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
        // Refresh the current user's wishlist if they're viewing their own
        if (selectedMember === currentUser) {
          fetchWishlist(currentUser);
        }
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding items:', error);
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

  const isSelectingMember = !selectedMember;

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
            <div className="flex items-center space-x-3">
              {/* Add Wishlist Button - Always visible */}
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue/50 transition-colors shadow-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Items
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
      </main>

      {/* Add Item Dialog */}
      <AddItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddItems}
      />
    </div>
  );
}