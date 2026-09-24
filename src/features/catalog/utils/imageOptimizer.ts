export interface OptimizeImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  skipThresholdBytes?: number
}

export interface OptimizationResult {
  file: File
  originalSize: number
  optimizedSize: number
  width: number
  height: number
  savingsPercent: number
  originalFormat: string
  isOptimized: boolean
}

/**
 * Formats byte size into human-readable string (KB, MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Compresses and optimizes an image file directly in the browser:
 * - Resizes to max width/height (1200px) keeping aspect ratio.
 * - Converts to WebP format with ~80% quality.
 * - Significantly reduces file weight before uploading to Supabase Storage.
 */
export async function optimizeImageInBrowser(
  file: File,
  options?: OptimizeImageOptions
): Promise<OptimizationResult> {
  const maxWidth = options?.maxWidth ?? 1200
  const maxHeight = options?.maxHeight ?? 1200
  const quality = options?.quality ?? 0.8
  const skipThreshold = options?.skipThresholdBytes ?? 200 * 1024 // 200 KB

  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen válida (JPG, PNG, WebP).')
  }

  // Load image element
  const objectUrl = URL.createObjectURL(file)

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('No se pudo decodificar el archivo de imagen.'))
      image.src = objectUrl
    })

    const originalWidth = img.naturalWidth || img.width
    const originalHeight = img.naturalHeight || img.height

    // If file is already webp, under 200KB, and already within bounds, skip conversion
    if (
      file.type === 'image/webp' &&
      file.size <= skipThreshold &&
      originalWidth <= maxWidth &&
      originalHeight <= maxHeight
    ) {
      return {
        file,
        originalSize: file.size,
        optimizedSize: file.size,
        width: originalWidth,
        height: originalHeight,
        savingsPercent: 0,
        originalFormat: file.type,
        isOptimized: false,
      }
    }

    // Calculate aspect-ratio preserved dimensions
    let newWidth = originalWidth
    let newHeight = originalHeight

    if (originalWidth > maxWidth || originalHeight > maxHeight) {
      const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight)
      newWidth = Math.max(1, Math.round(originalWidth * ratio))
      newHeight = Math.max(1, Math.round(originalHeight * ratio))
    }

    // Draw to in-memory canvas
    const canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('No se pudo inicializar el procesador de imágenes del navegador.')
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, newWidth, newHeight)

    // Export to WebP blob
    let blob: Blob | null = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality)
    })

    // Fallback to JPEG if WebP export is unavailable
    let finalFormat = 'image/webp'
    let finalExt = 'webp'

    if (!blob) {
      finalFormat = 'image/jpeg'
      finalExt = 'jpg'
      blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality)
      })
    }

    if (!blob) {
      throw new Error('No se pudo generar el archivo comprimido.')
    }

    // If compressed blob is somehow heavier than original (rare, e.g. very small file), keep original
    if (blob.size >= file.size && file.type === 'image/webp') {
      return {
        file,
        originalSize: file.size,
        optimizedSize: file.size,
        width: originalWidth,
        height: originalHeight,
        savingsPercent: 0,
        originalFormat: file.type,
        isOptimized: false,
      }
    }

    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_')
    const optimizedFile = new File([blob], `${sanitizedBase}.${finalExt}`, {
      type: finalFormat,
      lastModified: Date.now(),
    })

    const savingsPercent =
      file.size > optimizedFile.size
        ? Math.round(((file.size - optimizedFile.size) / file.size) * 100)
        : 0

    return {
      file: optimizedFile,
      originalSize: file.size,
      optimizedSize: optimizedFile.size,
      width: newWidth,
      height: newHeight,
      savingsPercent,
      originalFormat: file.type,
      isOptimized: true,
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
