'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';
import { revalidatePath } from 'next/cache';

const supabase = createServerActionClient<Database>({ cookies });

export async function fetchFeatureRequests() {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return [];
  }

  // Use RPC to get feature requests with user's vote status
  const { data, error } = await supabase.rpc('get_feature_requests_with_votes', { p_user_id: user.user.id });

  if (error) {
    console.error('Error fetching feature requests:', error);
    return [];
  }

  return data;
}

interface CreateFeatureRequestData {
  title: string;
  description: string;
}

export async function createFeatureRequest({ title, description }: CreateFeatureRequestData) {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return { success: false, message: 'User not authenticated.' };
  }

  const { error } = await supabase
    .from('feature_requests')
    .insert({ user_id: user.user.id, title, description });

  if (error) {
    console.error('Error creating feature request:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/dashboard/feature-requests');
  return { success: true, message: 'Feature request created successfully!' };
}

export async function voteFeatureRequest(request_id: number, vote_type: 1 | -1) {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return { success: false, message: 'User not authenticated.' };
  }

  const { data: existingVote, error: fetchError } = await supabase
    .from('feature_votes')
    .select('*')
    .eq('request_id', request_id)
    .eq('user_id', user.user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no row found
    console.error('Error fetching existing vote:', fetchError);
    return { success: false, message: fetchError.message };
  }

  if (existingVote) {
    // User has already voted
    if (existingVote.vote_type === vote_type) {
      // User clicked the same vote again, remove the vote
      const { error: deleteError } = await supabase
        .from('feature_votes')
        .delete()
        .eq('request_id', request_id)
        .eq('user_id', user.user.id);

      if (deleteError) {
        console.error('Error removing vote:', deleteError);
        return { success: false, message: deleteError.message };
      }
    } else {
      // User is changing their vote
      const { error: updateError } = await supabase
        .from('feature_votes')
        .update({ vote_type })
        .eq('request_id', request_id)
        .eq('user_id', user.user.id);

      if (updateError) {
        console.error('Error updating vote:', updateError);
        return { success: false, message: updateError.message };
      }
    }
  } else {
    // User is casting a new vote
    const { error: insertError } = await supabase
      .from('feature_votes')
      .insert({ request_id, user_id: user.user.id, vote_type });

    if (insertError) {
      console.error('Error casting vote:', insertError);
      return { success: false, message: insertError.message };
    }
  }

  revalidatePath('/dashboard/feature-requests');
  return { success: true, message: 'Vote updated successfully!' };
}

export async function pledgeBounty(request_id: number, amount: number) {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return { success: false, message: 'User not authenticated.' };
  }

  if (amount <= 0) {
    return { success: false, message: 'Bounty amount must be positive.' };
  }

  // Use RPC to handle the bounty pledge transaction
  const { error } = await supabase.rpc('pledge_bounty_to_feature', { p_request_id: request_id, p_user_id: user.user.id, p_amount: amount });

  if (error) {
    console.error('Error pledging bounty:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/dashboard/feature-requests');
  revalidatePath('/dashboard/financial-log'); // Also revalidate financial log
  return { success: true, message: 'Bounty pledged successfully!' };
}