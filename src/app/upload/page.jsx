import UploadFile from '../../components/upload-file';
import FancyLink from '../../components/Shared/fancylink';
import styles from '../../styles/Upload.module.scss';
<<<<<<< HEAD

=======
>>>>>>> 5fc8298924e4c3d9495e88918892bfe779e42e79

export const metadata = {
    title: 'Upload file',
};

export default function UploadPage() {
    return (
        <div className={styles["upload-page"]}>
            <h2 className={styles["upl-h2"]}>Upload file</h2>
            <FancyLink href="/upload/record" text="Record instead" btnRight={false} />
            <UploadFile />
        </div>
    );
}