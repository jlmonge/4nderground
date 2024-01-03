// Must be client component since we're using onClick, useEffect, etc
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Fragment, Suspense, useEffect, useState, useRef, useContext } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import Report from './report';
import { getDayAgo } from '../utils/helpers';
import CommentSection from '../components/comment-section';
import { UserContext } from '../user-provider';
import styles from '../styles/Player.module.scss'
import Avatar from './avatar';

const BTN_SIZE = 24;
const DEBUG = false; // redundant; replace soon

function Loading() {
    return (
        <>
            <p>Loading content...</p>
        </>
    );
}

function PlayerControls({ handleForward, handleBack, handlePlayPause, isPausedMisnomer, isEmpty }) {
    // <svg> created via figma
    return (
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1_227_265" fill="white">
                <path
                    d="M139.019 37.25C145.557 48.5743 148.999 61.4199 149 74.4961C149.001 87.5722 145.56 100.418 139.023 111.743C132.486 123.068 123.083 132.473 111.76 139.013C100.437 145.553 87.5919 148.997 74.5157 149L74.5 74.5L139.019 37.25Z" />
            </mask>
            {`<!--SKIP FORWARD-->`}
            {`<!--REGION-->`}
            <path onClick={handleForward}
                d="M139.019 37.25C145.557 48.5743 148.999 61.4199 149 74.4961C149.001 87.5722 145.56 100.418 139.023 111.743C132.486 123.068 123.083 132.473 111.76 139.013C100.437 145.553 87.5919 148.997 74.5157 149L74.5 74.5L139.019 37.25Z"
                fill="url(#paint0_radial_227_265)" stroke="url(#paint1_radial_227_265)" strokeWidth="8"
                mask="url(#path-1-inside-1_227_265)" />
            {`<!--ICON-->`}
            <path onClick={handleForward} d="M98.3477 87.6562L111.043 96.9688L98.3477 106.281V87.6562Z" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            <path onClick={handleForward} d="M116.121 88.8203V105.117" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <mask id="path-4-inside-2_227_265" fill="white">
                <path
                    d="M74.5 149C61.4239 149 48.578 145.558 37.2534 139.021C25.9288 132.483 16.5243 123.08 9.98505 111.757C3.44578 100.433 0.00207494 87.588 9.37103e-07 74.5118C-0.00207307 61.4357 3.43755 48.5893 9.97323 37.2636L74.5 74.5V149Z" />
            </mask>
            {`<!--SKIP BACK-->`}
            {`<!--REGION-->`}
            <path onClick={handleBack}
                d="M74.5 149C61.4239 149 48.578 145.558 37.2534 139.021C25.9288 132.483 16.5243 123.08 9.98505 111.757C3.44578 100.433 0.00207494 87.588 9.37103e-07 74.5118C-0.00207307 61.4357 3.43755 48.5893 9.97323 37.2636L74.5 74.5V149Z"
                fill="url(#paint2_radial_227_265)" stroke="url(#paint3_radial_227_265)" strokeWidth="8"
                mask="url(#path-4-inside-2_227_265)" />
            {`<!--ICON-->`}
            <path onClick={handleBack} d="M54.1211 106.281L41.4258 96.9688L54.1211 87.6562V106.281Z" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            <path onClick={handleBack} d="M36.3477 105.117V88.8203" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <mask id="path-7-inside-3_227_265" fill="white">
                <path
                    d="M9.98112 37.25C16.5192 25.9257 25.9227 16.5217 37.2466 9.98307C48.5705 3.4444 61.416 0.00138135 74.4921 4.15447e-07C87.5683 -0.00138052 100.414 3.43893 111.74 9.9752C123.065 16.5115 132.471 25.9135 139.011 37.2364L74.5 74.5L9.98112 37.25Z" />
            </mask>
            {`<!--PLAY/PAUSE-->`}
            {`<!--REGION-->`}
            <path onClick={handlePlayPause}
                d="M9.98112 37.25C16.5192 25.9257 25.9227 16.5217 37.2466 9.98307C48.5705 3.4444 61.416 0.00138135 74.4921 4.15447e-07C87.5683 -0.00138052 100.414 3.43893 111.74 9.9752C123.065 16.5115 132.471 25.9135 139.011 37.2364L74.5 74.5L9.98112 37.25Z"
                fill="url(#paint4_radial_227_265)" stroke="url(#paint5_radial_227_265)" strokeWidth="8"
                mask="url(#path-7-inside-3_227_265)" />

            {isPausedMisnomer ? ( // PAUSE ICON
                <>
                    <path onClick={handlePlayPause} d="M73 29H69V45H73V29Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path onClick={handlePlayPause} d="M81 29H77V45H81V29Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </>

            ) : ( // PLAY ICON
                <path onClick={handlePlayPause} d="M66.3477 26.4922L84.1211 36.9688L66.3477 47.4453V26.4922Z" stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
            )
            }

            <defs>
                <radialGradient id="paint0_radial_227_265" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(74.5 74.5) rotate(90) scale(74.5)">
                    <stop offset="0.829861" stopColor="#202020" />
                    <stop offset="1" stopColor="#9A9A9A" />
                </radialGradient>
                <radialGradient id="paint1_radial_227_265" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(74.5 74.5) rotate(90) scale(74.5)">
                    <stop offset="0.527778" stopColor="#A0A0A0" />
                    <stop offset="1" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="paint2_radial_227_265" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(74.5 74.5) rotate(90) scale(74.5)">
                    <stop offset="0.819444" stopColor="#202020" />
                    <stop offset="1" stopColor="#9A9A9A" />
                </radialGradient>
                <radialGradient id="paint3_radial_227_265" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(74.5 74.5) rotate(90) scale(74.5)">
                    <stop offset="0.527778" stopColor="#A0A0A0" />
                    <stop offset="1" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="paint4_radial_227_265" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(74.5 74.5) rotate(90) scale(74.5)">
                    <stop offset="0.819444" stopColor="#202020" />
                    <stop offset="1" stopColor="#9A9A9A" />
                </radialGradient>
                <radialGradient id="paint5_radial_227_265" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(74.5 74.5) rotate(90) scale(74.5)">
                    <stop offset="0.527778" stopColor="#A0A0A0" />
                    <stop offset="1" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    )

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
                autoplay: false,
                html5: true,
                onend: () => setTrackIndex((trackIndex + 1) % tracks.length),
            });
            //console.log(`track index changed, loading filepath: ${file_path}`);
        }
    }, [load, tracks, trackIndex]);



    return (
        <>
            <div className={styles["player"]}>
                <PlayerControls handleForward={handleForward} handleBack={handleBack} handlePlayPause={handlePlayPause}
                    isPausedMisnomer={playing} isEmpty={!tracks.length}
                />
                <div className={styles["p-display"]}>
                    {tracks.length ? (
                        <>
                            <div className={styles["p-left"]}>
                                <p className={styles["p-txt"]}>Now playing: <span className={styles["p-curgenre"]}>all</span></p>
                                <p className={styles["p-txt"]}>{trackIndex + 1}/{tracks.length}</p>
                                <p className={styles["p-minitxt"]}>{`${Math.trunc(pos / 60)}:${Math.trunc(pos).toString().padStart(2, '0')}`}/{`${Math.trunc(tracks[trackIndex].duration / 60)}:${(tracks[trackIndex].duration % 60).toString().padStart(2, '0')}`}</p>
                            </div>
                            <div className={styles["p-right"]}>
                                <Avatar userId={tracks[trackIndex].uploader_id} />
                            </div>
                        </>
                    ) : (
                        <div className={styles["p-empty"]}>
                            <p>(Empty player)</p>
                        </div>
                    )
                    }

                </div>
            </div>
            <div className={styles["p-report"]}>
                <Report areTracks={!!tracks.length} contentType='track' contentId={tracks[trackIndex]?.id} />
            </div>


            <CommentSection trackId={tracks[trackIndex]?.id} />

            <Suspense fallback={<Loading />}>
                <div style={{ display: DEBUG ? 'block' : 'none' }}>
                    <div>full load: <pre>{JSON.stringify(tracks, null, 2)}</pre></div>
                </div>
            </Suspense>
        </>
    );
}