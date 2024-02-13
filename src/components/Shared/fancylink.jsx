import Link from 'next/link';
import styles from '../../styles/Fancylink.module.scss';

export default function FancyLink({ href, text, btnRight = true }) {
    let btnText = btnRight ? '>' : '<';
    let left = (
        <span className={styles["fl-text"]}>{text}</span>
    );
    let right = (
        <>
            <button type="button" className={styles["fl-btn"]}>
                {btnText}
            </button>
        </>
    );
    if (!btnRight) [left, right] = [right, left];

    return (
        <>
            <Link href={href} className={styles["fl-container"]}>
                {left}
                {right}
            </Link>
        </>
    );
}