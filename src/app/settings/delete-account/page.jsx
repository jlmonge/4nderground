'use client';

export default function DeleteAccountPage() {
    const handleClick = async () => {
        await fetch('/auth/delete-account', {
            method: 'POST'
        });
    }

    return (
        <>
            <p>Are you sure you would like to delete your account?</p>
            <button type="button" onClick={handleClick}>I am sure, delete my account</button>
        </>
    );
}