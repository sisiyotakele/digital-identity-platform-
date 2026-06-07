'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CreditCard, BarChart2, Settings, Zap } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/cards', label: 'My Cards', icon: CreditCard },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/settings', label: 'Settings', icon: Settings },
]

interface MobileSidebarProps {
    open: boolean
    onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
    const pathname = usePathname()

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="px-6 py-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2 font-semibold text-base">
                        <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
                            <Zap className="size-4 text-primary-foreground" />
                        </div>
                        CardConnect
                    </SheetTitle>
                </SheetHeader>

                <nav className="px-3 py-4 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
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
            </SheetContent>
        </Sheet>
    )
}
