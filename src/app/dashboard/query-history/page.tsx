'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchQueryHistory } from './actions'; // Assuming you'll create this action
import { Database } from '@/lib/database.types'; // Adjust path as necessary
import { createClient } from '@/lib/supabase/client'; // Adjust path as necessary

type QueryLog = Database['public']['Tables']['query_log']['Row'];

export default function QueryHistoryPage() {
  const [queries, setQueries] = useState<QueryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const loadQueries = async () => {
      setLoading(true);
      setError(null);
      const {
        data,
        error: fetchError
      } = await fetchQueryHistory({
        keyword: searchKeyword,
        serviceId: selectedService,
        startDate,
        endDate
      });

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setQueries(data);
      }
      setLoading(false);
    };

    loadQueries();
  }, [searchKeyword, selectedService, startDate, endDate]); // Re-run effect when filters change

  // You might need to fetch the list of available services for the filter dropdown
  // useEffect(() => {
  //   const fetchServices = async () => {
  //     const { data, error } = await supabase.from('services').select('id, name');
  //     if (data) {
  //       // Set services for dropdown
  //     }
  //   };
  //   fetchServices();
  // }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Advanced Query History</h1>

      {/* Filter and Search Area */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-300">
            Keyword
          </label>
          <input
            type="text"
            id="keyword"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-300">
            Service
          </label>
          <select
            id="service"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">All Services</option>
            {/* Map over fetched services here */}
            {/* <option value="service-id-1">Service Name 1</option> */}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Query History Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-white">History</h2>
        {loading && <p className="text-gray-400">Loading history...</p>}
        {error && <p className="text-red-500">Error loading history: {error}</p>}
        {!loading && !error && queries.length === 0 && (
          <p className="text-gray-400">No query history found.</p>
        )}
        {!loading && !error && queries.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Service
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Query Input
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Coins Spent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {queries.map((query) => (
                  <tr key={query.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {query.service_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {query.query_input}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {query.coins_spent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(query.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}