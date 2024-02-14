import RestrictedLayout from '../../../../components/Shared/restricted-layout';
import styles from '../../../../styles/Restrict.module.scss';

export const metadata = {
    title: `Ignored Users`,
};

export default function IgnoredPage() {
    return (
        <div className={styles["restrictpage"]}>
            <h2 className={styles["h2"]}>Ignored Users</h2>
            <RestrictedLayout action="ignore" />
        </div>
    );
}