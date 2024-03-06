import Link from 'next/link';
import styles from "../styles/Homepage.module.scss";
import colors from "../styles/Colors.module.scss"

export const metadata = {
    title: 'Discover the newest ideas in music | 4nderground',
};

export default function HomePage() {

    return (
        <div className={styles["hp"]}>
            <h1 className={`${styles["headline"]}`}>
                Share your music with fellow artists
            </h1>
            <article className={styles["features"]}>
                <section className={styles["feature"]}>
                    <h2 className={styles["feature__heading"]}>Share whatever whenever</h2>
                    <p className={styles["feature__desc"]}>
                        From killer and brief melody ideas to elaborate and long compositions, this is a place for music of all kinds.
                        Capture the moment by uploading a file or recording. We support most audio types (mp3, wav, you name it).
                    </p>
                </section>
                <section className={styles["feature"]}>
                    <h2 className={styles["feature__heading"]}>So easy</h2>
                    <p className={styles["feature__desc"]}>To upload, all we ask for is a file or recording, and optionally, a genre.
                        This saves energy otherwise wasted coming up with a title, description, photo, or video to go along
                        with music that stands on its own.
                    </p>
                </section>
                <section className={styles["feature"]}>
                    <h2 className={styles["feature__heading"]}>1 track, 24 hours</h2>
                    <p className={styles["feature__desc"]}>
                        Once you upload a track, its brief life begins. In that time, you can&apos;t upload anything else.
                        After 24 hours, it and its comments are removed. Each day really is a new beginning.
                    </p>
                </section>
                <section className={styles["feature"]}>
                    <h2 className={styles["feature__heading"]}>Newest-to-oldest statless player</h2>
                    <p className={styles["feature__desc"]}>
                        No seedy algorithms for you to learn to game, as if creating art wasn&apos;t enough.
                        Tracks do not have likes or plays because interactions from comments are infinitely more meaningful.
                    </p>
                </section>
                <section className={styles["feature"]}>
                    <h2 className={styles["feature__heading"]}>Random usernames and profile pictures</h2>
                    <p className={styles["feature__desc"]}>
                        You&apos;re only judged by the quality of your contributions. Be free.
                    </p>
                </section>
            </article>
            <Link prefetch={false} href="/register" className={styles["link"]}>
                <button className={styles["link__btn"]}>Please sign me up</button>
            </Link>
        </div>
    );
}