import Image from 'next/image'
import type { Vaper } from '../types'
import { formatPriceARS, buildWhatsAppLink, buildVaperOrderMessage } from '../utils/whatsapp'

interface VaperCardProps {
  vaper: Vaper
}

export function VaperCard({ vaper }: VaperCardProps) {
  const waUrl = buildWhatsAppLink(
    buildVaperOrderMessage({
      nombre: vaper.nombre,
      marca: vaper.marca,
      sabor: vaper.sabor,
      puffs: vaper.puffs,
      precio: vaper.precio,
    })
  )

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-dark-card transition-all duration-300 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
      {/* Product Image */}
      <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
        <Image
          src={vaper.imagen_url || '/images/vaper-placeholder.svg'}
          alt={`${vaper.marca} - ${vaper.nombre}`}
          fill
          unoptimized={Boolean(vaper.imagen_url?.endsWith('.svg'))}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-85" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="rounded-full border border-gold/30 bg-black/75 px-3 py-1 text-xs font-bold text-gold-light backdrop-blur-md">
            ⚡ {vaper.puffs.toLocaleString('es-AR')} Puffs
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider backdrop-blur-md ${
              vaper.disponible
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}
          >
            {vaper.disponible ? 'Disponible' : 'Agotado'}
          </span>
        </div>

        {/* Brand Label */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-neutral-300 border border-white/10">
            {vaper.marca}
          </span>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-white group-hover:text-gold-light transition-colors">
            {vaper.nombre}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="text-gold-mid font-medium">Sabor:</span>
            <span className="text-neutral-200 font-medium">{vaper.sabor}</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-white/[0.06] pt-3">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Precio</span>
            <span className="font-serif text-xl font-bold text-white">
              {formatPriceARS(vaper.precio)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4">
          {vaper.disponible ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold via-gold-mid to-gold-light py-2.5 text-xs font-semibold text-black transition-all duration-300 hover:shadow-gold-glow hover:opacity-95"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
              </svg>
              <span>Pedir por WhatsApp</span>
            </a>
          ) : (
            <button
              disabled
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-center text-xs font-medium text-neutral-500 cursor-not-allowed"
            >
              Sin stock temporalmente
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
