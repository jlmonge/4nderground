import Login from './login/page.jsx';
import Upload from './upload/page.jsx';
import Report from '../components/report.jsx';

export const metadata = {
    title: 'Discover the newest ideas in music | 4nderground',
}

function Header({ title }) {
    return <h1>{title ? title : 'Default title'}</h1>;
}

export default function HomePage() {

    return (
        <>
            <Header title='Welcome to site.com' />
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                At elementum eu facilisis sed odio morbi quis commodo odio.
                Amet facilisis magna etiam tempor.
                Lectus quam id leo in.
            </p>
        </>
    );
}