'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LIMITS } from '@/lib/constants'

interface UploadOptions {
    bucket: 'avatars' | 'card-media'
    folder?: string
}

export function useUpload() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    async function upload(file: File, options: UploadOptions): Promise<string> {
        if (!(LIMITS.SUPPORTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
            throw new Error('Unsupported file type. Use JPEG, PNG, or WebP.')
        }

        const maxBytes = options.bucket === 'avatars'
            ? LIMITS.MAX_PHOTO_SIZE_MB * 1024 * 1024
            : LIMITS.MAX_LOGO_SIZE_MB * 1024 * 1024

        if (file.size > maxBytes) {
            throw new Error(`File too large. Max size is ${options.bucket === 'avatars' ? LIMITS.MAX_PHOTO_SIZE_MB : LIMITS.MAX_LOGO_SIZE_MB}MB.`)
        }

        setUploading(true)
        setProgress(10)

        try {
            const { default: imageCompression } = await import('browser-image-compression')
            const compressed = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
                onProgress: (p) => setProgress(10 + Math.floor(p * 0.7)),
            })

            setProgress(80)

            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const ext = file.name.split('.').pop() ?? 'jpg'
            const folder = options.folder ?? user.id
            const path = `${folder}/${Date.now()}.${ext}`

            const { error } = await supabase.storage.from(options.bucket).upload(path, compressed, {
                cacheControl: '3600',
                upsert: false,
            })

            if (error) throw new Error(error.message)

            const { data: { publicUrl } } = supabase.storage.from(options.bucket).getPublicUrl(path)

            setProgress(100)
            return publicUrl
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    return { upload, uploading, progress }
}
