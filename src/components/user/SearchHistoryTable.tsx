'use client';

import { QueryLog } from '@/src/lib/database.types';
import { format } from 'date-fns';

interface SearchHistoryTableProps {
  history: QueryLog[];
}

export default function SearchHistoryTable({ history }: SearchHistoryTableProps) {
  if (!history || history.length === 0) {
    return <p>No search history for this service yet.</p>;
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  Timestamp
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Query
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Result
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Coins Spent
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {history.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.query_input}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate max-w-sm">
                    {log.query_response ? JSON.stringify(log.query_response) : 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.coins_spent}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {log.is_team_query ? `Team (${log.team_id})` : 'Personal'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}