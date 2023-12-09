'use client';

import { useState } from 'react';
import Link from 'next/link';
import { uploadFileHelper } from '../service/uploadFileHelper';
import {
    GENRES, MAX_SIZE,
    ERR_NO_FILE, ERR_TOO_BIG, ERR_NO_EXT, ERR_TOO_SHORT, ERR_TOO_LONG,
    ERR_NOT_AUDIO, ERR_ARRAY, ERR_NOT_LOGGED_IN
} from '../../utils/constants';

function Debug({ error, uploadSuccess, path }) {
    return (
        <>
            <p>DEBUG: error: {JSON.stringify(error)}, uploadSuccess: {uploadSuccess.toString()}, path: {path}</p>
        </>
    )
}

function Status({ error, uploadSuccess, path }) {
    if (error.reason || error.message) {
        return <p style={{ color: 'red' }}>{error.message}</p>
    }

    if (uploadSuccess) {
        return (
            <>
                <p style={{ color: 'green' }}>
                    Click <Link href={`/player${path}`}>here</Link> to
                    listen to your track.
                </p>
            </>
        );
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

export default function UploadPage() {
    const [file, setFile] = useState();
    const [genre, setGenre] = useState('');
    const [filePath, setFilePath] = useState('');
    const [error, setError] = useState({
        reason: '',
        message: '',
    });
    // TODO: use isUploaded for upload progress bar (~30m)
    const [isUploaded, setIsUploaded] = useState(false);

    const handleSelectChange = (e) => {
        setGenre(e.target.value)
    }

    const handleChange = (e) => {
        let nextFile = e.target.files?.[0];
        setFile(nextFile);
        setFilePath('');
        setIsUploaded(false);
        if (nextFile) {
            const audioRegex = new RegExp('audio.*')
            if (audioRegex.test(nextFile.type)) {
                if (nextFile.size >= MAX_SIZE) {
                    setError({
                        reason: ERR_TOO_BIG.reason,
                        message: ERR_TOO_BIG.message,
                    })
                } else {
                    setError({
                        reason: '',
                        message: '',
                    })
                }
            } else {
                setError({
                    reason: ERR_NOT_AUDIO.reason,
                    message: ERR_NOT_AUDIO.message,
                })
            }
        } else {
            setError({
                reason: ERR_NO_FILE.reason,
                message: ERR_NO_FILE.message,
            })
        }
        console.log(nextFile);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submitting')
        // Empty file
        if (!file) {
            setError({
                reason: ERR_NO_FILE.reason,
                message: ERR_NO_FILE.message,
            })
            return;
        }
        //setError('');

        try {
            const data = new FormData();
            data.append('file', file);
            data.append('genre', genre);

            const res = await uploadFileHelper(data);
            const resJson = await res.json();

            if (!res.ok) {
                setError({
                    reason: resJson.reason,
                    message: resJson.message,
                })
            } else {
                setIsUploaded(true);
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
                    type="file"
                    name="user-file"
                    onChange={handleChange}
                    required
                />
                <label htmlFor="genre">Genre:</label>
                <select id="genre" name="genre" onChange={handleSelectChange}>
                    {
                        Object.entries(GENRES).map(([key, str]) =>
                            <option key={key} value={key}>{str}</option>
                        )
                    }
                </select>
                <button type="submit" disabled={!file || error.message || isUploaded}>Upload</button>
            </form>
            <Debug error={error} uploadSuccess={isUploaded} path={filePath} />
            <Status error={error} uploadSuccess={isUploaded} path={filePath} />
            <h1><Link href="/upload/record">...or record now</Link></h1>
        </>
    )
}