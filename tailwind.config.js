/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Semantic tokens — driven by CSS variables so light/dark "just work".
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        // Brand: glacier teal/blue (the "Igloo" ice vibe)
        brand: {
          50: '#eef9fb',
          100: '#d4f0f5',
          200: '#ade0ec',
          300: '#76c8dd',
          400: '#39a7c5',
          500: '#1f88a8',
          600: '#1b6d8d',
          700: '#1c5872',
          800: '#1f495e',
          900: '#1e3d50',
          950: '#0f2735',
        },
        // Accent: warm amber, for highlights / CTAs
        accent: {
          50: '#fff8eb',
          100: '#ffeec6',
          200: '#ffda88',
          300: '#ffc14a',
          400: '#ffab20',
          500: '#f98a07',
          600: '#dd6502',
          700: '#b74506',
          800: '#94360c',
          900: '#7a2e0d',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.12)',
        glow: '0 0 0 1px rgb(var(--brand-glow) / 0.4), 0 8px 30px -8px rgb(var(--brand-glow) / 0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
