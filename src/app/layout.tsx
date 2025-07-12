import './globals.css';
import SupabaseProvider from '@/lib/SupabaseProvider';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import SupabaseAuthListener from '@/components/SupabaseAuthListener';

export const metadata = {
  title: 'ZeroVault',
  description: 'Exclusive data retrieval platform.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient<Database>({ cookies: () => cookies() });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <SupabaseProvider initialSession={session}>
          <SupabaseAuthListener />{children}
        </SupabaseProvider>
      </body>
    </html>
  );
}