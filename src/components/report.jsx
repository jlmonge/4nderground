'use client';

import { Fragment, useState, useRef, useContext } from 'react';
import Image from 'next/image';
import { UserContext } from '../user-provider';

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
    desc: 'Content is extremely low quality. Includes (but not limited to) empty recordings, irrelevant comments.'
}, {
    id: 4,
    value: 'pi',
    str: 'Personal information',
    desc: 'Content that contains personal information. Includes (but not limited to) doxing, recording of private conversation.'
}, {
    id: 5,
    value: 'malicious',
    str: 'Malicious content',
    desc: 'Content that steals data and/or causes unexpected behavior on your device.',
}, {
    id: 6,
    value: 'harassment',
    str: 'Harassment',
    desc: 'Content that involves racism and/or serious threats.'
}, {
    id: 7,
    value: 'impersonation',
    str: 'Impersonating staff',
    desc: 'Someone is impersonating admins and/or moderators.'
}];

function ReportTooltip({ info }) {
    const [hover, setHover] = useState(false);

    const handleMouseEnter = () => {
        setHover(true);
    }

    const handleMouseLeave = () => {
        setHover(false);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>

            <Image
                src="/info.svg"
                alt="Information icon"
                width={BTN_SIZE}
                height={BTN_SIZE}
                //style={{ objectFit: 'contain' }} // optional
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <div style={{ position: 'relative' }}>
                <p style={{
                    display: hover ? 'block' : 'none',
                    position: 'absolute',
                    top: '-1em',
                    left: '0.5em',
                    width: `${Math.trunc(DIALOG_WIDTH_VW / 2)}vw`,
                }}>
                    {info}
                </p>
            </div>
        </div>
    );
}


// TODO: notice how aretracks is unnecesary; just check if contentid is valid
// TODO: when checking if report btn is clickable.
export default function Report({ areTracks, contentType, contentId }) {
    const dialogRef = useRef(null);
    const [reason, setReason] = useState('');
    const [isReported, setIsReported] = useState(false);
    const { user, setUser } = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!reason) return; // pls error
        if (!user) return; // pls error

        try {
            const data = new FormData();
            data.append('reportedid', contentId)
            data.append('reporterid', user.id)
            data.append('reason', reason);
            data.append('type', contentType);

            const res = await fetch('/api/report/add', {
                method: 'POST',
                body: data,
            });
            const resJson = await res.json();

            if (!res.ok) {
                console.log("report fail.");
            } else {
                console.log("report success.");
                console.log(`${JSON.stringify(resJson.data)}`);
                setIsReported(true);
            }

        } catch (e) {
            console.log(e);
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

    return (
        <>
            <dialog ref={dialogRef} style={{
                backgroundColor: 'black',
                color: 'white',
                width: `${DIALOG_WIDTH_VW}vw`,
            }}>
                <button
                    id="close"
                    onClick={handleClose}
                    type="button"
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        backgroundColor: 'transparent',
                        borderStyle: 'none',
                        padding: '0',
                        margin: '2px',
                        fontSize: '16px',
                        color: 'white',
                    }}
                >
                    X
                </button>
                <h1>Report</h1>
                <form method="POST" onSubmit={handleSubmit} style={{ gap: '10px' }}>
                    {REPORT_REASONS.map((r) => (
                        <div key={r.id} style={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}>
                            <label style={{ minWidth: '11em' }}>
                                <input type="radio" name="report_reason" value={r.value} onChange={handleChange} checked={reason === r.value} required />
                                {r.str}
                            </label>
                            <ReportTooltip info={r.desc} />
                        </div>
                    ))}
                    <button type="submit" disabled={!reason || isReported}>Submit</button>
                    <p>{isReported && 'Your report has been received. Thank you.'}</p>
                </form>
            </dialog>
            <button style={{ backgroundColor: 'black' }} onClick={handleOpen} type="button" disabled={(contentType === 'tracks' && !areTracks)}>
                <Image
                    src="/flag.svg"
                    width={BTN_SIZE}
                    height={BTN_SIZE}
                    alt="Report icon"
                />
            </button>
        </>
    );
}