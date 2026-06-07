import slugifyLib from 'slugify'

export function generateSlug(text: string): string {
    return slugifyLib(text, {
        lower: true,
        strict: true,
        trim: true,
    })
}

export function generateUniqueSlug(text: string, suffix?: string): string {
    const base = generateSlug(text)
    if (suffix) return `${base}-${suffix}`
    const random = Math.random().toString(36).slice(2, 6)
    return `${base}-${random}`
}
