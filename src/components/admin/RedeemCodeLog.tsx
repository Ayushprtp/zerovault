'use client';

import { useEffect, useState } from 'react';
import { getRedeemCodeLog } from '@/src/app/dashboard/redeem-codes/actions';
import { RedeemCodeLogEntry } from '@/src/lib/database.types';

export default function RedeemCodeLog() {
  const [logEntries, setLogEntries] = useState<RedeemCodeLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      const { data, error } = await getRedeemCodeLog();
      if (data) {
        setLogEntries(data);
      } else if (error) {
        console.error('Error fetching redeem code log:', error);
      }
      setLoading(false);
    };

    fetchLog();
  }, []);

  if (loading) {
    return <p>Loading redeem code log...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Redeem Code Log</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Code
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount (Coins)
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Assigned Role
            </th>
             <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Expires At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created At
            </th>
             <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Redeemed By
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logEntries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.assigned_role}</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.expires_at ? new Date(entry.expires_at).toLocaleString() : 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.created_at).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.redeemed_by || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
       {logEntries.length === 0 && !loading && (
         <p className="text-center text-gray-500 mt-4">No redeem code entries found.</p>
       )}
    </div>
  );
}
