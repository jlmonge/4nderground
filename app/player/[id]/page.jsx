import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function Track({ params }) {
    const rawPath = decodeURIComponent(params.id);
    const userCookies = cookies();
    const supabase = createServerComponentClient({ cookies: () => userCookies });
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <>
            <p>This is track {rawPath} </p>
            <audio controls src={`${rawPath}`}></audio>
        </>
    )
}