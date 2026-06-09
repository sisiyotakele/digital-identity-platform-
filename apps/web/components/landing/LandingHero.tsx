'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Shield, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

const floatingStats = [
    { label: 'Cards created', value: '50K+', icon: '🪪', delay: 0 },
    { label: 'Contacts shared', value: '2M+', icon: '🤝', delay: 0.3 },
    { label: 'NFC taps', value: '500K+', icon: '📡', delay: 0.6 },
]

export function LandingHero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950 pt-[68px]">
            {/* Background gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-950/40 dark:to-violet-950/40 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-full blur-3xl opacity-40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-50/30 to-transparent dark:from-violet-950/10 rounded-full" />

                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-24 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left: Copy */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/50 dark:to-violet-950/50 border border-blue-200/60 dark:border-blue-800/60 rounded-full px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-6">
                                <Sparkles className="size-3.5" />
                                The premium digital business card platform
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white">
                                Make every{' '}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                        first impression
                                    </span>
                                </span>{' '}
                                unforgettable.
                            </h1>

                            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mt-6">
                                Create stunning digital business cards that work with{' '}
                                <span className="text-gray-700 dark:text-gray-300 font-medium">NFC</span>,{' '}
                                <span className="text-gray-700 dark:text-gray-300 font-medium">QR codes</span>, and{' '}
                                <span className="text-gray-700 dark:text-gray-300 font-medium">direct links</span>.
                                Share your contact in one tap. Print premium physical cards.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="flex flex-wrap gap-3"
                        >
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="h-12 px-7 text-base font-semibold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90 shadow-lg shadow-blue-500/25 gap-2"
                                >
                                    Start for free
                                    <ArrowRight className="size-5" />
                                </Button>
                            </Link>
                            <Link href="#how-it-works">
                                <Button variant="outline" size="lg" className="h-12 px-7 text-base font-semibold">
                                    See how it works
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-6 pt-2"
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Shield className="size-4 text-green-500" />
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Zap className="size-4 text-amber-500" />
                                Set up in 2 minutes
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users className="size-4 text-blue-500" />
                                50K+ users
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Phone mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
                    >
                        <div className="relative scale-90 sm:scale-100">
                            {/* Glow behind phone */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-[3rem] blur-3xl scale-110" />

                            {/* Phone frame */}
                            <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px]">
                                <div className="absolute inset-0 rounded-[2.8rem] bg-gray-900 shadow-2xl shadow-gray-900/50" />
                                <div className="absolute inset-[3px] rounded-[2.5rem] bg-gray-950" />

                                {/* Notch */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-20" />

                                {/* Screen content */}
                                <div className="absolute inset-[3px] rounded-[2.5rem] overflow-hidden z-10">
                                    {/* Card preview */}
                                    <div className="w-full h-full bg-white">
                                        {/* Header gradient */}
                                        <div className="h-32 bg-gradient-to-br from-blue-600 to-violet-700 relative">
                                            <div className="absolute -bottom-10 left-6">
                                                <div className="size-20 rounded-2xl bg-white shadow-lg ring-4 ring-white overflow-hidden">
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                        <span className="text-2xl font-black text-gray-500">AA</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-white/20 rounded-lg px-2 py-1">
                                                <span className="text-white text-xs font-bold">UNIQUE</span>
                                            </div>
                                        </div>

                                        <div className="pt-12 px-5 space-y-3">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900">Abel Abebe</p>
                                                <p className="text-sm text-blue-600 font-medium">Senior Product Designer</p>
                                                <p className="text-xs text-gray-500 mt-0.5">UNIQUE Digital Card</p>
                                            </div>
                                            {/* Save button */}
                                            <button className="w-full h-10 bg-gray-900 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
                                                <span>📱</span> Save Contact
                                            </button>
                                            <button className="w-full h-9 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2">
                                                <span>🔄</span> Exchange Contact
                                            </button>
                                            {/* Social icons */}
                                            <div className="flex gap-2.5 pt-1">
                                                {['📞', '✉️', '💼', '🌐'].map((emoji, i) => (
                                                    <div key={i} className="size-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-sm">
                                                        {emoji}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Home indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-20" />
                            </div>

                            {/* Floating stat chips */}
                            {floatingStats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + stat.delay }}
                                    className={`absolute bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 px-4 py-3 ${i === 0 ? '-left-16 top-20' :
                                        i === 1 ? '-right-14 top-1/2 -translate-y-1/2' :
                                            '-left-12 bottom-24'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{stat.icon}</span>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{stat.value}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{stat.label}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
