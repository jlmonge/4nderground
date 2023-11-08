import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { parseBuffer } from 'music-metadata';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
    MAX_SIZE, MIN_DURATION, MAX_DURATION,
    ERR_NO_FILE, ERR_TOO_BIG, ERR_NO_EXT, ERR_TOO_SHORT, ERR_TOO_LONG,
    ERR_NOT_AUDIO, ERR_ARRAY, ERR_NOT_LOGGED_IN
} from '../../../constants';
import { UploadError } from '../../../errors';

// Initialize S3
const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
})

// DOES: check if user is logged in, then
//       check if user has posted in last 24 hours (5 min for testing)
// RETURN: supabase route client
async function processUser() {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw UploadError(ERR_NOT_LOGGED_IN.reason)

    return supabase;
}

// DOES: obtain information about the file (size, duration, etc) and make sure it is valid
// RETURN: object consisting of file information
async function processFile(req) {
    // Obtain audio file from helper's req body.
    const formData = await req.formData();
    const file = formData.get('file'); // returns File object
    const genre = formData.get('genre');
    if (!file) throw new UploadError(ERR_NO_FILE.reason)

    const fileSize = file.size;
    const fileType = file.type;
    if (fileSize >= MAX_SIZE) throw new UploadError(ERR_TOO_BIG.reason)

    // Convert audio file into something that can be more universally
    // worked with (bytes).
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Retrieve duration using music-metadata.
    const metadata = await parseBuffer(buffer, fileType);
    const duration = Math.trunc(metadata.format.duration);
    if (duration < MIN_DURATION) throw new UploadError(ERR_TOO_SHORT.reason)
    if (duration >= MAX_DURATION) throw new UploadError(ERR_TOO_LONG.reason)

    let fileName = file.name; // Initially set to file name as submitted by user
    const extensionRegex = /\.[0-9a-z]+$/i;
    let fileExtension = fileName.match(extensionRegex) // type 'Array'
    if (!fileExtension) throw new UploadError(ERR_NO_EXT.reason)

    // Create track information for database + storage
    fileExtension = fileExtension[0]; // type 'String'
    const fileId = uuidv4();
    fileName = fileId + fileExtension;

    const filePath = process.env.S3_BASE_URL + fileName;
    const localPath = `/${fileName}`;
    console.log(`filePath: ${filePath}`);
    const fileObj = {
        path: filePath,
        localPath: localPath,
        duration: duration,
        size: fileSize,
        type: fileType,
        genre: genre,
        id: fileId,
        name: fileName,
    }

    return fileObj;
}

async function uploadStorage(fileObj) {
    const putCommand = new PutObjectCommand({
        Key: fileObj.name,
        ContentType: fileObj.type,
        Bucket: process.env.S3_BUCKET_NAME,
    })

    const putUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 600 })

    /*
    const getCommand = new GetObjectCommand({
        Key: fileName,
        Bucket: process.env.S3_BUCKET_NAME,
    })

    const getUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 })
    */

    return putUrl
}

async function uploadDatabase(dbClient, fileObj) {
    const { data, error } = await dbClient
        .from('tracks')
        .insert([
            {
                id: fileObj.id,
                file_path: fileObj.path,
                duration: fileObj.duration,
                file_size: fileObj.size,
                genre: fileObj.genre,
            },
        ])
        .select()

    if (error) throw error
    console.log(`sql data[0].file_path:${data[0].file_path}`)

    // return statement intentionally omitted
}

export async function POST(req) {
    try {
        const dbClient = await processUser();
        const fileObj = await processFile(req);
        const putUrl = await uploadStorage(fileObj);
        await uploadDatabase(dbClient, fileObj);

        return NextResponse.json({
            putUrl,
            //getUrl,
            path: fileObj.localPath,
        }, {
            status: 200
        });
    } catch (e) {
        if (e instanceof UploadError) {
            console.log(e.message)
            return e.response;
        } else {
            console.log("STRANGE ERROR. CONTACT SITE ADMIN.")
            throw e; // can't handle this; rethrow
        }
    }
}