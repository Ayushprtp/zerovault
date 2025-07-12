import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/database.types';
import AdminDashboard from '@/components/AdminDashboard';
import UserDashboard from '@/components/UserDashboard';

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies: () => cookies() });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    console.error('Error fetching profile:', error);
    // Handle error appropriately, perhaps redirect to an error page or show a message
    redirect('/login'); // Or an error page
  }

  // Conditional rendering based on user role
  if (profile.role === 'admin' || profile.role === 'dev') {
    return <AdminDashboard profile={profile} />;
  } else {
    return <UserDashboard profile={profile} />;
  }
}