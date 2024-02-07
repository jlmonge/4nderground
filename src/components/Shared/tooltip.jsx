'use client';

import { useState } from 'react';
import styles from '../../styles/Tooltip.module.scss';

export default function Tooltip({ info }) {
    const [hover, setHover] = useState(false);

    const handleMouseEnter = () => {
        setHover(true);
    }

    const handleMouseLeave = () => {
        setHover(false);
    }

    return (
        <div className={styles["tt-container"]}>
            <span
                className={styles["tt-icon"]}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <div className={styles["tt-textcontainer"]}>
                <p className={`${styles["tt-text"]} ${hover ? styles["show"] : styles["hide"]}`}>
                    {info}
                </p>
            </div>
        </div>
    );
}