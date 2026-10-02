'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SiteConfigInput } from '@/features/config/types'

export async function saveSiteConfigAction(
  config: SiteConfigInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('site_config')
      .upsert({ ...config, id: 'singleton', updated_at: new Date().toISOString() })

    if (error) {
      console.error('Error in saveSiteConfigAction:', error)
      return { success: false, error: error.message }
    }

    // Revalidar el árbol completo desde el layout raíz y rutas clave
    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/vapers')
    revalidatePath('/perfumes/[slug]', 'page')
    revalidatePath('/admin/configuracion')

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado al guardar la configuración.'
    return { success: false, error: message }
  }
}
