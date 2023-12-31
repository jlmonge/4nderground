import './global.css';
import styles from '../styles/Background.module.scss';
// run 'npx @next/codemod@latest built-in-next-font .'
import { publicSans } from './fonts.jsx';
import Navbar from '../components/navbar.jsx';
import UserProvider from '../user-provider.jsx';
import Footer from '../components/footer.jsx';

export const metadata = {
    title: {
        template: '%s | 4nderground.com',
        default: '4nderground.com',
    }
};



export default async function RootLayout({ children }) {
    return (
        <html lang="en" className={publicSans.className}>
            <body>
                <div className={styles["bg"]}>
                    <div className={styles["gl-h"]}>
                        <div className={`${styles["gl"]} ${styles["gl-h1"]}`}></div>
                        <div className={`${styles["gl"]} ${styles["gl-h2"]}`}></div>
                    </div>
                    <div className={styles["gl-v"]}>
                        <div className={`${styles["gl"]} ${styles["gl-v1"]}`}></div>
                        <div className={`${styles["gl"]} ${styles["gl-v2"]}`}></div>
                        <div className={`${styles["gl"]} ${styles["gl-v3"]}`}></div>
                    </div>
                </div>
                <UserProvider>
                    <Navbar />
                    <main>
                        {children}
                    </main>
                    <Footer />
                </UserProvider>
            </body>
        </html>
    );
}