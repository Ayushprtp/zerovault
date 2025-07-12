import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import ExclusionList from '@/src/components/admin/ExclusionList';
import AddExclusionForm from '@/src/components/admin/AddExclusionForm';

export default async function ExclusionPage() {
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

  // Fetch the exclusion list
  const { data: excludedTerms, error } = await supabase.from('excluded_terms').select('term');

  if (error) {
    console.error('Error fetching excluded terms:', error);
    // Handle error appropriately, maybe show an error message
    return <div>Error loading exclusion list.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Manage Exclusion List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Excluded Terms</h2>
          {excludedTerms && excludedTerms.length > 0 ? (
            <ExclusionList terms={excludedTerms} />
          ) : (
            <p>No terms currently excluded.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Exclusion</h2>
          <AddExclusionForm />
        </div>
      </div>
    </div>
  );
}