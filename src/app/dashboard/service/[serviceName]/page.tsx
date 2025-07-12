'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/src/lib/SupabaseProvider';
import { Service, QueryLog, Team } from '@/src/lib/database.types';
import {
  getServiceByName,
  getServiceQueryHistory,
  processServiceQuery,
  getUserTeam,
} from './actions';

interface ServicePageProps {}

export default function ServicePage({}: ServicePageProps) {
  const { serviceName } = useParams();
  const user = useUser();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [queryInput, setQueryInput] = useState('');
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFundingSourceModal, setShowFundingSourceModal] = useState(false);
  const [selectedFundingSource, setSelectedFundingSource] = useState<'personal' | 'team' | null>(
    null
  );
  const [userTeam, setUserTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchServiceAndHistory = async () => {
      if (!serviceName || Array.isArray(serviceName)) {
        setError('Invalid service name.');
        return;
      }

      const name = serviceName as string;
      const fetchedService = await getServiceByName(name);
      setService(fetchedService);

      if (fetchedService) {
        const fetchedHistory = await getServiceQueryHistory(fetchedService.id);
        setQueryHistory(fetchedHistory || []);
      }

      const team = await getUserTeam();
      setUserTeam(team);
    };

    fetchServiceAndHistory();
  }, [serviceName, user, router]);

  const handleQuerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!service || !user) return;

    if (userTeam && !selectedFundingSource) {
      setShowFundingSourceModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setQueryOutput(null);

    try {
      const result = await processServiceQuery(
        service.id,
        queryInput,
        selectedFundingSource || 'personal' // Default to personal if no team or selection made
      );
      setQueryOutput(result.output);
      // Refresh history after successful query (consider a more efficient update later)
      if (service) {
        const updatedHistory = await getServiceQueryHistory(service.id);
        setQueryHistory(updatedHistory || []);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setQueryOutput(null); // Clear output on error
    } finally {
      setLoading(false);
      setShowFundingSourceModal(false);
      setSelectedFundingSource(null);
    }
  };

  const handleFundingSourceSelect = (source: 'personal' | 'team') => {
    setSelectedFundingSource(source);
    setShowFundingSourceModal(false);
    // Re-submit the query after selecting the source
    handleQuerySubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
  };

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!service) {
    return <div>Loading service details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{service.name}</h1>
      <p className="text-gray-600 mb-6">{service.description}</p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Query {service.name}</h2>
        <form onSubmit={handleQuerySubmit}>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            rows={4}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={`Enter your query for ${service.name}...`}
            required
          ></textarea>
          <button
            type="submit"
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Query'}
          </button>
        </form>
      </div>

      {queryOutput !== null && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Output</h2>
          <pre className="whitespace-pre-wrap break-words bg-gray-200 p-4 rounded-md">
            {queryOutput}
          </pre>
          {queryOutput !== "Srsly.?Are U Kidding Me Kid ." && (
             <button
               className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
               onClick={() => navigator.clipboard.writeText(queryOutput)}
             >
               Copy Output
             </button>
          )}
        </div>
      )}

      {showFundingSourceModal && userTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Select Funding Source</h3>
            <p className="mb-4">You are in a team. Where would you like to pay for this query?</p>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handleFundingSourceSelect('personal')}
              >
                Personal Balance
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => handleFundingSourceSelect('team')}
              >
                Team Balance ({userTeam.name})
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Query History</h2>
        {queryHistory.length === 0 ? (
          <p>No query history for this service yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Query
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Result
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cost
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                 <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Funded By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queryHistory.map((query) => (
                <tr key={query.id}>
                  <td className="px-6 py-4 whitespace-pre-wrap break-words text-sm text-gray-900">{query.query_input}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap break-words text-sm text-gray-900">{query.query_response}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{query.coins_spent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(query.timestamp).toLocaleString()}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {query.is_team_query ? 'Team' : 'Personal'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}