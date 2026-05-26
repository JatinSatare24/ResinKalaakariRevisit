'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { client } from '@/lib/supabase'
import styles from '@/components/Login/Login.module.css'

export default function ResetPassword() {

    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    const supabase = client()
    const router = useRouter()

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setErrorMessage('Passwords dont match!')
            return
        }

        setLoading(true)
        setErrorMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({
                password
            })

            if (error) {
                setErrorMessage(error.message)
                setLoading(false)
            } else {
                setSuccess(true)

                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }

        } catch (err) {
            console.error('Error updating the user password', err)
            setErrorMessage('An error occurred while updating the password, please try again!')
            setLoading(false)
        }
    }

    return (
        <main className={styles.authContainer} aria-labelledby="reset-title">
            <h1 id="reset-title" className={styles.title}>New Password</h1>
            <p className={styles.subtitle}>Enter your new sanctuary key</p>

            {/* --- CONDITIONAL VIEWS --- */}
            {success ? (
                <div
                    style={{ textAlign: 'center' }}
                    role="alert"
                    aria-live="assertive"
                >
                    <p style={{ color: '#2ecc71', marginBottom: '20px' }}>
                        Password updated successfully! Redirecting you to login...
                    </p>
                </div>
            ) : (
                <form
                    onSubmit={handleUpdatePassword}
                    aria-label="Password reset form"
                >
                    {/* New Password Input */}
                    <input
                        id="new-password"
                        className={styles.inputField}
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        aria-label="New Password"
                    />

                    {/* Confirm Password Input */}
                    <input
                        id="confirm-password"
                        className={styles.inputField}
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        aria-label="Confirm New Password"
                    />

                    {/* Error Alerts */}
                    {errorMessage && (
                        <p className={styles.errorText} role="alert">
                            {errorMessage}
                        </p>
                    )}

                    {/* Submit Action */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.primaryBtn}
                        aria-busy={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            )}
        </main>
    )
}