'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Fragment, Suspense, useEffect, useState, useRef, useContext, useCallback } from 'react';
import { UserContext } from '../user-provider';
import Report from './report';
import CommentSection from '../components/comment-section';
import Avatar from './avatar';
import { GENRES } from '../utils/constants';
import { getDayAgo } from '../utils/helpers';
import styles from '../styles/Player.module.scss'

const BTN_SIZE = 24;
const DEBUG = false; // redundant; replace soon

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
    const [volume, setVolume] = useState(1);
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
            audioRef.current.play()
                .then(_ => {
                    audioRef.current.autoplay = true;
                })
                .catch(e => {
                    // prevents "play() was interrupted by load()" error, which
                    // is caused by rapidly pressing back/next or letting the
                    // current track end. this does not seem to affect
                    // performance or user experience
                });

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
            audioRef.current.play()
                .then(_ => {
                    audioRef.current.autoplay = true;
                })
                .catch(e => {
                    // prevents "play() was interrupted by load()" error, which
                    // is caused by rapidly pressing back/next or letting the
                    // current track end. this does not seem to affect
                    // performance or user experience
                });
        }
    };

    const handleSeek = (e) => {
        if (tracks.length) {
            audioRef.current.currentTime = e.target.value;
        }
    };

    const handleVolume = (e) => {
        if (tracks.length) {
            audioRef.current.volume = e.target.value;
            setVolume(e.target.value);
        }
    };

    let queueNowPosOutput = '0'; // text or jsx
    let queueNowSpecialJSX;
    if (tracks.length) {
        queueNowPosOutput = (trackIndex + 1).toString();
        if (trackIndex === 0) {
            queueNowSpecialJSX = (
                <span className={styles["qinfo__nowspecialcase"]}>
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
    }, [user]);

    useEffect(() => {
        if (tracks.length) {
            let file_path = tracks[trackIndex].file_path;
            audioRef.current.currentTime = 0;
            audioRef.current.src = file_path;
            audioRef.current.load();
        } else {
            // console.log("no tracks found")
        }
    }, [tracks, trackIndex]);

    return (
        <div className={styles["player-page"]}>
            {
                loading &&
                <div className={styles["loading"]}>
                    <span className={styles["loading__text"]}>Loading...</span>
                </div>
            }
            <div className={styles["player"]}>
                <div className={styles["player__header"]}>
                    <h1 className={styles["h1"]}>Player</h1>
                </div>
                <div className={styles["player__body"]}>
                    <div className={styles["viz"]}>
                        <div className={styles["genre-container"]}>
                            <label htmlFor="genre" className={styles["visually-hidden"]}>Select player genre</label>
                            <select id="genre" className={styles["genreselect"]} name="genre" onChange={handleGenreChange}>
                                {
                                    Object.entries(GENRES).map(([key, str]) =>
                                        <option className={styles["genreselect-option"]} key={key} value={key}>{str}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            Visualizer in development
                        </div>
                        <audio
                            ref={audioRef}
                            onEnded={handleForward}
                            onTimeUpdate={handleTimeUpdate}
                        />
                    </div>
                    <div className={styles["timeline"]}>
                        <div className={styles["timeline__times"]}>
                            <span className={`${styles["tracktime"]} ${styles["curtime"]}`}>{`${Math.trunc(curTime / 60)}:${Math.trunc(curTime % 60).toString().padStart(2, '0')}`}</span>
                            <span className={`${styles["tracktime"]} ${styles["totaltime"]}`}>
                                {totalTimeText}
                            </span>
                        </div>
                        {tracks.length ?
                            <input
                                className={styles["playback-bar"]}
                                type="range"
                                min={0}
                                max={tracks.length ? Math.trunc(tracks[trackIndex].duration) : 0}
                                step={1}
                                onChange={handleSeek}
                                value={Math.trunc(curTime)}
                            /> :
                            <div className={styles["decor-bars"]}>
                                <div className={styles["bar-white"]}></div>
                                <div className={styles["bar-grey"]}></div>
                                <div className={styles["bar-white"]}></div>
                                <div className={styles["bar-grey"]}></div>
                                <div className={styles["bar-white"]}></div>
                                <div className={styles["bar-grey"]}></div>
                            </div>}
                    </div>
                    <div className={styles["player__user"]}>
                        <div className={styles["pinfo"]}>
                            <div className={styles["pinfo__user"]}>
                                <div className={styles["avi"]}>
                                    <Avatar userId={(!!tracks.length) ? tracks[trackIndex].uploader_id : null} size="small" />
                                    <div className={styles["avi__text"]}>
                                        <span className={styles["genreposted"]}>{tracks.length ? tracks[trackIndex].genre : null}</span>
                                        <span className={styles["whenposted"]}>{whenPostedText}</span>
                                    </div>
                                </div>
                                {(user?.id && !!tracks.length) &&
                                    <div className={styles["report"]}>
                                        <Report contentType='track' contentId={(tracks.length) ? tracks[trackIndex].id : null} />
                                    </div>
                                }
                            </div>
                            <div className={styles["queue"]}>
                                <div className={styles["qinfo"]}>
                                    <span className={styles["qinfo__label"]}>Now</span>
                                    <span className={styles["qinfo__counter"]}>
                                        {queueNowPosOutput} {queueNowSpecialJSX}
                                    </span>
                                </div>
                                <div className={styles["qinfo"]}>
                                    <span className={styles["qinfo__label"]}>Total</span>
                                    <span className={styles["qinfo__counter"]}>{tracks.length}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles["ctrls"]}>
                            <div className={styles["ctrls__btns"]}>
                                <button type="button" onClick={handleBack} className={styles["skipback-btn"]} disabled={!tracks.length}>
                                    {/* <SkipBackBtn className={styles["ctrls-svg"]} /> */}
                                </button>
                                <button type="button" onClick={handlePlayPause}
                                    className={paused ? styles["play-btn"] : styles["pause-btn"]} disabled={!tracks.length}>
                                    {/* {isPausedMisnomer
                                        ? <PauseBtn className={styles["ctrls-svg"]} />
                                        : <PlayBtn className={styles["ctrls-svg"]} />
                                    } */}
                                </button>
                                <button type="button" onClick={handleForward} className={styles["skipnext-btn"]} disabled={!tracks.length}>
                                    {/* <SkipNextBtn className={styles["ctrls-svg"]} /> */}
                                </button>
                            </div>
                            <button type="button" className={styles["report-btn"]} disabled={!tracks.length}>
                                {/* <SkipNextBtn className={styles["ctrls-svg"]} /> */}
                            </button>
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
                        </div>
                    </div>
                </div>
            </div>
            {/* <p>{curTime}</p>
            <p>debug: volume: {volume}</p>
            <p>debug: trackIndex: {trackIndex}</p>
            <p>debug: tracks: {JSON.stringify(tracks, null, 2)}</p>
            <p>debug: tracks.length: {tracks.length}</p> */}
            <CommentSection trackId={(tracks.length) ? tracks[trackIndex].id : null} />
        </div>
    );
}