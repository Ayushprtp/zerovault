'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';

export async function getFinancialLog(filters?: { userId?: string; teamId?: string; type?: string; startDate?: string; endDate?: string }) {
  const supabase = createServerComponentClient<Database>({ cookies });

  let query = supabase
    .from('transaction_log')
    .select(`
      *,
      profiles ( username ),
      teams ( name )
    `);

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.teamId) {
    query = query.eq('team_id', filters.teamId);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching financial log:', error);
    return [];
  }

  return data;
}