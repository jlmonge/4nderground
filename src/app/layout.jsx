import './global.css';
// run 'npx @next/codemod@latest built-in-next-font .'
import { Public_Sans } from 'next/font/google';
import Navbar from '../components/navbar.jsx';
import UserProvider from '../user-provider.jsx';

export const metadata = {
    title: {
        template: '%s | 4nderground.com',
        default: '4nderground.com',
    }
};

const publicSans = Public_Sans({
    subsets: ['latin'],
});

export default async function RootLayout({ children }) {
    return (
        <html lang="en" className={publicSans.className}>
            <body>
                <UserProvider>
                    <Navbar />
                    <main style={{ margin: '32px 128px' }}>
                        {children}
                    </main>
                </UserProvider>
            </body>
        </html>
    );
}