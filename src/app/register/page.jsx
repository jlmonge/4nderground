import AccessForm from '../../components/Shared/accessform';
import FancyLink from '../../components/Shared/fancylink';
import styles from '../../styles/Accessflow.module.scss';

export const metadata = {
    title: 'Register',
};

export default function Register() {
    return (
        <div className={styles["accessflow-page"]}>
            <h2 className={styles["af-h2"]}>Welcome</h2>
            <AccessForm hasEmail hasPassword hasAgreement
                hasRequirements action="/auth/register"
            />
            <div className={styles["accessflow-links"]}>
                <FancyLink
                    href="/login"
                    text="Login instead"
                />
            </div>
        </div>
    );
}