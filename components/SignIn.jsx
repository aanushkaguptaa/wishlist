'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

export default function SignIn({ onSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onSignIn(data.user);
      } else {
        setError(data.message || 'Oops! That didn\'t work. Try again? 🤔');
      }
    } catch (error) {
      setError('Hmm, something went wonky with the connection. Give it another shot! 🔄');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background SVG */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <img 
          src="/signin.svg" 
          alt="Sign in illustration" 
          className="w-full h-auto"
        />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo/Title */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-blue">Ready to make a Rakhi Wishlist?</h1>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-blue mb-2">
                Username 👤
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue/50" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-2 border-blue/20 rounded-lg focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors bg-white text-blue placeholder-blue/50"
                  placeholder="Your name here! ✨"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue mb-2">
                Password 🔒
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue/50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-blue/20 rounded-lg focus:ring-2 focus:ring-blue/50 focus:border-blue transition-colors bg-white text-blue placeholder-blue/50"
                  placeholder="Your secret key! 🗝️"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue/50 hover:text-blue transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue text-white py-3 rounded-lg font-medium hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue/50 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}