/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#0b1020', panel: '#121a2f', accent: '#6d5dfc', mint: '#46e3b7' },
    boxShadow: { glow: '0 12px 45px rgba(109,93,252,.22)' }
  }},
  plugins: []
};
