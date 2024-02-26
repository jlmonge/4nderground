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

function Replace() {
    return (
        <p>replace me</p>
    )
}
// TODO: DECOUPLE (GET POSITION W/ HTML5 AUDIO)
function ElapsedTime() {
    return <Replace />
    // const frameRef = useRef();
    // const [pos, setPos] = useState(0);

    // useEffect(() => {
    //     const animate = () => {
    //         setPos(getPosition())
    //         frameRef.current = requestAnimationFrame(animate)
    //     }

    //     frameRef.current = window.requestAnimationFrame(animate)

    //     return () => {
    //         if (frameRef.current) {
    //             cancelAnimationFrame(frameRef.current)
    //         }
    //     }
    // }, [])

    // return (
    //     
    // )
}

// TODO: DECOUPLE (GET POSITION, DURATION & SET POSITION W/ HTML5 AUDIO)
function PlaybackBar() {
    return <Replace />
    // const { playing, getPosition, duration, seek } = useGlobalAudioPlayer();
    // const [pos, setPos] = useState(0);
    // const frameRef = useRef();
    // const playbackBarRef = useRef(null);

    // useEffect(() => {
    //     const animate = () => {
    //         setPos(getPosition());
    //         frameRef.current = requestAnimationFrame(animate);
    //     }

    //     frameRef.current = window.requestAnimationFrame(animate);

    //     return () => {
    //         if (frameRef.current) {
    //             cancelAnimationFrame(frameRef.current);
    //         }
    //     }
    // }, [getPosition])

    // const handlePlayback = (slider) => {
    //     return seek(slider.target.value);
    // }

    // if (duration === Infinity) return null;

    // return (
    //     <>
    //         <input
    //             className={styles["playback-bar"]}
    //             type="range"
    //             min={0}
    //             max={Math.trunc(duration)}
    //             step={1}
    //             onChange={handlePlayback}
    //             value={Math.trunc(pos)}
    //         />
    //     </>
    // )
}

// TODO: DECOUPLE (GET+SET VOLUME W/ HTML5 AUDIO)
function VolumeControls() {
    return <Replace />
    // const { volume, setVolume } = useGlobalAudioPlayer();

    // const handleVolume = useCallback((slider) => {
    //     return setVolume(slider.target.value);
    // }, [setVolume]);

    // return (
    //     <div className={styles["vol-container"]}>
    //         <span className={styles["vol-label"]}>Vol</span>
    //         <input
    //             className={styles["vol-slider"]}
    //             type="range"
    //             min={0}
    //             max={1}
    //             step={0.01}
    //             onChange={handleVolume}
    //             value={volume}
    //         />
    //     </div>
    // )
}

function PlayerControls({ handleBack, handlePlayPause, handleForward, isPaused, isEmpty }) {
    return (
        <div className={styles["ctrls-container"]}>
            <button type="button" onClick={handleBack} className={styles["skipback-btn"]} disabled={isEmpty}>
                {/* <SkipBackBtn className={styles["ctrls-svg"]} /> */}
            </button>
            <button type="button" onClick={handlePlayPause}
                className={isPaused ? styles["play-btn"] : styles["pause-btn"]} disabled={isEmpty}>
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

// TODO: DECOUPLE (GET+SET PLAYING STATUS, SET TRACKS W/ HTML5 AUDIO)
export default function Player() {
    // contains the current collection of tracks (depends on genre)
    const [tracks, setTracks] = useState([]);
    const [trackIndex, setTrackIndex] = useState(0);
    // contains all tracks (regardless of genre)
    const [allTracks, setAllTracks] = useState([]);
    const [genre, setGenre] = useState(GENRES['all']);
    const [loading, setLoading] = useState(true);
    const [paused, setPaused] = useState(true);
    const [curTime, setCurTime] = useState(0);
    const { user } = useContext(UserContext);
    const supabase = createClientComponentClient();
    const audioRef = useRef(null);

    // e properties: isTrusted (??)
    const handleTimeUpdate = (e) => {
        const time = audioRef.current.currentTime;
        // console.log(`time updated: ${time}`);
        setCurTime(time);
    }

    const handleGenreChange = (e) => {
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
        if (tracks.length) {
            setTrackIndex(trackIndex > 0 ? trackIndex - 1 : tracks.length - 1);
            setPaused(false);
            audioRef.current.play();
            audioRef.current.autoplay = true;
        }
    };

    const handlePlayPause = () => {
        const isPlaying = audioRef.current.currentTime > 0 &&
            !audioRef.current.paused &&
            !audioRef.current.ended &&
            audioRef.current.readyState > audioRef.current.HAVE_CURRENT_DATA;

        if (!isPlaying) {
            console.log("was paused, now playing");
            setPaused(false);
            audioRef.current.play();
            audioRef.current.autoplay = true;

        } else {
            console.log("was playing, now paused");
            setPaused(true);
            audioRef.current.pause();
            audioRef.current.autoplay = false;
        }
    };

    const handleForward = () => {
        if (tracks.length) {
            setTrackIndex((trackIndex + 1) % tracks.length);
            setPaused(false);
            audioRef.current.play();
            audioRef.current.autoplay = true;
        }
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
        whenPostedText = `${diffH}h${diffM % 60}m ago`;
    }

    useEffect(() => {
        setLoading(true);
        const fetchTracks = async () => {
            const dayAgo = getDayAgo();
            let data, error;
            // console.log(`USER: ${JSON.stringify(user)}`);

            // must be one line; doesn't work otherwise
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
        setLoading(false);
        // audioRef.current.onended = handleEnded;
        // audioRef.current.ontimeupdate = handleTimeUpdate;
    }, [user]);

    useEffect(() => {
        if (tracks.length) {
            let file_path = tracks[trackIndex].file_path;
            audioRef.current.currentTime = 0;
            audioRef.current.src = file_path;
        } else {
            console.log("no tracks found")
        }
    }, [tracks, trackIndex]);

    return (
        <div className={styles["player-page"]}>
            {loading ? <p>Loading...</p> : null}
            <div className={styles["player"]}>
                <audio
                    ref={audioRef}
                    onEnded={handleForward}
                    onTimeUpdate={handleTimeUpdate}
                />
                <div className={styles["avi-container"]}>
                    <Avatar userId={(!!tracks.length) ? tracks[trackIndex].uploader_id : null} size="small" />
                </div>
                {user?.id &&
                    <div className={styles["report-container"]}>
                        <Report contentType='track' contentId={(tracks.length) ? tracks[trackIndex].id : null} />
                    </div>
                }
                <div className={styles["genre-container"]}>
                    <label htmlFor="genre" className={styles["genre-label"]}>Genre</label>
                    <div className={styles["genreselect-container"]}>
                        <select id="genre" className={styles["genreselect"]} name="genre" onChange={handleGenreChange}>
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
                    <p className={`${styles["tracktime"]} ${styles["curtime"]}`}>{`${Math.trunc(curTime / 60)}:${Math.trunc(curTime % 60).toString().padStart(2, '0')}`}</p>
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
                    isPaused={paused} isEmpty={!tracks.length}
                />
                <VolumeControls />
            </div>
            <p>{curTime}</p>
            <p>debug: trackIndex: {trackIndex}</p>
            <p>debug: tracks: {JSON.stringify(tracks, null, 2)}</p>
            <p>debug: tracks.length: {tracks.length}</p>
            <CommentSection trackId={(tracks.length) ? tracks[trackIndex].id : null} />
        </div>
    );
}