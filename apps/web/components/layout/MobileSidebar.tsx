'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CreditCard, BarChart2, Settings, Printer } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/cards', label: 'My Cards', icon: CreditCard },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/print', label: 'Print Cards', icon: Printer },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const pathname = usePathname()
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="left" className="w-64 p-0 bg-card">
                <SheetHeader className="px-5 py-4 border-b border-border">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <Logo size="sm" />
                </SheetHeader>
                <nav className="px-3 py-5 space-y-0.5">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                        return (
                            <Link key={href} href={href} onClick={onClose}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                                    active
                                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                )}>
                                <Icon className="size-4 shrink-0" />{label}
                            </Link>
                        )
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
