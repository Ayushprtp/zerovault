import { createClient } from '@/src/utils/supabase/server';
import { getFeatureRequestsWithVotes } from './actions';
import CreateFeatureRequestForm from '@/src/components/user/CreateFeatureRequestForm';
import FeatureRequestList from '@/src/components/user/FeatureRequestList';

export default async function FeatureRequestsPage() {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    // Handle unauthorized access or redirect to login
    return <p>Please log in to view feature requests.</p>;
  }

  const userId = userData.user.id;
  const featureRequests = await getFeatureRequestsWithVotes(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Feature Request Board</h1>

      <div className="mb-8">
        <CreateFeatureRequestForm userId={userId} />
      </div>

      <FeatureRequestList requests={featureRequests || []} userId={userId} />
    </div>
  );
}