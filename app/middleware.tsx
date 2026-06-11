import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = 'https://efzszombcfxyyobqehyp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmenN6b21iY2Z4eXlvYnFlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0NzIsImV4cCI6MjA5MzAyNjQ3Mn0.H4cYGfajHP8jkKGwoBLowna9joodOS5xvRzm8HBv3UU'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes — always accessible
  const publicPaths = ['/', '/register', '/login', '/forgot-password', '/reset-password', '/privacy', '/terms', '/Auth']
  if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Build Supabase client that reads cookies from the request
  let response = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in — send to login
  if (!user) {
    return NextResponse.redirect(new URL('/Auth', request.url))
  }

  // Fetch the user's role from the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role // 'admin' | 'supplier' | 'funder'

  // --- ROUTE PROTECTION ---

  // /admin/** — admin only
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      // Redirect suppliers and funders to their own dashboards
      const dest = role === 'funder' ? '/funder' : '/dashboard'
      return NextResponse.redirect(new URL(dest, request.url))
    }
  }

  // /funder/** — funders only
  if (pathname.startsWith('/funder')) {
    if (role !== 'funder' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // /dashboard/** — suppliers only
  if (pathname.startsWith('/dashboard')) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (role === 'funder') {
      return NextResponse.redirect(new URL('/funder', request.url))
    }
  }

  // /upload/** — suppliers only
  if (pathname.startsWith('/upload')) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
    if (role === 'funder') return NextResponse.redirect(new URL('/funder', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static, _next/image, favicon.ico, public files
     */
    '/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}