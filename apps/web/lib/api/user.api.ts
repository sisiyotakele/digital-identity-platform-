import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export async function fetchCurrentProfile(): Promise<Profile | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) return null
    return data
}

export async function fetchPublicProfile(username: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (error) return null
    return data
}

export async function updateProfile(updates: Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'username'>>): Promise<Profile> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

    if (error) {
        if (error.code === '23505') throw new Error('This username is already taken')
        throw new Error(error.message)
    }
    return data
}

export async function checkUsernameAvailable(username: string, excludeId?: string): Promise<boolean> {
    const supabase = createClient()
    let query = supabase.from('profiles').select('id').eq('username', username)
    if (excludeId) query = query.neq('id', excludeId)
    const { data } = await query
    return !data || data.length === 0
}

export async function deleteAccount(): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.rpc('delete_user')
    if (error) throw new Error(error.message)
}
