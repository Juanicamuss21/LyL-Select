'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { buildWhatsAppLink, buildGeneralQueryMessage } from '../utils/whatsapp'

export function Navbar() {
  const pathname = usePathname()
  const isPerfumes = pathname === '/' || pathname.startsWith('/perfumes')
  const isVapers = pathname.startsWith('/vapers')

  const waUrl = buildWhatsAppLink(buildGeneralQueryMessage())

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
            href="/"
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
        </nav>

        {/* Action Button: WhatsApp */}
        <div className="flex items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold-light transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black hover:shadow-gold-glow"
          >
            <svg
              className="h-4 w-4 fill-current transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
            </svg>
            <span className="hidden sm:inline">Pedir por WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex border-t border-white/[0.06] md:hidden">
        <Link
          href="/"
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
      </div>
    </header>
  )
}
