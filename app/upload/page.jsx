'use client';

import { useState } from 'react';
import Link from 'next/link';

function Status({ invalid, uploaded, path }) {
    if (invalid) {
        return (
            <>
                <p>Invalid file</p>
            </>
        )
    }

    if (uploaded) {
        return (
            <>
                <p>
                    Upload successful! Click
                    <Link href={`/player/${encodeURIComponent(path)}`}> here</Link> to
                    listen to your track. (actually look below for now)
                </p>
                <audio src=""></audio>

            </>
        )
    }

}

export default function Upload() {
    /*
    function validateUpload() {
        const validExtensions = ['.mp3', '.flac', '.aac', '.ogg', '.wav', '.aiff']
        console.log("validating");
    }
    */
    const [file, setFile] = useState();
    const [filePath, setFilePath] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    const handleChange = (e) => {
        let nextFile = e.target.files?.[0];
        setFile(nextFile);
        setFilePath('');
        setIsUploaded(false);
        if (!nextFile?.type.match('audio.*')) {
            setIsInvalid(true);
        }
        else {
            setIsInvalid(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Empty file
        if (!file) {
            setIsInvalid(true)
            return;
        }
        setIsInvalid(false);

        console.log(file); // PRINT!!!!!!!!!!!
        try {
            const data = new FormData();
            data.set('file', file);

            const res = await fetch('/api/upload', {
                method: 'post',
                body: data,
            });

            if (!res.ok) {
                throw new Error(await res.text());
            } else {
                setIsUploaded(true);
                const resJson = await res.json();
                setFilePath(resJson.path);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <h1>Upload a file</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='file'
                    name='user-file'
                    onChange={handleChange}
                    required
                />
                <button type='submit' disabled={!file || isInvalid}>Upload</button>
            </form>
            <Status invalid={isInvalid} uploaded={isUploaded} path={filePath}></Status>
            <h1>...or record now</h1>
            <em>[FEATURE NOT YET AVAILABLE]</em>
        </>
    )
}