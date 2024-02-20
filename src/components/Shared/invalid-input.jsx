import styles from '../../styles/Validateinput.module.scss';

export default function InvalidInput({ text }) {
    return (
        <div className={styles["invalid"]}>
            {text}
        </div>
    );
}