import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { parseBuffer } from 'music-metadata';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    // Initiate connection to Supabase.
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Obtain audio file from form sent via request.
    const formData = await req.formData();
    const file = formData.get('file');

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

    let fileName = file.name; // Initially set to file name as submitted by user
    const extensionRegex = /\.[0-9a-z]+$/i;
    let fileExtension = fileName.match(extensionRegex) // type 'Array'
    if (!fileExtension) {
        console.log("no extension found? report to site admin")
        return NextResponse.json({
            success: false,
            reason: 'extension-not-found',
        }, { status: 500 });
    }

    //DEBUG 
    //On debug, uncomment this block.
    //Comment out Supabase inserts.
    /*
    return NextResponse.json({
        success: false,
        reason: 'testing :)',
    }, { status: 500 });
    */

    if (duration <= 15) {
        return NextResponse.json({
            success: false,
            reason: 'too-short',
        }, { status: 500 });
    } else if (duration >= 600) { // 10 minutes; shorten later
        return NextResponse.json({
            success: false,
            reason: 'too-long',
        }, { status: 500 });
    }

    // Create track information for database
    fileExtension = fileExtension[0]; // type 'String'
    const preupId = uuidv4();
    fileName = preupId + fileExtension;

    const preupPath = join('./', 'public', fileName);
    const localPath = `/${fileName}`;
    console.log(preupPath);
    console.log(localPath);

    // Insert track information into database
    const { data, error } = await supabase
        .from('tracks')
        .insert([
            {
                id: preupId,
                file_path: preupPath,
                duration: duration,
            },
        ])
        .select()

    if (error) {
        console.log(error);
        return NextResponse.json({ success: false });
    } else {
        console.log(`sql data[0].file_path:${data[0].file_path}`)
    }


    // Write file to specified location.
    await writeFile(preupPath, buffer);

    return NextResponse.json({
        success: true,
        path: localPath,
    });

    /*
    return NextResponse.redirect(`${requestUrl.origin}/player`, {
        status: 201,
    })
    */
}