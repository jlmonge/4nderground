import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const requestUrl = new URL(request.url);
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log(`error: ${error}`)
        return NextResponse.json({
            message: 'Failed to log out.'
        }, { status: 400 });
    }

    return NextResponse.json({
        message: 'Logged out.'
    }, { status: 200 });
}