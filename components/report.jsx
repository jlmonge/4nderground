'use client';

import { Fragment, useState, useRef } from 'react';
import Image from 'next/image';

export default function Report({ BTN_SIZE }) {
    const dialogRef = useRef(null);
    const [reports, setReports] = useState(0);

    function handleSubmit(e) {
        e.preventDefault();
        setReports(reports + 1);
    }

    function handleOpen() {
        dialogRef.current.showModal();
    }

    function handleClose() {
        dialogRef.current.close();
    }

    const reportReasons = [{
        id: 0,
        value: 'legal_issue',
        str: 'Legal Issue',
    }, {
        id: 1,
        value: 'illegal_content',
        str: 'Illegal Content',
    },]

    return (
        <>
            <dialog ref={dialogRef} style={{ backgroundColor: 'black', color: 'white' }}>
                <button
                    id='close'
                    onClick={handleClose}
                    type='button'
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
                    }}>
                    X
                </button>
                <h1>Report</h1>
                <form method='post' onSubmit={handleSubmit} style={{ alignItems: 'flex-start', }}>
                    {reportReasons.map((reason) => (
                        <Fragment key={reason.id}>
                            <label>
                                <input type='radio' name='report_reason' value={reason.value} required />
                                {reason.str}
                            </label>
                            <br />
                        </Fragment>
                    ))}
                    <button type='submit'>Submit</button>
                </form>
                <p>You have submitted {reports} report{reports == 1 ? '' : 's'}</p>
            </dialog>
            <button style={{ backgroundColor: 'black' }} onClick={handleOpen} type='button'>
                <Image
                    src="flag.svg"
                    width={BTN_SIZE}
                    height={BTN_SIZE}
                    alt="Skip Back"
                />
            </button>
        </>
    );
}