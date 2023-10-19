import './global.css';
import createClient from '../components/supabase-server';
import Navbar from '../components/navbar.jsx';

export const metadata = {
    title: '4nderground',
};

export default async function RootLayout({ children }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <html lang='en'>
            <body>
                <Navbar user={user} />
                {children}
            </body>
        </html>
    )
}