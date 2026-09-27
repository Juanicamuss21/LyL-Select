import type { Metadata } from 'next'
import Image from 'next/image'
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

      {/* Header Banner / Hero Section */}
      <section className="relative isolate overflow-hidden border-b border-white/[0.08] py-16 sm:py-24 lg:py-28">
        {/* Background Image: Responsive Desktop & Mobile with next/image */}
        {/* Desktop Image (16:9) */}
        <div className="hidden md:block absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/vapers-hero-desktop.webp"
            alt="Dispositivo vaper descartable de lujo con vapor criogénico helado"
            fill
            priority
            quality={92}
            sizes="100vw"
            className="object-cover object-right"
          />
          {/* Degradé horizontal: oscuro profundo a la izquierda donde reside el texto, difuminándose hacia la silueta a la derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/85 via-50% to-transparent" />
          {/* Suavizado vertical superior e inferior con el fondo de la página */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-transparent to-dark-bg" />
        </div>

        {/* Mobile Image (3:4) */}
        <div className="block md:hidden absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/vapers-hero-mobile.webp"
            alt="Dispositivo vaper descartable de lujo con vapor criogénico helado"
            fill
            priority
            quality={92}
            sizes="100vw"
            className="object-cover object-bottom"
          />
          {/* Degradé vertical: oscuro sólido arriba y medio para legibilidad perfecta del título y descripción */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/95 via-dark-bg/85 via-50% to-dark-bg/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
        </div>

        {/* Background glow effects (Gold warm + Ice cyan cool accent) */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold/10 blur-[130px] pointer-events-none z-0" />
        <div className="absolute top-1/2 right-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold-light backdrop-blur-md">
            <span>⚡ Dispositivos Descartables de Alta Capacidad</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Línea <span className="gold-gradient-text">Vapers Descartables</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
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
