'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import isURL from 'validator/lib/isURL';
import { LINK_URL_CHARS_MAX, LINK_TEXT_CHARS_MAX } from '../utils/constants';
import { varLog } from '../utils/helpers';
import { UserContext } from '../user-provider';
import Report from './report';
import FancyLink from './Shared/fancylink';
import Status from './Shared/status';
import styles from '../styles/Profile.module.scss';

const BTN_SIZE = 24;
const ICON_SIZE = 12;

// function EditURL({ link, handleChange }) {
//     const [warning, setWarning] = useState(''); // display below input

//     const validateURL = (e) => {
//         setWarning('');

//         let url = e.target.value.trim();
//         if (!url) return;
//         if (url.length > LINK_URL_CHARS_MAX) setWarning(`Max length ${LINK_URL_CHARS_MAX} exceeded.`);


//         if (!(url.startsWith("http://") || url.startsWith("https://"))) {
//             url = `https://${url}`;
//         }

//         if (!isURL(url)) {
//             setWarning('URL must be valid.');
//         }

//         handleChange({
//             ...link,
//             url: e.target.value.trim(),
//         });
//     }

//     const handleChangeExt = (e) => {
//         setWarning('');
//         handleChange({
//             ...link,
//             url: e.target.value,
//         });
//     }

//     return (
//         <div className={styles["edit-url"]}>
//             <label htmlFor={`edit-link${(link.pos).toString()}-url`} className={styles["visually-hidden"]}>Edit link text</label>
//             <input
//                 type="text"
//                 id={`edit-link${(link.pos).toString()}-url`}
//                 maxLength={LINK_URL_CHARS_MAX}
//                 name="edit-link-url"
//                 placeholder="Link URL"
//                 className={styles["input"]}
//                 required
//                 value={link.url}
//                 onBlur={validateURL}
//                 onChange={handleChangeExt}
//             />
//             {
//                 warning && <span className={styles["edit-warning"]}>{warning}</span>
//             }
//         </div>
//     )
// }

// function EditText({ link, handleChange }) {
//     const [warning, setWarning] = useState(''); // display below input

//     const validateText = (e) => {
//         setWarning('');

//         const text = e.target.value.trim();
//         if (!text.length) return;
//         if (text.length > LINK_TEXT_CHARS_MAX) setWarning(`Max length ${LINK_TEXT_CHARS_MAX} exceeded.`);

//         onChange({
//             ...link,
//             text: e.target.value.trim(),
//         });
//     }

//     const handleChangeExt = (e) => {
//         setWarning('');
//         handleChange({
//             ...link,
//             text: e.target.value,
//         });
//     }

//     return (
//         <div className={styles["edit-text"]}>
//             <label htmlFor={`edit-link${(link.pos).toString()}-text`} className={styles["visually-hidden"]}>Edit link text</label>
//             <input
//                 type="text"
//                 id={`edit-link${(link.pos).toString()}-text`}
//                 maxLength={LINK_TEXT_CHARS_MAX}
//                 name="edit-link-text"
//                 placeholder="Link text"
//                 className={styles["input"]}
//                 value={link.text}
//                 required
//                 onBlur={validateText}
//                 onChange={handleChangeExt}
//             />
//             {
//                 warning && <span className={styles["edit-warning"]}>{warning}</span>
//             }
//         </div>
//     )
// }


