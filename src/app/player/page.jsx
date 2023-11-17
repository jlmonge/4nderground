import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Player from '../../components/player.jsx';

export const metadata = {
    title: 'Player',
};

function UserStatus({ user }) {
    if (!user) {
        return (
            <p>Welcome to our Player. You are not logged in.</p>
        );
    }
    return (
        <p>Welcome to our Player. You are logged in. {user.email}</p>
    );
}

export default async function PlayerPage() {
    const userCookies = cookies();
    const supabase = createServerComponentClient({ cookies: () => userCookies });
    const { data: { user } } = await supabase.auth.getUser();
    /*
    const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select()
        .gt('created_at', dayAgo)
        .lte()
        .order('created_at', { ascending: false });
    */

    return (
        <>
            <UserStatus user={user} />
            <Player />
        </>
    );
}