import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    // currently incomplete. finishing adding to database first.
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('must login to delete your comment');

    const formData = await req.formData();
    const commentUserId = formData.get('commentUserId');
    const commentId = formData.get('commentId');

    console.log(`commentUserId: ${commentUserId}`);
    console.log(`commentId: ${commentId}`);
    if (commentUserId !== user.id) throw new Error('must delete your own comment');

    const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .select()   // for data to return something..

    if (error) {
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
        return NextResponse.json({
            message: 'Failed to delete your comment.'
        }, { status: 400 });
    }

    console.log(`DELETE COMPLETED. ${data}`)

    return NextResponse.json({
        message: 'Comment deleted.'
    }, { status: 200 });
}