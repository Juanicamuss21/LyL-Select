import Link from 'next/link'
import Image from 'next/image'
import { getSiteConfig } from '@/features/config/services/config.server'
import { buildWhatsAppLink } from '@/features/catalog/utils/whatsapp'

interface SiteFooterProps {
  /** Texto base del mensaje de WhatsApp (se usa el de la config si no se pasa). */
  waMessage?: string
}

export async function SiteFooter({ waMessage }: SiteFooterProps) {
  const config = await getSiteConfig()

  const waNumber = config?.whatsapp_number || '5493854353077'
  const greeting = config?.whatsapp_greeting || 'Hola LyL Select! 👋 Consulta desde el sitio web.'
  const waUrl = buildWhatsAppLink(waMessage ?? greeting)

  const instagramUrl = config?.instagram_url || null
  const tiktokUrl = config?.tiktok_url || null
  const facebookUrl = config?.facebook_url || null

  const hasTrustBlock =
    config?.trust_envios || config?.trust_medios_pago || config?.trust_garantia

  return (
    <footer className="border-t border-white/[0.08] bg-black py-12 text-center text-xs text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo.png"
              alt="LyL Select"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />
          </Link>
        </div>

        <p className="max-w-md mx-auto text-neutral-400">
          Perfumería de autor, decants seleccionados y vapers importados. Calidad garantizada en
          cada atomización.
        </p>

        {/* Trust Block — se muestra sólo si hay contenido cargado */}
        {hasTrustBlock && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            {config?.trust_envios && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mb-1 text-xs font-semibold text-gold-light">✈️ Envíos</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {config.trust_envios}
                </p>
              </div>
            )}
            {config?.trust_medios_pago && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mb-1 text-xs font-semibold text-gold-light">💳 Medios de pago</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {config.trust_medios_pago}
                </p>
              </div>
            )}
            {config?.trust_garantia && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mb-1 text-xs font-semibold text-gold-light">🛡️ Garantía y cambios</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {config.trust_garantia}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gold-light hover:underline font-semibold"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.41 1.25-1.95 1.33-.51.08-1.17.11-3.79-.97-2.31-.95-3.8-3.32-3.92-3.47-.11-.16-.95-1.27-.95-2.42s.6-1.72.82-1.95c.21-.24.47-.3.63-.3.16 0 .32.01.45.02.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.53-.12.21.08 1.34.63 1.57.75.23.11.38.18.44.27.06.11.06.61-.18 1.29z" />
            </svg>
            WhatsApp (+{waNumber})
          </a>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-pink-400 hover:underline font-medium"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
          )}

          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:underline font-medium"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.8 1.54V6.8a4.85 4.85 0 01-1.03-.11z" />
              </svg>
              TikTok
            </a>
          )}

          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:underline font-medium"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
          )}

          <span className="text-neutral-700">|</span>

          <Link href="/vapers" className="hover:text-white transition-colors">
            Línea Vapers
          </Link>
        </div>

        <div className="pt-4 text-[11px] text-neutral-500 border-t border-white/[0.04]">
          © {new Date().getFullYear()} LyL Select. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
