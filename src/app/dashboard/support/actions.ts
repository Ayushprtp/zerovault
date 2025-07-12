'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAdminSupportTickets() {
  const supabase = createClient();
  const { data: tickets, error } = await supabase
    .from('support_tickets')
    .select('*, profiles(username)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin support tickets:', error.message);
    return [];
  }
  return tickets;
}

export async function getAdminTicketReplies(ticketId: number) {
  const supabase = createClient();
  const { data: replies, error } = await supabase
    .from('ticket_replies')
    .select('*, profiles(username)')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching admin ticket replies:', error.message);
    return [];
  }
  return replies;
}

export async function updateTicketStatus(ticketId: number, status: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('support_tickets')
    .update({ status })
    .eq('id', ticketId);

  if (error) {
    console.error('Error updating ticket status:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/support');
  revalidatePath(`/dashboard/support/${ticketId}`);
  return { success: true };
}

export async function addAdminTicketReply(ticketId: number, message: string) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error('Error getting user for ticket reply:', userError?.message);
    return { success: false, error: 'User not authenticated' };
  }

  const { error } = await supabase
    .from('ticket_replies')
    .insert({ ticket_id: ticketId, user_id: userData.user.id, message });

  if (error) {
    console.error('Error adding admin ticket reply:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/support/${ticketId}`);
  return { success: true };
}