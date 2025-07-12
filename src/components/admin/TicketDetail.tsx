'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateTicketStatus, addTicketReply } from '@/src/app/dashboard/support/actions';
import { SupportTicket, TicketReply } from '@/src/lib/database.types';
import { format } } from 'date-fns';

interface TicketDetailProps {
  ticket: SupportTicket & { ticket_replies: TicketReply[] };
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const router = useRouter();
  const [newReply, setNewReply] = useState('');
  const [currentStatus, setCurrentStatus] = useState(ticket.status);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    await updateTicketStatus(ticket.id, newStatus);
    router.refresh();
  };

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newReply.trim()) {
      await addTicketReply(ticket.id, newReply.trim());
      setNewReply('');
      router.refresh();
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Support Ticket #{ticket.id}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Subject: {ticket.subject}</p>
        <div className="mt-3">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={currentStatus}
            onChange={handleStatusChange}
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created By</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.user_id}</dd> {/* You might want to fetch username */}
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {format(new Date(ticket.created_at), 'PPP p')}
            </dd>
          </div>
          {/* Initial message can be part of the replies or a separate field if needed */}
        </dl>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-md leading-5 font-medium text-gray-900">Replies</h4>
        <ul className="mt-4 space-y-4">
          {ticket.ticket_replies.map((reply) => (
            <li key={reply.id} className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-800">{reply.user_id}</span> {/* Fetch username */}
                <span className="text-xs text-gray-500">{format(new Date(reply.created_at), 'PPP p')}</span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{reply.message}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleReplySubmit} className="mt-6">
          <div>
            <label htmlFor="newReply" className="sr-only">
              Add your reply
            </label>
            <textarea
              id="newReply"
              name="newReply"
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Add your reply"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mt-3 text-right">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Post Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}