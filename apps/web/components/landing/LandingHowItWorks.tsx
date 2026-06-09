'use client'

import { motion } from 'framer-motion'
import { PenLine, Palette, Share2, TrendingUp } from 'lucide-react'

const steps = [
    {
        num: '01',
        icon: PenLine,
        title: 'Create your card',
        description: 'Fill in your details — name, title, company, contacts and social links. Takes under 2 minutes.',
        color: '#3B82F6',
    },
    {
        num: '02',
        icon: Palette,
        title: 'Choose a template',
        description: 'Pick from 8 premium templates. Adjust colors and style to match your brand perfectly.',
        color: '#8B5CF6',
    },
    {
        num: '03',
        icon: Share2,
        title: 'Share your card',
        description: 'Share via your unique link, NFC tap, QR code, or print physical cards for meetings.',
        color: '#10B981',
    },
    {
        num: '04',
        icon: TrendingUp,
        title: 'Track & grow',
        description: 'See who viewed your card, what they clicked, and capture leads — all in one dashboard.',
        color: '#F97316',
    },
]

export function LandingHowItWorks() {
    return (
        <section id="how-it-works" className="py-28 px-4 sm:px-6 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">
                        Simple process
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                        Up and running in minutes
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mt-4 max-w-lg mx-auto">
                        No design skills needed. No technical setup. Just create, share, and connect.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative"
                            >
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-full w-full h-px border-t-2 border-dashed border-gray-200 dark:border-gray-700 -translate-y-px z-0 ml-4 mr-8" />
                                )}
                                <div className="relative z-10">
                                    <div
                                        className="size-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                                        style={{ backgroundColor: step.color }}
                                    >
                                        <Icon className="size-8 text-white" />
                                    </div>
                                    <span
                                        className="text-xs font-black uppercase tracking-[0.15em] mb-2 block"
                                        style={{ color: step.color }}
                                    >
                                        Step {step.num}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
