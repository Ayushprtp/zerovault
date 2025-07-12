'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings() {
  const supabase = createClient();
  const { data, error } = await supabase.from('site_settings').select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    return [];
  }

  return data;
}

export async function updateSiteSetting(key: string, value: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .update({ value: value, updated_at: new Date().toISOString() })
    .eq('key', key);

  if (error) {
    console.error(`Error updating site setting ${key}:`, error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/settings/site');
  // Depending on how settings are used, you might need to revalidate more paths
  // revalidatePath('/');
  // revalidatePath('/shop');

  return { success: true, data };
}

// You might add more specific actions here based on the specific settings
// For example, updateAdminTelegramUsername, updateBonusAmount, etc.