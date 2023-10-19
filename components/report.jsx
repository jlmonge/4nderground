'use client';

import { Fragment, useState } from 'react';

function Header({ title }) {
    return <h1>{title ? title : 'Default title'}</h1>;
}

export default function Report() {
    const [reports, setReports] = useState(0);

    function handleSubmit(e) {
        e.preventDefault();
        setReports(reports + 1);
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
        <div>
            <Header title='Report' />
            <form method='post' onSubmit={handleSubmit}>
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
            <p>You have submitted {reports} {reports == 1 ? 'report' : 'reports'}</p>
        </div>
    );
}