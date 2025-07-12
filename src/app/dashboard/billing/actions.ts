'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export async function fetchBillingHistory() {
  const supabase = createServerActionClient<Database>({ cookies });

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return { data: null, error: 'Error fetching user.' };
  }

  const { data: transactions, error: transactionError } = await supabase
    .from('transaction_log')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  if (transactionError) {
    console.error('Error fetching transaction history:', transactionError);
    return { data: null, error: 'Error fetching transaction history.' };
  }

  return { data: transactions, error: null };
}