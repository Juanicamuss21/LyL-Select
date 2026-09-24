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

export const FAMILIAS_OLFATIVAS: { id: FamiliaOlfativa; label: string }[] = [
  { id: 'oriental', label: 'Oriental' },
  { id: 'amaderado', label: 'Amaderado' },
  { id: 'dulce', label: 'Dulce / Gourmand' },
  { id: 'especiado', label: 'Especiado' },
  { id: 'acuatico', label: 'Acuático' },
  { id: 'citrico', label: 'Cítrico' },
  { id: 'floral', label: 'Floral' },
  { id: 'aromatico', label: 'Aromático' },
]

export const GENEROS_FRAGANCIA: { id: GeneroFragancia; label: string }[] = [
  { id: 'masculino', label: 'Masculino' },
  { id: 'femenino', label: 'Femenino' },
  { id: 'unisex', label: 'Unisex' },
]

export const OPCIONES_DURACION: string[] = [
  '14+ horas',
  '12+ horas',
  '10-12 horas',
  '9-11 horas',
  '7-8 horas',
  '5-6 horas',
]

export const OPCIONES_PROYECCION: string[] = [
  'Extrema / Estela memorable',
  'Fuerte / Invasiva elegante',
  'Fuerte / Calidez envolvente',
  'Moderada-Alta magnética',
  'Moderada-Alta sensual',
  'Moderada limpia y distinguida',
  'Suave e íntima',
]

export const OPCIONES_OCASION: string[] = [
  'Versátil / Uso diario',
  'Día / Climas cálidos',
  'Noche / Salidas y eventos',
  'Citas íntimas / Celebraciones especiales',
  'Eventos exclusivos / Negocios',
  'Clima frío / Otoño e Invierno',
]

