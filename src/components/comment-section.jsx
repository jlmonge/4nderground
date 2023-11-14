// thx https://react.dev/reference/react/useState#list-array
'use client'

import Report from './report'
import Avatar from './avatar'
import { useState } from 'react';
import Image from 'next/image';

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

let nextId = 0;
const BTN_SIZE = 24;

function Comment({ comment, onDelete }) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr 50px", // sync left col w/ avi size
            gridTemplateAreas: "avi comment delete", // TODO: add report
            columnGap: "8px",
            justifyItems: "start", // can combine with alignItems in placeItems
            alignItems: "start",
            margin: "10px 0",
            width: "100%",
        }}>
            <Avatar />
            <p style={{ margin: '0' }}>{comment.id}: {comment.text}</p>
            <button
                onClick={() => onDelete(comment.id)}
                type="button"
                style={{
                    width: `${BTN_SIZE}px`,
                    height: `${BTN_SIZE}px`,
                    position: 'relative',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                }}
            >
                <Image
                    src="trash-2.svg"
                    alt="Delete your comment"
                    sizes={BTN_SIZE}
                    fill
                    style={{ objectFit: 'contain' }} // optional
                />
            </button>

        </div>
    );
}

function AddComment({ onAddComment }) {
    const [comment, setComment] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddComment(comment);
        setComment('');
    };

    return (
        <>
            <form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="make-comment">Make a comment:</label>
                <input
                    placeholder="Thoughts..."
                    type="text"
                    id="make-comment"
                    required
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <button type="submit">Comment</button>
            </form>
        </>
    );
}

function CommentList({ comments, onDeleteComment }) {
    return (
        <>
            <ul style={{ width: "100%", padding: 0 }}>
                {comments.map(c => (
                    <li key={c.id} style={{ listStyleType: "none", width: "100%" }}>
                        <Comment
                            comment={c}
                            onDelete={onDeleteComment}
                        />
                    </li>
                ))}
            </ul>
        </>
    )
}

export default function CommentSection() {
    const [comments, setComments] = useState([]);

    const handleAddComment = (text) => {
        setComments([
            {
                id: nextId++,
                text: text,
            },
            ...comments,
        ]);
        console.log(":o new comment")
    };

    const handleDeleteComment = (commentId) => {
        setComments(
            comments.filter(c => c.id !== commentId)
        );
        console.log(":o bye comment");
    };

    return (
        <>
            <h3>Comments</h3>
            <AddComment onAddComment={handleAddComment} />
            <CommentList
                comments={comments}
                onDeleteComment={handleDeleteComment}
            />
        </>
    );
}