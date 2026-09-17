'use client'

import { useState, useMemo } from 'react'
import type { Vaper } from '../types'
import { VaperCard } from './VaperCard'

interface VaperCatalogClientProps {
  initialVapers: Vaper[]
}

export function VaperCatalogClient({ initialVapers }: VaperCatalogClientProps) {
  const [busqueda, setBusqueda] = useState('')
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas')
  const [soloDisponibles, setSoloDisponibles] = useState(false)

  // Extract distinct brands from list
  const marcasDisponibles = useMemo(() => {
    const brands = Array.from(new Set(initialVapers.map((v) => v.marca)))
    return ['todas', ...brands]
  }, [initialVapers])

  const vapersFiltrados = useMemo(() => {
    return initialVapers.filter((v) => {
      if (busqueda.trim() !== '') {
        const q = busqueda.toLowerCase().trim()
        const matchNombre = v.nombre.toLowerCase().includes(q)
        const matchMarca = v.marca.toLowerCase().includes(q)
        const matchSabor = v.sabor.toLowerCase().includes(q)
        if (!matchNombre && !matchMarca && !matchSabor) return false
      }

      if (marcaSeleccionada !== 'todas' && v.marca !== marcaSeleccionada) {
        return false
      }

      if (soloDisponibles && !v.disponible) {
        return false
      }

      return true
    })
  }, [initialVapers, busqueda, marcaSeleccionada, soloDisponibles])

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-dark-surface/80 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por sabor (Mango, Sandía, Menta...) o modelo..."
              className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
            />
            <svg
              className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3.5 top-3.5 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Stock Toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={soloDisponibles}
              onChange={(e) => setSoloDisponibles(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-gold focus:ring-gold accent-gold"
            />
            <span>Solo disponibles</span>
          </label>
        </div>

        {/* Brands Horizontal Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mr-1 shrink-0">
            Marca:
          </span>
          {marcasDisponibles.map((m) => (
            <button
              key={m}
              onClick={() => setMarcaSeleccionada(m)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all shrink-0 capitalize ${
                marcaSeleccionada === m
                  ? 'bg-gold text-black font-semibold shadow-gold-glow'
                  : 'bg-white/[0.04] text-neutral-400 hover:bg-white/[0.08] hover:text-white border border-white/5'
              }`}
            >
              {m === 'todas' ? 'Todas las marcas' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Vapers */}
      {vapersFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vapersFiltrados.map((vaper) => (
            <VaperCard key={vaper.id} vaper={vaper} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-dark-card p-12 text-center">
          <h3 className="font-serif text-lg font-semibold text-white">
            No encontramos vapers con esos filtros
          </h3>
          <p className="mt-1 text-xs text-neutral-400">
            Probá buscar otro sabor o cambiar de marca.
          </p>
          <button
            onClick={() => {
              setBusqueda('')
              setMarcaSeleccionada('todas')
              setSoloDisponibles(false)
            }}
            className="mt-5 rounded-full bg-gold px-5 py-2 text-xs font-semibold text-black transition-all hover:shadow-gold-glow"
          >
            Ver todos los vapers
          </button>
        </div>
      )}
    </div>
  )
}
