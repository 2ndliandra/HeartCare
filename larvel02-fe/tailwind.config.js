/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          DEFAULT: '#059669',
          foreground: '#ffffff',
        },
        accent: {
          purple: '#9333EA',
          amber: '#D97706',
          blue: '#2563EB',
          DEFAULT: '#E11D48',
        },
        background: '#ffffff',
        foreground: '#0f172a',
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        secondary: {
          DEFAULT: '#F8FAFC',
          foreground: '#0F172A',
        },
        border: {
          DEFAULT: '#E2E8F0',
          focus: '#059669',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'base': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      borderRadius: {
        'sm': '6px',
        'base': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
