export default function AuthButton({ text }) {
    return (
        <>
            <button style={{
                backgroundColor: 'black',
                width: '128px',
                height: '32px',
                color: 'white',
                border: '1px solid white',
            }} type='submit'>{text}</button>
        </>
    )
}