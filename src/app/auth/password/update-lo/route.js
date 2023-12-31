// TODO: change route name to something more relevant
// THIS IS FOR CHANGING PASS AS LOGGED OUT USER

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const reqUrl = new URL(req.url);
    const formData = await req.formData();
    const password = formData.get('password');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.auth.updateUser({
        password: password
    });
    console.log(`changed password, see data: ${JSON.stringify(data)}`);
    if (error) {
        return NextResponse.redirect(
            `${reqUrl.origin}/login?error=Password not changed, database error`,
            {
                status: 301,
            }
        );
    }

    return NextResponse.redirect(
        `${reqUrl.origin}/login?message=Password changed, try logging in`,
        {
            status: 301,
        }
    );
}