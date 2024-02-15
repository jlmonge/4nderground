// This is only called when the user is logged in.

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const requestUrl = new URL(req.url);
    const formData = await req.formData();
    const newEmail = formData.get('email');
    console.log(`newEmail: ${newEmail}`);

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
        console.log(`error: ${error}`);
        return NextResponse.json({
            message: 'Email change failed.',
            action: 'email-update'
        }, { status: 400 });
    }

    console.log(`from change email route, here's the new data: ${data}`);
    return NextResponse.redirect(
        //`${requestUrl.origin}/settings?message=Email changed successfully`,
        `${requestUrl.origin}/update-email-waiting-room?message=Your email change will complete once both emails have confirmed the change.`,
        {
            status: 301,
        }
    );
}