'use client';

import { useState } from 'react';
import { inviteTeamMember } from '@/src/app/dashboard/team/actions'; // Adjust the import path as necessary

interface InviteMemberFormProps {
  teamId: string;
}

export default function InviteMemberForm({ teamId }: InviteMemberFormProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const result = await inviteTeamMember(teamId, email);

    if (result.success) {
      setMessage('Invitation sent successfully!');
      setEmail('');
    } else {
      setError(result.error || 'Failed to send invitation.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          User Email or Username
        </label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter user's email or username"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Send Invitation
        </button>
      </div>
      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}