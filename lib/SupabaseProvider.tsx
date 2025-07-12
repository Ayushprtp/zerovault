// Function to clear session related data from local storage (if any was stored)
export const clearSessionData = () => {
  // If active_session_id was stored in local storage, remove it here
  // localStorage.removeItem('active_session_id');
  // Add any other session-related data stored in local storage to remove
};

// Example of a function that might have previously checked for active session ID
// This function should be removed or refactored to not use active_session_id
/*
export const checkActiveSession = async (userId: string, currentSessionId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('active_session_id')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching active session ID:', error);
    return false;
  }

  if (!data || data.active_session_id !== currentSessionId) {
    // Session is not the active one, invalidate it
    return false;
  }

  return true;
};
*/

// Example of how session invalidation logic might have been handled
// This logic should be removed or refactored
/*
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    const currentSessionId = session.id; // Assuming session object has an id
    // Potentially set active_session_id in local storage or database here
    // setActiveSessionId(session.user.id, currentSessionId);
  } else if (event === 'SIGNED_OUT') {
    // Potentially clear active_session_id from local storage or database here
    // clearActiveSessionId(session.user.id);
  }
});
*/

// Any other functions or logic that explicitly interact with `active_session_id` for
// session management or validation should be removed or modified.