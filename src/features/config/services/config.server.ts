/**
 * Server-side config service (uses next/headers via supabase/server).
 * Only import this from Server Components.
 */
import { createClient } from '@/lib/supabase/server'
import type { SiteConfig } from '../types'

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('id', 'singleton')
      .single()

    if (error || !data) return null
    return data as SiteConfig
  } catch (err) {
    console.error('Error fetching site config on server:', err)
    return null
  }
}

