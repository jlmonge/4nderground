import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const formData = await req.formData();
    const reportedId = formData.get('reportedid');
    const reporterId = formData.get('reporterid');
    const reportReason = formData.get('reason');
    const reportType = formData.get('type');

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data, error } = await supabase
        .from('reports')
        .insert([
            {
                reported_id: reportedId,
                reporter_id: reporterId,
                reason: reportReason,
                type: reportType,
                status: 'open',
            }
        ])
        .select();
    if (error) throw new Error(JSON.stringify(error));

    return NextResponse.json({
        data: JSON.stringify(data)
    }, { status: 200 });
}