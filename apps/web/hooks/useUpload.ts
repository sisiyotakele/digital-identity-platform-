'use client'

import { useState } from 'react'

interface UploadOptions {
    bucket: 'avatars' | 'card-media'
    folder?: string
}

export function useUpload() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    async function upload(file: File, options: UploadOptions): Promise<string> {
        const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!ALLOWED.includes(file.type)) {
            throw new Error('Unsupported file type. Use JPEG, PNG, or WebP.')
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File too large. Max size is 5MB.')
        }

        setUploading(true)
        setProgress(20)

        try {
            // Optionally compress before sending
            let fileToUpload = file
            try {
                const { default: imageCompression } = await import('browser-image-compression')
                fileToUpload = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1200,
                    useWebWorker: true,
                    onProgress: (p) => setProgress(20 + Math.floor(p * 0.5)),
                })
            } catch {
                // Compression failed — use original file
            }

            setProgress(75)

            const formData = new FormData()
            formData.append('file', fileToUpload)
            formData.append('bucket', options.bucket)
            if (options.folder) formData.append('folder', options.folder)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json() as { url?: string; error?: string }

            if (!response.ok) {
                throw new Error(data.error ?? `Upload failed (${response.status})`)
            }

            if (!data.url) {
                throw new Error('No URL returned from upload')
            }

            setProgress(100)
            return data.url
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    return { upload, uploading, progress }
}
