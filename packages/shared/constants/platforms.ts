import type { SocialPlatform } from '../types/card'

export const SOCIAL_PLATFORMS: {
    id: SocialPlatform
    label: string
    placeholder: string
    baseUrl: string
}[] = [
        {
            id: 'linkedin',
            label: 'LinkedIn',
            placeholder: 'https://linkedin.com/in/username',
            baseUrl: 'https://linkedin.com/in/',
        },
        {
            id: 'github',
            label: 'GitHub',
            placeholder: 'https://github.com/username',
            baseUrl: 'https://github.com/',
        },
        {
            id: 'instagram',
            label: 'Instagram',
            placeholder: 'https://instagram.com/username',
            baseUrl: 'https://instagram.com/',
        },
        {
            id: 'x',
            label: 'X',
            placeholder: 'https://x.com/username',
            baseUrl: 'https://x.com/',
        },
        {
            id: 'facebook',
            label: 'Facebook',
            placeholder: 'https://facebook.com/username',
            baseUrl: 'https://facebook.com/',
        },
        {
            id: 'telegram',
            label: 'Telegram',
            placeholder: 'https://t.me/username',
            baseUrl: 'https://t.me/',
        },
        {
            id: 'tiktok',
            label: 'TikTok',
            placeholder: 'https://tiktok.com/@username',
            baseUrl: 'https://tiktok.com/@',
        },
        {
            id: 'youtube',
            label: 'YouTube',
            placeholder: 'https://youtube.com/@username',
            baseUrl: 'https://youtube.com/@',
        },
    ]
