'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createClient } from '@/lib/supabase/client'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    })

    async function onSubmit(values: ForgotPasswordFormValues) {
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        setLoading(false)

        if (error) {
            toast.error(error.message)
            return
        }

        setSent(true)
    }

    if (sent) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center space-y-4"
            >
                <div className="flex justify-center">
                    <CheckCircle className="size-12 text-green-500" />
                </div>
                <h2 className="text-lg font-semibold">Check your inbox</h2>
                <p className="text-sm text-muted-foreground">
                    We sent a password reset link to{' '}
                    <span className="font-medium text-foreground">{form.getValues('email')}</span>.
                </p>
                <Link href="/login">
                    <Button variant="outline" className="w-full mt-2">
                        Back to sign in
                    </Button>
                </Link>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and we will send you a reset link
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Send reset link
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Back to sign in
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
