'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { createClient } from '@/lib/supabase/client'
import { fetchCurrentProfile } from '@/lib/api/user.api'
import type { Profile } from '@/lib/types'

const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/cards': 'My Cards',
    '/cards/create': 'Create Card',
    '/analytics': 'Analytics',
    '/print': 'Print Cards',
    '/settings': 'Settings',
    '/billing': 'Billing',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

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

    const title = pageTitles[pathname] ??
        (pathname.includes('/edit') ? 'Edit Card' : pageTitles['/dashboard'])

    return (
        <div className="h-screen flex overflow-hidden bg-background">
            {/* Desktop sidebar — fixed height, never scrolls */}
            <div className="hidden md:flex md:w-64 shrink-0 h-screen">
                <Sidebar />
            </div>

            {/* Mobile sidebar drawer */}
            <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

            {/* Main content area — scrolls independently */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <TopNav
                    profile={profile}
                    onMenuClick={() => setMobileOpen(true)}
                    title={title}
                />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
