import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';
import AdminLayout from '@/src/components/admin/AdminLayout';
import SupportTicketList from '@/src/components/admin/SupportTicketList';

export default async function AdminSupportTicketsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: tickets,
    error
  } = await supabase
    .from('support_tickets')
    .select('*, profiles(username)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching support tickets:', error);
    return (
      <AdminLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Support Ticket Management</h1>
          <p className="text-red-500">Error loading tickets. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Support Ticket Management</h1>
        <SupportTicketList tickets={tickets || []} />
      </div>
    </AdminLayout>
  );
}