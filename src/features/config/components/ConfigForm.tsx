'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSiteConfigClient } from '@/features/config/services/config'
import { saveSiteConfigAction } from '@/features/config/actions/config'
import type { SiteConfigInput } from '@/features/config/types'

const WHATSAPP_REGEX = /^\+?[0-9]{10,15}$/

function validate(form: SiteConfigInput): Record<string, string> {
  const errors: Record<string, string> = {}

  const cleaned = form.whatsapp_number.replace(/\s+/g, '')
  if (!cleaned) {
    errors.whatsapp_number = 'El número de WhatsApp es obligatorio.'
  } else if (!WHATSAPP_REGEX.test(cleaned)) {
    errors.whatsapp_number =
      'Ingresá un número válido (ej: 5493854353077 o +5493854353077, sin espacios).'
  }

  if (!form.instagram_url.trim()) {
    errors.instagram_url = 'El link de Instagram es obligatorio.'
  } else if (
    !form.instagram_url.trim().startsWith('http://') &&
    !form.instagram_url.trim().startsWith('https://')
  ) {
    errors.instagram_url = 'Ingresá una URL válida (comenzando con https://).'
  }

  if (form.tiktok_url && form.tiktok_url.trim()) {
    if (
      !form.tiktok_url.trim().startsWith('http://') &&
      !form.tiktok_url.trim().startsWith('https://')
    ) {
      errors.tiktok_url = 'Ingresá una URL válida (comenzando con https://).'
    }
  }

  if (form.facebook_url && form.facebook_url.trim()) {
    if (
      !form.facebook_url.trim().startsWith('http://') &&
      !form.facebook_url.trim().startsWith('https://')
    ) {
      errors.facebook_url = 'Ingresá una URL válida (comenzando con https://).'
    }
  }

  return errors
}

const DEFAULT_FORM: SiteConfigInput = {
  whatsapp_number: '',
  whatsapp_greeting: 'Hola LyL Select! 👋 Estuve viendo su catálogo web y me gustaría consultar.',
  instagram_url: '',
  tiktok_url: '',
  facebook_url: '',
  trust_envios: '',
  trust_medios_pago: '',
  trust_garantia: '',
}

