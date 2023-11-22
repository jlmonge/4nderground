'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css';
const myLinks = {
    "0": {
        id: "0",
        text: "youtube",
        url: "https://www.youtube.com/",
    },
    "1": {
        id: "1",
        text: "google",
        url: "https://www.google.com/",
    },
    "2": {
        id: "2",
        text: "personal site",
        url: "https://www.heavensgate.com/",
    },
};

const yourLinks = {
    "0": {
        id: "0",
        text: "my home <1 i am someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
    "1": {
        id: "1",
        text: "my home <2 also someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
    "2": {
        id: "2",
        text: "my home <3 someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
};

// we love jerry@jerry!
// We are hardcoding this for now because this would create
// an ungodly amount of calls to supabase auth if you check
// a lot of profiles. 
// TODO: create a context to retrieve the current user from
const myUserId = 'e290162b-45fa-42c2-8ee1-bc702397b1c7';

const BTN_SIZE = 24;
const ICON_SIZE = 12;

function ProfileLink({ link, isEditing, userId }) {
    let linkContent;
    if (isEditing) {
        linkContent = (
            <>
                <input type="text" id="edit-link-url" name={`url-${link.id}`} placeholder="Link URL"
                // onChange={e => {
                //     handleChange({
                //         ...link,
                //         url: e.target.value
                //     });
                // }}
                />
                <input type="text" id="edit-link-text" name={`text-${link.id}`} placeholder="Link text"
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

function ProfileLinks({ userId }) {
    const [links, setLinks] = useState(userId == myUserId ? myLinks : yourLinks)
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveChanges = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        console.log(`before: ${JSON.stringify(links, null, 2)}`);
        console.log(`formData:`);
        formData.forEach((value, key));
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
        console.log(`getting the links of: ${userId}. im ${myUserId} btw`);
    }, []);

    let linksContent;

    if (isEditing && userId === myUserId) {
        linksContent = (
            <>
                <form onSubmit={handleSaveChanges}>
                    {links.map((l) =>
                        <ProfileLink key={l.id} link={l} isEditing={isEditing} userId={userId} />
                    )}
                    <button type="submit">Save changes</button>
                </form>
            </>
        );
    } else if (!isEditing && userId === myUserId) {
        linksContent = (
            <>
                <ul style={{ padding: '0' }}>
                    {links.map((l) =>
                        <ProfileLink key={l.id} link={l} isEditing={isEditing} userId={userId} />
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
                        <ProfileLink key={l.id} link={l} isEditing={isEditing} userId={userId} />
                    )}
                </ul>
            </>
        );
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

    const router = useRouter(); // next/navigation

    // TODO: see if we need to close dialog before refresh, or if refresh
    // TODO: closes it for us.
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
                    <button onClick={logout}>Logout</button>
                </div>
            )}
            {// TODO: remove logout from above ^^ only for debugging lol 
            }
            {userId === myUserId && <button onClick={logout}>Logout</button>}
        </>
    );
}