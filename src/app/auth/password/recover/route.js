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
        return NextResponse.redirect(
            `${reqUrl.origin}/recovery?error=Database error`,
            {
                status: 301,
            }
        );
    }

    return NextResponse.redirect(
        `${reqUrl.origin}/recovery?message=Check your email to reset password`,
        {
            status: 301,
        }
    );
}