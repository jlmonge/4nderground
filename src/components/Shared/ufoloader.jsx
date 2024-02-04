import Image from 'next/image';

export default function UFOLoader() {
    return (
        <>
            <h2>Loading...</h2>
            <Image
                src="/ufo.gif"
                alt="Loading animation"
                width={400}
                height={209}
            />
        </>
    );
}