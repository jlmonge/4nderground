import Link from 'next/link';

function validateUpload() {

}

export default function Upload() {
    return (
        <>
            <form action='post'>
                <input type='file' name='user-file' id='user-file' required />
                <button type='submit'>Upload</button>
            </form>
            <Link href='/'>Go Home</Link>
        </>
    )
}