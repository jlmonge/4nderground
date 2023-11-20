// This is only called when the user is logged in.

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const requestUrl = new URL(req.url);
    const formData = await req.formData();
    const newEmail = formData.get('new-email');
    console.log(`newEmail: ${newEmail}`);

    //const cookieStore = cookies();
    //const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    //const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    /*
    if (error) return NextResponse.redirect(
        `${requestUrl.origin}/settings?message=Email change failed`,
        {
            status: 301,
        }
    );
    */

    console.log(`from change email route, newEmail: ${newEmail}`);
    return NextResponse.redirect(
        //`${requestUrl.origin}/settings?message=Email changed successfully`,
        `${requestUrl.origin}/settings?message=email decoy`,
        {
            status: 301,
        }
    );
}