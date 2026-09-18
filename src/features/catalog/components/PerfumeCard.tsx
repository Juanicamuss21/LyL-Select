import Link from 'next/link'
import Image from 'next/image'
import type { Perfume } from '../types'
import { formatPriceARS, buildWhatsAppLink, buildPerfumeOrderMessage } from '../utils/whatsapp'

interface PerfumeCardProps {
  perfume: Perfume
  destacadoGrande?: boolean
}

/**
 * Truncates text strictly at whole-word boundaries to avoid splitting words
 */
function truncateWords(text: string, maxChars: number = 110): string {
  if (!text) return ''
  const trimmed = text.trim()
  if (trimmed.length <= maxChars) return trimmed
  const sub = trimmed.slice(0, maxChars)
  const lastSpace = sub.lastIndexOf(' ')
  if (lastSpace > 20) {
    return sub.slice(0, lastSpace).replace(/[,.:;!?-]+$/, '') + '...'
  }
  return sub.replace(/[,.:;!?-]+$/, '') + '...'
}

export function PerfumeCard({ perfume }: PerfumeCardProps) {
  // Determine minimum available starting price
  const preciosDisponibles: number[] = []
  if (perfume.disponible_decant_5ml && perfume.precio_decant_5ml) {
    preciosDisponibles.push(perfume.precio_decant_5ml)
  }
  if (perfume.disponible_decant_10ml && perfume.precio_decant_10ml) {
    preciosDisponibles.push(perfume.precio_decant_10ml)
  }
  if (perfume.disponible_frasco_completo && perfume.precio_frasco_completo) {
    preciosDisponibles.push(perfume.precio_frasco_completo)
  }

  const precioMinimo = preciosDisponibles.length > 0 ? Math.min(...preciosDisponibles) : null
  const esDisponible = perfume.disponible && preciosDisponibles.length > 0

  // WhatsApp link directly for decant 5ml (or lowest available format)
  const quickWaUrl = buildWhatsAppLink(
    buildPerfumeOrderMessage({
      nombre: perfume.nombre,
      marca: perfume.marca,
      formato: perfume.disponible_decant_5ml ? '5ml' : perfume.disponible_decant_10ml ? '10ml' : 'frasco',
      precio: precioMinimo,
    })
  )

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-dark-card transition-all duration-300 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
      {/* Visual Image Container - Fixed uniform aspect ratio */}
      <Link
        href={`/perfumes/${perfume.slug}`}
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900 block"
      >
        <Image
          src={perfume.imagen_url}
          alt={`${perfume.marca} - ${perfume.nombre}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-80" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider text-neutral-300 backdrop-blur-md">
            {perfume.familia_olfativa}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider backdrop-blur-md ${
              esDisponible
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}
          >
            {esDisponible ? 'Disponible' : 'Agotado'}
          </span>
        </div>

        {/* Gender Subtle Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold-light border border-gold/20">
            {perfume.genero}
          </span>
        </div>
      </Link>

      {/* Card Content Body - Uniform internal spacing */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Brand and size header */}
          <div className="flex items-center justify-between text-xs tracking-widest uppercase text-gold-light font-medium">
            <span>{perfume.marca}</span>
            <span className="text-[11px] text-neutral-400">{perfume.tamano_original_ml}ml orig.</span>
          </div>

          {/* Perfume Name */}
          <Link href={`/perfumes/${perfume.slug}`} className="mt-1 block group/title">
            <h3 className="font-serif text-xl font-semibold text-white transition-colors group-hover/title:text-gold-light line-clamp-1">
              {perfume.nombre}
            </h3>
          </Link>

          {/* Editorial Description - Strictly word-safe truncation & uniform height */}
          <p className="mt-2 min-h-[38px] text-xs leading-relaxed text-neutral-400 line-clamp-2 break-words">
            {truncateWords(perfume.descripcion, 110)}
          </p>

          {/* Formatos y Precios - Exact same alignment across all cards */}
          <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-xl border border-white/[0.06] bg-black/40 p-2 text-center text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">5ml</span>
              <span className="font-medium text-white text-[11px] sm:text-xs">
                {perfume.disponible_decant_5ml && perfume.precio_decant_5ml
                  ? formatPriceARS(perfume.precio_decant_5ml)
                  : 'Agotado'}
              </span>
            </div>
            <div className="flex flex-col border-x border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">10ml</span>
              <span className="font-medium text-white text-[11px] sm:text-xs">
                {perfume.disponible_decant_10ml && perfume.precio_decant_10ml
                  ? formatPriceARS(perfume.precio_decant_10ml)
                  : 'Agotado'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">Frasco</span>
              <span className="font-medium text-white text-[11px] sm:text-xs">
                {perfume.disponible_frasco_completo && perfume.precio_frasco_completo
                  ? formatPriceARS(perfume.precio_frasco_completo)
                  : 'Agotado'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Actions Footer - Exactly in same vertical position */}
        <div className="mt-5 flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <Link
            href={`/perfumes/${perfume.slug}`}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-center text-xs font-medium text-neutral-200 transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-white"
          >
            Ver Notas & Medidas
          </Link>

          {esDisponible && (
            <a
              href={quickWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Pedir ${perfume.nombre} por WhatsApp`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-light transition-all hover:bg-gold hover:text-black hover:shadow-gold-glow"
              title="Pedir decant rápido por WhatsApp"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
