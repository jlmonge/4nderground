import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

//investigate
export const dynamic = 'force-dynamic';

export async function POST(request) {
    const requestUrl = new URL(request.url);
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.log(`error: ${error}`)
        return NextResponse.json({
            message: 'Login failed.',
            action: 'login'
        }, { status: 400 });
    }
    console.log(`signInWithPassword data: ${JSON.stringify(data, null, 2)}`);
    console.log(`attempting to get user id: ${data.user.id}`);

    return NextResponse.json({
        message: 'Successfully logged in, sending you to the player...',
        action: 'login',
        user: data.user
    }, { status: 200 });
}