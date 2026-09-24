'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  optimizeImageInBrowser,
  formatFileSize,
  type OptimizationResult,
} from '@/features/catalog/utils/imageOptimizer'
import { uploadProductImage } from '@/features/catalog/services/adminProducts'

interface ImageUploaderProps {
  currentImageUrl: string
  onImageUploaded: (url: string) => void
  label?: string
  description?: string
}

export function ImageUploader({
  currentImageUrl,
  onImageUploaded,
  label = 'Fotografía del Producto',
  description = 'Se optimizará a WebP (máx. 1200px) automáticamente en tu navegador.',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState<'idle' | 'optimizing' | 'uploading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastStats, setLastStats] = useState<OptimizationResult | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [directUrl, setDirectUrl] = useState(currentImageUrl || '')

  async function processAndUpload(file: File) {
    setPendingFile(file)
    setErrorMessage(null)

    try {
      // Stage 1: Optimization in browser
      setStatus('optimizing')
      setStatusMessage(`Comprimiendo y convirtiendo a WebP (${formatFileSize(file.size)})...`)

      const optResult = await optimizeImageInBrowser(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      })

      setLastStats(optResult)

      // Stage 2: Upload to Supabase Storage
      setStatus('uploading')
      setStatusMessage(
        `Subiendo imagen WebP (${formatFileSize(optResult.optimizedSize)}) a Supabase...`
      )

      const publicUrl = await uploadProductImage(optResult.file)

      setStatus('success')
      setStatusMessage('¡Imagen optimizada y subida con éxito!')
      onImageUploaded(publicUrl)
      setDirectUrl(publicUrl)
    } catch (err: unknown) {
      setStatus('error')
      const msg = err instanceof Error ? err.message : 'Error al procesar o subir la imagen'
      setErrorMessage(msg)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    processAndUpload(file)
  }

  function handleRetry() {
    if (pendingFile) {
      processAndUpload(pendingFile)
    } else if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  function handleDirectUrlApply() {
    if (directUrl.trim()) {
      onImageUploaded(directUrl.trim())
      setStatus('idle')
      setErrorMessage(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            {label}
          </label>
          <p className="text-[11px] text-neutral-400 mt-0.5">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-gold-light hover:underline font-medium"
        >
          {showUrlInput ? 'Ocultar URL manual' : 'O ingresar URL'}
        </button>
      </div>

      {/* Main Upload Box */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
        {/* State: Processing (Optimizing / Uploading) */}
        {(status === 'optimizing' || status === 'uploading') && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <svg className="h-10 w-10 animate-spin text-gold" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-white block">
                {status === 'optimizing' ? '✦ Optimizando archivo...' : '✦ Subiendo al almacenamiento...'}
              </span>
              <p className="text-xs text-gold-light">{statusMessage}</p>
            </div>
            {/* Animated progress bar */}
            <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full bg-gold rounded-full transition-all duration-500 ${
                  status === 'optimizing' ? 'w-1/2 animate-pulse' : 'w-5/6 animate-pulse'
                }`}
              />
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">Error en la optimización</span>
              <p className="text-xs text-rose-300 mt-1 max-w-sm">{errorMessage}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
              >
                Reintentar subida
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle')
                  setErrorMessage(null)
                }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white"
              >
                Elegir otro archivo
              </button>
            </div>
          </div>
        )}

        {/* State: Idle or Success (Upload Zone & Preview) */}
        {status !== 'optimizing' && status !== 'uploading' && status !== 'error' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* File Drop / Select Trigger */}
              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-white/15 rounded-2xl bg-black/30 hover:border-gold/50 cursor-pointer transition-colors group">
                <svg className="h-7 w-7 text-neutral-400 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="mt-2 text-xs font-semibold text-white">
                  {currentImageUrl ? 'Cambiar fotografía' : 'Seleccionar foto desde tu dispositivo'}
                </span>
                <span className="text-[10px] text-neutral-500 mt-0.5">
                  Cualquier resolución • Se convertirá a WebP máx. 1200px
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Current Image Mini Thumbnail Preview */}
              {currentImageUrl && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-md">
                  <Image
                    src={currentImageUrl}
                    alt="Foto actual"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-bold text-emerald-400 border border-emerald-500/30">
                    ACTIVA
                  </span>
                </div>
              )}
            </div>

            {/* Optimization Savings Pill */}
            {lastStats && lastStats.isOptimized && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">✓ Optimización completada:</span>
                  <span>
                    {formatFileSize(lastStats.originalSize)} →{' '}
                    <strong className="text-white">{formatFileSize(lastStats.optimizedSize)}</strong>
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                  {lastStats.savingsPercent}% más liviana
                </span>
              </div>
            )}
          </div>
        )}

        {/* Manual URL Input (Collapsible) */}
        {showUrlInput && (
          <div className="pt-4 border-t border-white/[0.08] space-y-2 mt-4">
            <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
              URL directa de imagen externa
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={directUrl}
                onChange={(e) => setDirectUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                type="button"
                onClick={handleDirectUrlApply}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-neutral-200 hover:text-white hover:border-gold/40 transition-colors shrink-0"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
