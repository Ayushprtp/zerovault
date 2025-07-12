'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Database } from '@/lib/database.types';

type Ticket = Database['public']['Tables']['support_tickets']['Row'];

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  const router = useRouter();

  const handleTicketClick = (ticketId: number) => {
    router.push(`/dashboard/support/user/${ticketId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
      {tickets.length === 0 ? (
        <p>You have no support tickets yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150 ease-in-out"
              onClick={() => handleTicketClick(ticket.id)}
            >
              <div className="flex justify-between">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {ticket.subject}
                </div>
                <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  ticket.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                  ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                  'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                  {ticket.status}
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Created: {ticket.created_at ? format(new Date(ticket.created_at), 'PPP') : 'N/A'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TicketList;