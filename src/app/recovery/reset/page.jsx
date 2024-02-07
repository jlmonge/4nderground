import UpdatePassword from '../../../components/update-password';

export const metadata = {
    title: 'Update Password (via Email)',
};

export default function UpdatePasswordLOPage() {

    return (
        <>
            <UpdatePassword route="/auth/password/update-lo" />
        </>
    );
}