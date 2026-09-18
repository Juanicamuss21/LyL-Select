'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useCartStore } from '../store/cartStore'
import { formatPriceARS } from '@/features/catalog/utils/whatsapp'
import { buildCartWhatsAppUrl } from '../utils/whatsappCheckout'

export function CartDrawer() {
  const router = useRouter()
  const pathname = usePathname()

  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    hasHydrated,
    lastAddedId,
    setLastAddedId,
  } = useCartStore()

  const itemsContainerRef = useRef<HTMLDivElement>(null)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Smooth autoscroll to newly added item and flash highlight
  useEffect(() => {
    if (isOpen && lastAddedId) {
      setHighlightedId(lastAddedId)

      const scrollTimer = setTimeout(() => {
        const itemEl = document.getElementById(`cart-item-${lastAddedId}`)
        if (itemEl) {
          itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }, 100)

      const glowTimer = setTimeout(() => {
        setHighlightedId(null)
        setLastAddedId(null)
      }, 2000)

      return () => {
        clearTimeout(scrollTimer)
        clearTimeout(glowTimer)
      }
    }
  }, [isOpen, lastAddedId, setLastAddedId])

  // Check scroll position to display quick autoscroll indicators
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setShowScrollTop(scrollTop > 120)
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 80)
  }

  const scrollToTop = () => {
    itemsContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    if (itemsContainerRef.current) {
      itemsContainerRef.current.scrollTo({
        top: itemsContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  const handleExploreCatalog = () => {
    closeCart()
    if (pathname === '/') {
      const el = document.getElementById('catalogo')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      router.push('/#catalogo')
    }
  }

  if (!isOpen) return null

  const total = getTotalPrice()
  const totalItems = hasHydrated ? getTotalItems() : 0

  const handleCheckout = () => {
    const url = buildCartWhatsAppUrl(items, total)
    window.open(url, '_blank')
    clearCart()
    closeCart()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col justify-between border-l border-white/[0.1] bg-dark-bg/95 shadow-2xl backdrop-blur-2xl transition-transform animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-white">Tu Carrito</span>
            {totalItems > 0 && (
              <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold-light">
                {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-400 transition-colors hover:border-gold/40 hover:bg-gold/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content Area with Smooth Scroll */}
        <div
          ref={itemsContainerRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto scroll-smooth overscroll-contain px-5 py-4 sm:px-6 space-y-4 scrollbar-thin"
        >
          {/* Quick Smooth Autoscroll to Top Pill */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="sticky top-2 z-20 mx-auto flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/80 px-3 py-1 text-[11px] font-medium text-gold-light shadow-gold-glow backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              <span>↑ Volver arriba</span>
            </button>
          )}

          {items.length === 0 ? (
            /* Empty State */
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/25 bg-gold/5 text-gold shadow-gold-glow">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-white">
                Tu carrito está vacío
              </h3>
              <p className="mt-2 max-w-xs text-xs text-neutral-400 leading-relaxed">
                Descubrí nuestras fragancias de autor fraccionadas y vapers importados para comenzar a armar tu pedido.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
                <button
                  onClick={handleExploreCatalog}
                  className="w-full rounded-xl bg-gradient-to-r from-gold via-gold-mid to-gold-light py-3 text-xs font-bold text-black transition-all hover:shadow-gold-glow active:scale-95"
                >
                  Explorar Catálogo ↓
                </button>
              </div>
            </div>
          ) : (
            /* Items List */
            items.map((item) => {
              const isHighlighted = highlightedId === item.id

              return (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className={`group relative flex gap-3.5 rounded-xl border p-3.5 backdrop-blur-md transition-all duration-500 ${
                    isHighlighted
                      ? 'border-gold bg-gold/10 shadow-gold-glow ring-1 ring-gold/50'
                      : 'border-white/[0.07] bg-dark-card/60 hover:border-gold/30'
                  }`}
                >
                {/* Thumbnail Image */}
                {item.imagen_url ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-white/5">
                    <Image
                      src={item.imagen_url}
                      alt={item.nombre}
                      fill
                      unoptimized={Boolean(item.imagen_url?.endsWith('.svg'))}
                      className="object-cover object-center"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-black/60 border border-white/5 text-gold">
                    ✦
                  </div>
                )}

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-gold-light font-medium truncate">
                          {item.marca}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-white truncate">
                          {item.nombre}
                        </h4>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        title="Quitar producto"
                        aria-label={`Quitar ${item.nombre}`}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>

                    {/* Format / Flavor pill */}
                    <div className="mt-1">
                      {item.formatoLabel && (
                        <span className="inline-block rounded-md border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-neutral-300">
                          {item.formatoLabel}
                        </span>
                      )}
                      {item.sabor && (
                        <span className="inline-block rounded-md border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-neutral-300">
                          Sabor: {item.sabor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Price Bottom Bar */}
                  <div className="mt-2 flex items-center justify-between border-t border-white/[0.04] pt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Disminuir cantidad"
                        className="flex h-5 w-5 items-center justify-center text-neutral-400 hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-semibold text-white">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Aumentar cantidad"
                        className="flex h-5 w-5 items-center justify-center text-neutral-400 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <span className="font-serif text-sm font-bold text-white">
                      {formatPriceARS(item.precio * item.cantidad)}
                    </span>
                  </div>
                </div>
                </div>
              )
            })
          )}

          {/* Quick Smooth Autoscroll to Bottom / Total */}
          {showScrollBottom && items.length > 2 && (
            <div className="sticky bottom-2 z-20 flex justify-center pointer-events-none">
              <button
                onClick={scrollToBottom}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/85 px-3.5 py-1 text-[11px] font-medium text-gold-light shadow-gold-glow backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                <span>↓ Ir al total</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer (Total & Checkout) */}
        {items.length > 0 && (
          <div className="border-t border-white/[0.08] bg-black/90 p-5 sm:p-6 space-y-4">
            {/* Subtotal & Total Display */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-400">Total a coordinar:</span>
              <div className="text-right">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {formatPriceARS(total)}
                </div>
                <span className="text-[10px] text-neutral-400">Precio final en pesos argentinos</span>
              </div>
            </div>

            {/* Mobile Thumb-Friendly WhatsApp Checkout Button */}
            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-gold via-gold-mid to-gold-light py-4 text-sm font-bold text-black shadow-gold-glow-lg transition-all duration-300 hover:opacity-95 active:scale-[0.99]"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
              </svg>
              <span>Confirmar pedido por WhatsApp</span>
            </button>

            {/* Clear Cart link */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span>Envío y pago directo por chat oficial</span>
              <button
                onClick={clearCart}
                className="hover:text-rose-400 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
