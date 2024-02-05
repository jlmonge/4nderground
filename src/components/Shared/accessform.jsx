'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '../../styles/Accessflow.module.scss';
import { useRouter } from 'next/navigation';

function Email({ hasTooltip = false }) {
    return (
        <div className={styles["email-container"]}>
            <label className={styles["visually-hidden"]} htmlFor="email">Email</label>
            <input type="email" id="email" name="email"
                placeholder="Email" required
            />
        </div>
    )
}

function Password({ hasTooltip = false }) {
    return (
        <div className={styles["password-container"]}>
            <label className={styles["visually-hidden"]} htmlFor="password">Password</label>
            <input type="password" name="password" id="password"
                placeholder="Password" required
            />
        </div>
    )
}

function Agreement() {
    return (
        <div className={styles["agreement-container"]}>
            <input type="checkbox" name="agreement"
                id="agreement" className={styles["agreement-input"]}

            />
            <label className={styles["agreement-label"]} htmlFor="agreement-input">
                I have read and agree with the <Link href="/legal">Terms of Service</Link> and <Link href="privacy">Privacy Policy</Link>.
            </label>
        </div>
    )
}

export default function AccessForm({
    hasEmail = false,
    hasPassword = false,
    hasAgreement = false,
    hasTooltip = false,
    action = "",
}) {
    const router = useRouter();
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log(`email: ${data.get('email')}`);
        console.log(`password: ${data.get('password')}`);
        console.log(`agreement: ${data.get('agreement')}`);

        const res = await fetch(action, {
            method: 'POST',
            body: data,
        })

        if (res.ok) {
            console.log("RESPONSE GOOD");
            router.push('/player');
        }
        const resJson = await res.json();
        setStatus(resJson.message);
    }

    return (
        <div className={styles["accessform-container"]}>
            <form onSubmit={handleSubmit} className={styles["accessform-form"]}>
                {hasEmail && <Email hasTooltip={hasTooltip} />}
                {hasPassword && <Password hasTooltip={hasTooltip} />}
                {hasAgreement && <Agreement />}
                <button type="submit">&gt;&gt;</button>
            </form>
            <p className={styles["accessform-status"]}>
                {status}
            </p>
        </div>
    );
}