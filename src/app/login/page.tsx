'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from '@supabase/auth-ui-react';
import { useSearchParams } from 'next/navigation';
import { ThemeMinimal } from '@supabase/auth-ui-shared';

export default function LoginPage() {
  const supabase = createClientComponentClient();

  const searchParams = useSearchParams();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Welcome to ZeroVault
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in to your account.
        </p>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeMinimal,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          providers={['github']}
          redirectTo={redirectTo}
          view="sign_in" // Explicitly set view to sign_in
        />
      </div>
    </div>
  );
}
