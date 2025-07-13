'use client';

import { Plus } from 'lucide-react';

export default function FloatingAddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all hover:scale-110 active:scale-95 z-40"
      aria-label="Add new item"
    >
      <Plus className="w-6 h-6 mx-auto" />
    </button>
  );
}