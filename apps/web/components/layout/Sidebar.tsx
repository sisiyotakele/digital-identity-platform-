'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, CreditCard, BarChart2, Settings, Printer, ExternalLink, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'
import { Dock } from '@/components/ui/Dock'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/cards', label: 'My Cards', icon: CreditCard },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/print', label: 'Print Cards', icon: Printer },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        toast.success('Signed out')
        router.push('/login')
    }

    const dockItems = navItems.map(({ href, label, icon: Icon }) => ({
        icon: <Icon className="size-4" />,
        label,
        onClick: () => router.push(href),
        className: pathname === href || (href !== '/dashboard' && pathname.startsWith(href)) ? 'ring-2 ring-primary/50' : '',
    }))

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col h-full border-r border-border bg-card overflow-hidden">
            {/* Logo */}
            <div className="h-16 flex items-center px-5 border-b border-border shrink-0">
                <Link href="/dashboard">
                    <Logo size="sm" />
                </Link>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                                active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                        >
                            {active && (
                                <motion.div
                                    layoutId="sidebar-pill"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl shadow-sm"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <Icon className="size-4 shrink-0 relative z-10" />
                            <span className="relative z-10">{label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom — Dock + footer links */}
            <div className="shrink-0 border-t border-border">
                {/* Dock — macOS-style magnifying dock */}
                <div className="relative h-20 flex items-end justify-center overflow-visible pb-1">
                    <Dock
                        items={dockItems}
                        panelHeight={52}
                        baseItemSize={36}
                        magnification={52}
                        distance={150}
                    />
                </div>

                {/* Footer links */}
                <div className="px-3 pb-3 space-y-0.5">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-xl hover:bg-muted"
                    >
                        <ExternalLink className="size-3.5 shrink-0" />
                        Visit homepage
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-xl hover:bg-destructive/10 text-left"
                    >
                        <LogOut className="size-3.5 shrink-0" />
                        Sign out
                    </button>
                </div>
            </div>
        </aside>
    )
}
