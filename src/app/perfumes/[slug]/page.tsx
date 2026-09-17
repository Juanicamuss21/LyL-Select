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
      title: 'Perfume no encontrado | LyL Select',
    }
  }

  return {
    title: `${perfume.nombre} - ${perfume.marca} | Decants & Frasco | LyL Select`,
    description: `${perfume.nombre} de ${perfume.marca}. Fragancia ${perfume.familia_olfativa} (${perfume.genero}). Disponible en decants de 5ml, 10ml y frasco sellado. ${perfume.descripcion.slice(0, 120)}...`,
    openGraph: {
      title: `${perfume.nombre} - ${perfume.marca} | LyL Select`,
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
                <div className="rounded-xl border border-white/[0.06] bg-dark-card/60 p-4">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                    Duración
                  </span>
                  <strong className="mt-1 block text-sm sm:text-base font-medium text-white">
                    {perfume.duracion}
                  </strong>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-dark-card/60 p-4">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                    Proyección
                  </span>
                  <strong className="mt-1 block text-sm sm:text-base font-medium text-white">
                    {perfume.proyeccion}
                  </strong>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/[0.06] bg-dark-card/60 p-4">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                    Ocasión Ideal
                  </span>
                  <strong className="mt-1 block text-xs sm:text-sm font-medium text-white">
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
    </div>
  )
}
