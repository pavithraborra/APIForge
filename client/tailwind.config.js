/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E78F81',
          light: '#F6B89E',
          dark: '#D4776A',
          50: '#FFF5F3',
          100: '#FFE8E3',
          200: '#FFD0C7',
          300: '#F6B89E',
          400: '#E78F81',
          500: '#D4776A',
          600: '#C06054',
          700: '#A34A3F',
          800: '#86352B',
          900: '#6A2118',
        },
        secondary: {
          DEFAULT: '#F6B89E',
          light: '#FFD8BE',
          dark: '#E8A188',
        },
        accent: {
          1: '#FFD8BE',
          2: '#F7D9C4',
          3: '#FFE8D6',
        },
        highlight: '#F5E6CC',
        surface: {
          DEFAULT: '#FFF8F3',
          secondary: '#FFF2EA',
          card: '#FFFFFF',
          hover: '#FFF1E8',
        },
        border: {
          DEFAULT: '#F1D6C8',
          light: '#F7E4DA',
        },
        success: {
          DEFAULT: '#88C9A1',
          light: '#A8DDB8',
          dark: '#6BAF87',
        },
        warning: {
          DEFAULT: '#F2B880',
          light: '#F7CE9E',
          dark: '#E5A060',
        },
        danger: {
          DEFAULT: '#E97A7A',
          light: '#F09A9A',
          dark: '#D45A5A',
        },
        text: {
          primary: '#2F2A28',
          secondary: '#706864',
          muted: '#A0958D',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(47, 42, 40, 0.04), 0 1px 2px -1px rgba(47, 42, 40, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(47, 42, 40, 0.08), 0 2px 4px -2px rgba(47, 42, 40, 0.04)',
        'dropdown': '0 10px 25px -5px rgba(47, 42, 40, 0.1), 0 8px 10px -6px rgba(47, 42, 40, 0.04)',
        'modal': '0 25px 50px -12px rgba(47, 42, 40, 0.15)',
        'glow': '0 0 20px rgba(231, 143, 129, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'counter': 'counter 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
    },
  },
  plugins: [],
};
