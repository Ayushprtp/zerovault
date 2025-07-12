import SupabaseListener from './supabase-listener';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export default async function Index() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 flex flex-col gap-20 items-center">
      <div className="animate-in flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex flex-col gap-6">
          <h2 className="text-4xl lg:text-5xl !leading-tight mx-auto max-w-xl text-center">
            The fastest way to build apps with <br className="hidden sm:block" />
            Supabase and Next.js
          </h2>
          <p className="text-center text-lg">
            ZeroVault is an exclusive, community-driven platform providing powerful data-retrieval services. It operates on a sophisticated internal economy using "ZeroCoins" and a flexible role-based access system.
          </p>
          <div className="flex justify-center items-center p-4">
            {/* Services Grid - Fetch and display services */}
            {/* Features Section - Highlight key platform features */}
            {/* Leaderboard - Dynamically display Top 10 Richest Teams */}
            <p>[ Placeholder for Homepage Content: Services Grid, Features, Leaderboard ]</p>
          </div>
        </main>
      </div>

      <footer className="flex flex-col gap-12 w-full max-w-4xl mx-auto px-6 py-12 text-sm text-center">
        {/* Footer Content */}
        <p>[ Placeholder for Footer Content ]</p>
      </footer>
    </div>
  );
}