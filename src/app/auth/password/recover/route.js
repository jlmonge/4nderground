import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const reqUrl = new URL(req.url);
    const formData = await req.formData();
    const email = formData.get('email');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    console.log(`sent link, see data: ${JSON.stringify(data)}`);
    if (error) {
        console.log(`error: ${error}`)
        return NextResponse.json({
            message: 'Recovery request failed.',
            action: 'recover'
        }, { status: 400 });
    }

    return NextResponse.json({
        message: 'Password recovery link sent, check your email.',
        action: 'recover',
    }, { status: 200 });
}