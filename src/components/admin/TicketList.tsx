'use client';

import { useState, useEffect } from 'react';
import { type TicketWithReplies } from '@/src/lib/database.types'; // Assuming you'll extend types for replies
import { fetchAllTickets } from '@/src/app/dashboard/support/actions';
import Link from 'next/link';

export default function TicketList() {
  const [tickets, setTickets] = useState<TicketWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await fetchAllTickets();
        if (error) {
          setError(error.message);
        } else {
          setTickets(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  if (loading) {
    return <div className="text-center">Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading tickets: {error}</div>;
  }

  if (tickets.length === 0) {
    return <div className="text-center text-gray-500">No support tickets found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {ticket.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {ticket.subject}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {/* You'll need to fetch user data to display username */}
                {ticket.user_id} {/* Placeholder */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(ticket.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/dashboard/support/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}