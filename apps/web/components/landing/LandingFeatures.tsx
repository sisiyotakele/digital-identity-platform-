'use client'

import { motion } from 'framer-motion'
import { QrCode, BarChart2, Share2, Smartphone, Globe, Zap } from 'lucide-react'

const features = [
    {
        icon: Smartphone,
        title: 'NFC-ready',
        description: 'Program your NFC card to point to your digital card. One tap to share everything.',
    },
    {
        icon: QrCode,
        title: 'QR code included',
        description: 'Every card gets a unique QR code. Print it, embed it, share it anywhere.',
    },
    {
        icon: BarChart2,
        title: 'Analytics built in',
        description: 'See exactly who views your card, clicks your links, and saves your contact.',
    },
    {
        icon: Share2,
        title: 'Instant sharing',
        description: 'Share via link, NFC, QR, or even let people download a vCard in one tap.',
    },
    {
        icon: Globe,
        title: 'Public profile',
        description: 'Your custom URL is shareable anywhere — email signatures, social bios, LinkedIn.',
    },
    {
        icon: Zap,
        title: '8 templates',
        description: 'Choose from minimal to creative. Every template looks great on any device.',
    },
]

export function LandingFeatures() {
    return (
        <section id="features" className="py-20 px-4 sm:px-6 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
                    <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                        A complete digital identity platform — not just a link in bio
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-white rounded-2xl p-6 border border-border"
                        >
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <feature.icon className="size-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
