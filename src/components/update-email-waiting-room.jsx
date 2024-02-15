'use client';

import { useSearchParams } from 'next/navigation';
import styles from '../styles/Accessflow.module.scss';

export default function UpdateEmailWaitingRoom() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <div className={styles["waitingroom"]}>
            <h2 className={styles["af-h2"]}>Update Email Waiting Room</h2>
            <p>{message ?? 'The email change will complete once the links sent to both emails has been accessed.'}</p>
        </div>
    );
}