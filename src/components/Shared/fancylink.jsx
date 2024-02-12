import Link from 'next/link';
import styles from '../../styles/Fancylink.module.scss';

export default function FancyLink({ href, text, btnRight = true }) {
    let btnText = btnRight ? '>' : '<';
    let left = (
        <Link href={href}>
            <span className={styles["fl-text"]}>{text}</span>
        </Link>
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
        <div className={styles["fl-container"]}>
            {left}
            {right}
        </div>
    );
}