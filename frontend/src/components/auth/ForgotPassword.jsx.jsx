import React, { useState } from 'react';
import api from '../../utils/api';

function ForgotPassword({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Calls the forgotPassword endpoint we built in api.js
      await api.forgotPassword(email, newPassword); 
      setSuccess('Password updated successfully! You can now log in.');
      setEmail('');
      setNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Reset Password</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg text-sm mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition dynamic-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onSwitchToLogin} className="text-sm text-blue-400 hover:underline bg-transparent border-none cursor-pointer">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;