export default function SettingsPage() {
    return (
        <>
            <form action="/auth/change-email" method="POST">
                <label htmlFor="new-email">Change email</label>
                <input type="email" name="new-email" />
                <button type="submit">Confirm new email</button>
            </form>
            <form action="/auth/change-password" method="POST">
                <label htmlFor="new-password">Change password</label>
                <input type="password" name="new-password" />
                <button type="submit">Confirm new password</button>
            </form>
            <button>Delete account</button>
        </>
    );
}