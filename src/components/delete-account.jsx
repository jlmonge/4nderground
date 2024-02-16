'use client';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../user-provider';
import styles from '../styles/Accessflow.module.scss';

const confirmText = 'delete';

export default function DeleteAccount() {
    const { user, setUser } = useContext(UserContext);
    const [text, setText] = useState('');
    const router = useRouter()


    const handleClick = async () => {
        await fetch('/auth/delete-account', {
            method: 'POST',
            body: JSON.stringify({ userId: user.id }),
        });
        await fetch(`/auth/logout`, {
            method: 'POST',
        });
        setUser(null);
        router.push('/');
    }

    const handleChange = (e) => {
        if (text.length <= 6) {
            setText(e.target.value)
        }
    }

    return (
        <>
            <div className={styles["delete"]}>
                <label htmlFor="confirm" className={styles["delete__label"]}>
                    To proceed with deleting your 4nderground account, type &quot;<em>{confirmText}</em>&quot; then press the button.
                </label>
                <input type="text" id="confirm"
                    className={styles["delete__input"]}
                    onChange={handleChange}
                    maxLength={confirmText.length}
                />
                {/* <p>{text}</p> */}
            </div>
            <button type="button"
                className={styles["submit--circlebtn"]}
                onClick={handleClick}
                disabled={text !== confirmText}
            >
                Delete account
            </button>
        </>
    );
}