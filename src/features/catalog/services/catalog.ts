import { createClient } from '@/lib/supabase/server'
import type { Perfume, Vaper } from '../types'

export async function getPerfumes(filters?: {
  familia?: string
  genero?: string
  soloDisponibles?: boolean
  busqueda?: string
}): Promise<Perfume[]> {
  const supabase = await createClient()

  let query = supabase
    .from('perfumes')
    .select('*')
    .order('destacado', { ascending: false })
    .order('nombre', { ascending: true })

  if (filters?.familia && filters.familia !== 'todas') {
    query = query.eq('familia_olfativa', filters.familia)
  }

  if (filters?.genero && filters.genero !== 'todos') {
    query = query.eq('genero', filters.genero)
  }

  if (filters?.soloDisponibles) {
    query = query.eq('disponible', true)
  }

  if (filters?.busqueda && filters.busqueda.trim() !== '') {
    const term = `%${filters.busqueda.trim()}%`
    query = query.or(`nombre.ilike.${term},marca.ilike.${term},descripcion.ilike.${term}`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error al obtener perfumes:', error)
    return []
  }

  return (data as Perfume[]) || []
}

export async function getPerfumeBySlug(slug: string): Promise<Perfume | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('perfumes')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as Perfume
}

export async function getVapers(filters?: {
  marca?: string
  busqueda?: string
  soloDisponibles?: boolean
}): Promise<Vaper[]> {
  const supabase = await createClient()

  let query = supabase
    .from('vapers')
    .select('*')
    .order('destacado', { ascending: false })
    .order('nombre', { ascending: true })

  if (filters?.marca && filters.marca !== 'todas') {
    query = query.eq('marca', filters.marca)
  }

  if (filters?.soloDisponibles) {
    query = query.eq('disponible', true)
  }

  if (filters?.busqueda && filters.busqueda.trim() !== '') {
    const term = `%${filters.busqueda.trim()}%`
    query = query.or(`nombre.ilike.${term},marca.ilike.${term},sabor.ilike.${term}`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error al obtener vapers:', error)
    return []
  }

  return (data as Vaper[]) || []
}
