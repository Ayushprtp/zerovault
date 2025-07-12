import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SignOutButton from '@/src/components/SignOutButton';
import ServiceCard from '@/components/ShopCard'; // Assuming ShopCard can be reused for service display
import { Database } from '@/lib/database.types';

export default async function Index() {
  const supabase = createServerComponentClient<Database>({ cookies: () => cookies() });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch enabled services
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true);

  // Fetch top 10 teams by zero_coin_balance
  const { data: topTeams, error: teamsError } = await supabase
    .from('teams')
    .select('id, name, zero_coin_balance')
    .order('zero_coin_balance', { ascending: false })
    .limit(10);

  if (servicesError) console.error('Error fetching services:', servicesError);
  if (teamsError) console.error('Error fetching top teams:', teamsError);

  return (
    <div className="flex-1 flex flex-col gap-20 items-center">
      {/* Header/Navigation Area */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <Link href="/">ZeroVault</Link> {/* Your logo or site title */}
          {user ? (
            <SignOutButton />
          ) : (
            <Link href="/login">Sign In</Link>
          )}
        </div>
      </nav>
      <div className="animate-in flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex flex-col gap-6">
          <h1 className="text-4xl lg:text-5xl !leading-tight mx-auto max-w-xl text-center">
            The fastest way to build apps with <br className="hidden sm:block" />            Supabase and Next.js

          <p className="text-center text-lg">
            ZeroVault is an exclusive, community-driven platform providing powerful data-retrieval services. It operates on a sophisticated internal economy using "ZeroCoins" and a flexible role-based access system.
          </p>
          <div className="flex justify-center items-center p-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Services Grid */}
              <div className="col-span-full">
                <h3 className="text-2xl font-bold text-center mb-4">Our Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services && services.map(service => (
                    // Reusing ShopCard for display - adjust if a different component is needed
                    <ServiceCard key={service.id} service={service} />
                  ))}
                  {!services || services.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">No services available at the moment.</p>
                  )}
                </div>
              </div>

              {/* Features Section */}
              <div className="col-span-full">
                <h3 className="text-2xl font-bold text-center mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h4 className="font-semibold mb-2">Internal Economy (ZeroCoins)</h4>
                    <p className="text-sm text-muted-foreground">Utilize ZeroCoins for platform services and transactions.</p>
                  </div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h4 className="font-semibold mb-2">Role-Based Access</h4>
                    <p className="text-sm text-muted-foreground">Flexible permissions based on user roles (Admin, Dev, User, etc.).</p>
                  </div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h4 className="font-semibold mb-2">Team Functionality</h4>
                    <p className="text-sm text-muted-foreground">Create and manage teams for collaborative access and shared resources.</p>
                  </div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h4 className="font-semibold mb-2">Support & Feature Requests</h4>
                    <p className="text-sm text-muted-foreground">Integrated system for support tickets and suggesting new features.</p>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="col-span-full">
                <h3 className="text-2xl font-bold text-center mb-4">Top 10 Richest Teams</h3>
                <ul className="space-y-2 text-center">
                  {topTeams && topTeams.map((team, index) => (
                    <li key={team.id} className="text-lg">{index + 1}. {team.name}: {team.zero_coin_balance} ZeroCoins</li>
                  ))}
                </ul>
              </div>
            </div>
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