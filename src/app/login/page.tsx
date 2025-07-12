'use client'

import { Auth } from '@supabase/auth-ui-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { ThemeMinimal } from '@supabase/auth-ui-shared'

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!username) {
      setError('Username is required.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Handle successful signup (e.g., show a success message, redirect)
      // The handle_new_user trigger should take care of creating the profile
      console.log('Signup successful, user created:', data.user);
      // Optionally, show a message to check their email for confirmation
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Welcome to ZeroVault
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {isLoginView ? 'Sign in to your account.' : 'Create a new account to get started.'}
        </p>

        {isLoginView ? (
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
          />
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-sm text-primary hover:text-primary-dark"
          >
            {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>

        {/* You can still include the Auth component for other providers if you want */}
        {/* <div className="mt-6">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeMinimal }}
            providers={['github']} // Add other providers like google, twitter, etc.
            redirectTo={redirectTo}
            view="sign_in" // Only show the sign in view if you want to separate
          />
        </div> */}
      </div>
    </div>
  );
}
