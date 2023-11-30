'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Recovery() {
    return (
        <>
            <p>Enter your email and we&apos;ll send you a link to reset your password:</p>
            <form action="/auth/recover-password" method="POST">
                <input type="email" name="email" id="email" />
                <button type="submit">Send</button>
            </form>
        </>
    );
}