'use client';

import { useState } from 'react';
import { pledgeBountyToFeature } from '@/src/app/dashboard/feature-requests/actions';

interface PledgeBountyFormProps {
  requestId: number;
  onPledgeSuccess: () => void;
}

export default function PledgeBountyForm({ requestId, onPledgeSuccess }: PledgeBountyFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (amount <= 0) {
      setError('Amount must be greater than zero.');
      setLoading(false);
      return;
    }

    try {
      const result = await pledgeBountyToFeature(requestId, amount);
      if (result?.error) {
        setError(result.error);
      } else {
        setAmount(0);
        onPledgeSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while pledging bounty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bountyAmount" className="block text-sm font-medium text-gray-700">
          Pledge ZeroCoins
        </label>
        <input
          type="number"
          name="bountyAmount"
          id="bountyAmount"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Pledging...' : 'Pledge'}
        </button>
      </div>
    </form>
  );
}