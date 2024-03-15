import AccessForm from '../../components/Shared/accessform';
import FancyLink from '../../components/Shared/fancylink';
import styles from '../../styles/Accessflow.module.scss';

export const metadata = {
    title: 'Recover Password',
};

export default function RecoveryPage() {
    return (
        <div className={styles["accessflow-page"]}>
            <h2 className={styles["af-h2"]}>Recover Password</h2>
            <p>Enter your email and we&apos;ll send you a link to reset your password.</p>
            <AccessForm hasEmail action="/auth/password/recover" />
        </div>
    );
}