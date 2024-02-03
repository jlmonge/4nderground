'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Fragment, Suspense, useEffect, useState, useRef, useContext, useCallback } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import Report from './report';
import { getDayAgo } from '../utils/helpers';
import CommentSection from '../components/comment-section';
import { UserContext } from '../user-provider';
import styles from '../styles/Player.module.scss'
import Avatar from './avatar';
import { GENRES } from '../utils/constants';
import { PauseBtn, PlayBtn, SkipBackBtn, SkipNextBtn } from './svgs';

const BTN_SIZE = 24;
const DEBUG = false; // redundant; replace soon

function Loading() {
    return (
        <>
            <p>Loading content...</p>
        </>
    );
}


//todo: when genre changes, pass it to player and filter tracks.
//todo: if no tracks in genre, show empty player
//todo: now i realize that we must show player when empty...
function Genre() {
    const [genre, setGenre] = useState('');

    const handleSelectChange = (e) => {
        setGenre(e.target.value)
    }

    return (
        <div className={styles["genre-container"]}>
            <label htmlFor="genre" className={styles["genre-label"]}>Genre</label>
            <div className={styles["genreselect-container"]}>
                <select id="genre" className={styles["genreselect"]} name="genre" onChange={handleSelectChange}>
                    {
                        Object.entries(GENRES).map(([key, str]) =>
                            <option className={styles["genreselect-option"]} key={key} value={key}>{str}</option>
                        )
                    }
                </select>
            </div>
        </div>
    )
}

function ElapsedTime() {
    const frameRef = useRef();
    const [pos, setPos] = useState(0);
    const { getPosition } = useGlobalAudioPlayer();

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

    return (
        <p className={`${styles["tracktime"]} ${styles["elapsedtime"]}`}>{`${Math.trunc(pos / 60)}:${Math.trunc(pos % 60).toString().padStart(2, '0')}`}</p>
    )
}

function VolumeControls() {
    const { volume, setVolume } = useGlobalAudioPlayer();

    const handleVolume = useCallback((slider) => {
        return setVolume(slider.target.value);
    }, [setVolume]);

    return (
        <div className={styles["vol-container"]}>
            <span className={styles["vol-label"]}>Vol</span>
            <input
                className={styles["vol-slider"]}
                type="range"
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolume}
                value={volume}
            />
        </div>
    )

}

function PlayerControls({ handleBack, handlePlayPause, handleForward, isPausedMisnomer, isEmpty }) {
    // <svg> created via figma
    return (
        <div className={styles["ctrls-container"]}>
            <button type="button" onClick={handleBack} className={styles["skipback-btn"]}>
                {/* <SkipBackBtn className={styles["ctrls-svg"]} /> */}
            </button>
            <button type="button" onClick={handlePlayPause}
                className={isPausedMisnomer ? styles["pause-btn"] : styles["play-btn"]}>
                {/* {isPausedMisnomer
                    ? <PauseBtn className={styles["ctrls-svg"]} />
                    : <PlayBtn className={styles["ctrls-svg"]} />
                } */}
            </button>
            <button type="button" onClick={handleForward} className={styles["skipnext-btn"]}>
                {/* <SkipNextBtn className={styles["ctrls-svg"]} /> */}
            </button>
        </div>
    )
}

export default function Player() {
    const [tracks, setTracks] = useState([]);
    const [trackIndex, setTrackIndex] = useState(0);
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
        <div className={styles["player-page"]}>
            <div className={styles["player"]}>
                {tracks.length ? (
                    <>
                        <div className={styles["decor-bars"]}>
                            <div className={styles["bar-white"]}></div>
                            <div className={styles["bar-grey"]}></div>
                            <div className={styles["bar-white"]}></div>
                            <div className={styles["bar-grey"]}></div>
                            <div className={styles["bar-white"]}></div>
                            <div className={styles["bar-grey"]}></div>
                        </div>
                        <div className={styles["avi-container"]}>
                            <Avatar userId={tracks[trackIndex].uploader_id} size="small" />
                        </div>
                        <div className={styles["report-container"]}>
                            <Report areTracks={!!tracks.length} contentType='track' contentId={tracks[trackIndex]?.id} />
                        </div>
                        <Genre />
                        <div className={styles["queue-container"]}>
                            <div className={styles["queue-info"]}>
                                <p className={styles["qi-label"]}>Now</p>
                                <p className={styles["qi-val"]}>{trackIndex + 1}</p>
                            </div>
                            <div className={styles["queue-info"]}>
                                <p className={styles["qi-label"]}>Total</p>
                                <p className={styles["qi-val"]}>{tracks.length}</p>
                            </div>
                        </div>

                        <ElapsedTime />
                        <p className={`${styles["tracktime"]} ${styles["totaltime"]}`}>{`${Math.trunc(tracks[trackIndex]?.duration / 60)}:${(tracks[trackIndex]?.duration % 60).toString().padStart(2, '0')}`}</p>
                        <PlayerControls handleBack={handleBack} handlePlayPause={handlePlayPause} handleForward={handleForward}
                            isPausedMisnomer={playing} isEmpty={!tracks.length}
                        />
                        <VolumeControls />
                    </>

                ) : (
                    <div className={styles["p-empty"]}>
                        <p>(Empty player)</p>
                    </div>
                )
                }
            </div>
            <CommentSection trackId={tracks[trackIndex]?.id} />

            {/* <Suspense fallback={<Loading />}>
                <div style={{ display: DEBUG ? 'block' : 'none' }}>
                    <div>full load: <pre>{JSON.stringify(tracks, null, 2)}</pre></div>
                </div>
            </Suspense> */}
        </div>
    );
}