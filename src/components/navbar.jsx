'use client';

import styles from '../styles/Navbar.module.scss';
import colors from '../styles/Colors.module.scss';
import Link from 'next/link';
import Avatar from './avatar';
import { Suspense, useContext } from 'react';
import { UserContext } from '../user-provider';
import { Logo1 } from './svgs';
import { nunito } from '../app/fonts';

export default function Navbar() {
    const { user } = useContext(UserContext);
    let logo = (
        <div className={styles["logo"]}>
            <Logo1 />
        </div>
    )

    // const textColor = !!user ? colors["ub-text"] : colors["gg-text"];

    return (
        <>
            <a className={styles["skip-to-content"]} href="#main-content">
                Skip to main content
            </a>
            <nav className={`${styles["nav"]} ${colors["gg-text"]} ${nunito.className}`}>
                <Link prefetch={false} href="/" className={styles["logo__container"]}>
                    {logo}
                    <div className={styles["logo__caption"]}>
                        <span className={styles["logo__name"]}>4nderground</span>
                        <span className={styles["logo__memo"]}>BETA</span>
                    </div>
                </Link>

                <div className={styles["nav__links"]}>
                    <Link prefetch={false} className={styles["nav-link"]} href="/player">
                        <span className={styles["nav-text"]}>Player</span>
                    </Link>
                    <Link prefetch={false} className={styles["nav-link"]} href="/upload">
                        <span className={styles["nav-text"]}>Upload</span>
                    </Link>
                    {!user
                        ? <Link prefetch={false} className={styles["nav-link"]} href="/login">
                            <span className={styles["nav-text"]}>Sign In</span>
                        </Link>
                        : <>
                            <div className={styles["avatar-container"]}>
                                <Avatar userId={user.id} />
                            </div>
                        </>
                    }
                </div>
            </nav>
        </>
    );
}