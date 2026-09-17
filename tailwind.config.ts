import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A227',
          light: '#F0D580',
          mid: '#E5C368',
          dark: '#9A7B1C',
        },
        dark: {
          bg: '#0A0A0A',
          surface: '#121212',
          card: '#181818',
          cardHover: '#222222',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(201, 162, 39, 0.18)',
        'gold-glow-lg': '0 0 40px rgba(201, 162, 39, 0.28)',
      },
    },
  },
  plugins: [],
}

export default config
