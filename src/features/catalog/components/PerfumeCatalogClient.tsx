'use client'

import { useState, useMemo } from 'react'
import type { Perfume, FamiliaOlfativa, GeneroFragancia } from '../types'
import { PerfumeCard } from './PerfumeCard'

interface PerfumeCatalogClientProps {
  initialPerfumes: Perfume[]
}

const FAMILIAS: { id: string; label: string }[] = [
  { id: 'todas', label: 'Todas las familias' },
  { id: 'oriental', label: 'Oriental' },
  { id: 'amaderado', label: 'Amaderado' },
  { id: 'dulce', label: 'Dulce / Gourmand' },
  { id: 'especiado', label: 'Especiado' },
  { id: 'acuatico', label: 'Acuático' },
  { id: 'citrico', label: 'Cítrico' },
  { id: 'floral', label: 'Floral' },
  { id: 'aromatico', label: 'Aromático' },
]

const GENEROS: { id: string; label: string }[] = [
  { id: 'todos', label: 'Todos los géneros' },
  { id: 'unisex', label: 'Unisex' },
  { id: 'masculino', label: 'Masculino' },
  { id: 'femenino', label: 'Femenino' },
]

export function PerfumeCatalogClient({ initialPerfumes }: PerfumeCatalogClientProps) {
  const [busqueda, setBusqueda] = useState('')
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState('todas')
  const [generoSeleccionado, setGeneroSeleccionado] = useState('todos')
  const [soloDisponibles, setSoloDisponibles] = useState(false)

  const perfumesFiltrados = useMemo(() => {
    return initialPerfumes.filter((p) => {
      // Búsqueda por texto
      if (busqueda.trim() !== '') {
        const query = busqueda.toLowerCase().trim()
        const matchNombre = p.nombre.toLowerCase().includes(query)
        const matchMarca = p.marca.toLowerCase().includes(query)
        const matchDesc = p.descripcion.toLowerCase().includes(query)
        const matchNotas =
          p.notas_salida.toLowerCase().includes(query) ||
          p.notas_corazon.toLowerCase().includes(query) ||
          p.notas_fondo.toLowerCase().includes(query)

        if (!matchNombre && !matchMarca && !matchDesc && !matchNotas) {
          return false
        }
      }

      // Filtro por familia
      if (familiaSeleccionada !== 'todas' && p.familia_olfativa !== familiaSeleccionada) {
        return false
      }

      // Filtro por género
      if (generoSeleccionado !== 'todos' && p.genero !== generoSeleccionado) {
        return false
      }

      // Filtro por disponibilidad
      if (soloDisponibles && !p.disponible) {
        return false
      }

      return true
    })
  }, [initialPerfumes, busqueda, familiaSeleccionada, generoSeleccionado, soloDisponibles])

  const hayFiltrosActivos =
    busqueda !== '' ||
    familiaSeleccionada !== 'todas' ||
    generoSeleccionado !== 'todos' ||
    soloDisponibles

  const limpiarFiltros = () => {
    setBusqueda('')
    setFamiliaSeleccionada('todas')
    setGeneroSeleccionado('todos')
    setSoloDisponibles(false)
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar Controls */}
      <div className="rounded-2xl border border-white/[0.08] bg-dark-surface/80 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar perfume, marca (Creed, Tom Ford...) o notas..."
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

          {/* Availability Toggle */}
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

        {/* Gender Filter Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mr-1 shrink-0">
            Género:
          </span>
          {GENEROS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGeneroSeleccionado(g.id)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all shrink-0 ${
                generoSeleccionado === g.id
                  ? 'bg-gold text-black font-semibold shadow-gold-glow'
                  : 'bg-white/[0.04] text-neutral-400 hover:bg-white/[0.08] hover:text-white border border-white/5'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Olfactory Families Horizontal Pills */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mr-1 shrink-0">
            Familia:
          </span>
          {FAMILIAS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFamiliaSeleccionada(f.id)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all shrink-0 ${
                familiaSeleccionada === f.id
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/[0.04] text-neutral-400 hover:bg-white/[0.08] hover:text-white border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filter Summary & Reset */}
        {hayFiltrosActivos && (
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-neutral-400">
            <span>
              Mostrando <strong className="text-white">{perfumesFiltrados.length}</strong> de{' '}
              {initialPerfumes.length} fragancias
            </span>
            <button
              onClick={limpiarFiltros}
              className="text-gold-light hover:underline font-medium"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Catalog Grid */}
      {perfumesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {perfumesFiltrados.map((perfume) => (
            <PerfumeCard
              key={perfume.id}
              perfume={perfume}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-dark-card p-12 text-center">
          <div className="rounded-full bg-white/[0.05] p-4 text-neutral-400">
            <svg className="h-8 w-8 stroke-current" fill="none" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-lg font-semibold text-white">
            No se encontraron fragancias
          </h3>
          <p className="mt-1 text-xs text-neutral-400">
            Probá ajustando la búsqueda o los filtros seleccionados.
          </p>
          <button
            onClick={limpiarFiltros}
            className="mt-5 rounded-full bg-gold px-5 py-2 text-xs font-semibold text-black transition-all hover:shadow-gold-glow"
          >
            Ver todos los perfumes
          </button>
        </div>
      )}
    </div>
  )
}
