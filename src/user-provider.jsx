'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createContext, useEffect, useState, Suspense } from 'react';

export const UserContext = createContext({
    user: null,
    setUser: () => { }
});

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const value = { user, setUser };

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClientComponentClient();
            const { data: { user: u } } = await supabase.auth.getUser();
            if (u) {
                setUser(u);
            } else {
                console.log('unepic fail');
            }
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}