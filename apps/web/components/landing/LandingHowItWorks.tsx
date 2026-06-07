'use client'

import { motion } from 'framer-motion'
import { PenLine, Share2, Users } from 'lucide-react'

const steps = [
    {
        icon: PenLine,
        step: '01',
        title: 'Create your card',
        description: 'Fill in your details, choose a template, add your social links. Takes 2 minutes.',
    },
    {
        icon: Share2,
        step: '02',
        title: 'Share your link',
        description: 'Share your unique URL, use a QR code, or program an NFC card. Works everywhere.',
    },
    {
        icon: Users,
        step: '03',
        title: 'Connect and grow',
        description: 'People save your contact, click your links, and reach out. You see it all in analytics.',
    },
]

export function LandingHowItWorks() {
    return (
        <section id="how-it-works" className="py-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
                    <p className="text-muted-foreground mt-3">Up and running in under 5 minutes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div className="relative inline-flex mb-6">
                                <div className="size-14 rounded-2xl bg-primary flex items-center justify-center">
                                    <step.icon className="size-6 text-primary-foreground" />
                                </div>
                                <span className="absolute -top-2 -right-2 size-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                    {step.step}
                                </span>
                            </div>
                            <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
