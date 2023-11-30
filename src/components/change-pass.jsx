import { PasswordField } from './Shared/form-fields';

export default function ChangePass() {
    return (
        <>
            <p>Change your password here:</p>
            <form action="/auth/reset-password" method="POST">
                <PasswordField />
                <button type="submit">Save</button>
            </form>
        </>
    );
}