// Must be client component since we're using onClick, useEffect, etc
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import Report from './report';

const btnSize = 24;

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
                        width={btnSize}
                        height={btnSize}
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
                        width={btnSize}
                        height={btnSize}
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
                        width={btnSize}
                        height={btnSize}
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
                <div
                    style={{ height: '100px', width: `${tracks ?? (pos / tracks[trackIndex].duration) * 100}%`, color: '#00FF00' }}
                    className="audioSeekBar__tick"
                />
            </>
        )
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
    }, [])

    useEffect(() => {
        if (tracks.length) {
            let file_name = (tracks[trackIndex].file_path).slice(7);
            load(`${file_name}`, {
                autoplay: true,
                onend: () => setTrackIndex((trackIndex + 1) % tracks.length)
            })
            console.log(`track index changed, loading: ${file_name}`)
        }
    }, [load, trackIndex])

    /* Obtained directly from the react-use-audio-player docs
    useEffect(() => {
        const animate = () => {
            setPos(getPosition())
            frameRef.current = requestAnimationFrame(animate)
        }

        frameRef.current = window.requestAnimationFrame(animate)

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current)
            }
        }
    }, [getPosition])
    */




    return (
        <>
            <p>{playing ? "Now playing" : "Now paused"}</p>
            <p>src: {src}</p>
            <SkipBack />
            <PlayPause />
            <SkipForward />
            <Report />
            <hr />
            {tracks?.map((track) => {
                return (
                    <>
                        <p>ID: {track.id}</p>
                        <p>By {track.uploader_id}</p>
                        <p>{track.duration}s</p>
                        <p>Posted {track.created_at}s</p>
                        <p>Located at {track.file_path}s</p>
                        <hr />
                    </>)

            })}
            <p>debug:{JSON.stringify(tracks, null, 2)}</p>
        </>
    )
}