'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';
import { Database } from '@/src/lib/database.types';
import { v4 as uuidv4 } from 'uuid';

type Service = Database['public']['Tables']['services']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type QueryLog = Database['query_log']['Row']; // Assuming Cloudflare D1 types are separate

interface QueryResult {
  output: string;
  coinsSpent: number;
}

export async function processQuery(
  serviceId: string,
  serviceName: string,
  query: string,
  fundingSource: 'personal' | 'team',
  teamId: string | null
): Promise<QueryResult | { error: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return { error: 'User not authenticated.' };
  }
  const userId = userData.user.id;

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('zero_coins, role')
    .eq('id', userId)
    .single();
  if (profileError || !profileData) {
    return { error: 'Could not fetch user profile.' };
  }

  const { data: serviceData, error: serviceError } = await supabase
    .from('services')
    .select('cost_per_query, api_url, api_cost, is_active, is_api_active')
    .eq('id', serviceId)
    .single();
  if (serviceError || !serviceData || !serviceData.is_active) {
    return { error: 'Service not found or is inactive.' };
  }

  // Check for excluded terms (Admin Exclusion List)
  const { data: excludedTerms, error: excludedError } = await supabase
    .from('excluded_terms')
    .select('term');

  if (excludedError) {
    console.error('Error fetching excluded terms:', excludedError);
    // Continue without exclusion check if there's a database error
  } else {
    const lowerCaseQuery = query.toLowerCase();
    const isExcluded = excludedTerms?.some(excluded => lowerCaseQuery.includes(excluded.term.toLowerCase()));

    if (isExcluded) {
      // Log the excluded query attempt (optional but good for monitoring)
      await logQuery({
        id: uuidv4(),
        user_id: userId,
        service_id: serviceId,
        service_name: serviceName,
        query_input: query,
        query_response: "Attempted to query excluded term.",
        coins_spent: 0, // No coins spent
        is_team_query: fundingSource === 'team',
        team_id: teamId,
        timestamp: new Date().toISOString(),
      });
      return { output: "Srsly.?Are U Kidding Me Kid .", coinsSpent: 0 };
    }
  }


  const cost = serviceData.cost_per_query;
  let teamData: Team | null = null;

  if (fundingSource === 'team') {
    if (!teamId) {
      return { error: 'Team not specified for team funding.' };
    }
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('zero_coin_balance')
      .eq('id', teamId)
      .single();
    if (teamError || !team) {
      return { error: 'Could not fetch team data.' };
    }
    teamData = team;

    if (teamData.zero_coin_balance < cost) {
      return { error: 'Insufficient team ZeroCoin balance.' };
    }
  } else {
    if (profileData.zero_coins < cost) {
      return { error: 'Insufficient personal ZeroCoin balance.' };
    }
  }

  // --- Process Query (Simulated External API Call) ---
  let queryResponse = 'Simulated response for: ' + query;
  let apiCost = 0;

  // In a real application, you would make an external API call here
  // using serviceData.api_url and handling serviceData.is_api_active and serviceData.api_cost
  // Example:
  // if (serviceData.is_api_active && serviceData.api_url) {
  //   try {
  //     const apiResult = await fetch(serviceData.api_url, {
  //       method: 'POST', // Or GET, depending on the API
  //       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}` }, // Use environment variable for API key
  //       body: JSON.stringify({ query: query }),
  //     });
  //     const apiData = await apiResult.json();
  //     queryResponse = JSON.stringify(apiData); // Store the raw API response or a processed version
  //     apiCost = serviceData.api_cost || 0; // Use the defined API cost
  //   } catch (apiError) {
  //     console.error("External API Error:", apiError);
  //     // Decide how to handle API errors - could return an error to the user or a default response
  //     return { error: 'Error processing query with external API.' };
  //   }
  // }
  // --- End Simulated External API Call ---


  // --- Deduct Coins and Log Transaction ---
  const { error: transactionError } = await supabase.rpc('perform_query_transaction', {
    p_user_id: userId,
    p_team_id: fundingSource === 'team' ? teamId : null,
    p_cost: cost,
    p_service_name: serviceName,
  });

  if (transactionError) {
    console.error('Transaction Error:', transactionError);
    // Depending on the error, you might need to rollback the API call or handle it differently
    return { error: 'Error processing payment.' };
  }
  // --- End Deduct Coins and Log Transaction ---

  // --- Log Query Result to Cloudflare D1 ---
  // This part needs to interact with your Cloudflare D1 binding
  // The exact implementation will depend on how you set up D1 bindings in your Next.js project
  // Example (conceptual):
  // try {
  //   const d1Log: QueryLog = {
  //     id: uuidv4(),
  //     user_id: userId,
  //     service_id: serviceId,
  //     service_name: serviceName,
  //     query_input: query,
  //     query_response: queryResponse,
  //     coins_spent: cost,
  //     is_team_query: fundingSource === 'team',
  //     team_id: teamId,
  //     timestamp: new Date().toISOString(),
  //   };
  //   // Assuming you have a D1 binding named 'D1_DATABASE'
  //   // await env.D1_DATABASE.prepare('INSERT INTO query_log (...) VALUES (...)').bind(...).run();
  //   console.log("Query logged to D1:", d1Log);
  // } catch (d1Error) {
  //   console.error("Error logging query to D1:", d1Error);
  //   // Decide if a D1 logging error should fail the user query
  // }
  // --- End Log Query Result to Cloudflare D1 ---

  return { output: queryResponse, coinsSpent: cost };
}


