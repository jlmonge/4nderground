export default function Recovery() {
    return (
        <>
            <p>Enter your email and we&apos;ll send you a link to reset your password:</p>
            <form action="/auth/password/recover" method="POST">
                <input type="email" name="email" id="email" />
                <button type="submit">Send</button>
            </form>
        </>
    );
}