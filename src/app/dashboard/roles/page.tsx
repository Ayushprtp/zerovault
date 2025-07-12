import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayout from '@/src/components/admin/AdminLayout';
import RoleList from '@/src/components/admin/RoleList';
import RoleForm from '@/src/components/admin/RoleForm';

export default async function RolesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'dev') {
    return redirect('/dashboard');
  }

  const { data: roles, error } = await supabase
    .from('role_permissions')
    .select('*');

  if (error) {
    console.error('Error fetching roles:', error);
    // Handle error display to user
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Role Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Existing Roles</h2>
          {roles && <RoleList roles={roles} />}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Create New Role</h2>
          <RoleForm />
        </div>
      </div>
    </AdminLayout>
  );
}