// Helper function to log queries to Cloudflare D1
// This needs to be properly implemented based on your D1 binding setup
async function logQuery(logEntry: QueryLog): Promise<void> {
  // Example (conceptual):
  // try {
  //   // Assuming you have a D1 binding named 'D1_DATABASE'
  //   // await env.D1_DATABASE.prepare('INSERT INTO query_log (...) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  //   //   .bind(
  //   //     logEntry.id,
  //   //     logEntry.user_id,
  //   //     logEntry.service_id,
  //   //     logEntry.service_name,
  //   //     logEntry.query_input,
  //   //     logEntry.query_response,
  //   //     logEntry.coins_spent,
  //   //     logEntry.is_team_query,
  //   //     logEntry.team_id,
  //   //     logEntry.timestamp
  //   //   )
  //   //   .run();
  //   console.log("Query logged to D1:", logEntry);
  // } catch (d1Error) {
  //   console.error("Error logging query to D1:", d1Error);
  //   // Handle D1 logging errors
  // }
  // Placeholder for now:
  console.log("Attempted to log query to D1:", logEntry);
}


// You will also need a Supabase RPC function 'perform_query_transaction'
// This function should handle deducting coins from either the user's personal balance
// or the team's balance, and logging the transaction to the transaction_log table.
// Example RPC (to be added to your Supabase schema):
/*
CREATE OR REPLACE FUNCTION perform_query_transaction(
    p_user_id UUID,
    p_team_id UUID,
    p_cost BIGINT,
    p_service_name TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_balance BIGINT;
    team_balance BIGINT;
BEGIN
    IF p_team_id IS NOT NULL THEN
        -- Deduct from team balance
        UPDATE public.teams
        SET zero_coin_balance = zero_coin_balance - p_cost
        WHERE id = p_team_id
        RETURNING zero_coin_balance INTO team_balance;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Team with ID % not found.', p_team_id;
        END IF;

        -- Log team transaction
        INSERT INTO public.transaction_log(user_id, team_id, type, description, amount)
        VALUES (p_user_id, p_team_id, 'SERVICE_QUERY', 'Query for service: ' || p_service_name || ' (Team)', p_cost * -1);
    ELSE
        -- Deduct from user balance
        UPDATE public.profiles
        SET zero_coins = zero_coins - p_cost
        WHERE id = p_user_id
        RETURNING zero_coins INTO user_balance;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'User with ID % not found.', p_user_id;
        END IF;

        -- Log personal transaction
        INSERT INTO public.transaction_log(user_id, type, description, amount)
        VALUES (p_user_id, 'SERVICE_QUERY', 'Query for service: ' || p_service_name || ' (Personal)', p_cost * -1);
    END IF;

    -- Note: The actual API call should happen *before* this transaction function
    -- to ensure you don't deduct coins for failed API calls.
    -- Error handling would be needed to potentially refund coins if the API call fails *after* deduction.

EXCEPTION
    WHEN insufficient_funds THEN
        RAISE EXCEPTION 'Insufficient funds for query.';
    WHEN OTHERS THEN
        RAISE;
END;
$$;
*/


export async function getServiceQueryHistory(serviceId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return { error: 'User not authenticated.' };
  }
  const userId = userData.user.id;

  // This function needs to query your Cloudflare D1 database for query logs
  // The implementation will depend on your D1 binding setup
  // Example (conceptual):
  // try {
  //   // Assuming you have a D1 binding named 'D1_DATABASE'
  //   // const { results } = await env.D1_DATABASE.prepare('SELECT * FROM query_log WHERE user_id = ? AND service_id = ? ORDER BY timestamp DESC')
  //   //   .bind(userId, serviceId)
  //   //   .all();
  //   // return { data: results, error: null };
  //   console.log("Fetching query history for user:", userId, " and service:", serviceId);
     return { data: [], error: "Fetching query history from D1 is not yet implemented." }; // Placeholder
  // } catch (d1Error) {
  //   console.error("Error fetching query history from D1:", d1Error);
  //   return { data: null, error: 'Error fetching query history.' };
  // }
}

export async function getUserTeams() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return { data: null, error: 'User not authenticated.' };
  }
  const userId = userData.user.id;

  const { data: teams, error } = await supabase
    .from('team_members')
    .select('team:teams(id, name, zero_coin_balance)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user teams:', error);
    return { data: null, error: 'Error fetching user teams.' };
  }

  // Map the nested team data
  const userTeams = teams.map(member => member.team).filter(team => team !== null) as Team[];

  return { data: userTeams, error: null };
}