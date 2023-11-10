import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/*
export async function GET(request) {
    const requestUrl = new URL(request.url)
}
*/
export async function POST(request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${requestUrl.origin}/auth/callback`,
        },
    })

    if (error) {
        console.log(error)
        return NextResponse.redirect(
            `${requestUrl.origin}/register?error=Could not authenticate user`,
            {
                status: 301,
            }
        )
    }

    return NextResponse.redirect(
        `${requestUrl.origin}/login?message=Check email to continue sign in process`,
        {
            status: 301,
        }
    )
}