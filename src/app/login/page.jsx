import { EmailField, PasswordField } from '../../components/Shared/form-fields.jsx';
import Link from 'next/link';

export const metadata = {
    title: 'Login',
}

export default function Login() {
    return (
        <div className='auth'>
            <form action='/auth/login' method='post'>
                <EmailField />
                <PasswordField />
                <button type='submit'>Log In</button>
            </form>
            <Link href='/forgot-password'>Forgot password?</Link>
            <Link href='/register'>Sign up</Link>
        </div>
    )
}