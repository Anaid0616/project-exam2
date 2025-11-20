/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: '#F5EFE7',
        shell: '#FFFFFF',
        ink: '#0F172A',
        border: '#D9D9D9',
        ring: '#0E7490',
        card: '#FFFFFF',
        aegean: '#0E7490',
        lagoon: '#3BBAD6',
        coral: '#FFA284',
        sunset: '#C13033',
      },
      borderRadius: {
        app: '15px',
      },
      boxShadow: {
        elev: '0 2px 2px 0 rgba(0,0,0,0.10)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
