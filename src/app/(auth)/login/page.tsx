import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LoginForm } from '@/features/auth/components'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/[0.08] bg-dark-card/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="LyL Select"
              width={72}
              height={72}
              className="mx-auto h-16 w-16 object-contain"
            />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
              Panel de Administración
            </span>
            <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
              Iniciar Sesión
            </h1>
          </div>
          <p className="text-xs text-neutral-400">
            Ingresá tus credenciales para gestionar el catálogo
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-neutral-500 py-6">Cargando formulario...</div>}>
          <LoginForm />
        </Suspense>

        <div className="pt-2 text-center text-xs text-neutral-500 border-t border-white/[0.06]">
          <Link href="/" className="text-neutral-400 hover:text-gold-light transition-colors">
            ← Volver a la tienda pública
          </Link>
        </div>
      </div>
    </div>
  )
}
