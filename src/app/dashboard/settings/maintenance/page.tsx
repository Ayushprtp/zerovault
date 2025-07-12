import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import MaintenanceModeToggle from '@/src/components/admin/MaintenanceModeToggle';

export default async function MaintenanceSettingsPage() {
  const supabase = createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user.id)
    .single();

  if (profileError || (profile.role !== 'admin' && profile.role !== 'dev')) {
    redirect('/dashboard'); // Redirect non-admins/devs
  }

  // Fetch current maintenance mode status from site_settings
  const { data: maintenanceSetting, error: maintenanceError } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'maintenance_mode')
    .single();

  const isMaintenanceMode = maintenanceSetting?.value === 'true';


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Maintenance Mode Settings</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <MaintenanceModeToggle initialStatus={isMaintenanceMode} />
      </div>
    </div>
  );
}