import { createClient } from '@/lib/supabase/client'

export function slugify(text: string): string {
  if (!text) return ''
  return text
    .toString()
    .normalize('NFD') // Separate accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Trim hyphens from ends
}

/**
 * Checks slug uniqueness in Supabase and returns a guaranteed unique slug.
 */
export async function getUniqueSlug(
  name: string,
  table: 'perfumes' | 'vapers',
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(name) || 'producto'
  const supabase = createClient()

  // Find all slugs that start with baseSlug
  const { data } = await supabase
    .from(table)
    .select('id, slug')
    .ilike('slug', `${baseSlug}%`)

  if (!data || data.length === 0) {
    return baseSlug
  }

  // Filter out the current item if editing
  const otherSlugs = new Set(
    data.filter((item) => !excludeId || item.id !== excludeId).map((item) => item.slug)
  )

  if (!otherSlugs.has(baseSlug)) {
    return baseSlug
  }

  // Find next numerical suffix
  let counter = 2
  while (otherSlugs.has(`${baseSlug}-${counter}`)) {
    counter++
  }

  return `${baseSlug}-${counter}`
}
