import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/features/catalog/components/Navbar'
import { SiteFooter } from '@/features/catalog/components/SiteFooter'
import { getSiteConfig } from '@/features/config/services/config.server'
import {
  buildWhatsAppLink,
  buildMayoristaVapersMessage,
  buildMayoristaPerfumesMessage,
  LYL_WHATSAPP_NUMBER,
} from '@/features/catalog/utils/whatsapp'

export const revalidate = 60

export const metadata: Metadata = {
  title: {
    absolute: 'Venta por Mayor — LyL Select',
  },
  description:
    'Venta mayorista de vapers descartables importados y frascos sellados de perfume de autor. Precios especiales por volumen y atención personalizada directa por WhatsApp.',
  openGraph: {
    title: 'Venta por Mayor — LyL Select',
    description:
      'Venta mayorista de vapers descartables importados y frascos sellados de perfume de autor. Precios especiales por volumen y atención personalizada directa por WhatsApp.',
    images: [
      {
        url: '/logo-background.png',
        width: 736,
        height: 736,
        alt: 'LyL Select — Venta Mayorista',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venta por Mayor — LyL Select',
    description:
      'Precios especiales por volumen en vapers descartables y perfumes sellados originales.',
    images: ['/logo-background.png'],
  },
}

export default async function MayoristaPage() {
  const config = await getSiteConfig()
  const waNumber = config?.whatsapp_number || LYL_WHATSAPP_NUMBER

  const vapersWaUrl = buildWhatsAppLink(buildMayoristaVapersMessage(), waNumber)
  const perfumesWaUrl = buildWhatsAppLink(buildMayoristaPerfumesMessage(), waNumber)

  return (
    <div className="flex min-h-screen flex-col bg-dark-bg selection:bg-gold/20 selection:text-gold-light">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden border-b border-white/[0.08] py-16 sm:py-24">
          {/* Subtle background glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gold/10 blur-[140px] pointer-events-none z-0" />
          <div className="absolute top-1/2 right-10 h-64 w-64 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none z-0" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-light backdrop-blur-md">
              <span>✦ Canal Exclusivo para Revendedores &amp; Comercios</span>
            </div>

            <h1 className="mt-6 font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">
              Venta por <span className="gold-gradient-text">Mayor</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              Ofrecemos precios especiales por volumen en <strong className="text-white font-medium">vapers descartables</strong> y <strong className="text-white font-medium">frascos sellados de perfume originales</strong>.
            </p>

            <div className="mt-6 max-w-xl mx-auto rounded-2xl border border-white/[0.08] bg-black/40 p-4 text-xs text-neutral-400 leading-relaxed backdrop-blur-md">
              <span className="text-gold-light font-semibold block mb-1">
                Atención personalizada y cotización directa:
              </span>
              Las condiciones comerciales (cantidad mínima, escalas de precio por volumen y formas de pago) se coordinan directamente por WhatsApp de acuerdo a tu pedido específico y disponibilidad de stock.
            </div>
          </div>
        </section>

        {/* Contact Cards Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
                Líneas Disponibles
              </span>
              <h2 className="mt-2 font-sans text-2xl sm:text-3xl font-bold text-white">
                Elegí el rubro para tu consulta mayorista
              </h2>
              {/* <p className="mt-2 text-xs sm:text-sm text-neutral-400">
                Hacé click en la categoría correspondiente para iniciar tu cotización directa por WhatsApp con el mensaje pre-cargado.
              </p> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 2: Frascos Sellados al por mayor */}
              <div className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-dark-card/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-gold/40 hover:shadow-gold-glow">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    {/* <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-2xl text-gold">
                      ✨
                    </span> */}
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-light">
                      Perfumería de Autor
                    </span>
                  </div>

                  <div>
                    <h3 className="font-sans text-2xl font-bold text-white group-hover:text-gold-light transition-colors">
                      Frascos Sellados al por mayor
                    </h3>
                    <p className="mt-2 text-sm text-neutral-300 leading-relaxed font-light">
                      Fragancias de autor, nicho y diseñador en su presentación original sellada de fábrica con celofán intacto. Ideales para perfumerías, revendedores independientes y boutiques de lujo.
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✦</span>
                      <span><strong>100% Auténticos:</strong> Frascos completos en caja cerrada de origen con número de lote.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✦</span>
                      <span><strong>Fragancias de alta rotación:</strong> Fragancias de nicho y diseñador en su presentación original sellada.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✦</span>
                      <span><strong>Rentabilidad competitiva:</strong> Precios diferenciados para reventa rentable.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✦</span>
                      <span><strong>Modalidad exclusiva:</strong> Únicamente frascos sellados completos (no decants).</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <a
                    href={perfumesWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-gold via-gold-mid to-gold-light py-4 text-sm font-bold text-black shadow-gold-glow transition-all duration-300 hover:opacity-95 active:scale-[0.99]"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
                    </svg>
                    <span>Consultar por Frascos Sellados al por mayor</span>
                  </a>
                  <p className="mt-2 text-center text-[11px] text-neutral-400">
                    Mensaje prearmado: consultá disponibilidad de marcas y volumen deseado
                  </p>
                </div>
              </div>

              {/* Card 1: Vapers al por mayor */}
              <div className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-dark-card/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-gold/40 hover:shadow-gold-glow">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    {/* <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-2xl">
                      💨
                    </span> */}
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Dispositivos Descartables
                    </span>
                  </div>

                  <div>
                    <h3 className="font-sans text-2xl font-bold text-white group-hover:text-gold-light transition-colors">
                      Vapers al por mayor
                    </h3>
                    <p className="mt-2 text-sm text-neutral-300 leading-relaxed font-light">
                      Líneas completas de dispositivos descartables originales importados. Diseñados con tecnología antifuga, baterías de alto rendimiento y sabores premium de alta demanda en el mercado.
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✦</span>
                      <span><strong>Marcas líderes:</strong> Elfbar, Lost Mary, Ignite, Waka y más.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✦</span>
                      <span><strong>Variedad de capacidades:</strong> Desde 5.000 hasta 20.000+ puffs.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✦</span>
                      <span><strong>Stock en rotación continua:</strong> Reposición semanal con sabores surtidos.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✦</span>
                      <span><strong>Cajas selladas:</strong> Unidades 100% auténticas cerradas de fábrica.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <a
                    href={vapersWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-gold via-gold-mid to-gold-light py-4 text-sm font-bold text-black shadow-gold-glow transition-all duration-300 hover:opacity-95 active:scale-[0.99]"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
                    </svg>
                    <span>Consultar por Vapers al por mayor</span>
                  </a>
                  <p className="mt-2 text-center text-[11px] text-neutral-400">
                    Mensaje prearmado: consultá cantidad aproximada y lista de precios
                  </p>
                </div>
              </div>
            </div>

            {/* Clarification Callout about Decants */}
            <div className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-lg">
                  ⚠️
                </span>
                <div className="space-y-1 text-xs">
                  <h4 className="font-semibold text-white text-sm">
                    Aclaración importante sobre Decants Fraccionados (5ml y 10ml)
                  </h4>
                  <p className="text-neutral-300 leading-relaxed">
                    Los decants fraccionados de 5ml y 10ml son preparados artesanalmente y <strong className="text-white">no aplican a la modalidad mayorista</strong>. Esta vía comercial está destinada exclusivamente a <strong className="text-gold-light">vapers descartables</strong> y <strong className="text-gold-light">frascos sellados originales en caja cerrada</strong>. Si deseás adquirir decants para uso personal, podés hacerlo agregándolos directamente al carrito en nuestro catálogo minorista.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works (3 Steps) */}
            <div className="mt-16 border-t border-white/[0.08] pt-14">
              <div className="text-center mb-10">
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
                  Paso a Paso
                </span>
                <h3 className="mt-1 font-sans text-xl sm:text-2xl font-bold text-white">
                  ¿Cómo concretar tu compra mayorista?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-white/[0.06] bg-dark-card/60 p-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 font-bold text-gold text-xs mb-3">
                    01
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    Contactanos por WhatsApp
                  </h4>
                  <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                    Hacé click en cualquiera de los botones de arriba según tu rubro de interés (vapers o perfumes) para iniciar la conversación.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-dark-card/60 p-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 font-bold text-gold text-xs mb-3">
                    02
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    Cotización &amp; Escala de Precios
                  </h4>
                  <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                    Te enviamos la lista de stock en tiempo real y la tabla de descuentos escalonados de acuerdo a la cantidad solicitada.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-dark-card/60 p-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 font-bold text-gold text-xs mb-3">
                    03
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    Pago y Despacho Seguro
                  </h4>
                  <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                    Coordinamos el medio de pago más conveniente y despachamos tu pedido con embalaje reforzado para máxima protección.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Catalog Link */}
            <div className="mt-14 text-center">
              <Link
                href="/#catalogo"
                className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-gold-light transition-colors"
              >
                <span>← Volver a explorar el catálogo minorista</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
