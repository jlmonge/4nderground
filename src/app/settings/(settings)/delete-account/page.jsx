import DeleteAccount from '../../../../components/delete-account';
import styles from '../../../../styles/Accessflow.module.scss';

export const metadata = {
    title: 'Delete Account',
}

export default function DeleteAccountPage() {
    return (
        <div className={styles["accessflow-page"]}>
            <h2 className={styles["af-h2"]}>Delete Account</h2>
            <DeleteAccount />
        </div>
    );
}