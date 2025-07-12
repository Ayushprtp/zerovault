'use client';

import { useState, useEffect } from 'react';
import { getExcludedTerms, removeExcludedTerm } from '@/src/app/dashboard/settings/exclusion/actions';

export default function ExcludedTermsList() {
  const [terms, setTerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await getExcludedTerms();
        if (data) {
          setTerms(data.map((item: { term: string }) => item.term));
        }
      } catch (err) {
        setError('Failed to fetch excluded terms.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const handleRemoveTerm = async (term: string) => {
    try {
      await removeExcludedTerm(term);
      setTerms(terms.filter((t) => t !== term));
    } catch (err) {
      setError('Failed to remove excluded term.');
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading excluded terms...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Excluded Terms</h3>
      {terms.length === 0 ? (
        <p>No terms currently excluded.</p>
      ) : (
        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
          {terms.map((term) => (
            <li key={term} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
              <div className="w-0 flex-1 flex items-center">
                <span className="ml-2 flex-1 w-0 truncate">{term}</span>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => handleRemoveTerm(term)}
                  className="font-medium text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}