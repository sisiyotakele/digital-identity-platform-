'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LandingHero() {
    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-medium text-primary">
                        <Smartphone className="size-3" />
                        Works with NFC cards
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                        Your digital identity,{' '}
                        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            one tap away
                        </span>
                    </h1>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                        Create beautiful digital business cards that work with NFC, QR codes, and direct links.
                        Share your contact in seconds, track every interaction.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/register">
                            <Button size="lg" className="gap-2">
                                Create your card free
                                <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg">
                                Sign in
                            </Button>
                        </Link>
                    </div>

                    <p className="text-xs text-muted-foreground">No credit card required. Free forever on the basic plan.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                >
                    <div className="relative mx-auto w-72 h-[500px] bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-slate-700">
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-10" />
                        <div className="bg-white rounded-[2rem] h-full overflow-hidden">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 h-28 relative">
                                <div className="absolute -bottom-8 left-4">
                                    <div className="size-16 rounded-2xl bg-white ring-4 ring-white shadow-lg" />
                                </div>
                            </div>
                            <div className="pt-12 px-4 space-y-3">
                                <div>
                                    <div className="h-4 bg-slate-900 rounded w-32" />
                                    <div className="h-3 bg-blue-500 rounded w-20 mt-1" />
                                </div>
                                <div className="h-px bg-slate-100" />
                                {['Email', 'Phone', 'Website'].map((item) => (
                                    <div key={item} className="flex items-center gap-2 py-1">
                                        <div className="size-8 rounded-lg bg-slate-100 flex-shrink-0" />
                                        <div className="h-3 bg-slate-200 rounded flex-1" />
                                    </div>
                                ))}
                                <div className="flex gap-2 pt-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="size-8 rounded-lg bg-slate-100" />
                                    ))}
                                </div>
                                <div className="h-10 bg-blue-600 rounded-xl mt-4" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute -right-4 top-12 bg-white rounded-2xl shadow-lg p-3 text-sm font-medium flex items-center gap-2 border border-border">
                        <div className="size-2 bg-green-500 rounded-full" />
                        247 views today
                    </div>

                    <div className="absolute -left-4 bottom-20 bg-white rounded-2xl shadow-lg p-3 text-xs border border-border">
                        <p className="font-medium">Contact saved</p>
                        <p className="text-muted-foreground">Jane Doe saved to contacts</p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
