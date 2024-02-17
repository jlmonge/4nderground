'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { varLog } from '../utils/helpers';
import Link from 'next/link';
import { UserContext } from '../user-provider';
import Report from './report';
import styles from '../styles/Profile.module.scss';
import FancyLink from './Shared/fancylink';

const BTN_SIZE = 24;
const ICON_SIZE = 12;

function ProfileLink({ link, isEditing, onDelete, onChange }) {
    let linkContent;
    if (isEditing) {
        linkContent = (
            <>
                <label htmlFor={`edit-link${(link.pos).toString()}-url`} className={styles["visually-hidden"]}>Edit link text</label>
                <input
                    type="text"
                    id={`edit-link${(link.pos).toString()}-url`}
                    name="edit-link-url"
                    placeholder="Link URL"
                    className={styles["input"]}
                    required
                    value={link.url}
                    onChange={e => {
                        onChange({
                            ...link,
                            url: e.target.value,
                        });
                    }}
                />
                <label htmlFor={`edit-link${(link.pos).toString()}-text`} className={styles["visually-hidden"]}>Edit link text</label>
                <input
                    type="text"
                    id={`edit-link${(link.pos).toString()}-text`}
                    name="edit-link-text" // TODO: CONST!!
                    placeholder="Link text"
                    className={styles["input"]}
                    value={link.text}
                    required
                    onChange={e => {
                        onChange({
                            ...link,
                            text: e.target.value,
                        });
                    }}
                />


                {
                    isEditing &&
                    <button
                        onClick={() => onDelete(link.pos)}
                        type="button"
                        title="Delete link"
                        //aria-label="Delete comment" // TODO: accessibility update
                        //role="button"
                        className={styles["btn__red"]}
                    >
                        X
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
            <li className={styles["link__li"]}>
                <p>{link.pos}</p>
                {linkContent}
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

        const res = await fetch('/api/links', {
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
                <form onSubmit={handleSaveChanges} className={styles["form"]}>
                    <ol className={styles["links"]}>
                        {draftLinks.map((l, idx) =>
                            <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} onDelete={handleDeleteLink} onChange={handleChangeLink} />
                        )}
                    </ol>
                    <button
                        type="button"
                        className={styles["btn"]}
                        onClick={handleAddLink}
                        disabled={draftLinks.length >= 3}
                    >
                        Add link
                    </button>
                    <div className={styles["form__btns"]}>
                        <button type="button" className={styles["btn"]} onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                        <button
                            className={styles["btn__save-links"]}
                            type="submit"
                            // TODO: disable save if no new information (is this worth the)
                            // TODO: possible performance hit?)
                            disabled={JSON.stringify(draftLinks) === JSON.stringify(links)}
                        >
                            Save changes
                        </button>
                    </div>
                </form>
                <p>{status}</p>
                {/* <p>draftLinks debug: {JSON.stringify(draftLinks)}</p> */}
            </>
        );
    } else if (!isEditing && isMe) {
        linksContent = (
            <>
                <ol className={styles["links"]}>
                    {links.map((l) =>
                        <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} />
                    )}
                </ol>
                <button className={styles["btn"]} type="button" onClick={handleStartEdit}>
                    Edit links
                </button>
                {/* <p>links debug: {JSON.stringify(links)}</p> */}
            </>
        );
    } else {
        linksContent = (
            <>
                {/* <p>this not u just sayin lol</p> */}
                <ul className={styles["links"]}>
                    {links.map((l) =>
                        <ProfileLink key={l.pos} link={l} isEditing={isEditing} userId={userId} />
                    )}
                </ul>
            </>
        );
    }

    return (
        <>
            <section className={styles["links__section"]}>
                <h3 className={styles["links__heading"]}>Links</h3>
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
        // console.log('logout lol');
    };

    // const handleCloseTest = () => {
    //     handleClose();
    //     console.log("clicked; closing");
    // }

    const handleAddRestrict = async (urID, action) => {
        if (!user) {
            console.log('You must be logged in to perform this action.')
            return;
        }
        const data = new FormData();
        data.append('myID', user.id);
        data.append('urID', urID);
        const res = await fetch(`/api/${action}/add`, {
            method: 'POST',
            body: data
        });
        const resJson = await res.json();

        if (!res.ok) {
            console.log(`${action} failed`)
        } else {
            console.log(`${resJson.message}`)
        }
    };

    return (
        <div className={styles["profile"]}>
            {isMe &&
                <div onClick={handleClose} className={styles["fitcontent"]}>
                    <FancyLink
                        href="/settings"
                        text="Settings"
                        btnRight={false} white

                    />
                </div>
            }
            <p className={styles["user-id"]}>{userId} {isMe && '(you)'}</p>
            <ProfileLinks userId={userId} isMe={isMe} db={supabase} />
            <hr className={styles["divider"]} />
            {!isMe && (
                <div className={styles["profile__btns"]}>
                    <button className={styles["btn"]} onClick={() => handleAddRestrict(userId, 'ignore')}>Ignore user</button>
                    <button className={styles["btn"]} onClick={() => handleAddRestrict(userId, 'block')}>Block user</button>
                    <Report contentType={'profile'} contentId={userId} large />
                </div>
            )}
            {isMe &&
                <div className={styles["profile__btns"]}>
                    <button onClick={logout} className={styles["btn__red"]}>
                        Logout
                    </button>
                </div>
            }
        </div>
    );
}