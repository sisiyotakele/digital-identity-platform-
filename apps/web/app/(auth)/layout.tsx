import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Logo } from '@/components/brand/Logo'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect('/dashboard')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            {/* Top bar */}
            <header className="h-16 flex items-center px-6">
                <Link href="/">
                    <Logo size="sm" />
                </Link>
            </header>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[420px]">{children}</div>
            </div>

            {/* Footer */}
            <footer className="h-14 flex items-center justify-center px-6">
                <p className="text-xs text-gray-400">
                    © 2025 UNIQUE Digital Card. All rights reserved.
                </p>
            </footer>
        </div>
    )
}
