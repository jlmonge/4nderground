import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function unrestrictUserHelper(req, action) {
    const formData = await req.formData();
    const myID = formData.get('myID');
    const urID = formData.get('urID');
    let myCol, urCol;
    if (action === 'ignore') {
        myCol = 'ignorer_id';
        urCol = 'ignored_id';
    }
    else if (action === 'block') {
        myCol = 'blocker_id';
        urCol = 'blocked_id';
    }

    // console.log(`debug: (myCol, myID) => (${myCol},${myID})`);
    // console.log(`debug: (urCol, urID) => (${urCol},${urID})`);
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data, error } = await supabase
        .from(`${action}s`)
        .delete()
        .eq(myCol, myID)
        .eq(urCol, urID)
        .select()
    if (error) {
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
        return NextResponse.json({
            message: `Un${action} failed.`
        }, { status: 400 });
    }

    return NextResponse.json({
        message: `User un${action === 'ignore' ? 'ignored' : 'blocked'}.`
    }, { status: 200 });
}