'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const templates = [
    { name: 'Modern', accent: '#3B82F6', bg: 'from-blue-500 to-blue-600', dark: false },
    { name: 'Executive', accent: '#1C1917', bg: 'from-stone-800 to-stone-900', dark: true },
    { name: 'Creative', accent: '#7C3AED', bg: 'from-violet-500 to-purple-600', dark: false },
    { name: 'Startup', accent: '#10B981', bg: 'from-emerald-500 to-emerald-600', dark: false },
    { name: 'Gradient', accent: '#6366F1', bg: 'from-indigo-500 to-violet-500', dark: false },
    { name: 'Dark', accent: '#22D3EE', bg: 'from-zinc-800 to-zinc-900', dark: true },
    { name: 'Corporate', accent: '#1B4F8A', bg: 'from-blue-800 to-blue-900', dark: true },
    { name: 'Minimal', accent: '#6B7280', bg: 'from-gray-100 to-gray-200', dark: false },
]

export function LandingTemplates() {
    return (
        <section id="templates" className="py-28 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">
                        8 designs
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                        Premium templates for every professional
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mt-4 max-w-lg mx-auto">
                        Every template is designed to make you look your best — on screen and in print.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                    {templates.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="group cursor-pointer"
                        >
                            <div className="rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                                {/* Card mockup */}
                                <div className={`h-44 bg-gradient-to-br ${t.bg} relative p-4`}>
                                    {/* Header bar */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`text-xs font-black tracking-wider ${t.dark ? 'text-white/70' : 'text-white/90'}`}>UNIQUE</div>
                                        <div className={`size-6 rounded-full ${t.dark ? 'bg-white/10' : 'bg-white/20'}`} />
                                    </div>
                                    {/* Avatar */}
                                    <div className={`size-10 rounded-xl ${t.dark ? 'bg-white/10' : 'bg-white/30'} mb-2`} />
                                    {/* Name lines */}
                                    <div className={`h-2.5 rounded w-20 mb-1.5 ${t.dark ? 'bg-white/20' : 'bg-white/70'}`} />
                                    <div className={`h-1.5 rounded w-14 mb-3 ${t.dark ? 'bg-white/10' : 'bg-white/50'}`} />
                                    {/* Button */}
                                    <div className={`h-6 rounded-lg w-full ${t.dark ? 'bg-white/10' : 'bg-white/30'}`} />
                                </div>
                                {/* Name label */}
                                <div className="bg-white dark:bg-gray-800 px-4 py-2.5 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t.name}</span>
                                    <div className="size-4 rounded-full" style={{ backgroundColor: t.accent }} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/register">
                        <Button size="lg" className="h-12 px-8 font-semibold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90 gap-2">
                            Try all templates free
                            <ArrowRight className="size-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
