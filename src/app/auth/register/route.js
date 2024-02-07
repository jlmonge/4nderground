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
            message: 'Account creation failed'
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
        console.log(`error: ${error}`)
        return NextResponse.json({
            message: 'Registration failed.',
            action: 'register',
        }, { status: 400 });
    }

    return NextResponse.json({
        message: 'Successfully registered, sending you to the player...',
        action: 'register',
    }, { status: 200 });
}