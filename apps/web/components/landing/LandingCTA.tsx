'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LandingCTA() {
    return (
        <section className="py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Your digital card is waiting
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Join professionals who share their identity smarter. Free to start, no credit card needed.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/register">
                            <Button size="lg" className="gap-2">
                                Create your card
                                <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
