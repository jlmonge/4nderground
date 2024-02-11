'use client';

import { useState } from 'react';
import Link from 'next/link';
import { uploadFileHelper } from '../app/service/uploadFileHelper';
import {
    GENRES, FILE_REQS, MAX_SIZE,
    ERR_NO_FILE, ERR_TOO_BIG, ERR_NO_EXT, ERR_TOO_SHORT, ERR_TOO_LONG,
    ERR_NOT_AUDIO, ERR_ARRAY, ERR_NOT_LOGGED_IN
} from '../utils/constants';
import styles from '../styles/Upload.module.scss';

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
}

export default function UploadFile() {
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
            });
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
        <div className={styles["uploadpage"]}>
            <h2 className={styles["upl-h2"]}>Upload file</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="user-file"
                    onChange={handleChange}
                    required
                />
                <div className={styles["reqs"]}>
                    <p>File must be...</p>
                    <ul className={styles["reqs__ul"]}>
                        {
                            FILE_REQS.map(req =>
                                <li key={req.type}>{req.desc}</li>
                            )
                        }
                    </ul>
                </div>
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
        </div>
    )
}