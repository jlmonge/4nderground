import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { parseBuffer } from 'music-metadata';

// Disabling Supabase use to not run up my API calls

export async function POST(req) {
    // Initiate connection to Supabase.
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Obtain audio file from form sent via request.
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
        return NextResponse.json({
            success: false,
            reason: 'no-file',
        }, { status: 500 });
    }

    // Convert audio file into something that can be more universally
    // worked with (bytes).
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Retrieve duration.
    const metadata = await parseBuffer(buffer);
    const duration = Math.trunc(metadata.format.duration);
    if (duration >= 45) {
        return NextResponse.json({
            success: false,
            reason: 'too-long',
        }, { status: 500 });
    }

    // Create path for upload and for URL generation.
    const path = join('./', 'public', file.name);
    const noPublicPath = `/${file.name}`;

    // Insert track information into database
    const { sqlData, error } = await supabase
        .from('tracks')
        .insert([
            {
                file_path: path,
                duration: duration,
            },
        ])
        .select()

    if (error) {
        console.log(error);
        return NextResponse.json({ success: false });
    } else {
        console.log(`sql data:${sqlData}`)
    }
    // Write file to specified location.
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