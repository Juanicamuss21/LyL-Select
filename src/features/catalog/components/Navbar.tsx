'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CartNavButton } from '@/features/cart/components/CartNavButton'

export function Navbar() {
  const pathname = usePathname()
  const isPerfumes = pathname === '/' || pathname.startsWith('/perfumes')
  const isVapers = pathname.startsWith('/vapers')
  const isMayorista = pathname.startsWith('/mayorista')

  const handlePerfumesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault()
      const el = document.getElementById('catalogo')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-dark-bg/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center py-1">
          <Image
            src="/logo.png"
            alt="LyL Select - Perfumería de Autor & Vapers"
            width={64}
            height={64}
            priority
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.08] bg-dark-surface/60 p-1.5 shadow-inner">
          <Link
            href="/#catalogo"
            onClick={handlePerfumesClick}
            className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest font-medium transition-all ${isPerfumes
                ? 'bg-gradient-to-r from-gold via-gold-mid to-gold-light text-black font-semibold shadow-gold-glow'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
          >
            Perfumes & Decants
          </Link>
          <Link
            href="/vapers"
            className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest font-medium transition-all ${isVapers
                ? 'bg-gradient-to-r from-gold via-gold-mid to-gold-light text-black font-semibold shadow-gold-glow'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
          >
            Vapers Descartables
          </Link>
          <span className="mx-1 h-3.5 w-px bg-white/10" aria-hidden="true" />
          <Link
            href="/mayorista"
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all ${isMayorista
                ? 'border border-gold/40 bg-gold/10 text-gold-light font-semibold shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                : 'text-neutral-400 hover:text-gold-light hover:bg-white/[0.03]'
              }`}
          >
            Venta Mayorista
          </Link>
        </nav>

        {/* Action Buttons: Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          <CartNavButton />
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex border-t border-white/[0.06] md:hidden">
        <Link
          href="/#catalogo"
          onClick={handlePerfumesClick}
          className={`flex-1 py-2.5 text-center text-xs uppercase tracking-wider font-medium transition-colors ${isPerfumes
              ? 'border-b-2 border-gold text-gold-light bg-white/[0.02]'
              : 'text-neutral-400 hover:text-white'
            }`}
        >
          Perfumes
        </Link>
        <Link
          href="/vapers"
          className={`flex-1 py-2.5 text-center text-xs uppercase tracking-wider font-medium transition-colors ${isVapers
              ? 'border-b-2 border-gold text-gold-light bg-white/[0.02]'
              : 'text-neutral-400 hover:text-white'
            }`}
        >
          Vapers
        </Link>
        <Link
          href="/mayorista"
          className={`flex-1 py-2.5 text-center text-xs uppercase tracking-wider font-medium transition-colors ${isMayorista
              ? 'border-b-2 border-gold text-gold-light bg-white/[0.02]'
              : 'text-neutral-400 hover:text-white'
            }`}
        >
          Mayorista
        </Link>
      </div>
    </header>
  )
}
