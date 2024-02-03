'use client';

// TODO: make the height 100% of its parent container,
// TODO: and the width the same as its height

import { useRef, useEffect } from 'react';
import Profile from './profile';
import styles from '../styles/Avatar.module.scss';

export default function Avatar({ userId, size = "large" }) {
    const dialogRef = useRef(null);

    function handleOpen() {
        dialogRef.current.showModal();
    }

    function handleClose() {
        dialogRef.current.close();
    }

    return (
        <>
            <dialog ref={dialogRef} style={{
                backgroundColor: 'black',
                color: 'white',
                height: '512px',
                width: '90vw',
            }}>
                <button
                    id="close"
                    onClick={handleClose}
                    type="button"
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        backgroundColor: 'transparent',
                        borderStyle: 'none',
                        padding: '0',
                        margin: '2px',
                        fontSize: '16px',
                        color: 'white',
                    }}
                >
                    X
                </button>
                <Profile userId={userId} handleClose={handleClose} />
            </dialog>
            <div
                className={`${styles["aviicon"]} ${size === "small" ? styles["aviicon-small"] : styles["aviicon-big"]}`}
                style={{
                    backgroundColor: `#${userId.slice(0, 6)}`,
                }}
                title={userId ?? 'disappointing.'} // show userid on hover
                onClick={handleOpen}
            />
        </>
    );
}