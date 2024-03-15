import AccessForm from '../../components/Shared/accessform';
import FancyLink from '../../components/Shared/fancylink';
import styles from '../../styles/Accessflow.module.scss';

export const metadata = {
    title: 'Login',
}

export default function LoginPage() {
    return (
        <div className={styles["accessflow-page"]}>
            <h2 className={styles["af-h2"]}>Welcome Back</h2>
            <AccessForm hasEmail hasPassword
                action="/auth/login"
            />
            <div className={styles["accessflow-links"]}>
                <FancyLink
                    href="/register"
                    text="Register instead"
                />
                <FancyLink
                    href="/recovery"
                    text="Forgot my password"
                />
            </div>
        </div>
    );
}