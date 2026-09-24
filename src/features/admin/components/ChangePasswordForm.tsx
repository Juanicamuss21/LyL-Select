'use client'

import { useState } from 'react'
import { updatePassword } from '@/actions/auth'

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const form = e.currentTarget
    const formData = new FormData(form)
    const result = await updatePassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      form.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <span>✓</span>
          <span>¡Contraseña actualizada con éxito!</span>
        </div>
      )}

      <div>
        <label
          htmlFor="new_password"
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
        >
          Nueva contraseña
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          required
          minLength={6}
          placeholder="Mínimo 6 caracteres"
          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <div>
        <label
          htmlFor="confirm_password"
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
        >
          Confirmar nueva contraseña
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={6}
          placeholder="Repetí la nueva contraseña"
          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-black transition-all duration-300 hover:shadow-gold-glow hover:opacity-95 active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Actualizando contraseña...' : 'Guardar Nueva Contraseña'}
      </button>
    </form>
  )
}
