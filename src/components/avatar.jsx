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

    return userId ? (
        <>
            <dialog
                ref={dialogRef}
                className={styles["dialog"]}
                onClick={handleClose}
            >
                <div className={styles["dialog__inner"]} onClick={e => e.stopPropagation()}>
                    <button
                        id="close"
                        onClick={handleClose}
                        type="button"
                        className={styles["dialog__close"]}
                    >
                        X
                    </button>
                    <Profile userId={userId} handleClose={handleClose} />
                </div>
            </dialog>
            <button
                type="button"
                className={`${styles["aviicon"]} ${size === "small" ? styles["aviicon-small"] : styles["aviicon-big"]}`}
                style={{
                    backgroundColor: `#${userId.slice(0, 6)}`,
                }}
                title={userId} // show userid on hover
                onClick={handleOpen}
            >
                {userId == '5f0e055b-493d-4986-a1d3-c852e91669aa' ? 'TEST' : ''}
            </button>
        </>
    ) : (
        <div
            className={`${styles["aviicon-null"]} ${styles["aviicon"]} ${size === "small" ? styles["aviicon-small"] : styles["aviicon-big"]}`}
        />
    )

}