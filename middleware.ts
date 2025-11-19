import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { PATH_DASHBOARD } from '@/routes';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Check if the path starts with these prefixes
  const isPublicPath =
    pathname.startsWith('/auth') ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/changelog') ||
    // Match static file extensions
    /\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot|webp|avif|pdf|txt|xml|json)$/i.test(
      pathname,
    );

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL(PATH_DASHBOARD.default, req.url));
  }

  // Redirect unauthenticated users to login page for protected routes
  if (!isAuthenticated && !isPublicPath) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('callbackUrl', encodeURI(req.url));
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
