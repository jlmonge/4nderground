import { PasswordField } from './Shared/form-fields';

export default function UpdatePassword({ route }) {
    return (
        <>
            <p>Change your password here:</p>
            <form action={route} method="POST">
                <PasswordField />
                <button type="submit">Save</button>
            </form>
        </>
    );
}