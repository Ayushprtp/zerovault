import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayout from '@/src/components/admin/AdminLayout';
import { fetchServices } from '../services/actions'; // Assuming service actions can fetch all services
import ApiManagementTable from '@/src/components/admin/ApiManagementTable'; // We'll create this component

export default async function ApiManagementPage() {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  // Fetch the user's profile to check their role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    // Redirect or show unauthorized message if not an admin
    redirect('/dashboard'); // Or a dedicated unauthorized page
  }

  const services = await fetchServices(); // Fetch all services to manage their API versions

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">API Management</h1>
      <p className="mb-6 text-gray-700">Manage the API versions and settings for each service.</p>

      {services && services.length > 0 ? (
        <ApiManagementTable services={services} />
      ) : (
        <p>No services found to manage API versions.</p>
      )}
    </AdminLayout>
  );
}