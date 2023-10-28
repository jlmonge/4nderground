'use client';

import { useState } from 'react';
import Link from 'next/link';

function Status({ invalid, tooLong, uploaded, path }) {
    if (invalid) {
        return (
            <>
                <p style={{ color: 'red' }}>Invalid file</p>
            </>
        )
    }

    if (tooLong) {
        return (<>
            <p style={{ color: 'red' }}>Tracks must be under 45 seconds</p>
        </>)
    }

    if (uploaded) {
        return (
            <>
                <p style={{ color: 'green' }}>
                    Upload successful! Click
                    <Link href={`/player/${encodeURIComponent(path)}`}> here</Link> to
                    listen to your track. (actually look below for now)
                </p>
                <audio src=""></audio>

            </>
        )
    }
    /*
    return (
        <>
            <p>
                status debug: {String(invalid)} {String(tooLong)}
            </p>
        </>
    )
    */

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
    const [isTooLong, setIsTooLong] = useState(false);

    const handleChange = (e) => {
        let nextFile = e.target.files?.[0];
        setFile(nextFile);
        setFilePath('');
        setIsUploaded(false);
        setIsTooLong(false);
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

        // console.log(file); // PRINT!!!!!!!!!!!
        try {
            const data = new FormData();
            data.set('file', file);

            const res = await fetch('/api/upload', {
                method: 'post',
                body: data,
            });


            if (!res.ok) {
                res.json().then((json) => {
                    if (json.reason == 'too-long') {
                        setIsTooLong(true);
                    } else if (json.reason == 'no-file') {
                        console.log("what");
                    }
                    //throw new Error(json);
                });

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
            <Status invalid={isInvalid} tooLong={isTooLong} uploaded={isUploaded} path={filePath}></Status>
            <h1>...or record now</h1>
            <em>[FEATURE NOT YET AVAILABLE]</em>
        </>
    )
}