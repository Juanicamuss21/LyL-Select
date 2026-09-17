export type FamiliaOlfativa =
  | 'citrico'
  | 'floral'
  | 'amaderado'
  | 'dulce'
  | 'oriental'
  | 'aromatico'
  | 'especiado'
  | 'acuatico'

export type GeneroFragancia = 'masculino' | 'femenino' | 'unisex'

export type FormatoPerfume = 'decant_5ml' | 'decant_10ml' | 'frasco_completo'

export interface Perfume {
  id: string
  slug: string
  nombre: string
  marca: string
  descripcion: string
  familia_olfativa: FamiliaOlfativa
  genero: GeneroFragancia
  notas_salida: string
  notas_corazon: string
  notas_fondo: string
  duracion: string
  proyeccion: string
  ocasion: string
  tamano_original_ml: number
  precio_decant_5ml: number | null
  disponible_decant_5ml: boolean
  precio_decant_10ml: number | null
  disponible_decant_10ml: boolean
  precio_frasco_completo: number | null
  disponible_frasco_completo: boolean
  disponible: boolean
  destacado: boolean
  imagen_url: string
  created_at: string
}

export interface Vaper {
  id: string
  slug: string
  nombre: string
  marca: string
  sabor: string
  puffs: number
  precio: number
  disponible: boolean
  destacado: boolean
  imagen_url: string
  created_at: string
}
