'use client';

import { useState } from 'react';
import Link from 'next/link';

function Status({ invalid, tooLong, tooShort, uploaded, path }) {
    if (invalid) {
        return (
            <>
                <p style={{ color: 'red' }}>Invalid file</p>
            </>
        )
    }

    if (tooLong) {
        return (<>
            <p style={{ color: 'red' }}>Tracks must be under 5 minutes</p>
        </>)
    }

    if (tooShort) {
        return (<>
            <p style={{ color: 'red' }}>Tracks must be more than 10 seconds</p>
        </>)
    }

    if (uploaded) {
        return (
            <>
                <p style={{ color: 'green' }}>
                    Upload successful! Click
                    <Link href={`/player/${path}`}> here</Link> to
                    listen to your track. (actually look below for now)
                </p>

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
    // Refactor with useReducer in the future?
    const [file, setFile] = useState();
    const [filePath, setFilePath] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isTooLong, setIsTooLong] = useState(false);
    const [isTooShort, setIsTooShort] = useState(false)

    const handleChange = (e) => {
        let nextFile = e.target.files?.[0];
        setFile(nextFile);
        // yikers spaghet code
        setFilePath('');
        setIsUploaded(false);
        setIsTooLong(false);
        setIsTooShort(false);
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
                    switch (json.reason) {
                        case 'too-short':
                            setIsTooShort(true);
                            break;
                        case 'too-long':
                            setIsTooLong(true);
                            break;
                        case 'no-file':
                            console.log('no file (how)');
                            break;
                        default:
                            console.log('unknown json.reason; contact web administrators');
                            throw new Error("likely testing");
                    }
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
            <Status invalid={isInvalid} tooLong={isTooLong} tooShort={isTooShort} uploaded={isUploaded} path={filePath}></Status>
            <h1>...or record now</h1>
            <em>[FEATURE NOT YET AVAILABLE]</em>
        </>
    )
}