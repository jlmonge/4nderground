'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css';
const myLinks = [
    {
        pos: 1,
        text: "youtube",
        url: "https://www.youtube.com/",
    },
    {
        pos: 2,
        text: "google",
        url: "https://www.google.com/",
    },
    {
        pos: 3,
        text: "personal site",
        url: "https://www.heavensgate.com/",
    },
];

const yourLinks = [
    {
        pos: 1,
        text: "my home <1 i am someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
    {
        pos: 2,
        text: "my home <2 also someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
    {
        pos: 3,
        text: "my home <3 someone else",
        url: "https://en.wikipedia.org/wiki/Main_Page",
    },
];

const BTN_SIZE = 24;
const ICON_SIZE = 12;

function ProfileLink({ link, isEditing, onDelete, userId }) {
    let linkContent;
    if (isEditing) {
        linkContent = (
            <>
                <label>
                    <input
                        type="text"
                        //id={`edit-link-url-${(link.pos).toString()}`} 
                        name="edit-link-url"
                        placeholder="Link URL"
                    />
                </label>
                <label>
                    <input
                        type="text"
                        //id={`edit-link-text-${(link.pos).toString()}`}
                        name="edit-link-text"
                        placeholder="Link text"
                    />
                </label>

                {
                    isEditing &&
                    <button
                        onClick={() => onDelete(link.pos)}
                        type="button"
                        title="Delete link"
                        //aria-label="Delete comment" // TODO: accessibility update
                        //role="button"
                        style={{
                            width: `${BTN_SIZE}px`,
                            height: `${BTN_SIZE}px`,
                            position: 'relative',
                        }}
                    >
                        <Image
                            src="trash-2.svg"
                            alt="Delete comment icon"
                            sizes={BTN_SIZE}
                            fill
                            style={{ objectFit: 'contain' }} // optional
                        />
                    </button>
                }

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
                    <p>{link.pos}</p>
                    {linkContent}
                </div>
            </li>
        </>
    );
}

function ProfileLinks({ userId, isMe }) {
    const [links, setLinks] = useState([]); // links that are displayed to everyone
    const [draftLinks, setDraftLinks] = useState([]); // links as seen in edit mode
    const [draftPos, setDraftPos] = useState(1)
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveChanges = (e) => {
        e.preventDefault();

        setLinks([...draftLinks]);
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
    };

    const handleAddLink = () => {
        console.log(`draftPos: ${draftPos}`)
        if (draftPos <= 3) { // btn disabled once pos reaches 4, but this is a failsafe
            setDraftLinks([...draftLinks, {
                pos: draftPos,
                text: '',
                url: '',
            }]);
            setDraftPos(draftPos + 1);
        }
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setDraftLinks([...links]);
        setDraftPos(1);
    };

    const handleDeleteLink = (pos) => {
        const deleted = draftLinks.filter(l => l.pos !== pos);
        setDraftLinks(
            deleted.map((link, i) => ({
                ...link,
                pos: i + 1,
            }))
        );
        setDraftPos(draftPos - 1)
    }

    // useEffect(() => {
    //     console.log(`isMe: ${isMe.toString()}`)
    //     setLinks(isMe ? myLinks : yourLinks);
    // }, [isMe]);

    let linksContent;

    if (isEditing && isMe) {
        linksContent = (
            <>
                <form onSubmit={handleSaveChanges}>
                    {draftLinks.map((l, idx) =>
                        <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} onDelete={handleDeleteLink} />
                    )}
                    <button type="submit" disabled={JSON.stringify(draftLinks) === JSON.stringify(links)}>Save changes</button>
                </form>
                <button
                    type="button"
                    onClick={handleAddLink}
                    disabled={draftLinks.length >= 3}
                >
                    Add link
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                <p>draftLinks debug: {JSON.stringify(draftLinks)}</p>
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
                <button type="button" onClick={handleStartEdit}>
                    Edit links
                </button>
            </>
        );
    } else {
        linksContent = (
            <>
                <p>this not u just sayin lol</p>
                <ul style={{ padding: '0' }}>
                    {links.map((l) =>
                        <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} />
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
            <p>{userId} {isMe && '(you)'}</p>
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