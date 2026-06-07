'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createClient } from '@/lib/supabase/client'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validations'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    })

    async function onSubmit(values: ResetPasswordFormValues) {
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({ password: values.password })

        setLoading(false)

        if (error) {
            toast.error(error.message)
            return
        }

        toast.success('Password updated successfully')
        router.push('/login')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
                <p className="text-sm text-muted-foreground">Choose a strong password for your account</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Min. 8 characters" autoComplete="new-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Repeat your password" autoComplete="new-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Update password
                        </Button>
                    </form>
                </Form>
            </div>
        </motion.div>
    )
}
