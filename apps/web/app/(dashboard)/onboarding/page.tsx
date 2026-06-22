'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Palette, Camera, QrCode, Eye, Printer, Share2, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/Logo'

const steps = [
    {
        icon: CreditCard,
        title: 'Create your card',
        description: 'Fill in your name, title, company, and contact details.',
        color: '#3B82F6',
        hint: 'Your info is always editable — nothing is permanent.',
    },
    {
        icon: Palette,
        title: 'Customize your design',
        description: 'Choose from 8 premium templates and pick your accent color.',
        color: '#8B5CF6',
        hint: 'You can switch templates at any time.',
    },
    {
        icon: Camera,
        title: 'Upload your photo',
        description: 'Add your profile photo and company logo for a polished look.',
        color: '#10B981',
        hint: 'Supported formats: JPEG, PNG, WebP. Max 5MB.',
    },
    {
        icon: QrCode,
        title: 'Generate QR code',
        description: 'Your card automatically gets a unique QR code ready to share or print.',
        color: '#F97316',
        hint: 'Use it in email signatures, presentations, or on physical cards.',
    },
    {
        icon: Eye,
        title: 'Preview your card',
        description: 'See exactly how your card looks before sharing it with the world.',
        color: '#06B6D4',
        hint: 'Preview updates live as you type.',
    },
    {
        icon: Printer,
        title: 'Print physical cards',
        description: 'Order premium physical business cards with your digital design.',
        color: '#EC4899',
        hint: 'Standard business card size with your QR code on the back.',
    },
    {
        icon: Share2,
        title: 'Share digitally',
        description: 'Share via link, NFC tap, QR code, or let contacts save directly.',
        color: '#8B5CF6',
        hint: 'Your public URL: uniquecard.app/username/slug',
    },
]

export default function OnboardingPage() {
    const [current, setCurrent] = useState(0)
    const router = useRouter()

    const step = steps[current]
    const Icon = step.icon
    const isLast = current === steps.length - 1

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <Logo size="md" />
                </div>

                {/* Progress bar */}
                <div className="flex gap-1.5 mb-8">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 h-1.5 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor: i <= current ? step.color : '#E5E7EB',
                            }}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="size-14 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: step.color }}
                            >
                                <Icon className="size-7 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                                    Step {current + 1} of {steps.length}
                                </p>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">{step.title}</h2>
                            </div>
                        </div>

                        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 flex items-start gap-2.5">
                            <div className="size-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs text-blue-600 dark:text-blue-300 font-bold">i</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.hint}</p>
                        </div>

                        {/* Already completed steps */}
                        {current > 0 && (
                            <div className="space-y-2">
                                {steps.slice(0, current).map((s, i) => {
                                    const S = s.icon
                                    return (
                                        <div key={i} className="flex items-center gap-2.5 text-sm text-gray-400">
                                            <div className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            {s.title}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="flex gap-3 mt-6">
                    {current > 0 && (
                        <Button variant="outline" onClick={() => setCurrent(current - 1)} className="flex-1">
                            Back
                        </Button>
                    )}
                    <Button
                        onClick={() => {
                            if (isLast) router.push('/cards/create')
                            else setCurrent(current + 1)
                        }}
                        className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90 font-bold"
                    >
                        {isLast ? (
                            <>Create my card <ArrowRight className="size-4" /></>
                        ) : (
                            <>Next <ArrowRight className="size-4" /></>
                        )}
                    </Button>
                </div>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4 transition-colors"
                >
                    Skip tour — go to dashboard
                </button>
            </div>
        </div>
    )
}
