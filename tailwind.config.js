/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f4',
          100: '#fbe6ea',
          200: '#f7cfd7',
          300: '#f1a9b7',
          400: '#e7738d',
          500: '#dc4367',
          600: '#c5274d',
          700: '#9b1135',
          800: '#7e102d',
          900: '#5a0c20',
          950: '#3a0513',
        },
        turmeric: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        leaf: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          light: '#FCFBF8',
          card: '#FFFFFF',
          dark: '#F0EBE1',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#AA820A',
          muted: '#C5A059',
        },
        charcoal: {
          DEFAULT: '#1C1917',
          muted: '#44403C',
          light: '#78716C',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', '"Mukta Malar"', 'sans-serif'],
      },
      boxShadow: {
        'traditional': '0 10px 30px -5px rgba(90, 12, 32, 0.08), 0 4px 6px -2px rgba(90, 12, 32, 0.04)',
        'traditional-lg': '0 20px 40px -10px rgba(90, 12, 32, 0.14), 0 8px 12px -4px rgba(90, 12, 32, 0.08)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
