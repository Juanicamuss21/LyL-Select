import type { Metadata } from 'next'
import { Navbar } from '@/features/catalog/components/Navbar'
import { VaperCatalogClient } from '@/features/catalog/components/VaperCatalogClient'
import { SiteFooter } from '@/features/catalog/components/SiteFooter'
import { getVapers } from '@/features/catalog/services/catalog'
import { buildGeneralQueryMessage } from '@/features/catalog/utils/whatsapp'

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
  const waMessage = buildGeneralQueryMessage()

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

      <SiteFooter waMessage={waMessage} />
    </div>
  )
}
