'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Perfume } from '@/features/catalog/types'
import { formatPriceARS } from '@/features/catalog/utils/whatsapp'
import { deletePerfume } from '@/features/catalog/services/adminProducts'
import { DeleteConfirmModal } from './DeleteConfirmModal'

interface AdminPerfumesClientProps {
  initialPerfumes: Perfume[]
}

export function AdminPerfumesClient({ initialPerfumes }: AdminPerfumesClientProps) {
  const [perfumes, setPerfumes] = useState<Perfume[]>(initialPerfumes)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDisponibilidad, setFilterDisponibilidad] = useState<'todos' | 'disponibles' | 'agotados'>('todos')

  // Delete modal state
  const [perfumeToDelete, setPerfumeToDelete] = useState<Perfume | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((p) => {
      // Search text match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim()
        const matchName = p.nombre.toLowerCase().includes(query)
        const matchBrand = p.marca.toLowerCase().includes(query)
        if (!matchName && !matchBrand) return false
      }

      // Filter availability
      if (filterDisponibilidad === 'disponibles' && !p.disponible) return false
      if (filterDisponibilidad === 'agotados' && p.disponible) return false

      return true
    })
  }, [perfumes, searchTerm, filterDisponibilidad])

  async function handleConfirmDelete() {
    if (!perfumeToDelete) return

    try {
      setIsDeleting(true)
      setDeleteError(null)
      const res = await deletePerfume(perfumeToDelete.id)

      if (!res.success) {
        setDeleteError(res.error || 'Error al eliminar el perfume.')
        return
      }

      // Remove from local list
      setPerfumes((prev) => prev.filter((p) => p.id !== perfumeToDelete.id))
      setPerfumeToDelete(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado'
      setDeleteError(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            Catálogo
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
            Perfumes ({perfumes.length})
          </h1>
          <p className="text-xs text-neutral-400">
            Gestioná el stock, precios y datos técnicos de todas las fragancias
          </p>
        </div>

        <Link
          href="/admin/perfumes/nuevo"
          className="flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-xs font-bold text-black transition-all hover:shadow-gold-glow hover:opacity-95 active:scale-95 shadow-md w-full sm:w-auto"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Cargar Perfume</span>
        </Link>
      </div>

      {deleteError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          {deleteError}
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o marca (ej. Creed, Aventus)..."
              className="w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
            />
            <svg
              className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Availability Filter Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
            <button
              type="button"
              onClick={() => setFilterDisponibilidad('todos')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterDisponibilidad === 'todos'
                  ? 'bg-gold text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterDisponibilidad('disponibles')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterDisponibilidad === 'disponibles'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Disponibles
            </button>
            <button
              type="button"
              onClick={() => setFilterDisponibilidad('agotados')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterDisponibilidad === 'agotados'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Agotados
            </button>
          </div>
        </div>
      </div>

      {/* List Container (Optimized for Mobile Touch & Desktop) */}
      <div className="space-y-3">
        {filteredPerfumes.map((perfume) => (
          <div
            key={perfume.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-dark-card p-4 transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
          >
            {/* Info Column */}
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                <Image
                  src={perfume.imagen_url || '/placeholder.png'}
                  alt={perfume.nombre}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-light">
                    {perfume.marca}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      perfume.disponible
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {perfume.disponible ? 'Disponible' : 'Agotado'}
                  </span>
                  {perfume.destacado && (
                    <span className="rounded-full bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 text-[9px] font-bold uppercase">
                      ★ Destacado
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-white truncate">
                  {perfume.nombre}
                </h3>

                {/* Formats mini summary */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                  <span className={perfume.disponible_decant_5ml ? 'text-neutral-200' : 'text-neutral-600 line-through'}>
                    5ml:{' '}
                    <strong>
                      {perfume.precio_decant_5ml ? formatPriceARS(perfume.precio_decant_5ml) : '—'}
                    </strong>
                  </span>
                  <span className="text-neutral-700">•</span>
                  <span className={perfume.disponible_decant_10ml ? 'text-neutral-200' : 'text-neutral-600 line-through'}>
                    10ml:{' '}
                    <strong>
                      {perfume.precio_decant_10ml ? formatPriceARS(perfume.precio_decant_10ml) : '—'}
                    </strong>
                  </span>
                  <span className="text-neutral-700">•</span>
                  <span className={perfume.disponible_frasco_completo ? 'text-neutral-200' : 'text-neutral-600 line-through'}>
                    Frasco ({perfume.tamano_original_ml}ml):{' '}
                    <strong>
                      {perfume.precio_frasco_completo
                        ? formatPriceARS(perfume.precio_frasco_completo)
                        : '—'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] shrink-0 justify-end">
              {/* Duplicar button */}
              <Link
                href={`/admin/perfumes/nuevo?duplicar=${perfume.id}`}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-neutral-300 hover:border-gold/40 hover:text-gold-light hover:bg-gold/5 transition-all"
                title="Duplicar este perfume con sus datos pre-cargados"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Duplicar</span>
              </Link>

              {/* Editar button */}
              <Link
                href={`/admin/perfumes/${perfume.id}/editar`}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-white hover:border-gold hover:text-gold-light hover:bg-gold/10 transition-all"
                title="Editar perfume"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editar</span>
              </Link>

              {/* Eliminar button */}
              <button
                type="button"
                onClick={() => setPerfumeToDelete(perfume)}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all"
                title="Eliminar perfume"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="sm:hidden">Borrar</span>
              </button>
            </div>
          </div>
        ))}

        {filteredPerfumes.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-12 text-center text-neutral-400">
            <p className="text-sm font-semibold text-white">No se encontraron perfumes</p>
            <p className="text-xs text-neutral-500 mt-1">
              Probá cambiando la búsqueda o agregá una nueva fragancia con el botón superior.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      <DeleteConfirmModal
        isOpen={Boolean(perfumeToDelete)}
        productName={perfumeToDelete?.nombre || ''}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPerfumeToDelete(null)}
      />
    </div>
  )
}
