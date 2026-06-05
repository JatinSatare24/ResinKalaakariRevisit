'use client'

import React, { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/lib/supabase'
import { FiMenu, FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSettings } from "react-icons/fi";
import styles from '@/components/Navbar/Navbar.module.css';

export interface UserMetadata {
    full_name?: string,
    avatar_url?: string,
    picture?: string,
    [key: string]: unknown
}

export interface SupabaseUser {
    id: string,
    email?: string,
    user_metadata?: UserMetadata
}

export default function Navbar() {
    const [open, setOpen] = useState<boolean>(false)
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const supabase = client()
    const router = useRouter()

    useEffect(() => {

        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error) throw error
                setUser(user as SupabaseUser | null)
            } catch (err) {
                console.error('Error fetching user!', err)
            }
        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser((session?.user as SupabaseUser) ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    useEffect(() => {

        function handleCLickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleCLickOutside)

        return () => document.removeEventListener('mousedown', handleCLickOutside)

    }, [])

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (err) {
            console.error("Error logging out!", err)
        } finally {
            setDropdownOpen(false)
            router.push('/')
            router.refresh()
        };
    }


}