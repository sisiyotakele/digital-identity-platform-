export const siteConfig = {
    name: 'CardConnect',
    tagline: 'Your digital identity, one tap away',
    description:
        'Create and share beautiful digital business cards. Works with NFC, QR codes, and direct links.',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    ogImage: '/og.png',
} as const

export type SiteConfig = typeof siteConfig
