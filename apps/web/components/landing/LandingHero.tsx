'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Shield, Zap, Users, Play, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TYPED_WORDS = ['Abel Abebe', 'Sara Tesfaye', 'Dawit Bekele', 'Hana Girma', 'Yonas Haile']
const STATS = [
    { icon: '🪪', value: '50K+', label: 'Cards created', color: 'from-blue-500 to-blue-600' },
    { icon: '🤝', value: '2M+', label: 'Contacts shared', color: 'from-violet-500 to-violet-600' },
    { icon: '📡', value: '500K+', label: 'NFC taps', color: 'from-emerald-500 to-emerald-600' },
]

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 8,
}))

const ORBIT_ICONS = [
    { icon: '💼', label: 'Business', angle: 0 },
    { icon: '📱', label: 'NFC', angle: 72 },
    { icon: '🔗', label: 'Links', angle: 144 },
    { icon: '📊', label: 'Analytics', angle: 216 },
    { icon: '🖨️', label: 'Print', angle: 288 },
]

export function LandingHero() {
    const [typedIndex, setTypedIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const { scrollY } = useScroll()
    const phoneY = useTransform(scrollY, [0, 400], [0, -60])

    // Typewriter effect
    useEffect(() => {
        const word = TYPED_WORDS[typedIndex]
        let timeout: ReturnType<typeof setTimeout>

        if (!isDeleting && displayText.length < word.length) {
            timeout = setTimeout(() => setDisplayText(word.slice(0, displayText.length + 1)), 80)
        } else if (!isDeleting && displayText.length === word.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2000)
        } else if (isDeleting && displayText.length > 0) {
            timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40)
        } else if (isDeleting && displayText.length === 0) {
            setIsDeleting(false)
            setTypedIndex((prev) => (prev + 1) % TYPED_WORDS.length)
        }

        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, typedIndex])

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950 pt-[68px]">

            {/* ── Animated background ──────────────────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Large gradient orbs */}
                <motion.div
                    className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.08) 60%, transparent 100%)' }}
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(59,130,246,0.06) 60%, transparent 100%)' }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)' }}
                    animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04]">
                    <defs>
                        <pattern id="hero-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-grid)" />
                </svg>

                {/* Floating particles */}
                {PARTICLES.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-blue-400/30 dark:bg-blue-400/20"
                        style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
                        animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                    />
                ))}

                {/* Spinning ring */}
                <motion.div
                    className="absolute top-20 left-10 w-64 h-64 rounded-full border border-blue-200/20 dark:border-blue-800/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-violet-200/20 dark:border-violet-800/20"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            {/* ── Main content ─────────────────────────────── */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left column */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/60 dark:to-violet-950/60 border border-blue-200/60 dark:border-blue-700/60 rounded-full px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6 cursor-default"
                                whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                >
                                    <Sparkles className="size-3.5 text-violet-500" />
                                </motion.div>
                                Ethiopia's #1 Digital Business Card Platform
                            </motion.div>

                            {/* Headline */}
                            <h1 className="text-5xl sm:text-6xl lg:text-[60px] font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white">
                                <motion.span
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="block"
                                >
                                    Make every
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="block bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
                                >
                                    first impression
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="block"
                                >
                                    unforgettable.
                                </motion.span>
                            </h1>

                            {/* Typewriter line */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-4 flex items-center gap-2 text-base text-gray-500 dark:text-gray-400"
                            >
                                <span>Used by</span>
                                <span className="font-bold text-gray-900 dark:text-white min-w-[140px]">
                                    {displayText}
                                    <span className="animate-blink text-blue-500">|</span>
                                </span>
                                <span>& thousands more</span>
                            </motion.div>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg"
                        >
                            Create stunning digital business cards that work with{' '}
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">NFC</span>,{' '}
                            <span className="text-violet-600 dark:text-violet-400 font-semibold">QR codes</span>, and{' '}
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">direct links</span>.
                            Share your contact in one tap. Print premium physical cards.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45 }}
                            className="flex flex-wrap gap-3"
                        >
                            <Link href="/register">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                        size="lg"
                                        className="h-13 px-8 text-base font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:opacity-95 gap-2 rounded-xl transition-all duration-200"
                                    >
                                        Start for free
                                        <motion.div
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowRight className="size-5" />
                                        </motion.div>
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="#how-it-works">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-13 px-8 text-base font-semibold gap-2 rounded-xl border-2"
                                    >
                                        <Play className="size-4 fill-current" />
                                        See how it works
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap items-center gap-5 pt-1"
                        >
                            {[
                                { icon: Shield, label: 'No credit card', color: 'text-emerald-500' },
                                { icon: Zap, label: 'Ready in 2 min', color: 'text-amber-500' },
                                { icon: Users, label: '50K+ users', color: 'text-blue-500' },
                            ].map(({ icon: Icon, label, color }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.1 }}
                                    className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                                >
                                    <CheckCircle className={`size-4 ${color}`} />
                                    {label}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Animated stat chips */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.75 }}
                            className="flex flex-wrap gap-3 pt-2"
                        >
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 300 }}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow cursor-default"
                                >
                                    <span className="text-lg">{stat.icon}</span>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{stat.value}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right column — Phone + orbit */}
                    <motion.div
                        style={{ y: phoneY }}
                        className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
                    >
                        <div className="relative">
                            {/* Rotating orbit ring */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    className="absolute w-[380px] h-[380px] sm:w-[440px] sm:h-[440px]"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                                >
                                    {ORBIT_ICONS.map((item) => {
                                        const rad = (item.angle * Math.PI) / 180
                                        const r = 190
                                        const x = 50 + (r * Math.sin(rad)) / 4.4 + '%'
                                        const y = 50 - (r * Math.cos(rad)) / 4.4 + '%'
                                        return (
                                            <motion.div
                                                key={item.label}
                                                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                                                style={{ left: x, top: y }}
                                                animate={{ rotate: -360 }}
                                                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                                                whileHover={{ scale: 1.3 }}
                                            >
                                                <div className="size-10 sm:size-11 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg flex items-center justify-center text-lg backdrop-blur-sm">
                                                    {item.icon}
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </motion.div>
                                {/* Dashed orbit path */}
                                <svg className="absolute w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] opacity-10 dark:opacity-[0.06]" viewBox="0 0 440 440">
                                    <circle cx="220" cy="220" r="190" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
                                </svg>
                            </div>

                            {/* Glow */}
                            <motion.div
                                className="absolute inset-0 rounded-[3rem] blur-3xl"
                                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(59,130,246,0.15) 60%, transparent 80%)' }}
                                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            />

                            {/* Phone */}
                            <motion.div
                                className="relative z-10 scale-90 sm:scale-100"
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px]">
                                    {/* Phone frame */}
                                    <div className="absolute inset-0 rounded-[2.8rem] bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl shadow-black/60" />
                                    <div className="absolute inset-[2px] rounded-[2.7rem] bg-gray-950" />
                                    {/* Notch */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-20" />
                                    {/* Screen */}
                                    <div className="absolute inset-[3px] rounded-[2.5rem] overflow-hidden z-10 bg-gray-950">
                                        {/* App shell */}
                                        <div className="w-full h-full flex flex-col bg-gray-950">
                                            {/* Status bar */}
                                            <div className="h-12 flex items-end justify-between px-5 pb-2">
                                                <span className="text-[10px] text-gray-400 font-semibold">9:41</span>
                                                <span className="text-[10px] text-gray-400">●●●</span>
                                            </div>

                                            {/* 3D Card showcase */}
                                            <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
                                                {/* 3D Rotating Card */}
                                                <CardDemo3D />

                                                {/* Card actions */}
                                                <div className="w-full space-y-2 px-2">
                                                    <motion.button
                                                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        <span>💾</span> Save Contact
                                                    </motion.button>
                                                    <button className="w-full h-9 border border-gray-700 text-gray-300 text-xs font-medium rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                                        <span>🔄</span> Exchange Contact
                                                    </button>
                                                    <div className="flex gap-2 justify-center pt-1">
                                                        {[
                                                            { e: '📞', c: 'bg-emerald-500/10 border-emerald-500/20' },
                                                            { e: '✉️', c: 'bg-blue-500/10 border-blue-500/20' },
                                                            { e: '💼', c: 'bg-violet-500/10 border-violet-500/20' },
                                                            { e: '🌐', c: 'bg-amber-500/10 border-amber-500/20' },
                                                        ].map(({ e, c }, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className={`size-10 rounded-full border flex items-center justify-center text-sm cursor-pointer ${c}`}
                                                                whileHover={{ scale: 1.2, y: -4 }}
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 1.2 + i * 0.1, type: 'spring' }}
                                                            >
                                                                {e}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Live badge */}
                                            <div className="px-4 pb-4">
                                                <motion.div
                                                    className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2"
                                                    animate={{ opacity: [1, 0.6, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    <span className="text-[10px] text-emerald-400 font-bold">Card is live</span>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Home bar */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-20" />
                                </div>
                            </motion.div>

                            {/* Floating notification cards — pointer-events-none so they don't block clicks */}
                            <motion.div
                                initial={{ opacity: 0, x: -40, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                                className="absolute -left-20 sm:-left-24 top-16 z-20 pointer-events-none hidden sm:block"
                            >
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 px-4 py-3 min-w-[140px]"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                            <span className="text-sm">✅</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">Contact saved!</p>
                                            <p className="text-[10px] text-gray-500">just now</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 40, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                                className="absolute -right-16 sm:-right-20 top-1/3 z-20 pointer-events-none hidden sm:block"
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 px-4 py-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">👀</span>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white">247 views</p>
                                            <p className="text-[10px] text-gray-500">today</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
                                className="absolute -left-14 sm:-left-16 bottom-20 z-20 pointer-events-none hidden sm:block"
                            >
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
                                    className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl shadow-xl px-4 py-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">📡</span>
                                        <div>
                                            <p className="text-xs font-black text-white">NFC Tap!</p>
                                            <p className="text-[10px] text-blue-200">Card shared</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-xs text-gray-400 dark:text-gray-600 tracking-widest uppercase">Scroll</span>
                    <motion.div
                        className="w-5 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-start justify-center p-1"
                    >
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                            animate={{ y: [0, 14, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

function CardDemo3D() {
    const [flipped, setFlipped] = useState(false)

    return (
        <div
            className="cursor-pointer select-none"
            style={{ perspective: '600px' }}
            onClick={() => setFlipped((f) => !f)}
        >
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.7, type: 'spring', stiffness: 120, damping: 18 }}
                style={{ transformStyle: 'preserve-3d', width: 200, height: 118 }}
                className="relative"
            >
                {/* Front */}
                <div
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/30"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 via-violet-700 to-indigo-800 relative p-4">
                        {/* Shimmer */}
                        <div className="absolute inset-0 opacity-30"
                            style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
                        {/* NFC waves */}
                        <div className="absolute top-3 right-3 flex flex-col gap-0.5 opacity-40">
                            {[12, 8, 4].map((w, i) => (
                                <div key={i} className="border-t-2 border-white rounded-full" style={{ width: w }} />
                            ))}
                        </div>
                        <span className="text-[8px] font-black tracking-[0.2em] text-white/60 uppercase">UNIQUE</span>
                        <div className="mt-4">
                            <div className="text-sm font-black text-white leading-tight">Abel Abebe</div>
                            <div className="text-[10px] text-blue-200 mt-0.5">Senior Product Designer</div>
                        </div>
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                            <div className="space-y-0.5">
                                <div className="h-1 w-16 bg-white/20 rounded" />
                                <div className="h-1 w-10 bg-white/15 rounded" />
                            </div>
                            <div className="size-7 rounded-lg bg-white/20 flex items-center justify-center">
                                <span className="text-[10px] font-black text-white">AA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/30"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 relative flex flex-col items-center justify-center gap-2 p-3">
                        <div className="absolute inset-0 opacity-10"
                            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.5) 0%, transparent 70%)' }} />
                        {/* QR placeholder */}
                        <div className="size-14 rounded-lg bg-white/90 p-1.5 grid grid-cols-4 gap-0.5">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className={`rounded-sm ${[0, 1, 3, 4, 6, 9, 12, 15].includes(i) ? 'bg-gray-900' : 'bg-transparent'}`} />
                            ))}
                        </div>
                        <div className="text-[8px] text-gray-400 text-center">Scan to connect</div>
                        <div className="text-[7px] font-black tracking-[0.2em] text-gray-500 uppercase">UNIQUE DIGITAL CARD</div>
                    </div>
                </div>
            </motion.div>
            <p className="text-[9px] text-gray-500 text-center mt-2">Tap to flip</p>
        </div>
    )
}