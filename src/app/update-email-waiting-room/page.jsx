// TODO: remove 'use client' to update title

'use client';

import { useSearchParams } from 'next/navigation';

export default function UpdateEmailWaitingRoomPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <>
            <p>{message ?? '?'}</p>
        </>
    );
}