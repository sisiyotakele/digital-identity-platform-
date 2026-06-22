import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks'
import { LandingTemplates } from '@/components/landing/LandingTemplates'
import { LandingCTA } from '@/components/landing/LandingCTA'

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
            <LandingNav />
            <LandingHero />
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingTemplates />
            <LandingCTA />

            {/* Footer */}
            <footer className="border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">© 2025 UNIQUE Digital Card. Made in Ethiopia 🇪🇹</p>
                    <div className="flex gap-5 text-sm text-gray-400">
                        <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
                        <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
