'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../user-provider';
import { capitalizeFirstLetter, getDate } from '../../utils/helpers';
import styles from '../../styles/Restrict.module.scss';
import Avatar from '../avatar';
import Status from './status';

export default function RestrictedLayout({ action }) {
    const [restrictedUsers, setRestrictedUsers] = useState([]);
    const supabase = createClientComponentClient();
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [isError, setIsError] = useState(false);
    const myCol = useRef();
    const urCol = useRef();

    useEffect(() => {
        const fetchRestrictedUsers = async () => {
            if (!user) {
                return;
            }

            if (action === 'ignore') {
                myCol.current = 'ignorer_id'
                urCol.current = 'ignored_id'
            } else if (action === 'block') {
                myCol.current = 'blocker_id'
                urCol.current = 'blocked_id'
            }
            const { data, error } = await supabase
                .from(`${action}s`)
                .select(`${urCol.current}, created_at`)
                .eq(`${myCol.current}`, user.id)
                .order('created_at', { ascending: false });
            if (error) console.log(error);
            setRestrictedUsers(data)
        };
        fetchRestrictedUsers();
    }, [action, supabase, user]);

    const handleDeleteRestrict = async (urID, action) => {
        setLoading(true);
        setResponse('');
        setIsError(false);

        try {
            if (!user) {
                console.log('You must be logged in to perform this action.')
                return;
            }

            const data = new FormData();
            data.append('myID', user.id);
            data.append('urID', urID)

            const res = await fetch(`/api/${action}/delete`, {
                method: 'POST',
                body: data,
            })
            const resJson = await res.json();
            setResponse(resJson.message);

            if (!res.ok) {
                setIsError(true);
            } else {
                setRestrictedUsers(
                    restrictedUsers.filter(user => user[urCol.current] !== urID)
                );
            }
        } catch (e) {
            console.log(e);
            setIsError(true);
            setResponse('Something bad happened.')
        } finally {
            setLoading(false);
        }

    }

    // useEffect(() => {
    //     console.log(`loading changed: ${loading}`);
    // }, [loading]);

    let content;
    if (restrictedUsers.length) {
        content = (
            <>
                <ol className={styles["list"]}>
                    {restrictedUsers?.map((user) => {
                        return (
                            <li key={user} className={styles["item__wrapper"]}>
                                <div className={styles["item"]}>
                                    <Avatar userId={user[urCol.current]} />
                                    <div className={styles["details"]}>
                                        <span className={styles["details__user"]}>{user[urCol.current]}</span>
                                        <span className={styles["details__date"]}>{getDate(user.created_at)}</span>
                                    </div>
                                    <div className={styles["reqbtn"]}>
                                        <button className={styles["reqbtn__btn"]}
                                            onClick={() => handleDeleteRestrict(user[urCol.current], action)}
                                        >
                                            Un{action}
                                        </button>
                                        {/* <span className={styles["reqbtn__loading"]}>
                                            {loading ?? `Un${action === 'ignore' ? 'ignoring' : 'blocking'}...`}
                                        </span> */}
                                    </div>
                                </div>
                                <Status loading={loading} response={response} isError={isError} />
                            </li>
                        )
                    })}
                </ol>
                {/* <p>debug: {JSON.stringify(restrictedUsers)}</p> */}
            </>
        );
    } else {
        content = (
            <p>No users {action === 'ignore' ? 'ignored' : 'blocked'}.</p>
        )
    }

    return (
        <>
            {content}
            {/* <p>debug: {JSON.stringify(restrictedUsers)}</p> */}
        </>
    );
}