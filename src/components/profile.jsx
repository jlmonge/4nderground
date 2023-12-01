'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css';
import { varLog } from '../utils/helpers';
import Link from 'next/link';
import { UserContext } from '../user-provider';

const BTN_SIZE = 24;
const ICON_SIZE = 12;

function ProfileLink({ link, isEditing, onDelete, onChange }) {
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
                        className="link-input"
                        required
                        value={link.url}
                        onChange={e => {
                            onChange({
                                ...link,
                                url: e.target.value,
                            });
                        }}
                    />
                </label>
                <label>
                    <input
                        type="text"
                        //id={`edit-link-text-${(link.pos).toString()}`}
                        name="edit-link-text" // TODO: CONST!!
                        placeholder="Link text"
                        className="link-input"
                        value={link.text}
                        required
                        onChange={e => {
                            onChange({
                                ...link,
                                text: e.target.value,
                            });
                        }}
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
                    alignItems: 'center',
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

function ProfileLinks({ userId, isMe, db }) {
    const [links, setLinks] = useState([]); // links that are displayed to everyone
    const [draftLinks, setDraftLinks] = useState([]); // links as seen in edit mode
    const [draftPos, setDraftPos] = useState(1);
    const [status, setStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchLinks = async () => {
            const { data, error } = await db
                .from('links')
                .select('pos, url, text')
                .eq('user_id', userId)
                .neq('url', '');
            //varLog({ data });
            setLinks(data);
        };
        fetchLinks();
    }, [db, userId]);// do not put links in this array.moron.

    const handleStartEdit = () => {
        setIsEditing(true);
        setDraftLinks([...links]);
        setDraftPos(links.length + 1);
    };

    const handleAddLink = () => {
        console.log(`draftPos: ${draftPos}`)
        if (draftPos <= 3) { // btn disabled once pos reaches 4, but this is a failsafe
            setDraftLinks([...draftLinks, {
                pos: draftPos,
                url: '',
                text: '',
            }]);
            setDraftPos(draftPos + 1);
        }
    };

    const handleChangeLink = (link) => {
        setDraftLinks(draftLinks.map(l => {
            if (l.pos === link.pos) {
                return link;
            } else {
                return l;
            }
        }))
    }

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

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        console.log(`before: ${JSON.stringify(links, null, 2)}`);
        console.log(`formData:`);
        const fieldRegex = new RegExp('^(.+?)-');
        const idRegex = new RegExp('\-(.*)');
        let newLinks = [];
        let newLink = {};
        let pos = 1;

        for (let entry of formData.entries()) {
            let fieldName = entry[0];
            let fieldValue = entry[1];
            console.log(`entry: ${entry}`);
            if (fieldName === 'edit-link-url') {
                newLink['pos'] = pos;
                newLink['url'] = fieldValue;
            } else if (fieldName === 'edit-link-text') {
                newLink['text'] = fieldValue;
                console.log(`newLink: ${JSON.stringify(newLink)}`);
                newLinks.push(newLink);
                console.log(`newLinks: ${newLinks}`);
                newLink = {};
                pos++;
            }
        }

        const res = await fetch('/api/save-links', {
            method: 'POST',
            body: JSON.stringify({ oldLinks: links, newLinks, userId }),
        });
        const resJson = await res.json()
        if (!res.ok) {
            console.log("changes could not be saved. tough.")
        } else {
            setIsEditing(false);
            setLinks([...newLinks]);
        }
        setStatus(resJson.message)

    };

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
                        <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} onDelete={handleDeleteLink} onChange={handleChangeLink} />
                    )}
                    <button
                        type="submit"
                        // TODO: disable save if no new information (is this worth the)
                        // TODO: possible performance hit?)
                        disabled={JSON.stringify(draftLinks) === JSON.stringify(links)}
                    >
                        Save changes
                    </button>
                </form>
                <button
                    type="button"
                    onClick={handleAddLink}
                    disabled={draftLinks.length >= 3}
                >
                    Add link
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                <p>{status}</p>
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
                <p>links debug: {JSON.stringify(links)}</p>
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

export default function Profile({ userId, handleClose }) {
    const [isMe, setIsMe] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter(); // next/navigation
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        setIsMe(user?.id === userId);
        // console.log(`my user id: ${user?.id}`);
        // console.log(`THE user id: ${userId}`);
        // console.log(`are they the same?: ${(user?.id === userId).toString()}`);
    }, [user, userId]);


    const logout = async () => {
        await fetch(`/auth/logout`, {
            method: 'POST',
        });
        setUser(null);
        handleClose();
        router.refresh();
        console.log('logout lol');
    };

    //const cookieStore = cookies();
    //const supabase = createClientComponentClient({ cookies: () => cookieStore });
    return (
        <>
            <p>{userId} {isMe && '(you)'}</p>
            <ProfileLinks userId={userId} isMe={isMe} db={supabase} />
            {!isMe && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button>Ignore user</button>
                    <button>Block user</button>
                </div>
            )}
            {isMe &&
                <>
                    <Link href="/settings" onClick={handleClose}>Settings</Link>
                    <button onClick={logout}>Logout</button>
                </>
            }
        </>
    );
}