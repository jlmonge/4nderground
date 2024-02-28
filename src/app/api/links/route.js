import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { varLog } from '../../../utils/helpers';
import { LINK_TEXT_CHARS_MAX, LINK_URL_CHARS_MAX } from '../../../utils/constants';

export async function POST(req) {
    const reqJson = await req.json();

    // Array is guaranteed to be sorted by position (pos).
    // Even if it wasn't, it looks like this would still work
    // ^ (confirm?)
    const oldLinks = Array.from(reqJson.oldLinks);
    const newLinks = Array.from(reqJson.newLinks);
    const userId = reqJson.userId;
    if (!userId) {
        return NextResponse.json({
            message: `Must be logged in.`
        }, { status: 400 });
    }

    let i = 0;

    let upsert = []
    while (i < newLinks.length) {
        const newPos = newLinks[i].pos, newUrl = newLinks[i].url, newText = newLinks[i].text;
        // TODO: define constant for # of links
        if (newPos > 3) {
            return NextResponse.json({
                message: `Must submit 3 or less links.`
            }, { status: 400 });
        }
        if (newUrl.length > LINK_URL_CHARS_MAX) {
            return NextResponse.json({
                message: `All link URLs must be ${LINK_URL_CHARS_MAX} characters or less.`
            }, { status: 400 });
        }

        if (newText.length > LINK_TEXT_CHARS_MAX) {
            return NextResponse.json({
                message: `All link texts must be ${LINK_TEXT_CHARS_MAX} characters or less.`
            }, { status: 400 });
        }
        upsert.push({
            user_id: userId,
            pos: newPos,
            url: newUrl,
            text: newText,
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