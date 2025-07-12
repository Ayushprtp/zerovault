import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import ActionThrottlingForm from '@/src/components/admin/ActionThrottlingForm';

export default async function SecuritySettingsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'admin' && profile?.role !== 'dev') {
    return redirect('/dashboard');
  }

  // In a real application, you would fetch existing throttling settings here
  // For now, we'll just render the form.
  const throttlingSettings = {
    max_support_tickets_per_hour: 5, // Example default
    // Add other throttling settings here based on your needs
  };


  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-2xl font-semibold leading-7 text-gray-900">Security Settings</h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">Manage platform security settings, such as action throttling.</p>

      <ActionThrottlingForm initialSettings={throttlingSettings} />

    </div>
  );
}