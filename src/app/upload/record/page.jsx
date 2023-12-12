import dynamic from 'next/dynamic';

const Record = dynamic(
    () => {
        return import('../../../components/record');
    },
    { ssr: false }
)

export default function RecordPage() {
    return (
        <>
            <Record />
        </>

    )
}