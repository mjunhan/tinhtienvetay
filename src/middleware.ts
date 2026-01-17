import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect admin routes
 * Checks for Supabase auth session and redirects to login if not authenticated
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply to /admin routes (except /admin/login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        // Check for Supabase auth token in cookies
        const token = request.cookies.get('sb-access-token')?.value;
        const refreshToken = request.cookies.get('sb-refresh-token')?.value;

        // If no auth tokens found, redirect to login
        if (!token && !refreshToken) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // If tokens exist, allow access (Supabase will validate on the client)
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
