'use client';

import { useState } from 'react';

interface FundingSourceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (source: 'personal' | 'team') => void;
  userHasTeam: boolean;
}

export default function FundingSourceSelector({
  isOpen,
  onClose,
  onSelectSource,
  userHasTeam,
}: FundingSourceSelectorProps) {
  if (!isOpen || !userHasTeam) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-bold mb-4">Select Funding Source</h2>
        <p className="mb-4">Choose whether to use your personal balance or your team's balance for this query.</p>
        <div className="flex justify-end space-x-4">
          <button onClick={() => onSelectSource('personal')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Personal Balance</button>
          <button onClick={() => onSelectSource('team')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Team Balance</button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

interface FundingSourceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (source: 'personal' | 'team') => void;
  userHasTeam: boolean;
}

export default function FundingSourceSelector({
  isOpen,
  onClose,
  onSelectSource,
  userHasTeam,
}: FundingSourceSelectorProps) {
  if (!isOpen || !userHasTeam) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-bold mb-4">Select Funding Source</h2>
        <p className="mb-4">Choose whether to use your personal balance or your team's balance for this query.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => onSelectSource('personal')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Personal Balance
          </button>
          <button
            onClick={() => onSelectSource('team')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Team Balance
          </button>
        </div>
      </div>
    </div>
  );
}