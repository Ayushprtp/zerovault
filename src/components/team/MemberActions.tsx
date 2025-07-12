'use client';

import { useRouter } from 'next/navigation';
import { removeTeamMember } from '@/src/app/dashboard/team/actions'; // Assuming you'll add removeTeamMember action

interface MemberActionsProps {
  teamId: string;
  userId: string;
  isCurrentUserAdmin: boolean;
}

export default function MemberActions({ teamId, userId, isCurrentUserAdmin }: MemberActionsProps) {
  const router = useRouter();

  const handleRemoveMember = async () => {
    if (isCurrentUserAdmin) {
      // Add a confirmation dialog here in a real application
      await removeTeamMember(teamId, userId);
      router.refresh();
    } else {
      alert('You do not have permission to remove members.');
    }
  };

  // Add more actions here as needed (e.g., change role)

  return (
    <div>
      {isCurrentUserAdmin && (
        <button
          onClick={handleRemoveMember}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Remove
        </button>
      )}
      {/* Add buttons for other actions like changing role */}
    </div>
  );
}