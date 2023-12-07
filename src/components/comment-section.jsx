// thx https://react.dev/reference/react/useState#list-array
'use client'

import Report from './report'
import Avatar from './avatar'
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserContext } from '../user-provider';

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

const BTN_SIZE = 20;

function Comment({ comment, onDelete, isMyComment }) {
    const handleDelete = async () => {
        const data = new FormData();
        data.append('commentUserId', comment.user_id);
        data.append('commentId', comment.id);

        const res = await fetch('/api/comment/delete', {
            method: 'POST',
            body: data,
        });

        if (!res.ok) {
            console.log("delete failed. dopey.")
        } else {
            onDelete(comment.id)
        }

    }

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
            <Avatar userId={comment.user_id} />
            <p style={{ margin: '0' }}>{comment.comment}</p>
            {isMyComment &&
                <button
                    onClick={handleDelete}
                    type="button"
                    title="Delete comment"
                    //aria-label="Delete comment" // TODO: accessibility update
                    //role="button"
                    style={{
                        width: `${BTN_SIZE}px`,
                        height: `${BTN_SIZE}px`,
                        position: 'relative',
                    }}
                >
                    <Image
                        src="/trash-2.svg"
                        alt="Delete comment icon"
                        sizes={BTN_SIZE}
                        fill
                        style={{ objectFit: 'contain' }} // optional
                    />
                </button>
            }
        </div>
    );
}

function AddComment({ onAddComment, trackId }) {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('comment', comment);
        data.append('trackId', trackId);

        const res = await fetch('/api/comment/add', {
            method: 'POST',
            body: data,
        });
        const resJson = await res.json();

        if (!res.ok) {
            console.log("COMMENT NOT ADDED");
        } else {
            onAddComment(resJson.commentObj); // add comment on the client-side
        }

        setComment('');

    };

    return (
        <>
            <form
                method="POST"
                onSubmit={handleSubmit}
            >
                <label htmlFor="make-comment">Make a comment:</label>
                <input
                    placeholder="Thoughts..."
                    type="text"
                    id="make-comment"
                    required
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <button type="submit">Post comment</button>
            </form>
        </>
    );
}

function CommentList({ comments, onDeleteComment, curUserId }) {
    let commentContent;
    if (comments?.length) {
        commentContent = (
            <>
                <ul style={{ width: "100%", padding: 0 }}>
                    {comments.map(c =>
                        <li key={c.id} style={{ listStyleType: "none", width: "100%" }}>
                            <Comment
                                comment={c}
                                onDelete={onDeleteComment}
                                isMyComment={curUserId === c.user_id}
                            />
                        </li>
                    )}
                </ul>
            </>
        );
    } else {
        commentContent = (
            <>
                <p>No comments.</p>
            </>
        );
    }

    const debug = () => console.log(JSON.stringify(comments, null, `\t`));

    return (
        <>
            {commentContent}
            <p>debug - comments according to CList:</p>
            <button onClick={debug}>ALL</button>
        </>
    );
}

export default function CommentSection({ trackId }) {
    let content;
    //const [curUserId, setCurUserId] = useState(''); // 'Assignments to the 'curUserId' variable from inside React Hook useEffect will be lost after each render.'
    const [comments, setComments] = useState([]);
    const supabase = createClientComponentClient();
    const { user, setUser } = useContext(UserContext);

    // useEffect(() => {
    //     const getUser = async () => {            
    //         setCurUserId(user?.id);
    //     }
    //     getUser();
    // }, [user])

    useEffect(() => {
        if (trackId) {
            //console.log(`new trackId, fetching new comments: ${trackId}`)
            const fetchComments = async () => {
                let { data, error } = await supabase
                    .from('comments')
                    .select('id, comment, user_id, posted_at')
                    .eq('track_id', trackId)
                    .order('posted_at', { ascending: false });
                setComments(data);
                //console.log(`fetched comments: ${JSON.stringify(data)}`);
            };
            fetchComments();
        }
    }, [trackId, supabase]);

    const handleAddComment = (commentObj) => {
        console.log(`NEW COMMENT: ${JSON.stringify(commentObj, null, '\t')}`);
        setComments([
            commentObj,
            ...comments,
        ]);
    };

    const handleDeleteComment = (commentId) => {
        setComments(
            comments.filter(c => c.id !== commentId)
        );
        console.log(":o bye comment");
    };

    if (trackId) {
        content = (
            <>
                <h3>Comments</h3>
                <AddComment
                    onAddComment={handleAddComment}
                    trackId={trackId}
                />
                <CommentList
                    comments={comments}
                    onDeleteComment={handleDeleteComment}
                    curUserId={user?.id}
                />
            </>
        );
    } else {
        content = (
            <p>Comments unavailable.</p>
        );
    }


    return (
        <>
            {content}
        </>
    );
}