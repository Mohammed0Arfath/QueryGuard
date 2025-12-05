/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0b1020',
        'cyber-darker': '#050811',
        'cyber-teal': '#00e5c4',
        'cyber-magenta': '#ff2d95',
        'cyber-purple': '#8b5cf6',
        'cyber-blue': '#3b82f6',
        'cyber-gray': '#1e293b',
        'cyber-light': '#64748b',
      },
      fontFamily: {
        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00e5c4' },
          '100%': { boxShadow: '0 0 20px #00e5c4, 0 0 30px #00e5c4' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}