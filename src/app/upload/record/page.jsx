'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
const BTN_SIZE = 32;
const constraints = {
    audio: true,
    video: false,
};

function Preview({ src }) {
    return (
        <>
            <audio src={src} controls>
                Your browser does not support the {'<audio>'} HTML element.
            </audio>
        </>
    )
}

export default function RecordPage() {
    console.log()
    const [isRecording, setIsRecording] = useState(false);
    const [canRecord, setCanRecord] = useState(false);
    const [src, setSrc] = useState(null);
    const [chunks, setChunks] = useState([])
    const mediaRecorder = useRef(null);


    const onError = (err) => {
        console.log('The following error occured: ' + err);
    };

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices?.getUserMedia) {
            console.log("getUserMedia supported.");
            setCanRecord(true);
            // navigator.mediaDevices.getUserMedia({
            //     audio: true,
            // }).then(onSuccess, onError);
        } else {
            console.log("getUserMedia not supported ")
        }
    }, [])

    // this is different from the start/stop handlers since navigator
    // can only accessed via useEffect.
    useEffect(() => {
        // we are now recording; handleStartRec was called
        // if (canRecord && isRecording) {
        //     const onSuccess = (stream) => {
        //         mediaRecorder.current = new MediaRecorder(stream);
        //         mediaRecorder.current.start();
        //         mediaRecorder.current.onstop = (e) => {
        //             console.log("onstop called")
        //             const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        //             setChunks([])
        //         }
        //         mediaRecorder.current.ondataavailable = (e) => {
        //             setChunks([...chunks, e.data])
        //         }
        //         console.log(`mediaRecorder.state: ${mediaRecorder.state}`)
        //     };
        //     console.log(`${isRecording.toString()}: am recording`);
        //     navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
        //     // we have stopped roecrding; handleEndRec was called
        // } else if (canRecord && !isRecording) {
        //     mediaRecorder.current.stop()
        //     console.log(`mediaRecorder.state: ${mediaRecorder.state}`)
        //     console.log(`${isRecording.toString()}: am not recording`);
        // }
    }, [canRecord, isRecording])

    const handleStartRecording = () => {
        console.log("howdy. the recording has started.")
        // ACTUALLY STARTING the recording does not happen here,
        // but in the useEffect instance that depends on isRecording.
        setIsRecording(true);

    };

    const handleEndRecording = () => {
        console.log("the recording has ended. bye.")
        setIsRecording(false);
    };

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
                onClick={isRecording ? handleEndRecording : handleStartRecording}
            >
                <Image
                    src={isRecording ? "/stop-circle.svg" : "/mic.svg"}
                    alt={isRecording ? "Stop recording" : "Start recording"}
                    sizes={BTN_SIZE}
                    fill
                    style={{ objectFit: 'contain' }} // optional
                />
            </button>
            {src && <Preview src={src} />}
        </>
    );
}