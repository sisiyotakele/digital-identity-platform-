'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Shield, Zap, Users, Play, CheckCircle, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Three.js canvas — loaded client-side only
const CardScene3DCanvas = dynamic(
    () => import('./CardScene3D').then((m) => ({ default: m.CardScene3DCanvas })),
    { ssr: false, loading: () => <CardSceneFallback /> }
)

function CardSceneFallback() {
    return (
        <div className="w-full h-[420px] sm:h-[500px] flex items-center justify-center">
            <motion.div
                className="relative"
                animate={{ y: [0, -12, 0], rotateZ: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div className="w-72 h-44 rounded-3xl bg-gradient-to-br from-blue-600 via-violet-700 to-indigo-800 shadow-2xl shadow-blue-500/40 flex items-center justify-center">
                    <CreditCard className="size-16 text-white/30" />
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />
            </motion.div>
        </div>
    )
}

const TYPED_WORDS = ['Abel Abebe', 'Sara Tesfaye', 'Dawit Bekele', 'Hana Girma', 'Yonas Haile']

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
    opacity: Math.random() * 0.35 + 0.1,
}))

export function LandingHero() {
    const [typedIndex, setTypedIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const { scrollY } = useScroll()
    const heroY = useTransform(scrollY, [0, 500], [0, -60])

    // Typewriter
    useEffect(() => {
        const word = TYPED_WORDS[typedIndex]
        let timeout: ReturnType<typeof setTimeout>
        if (!isDeleting && displayText.length < word.length) {
            timeout = setTimeout(() => setDisplayText(word.slice(0, displayText.length + 1)), 80)
        } else if (!isDeleting && displayText.length === word.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2000)
        } else if (isDeleting && displayText.length > 0) {
            timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40)
        } else {
            setIsDeleting(false)
            setTypedIndex((p) => (p + 1) % TYPED_WORDS.length)
        }
        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, typedIndex])

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950 pt-[68px]">

            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(59,130,246,0.07) 55%, transparent 80%)' }}
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 80, 0] }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-52 -left-32 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(99,102,241,0.06) 55%, transparent 80%)' }}
                    animate={{ scale: [1, 1.18, 1], rotate: [0, -80, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                />
                <svg className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04]">
                    <defs>
                        <pattern id="hero-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-grid)" />
                </svg>
                {PARTICLES.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-indigo-400 dark:bg-indigo-300"
                        style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
                        animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [p.opacity, p.opacity * 2.5, p.opacity] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">

                    {/* Left */}
                    <div className="space-y-7 relative z-10">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                            <motion.div
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/60 dark:to-violet-950/60 border border-blue-200/60 dark:border-blue-700/60 rounded-full px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-5"
                                whileHover={{ scale: 1.04 }}
                            >
                                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                                    <Sparkles className="size-3.5 text-violet-500" />
                                </motion.div>
                                Ethiopia's #1 Digital Business Card Platform
                            </motion.div>

                            <h1 className="text-5xl sm:text-6xl lg:text-[58px] font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white">
                                {['Make every', 'first impression', 'unforgettable.'].map((line, i) => (
                                    <motion.span
                                        key={line}
                                        className={`block ${i === 1 ? 'bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient' : ''}`}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                                    >
                                        {line}
                                    </motion.span>
                                ))}
                            </h1>

                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                                className="mt-4 flex items-center gap-2 text-base text-gray-500 dark:text-gray-400 flex-wrap"
                            >
                                <span>Used by</span>
                                <span className="font-bold text-gray-900 dark:text-white min-w-[150px]">
                                    {displayText}
                                    <span className="animate-blink text-blue-500">|</span>
                                </span>
                            </motion.div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                            className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg"
                        >
                            Create stunning digital business cards with{' '}
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">NFC</span>,{' '}
                            <span className="text-violet-600 dark:text-violet-400 font-semibold">QR codes</span>, and{' '}
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">direct links</span>.
                            Share in one tap. Print premium physical cards.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                            className="flex flex-wrap gap-3"
                        >
                            <Link href="/register">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button size="lg" className="h-13 px-8 text-base font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 gap-2 rounded-xl">
                                        Start for free
                                        <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                            <ArrowRight className="size-5" />
                                        </motion.div>
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="#how-it-works">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold gap-2 rounded-xl border-2">
                                        <Play className="size-4 fill-current" />
                                        See how it works
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                            className="flex flex-wrap items-center gap-5"
                        >
                            {[
                                { icon: Shield, label: 'No credit card', color: 'text-emerald-500' },
                                { icon: Zap, label: 'Ready in 2 min', color: 'text-amber-500' },
                                { icon: Users, label: '50K+ users', color: 'text-blue-500' },
                            ].map(({ icon: Icon, label, color }, i) => (
                                <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.1 }}
                                    className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    <CheckCircle className={`size-4 ${color}`} />
                                    {label}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right — Three.js 3D Scene */}
                    <motion.div style={{ y: heroY }} className="relative z-10 mt-4 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <CardScene3DCanvas />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                >
                    <span className="text-xs text-gray-400 dark:text-gray-600 tracking-widest uppercase">Scroll</span>
                    <div className="w-5 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-start justify-center p-1">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                            animate={{ y: [0, 14, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
