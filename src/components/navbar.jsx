'use client';

import { navList, navListElem, floatRight, navListLink, btn } from '../styles/navbar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from './avatar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../user-provider';


export default function Navbar() {
    const { user, setUser } = useContext(UserContext);
    //const supabase = createClientComponentClient();

    // useEffect(() => {
    //     const getUser = async () => {
    //         const { data: { user } } = await supabase.auth.getUser();
    //         setCurUser(user);
    //     }
    //     getUser();
    // }, [supabase.auth])

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
                        {user ?
                            (
                                <>
                                    <p>debug: {user.email}</p>
                                    <Avatar userId={user.id} />
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