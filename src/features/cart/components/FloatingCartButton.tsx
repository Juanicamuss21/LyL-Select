'use client'

import { useCartStore } from '../store/cartStore'
import { formatPriceARS } from '@/features/catalog/utils/whatsapp'

export function FloatingCartButton() {
  const { openCart, getTotalItems, getTotalPrice, hasHydrated, isOpen } = useCartStore()

  // Hide floating button if drawer is already open
  if (isOpen) return null

  const count = hasHydrated ? getTotalItems() : 0
  const total = hasHydrated ? getTotalPrice() : 0

  return (
    <aside aria-label="Acceso rápido al carrito" className="fixed bottom-6 right-5 z-40 sm:bottom-8 sm:right-8">
      <button
        onClick={openCart}
        aria-label={`Abrir carrito (${count} ${count === 1 ? 'producto' : 'productos'})`}
        className={`group flex items-center gap-3 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 ${
          count > 0
            ? 'border-gold/50 bg-dark-card/95 py-3 pl-4 pr-5 text-white shadow-[0_8px_30px_rgba(201,162,39,0.3)] hover:border-gold hover:shadow-gold-glow'
            : 'h-14 w-14 justify-center border-white/10 bg-dark-card/90 text-neutral-300 hover:border-gold/40 hover:text-white'
        }`}
      >
        {/* Cart Icon & Badge Container */}
        <div className="relative flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold group-hover:bg-gold group-hover:text-black transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>

          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold px-1 text-[9px] font-extrabold text-black">
              {count}
            </span>
          )}
        </div>

        {/* Mobile thumb-friendly label and price preview when items exist */}
        {count > 0 && (
          <div className="text-left">
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-gold-light leading-tight">
              Ver Carrito ({count})
            </span>
            <span className="font-serif text-sm font-bold text-white leading-tight">
              {formatPriceARS(total)}
            </span>
          </div>
        )}
      </button>
    </aside>
  )
}
