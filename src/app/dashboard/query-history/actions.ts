'use server';

import { createClient } from '@/utils/supabase/server';
import { D1Database } from '@cloudflare/workers-types'; // Assuming you have Cloudflare Workers types installed

interface QueryLogEntry {
  id: string;
  user_id: string;
  service_id: string;
  service_name: string;
  query_input: string | null;
  query_response: string | null;
  coins_spent: number;
  is_team_query: boolean | null;
  team_id: string | null;
  timestamp: string;
}

// Assume you have a way to access your D1 database instance in a server action
// This might involve binding the D1 database in your Cloudflare Worker or Adapter
// For demonstration purposes, we'll assume a global or imported d1 binding
declare const D1: D1Database; // Replace with your actual D1 binding name

export async function fetchQueryHistory(): Promise<QueryLogEntry[] | null> {
  const supabase = createClient();
  const { data: user, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Authentication error:', authError);
    return null;
  }

  try {
    // Assuming 'D1' is your bound D1 database instance
    const { results } = await D1.prepare(
      'SELECT * FROM query_log WHERE user_id = ? ORDER BY timestamp DESC'
    )
      .bind(user.id)
      .all();

    return results as QueryLogEntry[];
  } catch (error) {
    console.error('Error fetching query history:', error);
    return null;
  }
}

interface FilterOptions {
  keyword?: string;
  serviceId?: string;
  startDate?: string;
  endDate?: string;
}

export async function searchQueryHistory(
  filters: FilterOptions
): Promise<QueryLogEntry[] | null> {
  const supabase = createClient();
  const { data: user, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Authentication error:', authError);
    return null;
  }

  let query = 'SELECT * FROM query_log WHERE user_id = ?';
  const params: (string | number)[] = [user.id];

  if (filters.keyword) {
    query += ' AND (query_input LIKE ? OR query_response LIKE ?)';
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
  }

  if (filters.serviceId) {
    query += ' AND service_id = ?';
    params.push(filters.serviceId);
  }

  if (filters.startDate) {
    query += ' AND timestamp >= ?';
    // Ensure date format matches your D1 timestamp storage format
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    query += ' AND timestamp <= ?';
    // Ensure date format matches your D1 timestamp storage format
    params.push(filters.endDate);
  }

  query += ' ORDER BY timestamp DESC';

  try {
    // Assuming 'D1' is your bound D1 database instance
    const { results } = await D1.prepare(query).bind(...params).all();

    return results as QueryLogEntry[];
  } catch (error) {
    console.error('Error searching query history:', error);
    return null;
  }
}