'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Perfume } from '../types'
import { formatPriceARS, buildWhatsAppLink, buildPerfumeOrderMessage } from '../utils/whatsapp'
import { useCartStore } from '@/features/cart/store/cartStore'

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
  const { addItem } = useCartStore()

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

  // Default quick-add format: Decant 5ml if available, else 10ml, else frasco
  const quickFormato = perfume.disponible_decant_5ml && perfume.precio_decant_5ml
    ? { id: 'decant_5ml', label: 'Decant 5ml', precio: perfume.precio_decant_5ml }
    : perfume.disponible_decant_10ml && perfume.precio_decant_10ml
    ? { id: 'decant_10ml', label: 'Decant 10ml', precio: perfume.precio_decant_10ml }
    : perfume.precio_frasco_completo
    ? { id: 'frasco_completo', label: `Frasco Sellado (${perfume.tamano_original_ml}ml)`, precio: perfume.precio_frasco_completo }
    : null

  const handleAddToCart = () => {
    if (!esDisponible || !quickFormato) return
    addItem({
      id: `perfume-${perfume.slug}-${quickFormato.id}`,
      type: 'perfume',
      slug: perfume.slug,
      nombre: perfume.nombre,
      marca: perfume.marca,
      formatoLabel: quickFormato.label,
      precio: quickFormato.precio,
      imagen_url: perfume.imagen_url,
    })
  }

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

        {/* Card Actions Footer */}
        <div className="mt-5 space-y-2 pt-3 border-t border-white/[0.06]">
          {esDisponible ? (
            <>
              {/* Quick Add to Cart — Decant 5ml by default */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 py-2.5 text-xs font-semibold text-gold-light transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black hover:shadow-gold-glow active:scale-[0.99]"
                title={`Agregar ${quickFormato?.label ?? 'Decant 5ml'} al carrito`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Agregar al carrito</span>
              </button>

              {/* See full detail link */}
              <Link
                href={`/perfumes/${perfume.slug}`}
                className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-center text-xs font-medium text-neutral-300 transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-white"
              >
                Ver Notas &amp; Formatos
              </Link>
            </>
          ) : (
            <Link
              href={`/perfumes/${perfume.slug}`}
              className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-center text-xs font-medium text-neutral-300 transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-white"
            >
              Ver Notas &amp; Formatos
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
