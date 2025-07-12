import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Team, TeamMember, Profile } from '@/src/lib/database.types';
import CreateTeamForm from '@/src/components/team/CreateTeamForm';
import TeamDashboard from '@/src/components/team/TeamDashboard';

export default async function TeamPage() {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, team_members(team_id, role, teams(*))')
    .eq('id', user.user.id)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching profile:', profileError);
    // Handle error - maybe redirect to a profile setup page or show an error message
    return <div>Error loading profile.</div>;
  }

  const userTeam = profile.team_members?.[0];
  const isTeamAdmin = userTeam?.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Team System</h1>
      {userTeam ? (
        <TeamDashboard
          team={userTeam.teams as Team}
          isTeamAdmin={isTeamAdmin}
          userProfile={profile as Profile} // Pass the full profile object
        />
      ) : (
        <div>
          <p className="text-lg mb-4">You are not currently in a team.</p>
          <CreateTeamForm userId={user.user.id} />
        </div>
      )}
    </div>
  );
}