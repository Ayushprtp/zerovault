import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

// Server action to fetch transaction history
async function getUserTransactions() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('transaction_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data;
}

export default async function BillingPage() {
  const transactions = await getUserTransactions();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Billing History</h1>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{transaction.type}</td>
                  <td className="px-4 py-2 border-b">
                    {transaction.description}
                  </td>
                  <td
                    className={`px-4 py-2 border-b ${
                      (transaction.amount ?? 0) > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.amount ?? 0}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {transaction.created_at
                      ? format(
                          new Date(transaction.created_at),
                          'yyyy-MM-dd HH:mm'
                        )
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}