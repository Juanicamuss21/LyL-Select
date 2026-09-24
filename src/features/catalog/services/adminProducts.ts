import { createClient } from '@/lib/supabase/client'
import type { Perfume, Vaper } from '../types'

/**
 * Uploads an image file to the Supabase Storage 'products' bucket and returns its public URL.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const ext = sanitizedName.split('.').pop() || 'jpg'
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const filePath = `uploads/${Date.now()}_${randomSuffix}.${ext}`

  const { error } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type || 'image/webp',
      upsert: false,
    })

  if (error) {
    throw new Error(error.message || 'Error al subir la imagen al almacenamiento.')
  }

  const { data } = supabase.storage.from('products').getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Deletes a perfume by its ID.
 */
export async function deletePerfume(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  const { error } = await supabase.from('perfumes').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Deletes a vaper by its ID.
 */
export async function deleteVaper(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  const { error } = await supabase.from('vapers').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Fetches a single perfume by its ID.
 */
export async function getPerfumeById(id: string): Promise<Perfume | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from('perfumes').select('*').eq('id', id).single()

  if (error || !data) return null
  return data as Perfume
}

/**
 * Fetches a single vaper by its ID.
 */
export async function getVaperById(id: string): Promise<Vaper | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from('vapers').select('*').eq('id', id).single()

  if (error || !data) return null
  return data as Vaper
}

/**
 * Creates or updates a perfume.
 */
export async function savePerfume(
  perfumeData: Omit<Perfume, 'id' | 'created_at'>,
  id?: string
): Promise<{ success: boolean; data?: Perfume; error?: string }> {
  const supabase = createClient()

  if (id) {
    const { data, error } = await supabase
      .from('perfumes')
      .update(perfumeData)
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data: data as Perfume }
  } else {
    const { data, error } = await supabase
      .from('perfumes')
      .insert(perfumeData)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data: data as Perfume }
  }
}

/**
 * Creates or updates a vaper.
 */
export async function saveVaper(
  vaperData: Omit<Vaper, 'id' | 'created_at'>,
  id?: string
): Promise<{ success: boolean; data?: Vaper; error?: string }> {
  const supabase = createClient()

  if (id) {
    const { data, error } = await supabase
      .from('vapers')
      .update(vaperData)
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data: data as Vaper }
  } else {
    const { data, error } = await supabase
      .from('vapers')
      .insert(vaperData)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data: data as Vaper }
  }
}
