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
    ERR_NOT_AUDIO, ERR_ARRAY, ERR_NOT_LOGGED_IN, ERR_UPLOAD_COOLDOWN
} from '../../../utils/constants';
import { UploadError } from '../../../utils/errors';
import { getDayAgo } from '../../../utils/helpers';

// Initialize S3
const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});

// DOES: check if user is logged in, then
//       check if user has posted in last 24 hours (5 min for testing)
async function processUser() {
    const cookieStore = cookies();
    const dbClient = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user } } = await dbClient.auth.getUser();
    if (!user) throw new UploadError(ERR_NOT_LOGGED_IN.reason);

    const { data: profilesData, error } = await dbClient
        .from('profiles')
        .select('last_posted_at')
        .eq('id', user.id);

    if (error) throw error;
    console.log(`last_posted_at of ( ${user.email} ) AKA (${user.id} ): 
        ( ${profilesData} ) with date ${profilesData[0].last_posted_at}`);


    const dayAgo = new Date(getDayAgo());
    const lastPostedAt = new Date(profilesData[0].last_posted_at);
    console.log(`dayAgo: ${dayAgo}, lastPostedAt: ${lastPostedAt}`);
    if (lastPostedAt > dayAgo) throw new UploadError(ERR_UPLOAD_COOLDOWN.reason);
    //throw new Error('LMAO! LMAO! BALLS!');

    return { dbClient, user };
}

// DOES: validate file (size, duration, etc)
async function processFile(req) {
    // Obtain audio file from helper's req body.
    const formData = await req.formData();
    const file = formData.get('file'); // returns File object
    const genre = formData.get('genre');
    let duration = formData.get('duration');
    console.log(`duration: ${duration}`)
    const isRecording = formData.get('isrecording'); // detect if file from recording
    if (!file) throw new UploadError(ERR_NO_FILE.reason);

    const fileSize = file.size;
    const fileType = file.type;
    console.log(`fileSize: ${fileSize}`);
    console.log(`fileType: ${fileType}`);
    if (fileSize >= MAX_SIZE) throw new UploadError(ERR_TOO_BIG.reason);

    if (!duration) {
        // Convert audio file into bytes, then buffer, for the 'metadata' module to get
        // the duration.
        const bytes = await file.arrayBuffer(); // confusing naming
        const buffer = Buffer.from(bytes); // confusing naming

        // Retrieve duration using music-metadata.
        const metadata = await parseBuffer(buffer, fileType);
        duration = Math.trunc(metadata.format.duration);
        console.log(`duration: ${duration}`);
    }

    if (!duration) throw new Error("No duration found.");
    if (duration < MIN_DURATION) throw new UploadError(ERR_TOO_SHORT.reason);
    if (duration >= MAX_DURATION) throw new UploadError(ERR_TOO_LONG.reason);

    let fileName = file.name; // Initially set to file name as submitted by user
    const extensionRegex = /\.[0-9a-z]+$/i;
    let fileExtension = fileName.match(extensionRegex); // type 'Array'
    if (!fileExtension) throw new UploadError(ERR_NO_EXT.reason);

    // fileId: strictly the UUID of the file
    // fileName: UUID AND file extension
    let fileId;
    if (!isRecording) {
        // Create track information for database + storage
        fileExtension = fileExtension[0]; // type 'String'
        fileId = uuidv4();
        fileName = fileId + fileExtension;
    } else {
        fileId = fileName.substring(0, fileName.indexOf('.'));
    }

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
    };

    return fileObj;
}

async function uploadStorage(fileObj) {
    const putCommand = new PutObjectCommand({
        Key: fileObj.name,
        ContentType: fileObj.type,
        Bucket: process.env.S3_BUCKET_NAME,
    });

    const putUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 600 });

    /*
    const getCommand = new GetObjectCommand({
        Key: fileName,
        Bucket: process.env.S3_BUCKET_NAME,
    });

    const getUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });
    */
    return putUrl;
}

async function uploadDatabase(dbClient, fileObj, user) {
    // user not used bc supabase uses currently logged in user
    // by default
    const { data: tracksData, error: tracksError } = await dbClient
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
        .select();

    if (tracksError) throw tracksError;
    console.log(`sql data[0].file_path:${tracksData[0].file_path}`);
    // return statement intentionally omitted
}

export async function POST(req) {
    try {
        const { dbClient, user } = await processUser();
        const fileObj = await processFile(req);
        const putUrl = await uploadStorage(fileObj);
        await uploadDatabase(dbClient, fileObj, user);

        console.log(`ROUTE.JS IS DONE! RETURNING!`);
        return NextResponse.json({
            putUrl,
            //getUrl,
            path: fileObj.localPath,
        }, {
            status: 200
        });
    } catch (e) {
        if (e instanceof UploadError) {
            console.log(e.message);
            return e.response;
        } else {
            console.log('STRANGE ERROR. CONTACT SITE ADMIN.');
            throw e; // can't handle this; rethrow
        }
    }
}