import type { CartItem } from '../types'
import { formatPriceARS, LYL_WHATSAPP_NUMBER } from '@/features/catalog/utils/whatsapp'

// Emoji constants using explicit Unicode escapes to prevent file-encoding corruption
const WAVE    = '\u{1F44B}' // 👋
const CART    = '\u{1F6D2}' // 🛒
const BULLET  = '\u{2022}'  // •
const LINE    = '\u2501'    // ━ (box-drawing)
const MONEY   = '\u{1F4B0}' // 💰

/**
 * Builds the WhatsApp checkout message for a multi-item cart
 */
export function buildCartWhatsAppMessage(items: CartItem[], total: number): string {
  if (items.length === 0) return ''

  const separator = LINE.repeat(20)

  let message = `Hola LyL Select! ${WAVE} Quiero confirmar el siguiente pedido:\n\n${CART} *DETALLE DEL PEDIDO:*\n`

  items.forEach((item, index) => {
    message += `\n${index + 1}. *${item.marca} - ${item.nombre}*\n`
    if (item.formatoLabel) {
      message += `   ${BULLET} Formato: ${item.formatoLabel}\n`
    }
    if (item.sabor) {
      message += `   ${BULLET} Sabor: ${item.sabor}\n`
    }
    if (item.cantidad > 1) {
      message += `   ${BULLET} Cantidad: ${item.cantidad}\n`
      message += `   ${BULLET} Subtotal: ${formatPriceARS(item.precio * item.cantidad)} (${formatPriceARS(item.precio)} c/u)\n`
    } else {
      message += `   ${BULLET} Precio: ${formatPriceARS(item.precio)}\n`
    }
  })

  message += `\n${separator}\n`
  message += `${MONEY} *TOTAL A COORDINAR:* ${formatPriceARS(total)}\n\n`
  message += `\u00BFTienen stock para coordinar medio de pago y entrega?`

  return message
}

export function buildCartWhatsAppUrl(items: CartItem[], total: number): string {
  const message = buildCartWhatsAppMessage(items, total)
  return `https://wa.me/${LYL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message.trim())}`
}
