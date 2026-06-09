'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Settings, User, Bell, Menu } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/constants'
import type { Profile } from '@/lib/types'

interface TopNavProps {
    profile: Profile | null
    onMenuClick: () => void
    title?: string
}

export function TopNav({ profile, onMenuClick, title }: TopNavProps) {
    const router = useRouter()

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        toast.success('Signed out')
        router.push('/login')
        router.refresh()
    }

    const displayName = profile?.display_name ?? 'Account'
    const initials = getInitials(displayName)

    return (
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick} aria-label="Open menu">
                    <Menu className="size-5" />
                </Button>
                {title && <h1 className="text-base font-bold hidden md:block text-foreground">{title}</h1>}
            </div>

            <div className="flex items-center gap-1">
                <ThemeToggle />
                <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="size-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />

                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted transition-colors" />
                    }>
                        <Avatar size="sm">
                            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
                            <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold leading-none">{displayName}</p>
                            {profile?.username && <p className="text-xs text-muted-foreground mt-0.5">@{profile.username}</p>}
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52">
                        <div className="px-2 py-2 border-b border-border mb-1">
                            <p className="text-sm font-semibold">{displayName}</p>
                            {profile?.username && <p className="text-xs text-muted-foreground">@{profile.username}</p>}
                        </div>
                        <DropdownMenuItem onClick={() => router.push('/settings')}>
                            <User className="size-4 mr-2" />Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/settings')}>
                            <Settings className="size-4 mr-2" />Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                            <LogOut className="size-4 mr-2" />Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
