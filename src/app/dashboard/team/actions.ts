'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

const supabase = createServerActionClient<Database>({ cookies });

export async function createTeam(teamName: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return { success: false, message: 'User not authenticated' };
  }

  const userId = user.user.id;

  // Check if user is already in a team
  const { data: existingTeamMember, error: existingTeamMemberError } = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existingTeamMemberError && existingTeamMemberError.code !== 'PGRST116') { // PGRST116 is "no rows found"
    console.error('Error checking existing team membership:', existingTeamMemberError);
    return { success: false, message: 'Error checking existing team membership' };
  }

  if (existingTeamMember) {
    return { success: false, message: 'You are already in a team.' };
  }

  // Create the team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({ name: teamName, owner_id: userId })
    .select()
    .single();

  if (teamError || !team) {
    console.error('Error creating team:', teamError);
    return { success: false, message: teamError?.message || 'Error creating team' };
  }

  // Add the creating user as the team admin
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({ team_id: team.id, user_id: userId, role: 'admin' });

  if (memberError) {
    console.error('Error adding team owner as member:', memberError);
    // Consider rolling back team creation here if necessary
    return { success: false, message: memberError.message || 'Error adding team owner as member' };
  }

  revalidatePath('/dashboard/team');
  return { success: true, message: 'Team created successfully' };
}

export async function inviteTeamMember(teamId: string, invitedUsername: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching inviting user:', userError);
    return { success: false, message: 'User not authenticated' };
  }

  const inviterUserId = user.user.id;

  // Verify inviter is admin of the team
  const { data: inviterMember, error: inviterMemberError } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', inviterUserId)
    .single();

  if (inviterMemberError || !inviterMember || inviterMember.role !== 'admin') {
    console.error('Inviter is not an admin of this team or error fetching member:', inviterMemberError);
    return { success: false, message: 'You do not have permission to invite members to this team.' };
  }

  // Find the invited user's ID by username
  const { data: invitedProfile, error: invitedProfileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', invitedUsername)
    .single();

  if (invitedProfileError || !invitedProfile) {
    console.error('Error finding invited user:', invitedProfileError);
    return { success: false, message: 'User not found.' };
  }

  const invitedUserId = invitedProfile.id;

  // Check if invited user is already in a team
  const { data: existingTeamMember, error: existingTeamMemberError } = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', invitedUserId)
    .single();

  if (existingTeamMemberError && existingTeamMemberError.code !== 'PGRST116') {
    console.error('Error checking invited user\'s existing team membership:', existingTeamMemberError);
    return { success: false, message: 'Error checking invited user\'s team membership.' };
  }

  if (existingTeamMember) {
    return { success: false, message: `${invitedUsername} is already in a team.` };
  }

  // Check if an invite already exists
  const { data: existingInvite, error: existingInviteError } = await supabase
    .from('team_invites')
    .select('*')
    .eq('team_id', teamId)
    .eq('invited_user_id', invitedUserId)
    .in('status', ['pending', 'accepted']) // Consider 'accepted' to prevent re-inviting
    .single();

  if (existingInviteError && existingInviteError.code !== 'PGRST116') {
    console.error('Error checking existing invite:', existingInviteError);
    return { success: false, message: 'Error checking for existing invite.' };
  }

  if (existingInvite) {
    return { success: false, message: `${invitedUsername} has already been invited to this team.` };
  }

  // Create the invite
  const { error: inviteError } = await supabase
    .from('team_invites')
    .insert({ team_id: teamId, invited_user_id: invitedUserId, inviter_user_id: inviterUserId });

  if (inviteError) {
    console.error('Error creating team invite:', inviteError);
    return { success: false, message: inviteError.message || 'Error creating team invite' };
  }

  // TODO: Implement real-time notification for the invitee

  revalidatePath('/dashboard/team');
  return { success: true, message: `Invite sent to ${invitedUsername}` };
}

