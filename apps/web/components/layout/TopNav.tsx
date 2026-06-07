'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Settings, User } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/constants'
import type { Profile } from '@/lib/types'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopNavProps {
    profile: Profile | null
    onMenuClick: () => void
}

export function TopNav({ profile, onMenuClick }: TopNavProps) {
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
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-white">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onMenuClick}
                aria-label="Open menu"
            >
                <Menu className="size-5" />
            </Button>

            <div className="flex-1 hidden md:block" />

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors" />
                    }
                >
                    <Avatar size="sm">
                        {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:block">{displayName}</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                        <User className="size-4 mr-2" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                        <Settings className="size-4 mr-2" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                        <LogOut className="size-4 mr-2" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
