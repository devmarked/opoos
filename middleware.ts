import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Temporarily disable Supabase middleware to fix __dirname error
  // Authentication will be handled in individual API routes and pages
  
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    /*
     * Temporarily disable middleware for all routes to fix __dirname error
     * Authentication will be handled in individual pages and API routes
     */
    // '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
