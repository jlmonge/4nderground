'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../user-provider';
import { capitalizeFirstLetter, getDate } from '../../utils/helpers';
import styles from '../../styles/Restrict.module.scss';
import Avatar from '../avatar';

export default function RestrictedLayout({ action }) {
    const [loading, setLoading] = useState(false);
    const [restrictedUsers, setRestrictedUsers] = useState([]);
    const supabase = createClientComponentClient();
    const { user, setUser } = useContext(UserContext);
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
        if (!user) {
            console.log('You must be logged in to perform this action.')
            return;
        }
        setLoading(true);

        try {
            const data = new FormData();
            data.append('myID', user.id);
            data.append('urID', urID)
            // setTimeout(() => {
            //     throw new Error("intentional. testing.")
            // }, 3500);
            // return;
            const res = await fetch(`/api/${action}/delete`, {
                method: 'POST',
                body: data,
            })
            const resJson = await res.json();

            if (!res.ok) {
                console.log(`un${action} failed`)
            } else {
                console.log(`${resJson.message}`)
                setRestrictedUsers(
                    restrictedUsers.filter(user => user[urCol.current] !== urID)
                );
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        console.log(`loading changed: ${loading}`);
    }, [loading]);

    let content;
    if (restrictedUsers.length) {
        content = (
            <>
                <ol className={styles["list"]}>
                    {restrictedUsers?.map((user) => {
                        return (
                            <li key={user} className={styles["item"]}>
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
                                    <span className={styles["reqbtn__loading"]}>
                                        {loading ?? `Un${action === 'ignore' ? 'ignoring' : 'blocking'}...`}
                                    </span>
                                </div>
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