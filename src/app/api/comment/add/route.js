import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { UploadError } from '../../../../utils/errors';
import { COMMENT_CHARS_MAX, ERR_NOT_LOGGED_IN } from '../../../../utils/constants';
import { NextResponse } from 'next/server';
import { getMinAgo } from '../../../../utils/helpers';

export async function POST(req) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Must login to comment.');

    const formData = await req.formData();
    const comment = formData.get('comment');
    const trackId = formData.get('trackId');

    if (comment.length > COMMENT_CHARS_MAX) {
        return NextResponse.json({
            message: `Comments are limited to ${COMMENT_CHARS_MAX} characters.`
        }, { status: 400 });
    }

    const { data: userCommentsData, error: userCommentsError } = await supabase
        .from('comments')
        .select('track_id, posted_at')
        .eq('user_id', user.id)
        .order('posted_at', { ascending: false });

    if (userCommentsError) throw userCommentsError;
    // console.log(`userCommentsData: ${JSON.stringify(userCommentsData)}`);

    const minAgo = new Date(getMinAgo());
    const newestComment = new Date(userCommentsData[0].posted_at);
    console.log(`minAgo: ${minAgo}, newestComment: ${newestComment}`);
    if (newestComment > minAgo) {
        return NextResponse.json({
            message: 'You must wait 1 minute before posting another comment.'
        }, {
            status: 400
        });
    }

    // console.log(`userCommentsData.length: ${userCommentsData.length}`)
    if (userCommentsData.length > 100) {
        return NextResponse.json({
            message: "Cannot exceed 100 comments per day. Please contact us if you'd like more."
        }, {
            status: 400
        });
    }

    const userCommentsCurTrack = userCommentsData.filter((comment) => comment.track_id === trackId);
    // console.log(`userCommentsCurTrack: ${JSON.stringify(userCommentsCurTrack)}`)
    if (userCommentsCurTrack.length > 2) {
        return NextResponse.json({
            message: 'Cannot exceed 2 comments per track.'
        }, {
            status: 400
        });
    }

    const { data, error } = await supabase
        .from('comments')
        .insert([
            {
                comment: comment,
                track_id: trackId,
            }
        ])
        .select('id, comment, user_id, posted_at');

    if (error || !data[0]) {
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
        return NextResponse.json({
            message: 'Failed to add your comment.'
        }, { status: 400 });
    }

    return NextResponse.json({
        commentObj: data[0],
        message: 'Comment added.'
    }, {
        status: 200
    });
}