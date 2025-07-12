"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

import type { Database } from "@/lib/database.types";

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}