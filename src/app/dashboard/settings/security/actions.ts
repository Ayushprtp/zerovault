'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/src/lib/database.types';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const supabase = createServerActionClient<Database>({ cookies });

export async function getSecuritySettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['max_support_tickets_per_hour']);

  if (error) {
    console.error('Error fetching security settings:', error);
    return null;
  }

  // Convert the array of objects to a key-value pair object
  const settings: { [key: string]: string } = {};
  data.forEach((setting) => {
    settings[setting.key] = setting.value || '';
  });

  return settings;
}

export async function updateSecuritySettings(formData: FormData) {
  const maxSupportTicketsPerHour = formData.get('max_support_tickets_per_hour') as string;

  // Basic validation (can be enhanced)
  if (maxSupportTicketsPerHour === null || isNaN(parseInt(maxSupportTicketsPerHour))) {
    return { error: 'Invalid value for Max Support Tickets Per Hour' };
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert([
      { key: 'max_support_tickets_per_hour', value: maxSupportTicketsPerHour },
    ]);

  if (error) {
    console.error('Error updating security settings:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/settings/security');
  return { success: true };
}