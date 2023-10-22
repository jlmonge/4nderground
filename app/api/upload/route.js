import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Disabling Supabase use to not run up my API calls

export async function POST(req) {
    //const cookieStore = cookies()
    //const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
        return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = join('./', 'public', file.name);
    const noPublicPath = `/${file.name}`;

    /*
    const { sqlData, error } = await supabase
        .from('tracks')
        .insert([
            {
                file_path: path,
                duration: 58,
            },
        ])
        .select()

    if (error) {
        console.log(error);
        return NextResponse.json({ success: false });
    }
    */

    await writeFile(path, buffer);

    return NextResponse.json({
        success: true,
        path: noPublicPath,
    });

    /*
    return NextResponse.redirect(`${requestUrl.origin}/player`, {
        status: 201,
    })
    */
}