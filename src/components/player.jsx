'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Fragment, Suspense, useEffect, useState, useRef, useContext, useCallback } from 'react';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import { UserContext } from '../user-provider';
import Report from './report';
import CommentSection from '../components/comment-section';
import Avatar from './avatar';
import { GENRES } from '../utils/constants';
import { getDayAgo } from '../utils/helpers';
import styles from '../styles/Player.module.scss'

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

function PlaybackBar() {
    const { playing, getPosition, duration, seek } = useGlobalAudioPlayer();
    const [pos, setPos] = useState(0);
    const frameRef = useRef();
    const playbackBarRef = useRef(null);

    useEffect(() => {
        const animate = () => {
            setPos(getPosition());
            frameRef.current = requestAnimationFrame(animate);
        }

        frameRef.current = window.requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        }
    }, [getPosition])

    // const goTo = useCallback((e) => {
    //     const { pageX: eventOffsetX } = e;

    //     if (playbackBarRef.current) {
    //         const refOffsetX = playbackBarRef.current.getBoundingClientRect().left;
    //         const refWidth = playbackBarRef.current.clientWidth;
    //         const percent = (eventOffsetX - refOffsetX) / refWidth;
    //         seek(percent * duration);
    //     }
    // }, [duration, playing, seek]);

    const handlePlayback = (slider) => {
        return seek(slider.target.value);
    }

    if (duration === Infinity) return null;

    return (
        <>
            <input
                className={styles["playback-bar"]}
                type="range"
                min={0}
                max={Math.trunc(duration)}
                step={1}
                onChange={handlePlayback}
                value={Math.trunc(pos)}
            />
        </>
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
            <button type="button" onClick={handleBack} className={styles["skipback-btn"]} disabled={isEmpty}>
                {/* <SkipBackBtn className={styles["ctrls-svg"]} /> */}
            </button>
            <button type="button" onClick={handlePlayPause}
                className={isPausedMisnomer ? styles["pause-btn"] : styles["play-btn"]} disabled={isEmpty}>
                {/* {isPausedMisnomer
                    ? <PauseBtn className={styles["ctrls-svg"]} />
                    : <PlayBtn className={styles["ctrls-svg"]} />
                } */}
            </button>
            <button type="button" onClick={handleForward} className={styles["skipnext-btn"]} disabled={isEmpty}>
                {/* <SkipNextBtn className={styles["ctrls-svg"]} /> */}
            </button>
        </div>
    )
}

