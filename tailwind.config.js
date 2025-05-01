/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['EB Garamond', 'serif'],
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      blue: {
        DEFAULT: '#0000FF',
        dark: '#000080',
      },
    },
  },
  safelist: [
    'text-black',
    'text-white',
    'text-blue',
    'text-blue-dark',
    'hover:text-blue-dark',
    'bg-white',
    'bg-black',
    'bg-blue',
    'border-black',
    'border-white',
    'border-gray-200',
  ],
  plugins: [],
}
