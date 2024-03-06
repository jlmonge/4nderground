import './global.scss';
import styles from '../styles/Background.module.scss';
// run 'npx @next/codemod@latest built-in-next-font .'
import { publicSans, nunito } from './fonts.jsx';
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
                {/* <div className={styles["bgl"]}></div>
                <div className={styles["bgm"]}></div>
                <div className={styles["bgr"]}></div> */}
                <div className={styles["bgtop"]}></div>
                <UserProvider>
                    <Navbar className={nunito.className} />
                    <main id="main-content">
                        {children}
                    </main>
                    <Footer className={nunito.className} />
                </UserProvider>
                <div className={styles["bgbtm"]}></div>
            </body>
        </html>
    );
}