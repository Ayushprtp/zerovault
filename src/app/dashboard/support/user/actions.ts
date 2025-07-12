'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';

export async function createSupportTicket(subject: string, message: string) {
  const supabase = createServerActionClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.from('support_tickets').insert({
    user_id: user.id,
    subject: subject,
    status: 'open', // Default status
  }).select().single();

  if (error) {
    console.error('Error creating support ticket:', error);
    throw new Error('Failed to create support ticket.');
  }

  // Add the initial message as a reply
  const { data: replyData, error: replyError } = await supabase.from('ticket_replies').insert({
    ticket_id: data.id,
    user_id: user.id,
    message: message,
  });

  if (replyError) {
    console.error('Error adding initial reply to ticket:', replyError);
    // Consider rolling back ticket creation here if reply is essential
    throw new Error('Failed to add initial message to ticket.');
  }

  return data;
}

export async function fetchUserTickets() {
  const supabase = createServerActionClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.from('support_tickets').select('*, ticket_replies(*)').eq('user_id', user.id).order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user tickets:', error);
    throw new Error('Failed to fetch your support tickets.');
  }

  return data;
}

export async function addTicketReply(ticketId: number, message: string) {
  const supabase = createServerActionClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.from('ticket_replies').insert({
    ticket_id: ticketId,
    user_id: user.id,
    message: message,
  });

  if (error) {
    console.error('Error adding ticket reply:', error);
    throw new Error('Failed to add reply to ticket.');
  }

  // Optionally, update ticket status to 'pending' if a user replies to a closed ticket
  // await supabase.from('support_tickets').update({ status: 'pending' }).eq('id', ticketId).eq('status', 'closed');


  return data;
}