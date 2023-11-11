import { EmailField } from '../../components/Shared/form-fields.jsx';
import Link from 'next/link';

export const metadata = {
    title: 'Forgot Password',
};

export default function ForgotPass() {
    return (
        <div className="auth">
            <form>
                <EmailField />
                <button type="submit">Submit</button>
            </form>
            <Link href="/login">Log in</Link>
        </div>
    );
}