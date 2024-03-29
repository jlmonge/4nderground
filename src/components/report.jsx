'use client';

import { Fragment, useState, useRef, useContext } from 'react';
import { UserContext } from '../user-provider';
import Tooltip from './Shared/tooltip';
import Status from './Shared/status';
import styles from '../styles/Report.module.scss';

const BTN_SIZE = 16;
const DIALOG_WIDTH_VW = 90;

const REPORT_REASONS = [{
    id: 0,
    value: 'legal',
    str: 'Legal Issue',
    desc: 'Content infringes on legal rights such as copyright.',
}, {
    id: 1,
    value: 'illegal',
    str: 'Illegal Content',
    desc: 'Content that violates local or United States law.',
}, {
    id: 2,
    value: 'spam',
    str: 'Spam',
    desc: 'Large amounts of repetitive content.'
}, {
    id: 3,
    value: 'quality',
    str: 'Low quality',
    desc: 'Content is extremely low quality. Examples of this are empty recordings and irrelevant comments.'
}, {
    id: 4,
    value: 'pi',
    str: 'Personal information',
    desc: 'Content that contains personal information. Examples of this are doxxing, recording of private conversation.'
}, {
    id: 5,
    value: 'malicious',
    str: 'Malicious content',
    desc: 'Content that steals data and/or causes unexpected behavior on your device.',
}, {
    id: 6,
    value: 'harassment',
    str: 'Harassment',
    desc: 'Content that involves racism and/or threats.'
}, {
    id: 7,
    value: 'impersonation',
    str: 'Impersonating staff',
    desc: 'Someone is impersonating admins and/or moderators.'
}];

// TODO: notice how aretracks is unnecesary; just check if contentid is valid
// TODO: when checking if report btn is clickable.
export default function Report({ contentType, contentId = null, large = false }) {
    const dialogRef = useRef(null);
    const [reason, setReason] = useState('');
    const [isReported, setIsReported] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [isError, setIsError] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setResponse('');
        setIsError(false);

        if (contentId !== 'DEMO') {
            setLoading(true);

            try {
                if (!reason) throw Error('No reason');
                if (!user) throw Error('No one is logged in');
                const data = new FormData();
                data.append('reportedid', contentId);
                data.append('reporterid', user.id);
                data.append('reason', reason);
                data.append('type', contentType);

                const res = await fetch('/api/report/add', {
                    method: 'POST',
                    body: data,
                });
                const resJson = await res.json();
                setResponse(resJson.message);

                if (!res.ok) {
                    setIsError(true);
                } else {
                    setIsReported(true);
                }
            } catch (e) {
                console.log(e);
                setResponse('Something bad happened.');
                setIsError(true);

            } finally {
                setLoading(false);
            }
        } else {
            setResponse('You cannot report the demo track.');
            setIsError(true);
            setIsReported(true);
        }

    }

    function handleOpen() {
        dialogRef.current.showModal();
    }

    function handleClose() {
        dialogRef.current.close();
    }

    function handleChange(e) {
        setReason(e.target.value);
    }

    let openButton;

    if (contentType === 'track') {
        openButton = (
            <button
                className={styles["opendialog-btn--track"]}
                style={large ? { fontSize: '1em' } : {}}
                data="Report"
                onClick={contentId ? handleOpen : undefined}
                type="button" disabled={!contentId}
            >
                <span className={styles["icon"]}></span>
            </button>
        );
    } else {
        openButton = (
            <button
                className={styles["opendialog-btn"]}
                style={large ? { fontSize: '1em' } : {}}
                data="Report"
                onClick={contentId ? handleOpen : undefined}
                type="button" disabled={!contentId}
            >
                Report
            </button>
        );
    }

    return (
        <>
            {contentId && (
                <dialog
                    ref={dialogRef}
                    className={styles["dialog"]}
                    onClick={handleClose}
                >
                    <div
                        className={styles["dialog__inner"]}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            id="close"
                            onClick={handleClose}
                            type="button"
                            className={styles["dialog__close"]}
                        >
                            X
                        </button>
                        <div className={styles["report"]}>
                            <h3>Report</h3>
                            <form method="POST" onSubmit={handleSubmit} className={styles["form"]}>
                                {REPORT_REASONS.map((r) => (
                                    <div key={r.id} className={styles["form__reason"]}>
                                        <label>
                                            <input type="radio" name="report_reason" value={r.value} onChange={handleChange} checked={reason === r.value} required />
                                            {r.str}
                                        </label>
                                        <Tooltip info={r.desc} />
                                    </div>
                                ))}
                                <hr className={styles["divider"]} />
                                <button
                                    type="submit"
                                    disabled={!reason || isReported}
                                    className={styles["submit-btn"]}
                                >
                                    Submit
                                </button>
                                <Status loading={loading} response={response} isError={isError} />
                            </form>
                        </div>
                    </div>
                </dialog>
            )}
            {openButton}
        </>
    );
}