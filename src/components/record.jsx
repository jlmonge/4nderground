'use client';

// import Image from 'next/image';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { REC_REQS, GENRES, MAX_DURATION } from '../utils/constants';
import { uploadFileHelper } from '../app/service/uploadFileHelper';
import styles from '../styles/Upload.module.scss';
import UploadSuccess from './Shared/upload-success';

const BTN_SIZE = 128;
const constraints = {
    audio: true,
    video: false,
};

function Status({ error, loading }) {
    if (error.reason || error.message) {
        return <p style={{ color: 'red' }}>{error.message}</p>
    } else if (loading) {
        return <p>Uploading...</p>
    }
}

export default function Record() {
    const [isMobileOS, setIsMobileOS] = useState(false);
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
    const [genre, setGenre] = useState('');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        reason: '',
        message: '',
    });
    const [isUploaded, setIsUploaded] = useState(false);

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
        setError({
            reason: '',
            message: '',
        });
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

    const handleSelectChange = (e) => {
        setGenre(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError({
            reason: '',
            message: '',
        });
        setLoading(true);
        console.log("submitting");

        if (!recordingURL.current) {
            console.log("Recording not found.");
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            const fileName = `${(recordingURL.current).substring((recordingURL.current).lastIndexOf('/') + 1)}.webm`;
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
                setError({
                    reason: resJson.reason,
                    message: resJson.message,
                })
            } else {
                setIsUploaded(true);
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

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        ;
        if (/windows phone/i.test(userAgent) ||
            /android/i.test(userAgent) ||
            (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
            setIsMobileOS(true)
        }
    }, [])

    useEffect(() => {
        if (seconds >= MAX_DURATION) {
            handleStopRecording();
        }
    }, [seconds, handleStopRecording])

    let content;
    if (isMobileOS) {
        content = <p>Mobile OS detected. Recording is not yet supported.</p>
    } else if (!isMobileOS && isUploaded) {
        content = <UploadSuccess />;
    } else {
        content = (
            <>
                <button
                    type="button"
                    className={styles["record__btn"]}
                    onClick={handleRecording}
                >
                    {isRecording ? 'Stop' : 'Start'}
                </button>
                <span className={styles["record__time"]}>
                    {isRecording && `${Math.trunc(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}
                </span>
                <div className={styles["reqs"]}>
                    <p>Recording must be...</p>
                    <ul className={styles["reqs__ul"]}>
                        {
                            REC_REQS.map(req =>
                                <li key={req.type}>{req.desc}</li>
                            )
                        }
                    </ul>
                </div>
                {(recordingURL.current && !isRecording) && (
                    <>
                        <form onSubmit={handleSubmit} className={`${styles["form"]} ${styles["form__record"]}`}>
                            <div className={styles["preview"]}>
                                <span className={styles["preview__label"]}>Preview</span>
                                <audio src={recordingURL.current} controls className={styles["preview__audio"]}>
                                    Your browser does not support the {'<audio>'} HTML element.
                                </audio>
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
                                disabled={!recordingURL.current || isUploaded}>
                                Upload
                            </button>
                        </form>
                        {/* <p>debug: {recordingURL.current}</p> */}
                        <Status error={error} loading={loading} />
                    </>
                )}
            </>
        )
    }

    return (
        <>
            {content}
        </>
    );
}