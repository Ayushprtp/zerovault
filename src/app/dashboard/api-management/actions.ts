'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Service } from '@/src/lib/database.types';

const supabase = createClient(cookies());

export async function fetchServicesForApiManagement(): Promise<Service[] | null> {
  const { data, error } = await supabase.from('services').select('*');

  if (error) {
    console.error('Error fetching services for API management:', error);
    return null;
  }

  return data;
}

export async function updateServiceApiStatus(serviceId: string, isApiActive: boolean) {
  const { error } = await supabase
    .from('services')
    .update({ is_api_active: isApiActive })
    .eq('id', serviceId);

  if (error) {
    console.error('Error updating service API status:', error);
    // Handle error appropriately, maybe return an error status
  }

  // Optionally revalidate path or redirect if needed
  // revalidatePath('/dashboard/api-management');
}

// You might add other actions here for managing API specific settings if needed