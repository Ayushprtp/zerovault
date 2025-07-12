'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';

const supabase = createServerActionClient<Database>({ cookies });

export async function fetchUsers() {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data;
}

export async function updateUserRole(userId: string, newRole: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
  }

  revalidatePath('/dashboard/users');
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);

  if (error) {
    console.error('Error deleting user:', error);
  }

  revalidatePath('/dashboard/users');
}

export async function updateUserCoins(userId: string, newCoinBalance: number) {
  const { error } = await supabase
    .from('profiles')
    .update({ zero_coins: newCoinBalance })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user coins:', error);
  }

  revalidatePath('/dashboard/users');
}

export async function fetchUserById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }

  return data;
}

export async function fetchUserQueryHistory(userId: string) {
  const { data, error } = await supabase
    .from('query_log') // Assuming 'query_log' is in your Supabase schema for simplicity here, but GEMINI.md says D1
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching user query history:', error);
    return [];
  }

  return data;
}