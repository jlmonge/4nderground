'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css';

const myLinks = [
    {
        id: 0,
        text: "youtube",
        url: "https://www.youtube.com/",
    },
    {
        id: 1,
        text: "google",
        url: "https://www.google.com/",
    },
    {
        id: 2,
        text: "personal site",
        url: "https://www.heavensgate.com/",
    },
];

const yourLinks = [
    {
        id: 3,
        text: "my home <1 i am someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
    {
        id: 4,
        text: "my home <2 also someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
    {
        id: 5,
        text: "my home <3 someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
];

// we love jerry@jerry!
// We are hardcoding this for now because this would create
// an ungodly amount of calls to supabase auth if you check
// a lot of profiles. 
// TODO: create a context to retrieve the current user from
const myUserId = 'e290162b-45fa-42c2-8ee1-bc702397b1c7';

const BTN_SIZE = 24;
const ICON_SIZE = 12;

function ProfileLink({ url, text, userId }) {
    return (
        <>
            <li style={{ listStyle: 'none' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px'
                }}>
                    <Image
                        src="link.svg"
                        alt="Link icon"
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                        style={{ width: 'auto', height: 'auto' }}
                    />
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {text}
                    </a>
                    {userId === myUserId &&
                        <button
                            type="button"
                            style={{
                                width: `${BTN_SIZE}px`,
                                height: `${BTN_SIZE}px`,
                                position: 'relative',
                                marginLeft: 'auto',
                            }}
                        >
                            <Image
                                src="edit-2.svg"
                                alt="Edit link"
                                sizes={BTN_SIZE}
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </button>
                    }

                </div>
            </li>
        </>
    );
}

function ProfileLinks({ userId }) {
    const [links, setLinks] = useState(userId == myUserId ? myLinks : yourLinks)

    useEffect(() => {
        console.log(`getting the links of: ${userId}. im ${myUserId} btw`);
    }, [])

    return (
        <>
            <section>
                <h3>Links</h3>
                <ul style={{ padding: '0' }}>
                    {links.map((l) =>
                        <ProfileLink key={l.id} url={l.url} text={l.text} userId={userId} />
                    )}
                </ul>
            </section>
        </>
    );
}

export default function Profile({ userId }) {

    const router = useRouter(); // next/navigation

    // TODO: see if we need to close dialog before refresh.
    const logout = async () => {
        await fetch(`/auth/logout`, {
            method: 'POST',
        });
        router.refresh();
        console.log('logout lol');
    };

    //const cookieStore = cookies();
    //const supabase = createClientComponentClient({ cookies: () => cookieStore });
    return (
        <>
            <p>Hi I&apos;m {userId}</p>
            <ProfileLinks userId={userId} />
            {userId !== myUserId && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button>Ignore user</button>
                    <button>Block user</button>
                </div>
            )}
            {userId === myUserId && <button onClick={logout}>Logout</button>}
        </>
    );
}