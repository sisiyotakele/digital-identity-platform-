import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Profile } from '@/lib/types'

export async function requireAuth(): Promise<{ userId: string; email: string }> {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    return { userId: user.id, email: user.email ?? '' }
}

export async function getProfile(): Promise<Profile | null> {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    return data ?? null
}
