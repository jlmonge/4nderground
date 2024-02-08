'use client';

import AccessForm from './Shared/accessform';
// import FancyLink from './Shared/fancylink';
import { useSearchParams } from 'next/navigation';
import styles from '../styles/Accessflow.module.scss'
import { almarai } from '../app/fonts';

export default function UpdatePassword({ route }) {
    // TODO: test useEffect once custom SMTP server set up
    // useEffect(() => {
    //     const preventUnload = (e) => {
    //         const message = "Are you sure you want to exit this page?";
    //         e.preventDefault();
    //         e.returnValue = message;
    //     }

    //     window.addEventListener('beforeunload', preventUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', preventUnload);
    //     }

    // })
    const searchParams = useSearchParams();
    const error = searchParams.get('error')
    let content;
    if (error) {
        const errorDesc = searchParams.get('error_description');
        content = (
            <p className={styles["af-statusnotok"]}>
                {errorDesc}
            </p>
        )

    } else {
        content = (
            <div className={`${styles["accessflow-page"]} ${almarai.className}`}>
                <h2 className={styles["af-h2"]}>Change Password</h2>
                <AccessForm hasPassword
                    hasRequirements action={route}
                />
            </div>
        )
    }
    return (
        <>
            {content}
        </>

    );
}