export const LYL_WHATSAPP_NUMBER = '5493854353077'

export function formatPriceARS(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function buildWhatsAppLink(message: string): string {
  const encodedText = encodeURIComponent(message.trim())
  return `https://wa.me/${LYL_WHATSAPP_NUMBER}?text=${encodedText}`
}

export function buildPerfumeOrderMessage(params: {
  nombre: string
  marca: string
  formato: '5ml' | '10ml' | 'frasco'
  precio: number | null
}): string {
  const formatoNombre =
    params.formato === '5ml'
      ? 'Decant 5ml'
      : params.formato === '10ml'
      ? 'Decant 10ml'
      : 'Frasco sellado completo'

  const precioTexto = params.precio ? ` (${formatPriceARS(params.precio)})` : ''

  return `Hola LyL Select! 👋 Me interesa consultar disponibilidad y comprar:\n\n✨ Producto: ${params.marca} - ${params.nombre}\n📏 Formato: ${formatoNombre}${precioTexto}\n\n¿Tienen stock para coordinar entrega?`
}

export function buildVaperOrderMessage(params: {
  nombre: string
  marca: string
  sabor: string
  puffs: number
  precio: number
}): string {
  return `Hola LyL Select! 👋 Me interesa comprar el siguiente vaper:\n\n💨 Modelo: ${params.marca} - ${params.nombre}\n🍓 Sabor: ${params.sabor}\n⚡ Puffs: ${params.puffs}\n💵 Precio: ${formatPriceARS(params.precio)}\n\n¿Tienen stock disponible?`
}

export function buildGeneralQueryMessage(): string {
  return `Hola LyL Select! 👋 Estuve viendo su catálogo web y me gustaría hacerles una consulta sobre perfumes y vapers.`
}
