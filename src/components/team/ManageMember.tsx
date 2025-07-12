'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateTeamMember } from '@/src/app/dashboard/team/actions';
import { TeamMember } from '@/src/lib/database.types';

interface ManageMemberProps {
  member: TeamMember;
}

export default function ManageMember({ member }: ManageMemberProps) {
  const router = useRouter();
  const [spendingLimit, setSpendingLimit] = useState(member.spending_limit || 0);

  const handleSpendingLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpendingLimit(parseInt(e.target.value, 10) || 0);
  };

  const handleUpdateMember = async () => {
    if (member.team_id && member.user_id) {
      await updateTeamMember(member.team_id, member.user_id, { spending_limit: spendingLimit });
      router.refresh();
    }
  };

  return (
    <div className="border rounded-md p-4 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">{member.user_id}</h3> {/* Display username instead of ID */}
      <div className="mt-4">
        <label htmlFor={`spending-limit-${member.user_id}`} className="block text-sm font-medium text-gray-700">
          Monthly Spending Limit (ZeroCoins)
        </label>
        <input
          type="number"
          name={`spending-limit-${member.user_id}`}
          id={`spending-limit-${member.user_id}`}
          value={spendingLimit}
          onChange={handleSpendingLimitChange}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mt-4">
        <button
          onClick={handleUpdateMember}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Spending Limit
        </button>
      </div>
    </div>
  );
}