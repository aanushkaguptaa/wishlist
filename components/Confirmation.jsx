'use client';

import { X, Gift } from 'lucide-react';

export default function Confirmation({ isOpen, item, person, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 transform transition-all border-2 border-blue/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue/10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue/10 rounded-full flex items-center justify-center mr-3">
              <Gift className="w-5 h-5 text-blue" />
            </div>
            <h3 className="text-lg font-semibold text-blue">Ready to be a hero? 🦸‍♀️</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-blue/50 hover:text-blue transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-blue mb-6">
            You're about to claim{' '}
            <span className="font-semibold text-blue">"{item}"</span> for{' '}
            <span className="font-semibold text-blue">{person}</span>! 🎁
          </p>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="w-5 h-5 text-amber-600 mr-2 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-800">
                  Once you claim this, it's yours! No take-backs! 🎯
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-blue bg-blue/10 rounded-lg hover:bg-blue/20 focus:outline-none focus:ring-2 focus:ring-blue/50 focus:ring-offset-2 transition-colors"
            >
              Hmm, Maybe Not
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue/50 focus:ring-offset-2 transition-colors"
            >
              Yes, I'm Doing This! 🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}