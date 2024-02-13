'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { uploadFileHelper } from '../app/service/uploadFileHelper';
import {
    DEBUG, GENRES, FILE_REQS, MAX_SIZE,
    ERR_NO_FILE, ERR_TOO_BIG, ERR_NO_EXT, ERR_TOO_SHORT, ERR_TOO_LONG,
    ERR_NOT_AUDIO, ERR_ARRAY, ERR_NOT_LOGGED_IN
} from '../utils/constants';
import styles from '../styles/Upload.module.scss';
import { UserContext } from '../user-provider';
import UploadSuccess from './Shared/upload-success';

function Debug({ error, uploadSuccess, path }) {
    return (
        <>
            <p>DEBUG: error: {JSON.stringify(error)}, uploadSuccess: {uploadSuccess.toString()}, path: {path}</p>
        </>
    )
}

function Status({ error, loading }) {
    if (error.reason || error.message) {
        return <p style={{ color: 'red' }}>{error.message}</p>
    } else if (loading) {
        return <p>Uploading...</p>
    }
}

export default function UploadFile() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false)
    const [genre, setGenre] = useState('');
    const [filePath, setFilePath] = useState('');
    const [error, setError] = useState({
        reason: '',
        message: '',
    });
    const { user } = useContext(UserContext);
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
        // console.log(nextFile);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError({
            reason: '',
            message: '',
        })
        setLoading(true);
        console.log('submitting')
        // Empty file
        if (!file) {
            setError({
                reason: ERR_NO_FILE.reason,
                message: ERR_NO_FILE.message,
            });
            setLoading(false);
            return;
        }

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
            setError({
                reason: 'Unknown',
                message: 'Something bad happened.',
            })
        } finally {
            setLoading(false);
        }
    }

    let content;
    if (isUploaded) {
        content = <UploadSuccess />;
    } else {
        content = (
            <>
                <form onSubmit={handleSubmit} className={styles["form"]}>
                    <div className={styles["file-input"]}>
                        <label htmlFor="file-input" className={styles["file-input__btn"]}>
                            Choose file
                        </label>
                        <input
                            type="file"
                            id="file-input"
                            name="file-input"
                            className={styles["visually-hidden"]}
                            onChange={handleChange}
                            required
                        />
                        <span className={styles["file-input__name"]} title={file?.name}>
                            {file?.name}
                        </span>
                    </div>
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
                    <div className={styles["genre"]}>
                        <label htmlFor="genre" className={styles["genre__label"]}>Genre</label>
                        <select id="genre" name="genre" className={styles["genre__select"]}
                            onChange={handleSelectChange}>
                            {
                                Object.entries(GENRES).map(([key, str]) =>
                                    <option className={styles["genre__option"]}
                                        key={key} value={key}>
                                        {str}
                                    </option>
                                )
                            }
                        </select>
                    </div>
                    <button type="submit" className={styles["form__btn-submit"]}
                        disabled={!file || error.message || isUploaded}>
                        Upload
                    </button>
                </form>
                {DEBUG && <Debug error={error} uploadSuccess={isUploaded} path={filePath} />}
                <Status error={error} loading={loading} />
            </>
        );
    }

    return (
        <>
            {content}
        </>
    )
}