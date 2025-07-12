import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';
import AdminLayout from '@/src/components/admin/AdminLayout';
import UserList from '@/src/components/admin/UserList'; // Assuming you'll create this component

export default async function UserManagementPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This should ideally be caught by middleware or a higher-level check,
    // but as a fallback:
    return <p>Authentication required.</p>;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'dev') {
    return <p>Access denied.</p>;
  }

  const { data: users, error } = await supabase.from('profiles').select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return <p>Error loading users.</p>;
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {users ? <UserList users={users} /> : <p>Loading users...</p>}
    </AdminLayout>
  );
}