import { EmailField, PasswordField } from './Shared/form-fields';

export default function Login() {
    return (
        <>
            <form action="/auth/login" method="POST">
                <EmailField />
                <PasswordField />
                <button type="submit">Log In</button>
            </form>
        </>
    );
}