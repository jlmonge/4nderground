import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function Player() {
    const userCookies = cookies();
    const supabase = createServerComponentClient({ cookies: () => userCookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return (
            <p>Welcome to our Player. You are not logged in.</p>
        )
    }
    return (
        <>
            <p>Welcome to our Player. You are logged in. {user.email}</p>
        </>
    )
}