export default function Player() {
    // contains the current collection of tracks
    const [tracks, setTracks] = useState([]);
    const [trackIndex, setTrackIndex] = useState(0);
    // contains all tracks
    const [allTracks, setAllTracks] = useState([]);
    const [genre, setGenre] = useState(GENRES['all']);
    const { user, setUser } = useContext(UserContext);
    const supabase = createClientComponentClient();
    // src is url of file being played.
    const { load, playing, togglePlayPause, stop, src } = useGlobalAudioPlayer({ src: null });

    const handleSelectChange = (e) => {
        const newGenre = e.target.value;

        let newTracks;
        if (newGenre === 'all') {
            newTracks = [...allTracks];
        } else {
            newTracks = allTracks.filter(t => t.genre === newGenre);
        }
        setGenre(newGenre);
        setTracks(newTracks);
        setTrackIndex(0);
        // console.log(`new tracks: ${JSON.stringify(newTracks)}`);
        console.log(`changing genre to ${newGenre}`);
    }

    const handleBack = () => {
        // console.log('Skip Back');
        setTrackIndex(trackIndex > 0 ? trackIndex - 1 : tracks.length - 1);
    };

    const handlePlayPause = () => {
        togglePlayPause();
    };

    const handleForward = () => {
        // console.log('Skip Forward');
        setTrackIndex((trackIndex + 1) % tracks.length);
    };

    let queueNowPosOutput = '0'; // text or jsx
    let queueNowSpecialJSX;
    if (tracks.length) {
        queueNowPosOutput = (trackIndex + 1).toString();
        if (trackIndex === 0) {
            queueNowSpecialJSX = (
                <span className={styles["qi-nowspecialcase"]}>
                    (newest)
                </span>
            )
        }
    }

    let totalTimeText = '0:00';
    if (tracks.length) {
        totalTimeText = `${Math.trunc(tracks[trackIndex].duration / 60)}:${(tracks[trackIndex].duration % 60).toString().padStart(2, '0')}`;
    }

    let whenPostedText;
    if (tracks.length) {
        const diffS = (Date.now() - new Date(tracks[trackIndex].created_at)) / 1000;
        const diffM = Math.trunc(diffS / 60);
        const diffH = Math.trunc(diffM / 60);
        whenPostedText = `${diffH}h${diffM % 60}m ago`
    }


    useEffect(() => {
        const fetchTracks = async () => {
            const dayAgo = getDayAgo();
            let data, error;
            // console.log(`USER: ${JSON.stringify(user)}`);
            if (!user) {
                // console.log('logged out');
                ({ data, error } = await supabase.from('tracks').select('*').gt('created_at', dayAgo).order('created_at', { ascending: false }));

            } else {
                // console.log('logged in');
                ({ data, error } = await supabase.rpc('select_tracks', { cur_user_id: user.id }));
                // console.log(`trax for ${user.id}: ${JSON.stringify(data, null, 2)}`);
            }
            if (error) {
                console.log(`ERROR: ${JSON.stringify(error)}`);
            }

            setAllTracks(data ?? []);
            setTracks(data ?? []);
        }
        fetchTracks();
    }, [user?.id]);

    useEffect(() => {
        if (tracks.length) {
            let file_path = tracks[trackIndex].file_path;
            load(`${file_path}`, {
                autoplay: trackIndex === 0 ? false : true,
                html5: true,
                onend: () => setTrackIndex((trackIndex + 1) % tracks.length),
            });
        } else {
            console.log("no tracks found")
        }

        return () => {
            stop();
        }
    }, [load, tracks, trackIndex, stop]);

    return (
        <div className={styles["player-page"]}>
            <div className={styles["player"]}>
                <div className={styles["avi-container"]}>
                    <Avatar userId={!!tracks.length ? tracks[trackIndex].uploader_id : null} size="small" />
                </div>
                {user?.id &&
                    <div className={styles["report-container"]}>
                        <Report contentType='track' contentId={tracks.length ? tracks[trackIndex].id : null} />
                    </div>
                }
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
                <div className={styles["queue-container"]}>
                    <div className={styles["queue-info"]}>
                        <p className={styles["qi-label"]}>Now</p>
                        <p className={styles["qi-val"]}>
                            {queueNowPosOutput} {queueNowSpecialJSX}
                        </p>
                    </div>
                    <div className={styles["queue-info"]}>
                        <p className={styles["qi-label"]}>Total</p>
                        <p className={styles["qi-val"]}>{tracks.length}</p>
                    </div>
                </div>
                <p className={styles["trackposted"]}>{whenPostedText}</p>
                <div className={styles["timeline"]}>
                    <ElapsedTime />
                    <PlaybackBar />
                    {/* <div className={styles["decor-bars"]}>
                        <div className={styles["bar-white"]}></div>
                        <div className={styles["bar-grey"]}></div>
                        <div className={styles["bar-white"]}></div>
                        <div className={styles["bar-grey"]}></div>
                        <div className={styles["bar-white"]}></div>
                        <div className={styles["bar-grey"]}></div>
                    </div> */}
                    <p className={`${styles["tracktime"]} ${styles["totaltime"]}`}>
                        {totalTimeText}
                    </p>
                </div>
                <PlayerControls handleBack={handleBack} handlePlayPause={handlePlayPause} handleForward={handleForward}
                    isPausedMisnomer={playing} isEmpty={!tracks.length}
                />
                <VolumeControls />
            </div>
            <CommentSection trackId={tracks.length ? tracks[trackIndex].id : null} />
        </div>
    );
}