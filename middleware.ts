import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { PATH_DASHBOARD } from '@/routes';

import type { NextRequest } from 'next/server';

// Define which paths should use which auth system
const CLERK_PATHS = ['/auth/clerk'];

const NEXTAUTH_PATHS = [
  '/auth/signin',
  '/auth/signup',
  '/dashboard',
  '/api/protected',
  // Add other NextAuth-specific paths
];

// Static files and public paths that don't need authentication
const isStaticOrPublicPath = (pathname: string) => {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname === '/' ||
    pathname === '/favicon.ico' ||
    // Match static file extensions
    /\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot|webp|avif|pdf|txt|xml|json)$/i.test(
      pathname,
    )
  );
};

// Check if path should use Clerk
const shouldUseClerk = (pathname: string) => {
  return CLERK_PATHS.some((path) => pathname.startsWith(path));
};

// Check if path should use NextAuth
const shouldUseNextAuth = (pathname: string) => {
  return NEXTAUTH_PATHS.some((path) => pathname.startsWith(path));
};

// Create Clerk middleware instance
const clerkMiddleware = authMiddleware({
  publicRoutes: ['/', ...CLERK_PATHS.map((path) => `${path}/(.*)`)],
});

// NextAuth middleware logic
async function nextAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL(PATH_DASHBOARD.default, request.url));
  }

  // Redirect unauthenticated users to login page for protected routes
  if (!isAuthenticated && shouldUseNextAuth(pathname)) {
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication for static files and public paths
  if (isStaticOrPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Route to appropriate auth middleware
  if (shouldUseClerk(pathname)) {
    // Use Clerk middleware for Clerk-specific paths
    // @ts-ignore
    return clerkMiddleware(request);
  } else if (shouldUseNextAuth(pathname)) {
    // Use NextAuth middleware for NextAuth-specific paths
    return await nextAuthMiddleware(request);
  }

  // For paths that don't match either auth system, allow through
  // (you might want to redirect to a default auth system instead)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
