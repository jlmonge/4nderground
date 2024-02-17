import FancyLink from '../components/Shared/fancylink';
import styles from '../styles/Textpage.module.scss';
import Image from 'next/image';
import ufo from '../../public/ufo.gif'

export default function NotFound() {
    return (
        <div className={styles["textpage"]}>
            <h2 className={styles["h2"]}>Page not found</h2>
            <FancyLink href="/" text="Take me home" />
            <Image
                src={ufo}
                alt="UFO animation"
                priority={true}
            />
        </div>
    );
}