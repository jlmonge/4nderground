import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>

            <Link href="/settings/update/email">Update email</Link>
            <Link href="/settings/update/password">Update password</Link>
            <Link href="/settings/ignored">Manage ignored users</Link>
            <Link href="/settings/blocked">Manage blocked users</Link>
            <Link href="/settings/delete-account">Delete account</Link>
        </div>
    );
}