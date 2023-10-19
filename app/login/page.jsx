'use client';

import { EmailField, PasswordField } from '../../components/Shared/form-fields.jsx';
import Link from 'next/link';

export default function Login() {
    return (
        <>
            <form action='/auth/login' method='post'>
                <EmailField />
                <PasswordField />
                <button type='submit'>Log In</button>
            </form>
            <Link href='/forgot-password'>Forgot password?</Link>
            <br />
            <Link href='/register'>Sign up</Link>
        </>
    )
}