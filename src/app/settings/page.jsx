import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>
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
            <Link href="/settings/ignored">Manage ignored users</Link>
            <Link href="/settings/blocked">Manage blocked users</Link>
            <button>Delete account</button>
        </div>
    );
}