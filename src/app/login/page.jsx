import Link from 'next/link';
import Login from '../../components/login';

export const metadata = {
    title: 'Login',
}

export default function LoginPage() {
    return (
        <div className="auth">
            <Login />
            <Link href="/forgot-password">Forgot password?</Link>
            <Link href="/register">Sign up</Link>
        </div>
    );
}