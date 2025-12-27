/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif TC"', 'serif'],
        sans: ['"Noto Serif TC"', 'serif'], // 強制將 sans 也設為襯線體，保持風格統一
      },
      colors: {
        taoist: {
          yellow: '#fbbf24', // 道教黃
          red: '#dc2626',    // 硃砂紅
          dark: '#0f172a',   // 玄色
        }
      }
    },
  },
  plugins: [],
}

