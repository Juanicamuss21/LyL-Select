import { ConfigForm } from '@/features/config/components/ConfigForm'

export const dynamic = 'force-dynamic'

export default function AdminConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
          Panel de Control
        </span>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
          Configuración
        </h1>
        <p className="text-xs text-neutral-400">
          Ajustes generales de la tienda: contacto, redes sociales y mensajes de confianza para el
          sitio público.
        </p>
      </div>

      <ConfigForm />
    </div>
  )
}
