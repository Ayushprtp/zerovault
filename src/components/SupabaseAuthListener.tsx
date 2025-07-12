'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/lib/SupabaseProvider';
import { useRouter } from 'next/navigation';

const SupabaseAuthListener: React.FC = () => {
  const supabase = useSupabase();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth Event:', event);
      console.log('Supabase Session:', session);
      console.log('Supabase User:', session?.user);

      if (event === 'SIGNED_IN') {
        console.log('--- User Signed In ---', { session, user: session?.user });        setTimeout(() => {
          router.push('/dashboard'); // Redirect to dashboard after a delay
        }, 100); // Add a small delay to allow router to be ready
      } else if (event === 'SIGNED_OUT') {
        router.push('/'); // Redirect to home page on sign out
        console.log('--- User Signed Out ---', { session, user: session?.user });
      }
    });

    return () => {
 authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  return null;
};

export default SupabaseAuthListener;