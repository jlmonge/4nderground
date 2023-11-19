'use client';

import { navList, navListElem, floatRight, navListLink, btn } from '../styles/navbar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from './avatar';


export default function Navbar({ user }) {
    return (
        <>
            <nav>
                <ul className={navList}>
                    <li className={navListElem}>
                        <Link className={navListLink} href="/">Logo</Link>
                    </li>
                    <li className={navListElem}>
                        <Link className={navListLink} href="/">Home</Link>
                    </li>
                    <li className={navListElem}>
                        <Link className={navListLink} href="/player">Player</Link>
                    </li>
                    <li className={`${navListElem} ${floatRight}`}>
                        <Link className={navListLink} href="/upload">Upload</Link>
                    </li>
                    <li className={`${navListElem} ${floatRight}`}>
                        {user
                            ? <Avatar userId={user.id} />
                            : <Link className={navListLink} href="/login">GET IN!</Link>
                        }
                    </li>
                </ul>
            </nav>
        </>
    );
}