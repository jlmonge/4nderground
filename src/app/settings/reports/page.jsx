'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../user-provider';

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const supabase = createClientComponentClient();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const fetchReports = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('reports')
                .select('reported_id, type, reason, status, created_at')
                .eq('reporter_id', user.id)
                .order('created_at', { ascending: false });
            if (error) console.log(error);
            setReports(data);
        }
        fetchReports();
    }, [supabase, user])

    return (
        <>
            <table style={{ border: '2px solid white' }}>
                <tbody>
                    <tr style={{ backgroundColor: 'grey' }}>
                        <th>Content</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Date Reported</th>
                    </tr>
                    {reports.length > 0 && reports.map((r) => {
                        return (
                            <tr key={r.reported_id}>
                                <td>{r.type} {r.reported_id}</td>
                                <td>{r.reason}</td>
                                <td>{r.status}</td>
                                <td>{r.created_at}</td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>
        </>
    );
}