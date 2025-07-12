'use client';

import React from 'react';
import { format } from 'date-fns';

interface Query {
  id: string;
  service_name: string;
  query_input: string;
  coins_spent: number;
  timestamp: string;
}

interface QueryHistoryTableProps {
  queries: Query[];
}

const QueryHistoryTable: React.FC<QueryHistoryTableProps> = ({ queries }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Service
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Query Input
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Coins Spent
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {queries.map((query) => (
            <tr key={query.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {query.service_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {query.query_input}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {query.coins_spent}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(query.timestamp), 'PPP HH:mm')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueryHistoryTable;