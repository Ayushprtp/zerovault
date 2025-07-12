"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/database.types';
import { format } from 'date-fns';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ReplyToTicketForm } from './ReplyToTicketForm';

type Ticket = Database['public']['Tables']['support_tickets']['Row'] & {
  replies: Database['public']['Tables']['ticket_replies']['Row'][] | null;
  profiles?: { username: string } | null;
};

type Profiles = Database['public']['Tables']['profiles']['Row'];

interface TicketDetailProps {
  ticket: Ticket;
  userProfile: Profiles;
}

export default function TicketDetail({ ticket, userProfile }: TicketDetailProps) {
  const router = useRouter();
  const [replies, setReplies] = useState(ticket.replies || []);
  const supabase = createClientComponentClient<Database>();

  const handleNewReply = (newReply: Database['public']['Tables']['ticket_replies']['Row']) => {
    setReplies([...replies, newReply]);
  };

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 text-blue-500 hover:underline"
        onClick={() => router.back()}
      >
        &larr; Back to Tickets
      </button>
      <h1 className="text-2xl font-bold mb-2">{ticket.subject}</h1>
      <p className="text-gray-600 mb-4">
        Status: <span className={`font-semibold ${ticket.status === 'open' ? 'text-green-600' : ticket.status === 'closed' ? 'text-red-600' : 'text-yellow-600'}`}>{ticket.status}</span> | Created At: {format(new Date(ticket.created_at), 'PPP p')}
      </p>

      <div className="border-t pt-4 mt-4">
        <h2 className="text-xl font-semibold mb-4">Replies</h2>
        {replies.length === 0 ? (
          <p>No replies yet.</p>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="border rounded-lg p-4 bg-gray-50">
                <p className="font-semibold text-gray-800">
                  {reply.user_id === userProfile.id ? 'You' : 'Admin'} at {format(new Date(reply.created_at), 'PPP p')}
                </p>
                <p className="text-gray-700 mt-1">{reply.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {ticket.status !== 'closed' && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Add a Reply</h2>
          <ReplyToTicketForm ticketId={ticket.id} userId={userProfile.id} onNewReply={handleNewReply} />
        </div>
      )}
    </div>
  );
}