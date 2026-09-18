import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/features/catalog/components/Navbar'
import { VaperCatalogClient } from '@/features/catalog/components/VaperCatalogClient'
import { getVapers } from '@/features/catalog/services/catalog'
import { buildWhatsAppLink, buildGeneralQueryMessage } from '@/features/catalog/utils/whatsapp'

export const revalidate = 60

export const metadata: Metadata = {
  title: {
    absolute: 'Vapers Descartables — LyL Select',
  },
  description:
    'Dispositivos descartables importados originales: Elfbar, Lost Mary, Ignite y Waka con entrega inmediata en toda Argentina. Asesoramiento por WhatsApp.',
  openGraph: {
    title: 'Vapers Descartables — LyL Select',
    description:
      'Dispositivos descartables importados originales: Elfbar, Lost Mary, Ignite y Waka con entrega inmediata en toda Argentina. Asesoramiento por WhatsApp.',
    images: [
      {
        url: '/logo-background.png',
        width: 736,
        height: 736,
        alt: 'LyL Select — Vapers Descartables',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vapers Descartables — LyL Select',
    description:
      'Dispositivos descartables importados originales: Elfbar, Lost Mary, Ignite y Waka con entrega inmediata en toda Argentina.',
    images: ['/logo-background.png'],
  },
}

export default async function VapersPage() {
  const vapers = await getVapers()
  const waUrl = buildWhatsAppLink(buildGeneralQueryMessage())

  return (
    <div className="flex min-h-screen flex-col bg-dark-bg selection:bg-gold/20 selection:text-gold-light">
      <Navbar />

      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-white/[0.08] py-14 sm:py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold/10 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold-light backdrop-blur-md">
            <span>⚡ Dispositivos Descartables de Alta Capacidad</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Línea <span className="gold-gradient-text">Vapers Descartables</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Marcas líderes internacionales (Lost Mary, Elfbar, Ignite, Waka) con tecnología antifuga, sabores intensos de larga duración y entrega inmediata.
          </p>
        </div>
      </section>

      {/* Catalog Container */}
      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VaperCatalogClient initialVapers={vapers} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-black py-10 text-center text-xs text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 space-y-3">
          <div className="flex justify-center">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <Image
                src="/logo.png"
                alt="LyL Select"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
            </Link>
          </div>
          <p>Línea exclusiva de vapeo y perfumería de autor.</p>
          <div className="pt-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light hover:underline font-semibold"
            >
              Consultar por WhatsApp (+54 9 385 435-3077)
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
