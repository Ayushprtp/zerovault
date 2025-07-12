import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import SiteSettingsForm from '@/src/components/admin/SiteSettingsForm';

export default async function SiteSettingsPage() {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.user?.id)
    .single();

  if (!user || profile?.role !== 'admin') {
    redirect('/login');
  }

  const { data: settings, error } = await supabase.from('site_settings').select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    // Handle error appropriately, maybe show an error message
    return <div>Error loading settings.</div>;
  }

  // Convert settings array to a more usable object format
  const settingsObject: { [key: string]: string } = {};
  settings.forEach(setting => {
    settingsObject[setting.key] = setting.value || '';
  });


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Site Customization & App Settings</h1>
      <SiteSettingsForm initialSettings={settingsObject} />
    </div>
  );
}