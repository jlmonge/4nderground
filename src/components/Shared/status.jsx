import styles from '../../styles/Status.module.scss';

export default function Status({ loading, response, isError }) {
    let content;

    // loading and response use different animations
    if (loading) {
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
            {/* loading: {String(loading)}, response: {response}, isError: {String(isError)} */}
        </div>
    )
}