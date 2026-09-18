import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/features/catalog/components/Navbar'
import { PerfumeOrderWidget } from '@/features/catalog/components/PerfumeOrderWidget'
import { getPerfumeBySlug, getPerfumes } from '@/features/catalog/services/catalog'

interface PerfumePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PerfumePageProps): Promise<Metadata> {
  const { slug } = await params
  const perfume = await getPerfumeBySlug(slug)

  if (!perfume) {
    return {
      title: 'Perfume no encontrado — LyL Select',
      description: 'El perfume solicitado no fue encontrado en nuestro catálogo.',
    }
  }

  const pageTitle = `${perfume.nombre} — LyL Select`

  return {
    title: {
      absolute: pageTitle,
    },
    description: perfume.descripcion,
    openGraph: {
      title: pageTitle,
      description: perfume.descripcion,
      images: [
        {
          url: perfume.imagen_url,
          alt: `${perfume.nombre} — ${perfume.marca}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: perfume.descripcion,
      images: [perfume.imagen_url],
    },
  }
}

export default async function PerfumeDetailPage({ params }: PerfumePageProps) {
  const { slug } = await params
  const perfume = await getPerfumeBySlug(slug)

  if (!perfume) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-dark-bg selection:bg-gold/20 selection:text-gold-light">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-gold-light transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/#catalogo" className="hover:text-gold-light transition-colors">
              Perfumes
            </Link>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-xs">{perfume.nombre}</span>
          </nav>

          {/* Product Detail Layout (2 Columns on Desktop) */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Framed Image with Liquid Glass */}
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-b from-neutral-900 to-black p-2 shadow-2xl">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src={perfume.imagen_url}
                      alt={`${perfume.marca} - ${perfume.nombre}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="rounded-full border border-gold/40 bg-black/75 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-light backdrop-blur-md">
                        {perfume.familia_olfativa}
                      </span>
                      <span className="rounded-full border border-white/20 bg-black/75 px-3 py-1 text-xs uppercase tracking-wider text-neutral-300 backdrop-blur-md">
                        {perfume.genero}
                      </span>
                    </div>

                    {/* Bottom Info Banner */}
                    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/80 p-3 backdrop-blur-md text-xs text-neutral-300 flex items-center justify-between">
                      <span>Frasco original:</span>
                      <strong className="text-gold-light">{perfume.tamano_original_ml}ml</strong>
                    </div>
                  </div>
                </div>

                {/* Guarantee bullet note */}
                <div className="mt-4 flex items-center justify-center gap-3 text-center text-xs text-neutral-400">
                  <span>✦ 100% Auténtico</span>
                  <span>•</span>
                  <span>✦ Decantado al momento</span>
                  <span>•</span>
                  <span>✦ Atomizador de vidrio</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information, Olfactory Pyramid, and Order Widget */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
                  {perfume.marca}
                </span>
                <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
                  {perfume.nombre}
                </h1>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300 font-light">
                  {perfume.descripcion}
                </p>
              </div>

              {/* Olfactory Pyramid (Pirámide Olfativa) */}
              <div className="rounded-2xl border border-white/[0.08] bg-dark-card/60 p-6 backdrop-blur-md">
                <h2 className="font-serif text-lg font-semibold text-white flex items-center gap-2">
                  <span className="gold-gradient-text">✦</span>
                  <span>Pirámide Olfativa</span>
                </h2>

                <div className="mt-5 space-y-4 text-xs">
                  {/* Salida */}
                  <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3.5">
                    <div className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                      Notas de Salida (Primeros 15 min)
                    </div>
                    <div className="mt-1 text-neutral-200 text-sm font-medium">
                      {perfume.notas_salida}
                    </div>
                  </div>

                  {/* Corazón */}
                  <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3.5">
                    <div className="text-[10px] uppercase tracking-widest text-gold-mid font-semibold">
                      Notas de Corazón (Cuerpo de la fragancia)
                    </div>
                    <div className="mt-1 text-neutral-200 text-sm font-medium">
                      {perfume.notas_corazon}
                    </div>
                  </div>

                  {/* Fondo */}
                  <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3.5">
                    <div className="text-[10px] uppercase tracking-widest text-gold-light font-semibold">
                      Notas de Fondo (Fijación y estela final)
                    </div>
                    <div className="mt-1 text-neutral-200 text-sm font-medium">
                      {perfume.notas_fondo}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance & Technical Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                {/* Duración */}
                <div className="group flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-dark-card/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:bg-dark-card/95 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                  <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gold/5 text-gold transition-all duration-300 group-hover:border-gold/45 group-hover:bg-gold/10 group-hover:shadow-gold-glow">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4.243 2.121" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                    Duración
                  </span>
                  <strong className="mt-1.5 block text-sm sm:text-base font-semibold text-white transition-colors group-hover:text-gold-light">
                    {perfume.duracion}
                  </strong>
                </div>

                {/* Proyección */}
                <div className="group flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-dark-card/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:bg-dark-card/95 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                  <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gold/5 text-gold transition-all duration-300 group-hover:border-gold/45 group-hover:bg-gold/10 group-hover:shadow-gold-glow">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <circle cx="12" cy="12" r="2.25" fill="currentColor" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="9.75" opacity="0.65" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                    Proyección
                  </span>
                  <strong className="mt-1.5 block text-sm sm:text-base font-semibold text-white transition-colors group-hover:text-gold-light">
                    {perfume.proyeccion}
                  </strong>
                </div>

                {/* Ocasión Ideal */}
                <div className="col-span-2 sm:col-span-1 group flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-dark-card/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:bg-dark-card/95 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                  <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gold/5 text-gold transition-all duration-300 group-hover:border-gold/45 group-hover:bg-gold/10 group-hover:shadow-gold-glow">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 13h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2z" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                    Ocasión Ideal
                  </span>
                  <strong className="mt-1.5 block text-xs sm:text-sm font-semibold text-white transition-colors group-hover:text-gold-light">
                    {perfume.ocasion}
                  </strong>
                </div>
              </div>

              {/* Interactive Format Selector & WhatsApp Conversion Widget */}
              <PerfumeOrderWidget perfume={perfume} />
            </div>
          </div>
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
          <p>Perfumería de autor, decants seleccionados y vapers importados.</p>
          <div className="pt-3 flex items-center justify-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              Catálogo de Perfumes
            </Link>
            <span className="text-neutral-700">|</span>
            <Link href="/vapers" className="hover:text-white transition-colors">
              Línea Vapers
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
