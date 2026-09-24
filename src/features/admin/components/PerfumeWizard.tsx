'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  type Perfume,
  type FamiliaOlfativa,
  type GeneroFragancia,
  FAMILIAS_OLFATIVAS,
  GENEROS_FRAGANCIA,
  OPCIONES_DURACION,
  OPCIONES_PROYECCION,
  OPCIONES_OCASION,
} from '@/features/catalog/types'
import { uploadProductImage, savePerfume } from '@/features/catalog/services/adminProducts'
import { getUniqueSlug } from '@/features/catalog/utils/slug'
import { PerfumeCard } from '@/features/catalog/components/PerfumeCard'

interface PerfumeWizardProps {
  initialPerfume?: Perfume | null
  isDuplicate?: boolean
}

export function PerfumeWizard({ initialPerfume, isDuplicate = false }: PerfumeWizardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Wizard Step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Datos básicos
  const [nombre, setNombre] = useState(initialPerfume?.nombre || '')
  const [marca, setMarca] = useState(initialPerfume?.marca || '')
  const [descripcion, setDescripcion] = useState(initialPerfume?.descripcion || '')
  const [genero, setGenero] = useState<GeneroFragancia>(initialPerfume?.genero || 'unisex')
  const [familiaOlfativa, setFamiliaOlfativa] = useState<FamiliaOlfativa>(
    initialPerfume?.familia_olfativa || 'oriental'
  )
  const [tamanoOriginalMl, setTamanoOriginalMl] = useState<number>(
    initialPerfume?.tamano_original_ml || 100
  )

  // Step 2: Pirámide olfativa y rendimiento
  const [notasSalida, setNotasSalida] = useState(initialPerfume?.notas_salida || '')
  const [notasCorazon, setNotasCorazon] = useState(initialPerfume?.notas_corazon || '')
  const [notasFondo, setNotasFondo] = useState(initialPerfume?.notas_fondo || '')
  const [duracion, setDuracion] = useState(initialPerfume?.duracion || OPCIONES_DURACION[1])
  const [proyeccion, setProyeccion] = useState(initialPerfume?.proyeccion || OPCIONES_PROYECCION[1])
  const [ocasion, setOcasion] = useState(initialPerfume?.ocasion || OPCIONES_OCASION[0])

  // Step 3: Precios y disponibilidad
  const [precioDecant5ml, setPrecioDecant5ml] = useState<number | string>(
    initialPerfume?.precio_decant_5ml ?? 18000
  )
  const [disponibleDecant5ml, setDisponibleDecant5ml] = useState<boolean>(
    initialPerfume ? initialPerfume.disponible_decant_5ml : true
  )

  const [precioDecant10ml, setPrecioDecant10ml] = useState<number | string>(
    initialPerfume?.precio_decant_10ml ?? 34000
  )
  const [disponibleDecant10ml, setDisponibleDecant10ml] = useState<boolean>(
    initialPerfume ? initialPerfume.disponible_decant_10ml : true
  )

  const [precioFrascoCompleto, setPrecioFrascoCompleto] = useState<number | string>(
    initialPerfume?.precio_frasco_completo ?? 390000
  )
  const [disponibleFrascoCompleto, setDisponibleFrascoCompleto] = useState<boolean>(
    initialPerfume ? initialPerfume.disponible_frasco_completo : false
  )

  const [disponibleGeneral, setDisponibleGeneral] = useState<boolean>(
    initialPerfume ? initialPerfume.disponible : true
  )
  const [destacado, setDestacado] = useState<boolean>(
    initialPerfume ? initialPerfume.destacado : false
  )

  // Step 4: Imagen y publicar
  const [imagenUrl, setImagenUrl] = useState(initialPerfume?.imagen_url || '')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [generatedSlug, setGeneratedSlug] = useState(
    isDuplicate ? '' : initialPerfume?.slug || ''
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Update slug automatically when name changes
  useEffect(() => {
    let active = true
    if (nombre.trim()) {
      const excludeId = isDuplicate ? undefined : initialPerfume?.id
      getUniqueSlug(nombre, 'perfumes', excludeId).then((slug) => {
        if (active) setGeneratedSlug(slug)
      })
    }
    return () => {
      active = false
    }
  }, [nombre, isDuplicate, initialPerfume?.id])

  // Handle image file upload to Supabase Storage
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      setErrorMessage(null)
      const publicUrl = await uploadProductImage(file)
      setImagenUrl(publicUrl)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la imagen'
      setErrorMessage(msg)
    } finally {
      setUploadingImage(false)
    }
  }

  // Step validation
  function validateStep(step: number): boolean {
    setErrorMessage(null)
    if (step === 1) {
      if (!nombre.trim()) {
        setErrorMessage('El nombre del perfume es obligatorio.')
        return false
      }
      if (!marca.trim()) {
        setErrorMessage('La marca del perfume es obligatoria.')
        return false
      }
      if (!descripcion.trim()) {
        setErrorMessage('Por favor ingresá una descripción corta.')
        return false
      }
      if (!tamanoOriginalMl || tamanoOriginalMl <= 0) {
        setErrorMessage('Ingresá el tamaño del frasco original en ml (ej: 100).')
        return false
      }
    }
    if (step === 3) {
      // Validate that enabled formats have positive prices
      if (disponibleDecant5ml && (!precioDecant5ml || Number(precioDecant5ml) <= 0)) {
        setErrorMessage('El Decant 5ml está marcado como disponible pero no tiene un precio válido.')
        return false
      }
      if (disponibleDecant10ml && (!precioDecant10ml || Number(precioDecant10ml) <= 0)) {
        setErrorMessage('El Decant 10ml está marcado como disponible pero no tiene un precio válido.')
        return false
      }
      if (disponibleFrascoCompleto && (!precioFrascoCompleto || Number(precioFrascoCompleto) <= 0)) {
        setErrorMessage('El frasco sellado está marcado como disponible pero no tiene un precio válido.')
        return false
      }
    }
    if (step === 4) {
      if (!imagenUrl.trim()) {
        setErrorMessage('Por favor subí una imagen o pegá un enlace de imagen.')
        return false
      }
    }
    return true
  }

  function handleNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  function handleBack() {
    setErrorMessage(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Form submission
  async function handleSubmit() {
    if (!validateStep(4)) return

    setErrorMessage(null)
    startTransition(async () => {
      try {
        const excludeId = isDuplicate ? undefined : initialPerfume?.id
        const finalSlug = await getUniqueSlug(nombre, 'perfumes', excludeId)

        const payload = {
          nombre: nombre.trim(),
          marca: marca.trim(),
          descripcion: descripcion.trim(),
          slug: finalSlug,
          familia_olfativa: familiaOlfativa,
          genero: genero,
          tamano_original_ml: Number(tamanoOriginalMl),
          notas_salida: notasSalida.trim() || 'Notas seleccionadas de salida',
          notas_corazon: notasCorazon.trim() || 'Notas seleccionadas de corazón',
          notas_fondo: notasFondo.trim() || 'Notas seleccionadas de fondo',
          duracion: duracion,
          proyeccion: proyeccion,
          ocasion: ocasion,
          precio_decant_5ml: precioDecant5ml ? Number(precioDecant5ml) : null,
          disponible_decant_5ml: Boolean(disponibleDecant5ml),
          precio_decant_10ml: precioDecant10ml ? Number(precioDecant10ml) : null,
          disponible_decant_10ml: Boolean(disponibleDecant10ml),
          precio_frasco_completo: precioFrascoCompleto ? Number(precioFrascoCompleto) : null,
          disponible_frasco_completo: Boolean(disponibleFrascoCompleto),
          disponible: Boolean(disponibleGeneral),
          destacado: Boolean(destacado),
          imagen_url: imagenUrl.trim(),
        }

        const editId = isDuplicate ? undefined : initialPerfume?.id
        const res = await savePerfume(payload, editId)

        if (!res.success) {
          setErrorMessage(res.error || 'Ocurrió un error al guardar el perfume.')
          return
        }

        router.push('/admin/perfumes')
        router.refresh()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error inesperado al guardar el perfume'
        setErrorMessage(msg)
      }
    })
  }

  // Mock perfume object for live catalog card preview
  const previewPerfume: Perfume = {
    id: initialPerfume?.id || 'preview-id',
    slug: generatedSlug || 'fragancia',
    nombre: nombre || 'Nombre del Perfume',
    marca: marca || 'Marca',
    descripcion: descripcion || 'Descripción breve del perfume en el catálogo...',
    familia_olfativa: familiaOlfativa,
    genero: genero,
    tamano_original_ml: Number(tamanoOriginalMl) || 100,
    notas_salida: notasSalida,
    notas_corazon: notasCorazon,
    notas_fondo: notasFondo,
    duracion: duracion,
    proyeccion: proyeccion,
    ocasion: ocasion,
    precio_decant_5ml: precioDecant5ml ? Number(precioDecant5ml) : null,
    disponible_decant_5ml: Boolean(disponibleDecant5ml),
    precio_decant_10ml: precioDecant10ml ? Number(precioDecant10ml) : null,
    disponible_decant_10ml: Boolean(disponibleDecant10ml),
    precio_frasco_completo: precioFrascoCompleto ? Number(precioFrascoCompleto) : null,
    disponible_frasco_completo: Boolean(disponibleFrascoCompleto),
    disponible: Boolean(disponibleGeneral),
    destacado: Boolean(destacado),
    imagen_url:
      imagenUrl ||
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  }

  const STEPS = [
    { num: 1, title: 'Datos básicos', short: 'Básicos' },
    { num: 2, title: 'Pirámide olfativa', short: 'Pirámide' },
    { num: 3, title: 'Precios y stock', short: 'Precios' },
    { num: 4, title: 'Imagen y publicar', short: 'Publicar' },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Title and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/admin/perfumes" className="hover:text-gold-light transition-colors">
              ← Volver al listado
            </Link>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
            {isDuplicate
              ? `Duplicar: ${initialPerfume?.nombre}`
              : initialPerfume
              ? `Editar: ${initialPerfume.nombre}`
              : 'Cargar Nuevo Perfume'}
          </h1>
          <p className="text-xs text-neutral-400">
            Completá los 4 pasos del wizard para gestionar la ficha del perfume
          </p>
        </div>

        {/* Step indicator pill */}
        <div className="rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold text-gold-light w-fit">
          Paso {currentStep} de 4: {STEPS[currentStep - 1].title}
        </div>
      </div>

      {/* Wizard Progress Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-4 sm:p-5">
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.num
            const isCurrent = currentStep === s.num
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num)
                }}
                disabled={s.num > currentStep}
                className={`flex flex-col items-center sm:items-start text-left transition-all ${
                  isCurrent
                    ? 'text-gold-light font-bold'
                    : isCompleted
                    ? 'text-neutral-300 hover:text-white cursor-pointer'
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-gold text-black shadow-gold-glow'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/[0.04] text-neutral-500 border border-white/10'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </span>
                  <div className="hidden sm:block flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isCompleted ? 'bg-emerald-500 w-full' : isCurrent ? 'bg-gold w-1/2' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
                <span className="mt-2 text-[11px] sm:text-xs tracking-tight line-clamp-1">
                  <span className="sm:hidden">{s.short}</span>
                  <span className="hidden sm:inline">{s.title}</span>
                </span>
              </button>
            )
          })}
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

      {/* Step Container */}
      <div className="rounded-3xl border border-white/[0.08] bg-dark-card p-6 sm:p-8 shadow-2xl">
        {/* ================= STEP 1: DATOS BÁSICOS ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="font-serif text-lg font-semibold text-white">
                Paso 1: Datos Básicos del Perfume
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Información principal visible en el catálogo y cabecera del producto
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Nombre del perfume <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Aventus, Baccarat Rouge 540"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Marca / Casa perfumista <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  placeholder="Ej: Creed, Tom Ford, MFK"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Descripción corta <span className="text-gold">*</span>
              </label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve reseña editorial que se mostrará en la tarjeta del catálogo y en la ficha..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Género dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Género <span className="text-gold">*</span>
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value as GeneroFragancia)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                >
                  {GENEROS_FRAGANCIA.map((g) => (
                    <option key={g.id} value={g.id} className="bg-neutral-900 text-white">
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Familia olfativa dropdown (las 8 opciones del catálogo público) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Familia olfativa <span className="text-gold">*</span>
                </label>
                <select
                  value={familiaOlfativa}
                  onChange={(e) => setFamiliaOlfativa(e.target.value as FamiliaOlfativa)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                >
                  {FAMILIAS_OLFATIVAS.map((f) => (
                    <option key={f.id} value={f.id} className="bg-neutral-900 text-white">
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tamaño del frasco original */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Frasco original (ml) <span className="text-gold">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={tamanoOriginalMl}
                  onChange={(e) => setTamanoOriginalMl(Number(e.target.value))}
                  placeholder="100"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PIRÁMIDE OLFATIVA ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="font-serif text-lg font-semibold text-white">
                Paso 2: Pirámide Olfativa y Rendimiento
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Detalles sensoriales para la ficha técnica del perfume
              </p>
            </div>

            {/* Note banner: optional fields */}
            <div className="rounded-xl border border-gold/30 bg-gold/5 p-3 text-xs text-gold-light flex items-center gap-2">
              <span className="font-bold">✦ Nota:</span>
              <span>Las notas son opcionales y las podés completar o editar en cualquier momento posterior.</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Notas de Salida (Primeros 15 min)
                  </label>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Opcional</span>
                </div>
                <input
                  type="text"
                  value={notasSalida}
                  onChange={(e) => setNotasSalida(e.target.value)}
                  placeholder="Bergamota, Pomelo, Pimienta rosa"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Notas de Corazón (Cuerpo de la fragancia)
                  </label>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Opcional</span>
                </div>
                <input
                  type="text"
                  value={notasCorazon}
                  onChange={(e) => setNotasCorazon(e.target.value)}
                  placeholder="Lavanda, Cardamomo, Jazmín marroquí"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Notas de Fondo (Fijación y estela final)
                  </label>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Opcional</span>
                </div>
                <input
                  type="text"
                  value={notasFondo}
                  onChange={(e) => setNotasFondo(e.target.value)}
                  placeholder="Cedro, Ámbar gris, Vainilla suave, Almizcle"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              {/* Duración */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Duración estimada
                </label>
                <select
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                >
                  {OPCIONES_DURACION.map((opt) => (
                    <option key={opt} value={opt} className="bg-neutral-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proyección */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Proyección / Estela
                </label>
                <select
                  value={proyeccion}
                  onChange={(e) => setProyeccion(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                >
                  {OPCIONES_PROYECCION.map((opt) => (
                    <option key={opt} value={opt} className="bg-neutral-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ocasión ideal */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Ocasión ideal
                </label>
                <select
                  value={ocasion}
                  onChange={(e) => setOcasion(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                >
                  {OPCIONES_OCASION.map((opt) => (
                    <option key={opt} value={opt} className="bg-neutral-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PRECIOS Y DISPONIBILIDAD ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="font-serif text-lg font-semibold text-white">
                Paso 3: Precios y Disponibilidad por Formato
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Configurá de forma independiente los tres formatos de venta
              </p>
            </div>

            <div className="space-y-4">
              {/* Bloque 1: Decant 5ml */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">Decant 5ml</span>
                    <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-light uppercase">
                      Formato Entrada
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Aproximadamente 70-80 atomizaciones en perfumero de vidrio
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                      Precio (ARS $)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={precioDecant5ml}
                      onChange={(e) => setPrecioDecant5ml(e.target.value)}
                      placeholder="18000"
                      className="w-36 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={disponibleDecant5ml}
                        onChange={(e) => setDisponibleDecant5ml(e.target.checked)}
                        className="h-5 w-5 rounded border-neutral-700 bg-neutral-900 text-gold focus:ring-gold accent-gold"
                      />
                      <span
                        className={`text-xs font-semibold ${
                          disponibleDecant5ml ? 'text-emerald-400' : 'text-neutral-500'
                        }`}
                      >
                        {disponibleDecant5ml ? 'Disponible' : 'Agotado'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Decant 10ml */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">Decant 10ml</span>
                    <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-light uppercase">
                      Más Popular
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Aproximadamente 150 atomizaciones para uso extendido
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                      Precio (ARS $)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={precioDecant10ml}
                      onChange={(e) => setPrecioDecant10ml(e.target.value)}
                      placeholder="34000"
                      className="w-36 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={disponibleDecant10ml}
                        onChange={(e) => setDisponibleDecant10ml(e.target.checked)}
                        className="h-5 w-5 rounded border-neutral-700 bg-neutral-900 text-gold focus:ring-gold accent-gold"
                      />
                      <span
                        className={`text-xs font-semibold ${
                          disponibleDecant10ml ? 'text-emerald-400' : 'text-neutral-500'
                        }`}
                      >
                        {disponibleDecant10ml ? 'Disponible' : 'Agotado'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bloque 3: Frasco Sellado */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">
                      Frasco Sellado ({tamanoOriginalMl}ml)
                    </span>
                    <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-300 uppercase">
                      Caja Sellada Original
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Botella original completa de fábrica con packaging intacto
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                      Precio (ARS $)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={precioFrascoCompleto}
                      onChange={(e) => setPrecioFrascoCompleto(e.target.value)}
                      placeholder="390000"
                      className="w-36 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={disponibleFrascoCompleto}
                        onChange={(e) => setDisponibleFrascoCompleto(e.target.checked)}
                        className="h-5 w-5 rounded border-neutral-700 bg-neutral-900 text-gold focus:ring-gold accent-gold"
                      />
                      <span
                        className={`text-xs font-semibold ${
                          disponibleFrascoCompleto ? 'text-emerald-400' : 'text-neutral-500'
                        }`}
                      >
                        {disponibleFrascoCompleto ? 'Disponible' : 'Agotado'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* General switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
              <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/30 cursor-pointer select-none">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Visibilidad general en catálogo
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Si se desactiva, el perfume queda pausado
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={disponibleGeneral}
                  onChange={(e) => setDisponibleGeneral(e.target.checked)}
                  className="h-5 w-5 rounded border-neutral-700 bg-neutral-900 text-gold accent-gold"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/30 cursor-pointer select-none">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Producto Destacado
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Aparece al inicio del catálogo con prioridad
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
          </div>
        )}

        {/* ================= STEP 4: IMAGEN Y PUBLICAR ================= */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="font-serif text-lg font-semibold text-white">
                Paso 4: Imagen y Vista Previa en Vivo
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Cargá la imagen y verificá cómo quedará la tarjeta en el catálogo antes de guardar
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Image upload & Slug info */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Subir foto del perfume (Supabase Storage)
                  </label>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 rounded-2xl bg-black/40 hover:border-gold/50 cursor-pointer transition-colors group">
                      <svg className="h-8 w-8 text-neutral-400 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="mt-2 text-xs font-semibold text-white">
                        {uploadingImage ? 'Subiendo imagen...' : 'Seleccionar desde tu celular o PC'}
                      </span>
                      <span className="text-[10px] text-neutral-500 mt-1">
                        JPG, PNG, WebP hasta 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Alternative Direct URL input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    O pegar URL directa de la imagen
                  </label>
                  <input
                    type="url"
                    value={imagenUrl}
                    onChange={(e) => setImagenUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                  />
                </div>

                {/* Generated Slug Indicator */}
                <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    URL Slug generada automáticamente:
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-gold-light">
                    <span>/perfumes/</span>
                    <strong className="underline underline-offset-2">
                      {generatedSlug || 'nombre-del-perfume'}
                    </strong>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Validada para que no se duplique con ningún otro producto existente.
                  </p>
                </div>
              </div>

              {/* Right Column: Live Card Preview */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-gold/30 bg-black/60 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gold-light flex items-center gap-1.5">
                      <span>✦</span>
                      <span>Preview en vivo del catálogo</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase">Exactamente cómo se verá</span>
                  </div>

                  <div className="max-w-sm mx-auto">
                    <PerfumeCard perfume={previewPerfume} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-50"
            >
              ← Anterior
            </button>
          ) : (
            <Link
              href="/admin/perfumes"
              className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-all"
            >
              Cancelar
            </Link>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-gold px-6 py-2.5 text-xs font-bold text-black transition-all hover:shadow-gold-glow active:scale-95"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || uploadingImage}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold via-gold-mid to-gold-light px-7 py-3 text-xs font-bold text-black shadow-gold-glow transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Guardando producto...</span>
                </>
              ) : (
                <span>
                  {initialPerfume && !isDuplicate ? 'Guardar Cambios' : 'Publicar Perfume ✦'}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
