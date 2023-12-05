'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../user-provider';

export default function RestrictedLayout({ action }) {
    const [restrictedUsers, setRestrictedUsers] = useState([]);
    const supabase = createClientComponentClient();
    const { user, setUser } = useContext(UserContext);
    const myCol = useRef();
    const urCol = useRef();

    useEffect(() => {
        const fetchRestrictedUsers = async () => {
            if (!user) {
                console.log("fetchRestrictUsers: must be logged in")
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
        const data = new FormData();
        data.append('myID', user.id);
        data.append('urID', urID)
        const res = await fetch(`/api/${action}/delete`, {
            method: 'POST',
            body: data,
        })
        const resJson = await res.json();

        if (!res.ok) {
            console.log(`${action} failed`)
        } else {
            console.log(`${resJson.message}`)
            setRestrictedUsers(
                restrictedUsers.filter(user => user[urCol.current] !== urID)
            );
        }
    }

    return (
        <>
            <ul>
                <li style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <p>User ID</p>
                    <p>{action} Date & Time</p>
                </li>
                {restrictedUsers?.map((user) => {
                    return (
                        <li key={user} style={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}>
                            <p>{user[urCol.current]}</p>
                            <p>{user.created_at}</p>
                            <button onClick={() => handleDeleteRestrict(user[urCol.current], action)}>Un{action}</button>
                        </li>
                    )
                })}
            </ul>
            <p>debug: {JSON.stringify(restrictedUsers)}</p>
        </>
    );
}