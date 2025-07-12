'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export async function createService(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not logged in for creating service');
    return { error: 'User not authenticated' };
  }

  // Basic role check - enhance with more granular permission logic if needed
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || (profile?.role !== 'admin' && profile?.role !== 'dev')) {
    console.error('Unauthorized attempt to create service', profileError);
    return { error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string;
  const api_url = formData.get('api_url') as string;
  const cost_per_query = parseInt(formData.get('cost_per_query') as string);
  const is_active = formData.get('is_active') === 'true';
  const is_beta = formData.get('is_beta') === 'true';
  const api_cost = parseInt(formData.get('api_cost') as string);
  const is_api_active = formData.get('is_api_active') === 'true';


  const { data, error } = await supabase.from('services').insert([
    { name, description, thumbnail_url, api_url, cost_per_query, is_active, is_beta, api_cost, is_api_active },
  ]);

  if (error) {
    console.error('Error creating service:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/services');
  return { success: true };
}

export async function updateService(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not logged in for updating service');
    return { error: 'User not authenticated' };
  }

  // Basic role check - enhance with more granular permission logic if needed
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || (profile?.role !== 'admin' && profile?.role !== 'dev')) {
    console.error('Unauthorized attempt to update service', profileError);
    return { error: 'Unauthorized' };
  }

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string;
  const api_url = formData.get('api_url') as string;
  const cost_per_query = parseInt(formData.get('cost_per_query') as string);
  const is_active = formData.get('is_active') === 'true';
  const is_beta = formData.get('is_beta') === 'true';
  const api_cost = parseInt(formData.get('api_cost') as string);
  const is_api_active = formData.get('is_api_active') === 'true';

  const { data, error } = await supabase
    .from('services')
    .update({ name, description, thumbnail_url, api_url, cost_per_query, is_active, is_beta, api_cost, is_api_active })
    .eq('id', id);

  if (error) {
    console.error('Error updating service:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/services');
  return { success: true };
}

export async function deleteService(id: string) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not logged in for deleting service');
    return { error: 'User not authenticated' };
  }

  // Basic role check - enhance with more granular permission logic if needed
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || (profile?.role !== 'admin' && profile?.role !== 'dev')) {
    console.error('Unauthorized attempt to delete service', profileError);
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase.from('services').delete().eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/services');
  return { success: true };
}