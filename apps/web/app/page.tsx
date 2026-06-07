import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingTemplates } from '@/components/landing/LandingTemplates'
import { LandingCTA } from '@/components/landing/LandingCTA'
import { LandingNav } from '@/components/landing/LandingNav'

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            <LandingNav />
            <LandingHero />
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingTemplates />
            <LandingCTA />
        </div>
    )
}
