'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Vaper } from '@/features/catalog/types'
import { uploadProductImage, saveVaper } from '@/features/catalog/services/adminProducts'
import { getUniqueSlug } from '@/features/catalog/utils/slug'
import { VaperCard } from '@/features/catalog/components/VaperCard'
import { ImageUploader } from './ImageUploader'

interface VaperFormProps {
  initialVaper?: Vaper | null
  isDuplicate?: boolean
}

export function VaperForm({ initialVaper, isDuplicate = false }: VaperFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [nombre, setNombre] = useState(initialVaper?.nombre || '')
  const [marca, setMarca] = useState(initialVaper?.marca || '')
  const [sabor, setSabor] = useState(initialVaper?.sabor || '')
  const [puffs, setPuffs] = useState<number | string>(initialVaper?.puffs ?? 10000)
  const [precio, setPrecio] = useState<number | string>(initialVaper?.precio ?? 25000)
  const [disponible, setDisponible] = useState<boolean>(
    initialVaper ? initialVaper.disponible : true
  )
  const [destacado, setDestacado] = useState<boolean>(
    initialVaper ? initialVaper.destacado : false
  )
  const [imagenUrl, setImagenUrl] = useState(initialVaper?.imagen_url || '')
  const [generatedSlug, setGeneratedSlug] = useState(
    isDuplicate ? '' : initialVaper?.slug || ''
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Auto-slug generation
  useEffect(() => {
    let active = true
    if (nombre.trim()) {
      const excludeId = isDuplicate ? undefined : initialVaper?.id
      getUniqueSlug(nombre, 'vapers', excludeId).then((slug) => {
        if (active) setGeneratedSlug(slug)
      })
    }
    return () => {
      active = false
    }
  }, [nombre, isDuplicate, initialVaper?.id])

  function validate(): boolean {
    setErrorMessage(null)
    if (!nombre.trim()) {
      setErrorMessage('El nombre del vaper es obligatorio.')
      return false
    }
    if (!marca.trim()) {
      setErrorMessage('La marca es obligatoria (ej: ElfBar, GeekBar, OXBAR).')
      return false
    }
    if (!sabor.trim()) {
      setErrorMessage('El sabor es obligatorio (ej: Watermelon Ice, Blue Razz).')
      return false
    }
    if (!puffs || Number(puffs) <= 0) {
      setErrorMessage('Ingresá la cantidad estimada de puffs (ej: 10000).')
      return false
    }
    if (!precio || Number(precio) <= 0) {
      setErrorMessage('Ingresá un precio válido en pesos argentinos.')
      return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setErrorMessage(null)
    startTransition(async () => {
      try {
        const excludeId = isDuplicate ? undefined : initialVaper?.id
        const finalSlug = await getUniqueSlug(nombre, 'vapers', excludeId)

        const payload = {
          nombre: nombre.trim(),
          marca: marca.trim(),
          sabor: sabor.trim(),
          puffs: Number(puffs),
          precio: Number(precio),
          disponible: Boolean(disponible),
          destacado: Boolean(destacado),
          slug: finalSlug,
          imagen_url:
            imagenUrl.trim() ||
            'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop',
        }

        const editId = isDuplicate ? undefined : initialVaper?.id
        const res = await saveVaper(payload, editId)

        if (!res.success) {
          setErrorMessage(res.error || 'Error al guardar el vaper.')
          return
        }

        router.push('/admin/vapers')
        router.refresh()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error inesperado al guardar el vaper'
        setErrorMessage(msg)
      }
    })
  }

  // Mock object for live card preview
  const previewVaper: Vaper = {
    id: initialVaper?.id || 'preview-vaper',
    slug: generatedSlug || 'vaper-preview',
    nombre: nombre || 'Modelo / Pod Descartable',
    marca: marca || 'Marca Vaper',
    sabor: sabor || 'Sabor Fresco Ice',
    puffs: Number(puffs) || 10000,
    precio: Number(precio) || 25000,
    disponible: Boolean(disponible),
    destacado: Boolean(destacado),
    imagen_url:
      imagenUrl ||
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/admin/vapers" className="hover:text-gold-light transition-colors">
              ← Volver al listado
            </Link>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
            {isDuplicate
              ? `Duplicar: ${initialVaper?.nombre}`
              : initialVaper
              ? `Editar: ${initialVaper.nombre}`
              : 'Cargar Nuevo Vaper'}
          </h1>
          <p className="text-xs text-neutral-400">
            Formulario simple para dar de alta o actualizar modelos de vapers y pods
          </p>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-3">
          <svg className="h-5 w-5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Card Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 rounded-3xl border border-white/[0.08] bg-dark-card p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Nombre del producto <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Lost Mary BM600, ElfBar BC10000"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Marca <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                required
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ej: ElfBar, GeekBar, OXBAR"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Sabor <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={sabor}
              onChange={(e) => setSabor(e.target.value)}
              placeholder="Ej: Watermelon Ice, Miami Mint, Blue Razz Ice"
              className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Cantidad de Puffs <span className="text-gold">*</span>
              </label>
              <input
                type="number"
                min="500"
                step="500"
                required
                value={puffs}
                onChange={(e) => setPuffs(e.target.value)}
                placeholder="10000"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Precio (ARS $) <span className="text-gold">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="25000"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
          </div>

          {/* Switches for availability & featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/30 cursor-pointer select-none">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Disponibilidad de stock
                </span>
                <span className="text-[11px] text-neutral-400">
                  {disponible ? 'Activo para comprar' : 'Marcado como Agotado'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={disponible}
                onChange={(e) => setDisponible(e.target.checked)}
                className="h-5 w-5 rounded border-neutral-700 bg-neutral-900 text-gold accent-gold"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/30 cursor-pointer select-none">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Producto Destacado
                </span>
                <span className="text-[11px] text-neutral-400">
                  Aparece primero en el catálogo
                </span>
              </div>
              <input
                type="checkbox"
                checked={destacado}
                onChange={(e) => setDestacado(e.target.checked)}
                className="h-5 w-5 rounded border-neutral-700 bg-neutral-900 text-gold accent-gold"
              />
            </label>
          </div>

          {/* Image Upload Area with browser optimization */}
          <div className="pt-2 border-t border-white/[0.08]">
            <ImageUploader
              currentImageUrl={imagenUrl}
              onImageUploaded={(url) => {
                setImagenUrl(url)
                setErrorMessage(null)
              }}
              label="Imagen del Vaper (Optimización WebP)"
              description="Comprime automáticamente a WebP de alta fidelidad (máx. 1200px) en el navegador."
            />
          </div>

          {/* Auto Slug Indicator */}
          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              URL Slug generada:
            </span>
            <span className="font-mono text-gold-light">/vapers/{generatedSlug || 'nombre-del-vaper'}</span>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-between gap-4 border-t border-white/[0.08]">
            <Link
              href="/admin/vapers"
              className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-all"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold via-gold-mid to-gold-light px-7 py-3 text-xs font-bold text-black shadow-gold-glow transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>
                  {initialVaper && !isDuplicate ? 'Guardar Cambios' : 'Publicar Vaper ✦'}
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Live Card Preview Column */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-gold/30 bg-black/60 p-4 space-y-3 sticky top-24">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gold-light flex items-center gap-1.5">
                <span>✦</span>
                <span>Preview en vivo</span>
              </span>
              <span className="text-[10px] text-neutral-400 uppercase">En el catálogo público</span>
            </div>

            <div className="max-w-sm mx-auto">
              <VaperCard vaper={previewVaper} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
