import styles from '../../styles/Status.module.scss';

export default function Status({ isLoading, response, isError }) {
    let content;

    // loading and response use different animations
    if (isLoading) {
        content = <p className={styles["status__loading"]}>Doing as you say...</p>
    } else if (response) {
        content = (
            <p className={`${styles["status__response"]} ${isError ? styles["status__error"] : null}`}>
                {response}
            </p>
        )

    }

    return (
        <div className={styles["status"]}>
            {content}
            {/* isLoading: {String(isLoading)}, response: {response}, isError: {String(isError)} */}
        </div>
    )
}