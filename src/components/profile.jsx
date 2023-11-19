'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css';

const testLinks = [
    "https://www.youtube.com/",
    "https://www.google.com/",
    "https://www.heavensgate.com/",
];

// we love liberal@6!
// We are hardcoding this for now because this would create
// an ungodly amount of calls to supabase auth if you check
// a lot of profiles. 
// TODO: create a context to retrieve the current user from
const myUserId = 'e290162b-45fa-42c2-8ee1-bc702397b1c7';

const BTN_SIZE = 24;
const ICON_SIZE = 12;

function ProfileLink({ link, userId }) {
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
                        style={{ width: `${ICON_SIZE}`, height: `${ICON_SIZE}` }}
                    />
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {link}
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
                                alt={`Edit link ${link}`}
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
    return (
        <>
            <section>
                <h3>Links</h3>
                <ul style={{ padding: '0' }}>
                    {testLinks.map((link) =>
                        <ProfileLink key={link} link={link} userId={userId} />
                    )}
                </ul>
            </section>
        </>
    );
}

function ProfileTab({ userId }) {
    return (
        <>
            <ProfileLinks userId={userId} />
            {userId !== myUserId && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button>Ignore user</button>
                    <button>Block user</button>
                </div>
            )}
        </>
    );
}

function SettingsTab({ userId }) {
    const router = useRouter(); // next/navigation

    const logout = async () => {
        await fetch(`/auth/logout`, {
            method: 'POST',
        });
        router.refresh();
        console.log('logout lol');
    };

    return (
        <>
            <button onClick={logout}>Logout (TODO: ur id)</button>
            <form action="/auth/change-email">
                <input type="text" name="new-email" />
                <button type="submit">Change email</button>
            </form>
            <form action="/auth/change-password">
                <input type="password" name="new-password" />
                <button>Change password</button>
            </form>
            <button>Delete account</button>
        </>
    );
}

export default function Profile({ userId }) {
    const [tab, setTab] = useState('profile');

    // TODO: see if we need to close dialog before refresh.


    useEffect(() => {
        console.log(`tab is now: ${tab}`)
    }, [tab])

    //const cookieStore = cookies();
    //const supabase = createClientComponentClient({ cookies: () => cookieStore });
    let content;
    if (userId !== myUserId) {
        content = (
            <ProfileTab userId={userId} />
        );
    } else {
        content = (
            <>
                <nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <h2 onClick={() => setTab('profile')} className={tab === 'profile' ? styles.curTab : null}>Profile</h2>
                    <h2 onClick={() => setTab('settings')} className={tab === 'settings' ? styles.curTab : null}>Settings</h2>
                </nav>
                {tab === 'profile' && <ProfileTab />}
                {tab === 'settings' && <SettingsTab />}
            </>
        );
    }

    return (
        <>
            {content}
        </>
    );
}