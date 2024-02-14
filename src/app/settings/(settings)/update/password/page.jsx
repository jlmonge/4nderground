import UpdatePassword from '../../../../../components/update-password';

export const metadata = {
    title: 'Update Password (via Settings)',
};

export default function UpdatePasswordLIPage() {
    return (
        <>
            <p>You accessed this page via settings.</p>
            <UpdatePassword route="/auth/password/update-li" />
        </>
    );
}