import { EmailField } from './Shared/form-fields';

export default function UpdateEmail() {
    return (
        <>
            <p>Change your email here:</p>
            <form action="/auth/email/update" method="POST">
                <EmailField />
                <button type="submit">Save</button>
            </form>
        </>
    );
}