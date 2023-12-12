// TODO: no need for this page; get specific track in player w/ hash params.

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function Track({ params }) {
    return (
        <>
            <p style={{ color: 'red' }}>This is a testing feature. To be removed.</p>
            <p>This is track {params.id}</p>
            <audio controls src={`${process.env.S3_BASE_URL}${params.id}`}></audio>
        </>
    );
}