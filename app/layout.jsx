import './global.css';
import { Roboto_Flex } from '@next/font/google'
import createClient from '../components/supabase-server';
import Navbar from '../components/navbar.jsx';

export const metadata = {
    title: '4nderground',
};

const roboto = Roboto_Flex({
    subsets: ['latin'],
    axes: ['wdth']
})

export default async function RootLayout({ children }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <html lang='en' className={roboto.className}>
            <body>
                <Navbar user={user} />
                <main style={{ margin: '10px 100px' }}>
                    {children}
                </main>

            </body>
        </html>
    )
}