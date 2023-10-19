'use client';

import { EmailField, PasswordField, TCPPField } from '../../components/Shared/form-fields.jsx';
import Link from 'next/link';

export default function Register() {
    return (
        <>
            <form action='/auth/register' method='post'>
                <EmailField />
                <PasswordField />
                <TCPPField />
                <button type='submit'>Register</button>
            </form>
            <Link href='/'>Log in</Link>
        </>
    )
}