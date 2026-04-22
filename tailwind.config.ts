import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dc2626',
          'red-dark': '#991b1b',
          'red-light': '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-red': 'pulse-red 1s ease-in-out infinite',
        'timer-shrink': 'timer-shrink linear forwards',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(220,38,38,0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
