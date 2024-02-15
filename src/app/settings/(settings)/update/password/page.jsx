import UpdatePassword from '../../../../../components/update-password';

export const metadata = {
    title: 'Update Password (via Settings)',
};

export default function UpdatePasswordLIPage() {
    return (
        <>
            <UpdatePassword route="/auth/password/update-li" />
        </>
    );
}