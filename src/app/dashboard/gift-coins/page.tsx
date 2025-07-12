'use client';

import { useState } from 'react';
import { giftAllUsers } from './actions';

export default function GiftCoinsPage() {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (amount <= 0) {
      setMessage('Please enter a positive amount of ZeroCoins.');
      setLoading(false);
      return;
    }

    try {
      const result = await giftAllUsers(amount);
      setMessage(result.message || 'ZeroCoins gifted successfully!');
    } catch (error: any) {
      setMessage(`Error gifting ZeroCoins: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gift ZeroCoins to All Users</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount to Gift
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value, 10))}
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={loading}
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Gifting...' : 'Gift ZeroCoins'}
          </button>
        </div>
      </form>
      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}