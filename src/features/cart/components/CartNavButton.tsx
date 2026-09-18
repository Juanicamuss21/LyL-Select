'use client'

import { useCartStore } from '../store/cartStore'

export function CartNavButton() {
  const { openCart, getTotalItems, hasHydrated } = useCartStore()
  const count = hasHydrated ? getTotalItems() : 0

  return (
    <button
      onClick={openCart}
      aria-label="Abrir carrito de compras"
      className="group relative flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-xs font-semibold text-neutral-200 transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:text-white"
    >
      <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
      <span className="hidden sm:inline">Carrito</span>

      {/* Item count badge */}
      {count > 0 && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-gold via-gold-mid to-gold-light px-1 text-[11px] font-bold text-black shadow-gold-glow">
          {count}
        </span>
      )}
    </button>
  )
}
