'use client';

import { useState, useEffect } from 'react';
import { getTransactionLog } from '@/src/app/dashboard/financial-log/actions';
import { Database } from '@/src/lib/database.types';

type Transaction = Database['public']['Tables']['transaction_log']['Row'];

export default function TransactionLogTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userId: '',
    teamId: '',
    type: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await getTransactionLog(filters);
    if (data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Financial Audit Log</h1>
          <p className="mt-2 text-sm text-gray-700">
            A detailed log of all ZeroCoin transactions on the platform.
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label htmlFor="userId" className="block text-sm font-medium leading-6 text-gray-900">
            User ID
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="userId"
              id="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="teamId" className="block text-sm font-medium leading-6 text-gray-900">
            Team ID
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="teamId"
              id="teamId"
              value={filters.teamId}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
            Transaction Type
          </label>
          <div className="mt-2">
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">All Types</option>
              <option value="BOUNTY_PLEDGE">Bounty Pledge</option>
              <option value="REFERRAL_BONUS">Referral Bonus</option>
              <option value="REFERRAL_AWARD">Referral Award</option>
              {/* Add other transaction types as needed */}
            </select>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="startDate" className="block text-sm font-medium leading-6 text-gray-900">
            Start Date
          </label>
          <div className="mt-2">
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="endDate" className="block text-sm font-medium leading-6 text-gray-900">
            End Date
          </label>
          <div className="mt-2">
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {loading ? (
              <p>Loading transactions...</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      User ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Team ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {transaction.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.user_id}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.team_id}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.type}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.amount}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}