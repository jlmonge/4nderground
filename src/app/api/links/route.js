import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { varLog } from '../../../utils/helpers';

export async function POST(req) {
    const reqJson = await req.json();

    // Array is guaranteed to be sorted by position (pos).
    // Even if it wasn't, it looks like this would still work
    // ^ (confirm?)
    const oldLinks = Array.from(reqJson.oldLinks);
    const newLinks = Array.from(reqJson.newLinks);
    const userId = reqJson.userId
    let i = 0;

    // Create the array to be upserted.
    let upsert = []
    while (i < newLinks.length) {
        upsert.push({
            user_id: userId,
            pos: newLinks[i].pos,
            url: newLinks[i].url,
            text: newLinks[i].text,
        });
        i++;
    }
    while (i < oldLinks.length) {
        upsert.push({
            user_id: userId,
            pos: oldLinks[i].pos,
            url: '',
            text: '',
        });
        i++;
    }
    varLog({ upsert });

    const maxNLPos = newLinks[newLinks.length - 1]?.pos

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.from('links').upsert(upsert).select();

    console.log(`data: ${data}`);
    if (error) {
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
        return NextResponse.json({
            message: 'Failed to save your changes to the database.'
        }, { status: 400 });
    }
    return NextResponse.json({
        message: 'Changes saved.'
    }, { status: 200 });
}