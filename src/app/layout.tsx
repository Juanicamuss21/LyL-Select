import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
}

const siteTitle = 'LyL Select — Perfumería de Autor & Decants Exclusivos'
const siteDescription =
  'Perfumes de nicho fraccionados en decants de 5ml/10ml, frascos sellados originales y vapers descartables exclusivos. Envíos a toda Argentina con LyL Select.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lylselect.com'),
  title: {
    default: siteTitle,
    template: '%s — LyL Select',
  },
  description: siteDescription,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'LyL Select',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/logo-background.png',
        width: 736,
        height: 736,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/logo-background.png'],
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
