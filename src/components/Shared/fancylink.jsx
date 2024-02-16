import Link from 'next/link';
import styles from '../../styles/Fancylink.module.scss';

export default function FancyLink({ href, text, btnRight = true, white = false }) {
    let btnText = btnRight ? '>' : '<';
    let left = (
        <span className={white ? styles["fl-text--white"] : styles["fl-text"]}>{text}</span>
    );
    let right = (
        <>
            <button type="button" className={white ? styles["fl-btn--white"] : styles["fl-btn"]}>
                {btnText}
            </button>
        </>
    );
    if (!btnRight) [left, right] = [right, left];

    return (
        <>
            <Link href={href} className={btnRight ? styles["fl-container"] : `${styles["fl-container"]} ${styles["fl-container__left"]}`}>
                {left}
                {right}
            </Link>
        </>
    );
}