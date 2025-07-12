import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check for maintenance mode (assuming 'site_settings' table exists and has a 'maintenance_mode' key)
  const { data: maintenanceSetting, error: maintenanceError } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'maintenance_mode')
    .single();

  const isMaintenanceMode = maintenanceSetting?.value === 'true';

  // Allow access to maintenance page regardless of user or maintenance mode
  if (req.nextUrl.pathname === '/maintenance') {
    return res;
  }

  // Redirect all non-admin/dev users to maintenance page if maintenance mode is on
  if (isMaintenanceMode) {
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'admin' && profile?.role !== 'dev') {
        return NextResponse.redirect(new URL('/maintenance', req.url));
      }
    } else {
       return NextResponse.redirect(new URL('/maintenance', req.url));
    }
  }


  // Redirect authenticated users away from /login
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect unauthenticated users trying to access dashboard pages
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
     // Allow access to public pages like homepage, shop, docs, status
     const publicPaths = ['/', '/shop', '/docs', '/status'];
     if (!publicPaths.includes(req.nextUrl.pathname)) {
       return NextResponse.redirect(new URL('/login', req.url));
     }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any files in the public folder
     * - the auth callback path
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth/callback).*)',
    '/api/auth/callback', // Explicitly include the auth callback
    '/maintenance', // Explicitly include the maintenance page
  ],
}