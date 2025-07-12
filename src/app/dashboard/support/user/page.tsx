import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import TicketList from '@/src/components/user/TicketList';
import CreateTicketForm from '@/src/components/user/CreateTicketForm';
import TicketDetail from '@/src/components/user/TicketDetail';

export default async function UserSupportPage({ searchParams }: { searchParams: { ticketId?: string } }) {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const selectedTicketId = searchParams.ticketId;

  const { data: tickets, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  let selectedTicket = null;
  if (selectedTicketId) {
    const { data: ticketData, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*, ticket_replies(*)')
      .eq('id', parseInt(selectedTicketId))
      .single();
    selectedTicket = ticketData;
  }

  if (error) {
    console.error('Error fetching tickets:', error);
    // Handle error appropriately, maybe display a message to the user
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Support Tickets</h2>

      {selectedTicket ? (
        <TicketDetail ticket={selectedTicket} />
      ) : (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Ticket History</h3>
          {tickets && tickets.length > 0 ? (
            <TicketList tickets={tickets} />
          ) : (
            <p>You have no support tickets yet.</p>
          )}
        </div>
      )}
      <CreateTicketForm />
    </div>
  );
}