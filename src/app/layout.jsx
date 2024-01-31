import './global.scss';
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
                <div className={styles["bgtop"]}></div>
                <UserProvider>
                    <Navbar />
                    <main>
                        {children}
                    </main>
                    <Footer />
                </UserProvider>
                <div className={styles["bgbtm"]}></div>
            </body>
        </html>
    );
}