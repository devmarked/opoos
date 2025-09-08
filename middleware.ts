import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware for API routes, static files, and auth pages
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // For now, just pass through all requests
  // Authentication will be handled at the page/component level
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Only match page routes, exclude API routes and static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)',
  ],
}
