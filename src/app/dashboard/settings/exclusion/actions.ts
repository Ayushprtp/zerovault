'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';
import { revalidatePath } from 'next/cache';

const supabase = createServerComponentClient<Database>({ cookies });

export async function getExcludedTerms() {
  const { data, error } = await supabase
    .from('excluded_terms')
    .select('term');

  if (error) {
    console.error('Error fetching excluded terms:', error);
    return [];
  }

  return data.map(row => row.term);
}

export async function addExcludedTerm(term: string) {
  if (!term) return;

  const { error } = await supabase
    .from('excluded_terms')
    .insert({ term: term.toLowerCase().trim() });

  if (error) {
    console.error('Error adding excluded term:', error);
    // Handle specific errors like duplicates if needed
  }

  revalidatePath('/dashboard/settings/exclusion');
}

export async function removeExcludedTerm(term: string) {
  if (!term) return;

  const { error } = await supabase
    .from('excluded_terms')
    .delete()
    .eq('term', term.toLowerCase().trim());

  if (error) {
    console.error('Error removing excluded term:', error);
  }

  revalidatePath('/dashboard/settings/exclusion');
}