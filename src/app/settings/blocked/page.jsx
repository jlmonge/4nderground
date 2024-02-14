import RestrictedLayout from '../../../components/Shared/restricted-layout';
import styles from '../../../styles/Restrict.module.scss';

export const metadata = {
    title: `Blocked Users`,
};

export default function BlockedPage() {
    return (
        <div className={styles["restrictpage"]}>
            <h2 className={styles["h2"]}>Blocked Users</h2>
            <RestrictedLayout action="block" />
        </div>
    );
}