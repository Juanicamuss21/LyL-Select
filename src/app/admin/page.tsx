import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { Perfume, Vaper } from '@/features/catalog/types'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [perfumesRes, vapersRes] = await Promise.all([
    supabase.from('perfumes').select('*').order('created_at', { ascending: false }),
    supabase.from('vapers').select('*').order('created_at', { ascending: false }),
  ])

  const perfumes: Perfume[] = perfumesRes.data || []
  const vapers: Vaper[] = vapersRes.data || []

  // Contadores requeridos
  const perfumesActivos = perfumes.filter((p) => p.disponible).length
  const vapersActivos = vapers.filter((v) => v.disponible).length

  // Productos marcados "agotado" en cualquiera de sus formatos
  const perfumesConAgotado = perfumes.filter(
    (p) =>
      !p.disponible ||
      !p.disponible_decant_5ml ||
      !p.disponible_decant_10ml ||
      !p.disponible_frasco_completo
  )
  const vapersAgotados = vapers.filter((v) => !v.disponible)
  const totalAgotados = perfumesConAgotado.length + vapersAgotados.length

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            Panel de Control
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-xs text-neutral-400">
            Resumen general del catálogo y accesos rápidos
          </p>
        </div>

        {/* Accesos Directos Requeridos */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/perfumes/nuevo"
            className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-black transition-all duration-300 hover:shadow-gold-glow hover:opacity-95 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Cargar Perfume</span>
          </Link>

          <Link
            href="/admin/vapers/nuevo"
            className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-bold text-gold-light transition-all duration-300 hover:border-gold hover:bg-gold/20 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Cargar Vaper</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Metric 1: Perfumes activos */}
        <Link
          href="/admin/perfumes"
          className="group rounded-2xl border border-white/[0.08] bg-dark-card p-5 transition-all duration-300 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Perfumes Activos
            </span>
            <span className="rounded-full bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-white group-hover:text-gold-light transition-colors">
              {perfumesActivos}
            </span>
            <span className="text-xs text-neutral-500">de {perfumes.length} en total</span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            Gestionar fragancias y formatos de decants →
          </p>
        </Link>

        {/* Metric 2: Vapers activos */}
        <Link
          href="/admin/vapers"
          className="group rounded-2xl border border-white/[0.08] bg-dark-card p-5 transition-all duration-300 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Vapers Activos
            </span>
            <span className="rounded-full bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-white group-hover:text-gold-light transition-colors">
              {vapersActivos}
            </span>
            <span className="text-xs text-neutral-500">de {vapers.length} en total</span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            Gestionar modelos, sabores y stock de pods →
          </p>
        </Link>

        {/* Metric 3: Productos con stock agotado */}
        <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-5">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Formatos Agotados
            </span>
            <span className="rounded-full bg-rose-500/10 p-2 text-rose-400 border border-rose-500/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-rose-400">
              {totalAgotados}
            </span>
            <span className="text-xs text-neutral-500">
              ({perfumesConAgotado.length} perfumes, {vapersAgotados.length} vapers)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            Productos con al menos un formato o stock en pausa
          </p>
        </div>
      </div>

      {/* Recent Perfumes & Quick Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-gold">✦</span>
            <span>Perfumes Recientes</span>
          </h2>
          <Link
            href="/admin/perfumes"
            className="text-xs text-gold-light hover:underline font-medium"
          >
            Ver catálogo completo ({perfumes.length}) →
          </Link>
        </div>

        <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-dark-card overflow-hidden">
          {perfumes.slice(0, 5).map((perfume) => (
            <div
              key={perfume.id}
              className="flex items-center justify-between p-3.5 sm:p-4 gap-3 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                  <Image
                    src={perfume.imagen_url || '/placeholder.png'}
                    alt={perfume.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gold-light font-medium uppercase tracking-wider">
                      {perfume.marca}
                    </span>
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        perfume.disponible ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate">{perfume.nombre}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                    <span>5ml: {perfume.disponible_decant_5ml ? '✓' : '✗'}</span>
                    <span>•</span>
                    <span>10ml: {perfume.disponible_decant_10ml ? '✓' : '✗'}</span>
                    <span>•</span>
                    <span>Frasco: {perfume.disponible_frasco_completo ? '✓' : '✗'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/perfumes/${perfume.id}/editar`}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-gold/40 hover:text-gold-light transition-all"
                >
                  Editar
                </Link>
                <Link
                  href={`/admin/perfumes/nuevo?duplicar=${perfume.id}`}
                  className="hidden sm:inline-block rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-all"
                  title="Duplicar perfume"
                >
                  Duplicar
                </Link>
              </div>
            </div>
          ))}

          {perfumes.length === 0 && (
            <div className="p-8 text-center text-xs text-neutral-500">
              No hay perfumes cargados todavía.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
