import Link from 'next/link'

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
          Ajustes generales de la tienda y opciones de contacto
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-dark-card p-12 text-center shadow-xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold mb-4">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83M3 3l18 18M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-bold text-white">Próximamente</h3>
        <p className="mt-2 max-w-sm text-xs text-neutral-400">
          Esta sección será implementada en la <strong>Fase 3C</strong> (gestión de teléfonos de WhatsApp, datos de contacto, enlaces y parámetros globales).
        </p>
        <Link
          href="/admin"
          className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}
