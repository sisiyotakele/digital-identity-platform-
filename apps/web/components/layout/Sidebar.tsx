'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, CreditCard, BarChart2, Settings,
    Printer, ExternalLink, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react'
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

const COLLAPSED_KEY = 'sidebar-collapsed'

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = useState(false)

    // Persist collapse state
    useEffect(() => {
        const saved = localStorage.getItem(COLLAPSED_KEY)
        if (saved === 'true') setCollapsed(true)
    }, [])

    function toggleCollapse() {
        setCollapsed((c) => {
            localStorage.setItem(COLLAPSED_KEY, String(!c))
            return !c
        })
    }

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        toast.success('Signed out')
        router.push('/login')
    }

    return (
        <motion.aside
            animate={{ width: collapsed ? 68 : 256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex-shrink-0 flex flex-col h-full border-r border-border bg-card overflow-hidden relative"
        >
            {/* Logo / brand */}
            <div className="h-16 flex items-center border-b border-border shrink-0 px-3">
                <AnimatePresence mode="wait">
                    {collapsed ? (
                        <motion.div
                            key="icon-logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="mx-auto"
                        >
                            <Link href="/dashboard">
                                <Logo size="sm" showText={false} />
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="full-logo"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="pl-2"
                        >
                            <Link href="/dashboard">
                                <Logo size="sm" />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={collapsed ? label : undefined}
                            className={cn(
                                'relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150 group',
                                collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
                                active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                        >
                            {active && (
                                <motion.div
                                    layoutId="sidebar-active-pill"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl shadow-sm"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}

                            {/* Icon */}
                            <div className={cn(
                                'relative z-10 flex items-center justify-center shrink-0',
                                collapsed
                                    ? 'size-10 rounded-xl bg-muted/60 group-hover:bg-muted transition-colors'
                                    : 'size-4'
                            )}>
                                <Icon className={collapsed ? 'size-5' : 'size-4'} />
                            </div>

                            {/* Label — hidden when collapsed */}
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative z-10 whitespace-nowrap overflow-hidden"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Tooltip when collapsed */}
                            {collapsed && (
                                <span className="absolute left-full ml-2.5 px-2.5 py-1 bg-popover border border-border text-popover-foreground text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {label}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom actions */}
            <div className={cn('shrink-0 border-t border-border pb-3 pt-2', collapsed ? 'px-2' : 'px-2')}>
                {/* Visit homepage */}
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={collapsed ? 'Visit homepage' : undefined}
                    className={cn(
                        'group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted',
                        collapsed ? 'justify-center py-3' : 'px-3 py-2'
                    )}
                >
                    <div className={cn(
                        'flex items-center justify-center shrink-0',
                        collapsed ? 'size-10 rounded-xl bg-muted/60 group-hover:bg-muted transition-colors' : 'size-4'
                    )}>
                        <ExternalLink className={collapsed ? 'size-4' : 'size-3.5'} />
                    </div>
                    {!collapsed && <span className="whitespace-nowrap">Visit homepage</span>}
                    {collapsed && (
                        <span className="absolute left-full ml-2.5 px-2.5 py-1 bg-popover border border-border text-popover-foreground text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            Visit homepage
                        </span>
                    )}
                </a>

                {/* Sign out */}
                <button
                    onClick={handleLogout}
                    title={collapsed ? 'Sign out' : undefined}
                    className={cn(
                        'group w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10',
                        collapsed ? 'justify-center py-3' : 'px-3 py-2'
                    )}
                >
                    <div className={cn(
                        'flex items-center justify-center shrink-0',
                        collapsed ? 'size-10 rounded-xl bg-muted/60 group-hover:bg-destructive/10 transition-colors' : 'size-4'
                    )}>
                        <LogOut className={collapsed ? 'size-4' : 'size-3.5'} />
                    </div>
                    {!collapsed && <span className="whitespace-nowrap">Sign out</span>}
                    {collapsed && (
                        <span className="absolute left-full ml-2.5 px-2.5 py-1 bg-popover border border-border text-popover-foreground text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            Sign out
                        </span>
                    )}
                </button>
            </div>

            {/* Collapse toggle button */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3 top-20 z-50 size-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.2 }}>
                    <ChevronLeft className="size-3.5 text-muted-foreground" />
                </motion.div>
            </button>
        </motion.aside>
    )
}
