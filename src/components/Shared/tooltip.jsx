'use client';

import styles from '../../styles/Tooltip.module.scss';

export default function Tooltip({ info }) {
    return (
        <div className={styles["tooltip"]}>?
            <span className={styles["tooltip__text"]}>{info}</span>
        </div>
    );
}