export const siteConfig = {
    name: 'UNIQUE',
    fullName: 'Unique Digital Card',
    tagline: 'የእርስዎ ማንነት፣ ከእጅ ወደ እጅ።',
    taglineEn: 'Your identity, one tap away.',
    description:
        'Create, share and print premium digital business cards. Works with NFC, QR codes, and direct links. Built for Ethiopian professionals.',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    ogImage: '/og.png',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    phone: '+251',
} as const

export type SiteConfig = typeof siteConfig
