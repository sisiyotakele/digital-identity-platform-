'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/Logo'

const benefits = [
    'No credit card required',
    'Free forever on basic plan',
    'Set up in under 2 minutes',
    'Cancel anytime',
]

export function LandingCTA() {
    return (
        <section id="pricing" className="py-28 px-4 sm:px-6 bg-white dark:bg-gray-950">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="flex justify-center">
                            <Logo size="md" variant="white" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                                Your digital card is{' '}
                                <span className="text-blue-200">waiting</span>
                            </h2>
                            <p className="text-xl text-blue-100 max-w-lg mx-auto">
                                Join 50,000+ professionals who share their identity smarter with UNIQUE Digital Card.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 text-sm text-blue-100">
                            {benefits.map((b) => (
                                <div key={b} className="flex items-center gap-1.5">
                                    <CheckCircle2 className="size-4 text-blue-300" />
                                    {b}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="h-13 px-8 text-base font-bold bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-xl gap-2"
                                >
                                    Create your free card
                                    <ArrowRight className="size-5" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-13 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 bg-transparent"
                                >
                                    Sign in
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
