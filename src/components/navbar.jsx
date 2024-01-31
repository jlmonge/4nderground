'use client';

import styles from '../styles/Navbar.module.scss';
import colors from '../styles/Colors.module.scss';
import Link from 'next/link';
import Avatar from './avatar';
import { useContext } from 'react';
import { UserContext } from '../user-provider';
import { Logo1 } from './svgs';
import { nunito } from '../app/fonts';

export default function Navbar() {
    const { user } = useContext(UserContext);
    let logo = (
        <Link href="/">
            <div className={styles["logo"]}>
                <Logo1 />
            </div>
        </Link>
    )

    // const textColor = !!user ? colors["ub-text"] : colors["gg-text"];

    return (
        <>
            <nav className={`${styles["nav"]} ${colors["gg-text"]} ${nunito.className}`}>
                <div className={styles["all-flow"]}>
                    {logo}
                    <Link className={styles["nav-link"]} href="/player">
                        <span className={styles["nav-text"]}>Player</span>
                    </Link>
                </div>
                <div className={styles["user-flow"]}>
                    {!user
                        ? <Link className={styles["nav-link"]} href="/login">
                            <span className={styles["nav-text"]}>Sign In</span>
                        </Link>
                        : <>
                            <div className={styles["avatar-container"]}>
                                <Avatar userId={user.id} />
                            </div>
                            <Link className={styles["nav-link"]} href="/upload">
                                <span className={styles["nav-text"]}>Upload</span>
                            </Link>
                        </>
                    }
                </div>
            </nav>
        </>
    );
}