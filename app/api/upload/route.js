import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { parseBuffer } from 'music-metadata';
import { v4 as uuidv4 } from 'uuid';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const MB = 1000000;

// Initialize S3 (outside of the route function? interesting...)
const client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
})


// TODO: try to refactor by splitting into functions for specifically
// checking for errors, writing to database, and uploading to S3
export async function POST(req) {
    // Initiate connection to Supabase.
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Obtain audio file from helper's req body.

    const formData = await req.formData();
    const file = formData.get('file'); // returns File object
    const genre = formData.get('genre');

    //throw Error('GO NO FURTHER. INTENTIONAL ERROR FROM ROUTE.JS')
    // TODO: for consistency, store reasons in constants.js.
    // share w/ upload/page.jsx. (~10m)
    if (!file) {
        console.log("no file found.")
        return NextResponse.json({
            success: false,
            reason: 'no-file',
        }, { status: 500 });
    }
    const fileSize = file.size;
    const fileType = file.type;

    if (fileSize >= 128 * MB) {
        console.log("file too big.")
        return NextResponse.json({
            success: false,
            reason: 'too-big',
        }, { status: 500 });
    }

    // Convert audio file into something that can be more universally
    // worked with (bytes).
    // Sometimes I don't know the types.. may be the time for
    // TYPESCRIPT
    // we still need to do this but not for S3. this is for metadata.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Retrieve duration using music-metadata.
    const metadata = await parseBuffer(buffer, fileType);
    const duration = Math.trunc(metadata.format.duration);

    let fileName = file.name; // Initially set to file name as submitted by user
    const extensionRegex = /\.[0-9a-z]+$/i;
    let fileExtension = fileName.match(extensionRegex) // type 'Array'
    if (!fileExtension) {
        console.log("no extension found. odd error, so report to site admin.")
        return NextResponse.json({
            success: false,
            reason: 'extension-not-found',
        }, { status: 500 });
    }

    if (duration <= 30) {
        return NextResponse.json({
            success: false,
            reason: 'too-short',
        }, { status: 500 });
    } else if (duration >= 600) { // 10 minutes; shorten later? 
        return NextResponse.json({
            success: false,
            reason: 'too-long',
        }, { status: 500 });
    }

    // Create track information for database + storage
    fileExtension = fileExtension[0]; // type 'String'
    const preupId = uuidv4();
    fileName = preupId + fileExtension;

    const preupPath = process.env.S3_BASE_URL + fileName;
    const localPath = `/${fileName}`;
    console.log(`prenupPath lol!: ${preupPath}`);

    // Send buffer (file) to S3.
    const putCommand = new PutObjectCommand({
        Key: fileName,
        ContentType: fileType,
        Bucket: process.env.S3_BUCKET_NAME,
    })

    const putUrl = await getSignedUrl(client, putCommand, { expiresIn: 600 })

    /*
    const getCommand = new GetObjectCommand({
        Key: fileName,
        Bucket: process.env.S3_BUCKET_NAME,
    })

    const getUrl = await getSignedUrl(client, getCommand, { expiresIn: 600 })
    */

    // Insert track information into database
    const { data, error } = await supabase
        .from('tracks')
        .insert([
            {
                id: preupId,
                file_path: preupPath,
                duration: duration,
                file_size: fileSize,
                genre: genre,
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
    // TODO: Remove after implementing S3 Get.
    //await writeFile(preupPath, buffer);

    return NextResponse.json({
        putUrl,
        //getUrl,
        path: localPath,
    }, { status: 200 });


    /* Why is this here?
    return NextResponse.redirect(`${requestUrl.origin}/player`, {
        status: 201,
    })
    */
}