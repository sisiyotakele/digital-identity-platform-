import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) ?? 'card-media'
    const folder = (formData.get('folder') as string) ?? user.id

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${folder}/${Date.now()}.${ext}`
    const buffer = await file.arrayBuffer()

    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, buffer, { contentType: file.type, cacheControl: '3600', upsert: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)

    return NextResponse.json({ url: publicUrl })
}