function ProfileLink({ link, isEditing, handleLinkDelete, handleLinkChange, validateURL, validateText, urlWarning, textWarning }) {

    let linkContent;
    if (isEditing) {
        linkContent = (
            <>
                <div className={styles["edit-url"]}>
                    <label htmlFor={`edit-link${(link.pos).toString()}-url`} className={styles["visually-hidden"]}>Edit link text</label>
                    <input
                        type="text"
                        id={`edit-link${(link.pos).toString()}-url`}
                        maxLength={LINK_URL_CHARS_MAX}
                        name="edit-link-url"
                        placeholder="Link URL"
                        className={styles["input"]}
                        required
                        value={link.url}
                        onBlur={e => validateURL(e, link)}
                        onChange={e => {
                            handleLinkChange({
                                ...link,
                                url: e.target.value,
                            }, 'url')
                        }}
                    />
                    {
                        urlWarning && <span className={styles["edit-warning"]}>{urlWarning}</span>
                    }
                </div>
                <div className={styles["edit-text"]}>
                    <label htmlFor={`edit-link${(link.pos).toString()}-text`} className={styles["visually-hidden"]}>Edit link text</label>
                    <input
                        type="text"
                        id={`edit-link${(link.pos).toString()}-text`}
                        maxLength={LINK_TEXT_CHARS_MAX}
                        name="edit-link-text"
                        placeholder="Link text"
                        className={styles["input"]}
                        value={link.text}
                        required
                        onBlur={e => validateText(e, link)}
                        onChange={e => {
                            handleLinkChange({
                                ...link,
                                text: e.target.value,
                            }, 'text')
                        }}
                    />
                    {
                        textWarning && <span className={styles["edit-warning"]}>{textWarning}</span>
                    }
                </div>
                <button
                    onClick={() => handleLinkDelete(link.pos)}
                    type="button"
                    title="Delete link"
                    className={styles["btn__red"]}
                >
                    X
                </button>
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
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [urlWarning, setURLWarning] = useState('')
    const [textWarning, setTextWarning] = useState('')
    const [isError, setIsError] = useState(false); // determined by submit status

    const handleLinkChange = (l, warningType = '') => {
        setDraftLinks(draftLinks.map(link => {
            if (l.pos !== link.pos) {
                // not the right link so don't change
                return link;
            } else {
                // link match, set text
                return l;

            }
        }))

        if (warningType === 'url') {
            setURLWarning('');
        } else if (warningType === 'text') {
            setTextWarning('');
        }
    };

    const validateURL = (e, link) => {
        setURLWarning('');

        let url = e.target.value.trim();
        if (!url) return;
        if (url.length > LINK_URL_CHARS_MAX) setURLWarning(`Max length ${LINK_URL_CHARS_MAX} exceeded.`);


        if (!(url.startsWith("http://") || url.startsWith("https://"))) {
            url = `https://${url}`;
        }

        if (!isURL(url)) {
            setURLWarning('URL must be valid.');
        }

        // console.log("should trim")
        handleLinkChange({
            ...link,
            url: e.target.value.trim(),
        });
    }

    const validateText = (e, link) => {
        setTextWarning('');

        const text = e.target.value.trim();
        if (!text.length) return;
        if (text.length > LINK_TEXT_CHARS_MAX) setTextWarning(`Max length ${LINK_TEXT_CHARS_MAX} exceeded.`);

        console.log(`e.target.value.trim(): -${e.target.value.trim()}-`)
        handleLinkChange({
            ...link,
            text: e.target.value.trim(),
        });
    }

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
        // console.log(`draftPos: ${draftPos}`)
        if (draftPos <= 3) { // btn disabled once pos reaches 4, but this is a failsafe
            setDraftLinks([...draftLinks, {
                pos: draftPos,
                url: '',
                text: '',
            }]);
            setDraftPos(draftPos + 1);
        }
    };

    const handleLinkDelete = (pos) => {
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

        setLoading(true);
        setResponse('');
        setIsError(false);

        try {
            const form = e.target;
            const formData = new FormData(form);
            // console.log(`before: ${JSON.stringify(links, null, 2)}`);
            // console.log(`formData:`);
            const fieldRegex = new RegExp('^(.+?)-');
            const idRegex = new RegExp('\-(.*)');
            let newLinks = [];
            let newLink = {};
            let pos = 1;

            for (let entry of formData.entries()) {
                let fieldName = entry[0];
                let fieldValue = entry[1];
                // console.log(`entry: ${entry}`);
                if (fieldName === 'edit-link-url') {
                    newLink['pos'] = pos;
                    newLink['url'] = fieldValue;
                } else if (fieldName === 'edit-link-text') {
                    newLink['text'] = fieldValue;
                    // console.log(`newLink: ${JSON.stringify(newLink)}`);
                    newLinks.push(newLink);
                    // console.log(`newLinks: ${newLinks}`);
                    newLink = {};
                    pos++;
                }
            }

            const res = await fetch('/api/links', {
                method: 'POST',
                body: JSON.stringify({ oldLinks: links, newLinks, userId }),
            });
            const resJson = await res.json()
            setResponse(resJson.message)
            if (!res.ok) {
                setIsError(true);
            } else {
                setIsEditing(false);
                setLinks([...newLinks]);
            }
        } catch (e) {
            console.log(e);
            setIsError(true);
            setResponse('Something bad happened.');
        } finally {
            setLoading(false);
        }
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
                        {draftLinks.map((l) =>
                            <ProfileLink
                                key={l.pos}
                                link={l}
                                isEditing={isEditing}
                                userId={userId}
                                handleLinkDelete={handleLinkDelete}
                                handleLinkChange={handleLinkChange}
                                validateURL={validateURL}
                                validateText={validateText}
                                urlWarning={urlWarning}
                                textWarning={textWarning}
                            />
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
                            disabled={JSON.stringify(draftLinks) === JSON.stringify(links) || urlWarning || textWarning}
                        >
                            Save changes
                        </button>
                    </div>
                </form>
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
                <p>draftLinks: {JSON.stringify(draftLinks)}</p>
                <p>links: {JSON.stringify(links)}</p>
                {isMe && <Status loading={loading} response={response} isError={isError} />}
            </section>
        </>
    );
}

function Logout({ handleClose }) {
    const { setUser } = useContext(UserContext);
    const router = useRouter(); // next/navigation
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [isError, setIsError] = useState(false);


    const logout = async () => {
        setLoading(true);
        setResponse('');
        setIsError(false);

        try {
            const res = await fetch(`/auth/logout`, {
                method: 'POST',
            });
            const resJson = await res.json()

            setResponse(resJson.message)
            if (!res.ok) {
                setIsError(true);
            } else {
                setUser(null);
                handleClose();
                router.refresh();
            }
        } catch (e) {
            console.log(e);
            setIsError(true);
            setResponse('Something bad happened.')
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <button onClick={logout} className={styles["btn__red"]}>Logout</button>
            <Status loading={loading} response={response} isError={isError} />
        </>

    )
}

export default function Profile({ userId, handleClose }) {
    const [isMe, setIsMe] = useState(false);
    const supabase = createClientComponentClient();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsMe(user?.id === userId);
        // console.log(`my user id: ${user?.id}`);
        // console.log(`THE user id: ${userId}`);
        // console.log(`are they the same?: ${(user?.id === userId).toString()}`);
    }, [user, userId]);

    // const handleCloseTest = () => {
    //     handleClose();
    //     console.log("clicked; closing");
    // }

    const handleAddRestrict = async (urID, action) => {
        if (!user) {
            console.log('You must be logged in to perform this action.')
            return;
        }
        setLoading(true);
        setResponse('');
        setIsError(false);

        try {
            const data = new FormData();
            data.append('myID', user.id);
            data.append('urID', urID);
            const res = await fetch(`/api/${action}/add`, {
                method: 'POST',
                body: data
            });
            const resJson = await res.json();
            setResponse(resJson.message);

            if (!res.ok) {
                // console.log(`${action} failed`)
                setIsError(true);
            } else {
                // console.log(`${resJson.message}`)
            }
        } catch (e) {
            console.log(e);
            setResponse('Something bad happened.');
            setIsError(true);
        } finally {
            setLoading(false);
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
            {user?.id &&
                <>
                    <hr className={styles["divider"]} />
                    <div className={styles["profile__btns"]}>
                        {isMe ?
                            <Logout handleClose={handleClose} />
                            :
                            <>
                                <button className={styles["btn"]} onClick={() => handleAddRestrict(userId, 'ignore')}>Ignore user</button>
                                <button className={styles["btn"]} onClick={() => handleAddRestrict(userId, 'block')}>Block user</button>
                                <Report contentType={'profile'} contentId={userId} large />
                                <Status loading={loading} response={response} isError={isError} />
                            </>
                        }
                    </div>
                </>
            }

        </div>
    );
}