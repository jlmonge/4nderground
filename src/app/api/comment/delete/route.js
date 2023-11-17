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

    if (error) throw new Error('supabase delete failed')

    console.log(`DELETE COMPLETED. ${data}`)

    return NextResponse.json({
        placeholder: 'probably useless. refactor routes to Response from NextResponse.'
    }, { status: 200 });
}