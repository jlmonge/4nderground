import './global.css';
// run 'npx @next/codemod@latest built-in-next-font .'
import { Roboto_Flex } from '@next/font/google'
import createClient from '../components/supabase-server';
import Navbar from '../components/navbar.jsx';

export const metadata = {
    title: {
        template: '%s | 4nderground.com',
        default: '4nderground.com',
    }
}

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
                <main style={{ margin: '32px 128px' }}>
                    {children}
                </main>

            </body>
        </html>
    )
}