export async function fetchPendingInvites() {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user for invites:', userError);
    return [];
  }

  const { data: invites, error } = await supabase
    .from('team_invites')
    .select('*, teams(name), profiles!team_invites_inviter_user_id_fkey(username)')
    .eq('invited_user_id', user.user.id)
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching pending invites:', error);
    return [];
  }

  return invites || [];
}

export async function acceptTeamInvite(inviteId: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user for accepting invite:', userError);
    return { success: false, message: 'User not authenticated' };
  }

  const { error } = await supabase.rpc('accept_team_invite', { invite_id: inviteId, p_user_id: user.user.id });

  if (error) {
    console.error('Error accepting invite:', error);
    return { success: false, message: error.message || 'Error accepting invite' };
  }

  revalidatePath('/dashboard/team');
  return { success: true, message: 'Team invite accepted!' };
}

export async function rejectTeamInvite(inviteId: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user for rejecting invite:', userError);
    return { success: false, message: 'User not authenticated' };
  }

  const { error } = await supabase
    .from('team_invites')
    .update({ status: 'rejected' })
    .eq('id', inviteId)
    .eq('invited_user_id', user.user.id);

  if (error) {
    console.error('Error rejecting invite:', error);
    return { success: false, message: error.message || 'Error rejecting invite' };
  }

  revalidatePath('/dashboard/team');
  return { success: true, message: 'Team invite rejected.' };
}

export async function removeTeamMember(teamId: string, memberUserId: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching admin user for removal:', userError);
    return { success: false, message: 'User not authenticated' };
  }

  const adminUserId = user.user.id;

  // Verify admin has permission
  const { data: adminMember, error: adminMemberError } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', adminUserId)
    .single();

  if (adminMemberError || !adminMember || adminMember.role !== 'admin') {
    console.error('User attempting removal is not an admin or error fetching admin member:', adminMemberError);
    return { success: false, message: 'You do not have permission to remove members from this team.' };
  }

  // Prevent admin from removing themselves directly through this function
  if (adminUserId === memberUserId) {
    return { success: false, message: 'You cannot remove yourself from the team this way.' };
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', memberUserId);

  if (error) {
    console.error('Error removing team member:', error);
    return { success: false, message: error.message || 'Error removing team member' };
  }

  revalidatePath('/dashboard/team');
  return { success: true, message: 'Member removed successfully.' };
}

export async function setMemberSpendingLimit(teamId: string, memberUserId: string, limit: number | null) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching admin user for setting limit:', userError);
    return { success: false, message: 'User not authenticated' };
  }

  const adminUserId = user.user.id;

  // Verify admin has permission
  const { data: adminMember, error: adminMemberError } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', adminUserId)
    .single();

  if (adminMemberError || !adminMember || adminMember.role !== 'admin') {
    console.error('User attempting to set limit is not an admin or error fetching admin member:', adminMemberError);
    return { success: false, message: 'You do not have permission to set spending limits for this team.' };
  }

  const { error } = await supabase
    .from('team_members')
    .update({ spending_limit: limit })
    .eq('team_id', teamId)
    .eq('user_id', memberUserId);

  if (error) {
    console.error('Error setting member spending limit:', error);
    return { success: false, message: error.message || 'Error setting spending limit' };
  }

  revalidatePath('/dashboard/team');
  return { success: true, message: 'Spending limit updated successfully.' };
}

export async function leaveTeam(teamId: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user for leaving team:', userError);
    return { success: false, message: 'User not authenticated' };
  }

  const userId = user.user.id;

  // Check if the user is the team admin
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('owner_id')
    .eq('id', teamId)
    .single();

  if (teamError) {
    console.error('Error fetching team for leaving:', teamError);
    return { success: false, message: 'Error fetching team details.' };
  }

  if (team && team.owner_id === userId) {
    // Admin leaving the team - this requires a different flow, likely transferring ownership or disbanding
    return { success: false, message: 'Team admins cannot leave the team directly. Please transfer ownership or disband the team.' };
  }

  // Remove the user from the team_members table
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error leaving team:', error);
    return { success: false, message: error.message || 'Error leaving team' };
  }

  revalidatePath('/dashboard/team');
  return { success: true, message: 'Successfully left the team.' };
}