import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ServiceForm from '@/src/components/admin/ServiceForm';
import ServiceActions from '@/src/components/admin/ServiceActions';

export default async function ServicesPage() {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user || user.user.user_metadata.role !== 'admin') {
    redirect('/dashboard');
  }

  const { data: services, error } = await supabase.from('services').select('*');

  if (error) {
    console.error('Error fetching services:', error);
    return <div>Error loading services.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>
      <ServiceForm />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Services</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                <th className="border py-2 px-4 text-left">Name</th>
                <th className="border py-2 px-4 text-left">Description</th>
                <th className="border py-2 px-4 text-left">API URL</th>
                <th className="border py-2 px-4 text-left">Cost</th>
                <th className="border py-2 px-4 text-left">Active</th>
                <th className="border py-2 px-4 text-left">Beta</th>
                <th className="border py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="border py-2 px-4">{service.name}</td>
                  <td className="border py-2 px-4">{service.description}</td>
                  <td className="border py-2 px-4">{service.api_url}</td>
                  <td className="border py-2 px-4">{service.cost_per_query}</td>
                  <td className="border py-2 px-4">{service.is_active ? 'Yes' : 'No'}</td>
                  <td className="border py-2 px-4">{service.is_beta ? 'Yes' : 'No'}</td>
                  <td className="border py-2 px-4">
                    <ServiceActions serviceId={service.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}