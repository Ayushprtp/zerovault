'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';
import { v4 as uuidv4 } from 'uuid';

const supabase = createServerActionClient<Database>({ cookies });

// Action to create a single redeem code
export async function createSingleRedeemCode({
  amount,
  role,
  keep_existing_role,
  group_role,
  expires_at,
}: {
  amount?: number;
  role?: string;
  keep_existing_role?: boolean;
  group_role?: string;
  expires_at?: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (user as any).role !== 'admin') {
    return { success: false, message: 'Unauthorized' };
  }

  const code = uuidv4(); // Generate a unique code

  const { data, error } = await supabase.from('redeem_codes').insert([
    {
      code,
      amount,
      role,
      keep_existing_role,
      group_role,
      expires_at,
      created_by: user.id,
    },
  ]);

  if (error) {
    console.error('Error creating redeem code:', error);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Redeem code created successfully', code };
}

// Action to create bulk redeem codes
export async function createBulkRedeemCodes({
  count,
  amount,
  role,
  keep_existing_role,
  group_role,
  expires_at,
}: {
  count: number;
  amount?: number;
  role?: string;
  keep_existing_role?: boolean;
  group_role?: string;
  expires_at?: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (user as any).role !== 'admin') {
    return { success: false, message: 'Unauthorized' };
  }

  const codesToInsert = [];
  for (let i = 0; i < count; i++) {
    codesToInsert.push({
      code: uuidv4(),
      amount,
      role,
      keep_existing_role,
      group_role,
      expires_at,
      created_by: user.id,
    });
  }

  const { data, error } = await supabase.from('redeem_codes').insert(codesToInsert);

  if (error) {
    console.error('Error creating bulk redeem codes:', error);
    return { success: false, message: error.message };
  }

  return { success: true, message: `${count} redeem codes created successfully` };
}

// Action to fetch redeem codes
export async function fetchRedeemCodes() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (user as any).role !== 'admin') {
    return { data: [], error: 'Unauthorized' };
  }

  const { data, error } = await supabase.from('redeem_codes').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching redeem codes:', error);
    return { data: [], error: error.message };
  }

  return { data, error: null };
}

// Action to deactivate a redeem code
export async function deactivateRedeemCode(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (user as any).role !== 'admin') {
    return { success: false, message: 'Unauthorized' };
  }

  const { data, error } = await supabase.from('redeem_codes').update({ is_active: false }).eq('id', id);

  if (error) {
    console.error('Error deactivating redeem code:', error);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Redeem code deactivated successfully' };
}

// Action to log redeem code usage (This would typically be triggered by the redemption logic)
export async function logRedeemCodeUsage({ code_id, user_id }: { code_id: string; user_id: string }) {
  const { data, error } = await supabase.from('redeem_code_log').insert([{ code_id, user_id }]);

  if (error) {
    console.error('Error logging redeem code usage:', error);
  }

  return { error };
}