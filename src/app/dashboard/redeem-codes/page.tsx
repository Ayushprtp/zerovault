import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayout from '@/src/components/admin/AdminLayout';
import CreateRedeemCodeForm from '@/src/components/admin/CreateRedeemCodeForm';
import RedeemCodeLog from '@/src/components/admin/RedeemCodeLog';

export default async function RedeemCodesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'admin' && profile?.role !== 'dev') {
    redirect('/dashboard');
  }

  // Fetch redeem code log data here
  const { data: redeemCodes, error } = await supabase.from('redeem_codes').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching redeem codes:', error);
    // Handle error appropriately, maybe show an error message to the admin
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Redeem Code Management</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Redeem Code</h2>
            <CreateRedeemCodeForm />
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Redeem Code Log</h2>
            {redeemCodes ? <RedeemCodeLog redeemCodes={redeemCodes} /> : <p>Loading log...</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}