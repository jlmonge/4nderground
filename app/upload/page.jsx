'use client';

import { useState } from 'react';
import Link from 'next/link';
import { uploadFileHelper } from '../service/uploadFileHelper';

const MB = 1000000;
// TODO: implement. restructure dict into array of objects (sigh) (~10m)
const GENRES = {
    "": "-",
    "hip-hop": "Hip-Hop",
    "rnb": "R&B",
    "electronic": "Electronic",
    "pop": "Pop",
    "rock": "Rock",
    "punk": "Punk",
    "metal": "Metal",
    "jazz": "Jazz",
    "classical": "Classical",
    "reggae": "Reggae",
    "world": "World",
    "ambient": "Ambient",
    "noise": "Noise",
    "experimental": "Experimental"
}

function Status({ error, uploadSuccess, uploadURL }) {
    if (error) {
        switch (error) {
            case 'not-audio':
                return <p style={{ color: 'red' }}>The file you uploaded was not an audio file.</p>
            case 'too-short':
                return <p style={{ color: 'red' }}>Tracks must be more than 30 seconds.</p>
            case 'too-long':
                return <p style={{ color: 'red' }}>Tracks must be under 10 minutes.</p>
            case 'no-file':
                return <p style={{ color: 'red' }}>No file was selected.</p>
            case 'too-big':
                return <p style={{ color: 'red' }}>Exceeded the file size limit of <strong>128MB</strong>.</p>
            default:
                return <p style={{ color: 'red' }}>Unknown error. Contact site admin.</p>
        }
    }

    if (uploadSuccess) {
        return (
            <>
                <p style={{ color: 'green' }}>
                    Click <Link href={`/player${uploadURL}`}>here</Link> to
                    listen to your track.
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
    const [genre, setGenre] = useState('');
    const [filePath, setFilePath] = useState('');
    const [error, setError] = useState('');
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
                setError(nextFile.size >= 128 * MB ? 'too-big' : '')
            } else {
                setError('not-audio')
            }
        } else {
            setError('no-file')
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("submitting")
        // Empty file
        if (!file) {
            setError('no-file')
            return;
        }
        setError('');

        try {
            const data = new FormData();
            data.append('file', file);
            data.append('genre', genre);

            const res = await uploadFileHelper(data);
            const resJson = await res.json();

            if (!res.ok) {
                setError(resJson.reason)
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
                    type='file'
                    name='user-file'
                    onChange={handleChange}
                    required
                />
                <label htmlFor="genre">Genre:</label>
                <select name="genre" onChange={handleSelectChange}>
                    <option value="">-</option>
                    <option value="hip-hop">Hip-Hop</option>
                    <option value="rnb">R&B</option>
                    <option value="electronic">Electronic</option>
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="punk">Punk</option>
                    <option value="metal">Metal</option>
                    <option value="jazz">Jazz</option>
                    <option value="classical">Classical</option>
                    <option value="reggae">Reggae</option>
                    <option value="world">World</option>
                    <option value="ambient">Ambient</option>
                    <option value="noise">Noise</option>
                    <option value="experimental">Experimental</option>
                </select>
                <button type='submit' disabled={!file || error}>Upload</button>
            </form>
            <Status error={error} uploadSuccess={isUploaded} path={filePath}></Status>
            <h1>...or record now</h1>
            <em>[FEATURE NOT YET AVAILABLE]</em>
        </>
    )
}