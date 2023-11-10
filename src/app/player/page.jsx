import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Player from '../../components/player.jsx'
import CommentSection from '../../components/comment-section.jsx';

export const metadata = {
    title: 'Player',
}

function UserStatus({ user }) {
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

export default async function PlayerPage() {
    const userCookies = cookies();
    const supabase = createServerComponentClient({ cookies: () => userCookies })
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <>
            <UserStatus user={user} />
            <Player user={user} />
        </>
    )
    // const { load } = useGlobalAudioPlayer();


}