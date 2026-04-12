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
            DEFAULT: '#064E3B', 
            foreground: '#ffffff',
        },
        accent: '#E11D48',  // Tomato Red
        background: '#ffffff',
        foreground: '#0f172a', // slate-900
        muted: {
          DEFAULT: '#f8fafc', // slate-50
          foreground: '#64748b', // slate-500
        },
        secondary: {
          DEFAULT: '#ecfdf5', // emerald-50
          foreground: '#064e3b',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
