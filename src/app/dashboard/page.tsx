import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@supabase/supabase-js';

// import AdminDashboard from '@/components/AdminDashboard'; // Temporarily removed

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies: () => cookies() });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }
  return <div>Authenticated Dashboard</div>; // Temporarily simplified
}
