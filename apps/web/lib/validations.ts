import { z } from 'zod'
import { LIMITS } from '@/lib/constants'

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export const cardSchema = z.object({
    title: z.string().max(100).optional(),
    company: z.string().max(100).optional(),
    slug: z
        .string()
        .min(LIMITS.CARD_SLUG_MIN_LENGTH, `Slug must be at least ${LIMITS.CARD_SLUG_MIN_LENGTH} characters`)
        .max(LIMITS.CARD_SLUG_MAX_LENGTH, `Slug must be at most ${LIMITS.CARD_SLUG_MAX_LENGTH} characters`)
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    template: z.enum(['minimal', 'modern', 'corporate', 'creative', 'executive', 'dark', 'gradient', 'startup']),
    phone: z.string().max(30).optional(),
    email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    address: z.string().max(300).optional(),
    bio: z.string().max(LIMITS.MAX_BIO_LENGTH, `Bio must be at most ${LIMITS.MAX_BIO_LENGTH} characters`).optional(),
    theme_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color').default('#1B4F8A'),
    is_active: z.boolean().default(true),
})

export const settingsProfileSchema = z.object({
    display_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens'),
})

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Please enter your current password'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export const leadSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    phone: z.string().max(30).optional(),
    message: z.string().max(500).optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type CardFormValues = z.infer<typeof cardSchema>
export type SettingsProfileFormValues = z.infer<typeof settingsProfileSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
export type LeadFormValues = z.infer<typeof leadSchema>
