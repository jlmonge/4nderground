/*
1. fetch from api (returns putUrl, getUrl)
2.
*/
// file: type formData (TYPESCRIPT...)
import { NextResponse } from 'next/server';

export const uploadFileHelper = async (formData) => {
    try {
        // Make API POST call to upload on AWS+Supabase.
        // Work with the original file instead of sending
        // pieces like the model code.
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        //throw new Error('GO NO FURTHER. INTENTIONAL ERROR FROM UFH.');

        // If the call fails, return the (bad) result to the
        // client so they can deal with it (like before).
        if (!res.ok) {
            return res;
        }

        // Get URLs
        const resJson = await res.json();
        const { putUrl, path } = resJson;
        console.warn(`1. UFH: printing res: ${JSON.stringify(resJson)}`);


        // Perform upload
        const file = formData.get('file');
        const uploadRes = await fetch(putUrl, {
            body: file,
            method: 'PUT',
            //headers: { 'Content-Type': file.type }
        });

        if (uploadRes.ok) {
            console.log('uploadRes W');
        } else {
            console.log('uploadRes L');
        }

        console.log(`UPLOADFILEHELPER.JS IS DONE! RETURNING!`);
        return NextResponse.json({
            success: true,
            path: path,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }

}