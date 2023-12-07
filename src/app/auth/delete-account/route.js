import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const reqJson = await req.json();
    console.log(JSON.stringify(reqJson));
    const userId = reqJson.userId;

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const { data, error } = await supabase.auth.admin.deleteUser(userId)
    if (error) {
        return NextResponse.json({
            message: 'Your account could not be deleted. Contact web admin'
        }, { status: 400 })
    }

    console.log(`Account deleted. Godspeed, ${userId}`)
    return NextResponse.json({
        message: 'Account successfully deleted'
    }, { status: 200 });
}