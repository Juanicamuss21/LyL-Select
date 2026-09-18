'use client'

import { useState } from 'react'
import type { Perfume, FormatoPerfume } from '../types'
import { formatPriceARS, buildWhatsAppLink, buildPerfumeOrderMessage } from '../utils/whatsapp'
import { useCartStore } from '@/features/cart/store/cartStore'

interface PerfumeOrderWidgetProps {
  perfume: Perfume
}

export function PerfumeOrderWidget({ perfume }: PerfumeOrderWidgetProps) {
  // Determine default format: pick the first available format
  const initialFormat: FormatoPerfume = perfume.disponible_decant_5ml && perfume.precio_decant_5ml
    ? 'decant_5ml'
    : perfume.disponible_decant_10ml && perfume.precio_decant_10ml
    ? 'decant_10ml'
    : 'frasco_completo'

  const [formato, setFormato] = useState<FormatoPerfume>(initialFormat)

  const opciones = [
    {
      id: 'decant_5ml' as FormatoPerfume,
      label: 'Decant 5ml',
      sublabel: '~75 atomizaciones',
      precio: perfume.precio_decant_5ml,
      disponible: perfume.disponible_decant_5ml && perfume.precio_decant_5ml !== null,
    },
    {
      id: 'decant_10ml' as FormatoPerfume,
      label: 'Decant 10ml',
      sublabel: '~150 atomizaciones',
      precio: perfume.precio_decant_10ml,
      disponible: perfume.disponible_decant_10ml && perfume.precio_decant_10ml !== null,
    },
    {
      id: 'frasco_completo' as FormatoPerfume,
      label: `Frasco Sellado (${perfume.tamano_original_ml}ml)`,
      sublabel: 'Caja original cerrada',
      precio: perfume.precio_frasco_completo,
      disponible: perfume.disponible_frasco_completo && perfume.precio_frasco_completo !== null,
    },
  ]

  const opcionSeleccionada = opciones.find((o) => o.id === formato) || opciones[0]
  const esDisponible = perfume.disponible && opcionSeleccionada.disponible

  const waUrl = buildWhatsAppLink(
    buildPerfumeOrderMessage({
      nombre: perfume.nombre,
      marca: perfume.marca,
      formato:
        formato === 'decant_5ml'
          ? '5ml'
          : formato === 'decant_10ml'
          ? '10ml'
          : 'frasco',
      precio: opcionSeleccionada.precio,
    })
  )

  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    if (!esDisponible || !opcionSeleccionada.precio) return

    addItem({
      id: `perfume-${perfume.slug}-${formato}`,
      type: 'perfume',
      slug: perfume.slug,
      nombre: perfume.nombre,
      marca: perfume.marca,
      formatoLabel: opcionSeleccionada.label,
      precio: opcionSeleccionada.precio,
      imagen_url: perfume.imagen_url,
    })
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-dark-card/90 p-6 backdrop-blur-xl shadow-2xl">
      <span className="text-[11px] uppercase tracking-widest text-gold-light font-semibold">
        Seleccioná tu formato
      </span>

      {/* Format Radio Pills */}
      <div className="mt-4 space-y-3">
        {opciones.map((opcion) => {
          const isSelected = formato === opcion.id

          return (
            <button
              key={opcion.id}
              type="button"
              disabled={!opcion.disponible}
              onClick={() => setFormato(opcion.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                isSelected
                  ? 'border-gold bg-gold/10 shadow-gold-glow'
                  : opcion.disponible
                  ? 'border-white/[0.08] bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
                  : 'border-white/[0.04] bg-black/20 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-gold bg-gold'
                      : 'border-neutral-600 bg-transparent'
                  }`}
                >
                  {isSelected && <div className="h-2 w-2 rounded-full bg-black" />}
                </div>

                <div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    <span>{opcion.label}</span>
                    {!opcion.disponible && (
                      <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                        Agotado
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400">{opcion.sublabel}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-serif text-base font-bold text-white">
                  {formatPriceARS(opcion.precio)}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Price Summary Banner */}
      <div className="mt-6 flex items-baseline justify-between border-t border-white/[0.08] pt-4">
        <div>
          <span className="text-xs text-neutral-400 block">Total a coordinar:</span>
          <span className="text-xs text-gold-light font-medium">
            {opcionSeleccionada.label}
          </span>
        </div>
        <div className="font-serif text-3xl font-bold text-white">
          {formatPriceARS(opcionSeleccionada.precio)}
        </div>
      </div>

      {/* Action Buttons: Add to Cart & Direct WhatsApp */}
      <div className="mt-6 space-y-3">
        {esDisponible ? (
          <>
            {/* Button 1: Agregar al carrito */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gold/40 bg-gold/10 py-3.5 text-sm font-semibold text-gold-light transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black hover:shadow-gold-glow active:scale-[0.99]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Agregar al carrito</span>
            </button>

            {/* Button 2: Pedir este formato directo por WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-gold via-gold-mid to-gold-light py-3.5 text-sm font-bold text-black shadow-gold-glow transition-all duration-300 hover:opacity-95 active:scale-[0.99]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
              </svg>
              <span>Pedir este formato por WhatsApp</span>
            </a>
          </>
        ) : (
          <button
            disabled
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-4 text-center text-sm font-medium text-neutral-500 cursor-not-allowed"
          >
            Formato no disponible temporalmente
          </button>
        )}
      </div>

      {/* Trust micro-banner */}
      <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-neutral-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span>Respuesta inmediata y asesoramiento personalizado</span>
      </div>
    </div>
  )
}
