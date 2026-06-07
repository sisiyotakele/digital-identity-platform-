'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { createClient } from '@/lib/supabase/client'
import { fetchCurrentProfile } from '@/lib/api/user.api'
import type { Profile } from '@/lib/types'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                router.push('/login')
                return
            }
            fetchCurrentProfile().then(setProfile)
        })
    }, [router])

    return (
        <div className="min-h-screen flex bg-slate-50">
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <TopNav profile={profile} onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
