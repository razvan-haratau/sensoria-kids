/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#5BC4C0',
          light: '#7DD4D0',
          dark: '#3EA8A4',
        },
        pink: {
          brand: '#E86B9E',
          light: '#F08BB5',
          dark: '#D04D82',
        },
        purple: {
          brand: '#B07CC6',
          light: '#C49AD6',
          dark: '#8A5EAA',
        },
        peach: {
          DEFAULT: '#F4A68F',
          light: '#F8C0AD',
          dark: '#E08870',
        },
        brand: {
          bg: '#FFFFFF',
          text: '#2D2D2D',
          gray: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.08)',
        card: '0 2px 16px rgba(0,0,0,0.06)',
        hover: '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
