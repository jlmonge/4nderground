'use client';

import Image from 'next/image';
import { useEffect, useReducer, useRef, useState } from 'react';
import { GENRES } from '../utils/constants';
const BTN_SIZE = 128;
const constraints = {
    audio: true,
    video: false,
};

function PrepareUpload({ src }) {
    const [genre, setGenre] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);

    const handleSelectChange = (e) => {
        setGenre(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("submitting");

        if (!src) {
            console.log("Recording not found.");
            return;
        }

        try {
            console.log("we're trying.");
            setIsUploaded(true);
        } catch (e) {
            console.log(e);
        }

    }
    return (
        <>
            <audio src={src} controls>
                Your browser does not support the {'<audio>'} HTML element.
            </audio>
            <form onSubmit={handleSubmit}>
                <label htmlFor="genre">Genre:</label>
                <select id="genre" name="genre" onChange={handleSelectChange}>
                    {
                        Object.entries(GENRES).map(([key, str]) =>
                            <option key={key} value={key}>{str}</option>
                        )
                    }
                </select>
                <button type="submit" disabled={!src || isUploaded}>Upload</button>
            </form>
            {isUploaded && <p>Upload was a success (not really we just testing)</p>}
        </>
    )
}

export default function Record() {
    const [hasPermision, setHasPermission] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [blob, setBlob] = useState(null)
    const stream = useRef(null)
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);
    const recordingURL = useRef(null);

    const saveChunks = (e) => {
        chunks.current.push(e.data)
    }

    const stopRecording = () => {
        const blob = new Blob(chunks.current, { type: "audio/ogg; codecs=opus" });
        setIsRecording(false)
        recordingURL.current = URL.createObjectURL(blob);
        setBlob(blob);
        chunks.current = [];
    }

    const handleRecording = async () => {
        if (!isRecording) {
            await initializeAudio();
            mediaRecorder.current.start();
            setIsRecording(true);
        } else {
            mediaRecorder.current.stop();
            // we only have one track (audio)
            stream.current.getTracks()[0].stop();
            console.log('recorder has stopped');
            setIsRecording(false);
        }

    }

    const initializeAudio = async () => {
        try {
            stream.current = await navigator.mediaDevices.getUserMedia(constraints);
            setHasPermission(true);
            mediaRecorder.current = new MediaRecorder(stream.current);
            mediaRecorder.current.ondataavailable = saveChunks;
            mediaRecorder.current.onstop = stopRecording;
        } catch (e) {
            setHasPermission(false);
            console.log(e);
        }
    }

    return (
        <>
            <p>Press the button to start recording.</p>
            <button
                type="button"
                style={{
                    width: `${BTN_SIZE}px`,
                    height: `${BTN_SIZE}px`,
                    position: 'relative',
                }}
                onClick={handleRecording}
            >
                <Image
                    src={isRecording ? "/stop-circle.svg" : "/mic.svg"}
                    alt={isRecording ? "Stop recording" : "Start recording"}
                    sizes={BTN_SIZE}
                    fill
                    style={{ objectFit: 'contain' }} // optional
                />
            </button>
            {(recordingURL.current && !isRecording) && <PrepareUpload src={recordingURL.current} />}
        </>
    );
}