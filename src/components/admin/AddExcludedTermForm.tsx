'use client';

import { useState } from 'react';
import { addExcludedTerm } from '@/src/app/dashboard/settings/exclusion/actions';
import { useRouter } from 'next/navigation';

export default function AddExcludedTermForm() {
  const [term, setTerm] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (term.trim()) {
      await addExcludedTerm(term.trim());
      setTerm('');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Add new excluded term"
        className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add Term
      </button>
    </form>
  );
}