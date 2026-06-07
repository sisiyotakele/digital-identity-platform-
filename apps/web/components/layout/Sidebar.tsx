'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CreditCard, BarChart2, Settings, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/cards', label: 'My Cards', icon: CreditCard },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-60 flex-shrink-0 flex flex-col h-full border-r border-border bg-white">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-base">
                    <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
                        <Zap className="size-4 text-primary-foreground" />
                    </div>
                    CardConnect
                </Link>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                        >
                            <Icon className="size-4 shrink-0" />
                            {label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
