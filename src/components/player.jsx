// Must be client component since we're using onClick, useEffect, etc
'use client';

import styles from '../styles/Player.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import Report from './report';

const BTN_SIZE = 24;
const TESTING = false; // redundant; replace soon

function Loading() {
    return (
        <>
            <p>Loading content...</p>
        </>
    )
}

export default function Player({ user }) {
    const frameRef = useRef();
    const [tracks, setTracks] = useState([]);
    const [trackIndex, setTrackIndex] = useState(0);
    const [pos, setPos] = useState(0);
    //const posRef = useRef()
    const supabase = createClientComponentClient();
    const { load, playing, togglePlayPause, src, getPosition } = useGlobalAudioPlayer();

    function SkipBack() {
        const handleClick = () => {
            console.log("Skip Back");
            setTrackIndex(trackIndex > 0 ? trackIndex - 1 : tracks.length - 1);
        }
        return (
            <>
                <button style={{ backgroundColor: 'black' }} onClick={handleClick} type='button'>
                    <Image
                        src="skip-back.svg"
                        width={BTN_SIZE}
                        height={BTN_SIZE}
                        alt="Skip Back"
                    />
                </button>
            </>
        )
    }

    function SkipForward() {
        const handleClick = () => {
            console.log("Skip Forward");
            setTrackIndex((trackIndex + 1) % tracks.length);
        }
        return (
            <>
                <button style={{ backgroundColor: 'black' }} onClick={handleClick} type='button'>
                    <Image
                        src="skip-forward.svg"
                        width={BTN_SIZE}
                        height={BTN_SIZE}
                        alt="Skip Forward"
                    />
                </button>
            </>
        )
    }

    function PlayPause() {
        // Audio does not play on initial load
        //const [isPlaying, setIsPlaying] = useState('false')
        const handleClick = () => {
            togglePlayPause();
        }
        return (
            <>
                <button style={{ backgroundColor: 'black' }} onClick={handleClick} type='button'>
                    <Image
                        src={playing ? "pause.svg" : "play.svg"}
                        width={BTN_SIZE}
                        height={BTN_SIZE}
                        alt={playing ? "Pause" : "Play"}
                    />
                </button>
            </>
        )
    }

    function ProgressBar() {
        const handleClick = () => {
            console.log("confetti");
        }
        return (
            <>
                <p>{Math.round(pos)}</p>
                {/*<div
                    style={{ height: '100px', width: `${tracks ?? (pos / tracks[trackIndex].duration) * 100}%`, color: '#00FF00' }}
                    className="audioSeekBar__tick"
                    onClick={handleClick}
                />*/}
            </>
        )
    }

    const animate = () => {
        setPos(getPosition())
        frameRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        const fetchTracks = async () => {
            let { data, error } = await supabase
                .from('tracks')
                .select()
                //.rangeGt('created_at', )
                .order('created_at', { ascending: false });

            setTracks(data);
        }
        fetchTracks()
        if (TESTING) {
            frameRef.current = window.requestAnimationFrame(animate);
            return () => cancelAnimationFrame(frameRef.current);
        }
    }, [])

    useEffect(() => {
        if (tracks.length) {
            let file_path = tracks[trackIndex].file_path;
            load(`${file_path}`, {
                autoplay: true,
                html5: true,
                onend: () => setTrackIndex((trackIndex + 1) % tracks.length),
            })
            console.log(`track index changed, loading filepath: ${file_path}`)
        }

    }, [load, tracks, trackIndex])

    /* code straight from the react-use-audio-player docs
    useEffect(() => {
        
    }, [getPosition])
    */

    return (
        <>
            <p>{playing ? "Now playing" : "Now paused"}</p>
            <p>src: {src}</p>
            <SkipBack />
            <PlayPause />
            <SkipForward />
            <Report BTN_SIZE={BTN_SIZE} />
            <hr />
            <Suspense fallback={<Loading />}>
                {tracks?.map((track) => {
                    return (
                        <>
                            <p>ID: {track.id}</p>
                            <p>By {track.uploader_id}</p>
                            <p>{track.duration}s</p>
                            <p>Posted {track.created_at}</p>
                            <p>Located at {track.file_path}</p>
                            <hr />
                        </>)

                })}
                <p>full load:{JSON.stringify(tracks, null, 2)}</p>
            </Suspense>
        </>
    )
}