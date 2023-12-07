import UpdatePassword from '../../../components/update-password';

export const metadata = {
    title: 'Update Password (via Email)',
};

export default function UpdatePasswordLOPage() {

    return (
        <>
            <p>You accessed this page via an email reset link (or url hacks).</p>
            <UpdatePassword route="/auth/password/update-lo" />
        </>
    );
}