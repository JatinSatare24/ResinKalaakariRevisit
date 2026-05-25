'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '@/components/Login/Login.module.css'
import { client } from '@/lib/supabase'

export default function LoginPage() {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const supabase = client()
    const router = useRouter()

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                },
            })

            if (error) setErrorMessage(error.message)
        } catch (err) {
            console.error('Google login network/execution error:', err)
            setErrorMessage('An unexpected error occurred while connecting to Google.')
        }
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                setErrorMessage(error.message)
                setLoading(false)
            } else {
                router.push('/')
                router.refresh()
            }
        } catch (err: unknown) {
            console.error('Login network/execution error:', err)
            setErrorMessage('An unexpected network error occurred. Please try again.')
            setLoading(false)
        }
    }


    return (
        <></>
    )
}


