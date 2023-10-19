'use client';

import { EmailField } from '../../components/Shared/form-fields.jsx';
import Link from 'next/link';

export default function ForgotPass() {
    return (
        <>
            <form>
                <EmailField />
                <button type='submit'>Submit</button>
            </form>
            <Link href='/login'>Log in</Link>
        </>
    )
}