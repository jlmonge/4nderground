'use client';

import Image from 'next/image';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { GENRES, MAX_DURATION } from '../utils/constants';
import { uploadFileHelper } from '../app/service/uploadFileHelper';

const BTN_SIZE = 128;
const constraints = {
    audio: true,
    video: false,
};

function PrepareUpload({ recordingURL, blob }) {
    const [genre, setGenre] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);

    const handleSelectChange = (e) => {
        setGenre(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("submitting");

        if (!recordingURL) {
            console.log("Recording not found.");
            return;
        }

        try {
            const data = new FormData();
            const fileName = `${recordingURL.substring(recordingURL.lastIndexOf('/') + 1)}.webm`;
            const file = new File([blob], fileName, {
                type: "audio/webm;codecs=opus"
            })
            const context = new AudioContext();
            const buffer = await file.arrayBuffer();
            const audio = await context.decodeAudioData(buffer);
            const duration = Math.trunc(audio.duration);

            data.append('file', file);
            data.append('genre', genre);
            data.append('duration', duration);
            data.append('isrecording', true);
            const res = await uploadFileHelper(data);
            const resJson = await res.json();

            if (!res.ok) {
                console.log(`${resJson.reason}: ${resJson.message}`)
                // setError({
                //     reason: resJson.reason,
                //     message: resJson.message,
                // })
            } else {
                setIsUploaded(true);
            }
        } catch (e) {
            console.log(e);
        }

    }
    return (
        <>
            <audio src={recordingURL} controls>
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
                <button type="submit" disabled={!recordingURL || isUploaded}>Upload</button>
            </form>
            {isUploaded && <p>Upload was a success. See player.</p>}
            <p>debug: {recordingURL}</p>
        </>
    )
}

export default function Record() {
    const [seconds, setSeconds] = useState(0);
    const [prevSeconds, setPrevSeconds] = useState(0);
    const [hasPermision, setHasPermission] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [blob, setBlob] = useState(null)
    const intervalRef = useRef(null)
    const stream = useRef(null)
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);
    const recordingURL = useRef(null);

    const startTimer = () => {
        console.log(`seconds: ${seconds}`);
        intervalRef.current = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000)
    }
    const stopTimer = useCallback(() => {
        clearInterval(intervalRef.current);
        setPrevSeconds(seconds);
        setSeconds(0);
    }, [seconds])

    const saveChunks = (e) => {
        chunks.current.push(e.data)
    }

    const stopRecording = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm;codecs=opus" });
        setIsRecording(false)
        recordingURL.current = URL.createObjectURL(blob);
        setBlob(blob);
        chunks.current = [];
    }

    const handleStartRecording = async () => {
        await initializeAudio();
        mediaRecorder.current.start();
        startTimer();
        setIsRecording(true);
    }

    const handleStopRecording = useCallback(() => {
        mediaRecorder.current.stop();
        // we only have one track (audio)
        stream.current.getTracks()[0].stop();
        stopTimer();
        console.log('recorder has stopped');
        setIsRecording(false);
    }, [stopTimer])

    const handleRecording = async () => {
        if (!isRecording) {
            setSeconds(s => 0);
            await handleStartRecording();
        } else {
            handleStopRecording();
        }
    }

    const initializeAudio = async () => {
        try {
            stream.current = await navigator.mediaDevices.getUserMedia(constraints);
            setHasPermission(true);
            mediaRecorder.current = new MediaRecorder(stream.current, {
                mimeType: 'audio/webm;codecs=opus'
            });
            mediaRecorder.current.ondataavailable = saveChunks;
            mediaRecorder.current.onstop = stopRecording;
        } catch (e) {
            setHasPermission(false);
            console.log(e);
        }
    }

    useEffect(() => {
        if (seconds >= MAX_DURATION) {
            handleStopRecording();
        }
    }, [seconds, handleStopRecording])

    return (
        <>
            <p>Press the button to start recording.</p>
            {isRecording && <p>Elapsed time: {`${Math.trunc(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}</p>}
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
            {(recordingURL.current && !isRecording) && <PrepareUpload recordingURL={recordingURL.current} blob={blob} />}
        </>
    );
}