'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getRoles() {
  const supabase = createClient();
  const { data, error } = await supabase.from('role_permissions').select('*');
  if (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
  return data;
}

export async function createRole(formData: { role: string; rpm_limit: number }) {
  const supabase = createClient();
  const { error } = await supabase.from('role_permissions').insert([formData]);
  if (error) {
    console.error('Error creating role:', error);
    return { error: error.message };
  }
  revalidatePath('/dashboard/roles');
  return { success: true };
}

export async function updateRole(id: string, formData: { role: string; rpm_limit: number }) {
  const supabase = createClient();
  const { error } = await supabase.from('role_permissions').update(formData).eq('role', id);
  if (error) {
    console.error('Error updating role:', error);
    return { error: error.message };
  }
  revalidatePath('/dashboard/roles');
  return { success: true };
}

export async function deleteRole(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('role_permissions').delete().eq('role', id);
  if (error) {
    console.error('Error deleting role:', error);
    return { error: error.message };
  }
  revalidatePath('/dashboard/roles');
  return { success: true };
}