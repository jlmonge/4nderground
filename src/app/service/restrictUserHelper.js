import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function restrictUserHelper(req, action) {
    const formData = await req.formData();
    const myID = formData.get('myID');
    const urID = formData.get('urID');
    let insertObj;
    if (action === 'ignore') {
        insertObj = { ignorer_id: myID, ignored_id: urID };
    }
    else if (action === 'block') {
        insertObj = { blocker_id: myID, blocked_id: urID };
    }
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data, error } = await supabase
        .from(`${action}s`)
        .insert(insertObj)
        .select();
    //console.log(`${action} data: ${JSON.stringify(data)}`);
    if (error) throw new Error(error);

    return NextResponse.json({
        message: `${action}: ${myID} to ${urID}`
    }, { status: 200 });
}