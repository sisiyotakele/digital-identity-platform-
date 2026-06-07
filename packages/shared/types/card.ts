export type CardTemplate =
    | 'minimal'
    | 'modern'
    | 'corporate'
    | 'creative'
    | 'executive'
    | 'dark'
    | 'gradient'
    | 'startup'

export type SocialPlatform =
    | 'linkedin'
    | 'github'
    | 'instagram'
    | 'x'
    | 'facebook'
    | 'telegram'
    | 'tiktok'
    | 'youtube'

export interface SocialLink {
    id: string
    card_id: string
    platform: SocialPlatform
    url: string
    display_order: number
}

export interface BusinessCard {
    id: string
    user_id: string
    slug: string
    template: CardTemplate
    title: string | null
    company: string | null
    phone: string | null
    email: string | null
    website: string | null
    address: string | null
    bio: string | null
    photo_url: string | null
    logo_url: string | null
    theme_color: string
    is_active: boolean
    created_at: string
    updated_at: string
    social_links?: SocialLink[]
    profiles?: {
        display_name: string | null
        avatar_url: string | null
    }
}

export interface CreateCardInput {
    slug: string
    template: CardTemplate
    title?: string
    company?: string
    phone?: string
    email?: string
    website?: string
    address?: string
    bio?: string
    theme_color?: string
}

export interface UpdateCardInput extends Partial<CreateCardInput> {
    photo_url?: string
    logo_url?: string
    is_active?: boolean
}

export interface Lead {
    id: string
    card_id: string
    name: string
    email: string | null
    phone: string | null
    message: string | null
    created_at: string
}

export interface CreateLeadInput {
    card_id: string
    name: string
    email?: string
    phone?: string
    message?: string
}
