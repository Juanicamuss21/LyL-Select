/**
 * Client-side config service (browser only).
 * Safe to import from Client Components.
 */
import { createClient } from '@/lib/supabase/client'
import type { SiteConfig, SiteConfigInput } from '../types'

/** Lee la config del sitio desde el cliente (browser) */
export async function getSiteConfigClient(): Promise<SiteConfig | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .eq('id', 'singleton')
    .single()

  if (error || !data) return null
  return data as SiteConfig
}

/** Guarda (upsert) la config del sitio */
export async function saveSiteConfig(
  config: SiteConfigInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  const { error } = await supabase
    .from('site_config')
    .upsert({ ...config, id: 'singleton', updated_at: new Date().toISOString() })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
