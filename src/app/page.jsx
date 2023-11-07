import Login from './login/page.jsx';
import Upload from './upload/page.jsx';
import Report from '../components/report.jsx';

export const metadata = {
    title: 'Discover the newest ideas in music | 4nderground',
}

export default function HomePage() {

    return (
        <>
            <div>
                <h2>Skip the popularity contests.</h2>
                <h2>Listen to the latest music the world has to offer before it’s gone.</h2>
                <button>Go 4nderground</button>
            </div>
            <div>
                <h2>Want to listen?</h2>
                <p>Our Player plays all songs uploaded by our users from newest to oldest.</p>
                <p>After 24 hours, songs are removed from our website. This is part of our promise to guarantee only the newest music.</p>
                <p>Find what you want by changing genres.</p>
                <p>Let artists know how you feel with your comments.</p>
            </div>
            <div>
                <h2>Want to create?</h2>
                <p>Showing off your music is effortless.</p>
                <p>Upload via file</p>
                <p>OR</p>
                <p>Record directly from your computer.</p>
                <p>You can upload 1 track every 24 hours.</p>
                <p>We know you’ll be eager to upload again, so we provide you with a timer that counts down these 24 hours.</p>
                <p>Get feedback from users.</p>
                <p>Want to redirect curious listeners to your work? Link your profiles.</p>
            </div>
            <footer>
                <p>Contact us: help@4nderground.com</p>
                <p>© 4nderground.com 2023</p>
                <p>Terms & Conditions</p>
                <p>Privacy Policy</p>
            </footer>
        </>
    );
}