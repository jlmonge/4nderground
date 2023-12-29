'use client';

import styles from '../styles/Navbar.module.scss';
import Link from 'next/link';
import Avatar from './avatar';
import { useContext } from 'react';
import { UserContext } from '../user-provider';
import Image from 'next/image';

export default function Navbar() {
    const { user } = useContext(UserContext);
    let logo = (
        <Link href="/">
            <div className={styles["header-logo"]}>
                <Image
                    src="logo1.svg"
                    fill={true}
                    alt="4nderground logo"
                />
            </div>

        </Link>
    )
    let content;

    if (!user) {
        content = (
            <>
                <header className={styles["header"]}>
                    {logo}
                    <nav className={styles["guestnav"]}>
                        <Link className={styles["nav-link"]} href="/player">PLAYER</Link>
                        <Link className={styles["nav-link"]} href="/login">SIGN IN</Link>
                    </nav>
                </header>
            </>
        )
    } else {
        content = (
            <>
                <header className={styles["header"]}>
                    {logo}
                    <nav className={styles["nav"]}>
                        <Link className={styles["nav-link"]} href="/player">PLAYER</Link>
                        <Link className={styles["nav-link"]} href="/upload">UPLOAD</Link>
                    </nav>
                    <div className={styles["avatar-container"]}>
                        <Avatar userId={user.id} />
                    </div>
                </header>
            </>
        )

    }

    return (
        <>
            {content}
        </>
    );
}