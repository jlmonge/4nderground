import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function Track({ params }) {
    return (
        <>
            <p>This is track {params.id}</p>
            <audio controls src={`/${params.id}`}></audio>
        </>
    )
}