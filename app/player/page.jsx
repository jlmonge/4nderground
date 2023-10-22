import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { useGlobalAudioPlayer } from 'react-use-audio-player';

/*
export const metadata = {
    title: 2,
};
*/
export default async function Player() {
    const userCookies = cookies();
    const supabase = createServerComponentClient({ cookies: () => userCookies })
    const { data: { user } } = await supabase.auth.getUser()

    // const { load } = useGlobalAudioPlayer();

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