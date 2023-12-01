'use client';

import { useContext } from 'react';
import { UserContext } from '../../../user-provider';
import { useRouter } from 'next/navigation';

export default function DeleteAccountPage() {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter()
    const handleClick = async () => {
        await fetch('/auth/delete-account', {
            method: 'POST',
            body: JSON.stringify({ userId: user.id }),
        });
        await fetch(`/auth/logout`, {
            method: 'POST',
        });
        setUser(null);
        router.push('/');
    }

    return (
        <>
            <p>Are you sure you would like to delete your account?</p>
            <button type="button" onClick={handleClick}>I am sure, delete my account</button>
        </>
    );
}