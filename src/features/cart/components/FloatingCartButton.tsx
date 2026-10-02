'use client'

import { usePathname } from 'next/navigation'
import { buildWhatsAppLink, buildGeneralQueryMessage } from '@/features/catalog/utils/whatsapp'
import { useSiteConfig } from '@/features/config/context/SiteConfigContext'

export function FloatingCartButton() {
  const pathname = usePathname()
  const { whatsappNumber, whatsappGreeting } = useSiteConfig()
  const waUrl = buildWhatsAppLink(whatsappGreeting || buildGeneralQueryMessage(), whatsappNumber)

  // Hide on admin and login pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null
  }

  return (
    <aside aria-label="Contactar por WhatsApp" className="fixed bottom-6 right-5 z-40 sm:bottom-8 sm:right-8">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full border border-[#25D366]/40 bg-dark-card/90 text-[#25D366] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] active:scale-95"
      >
        <svg
          className="h-6 w-6 fill-current transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
        </svg>
      </a>
    </aside>
  )
}
