import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Temporarily disable Supabase middleware due to Edge Runtime __dirname issues
    // Authentication will be handled in individual pages and API routes
    
    // For now, just pass through all requests
    return NextResponse.next({ request })
    
    // TODO: Re-implement middleware once Supabase SSR package is Edge Runtime compatible
    // or find alternative authentication approach for middleware
    
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    /*
     * Temporarily disable middleware for most routes due to Edge Runtime issues
     * Only match very specific paths if needed
     */
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
