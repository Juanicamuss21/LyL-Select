export type CartItemType = 'perfume' | 'vaper'

export interface CartItem {
  id: string // Unique identifier (e.g. perfume-slug-formato or vaper-slug)
  type: CartItemType
  slug: string
  nombre: string
  marca: string
  formatoLabel?: string // e.g. "Decant 5ml", "Decant 10ml", "Frasco Sellado (100ml)"
  sabor?: string // e.g. "Watermelon Ice"
  puffs?: number // e.g. 10000
  precio: number
  cantidad: number
  imagen_url?: string
}
