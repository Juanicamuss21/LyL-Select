import { createClient } from '@/lib/supabase/server'
import { ChangePasswordForm } from '@/features/admin/components/ChangePasswordForm'
import { signout } from '@/actions/auth'

export const dynamic = 'force-dynamic'

export default async function AdminCuentaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
          Panel de Control
        </span>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
          Mi Cuenta
        </h1>
        <p className="text-xs text-neutral-400">
          Gestioná la seguridad y el acceso de tu usuario administrador
        </p>
      </div>

      {/* User Information Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-6 space-y-4">
        <h2 className="font-serif text-base font-semibold text-white flex items-center gap-2">
          <span className="text-gold">✦</span>
          <span>Información de Acceso</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3.5">
            <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">
              Correo Electrónico
            </span>
            <span className="font-semibold text-white mt-1 block">
              {user?.email || 'admin@lylselect.com'}
            </span>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-black/40 p-3.5">
            <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">
              Rol de Usuario
            </span>
            <span className="font-semibold text-gold-light mt-1 block">
              Administrador Principal
            </span>
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-6 space-y-4">
        <div>
          <h2 className="font-serif text-base font-semibold text-white flex items-center gap-2">
            <span className="text-gold">✦</span>
            <span>Cambio de Contraseña</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Ingresá tu nueva clave para mantener la seguridad de tu panel
          </p>
        </div>

        <ChangePasswordForm />
      </div>

      {/* Session Management Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white text-sm">Cerrar Sesión Activa</h3>
          <p className="text-xs text-neutral-400">
            Finaliza la sesión actual de forma segura en este dispositivo
          </p>
        </div>

        <form action={signout}>
          <button
            type="submit"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}
