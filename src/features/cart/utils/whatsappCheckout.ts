import type { CartItem } from '../types'
import { formatPriceARS, LYL_WHATSAPP_NUMBER } from '@/features/catalog/utils/whatsapp'

/**
 * Builds the WhatsApp checkout message and direct link
 */
export function buildCartWhatsAppMessage(items: CartItem[], total: number): string {
  if (items.length === 0) return ''

  let message = `Hola LyL Select! 👋 Quiero confirmar el siguiente pedido:\n\n🛒 *DETALLE DEL PEDIDO:*\n`

  items.forEach((item, index) => {
    message += `\n${index + 1}. *${item.marca} - ${item.nombre}*\n`
    if (item.formatoLabel) {
      message += `   • Formato: ${item.formatoLabel}\n`
    }
    if (item.sabor) {
      message += `   • Sabor: ${item.sabor}\n`
    }
    if (item.cantidad > 1) {
      message += `   • Cantidad: ${item.cantidad}\n`
      message += `   • Subtotal: ${formatPriceARS(item.precio * item.cantidad)} (${formatPriceARS(item.precio)} c/u)\n`
    } else {
      message += `   • Precio: ${formatPriceARS(item.precio)}\n`
    }
  })

  message += `\n━━━━━━━━━━━━━━━━━━━━\n`
  message += `💰 *TOTAL A COORDINAR:* ${formatPriceARS(total)}\n\n`
  message += `¿Tienen stock para coordinar medio de pago y entrega?`

  return message
}

export function buildCartWhatsAppUrl(items: CartItem[], total: number): string {
  const message = buildCartWhatsAppMessage(items, total)
  return `https://wa.me/${LYL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message.trim())}`
}
