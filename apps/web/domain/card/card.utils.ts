import { generateSlug, generateUniqueSlug } from '@/lib/slugify'
import { checkSlugAvailable } from '@/lib/api/card.api'

export async function buildAvailableSlug(title: string, excludeId?: string): Promise<string> {
    const base = generateSlug(title)
    const available = await checkSlugAvailable(base, excludeId)
    if (available) return base
    return generateUniqueSlug(title)
}
