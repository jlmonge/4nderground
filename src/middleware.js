import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        res.cookies.delete(`sb-${process.env.SUPABASE_ID}-auth-token`);
        console.log('deleting cookie');
    }

    if (!session) {
        // Guests cannot upload
        if (req.nextUrl.pathname.startsWith('/upload')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
    // Unregistered users only only
    else {
        //Registered users cannot login, register, or reset password
        if (
            req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register') ||
            req.nextUrl.pathname.startsWith('/forgot-password')
        ) {
            return NextResponse.redirect(new URL('/player', req.url));
        }
    }
    return res;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};