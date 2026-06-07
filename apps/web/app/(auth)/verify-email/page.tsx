'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function VerifyEmailPage() {
    const [resending, setResending] = useState(false)

    async function handleResend() {
        setResending(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user?.email) {
            toast.error('No email address found')
            setResending(false)
            return
        }

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: user.email,
        })

        setResending(false)

        if (error) {
            toast.error(error.message)
            return
        }

        toast.success('Verification email resent')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center space-y-6"
        >
            <div className="flex justify-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="size-8 text-primary" />
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    We sent you a verification link. Click it to activate your account and get started.
                </p>
            </div>

            <div className="space-y-3">
                <Button onClick={handleResend} variant="outline" className="w-full" disabled={resending}>
                    {resending && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Resend verification email
                </Button>

                <Link href="/login">
                    <Button variant="ghost" className="w-full">
                        Back to sign in
                    </Button>
                </Link>
            </div>
        </motion.div>
    )
}
