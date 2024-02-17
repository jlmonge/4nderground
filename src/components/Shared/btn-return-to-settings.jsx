'use client';

import Link from 'next/link';

export default function ReturnToSettingsButton() {
    return (
        <>
            <Link prefetch={false} href="/settings">Back</Link>
        </>
    );
}