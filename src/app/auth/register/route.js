import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/*
export async function GET(request) {
    const requestUrl = new URL(request.url)
};
*/
export async function POST(request) {
    const requestUrl = new URL(request.url);
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const agreement = formData.get('agreement');
    // 'agreement' returns "on" or null; null is falsy!
    if (!agreement) {
        return NextResponse.json({
            message: 'You must agree to the terms to sign up.'
        }, { status: 400 });
    }
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${requestUrl.origin}/auth/callback`,
        },
    });

    if (error) {
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
        return NextResponse.json({
            message: 'Registration failed.',
            action: 'register',
        }, { status: 400 });
    }

    return NextResponse.json({
        message: 'Check your email to complete registration.',
        action: 'register',
    }, { status: 200 });
}