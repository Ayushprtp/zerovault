'use client';

import { useState, useEffect } from 'react';
import { getFeatureRequestsWithVotes, voteFeature, pledgeBounty } from '@/src/app/dashboard/feature-requests/actions';
import { FeatureRequest } from '@/src/lib/database.types'; // Assuming FeatureRequest type exists

interface FeatureRequestListProps {
  userId: string; // Pass the logged-in user's ID to check their vote
}

export default function FeatureRequestList({ userId }: FeatureRequestListProps) {
  const [featureRequests, setFeatureRequests] = useState<(FeatureRequest & { vote_total: number; user_vote: number | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bountyAmount, setBountyAmount] = useState<number>(1); // Default bounty pledge amount

  useEffect(() => {
    const fetchFeatureRequests = async () => {
      setLoading(true);
      const { data, error } = await getFeatureRequestsWithVotes(userId);
      if (error) {
        setError(error.message);
      } else {
        setFeatureRequests(data || []);
      }
      setLoading(false);
    };
    fetchFeatureRequests();
  }, [userId]);

  const handleVote = async (requestId: number, voteType: 1 | -1) => {
    const { error } = await voteFeature(requestId, voteType);
    if (error) {
      console.error('Error voting:', error);
      // Optionally show a user-facing error
    } else {
      // Optimistically update the UI or refetch
      const fetchFeatureRequests = async () => {
        const { data, error } = await getFeatureRequestsWithVotes(userId);
        if (error) {
          setError(error.message);
        } else {
          setFeatureRequests(data || []);
        }
      };
      fetchFeatureRequests();
    }
  };

  const handlePledgeBounty = async (requestId: number) => {
    if (bountyAmount <= 0) return;
    const { error } = await pledgeBounty(requestId, bountyAmount);
    if (error) {
      console.error('Error pledging bounty:', error);
      // Optionally show a user-facing error
    } else {
      // Refetch to show updated bounty
      const fetchFeatureRequests = async () => {
        const { data, error } = await getFeatureRequestsWithVotes(userId);
        if (error) {
          setError(error.message);
        } else {
          setFeatureRequests(data || []);
        }
      };
      fetchFeatureRequests();
    }
  };

  if (loading) {
    return <div>Loading feature requests...</div>;
  }

  if (error) {
    return <div>Error loading feature requests: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {featureRequests.map((request) => (
        <div key={request.id} className="p-6 border rounded-lg shadow-sm bg-white">
          <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
          <p className="mt-2 text-gray-600">{request.description}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>Status: {request.status}</span>
            <span>Bounty: {request.total_bounty} ZeroCoins</span>
            <span>Votes: {request.vote_total}</span>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote(request.id, 1)}
                className={`px-3 py-1 border rounded-md text-sm ${request.user_vote === 1 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Upvote ({request.user_vote === 1 ? 'Voted' : ''})
              </button>
              <button
                onClick={() => handleVote(request.id, -1)}
                className={`px-3 py-1 border rounded-md text-sm ${request.user_vote === -1 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Downvote ({request.user_vote === -1 ? 'Voted' : ''})
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={bountyAmount}
                onChange={(e) => setBountyAmount(parseInt(e.target.value, 10) || 1)}
                min="1"
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                onClick={() => handlePledgeBounty(request.id)}
                className="px-3 py-1 border rounded-md text-sm bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              >
                Pledge Bounty
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { getFeatureRequestsWithVotes, voteFeature, pledgeBounty } from '@/src/app/dashboard/feature-requests/actions';
import { FeatureRequest } from '@/src/lib/database.types'; // Assuming FeatureRequest type exists

interface FeatureRequestListProps {
  userId: string; // Pass the logged-in user's ID to check their vote
}

export default function FeatureRequestList({ userId }: FeatureRequestListProps) {
  const [featureRequests, setFeatureRequests] = useState<(FeatureRequest & { vote_total: number; user_vote: number | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bountyAmount, setBountyAmount] = useState<number>(1); // Default bounty pledge amount

  useEffect(() => {
    const fetchFeatureRequests = async () => {
      setLoading(true);
      const { data, error } = await getFeatureRequestsWithVotes(userId);
      if (error) {
        setError(error.message);
      } else {
        setFeatureRequests(data || []);
      }
      setLoading(false);
    };
    fetchFeatureRequests();
  }, [userId]);

  const handleVote = async (requestId: number, voteType: 1 | -1) => {
    const { error } = await voteFeature(requestId, voteType);
    if (error) {
      console.error('Error voting:', error);
      // Optionally show a user-facing error
    } else {
      // Optimistically update the UI or refetch
      const fetchFeatureRequests = async () => {
        const { data, error } = await getFeatureRequestsWithVotes(userId);
        if (error) {
          setError(error.message);
        } else {
          setFeatureRequests(data || []);
        }
      };
      fetchFeatureRequests();
    }
  };

  const handlePledgeBounty = async (requestId: number) => {
    if (bountyAmount <= 0) return;
    const { error } = await pledgeBounty(requestId, bountyAmount);
    if (error) {
      console.error('Error pledging bounty:', error);
      // Optionally show a user-facing error
    } else {
      // Refetch to show updated bounty
      const fetchFeatureRequests = async () => {
        const { data, error } = await getFeatureRequestsWithVotes(userId);
        if (error) {
          setError(error.message);
        } else {
          setFeatureRequests(data || []);
        }
      };
      fetchFeatureRequests();
    }
  };

  if (loading) {
    return <div>Loading feature requests...</div>;
  }

  if (error) {
    return <div>Error loading feature requests: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {featureRequests.map((request) => (
        <div key={request.id} className="p-6 border rounded-lg shadow-sm bg-white">
          <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
          <p className="mt-2 text-gray-600">{request.description}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>Status: {request.status}</span>
            <span>Bounty: {request.total_bounty} ZeroCoins</span>
            <span>Votes: {request.vote_total}</span>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote(request.id, 1)}
                className={`px-3 py-1 border rounded-md text-sm ${request.user_vote === 1 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Upvote ({request.user_vote === 1 ? 'Voted' : ''})
              </button>
              <button
                onClick={() => handleVote(request.id, -1)}
                className={`px-3 py-1 border rounded-md text-sm ${request.user_vote === -1 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Downvote ({request.user_vote === -1 ? 'Voted' : ''})
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={bountyAmount}
                onChange={(e) => setBountyAmount(parseInt(e.target.value, 10) || 1)}
                min="1"
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                onClick={() => handlePledgeBounty(request.id)}
                className="px-3 py-1 border rounded-md text-sm bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              >
                Pledge Bounty
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}