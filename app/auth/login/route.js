import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return NextResponse.redirect(
            `${requestUrl.origin}/login?error=Could not authenticate user`,
            {
                status: 301,
            }
        )
    }

    return NextResponse.redirect(`${requestUrl.origin}/player`, {
        status: 301,
    })
}