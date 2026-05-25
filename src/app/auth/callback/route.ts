import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)

    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null
    const next = requestUrl.searchParams.get('next') ?? '/'

    const supabase = await createServerSupabaseClient()

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) return redirectToError(requestUrl, error.message)
    } else if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
        })
        if (error) return redirectToError(requestUrl, error.message)
    } else {
        return redirectToError(requestUrl, "Invalid authentication parameters");
    }

    const safePath = next?.startsWith('/') ? next : '/'
    return NextResponse.redirect(new URL(safePath, requestUrl.origin))
}

function redirectToError(requestUrl: URL, message: string) {
    console.error('An unexpected auth error occured!', message)
    const errorUrl = new URL('/login', requestUrl.origin)
    errorUrl.searchParams.set('error', message)
    return NextResponse.redirect(errorUrl)
}
