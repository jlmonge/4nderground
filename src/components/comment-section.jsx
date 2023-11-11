'use client'

import Report from './report'
import Avatar from './avatar'

/*
DISPLAY WISE: A comment consists of:
- Avatar (clickable to profile)
- Comment text
- Report button
- Reply button
DB WISE: A comment consists of:
- Comment ID
- Content
- Commenter/User ID (FK)
- Track ID (FK)
- created_at
*/
function Comment({ text }) {
    return (
        <>
            <Avatar />
            <p>{text}</p>
        </>
    );
}

function MakeComment() {
    const handleSubmit = async (e) => {
        e.preventDefault()
        // const res = await uploadCommentHelper();
    };

    return (
        <>
            <form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="make-comment">Make a comment:</label>
                <input type="text" id="make-comment" />
                <button type="submit">Comment</button>
            </form>
        </>
    );
}

export default function CommentSection() {
    return (
        <>
            <h3>Comments</h3>
            <MakeComment />
        </>
    );
}