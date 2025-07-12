'use client';

import { useState, useEffect } from 'react';
import { Team, TeamMember } from '@/src/lib/database.types';
import { supabase } from '@/src/lib/supabase/client';
import InviteMemberForm from '@/src/components/team/InviteMemberForm';
import MemberActions from '@/src/components/team/MemberActions';
import PendingInvites from '@/src/components/team/PendingInvites';
import ManageMember from '@/src/components/team/ManageMember';

interface TeamDashboardProps {
  team: Team;
  teamMembers: TeamMember[];
  userRole: string;
}

export default function TeamDashboard({ team, teamMembers, userRole }: TeamDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]); // TODO: Define type for pending invites
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);


  useEffect(() => {
    fetchPendingInvites();
  }, [team.id]);

  const fetchPendingInvites = async () => {
    const { data, error } = await supabase
      .from('team_invites')
      .select('*, invited_user:invited_user_id(username)')
      .eq('team_id', team.id)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending invites:', error);
    } else {
      setPendingInvites(data || []);
    }
  };


  const handleMemberUpdated = (updatedMember: TeamMember) => {
    setMembers(members.map(member => member.user_id === updatedMember.user_id ? updatedMember : member));
  };

  const handleMemberRemoved = (removedUserId: string) => {
    setMembers(members.filter(member => member.user_id !== removedUserId));
    setSelectedMember(null); // Close manage modal if the removed member was selected
  };

  const handleInviteAccepted = () => {
    // This would ideally trigger a re-fetch of team members or a real-time update
    // For now, we'll just re-fetch pending invites
    fetchPendingInvites();
  };

  const handleInviteRejected = () => {
     fetchPendingInvites();
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Team: {team.name}</h2>
      <p className="text-gray-600">ZeroCoin Balance: {team.zero_coin_balance}</p>

      {/* Team Admin/Manager Features */}
      {(userRole === 'admin' || userRole === 'manager') && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Team Management</h3>
          <InviteMemberForm teamId={team.id} onInviteSent={fetchPendingInvites} />
          <PendingInvites invites={pendingInvites} onInviteAccepted={handleInviteAccepted} onInviteRejected={handleInviteRejected} />

          <div>
            <h4 className="text-lg font-medium text-gray-700">Team Members</h4>
            <ul role="list" className="mt-2 divide-y divide-gray-200">
              {members.map((member) => (
                <li key={member.user_id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {/* Replace with actual avatar */}
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{member.user_id}</p> {/* TODO: Fetch username */}
                      <p className="text-sm text-gray-500">Role: {member.role}</p>
                      {member.spending_limit !== null && (
                         <p className="text-sm text-gray-500">Spending Limit: {member.spending_limit}</p>
                      )}
                    </div>
                  </div>
                  {(userRole === 'admin' || (userRole === 'manager' && member.role === 'member')) && (
                      <button
                          onClick={() => setSelectedMember(member)}
                          className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                          Manage
                      </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedMember && (
          <ManageMember
              member={selectedMember}
              teamId={team.id}
              onClose={() => setSelectedMember(null)}
              onMemberUpdated={handleMemberUpdated}
              onMemberRemoved={handleMemberRemoved}
              currentUserRole={userRole}
          />
      )}


      {/* Features for all team members */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Team Activity</h3>
        {/* TODO: Implement Team Activity Widget/Section */}
        <p className="text-gray-600">Team activity log goes here...</p>
      </div>
    </div>
  );
}