export function ConfigForm() {
  const router = useRouter()
  const [form, setForm] = useState<SiteConfigInput>(DEFAULT_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    getSiteConfigClient().then((config) => {
      if (config) {
        setForm({
          whatsapp_number: config.whatsapp_number || '',
          whatsapp_greeting: config.whatsapp_greeting || DEFAULT_FORM.whatsapp_greeting,
          instagram_url: config.instagram_url || '',
          tiktok_url: config.tiktok_url || '',
          facebook_url: config.facebook_url || '',
          trust_envios: config.trust_envios || '',
          trust_medios_pago: config.trust_medios_pago || '',
          trust_garantia: config.trust_garantia || '',
        })
      }
      setLoading(false)
    })
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    setSaved(false)
    setSaveError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSaving(true)
    setSaveError(null)

    const payload: SiteConfigInput = {
      ...form,
      whatsapp_number: form.whatsapp_number.replace(/\s+/g, ''),
      tiktok_url: form.tiktok_url?.trim() || null,
      facebook_url: form.facebook_url?.trim() || null,
    }

    const result = await saveSiteConfigAction(payload)
    setSaving(false)

    if (result.success) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3500)
    } else {
      setSaveError(result.error || 'Error al guardar los datos. Intentá de nuevo.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── SECCIÓN 1: WHATSAPP ──────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/[0.08] bg-dark-card p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
            </svg>
          </span>
          <div>
            <h2 className="font-serif text-base font-bold text-white">WhatsApp</h2>
            <p className="text-[11px] text-neutral-400">Número para recibir pedidos y consultas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-200">
              Número de WhatsApp <span className="text-rose-400">*</span>
            </label>
            <input
              id="config-whatsapp-number"
              name="whatsapp_number"
              type="text"
              value={form.whatsapp_number}
              onChange={handleChange}
              placeholder="Ej: 5493854353077"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-dark-bg text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 transition-all ${
                errors.whatsapp_number
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-white/[0.08] focus:border-gold/40 focus:ring-gold/20'
              }`}
            />
            {errors.whatsapp_number && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.whatsapp_number}</p>
            )}
            <p className="mt-1 text-[11px] text-neutral-500">
              Código de país + área + número, sin espacios ni guiones.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-200">
              Mensaje de saludo/prefijo
            </label>
            <input
              id="config-whatsapp-greeting"
              name="whatsapp_greeting"
              type="text"
              value={form.whatsapp_greeting}
              onChange={handleChange}
              placeholder="Hola LyL Select! 👋 Consulta desde el sitio web."
              className="w-full rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm bg-dark-bg text-white placeholder:text-neutral-600 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/20 transition-all"
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              Texto que antecede a cada mensaje enviado desde el sitio.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2: REDES SOCIALES ────────────────────────────────── */}
      <section className="rounded-2xl border border-white/[0.08] bg-dark-card p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-400">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </span>
          <div>
            <h2 className="font-serif text-base font-bold text-white">Redes Sociales</h2>
            <p className="text-[11px] text-neutral-400">Links de tus perfiles en redes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-200">
              Instagram <span className="text-rose-400">*</span>
            </label>
            <input
              id="config-instagram-url"
              name="instagram_url"
              type="url"
              value={form.instagram_url}
              onChange={handleChange}
              placeholder="https://instagram.com/lylselect"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-dark-bg text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 transition-all ${
                errors.instagram_url
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-white/[0.08] focus:border-gold/40 focus:ring-gold/20'
              }`}
            />
            {errors.instagram_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.instagram_url}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-200">
              TikTok{' '}
              <span className="ml-1 rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-neutral-500">
                opcional
              </span>
            </label>
            <input
              id="config-tiktok-url"
              name="tiktok_url"
              type="url"
              value={form.tiktok_url || ''}
              onChange={handleChange}
              placeholder="https://tiktok.com/@lylselect"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-dark-bg text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 transition-all ${
                errors.tiktok_url
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-white/[0.08] focus:border-gold/40 focus:ring-gold/20'
              }`}
            />
            {errors.tiktok_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.tiktok_url}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-200">
              Facebook{' '}
              <span className="ml-1 rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-neutral-500">
                opcional
              </span>
            </label>
            <input
              id="config-facebook-url"
              name="facebook_url"
              type="url"
              value={form.facebook_url || ''}
              onChange={handleChange}
              placeholder="https://facebook.com/lylselect"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-dark-bg text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 transition-all ${
                errors.facebook_url
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-white/[0.08] focus:border-gold/40 focus:ring-gold/20'
              }`}
            />
            {errors.facebook_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.facebook_url}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3: BLOQUE DE CONFIANZA ───────────────────────────── */}
      <section className="rounded-2xl border border-white/[0.08] bg-dark-card p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </span>
          <div>
            <h2 className="font-serif text-base font-bold text-white">Bloque de Confianza</h2>
            <p className="text-[11px] text-neutral-400">
              Texto que aparece en el footer y ficha de producto para generar confianza
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-200">
              ✈️ Envíos
            </label>
            <textarea
              id="config-trust-envios"
              name="trust_envios"
              rows={3}
              value={form.trust_envios}
              onChange={handleChange}
              placeholder="Ej: Enviamos a todo el país por Correo Argentino y OCA. Entregas en 2-5 días hábiles. Retiro en mano disponible en Santiago del Estero capital."
              className="w-full resize-none rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm bg-dark-bg text-white placeholder:text-neutral-600 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-200">
              💳 Medios de pago
            </label>
            <textarea
              id="config-trust-medios-pago"
              name="trust_medios_pago"
              rows={3}
              value={form.trust_medios_pago}
              onChange={handleChange}
              placeholder="Ej: Transferencia bancaria, Mercado Pago (crédito/débito sin recargo), efectivo y billeteras virtuales (Ualá, Modo)."
              className="w-full resize-none rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm bg-dark-bg text-white placeholder:text-neutral-600 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-200">
              🛡️ Garantía y cambios
            </label>
            <textarea
              id="config-trust-garantia"
              name="trust_garantia"
              rows={3}
              value={form.trust_garantia}
              onChange={handleChange}
              placeholder="Ej: Garantizamos la autenticidad de todos los productos. Ante cualquier problema con el pedido, te lo resolvemos en 48hs por WhatsApp."
              className="w-full resize-none rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm bg-dark-bg text-white placeholder:text-neutral-600 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── ESTADO Y BOTÓN DE GUARDADO ───────────────────────────────── */}
      <div className="flex flex-col items-end gap-3">
        {saveError && (
          <p className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-400">
            {saveError}
          </p>
        )}
        {saved && (
          <p className="flex w-full items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-400">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Configuración guardada correctamente. El sitio público se actualizará en los próximos minutos.
          </p>
        )}
        <button
          id="config-save-btn"
          type="submit"
          disabled={saving}
          className="flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-black shadow-gold-glow transition-all duration-300 hover:opacity-90 hover:shadow-gold-glow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Guardando…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Guardar configuración
            </>
          )}
        </button>
      </div>
    </form>
  )
}
