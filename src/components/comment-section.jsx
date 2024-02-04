// thx https://react.dev/reference/react/useState#list-array
'use client'

import Report from './report';
import Avatar from './avatar';
import { useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserContext } from '../user-provider';
import styles from '../styles/Comments.module.scss';
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

const BTN_SIZE = 20;

function Comment({ comment, onDelete, isMyComment, curUserId }) {
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

    let whenPostedText;
    // const whenPostedS = new Date(comment.posted_at) / 1000;
    // const nowS = Date.now() / 1000;
    const diffS = (Date.now() - new Date(comment.posted_at)) / 1000;
    // console.log(`whenPostedS: ${whenPostedS}`)
    // console.log(`nowS: ${nowS}`)
    // console.log(`diffS: ${diffS}`)
    if (diffS < 60) {
        whenPostedText = `Less than a minute ago`
    } else if (diffS < 60 * 60) {
        const diffM = Math.trunc(diffS / 60);
        whenPostedText = `${diffM} minute${diffM === 1 ? '' : 's'} ago`
    } else {
        const diffH = Math.trunc(diffS / 60 / 60);
        whenPostedText = `${diffH} hour${diffH === 1 ? '' : 's'} ago`
    }

    let optionsJSX;
    if (isMyComment) {
        optionsJSX = (
            <button
                onClick={handleDelete}
                type="button"
                title="Delete comment"
                //aria-label="Delete comment" // TODO: accessibility update
                //role="button"
                className={styles["c-delete"]}
            >
                Delete
            </button>
        );

    } else if (curUserId) {
        optionsJSX = (<Report contentType='comment' contentId={comment.id} />);
    }


    return (
        <div className={styles["comment-container"]}>
            <Avatar userId={comment.user_id} />
            <div className={styles["comment"]}>
                <p className={styles["c-comment"]}>{comment.comment}</p>
                <p className={styles["c-timesincecomment"]} title={comment.posted_at}>{whenPostedText}</p>
                {optionsJSX}
            </div>
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
                className={styles["mycomment-form"]}
            >
                <label className={styles["visually-hidden"]} htmlFor="write-comment">Write a comment</label>
                <input
                    placeholder="Write a comment..."
                    type="text"
                    id="write-comment"
                    required
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className={styles["mycomment-comment"]}
                />
                <button type="submit" className={styles["mycomment-submit"]}>
                    <span className={styles["mcs-text"]}>&gt;&gt;</span>
                </button>
            </form>
        </>
    );
}

function CommentList({ comments, onDeleteComment, curUserId }) {
    let commentContent;
    if (comments?.length) {
        commentContent = (
            <>
                <ul className={styles["clist-ul"]}>
                    {comments.map(c =>
                        <li key={c.id} className={styles["clist-li"]}>
                            <Comment
                                comment={c}
                                onDelete={onDeleteComment}
                                isMyComment={curUserId === c.user_id}
                                curUserId={curUserId}
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
            {/* <p>debug - comments according to CList:</p>
            <button onClick={debug}>ALL</button> */}
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
            <div className={styles["commentsection-container"]}>
                <h2 className={styles["comments-heading"]}>Comments</h2>
                <div className={styles["comments-container"]}>
                    {user &&
                        <AddComment
                            onAddComment={handleAddComment}
                            trackId={trackId}
                        />
                    }
                    <CommentList
                        comments={comments}
                        onDeleteComment={handleDeleteComment}
                        curUserId={user?.id}
                    />
                </div>
            </div>
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