import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const { pathname } = request.nextUrl;

  // If maintenance mode is ON
  if (isMaintenanceMode) {
    // Redirect all requests except for /maintenance, static files, and API routes (if needed)
    if (
      !pathname.startsWith('/maintenance') &&
      !pathname.startsWith('/_next') &&
      !pathname.includes('.') && // static files like icons, images
      pathname !== '/favicon.ico'
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.redirect(url);
    }
  } else {
    // If maintenance mode is OFF, and user tries to access /maintenance page
    if (pathname.startsWith('/maintenance')) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
