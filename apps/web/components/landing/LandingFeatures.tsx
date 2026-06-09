'use client'

import { motion } from 'framer-motion'
import { QrCode, BarChart2, Share2, Smartphone, Globe, Zap, CreditCard, Users, Printer } from 'lucide-react'

const features = [
    { icon: CreditCard, title: 'Digital Business Cards', description: 'Create stunning digital cards in minutes. 8 premium templates, fully customizable.', color: '#3B82F6' },
    { icon: QrCode, title: 'QR Code Sharing', description: 'Every card gets a unique QR code. Print it, embed it, and share it anywhere.', color: '#8B5CF6' },
    { icon: Smartphone, title: 'NFC Support', description: 'Program NFC cards for instant tap-to-share. One touch shares everything.', color: '#6366F1' },
    { icon: Share2, title: 'Contact Sharing', description: 'Let contacts download your vCard instantly. Works with all phones and apps.', color: '#10B981' },
    { icon: BarChart2, title: 'Analytics', description: 'Track views, link clicks, QR scans, and leads. Know exactly who\'s interested.', color: '#F97316' },
    { icon: Printer, title: 'Card Printing', description: 'Order premium physical cards with your digital card\'s design. Ready to print.', color: '#EF4444' },
    { icon: Globe, title: 'Public Profile', description: 'Custom URL for your profile. Share it in email signatures, social bios, anywhere.', color: '#06B6D4' },
    { icon: Zap, title: 'Multiple Templates', description: '8 professional templates — from minimal to executive. All fully branded.', color: '#F59E0B' },
    { icon: Users, title: 'Team Management', description: 'Manage cards for your entire team. Keep branding consistent across the org.', color: '#EC4899' },
]

export function LandingFeatures() {
    return (
        <section id="features" className="py-28 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">
                        Everything you need
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                        A complete identity platform
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">
                        Not just a digital card — a full suite of tools to manage, share, and grow your professional presence.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-gray-900/60 transition-shadow duration-300 cursor-default"
                            >
                                <div
                                    className="size-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: `${feature.color}15` }}
                                >
                                    <Icon className="size-6" style={{ color: feature.color }} />
                                </div>
                                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
