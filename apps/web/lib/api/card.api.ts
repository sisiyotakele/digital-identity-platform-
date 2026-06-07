import { createClient } from '@/lib/supabase/client'
import type { BusinessCard, CreateCardInput, UpdateCardInput, SocialLink } from '@/lib/types'

export async function fetchUserCards(): Promise<BusinessCard[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('business_cards')
        .select('*, social_links(*)')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
}

export async function fetchCard(id: string): Promise<BusinessCard> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('business_cards')
        .select('*, social_links(*)')
        .eq('id', id)
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function fetchPublicCard(username: string, slug: string): Promise<BusinessCard | null> {
    const supabase = createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

    if (!profile) return null

    const { data, error } = await supabase
        .from('business_cards')
        .select('*, social_links(*), profiles(display_name, avatar_url)')
        .eq('slug', slug)
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .single()

    if (error) return null
    return data
}

export async function fetchUserPublicCards(username: string): Promise<BusinessCard[]> {
    const supabase = createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

    if (!profile) return []

    const { data } = await supabase
        .from('business_cards')
        .select('*, social_links(*)')
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return data ?? []
}

export async function createCard(input: CreateCardInput): Promise<BusinessCard> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('business_cards')
        .insert({ ...input, user_id: user.id })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') throw new Error('A card with this slug already exists')
        throw new Error(error.message)
    }
    return data
}

export async function updateCard(id: string, input: UpdateCardInput): Promise<BusinessCard> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('business_cards')
        .update(input)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function deleteCard(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('business_cards').delete().eq('id', id)
    if (error) throw new Error(error.message)
}

export async function upsertSocialLinks(cardId: string, links: Omit<SocialLink, 'id' | 'card_id'>[]): Promise<void> {
    const supabase = createClient()
    await supabase.from('social_links').delete().eq('card_id', cardId)

    if (links.length === 0) return

    const { error } = await supabase.from('social_links').insert(
        links.map((link, index) => ({
            card_id: cardId,
            platform: link.platform,
            url: link.url,
            display_order: index,
        }))
    )
    if (error) throw new Error(error.message)
}

export async function checkSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const supabase = createClient()
    let query = supabase.from('business_cards').select('id').eq('slug', slug)
    if (excludeId) query = query.neq('id', excludeId)
    const { data } = await query
    return !data || data.length === 0
}
