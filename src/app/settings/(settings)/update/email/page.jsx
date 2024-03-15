import AccessForm from '../../../../../components/Shared/accessform';
import styles from '../../../../../styles/Accessflow.module.scss'

export const metadata = {
    title: 'Update Email',
};

export default function UpdateEmailPage() {
    return (
        <div className={styles["accessflow-page"]}>
            <h2 className={styles["af-h2"]}>Change Email</h2>
            <AccessForm hasEmail
                action="/auth/email/update"
            />
        </div>
    );
}