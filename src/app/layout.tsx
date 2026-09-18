import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LyL Select | Perfumería de Autor & Vapers',
  description: 'Descubrí fragancias nicho exclusivas en decants fraccionados, frascos sellados y vapers descartables seleccionados.',
  icons: {
    icon: '/favicon.ico',
  },
}

import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { FloatingCartButton } from '@/features/cart/components/FloatingCartButton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable} dark`}>
      <body className="min-h-screen bg-dark-bg text-neutral-200 antialiased">
        {children}
        <CartDrawer />
        <FloatingCartButton />
      </body>
    </html>
  )
}
