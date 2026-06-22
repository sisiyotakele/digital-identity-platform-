'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Shield, Zap, Users, Play, CheckCircle, Phone, Mail, Briefcase, Globe, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TYPED_WORDS = ['Abel Abebe', 'Sara Tesfaye', 'Dawit Bekele', 'Hana Girma', 'Yonas Haile']

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
    opacity: Math.random() * 0.3 + 0.08,
}))

const BADGES = [
    { icon: CheckCircle, label: 'Contact Saved', sub: 'just now', pos: 'sm:-left-20 top-14', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { icon: Users, label: '247 views', sub: 'today', pos: 'sm:-right-16 top-1/3', color: 'text-blue-500', bg: 'bg-blue-500' },
    { icon: Wifi, label: 'NFC Tap!', sub: 'Card shared', pos: 'sm:-left-14 bottom-24', color: 'text-violet-500', bg: 'bg-violet-500' },
]

export function LandingHero() {
    const [typedIndex, setTypedIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const { scrollY } = useScroll()
    const phoneY = useTransform(scrollY, [0, 400], [0, -50])

    useEffect(() => {
        const word = TYPED_WORDS[typedIndex]
        let t: ReturnType<typeof setTimeout>
        if (!isDeleting && displayText.length < word.length) {
            t = setTimeout(() => setDisplayText(word.slice(0, displayText.length + 1)), 80)
        } else if (!isDeleting && displayText.length === word.length) {
            t = setTimeout(() => setIsDeleting(true), 2000)
        } else if (isDeleting && displayText.length > 0) {
            t = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40)
        } else {
            setIsDeleting(false)
            setTypedIndex((p) => (p + 1) % TYPED_WORDS.length)
        }
        return () => clearTimeout(t)
    }, [displayText, isDeleting, typedIndex])

    const contactIcons = [
        { Icon: Phone, color: 'bg-emerald-500', label: 'Call' },
        { Icon: Mail, color: 'bg-blue-500', label: 'Email' },
        { Icon: Briefcase, color: 'bg-violet-500', label: 'LinkedIn' },
        { Icon: Globe, color: 'bg-amber-500', label: 'Website' },
    ]

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950 pt-[68px]">

            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0.08) 55%, transparent 80%)' }}
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 80, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-52 -left-32 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(99,102,241,0.06) 55%, transparent 80%)' }}
                    animate={{ scale: [1, 1.18, 1], rotate: [0, -80, 0] }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
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
                        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                    />
                ))}
                <motion.div className="absolute top-20 left-8 w-56 h-56 rounded-full border border-blue-200/15 dark:border-blue-800/15"
                    animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute bottom-24 right-8 w-40 h-40 rounded-full border border-violet-200/15 dark:border-violet-800/15"
                    animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">

                    {/* ── Left: Copy ─────────────────────────── */}
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
                                {(['Make every', 'first impression', 'unforgettable.'] as const).map((line, i) => (
                                    <motion.span key={line}
                                        className={`block ${i === 1 ? 'bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient' : ''}`}
                                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                                    >{line}</motion.span>
                                ))}
                            </h1>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                                className="mt-4 flex flex-wrap items-center gap-2 text-base text-gray-500 dark:text-gray-400">
                                <span>Used by</span>
                                <span className="font-bold text-gray-900 dark:text-white min-w-[150px]">
                                    {displayText}<span className="animate-blink text-blue-500">|</span>
                                </span>
                            </motion.div>
                        </motion.div>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                            className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                            Create stunning digital business cards with{' '}
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">NFC</span>,{' '}
                            <span className="text-violet-600 dark:text-violet-400 font-semibold">QR codes</span>, and{' '}
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">direct links</span>.
                            Share in one tap. Print premium physical cards.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                            className="flex flex-wrap gap-3">
                            <Link href="/register">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button size="lg" className="h-13 px-8 text-base font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white shadow-xl shadow-blue-500/30 gap-2 rounded-xl">
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

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                            className="flex flex-wrap items-center gap-5">
                            {[
                                { icon: Shield, label: 'No credit card', color: 'text-emerald-500' },
                                { icon: Zap, label: 'Ready in 2 min', color: 'text-amber-500' },
                                { icon: Users, label: '50K+ users', color: 'text-blue-500' },
                            ].map(({ icon: Icon, label, color }, i) => (
                                <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.65 + i * 0.1 }}
                                    className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    <Icon className={`size-4 ${color}`} />
                                    {label}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── Right: Phone mockup ─────────────────── */}
                    <motion.div style={{ y: phoneY }} className="relative flex justify-center lg:justify-end mt-6 lg:mt-0 z-10">
                        <div className="relative scale-90 sm:scale-100">
                            {/* Glow */}
                            <motion.div
                                className="absolute inset-0 rounded-[3rem] blur-3xl"
                                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.30) 0%, rgba(59,130,246,0.12) 60%, transparent 80%)' }}
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            />

                            {/* Phone frame */}
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px]">
                                    {/* Outer casing */}
                                    <div className="absolute inset-0 rounded-[2.8rem] bg-gradient-to-b from-gray-700 to-gray-900 shadow-2xl shadow-black/70" />
                                    <div className="absolute inset-[2px] rounded-[2.7rem] bg-gray-950" />
                                    {/* Notch */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[72px] h-[22px] bg-gray-950 rounded-full z-20" />

                                    {/* Screen */}
                                    <div className="absolute inset-[3px] rounded-[2.5rem] overflow-hidden z-10" style={{ background: '#0d1117' }}>

                                        {/* Card header gradient */}
                                        <div className="h-[130px] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 60%, #312e81 100%)' }}>
                                            <motion.div
                                                className="absolute inset-0"
                                                style={{ background: 'radial-gradient(circle at 70% 40%, rgba(255,255,255,0.12) 0%, transparent 55%)' }}
                                                animate={{ x: [-15, 15, -15] }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            />
                                            {/* UNIQUE badge */}
                                            <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1">
                                                <span className="text-white text-[11px] font-black tracking-[0.1em]">UNIQUE</span>
                                            </div>
                                            {/* Avatar */}
                                            <div className="absolute -bottom-9 left-5">
                                                <motion.div
                                                    className="size-[72px] rounded-2xl shadow-xl ring-[3px] ring-white/20 overflow-hidden"
                                                    style={{ background: 'linear-gradient(135deg, #93c5fd, #c4b5fd)' }}
                                                    animate={{ rotate: [0, 1.5, -1.5, 0] }}
                                                    transition={{ duration: 5, repeat: Infinity }}
                                                >
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-[22px] font-black text-white/80">AA</span>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Card content */}
                                        <div className="pt-11 px-5 space-y-3.5">
                                            <div>
                                                <p className="text-[17px] font-black text-white leading-tight">Abel Abebe</p>
                                                <p className="text-[13px] text-blue-400 font-semibold mt-0.5">Senior Product Designer</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">UNIQUE Digital Card</p>
                                            </div>

                                            {/* Save Contact */}
                                            <motion.button
                                                className="w-full h-11 rounded-2xl text-[13px] font-bold text-white flex items-center justify-center gap-2"
                                                style={{ background: 'linear-gradient(135deg, #4338ca, #7c3aed)' }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <span className="text-base">💾</span>
                                                Save Contact
                                            </motion.button>

                                            {/* Exchange Contact */}
                                            <button className="w-full h-10 rounded-2xl text-[12px] font-medium text-gray-300 flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 transition-colors">
                                                <span className="text-sm">🔄</span>
                                                Exchange Contact
                                            </button>

                                            {/* Contact icon circles */}
                                            <div className="flex gap-3 pt-0.5">
                                                {contactIcons.map(({ Icon, color, label }, i) => (
                                                    <motion.div
                                                        key={label}
                                                        className={`size-[42px] rounded-full ${color} flex items-center justify-center shadow-lg cursor-pointer`}
                                                        whileHover={{ scale: 1.15, y: -3 }}
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 1.0 + i * 0.1, type: 'spring', stiffness: 260 }}
                                                    >
                                                        <Icon className="size-4 text-white" strokeWidth={2.5} />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Live indicator */}
                                            <motion.div
                                                className="flex items-center gap-2 rounded-xl px-3 py-2 border"
                                                style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}
                                                animate={{ opacity: [1, 0.6, 1] }}
                                                transition={{ duration: 2.5, repeat: Infinity }}
                                            >
                                                <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-[11px] text-emerald-400 font-semibold">Card is live</span>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Home bar */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[72px] h-1 bg-white/20 rounded-full z-20" />
                                </div>
                            </motion.div>

                            {/* Floating badges — only on sm+ */}
                            {BADGES.map((badge, i) => (
                                <motion.div
                                    key={badge.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2 + i * 0.3, type: 'spring', stiffness: 200 }}
                                    className={`absolute ${badge.pos} z-20 pointer-events-none hidden sm:block`}
                                >
                                    <motion.div
                                        animate={{ y: [0, -5 - i * 1.5, 0] }}
                                        transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
                                        className="flex items-center gap-2.5 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl px-3 py-2.5 min-w-[130px]"
                                    >
                                        <div className={`size-7 rounded-lg ${badge.bg} flex items-center justify-center shrink-0`}>
                                            <badge.icon className="size-3.5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white leading-none">{badge.label}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{badge.sub}</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 tracking-widest uppercase font-medium">Scroll</span>
                    <div className="w-5 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-start justify-center p-1">
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500"
                            animate={{ y: [0, 14, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
