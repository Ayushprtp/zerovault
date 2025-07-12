'use client';

import { useState, useEffect } from 'react';
import { acceptTeamInvite, rejectTeamInvite } from '@/src/app/dashboard/team/actions'; // Assuming actions for invites are here
import { Database } from '@/src/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

type TeamInvite = Database['public']['Tables']['team_invites']['Row'] & {
  teams?: { name: string } | null;
  profiles?: { username: string } | null;
};

export default function PendingInvites() {
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const fetchInvites = async () => {
      const { data, error } = await supabase
        .from('team_invites')
        .select('*, teams(name), profiles!team_invites_inviter_user_id_fkey(username)')
        .eq('invited_user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching invites:', error);
      } else {
        setInvites(data || []);
      }
      setLoading(false);
    };

    fetchInvites();

    const channels = supabase
      .channel('team_invites_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_invites',
          filter: `invited_user_id=eq.${(supabase.auth.getUser() as any)?.data.user?.id}`, // Type assertion needed here
        },
        (payload) => {
          fetchInvites(); // Re-fetch invites on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, [supabase, router]);

  const handleAccept = async (inviteId: string) => {
    setLoading(true);
    await acceptTeamInvite(inviteId);
    router.refresh();
  };

  const handleReject = async (inviteId: string) => {
    setLoading(true);
    await rejectTeamInvite(inviteId);
    router.refresh();
  };

  if (loading) {
    return <p>Loading invites...</p>;
  }

  if (invites.length === 0) {
    return <p>No pending team invites.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Pending Team Invites</h3>
      <ul role="list" className="mt-4 space-y-4">
        {invites.map((invite) => (
          <li key={invite.id} className="bg-white shadow overflow-hidden rounded-md px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                You have been invited to join team "{invite.teams?.name || 'Unknown Team'}" by {invite.profiles?.username || 'Unknown User'}.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleAccept(invite.id)}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleReject(invite.id)}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}