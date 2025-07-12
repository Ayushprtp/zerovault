'use client';

import { useEffect, useState } from 'react';
import { type QueryLog } from '@/lib/database.types';
import { getUserQueryHistory } from '@/app/dashboard/users/actions';

interface UserQueryHistoryProps {
  userId: string;
}

export default function UserQueryHistory({ userId }: UserQueryHistoryProps) {
  const [queryHistory, setQueryHistory] = useState<QueryLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQueryHistory() {
      setLoading(true);
      setError(null);
      const { data, error } = await getUserQueryHistory(userId);
      if (error) {
        setError(error);
      } else {
        setQueryHistory(data);
      }
      setLoading(false);
    }

    if (userId) {
      fetchQueryHistory();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading query history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading query history: {error}</div>;
  }

  if (!queryHistory || queryHistory.length === 0) {
    return <div className="text-center text-gray-500">No query history found for this user.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Raw Query History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Service</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Input</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Spent</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {queryHistory.map((query) => (
              <tr key={query.id} className="border-b border-gray-200 last:border-b-0">
                <td className="px-4 py-3 text-sm text-gray-800">{query.service_name}</td>
                <td className="px-4 py-3 text-sm text-gray-800 max-w-xs overflow-hidden text-ellipsis">{query.query_input}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{query.coins_spent}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{new Date(query.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}