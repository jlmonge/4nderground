'use client';

import { navList, navListElem, floatRight, navListLink, btn } from '../styles/navbar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from './avatar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';


export default function Navbar() {
    const [curUser, setCurUser] = useState(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurUser(user);
        }
        getUser();
    }, [])

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
                        {curUser ?
                            (
                                <>
                                    <p>debug: {curUser.email}</p>
                                    <Avatar userId={curUser.id} />
                                </>
                            ) :
                            <Link className={navListLink} href="/login">GET IN!</Link>
                        }
                    </li>
                </ul>
            </nav>
        </>
    );
}