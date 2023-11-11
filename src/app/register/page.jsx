import { EmailField, PasswordField, TCPPField } from '../../components/Shared/form-fields.jsx';
import Link from 'next/link';

export const metadata = {
    title: 'Register',
};

export default function Register() {
    return (
        <div className="auth">
            <form action="/auth/register" method="POST">
                <EmailField />
                <PasswordField />
                <TCPPField />
                <button type="submit">Register</button>
            </form>
            <Link href="/login">Log in</Link>
        </div>
    );
}