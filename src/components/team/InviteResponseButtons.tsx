'use client';

import { useRouter } from 'next/navigation';
import { acceptTeamInvite, rejectTeamInvite } from '@/src/app/dashboard/team/actions'; // Assuming actions file location

interface InviteResponseButtonsProps {
  inviteId: string;
}

export default function InviteResponseButtons({ inviteId }: InviteResponseButtonsProps) {
  const router = useRouter();

  const handleAccept = async () => {
    await acceptTeamInvite(inviteId);
    router.refresh();
  };

  const handleReject = async () => {
    await rejectTeamInvite(inviteId);
    router.refresh();
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleAccept}
        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-1 px-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Accept
      </button>
      <button
        onClick={handleReject}
        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-1 px-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Reject
      </button>
    </div>
  );
}