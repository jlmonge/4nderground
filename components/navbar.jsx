'use client';

import { navList, navListElem, floatRight, navListLink, btn } from '../styles/navbar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function Navbar({ user }) {
    const router = useRouter();

    const logout = async () => {
        await fetch(`/auth/logout`, {
            method: 'post',
        });
        router.refresh(); // HACK? This overrides the logout redirect, so that's gone.
        console.log('logout lol')
    };

    return (
        <>
            <nav>
                <ul className={navList}>
                    <li className={navListElem}>
                        <Link className={navListLink} href='/'>Logo</Link>
                    </li>
                    <li className={navListElem}>
                        <Link className={navListLink} href='/player'>Player</Link>
                    </li>
                    <li className={`${navListElem} ${floatRight}`}>
                        <Link className={navListLink} href='/upload'>Upload</Link>
                    </li>
                    <li className={`${navListElem} ${floatRight}`}>
                        {user
                            ? <button onClick={logout} className={btn}>Logout {user.id}</button>
                            : <Link className={navListLink} href='/login'>GET IN!</Link>
                        }
                    </li>
                </ul>
            </nav>
        </>
    )
}