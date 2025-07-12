import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';
import FinancialLogTable from '@/src/components/admin/FinancialLogTable';

export default async function FinancialLogPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: transactions, error } = await supabase
    .from('transaction_log')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching financial log:', error);
    return <div>Error loading financial log.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Financial Audit Log</h1>
      <p className="mb-6">Detailed log of all ZeroCoin transactions.</p>
      {/* TODO: Add filtering and search controls */}
      <FinancialLogTable transactions={transactions || []} />
    </div>
  );
}