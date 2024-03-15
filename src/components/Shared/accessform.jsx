'use client';

import Link from 'next/link';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../user-provider';
import Status from './status';
import styles from '../../styles/Accessflow.module.scss';

function Email() {
    return (
        <div className={styles["af-inputtext-container"]}>
            <label className={styles["visually-hidden"]} htmlFor="email">Email</label>
            <input type="email" id="email" name="email"
                placeholder="Email" className={styles["af-inputtext"]}
                autoComplete="email" required
            />
        </div>
    )
}

function Password({ hasRequirements }) {
    const [isObscured, setIsObscured] = useState(true);
    const handleSeePassword = () => {
        setIsObscured(!isObscured);
    }

    return (
        <div className={styles["af-inputwreqs"]}>
            <div className={styles["af-inputtext-container"]}>
                <label className={styles["visually-hidden"]} htmlFor="password">Password</label>
                <input type={isObscured ? "password" : "text"} name="password" id="password"
                    placeholder="Password" className={`${styles["af-inputtext"]} ${styles["af-password"]}`}
                    autoComplete="current-password" minLength={8} required
                />
                <button title="Show password" type="button" className={styles["showpassword-btn"]} onClick={handleSeePassword}>
                    <span
                        className={`${styles["showpassword-icon"]} ${isObscured ? styles["obscured"] : styles["notobscured"]}`}
                    />
                </button>
            </div>
            {
                hasRequirements &&
                <p className={styles["requirements"]}>
                    Password must be at least 8 characters.
                </p>
            }
        </div>

    )
}

function Agreement() {
    return (
        <div className={styles["agreement-container"]}>
            <input type="checkbox" name="agreement"
                id="agreement" className={styles["af-inputcheckbox"]}
                required
            />
            <label className={styles["agreement-label"]} htmlFor="agreement">
                I have read and agree with the <Link href="/legal" className={styles["underline"]}>Terms of Service</Link> and <Link href="privacy" className={styles["underline"]}>Privacy Policy</Link>.
            </label>
        </div>
    )
}

export default function AccessForm({
    hasEmail = false,
    hasPassword = false,
    hasAgreement = false,
    hasRequirements = false,
    action = "",
}) {
    const router = useRouter();
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setResponse('');
        setIsError(false);

        try {
            const data = new FormData(e.target);
            // console.log(`email: ${data.get('email')}`);
            // console.log(`password: ${data.get('password')}`);
            // console.log(`agreement: ${data.get('agreement')}`);
            const res = await fetch(action, {
                method: 'POST',
                body: data,
            })

            const resJson = await res.json();
            setResponse(resJson.message);

            if (res.ok) {
                console.log("GOOD RESPONSE");
                if (
                    resJson.action === 'login'
                ) {
                    setUser(resJson.user);
                    console.log(`received user: ${resJson.user}`)
                    router.push('/player');
                }
            } else {
                setIsError(true);
            }
        } catch (e) {
            console.log(e);
            setIsError(true);
            setResponse('Something bad happened.')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles["accessform-container"]}>
            <form onSubmit={handleSubmit} className={styles["accessform-form"]}>
                <div className={styles["afinputs-container"]}>
                    {hasEmail && <Email />}
                    {hasPassword && <Password hasRequirements={hasRequirements} />}
                    {hasAgreement && <Agreement />}
                </div>
                <button className={styles["af-btn"]} type="submit">
                    <span className={styles["af-btn__text"]} >&gt;&gt;</span>
                </button>
            </form>
            <Status loading={loading} response={response} isError={isError} />
        </div>
    );
}