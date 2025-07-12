'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTeam } from '@/src/app/dashboard/team/actions';

export default function CreateTeamForm() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createTeam(teamName);
    if (result?.error) {
      setError(result.error);
    } else {
      setTeamName('');
      router.push('/dashboard/team');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
          Team Name
        </label>
        <input
          type="text"
          name="teamName"
          id="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </div>
    </form>
  );
}