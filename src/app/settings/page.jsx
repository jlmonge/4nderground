import FancyLink from '../../components/Shared/fancylink';
import styles from '../../styles/Settings.module.scss';

export const metadata = {
    title: 'Settings',
};

export default function SettingsPage() {
    return (
        <div className={styles["settingspage"]}>
            <h2 className={styles["h2"]}>settings</h2>
            <div className={styles["links"]}>
                <FancyLink href="/settings/update/email" text="Update email" />
                <FancyLink href="/settings/update/password" text="Update password" />
                <FancyLink href="/settings/ignored" text="Manage ignored users" />
                <FancyLink href="/settings/blocked" text="Manage blocked users" />
                <FancyLink href="/settings/reports" text="View report history" />
                <FancyLink href="/settings/delete-account" text="Delete account" />
            </div>

        </div>
    );
}