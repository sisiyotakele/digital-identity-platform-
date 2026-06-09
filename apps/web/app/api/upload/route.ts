import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
    // Verify the user is authenticated
    const authClient = await createServerSupabaseClient()
    const { data: { user } } = await authClient.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) ?? 'card-media'
    const folder = (formData.get('folder') as string) ?? ''

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, or WebP.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    }

    if (!['avatars', 'card-media'].includes(bucket)) {
        return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
    }

    // Use service role client to bypass RLS on storage
    const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const subfolder = folder ? `${folder}/` : ''
    const path = `${user.id}/${subfolder}${Date.now()}.${ext}`

    const buffer = await file.arrayBuffer()

    const { error } = await adminClient.storage
        .from(bucket)
        .upload(path, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true,
        })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = adminClient.storage.from(bucket).getPublicUrl(path)

    return NextResponse.json({ url: publicUrl })
}
