'use client';

import { useState } from 'react';
import { giftAllUsers } from '@/src/app/dashboard/gift-coins/actions';

export default function GiftCoinsForm() {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (amount <= 0) {
      setMessage('Amount must be greater than zero.');
      setLoading(false);
      return;
    }

    try {
      const result = await giftAllUsers(amount);
      if (result.success) {
        setMessage(`Successfully gifted ${amount} ZeroCoins to all users.`);
      } else {
        setMessage(`Error gifting ZeroCoins: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
      setAmount(0); // Reset form after attempt
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount of ZeroCoins to Gift
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          value={amount}
          onChange={handleChange}
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={loading}
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Gifting...' : 'Gift All Users'}
        </button>
      </div>
      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.startsWith('Error') || message.startsWith('An unexpected error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}
    </form>
  );
}