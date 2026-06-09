'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, CreditCard, BarChart2, Settings, Printer, ExternalLink, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'
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

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 border-r border-border bg-card">
            <div className="h-16 flex items-center px-5 border-b border-border">
                <Link href="/dashboard">
                    <Logo size="sm" />
                </Link>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                                active
                                    ? 'text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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

            <div className="p-3 space-y-1 border-t border-border">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-xl hover:bg-muted"
                >
                    <ExternalLink className="size-3.5" />
                    Visit homepage
                </a>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-xl hover:bg-destructive/10 text-left"
                >
                    <LogOut className="size-3.5" />
                    Sign out
                </button>
            </div>
        </aside>
    )
}
