'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/src/lib/database.types';
import { cookies } from 'next/headers';

export async function giftCoinsToAllUsers(amount: number) {
  const supabase = createServerActionClient<Database>({ cookies });

  const { data: adminUser, error: adminError } = await supabase.auth.getUser();
  if (adminError || !adminUser || adminUser.user.user_metadata.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }

  try {
    // Fetch all user profiles
    const { data: users, error: fetchUsersError } = await supabase
      .from('profiles')
      .select('id, zero_coins');

    if (fetchUsersError) {
      throw new Error(`Error fetching users: ${fetchUsersError.message}`);
    }

    if (!users || users.length === 0) {
      console.log('No users found to gift coins to.');
      return;
    }

    // Prepare updates and transaction logs
    const updates = users.map(user => ({
      id: user.id,
      zero_coins: user.zero_coins + amount,
    }));

    const transactionLogs = users.map(user => ({
      user_id: user.id,
      type: 'GIFT',
      description: `Gifted ${amount} ZeroCoins by admin`,
      amount: amount,
    }));

    // Perform updates and insert transaction logs in a transaction (if Supabase supports it efficiently, otherwise batch)
    // For simplicity here, we'll perform updates and logs separately.
    // A more robust implementation might use a stored procedure or batching.

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(updates);

    if (updateError) {
      throw new Error(`Error updating user balances: ${updateError.message}`);
    }

    const { error: logError } = await supabase
      .from('transaction_log')
      .insert(transactionLogs);

    if (logError) {
      console.error('Error logging coin gifts:', logError.message);
      // Depending on severity, you might throw an error or just log
    }

  } catch (error: any) {
    console.error('Failed to gift coins:', error.message);
    throw new Error(`Failed to gift coins: ${error.message}`);
  }
}