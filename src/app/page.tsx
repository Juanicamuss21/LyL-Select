import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/features/catalog/components/Navbar'
import { PerfumeCatalogClient } from '@/features/catalog/components/PerfumeCatalogClient'
import { getPerfumes } from '@/features/catalog/services/catalog'
import { buildWhatsAppLink, buildGeneralQueryMessage } from '@/features/catalog/utils/whatsapp'

export const revalidate = 60

export default async function HomePage() {
  const perfumes = await getPerfumes()
  const waUrl = buildWhatsAppLink(buildGeneralQueryMessage())

  return (
    <div className="flex min-h-screen flex-col bg-dark-bg selection:bg-gold/20 selection:text-gold-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/[0.08] py-16 sm:py-24">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 h-64 w-64 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold-light backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            <span>Colección Exclusiva 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-6 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            <span className="block">Perfumería de Autor &amp;</span>
            <span className="gold-gradient-text block mt-1 sm:mt-2">
              Decants Exclusivos
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
            Experimentá las fragancias nicho más codiciadas del mundo fraccionadas en{' '}
            <strong className="text-neutral-200">5ml y 10ml</strong> en atomizadores de vidrio premium, o adquirí el frasco sellado original. Cierre de compra directo por WhatsApp.
          </p>

          {/* Highlights pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-300 font-medium">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">
              <span className="text-gold">✦</span>
              <span>100% Fragancias Originales</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">
              <span className="text-gold">✦</span>
              <span>Atomizadores de Vidrio Herméticos</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">
              <span className="text-gold">✦</span>
              <span>Asesoramiento Personalizado</span>
            </div>
          </div>

          {/* Quick Category Jump */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#catalogo"
              className="rounded-full bg-gradient-to-r from-gold via-gold-mid to-gold-light px-8 py-3.5 text-sm font-bold text-black shadow-gold-glow hover:opacity-95 hover:shadow-gold-glow-lg active:scale-95 transition-all cursor-pointer"
            >
              Explorar Catálogo de Perfumes ↓
            </a>
            <Link
              href="/vapers"
              className="rounded-full border border-white/15 bg-white/[0.03] px-8 py-3.5 text-sm font-semibold text-white hover:border-gold/50 hover:bg-gold/10 hover:text-gold-light transition-all"
            >
              Ver Vapers Descartables →
            </Link>
          </div>
        </div>
      </section>

      {/* Bloque Explicativo: ¿Qué es un Decant? */}
      <section className="relative border-b border-white/[0.08] bg-gradient-to-b from-dark-bg via-dark-surface/40 to-dark-bg py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-dark-card/80 p-6 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
            {/* Subtle background glow */}
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gold/10 blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold-light">
                  <span>✦ Guía de Fragancias</span>
                </div>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-white">
                  ¿Qué es un <span className="gold-gradient-text">Decant</span>?
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-300 font-light">
                  Un decant es una muestra fraccionada directamente del frasco de autor original, envasada en un atomizador de vidrio premium de 5ml o 10ml. Es la forma ideal de experimentar cómo evoluciona una fragancia de lujo en tu piel y conocer su duración real durante semanas, sin necesidad de comprar el frasco completo.
                </p>

                {/* Benefits Pills */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3">
                    <div className="text-xs font-semibold text-gold-light">100% Original</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Extraído directo del envase original sin diluir.</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3">
                    <div className="text-xs font-semibold text-gold-light">Prueba en Piel</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">5ml rinde ~75 sprays; 10ml rinde ~150 sprays.</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3">
                    <div className="text-xs font-semibold text-gold-light">Lujo Accesible</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Accedé a perfumes nicho a una fracción del valor.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main id="catalogo" className="flex-1 py-12 sm:py-16 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
                Catálogo Disponible
              </span>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-white">
                Fragancias &amp; Decants
              </h2>
            </div>
            <p className="text-xs text-neutral-400 max-w-md">
              Hacé click en cualquier fragancia para ver sus notas olfativas completas, duración y seleccionar el formato deseado para pedir por WhatsApp.
            </p>
          </div>

          {/* Client Catalog with Real-time Filters */}
          <PerfumeCatalogClient initialPerfumes={perfumes} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-black py-12 text-center text-xs text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 space-y-4">
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
          <p className="max-w-md mx-auto text-neutral-400">
            Perfumería de autor, decants seleccionados y vapers importados. Calidad garantizada en cada atomización.
          </p>
          <div className="pt-4 flex items-center justify-center gap-6">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light hover:underline font-semibold"
            >
              WhatsApp (+54 9 385 435-3077)
            </a>
            <span className="text-neutral-700">|</span>
            <Link href="/vapers" className="hover:text-white transition-colors">
              Línea Vapers
            </Link>
          </div>
          <div className="pt-6 text-[11px] text-neutral-400 border-t border-white/[0.04]">
            © {new Date().getFullYear()} LyL Select. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
