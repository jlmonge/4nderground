import dynamic from 'next/dynamic';
import UploadFile from '../../../components/upload-file';
import FancyLink from '../../../components/Shared/fancylink';
import styles from '../../../styles/Upload.module.scss';

const Record = dynamic(
    () => {
        return import('../../../components/record');
    },
    { ssr: false }
)

export default function RecordPage() {
    return (
        <div className={styles["upload-page"]}>
            <h2 className={styles["upl-h2"]}>Record Now</h2>
            <FancyLink href="/upload" text="Upload instead" btnRight={false} />
            <Record />
        </div>

    )
}