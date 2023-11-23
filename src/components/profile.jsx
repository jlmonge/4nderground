'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css';
const myLinks = [
    {
        pos: "1",
        text: "youtube",
        url: "https://www.youtube.com/",
    },
    {
        pos: "2",
        text: "google",
        url: "https://www.google.com/",
    },
    {
        pos: "3",
        text: "personal site",
        url: "https://www.heavensgate.com/",
    },
];

const yourLinks = [
    {
        pos: "1",
        text: "my home <1 i am someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
    {
        pos: "2",
        text: "my home <2 also someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
    {
        pos: "3",
        text: "my home <3 someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
];

const BTN_SIZE = 24;
const ICON_SIZE = 12;

function ProfileLink({ link, isEditing, userId }) {
    let linkContent;
    if (isEditing) {
        linkContent = (
            <>
                <input type="text" id="edit-link-url" name={`url-${link.pos}`} placeholder="Link URL"
                // onChange={e => {
                //     handleChange({
                //         ...link,
                //         url: e.target.value
                //     });
                // }}
                />
                <input type="text" id="edit-link-text" name={`text-${link.pos}`} placeholder="Link text"
                // onChange={e => {
                //     handleChange({
                //         ...link,
                //         text: e.target.value
                //     });
                // }}
                />
            </>

        )
    } else {
        linkContent = (
            <>
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {link.text}
                </a>
            </>
        )
    }
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
                    {linkContent}
                </div>
            </li>
        </>
    );
}

function ProfileLinks({ userId, isMe }) {
    const [links, setLinks] = useState(null)
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveChanges = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        console.log(`before: ${JSON.stringify(links, null, 2)}`);
        console.log(`formData:`);
        const fieldRegex = new RegExp('^(.+?)-');
        const idRegex = new RegExp('\-(.*)');
        /*
        for (var entry of formData.entries()) {
            // get the field name from start to before 1st '-' in key.
            let field = fieldRegex.match(entry[0]);
            // get user id, which is everything after 1st '-' in key.
            let linkId = idRegex.match(entry[0]);
            let value = entry[1]
            
            console.log(`field: ${field} | linkId: ${linkId} | value: ${value}`);
        }
        */
        setIsEditing(false);
    }

    useEffect(() => {
        console.log(`isMe: ${isMe.toString()}`)
        setLinks(isMe ? myLinks : yourLinks);
    }, [isMe]);

    let linksContent;

    if (links) {
        if (isEditing && isMe) {
            linksContent = (
                <>
                    <form onSubmit={handleSaveChanges}>
                        {links.map((l) =>
                            <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} />
                        )}
                        <button type="submit">Save changes</button>
                    </form>
                </>
            );
        } else if (!isEditing && isMe) {
            linksContent = (
                <>
                    <ul style={{ padding: '0' }}>
                        {links.map((l) =>
                            <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} />
                        )}
                    </ul>
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit links
                    </button>
                </>
            );
        } else {
            linksContent = (
                <>
                    <ul style={{ padding: '0' }}>
                        {links.map((l) =>
                            <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} />
                        )}
                    </ul>
                </>
            );
        }
    }



    return (
        <>
            <section>
                <h3>Links</h3>
                {linksContent}
            </section>
        </>
    );
}

export default function Profile({ userId }) {
    const [isMe, setIsMe] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter(); // next/navigation

    useEffect(() => {
        const getUserId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsMe(user?.id === userId);
            console.log(`my user id: ${user?.id}`);
            console.log(`THE user id: ${userId}`)
            console.log(`are they the same?: ${(user?.id === userId).toString()}`)
        };
        getUserId();
    }, [supabase, userId]);

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
            <ProfileLinks userId={userId} isMe={isMe} />
            {!isMe && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button>Ignore user</button>
                    <button>Block user</button>
                </div>
            )}
            {isMe && <button onClick={logout}>Logout</button>}
        </>
    );
}