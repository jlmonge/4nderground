import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function Track({ params }) {
    const rawPath = decodeURIComponent(params.id);

    return (
        <>
            <p>This is track {rawPath} </p>
            <audio controls src={`${rawPath}`}></audio>
        </>
    )
}