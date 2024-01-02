// Must be client component since we're using onClick, useEffect, etc
'use client';

import styles from '../styles/Player.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Fragment, Suspense, useEffect, useState, useRef, useContext } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import Report from './report';
import { getDayAgo } from '../utils/helpers';
import CommentSection from '../components/comment-section';
import { UserContext } from '../user-provider';

const BTN_SIZE = 24;
const DEBUG = false; // redundant; replace soon

function Loading() {
    return (
        <>
            <p>Loading content...</p>
        </>
    );
}

export default function Player() {
    const frameRef = useRef();
    const [tracks, setTracks] = useState([]);
    const [trackIndex, setTrackIndex] = useState(0);
    const [pos, setPos] = useState(0);
    const { user, setUser } = useContext(UserContext);
    const supabase = createClientComponentClient();
    // src is url of file being played.
    const { load, playing, togglePlayPause, src, getPosition } = useGlobalAudioPlayer();

    const handleBack = () => {
        console.log('Skip Back');
        setTrackIndex(trackIndex > 0 ? trackIndex - 1 : tracks.length - 1);
    };

    const handlePlayPause = () => {
        togglePlayPause();
    };

    const handleForward = () => {
        console.log('Skip Forward');
        setTrackIndex((trackIndex + 1) % tracks.length);
    };

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
    }, [])

    useEffect(() => {
        const fetchTracks = async () => {
            const dayAgo = getDayAgo();
            let data, error;
            console.log(`USER: ${JSON.stringify(user)}`);
            if (!user) {
                console.log('logged out');
                ({ data, error } = await supabase.from('tracks').select('*').gt('created_at', dayAgo).order('created_at', { ascending: false }));

            } else {
                console.log('logged in');
                ({ data, error } = await supabase.rpc('select_tracks', { cur_user_id: user.id }));
                console.log(`trax for ${user.id}: ${JSON.stringify(data, null, 2)}`);
            }
            console.log(`ERROR: ${JSON.stringify(error)}`);
            setTracks(data ?? []);
        }
        fetchTracks();
    }, [user?.id]);

    useEffect(() => {
        if (tracks.length) {
            let file_path = tracks[trackIndex].file_path;
            load(`${file_path}`, {
                autoplay: true,
                html5: true,
                onend: () => setTrackIndex((trackIndex + 1) % tracks.length),
            });
            //console.log(`track index changed, loading filepath: ${file_path}`);
        }
    }, [load, tracks, trackIndex]);



    return (
        <>
            <p>{playing ? 'Now playing' : 'Now paused'}</p>

            <p>TRACK BY {tracks[trackIndex]?.uploader_id}</p>
            <button className="skipback" onClick={handleBack} type="button" disabled={!tracks.length}>
                <Image
                    src="/skip-back.svg"
                    width={BTN_SIZE}
                    height={BTN_SIZE}
                    alt="Skip Back"
                />
            </button>
            <button className="playpause" onClick={handlePlayPause} type="button" disabled={!tracks.length}>
                <Image
                    src={playing ? '/pause.svg' : '/play.svg'}
                    width={BTN_SIZE}
                    height={BTN_SIZE}
                    alt={playing ? 'Pause' : 'Play'}
                />
            </button>
            <button className="skipforward" onClick={handleForward} type="button" disabled={!tracks.length}>
                <Image
                    src="/skip-forward.svg"
                    width={BTN_SIZE}
                    height={BTN_SIZE}
                    alt="Skip Forward"
                />
            </button>
            <div className="p-display">
                {tracks.length ? (
                    <div className='p-notempty'>
                        <p>Now playing: <span class="p-curgenre">all</span></p>
                        <p>{trackIndex + 1}/{tracks.length}</p>
                        <p>{`${Math.trunc(pos / 60)}:${Math.trunc(pos).toString().padStart(2, '0')}`}/{`${Math.trunc(tracks[trackIndex].duration / 60)}:${(tracks[trackIndex].duration % 60).toString().padStart(2, '0')}`}</p>
                    </div>
                ) : (
                    <div className='p-empty'>
                        <p>(Empty player)</p>
                    </div>
                )
                }

            </div>
            <Report areTracks={!!tracks.length} contentType='track' contentId={tracks[trackIndex]?.id} />

            <CommentSection trackId={tracks[trackIndex]?.id} />

            <Suspense fallback={<Loading />}>
                <div style={{ display: DEBUG ? 'block' : 'none' }}>
                    <div>full load: <pre>{JSON.stringify(tracks, null, 2)}</pre></div>
                </div>
            </Suspense>
        </>
    );
}