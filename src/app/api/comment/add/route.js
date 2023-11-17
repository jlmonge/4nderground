import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { UploadError } from '../../../../utils/errors';
import { ERR_NOT_LOGGED_IN } from '../../../../utils/constants';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('must login to comment');

    const formData = await req.formData();
    const comment = formData.get('comment');
    const trackId = formData.get('trackId');
    //console.log(trackId);
    const { data, error } = await supabase
        .from('comments')
        .insert([
            {
                comment: comment,
                track_id: trackId,
            }
        ])
        .select('id, comment, user_id, posted_at');

    if (error) throw new Error(JSON.stringify(error));
    //console.log(`you just posted a comment: ${JSON.stringify(data[0])}`);
    if (!data[0]) throw new Error("nothing returned tho");

    return NextResponse.json({
        commentObj: data[0],
    }, {
        status: 200
    });
}