'use client';

import { useState } from 'react';
import { voteFeatureRequest } from '@/src/app/dashboard/feature-requests/actions';

interface VoteButtonsProps {
  requestId: number;
  initialVote: number | null;
  onVoteSuccess: () => void;
}

export default function VoteButtons({ requestId, initialVote, onVoteSuccess }: VoteButtonsProps) {
  const [userVote, setUserVote] = useState<number | null>(initialVote);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType: number) => {
    setLoading(true);
    const { data, error } = await voteFeatureRequest(requestId, voteType);

    if (error) {
      console.error('Voting failed:', error);
      // Handle error (e.g., show a toast message)
    } else if (data) {
      setUserVote(data.newVoteStatus);
      onVoteSuccess(); // Refresh the list or update UI
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleVote(1)} // 1 for upvote
        disabled={loading || userVote === 1}
        className={`px-2 py-1 rounded ${
          userVote === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
        } disabled:opacity-50`}
      >
        Upvote
      </button>
      <button
        onClick={() => handleVote(-1)} // -1 for downvote
        disabled={loading || userVote === -1}
        className={`px-2 py-1 rounded ${
          userVote === -1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
        } disabled:opacity-50`}
      >
        Downvote
      </button>
    </div>
  );
}