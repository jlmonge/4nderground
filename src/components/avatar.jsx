'use client';

// TODO: make the height 100% of its parent container,
// TODO: and the width the same as its height

import { useRef, useEffect } from 'react';
import Profile from './profile';
import styles from '../styles/Avatar.module.scss';

const testUsers = new Set([
    '5f0e055b-493d-4986-a1d3-c852e91669aa', // "tom"
    '86e6e7e7-f48f-470b-9adf-1fb018bacbe0', // "harry"
    'e290162b-45fa-42c2-8ee1-bc702397b1c7', // "jerry"
])

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
                {testUsers.has(userId) ? 'TEST' : ''}
            </button>
        </>
    ) : (
        <div
            className={`${styles["aviicon-null"]} ${styles["aviicon"]} ${size === "small" ? styles["aviicon-small"] : styles["aviicon-big"]}`}
        />
    )

}