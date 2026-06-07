import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">{children}</div>
        </div>
    )
}
