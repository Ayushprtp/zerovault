import { createClient } from '@/utils/supabase/server';
import { UserDashboardLayout } from '@/components/UserDashboardLayout';
import { redirect } from 'next/navigation';

export default async function ReferralsPage() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('referral_code, zero_coins') // Assuming zero_coins could represent bonuses or total coins
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    // Handle error display or redirect
  }

  const referralLink = profile?.referral_code
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth?referral=${profile.referral_code}`
    : 'Generating referral link...'; // Or handle the case where no code exists

  return (
    <UserDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Referral System</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
          <p className="text-gray-300 mb-4">Share this link with your friends to earn bonuses!</p>
          <div className="bg-gray-700 p-3 rounded flex items-center justify-between break-all">
            <span className="text-blue-400 font-mono text-sm md:text-base">
              {referralLink}
            </span>
            {referralLink !== 'Generating referral link...' && (
              <button
                onClick={() => navigator.clipboard.writeText(referralLink)}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
              >
                Copy
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Referral Bonuses</h2>
          {/* This section might need more detailed data from the transaction log
              or a specific referral bonus table if available.
              For now, we can just show the user's total coins as a placeholder.
           */}
          <p className="text-gray-300">
            Your current ZeroCoin balance (includes potential referral bonuses):{' '}
            <span className="font-bold text-yellow-400">{profile?.zero_coins || 0} ZeroCoins</span>
          </p>
          {/* Add more detailed information about earned bonuses here if the schema supports it */}
        </div>
      </div>
    </UserDashboardLayout>
  );
}